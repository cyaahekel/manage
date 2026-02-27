import { NextRequest, NextResponse } from 'next/server'

const __bot_url       = process.env.NEXT_PUBLIC_BOT_URL || 'https://atomicbot-production.up.railway.app'
const __cache_ttl_ms  = 5 * 60 * 1000

// - ROLE CONSTANTS - \\
const __role_supporter = '1357767950421065981'
const __role_staff     = '1264915024707588208'

interface discord_member {
  id        : string
  username  : string
  avatar_url: string
}

interface cache_entry {
  supporters : discord_member[]
  staff      : discord_member[]
  expires_at : number
}

let __cache: cache_entry | null = null

/**
 * Calls the bot's /api/role-members/:role_id endpoint.
 *
 * @param role_id - Discord role snowflake
 * @returns Array of members
 */
async function fetch_role_from_bot(role_id: string): Promise<discord_member[]> {
  const controller = new AbortController()
  const timeout_id = setTimeout(() => controller.abort(), 20000)

  try {
    const res = await fetch(`${__bot_url}/api/role-members/${role_id}`, {
      signal: controller.signal,
    })

    clearTimeout(timeout_id)

    if (!res.ok) {
      console.error(`[ - ROLE MEMBERS - ] Bot API error for role ${role_id}: ${res.status}`)
      return []
    }

    const data = await res.json()
    return Array.isArray(data.members) ? data.members : []
  } catch (err) {
    clearTimeout(timeout_id)
    console.error(`[ - ROLE MEMBERS - ] Failed to fetch role ${role_id}:`, err)
    return []
  }
}

/**
 * @route GET /api/discord-role-members
 * @description Returns guild members by supporter/staff role via bot API. Cached 5 min.
 * @returns JSON { supporters: discord_member[]; staff: discord_member[] }
 */
export async function GET(req: NextRequest) {
  const refresh = req.nextUrl.searchParams.get('refresh') === '1'

  if (!refresh && __cache && Date.now() < __cache.expires_at) {
    return NextResponse.json(
      { supporters: __cache.supporters, staff: __cache.staff },
      { headers: { 'X-Cache': 'HIT' } },
    )
  }

  try {
    // - FETCH SEQUENTIALLY TO AVOID RACING guild.members.fetch() ON THE BOT - \\
    const supporters = await fetch_role_from_bot(__role_supporter)
    const staff      = await fetch_role_from_bot(__role_staff)

    // - ONLY CACHE WHEN BOTH RETURNED DATA (AVOID CACHING PARTIAL FAILURES) - \\
    if (supporters.length > 0 || staff.length > 0) {
      __cache = { supporters, staff, expires_at: Date.now() + __cache_ttl_ms }
    }

    return NextResponse.json({ supporters, staff }, {
      headers: { 'Cache-Control': 'public, max-age=300' },
    })
  } catch (error) {
    console.error('[ - ROLE MEMBERS - ] Failed to fetch members:', error)
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 })
  }
}
