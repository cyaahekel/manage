const __manage_guild_bit = BigInt(0x20)
const __admin_bit        = BigInt(0x8)

// - IN-MEMORY CACHE: key = `${token}:${guild_id}`, ttl = 30s - \\
const __cache = new Map<string, { result: boolean; expires: number }>()

/**
 * Verify that the Discord user (identified by access_token) has ManageGuild
 * in the specified guild. Results are cached for 30 seconds to avoid
 * hitting Discord rate limits when multiple routes are called simultaneously.
 *
 * @param access_token - Discord OAuth2 access token from cookie
 * @param guild_id     - Target guild ID
 * @returns Whether the user has ManageGuild (or Administrator) permission
 */
export async function verify_manage_guild(
  access_token : string,
  guild_id     : string
): Promise<boolean> {
  const key     = `${access_token}:${guild_id}`
  const cached  = __cache.get(key)
  const now     = Date.now()

  if (cached && cached.expires > now) return cached.result

  // - evict expired entries periodically - \\
  if (__cache.size > 500) {
    for (const [k, v] of __cache) {
      if (v.expires <= now) __cache.delete(k)
    }
  }

  try {
    const response = await fetch('https://discord.com/api/users/@me/guilds', {
      headers : { Authorization: `Bearer ${access_token}` },
      cache   : 'no-store',
    })

    if (response.status === 429) {
      // - rate limited: give benefit of the doubt for 5s - \\
      console.warn('[ - AUTH - ] Discord rate limited on /users/@me/guilds')
      __cache.set(key, { result: true, expires: now + 5_000 })
      return true
    }

    if (!response.ok) {
      console.error('[ - AUTH - ] Discord guilds error:', response.status)
      __cache.set(key, { result: false, expires: now + 10_000 })
      return false
    }

    const guilds: Array<{ id: string; permissions: string }> = await response.json()
    const guild = guilds.find(g => g.id === guild_id)

    if (!guild) {
      __cache.set(key, { result: false, expires: now + 30_000 })
      return false
    }

    const perms  = BigInt(guild.permissions)
    const result = (perms & __manage_guild_bit) !== BigInt(0)
                || (perms & __admin_bit) !== BigInt(0)

    __cache.set(key, { result, expires: now + 30_000 })
    return result
  } catch (err) {
    console.error('[ - AUTH - ] verify_manage_guild error:', err)
    return false
  }
}
