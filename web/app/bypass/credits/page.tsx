/*
 * Atomicals Bot for Discord
 * Copyright (C) 2026 Atomicals LancarJaya
 *
 * Licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
 * You may not use this file except in compliance with the License.
 * See the LICENSE file for more information.
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import Image                                from 'next/image'
import dynamic                              from 'next/dynamic'
import { motion, AnimatePresence }          from 'framer-motion'
import { IconBrandGithub, IconBrandDiscord, IconX, IconCalendar, IconCrown } from '@tabler/icons-react'
import { Dialog, DialogPanel, DialogClose } from '@/components/animate-ui/components/headless/dialog'
import { BypassTopbar }                     from '@/components/layout/bypass_topbar'
import { cn }                               from '@/lib/utils'

// - LAZY LOAD LIGHTRAYS - \\
const LightRays = dynamic(() => import('@/components/animations/light_rays'), { ssr: false })

const __credits = [
  {
    role        : 'Developer',
    name        : 'Kim7',
    handle      : 'v32encrypt',
    discord_id  : '1118453649727823974',
    initials    : 'K7',
    description : 'Built and maintains Atomic Bypass',
    links       : [
      { icon: 'github',  label: 'GitHub',  href: 'https://github.com/bimoraa' },
      { icon: 'discord', label: 'Discord', href: 'https://discord.com/users/1118453649727823974' },
    ],
  },
  {
    role        : 'Developer',
    name        : 'LendowskyDF',
    handle      : 'lendowsky',
    discord_id  : '713377329623072822',
    initials    : 'LD',
    description : 'Co-developer',
    links       : [
      { icon: 'discord', label: 'Discord', href: 'https://discord.com/users/713377329623072822' },
    ],
  },
]

const __stack = [
  { label: 'Discord.js',  href: 'https://discord.js.org' },
  { label: 'Next.js',     href: 'https://nextjs.org' },
  { label: 'TypeScript',  href: 'https://www.typescriptlang.org' },
  { label: 'PostgreSQL',  href: 'https://www.postgresql.org' },
  { label: 'Railway',     href: 'https://railway.app' },
]

const __tab_items = [
  { label: 'Developer', value: 'developer' },
  { label: 'Supporter', value: 'supporter' },
  { label: 'Staff',     value: 'staff' },
]

// - TYPES - \\
interface role_member {
  id         : string
  username   : string
  global_name: string | null
  avatar_url : string
}

interface discord_role {
  id      : string
  name    : string
  color   : string
  icon    : string | null
  position: number
}

interface member_detail {
  id           : string
  username     : string
  display_name : string
  nickname     : string | null
  avatar       : string
  banner       : string | null
  roles        : discord_role[]
  joined_at    : number | null
  created_at   : number | null
  premium_since: number | null
}

// - UTILITY - \\
function fmt_date(ts: number | null): string {
  if (!ts) return '—'
  return new Date(ts).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

// - COMPONENTS - \\
function CreditLink({ icon, label, href }: { icon: string; label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      {icon === 'github'  && <IconBrandGithub  size={14} />}
      {icon === 'discord' && <IconBrandDiscord size={14} />}
      {label}
    </a>
  )
}

// - discord profile dialog - \\
function ProfileDialog({ member_id, on_close }: { member_id: string | null; on_close: () => void }) {
  const [data,    set_data]    = useState<member_detail | null>(null)
  const [loading, set_loading] = useState(false)
  const [error,   set_error]   = useState(false)

  useEffect(() => {
    if (!member_id) return
    set_data(null)
    set_loading(true)
    set_error(false)

    fetch(`/api/discord-member/${member_id}`)
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`)
        return r.json()
      })
      .then((d) => { set_data(d); set_loading(false) })
      .catch(() => { set_error(true); set_loading(false) })
  }, [member_id])

  return (
    <Dialog open={!!member_id} onClose={on_close}>
      <DialogPanel
        className="p-0 gap-0 sm:max-w-sm overflow-hidden rounded-2xl flex flex-col max-h-[85svh]"
        showCloseButton={false}
      >
        {/* - banner + avatar - \\ */}
        <div className="relative h-28 w-full shrink-0 bg-muted/60">
          {data?.banner && (
            <Image src={data.banner} alt="banner" fill className="object-cover" unoptimized />
          )}
          {!data?.banner && loading && (
            <div className="absolute inset-0 animate-pulse bg-muted" />
          )}
          <DialogClose className="absolute top-3 right-3 rounded-lg bg-background/70 p-1.5 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-background hover:text-foreground">
            <IconX size={14} />
          </DialogClose>
          <div className="absolute -bottom-8 left-5">
            <div className="relative h-16 w-16 overflow-hidden rounded-2xl border-4 border-background bg-muted shadow-md">
              {data?.avatar && (
                <Image src={data.avatar} alt={data.display_name} fill className="object-cover" unoptimized />
              )}
              {loading && <div className="absolute inset-0 animate-pulse bg-muted" />}
            </div>
          </div>
        </div>

        {/* - fixed: name + dates - \\ */}
        <div className="shrink-0 px-5 pt-12 pb-4">
          {loading && (
            <div className="space-y-3">
              <div className="h-5 w-36 animate-pulse rounded bg-muted" />
              <div className="h-3 w-24 animate-pulse rounded bg-muted" />
              <div className="mt-5 space-y-2.5">
                <div className="h-3 w-48 animate-pulse rounded bg-muted" />
                <div className="h-3 w-40 animate-pulse rounded bg-muted" />
              </div>
            </div>
          )}

          {error && !loading && (
            <p className="py-6 text-center text-sm text-muted-foreground">Unable to load profile.</p>
          )}

          {data && !loading && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-foreground">{data.display_name}</h2>
                <p className="text-sm text-muted-foreground">@{data.username}</p>
                {data.nickname && data.nickname !== data.display_name && (
                  <p className="mt-0.5 text-xs text-muted-foreground/60">aka {data.nickname}</p>
                )}
              </div>

              <div className="space-y-2">
                {data.joined_at && (
                  <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <IconCalendar size={14} className="shrink-0 opacity-40" />
                    <span>Joined <span className="text-foreground">{fmt_date(data.joined_at)}</span></span>
                  </div>
                )}
                {data.created_at && (
                  <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <IconCalendar size={14} className="shrink-0 opacity-40" />
                    <span>Registered <span className="text-foreground">{fmt_date(data.created_at)}</span></span>
                  </div>
                )}
                {data.premium_since && (
                  <div className="flex items-center gap-2.5 text-sm text-pink-400">
                    <IconCrown size={14} className="shrink-0 opacity-50" />
                    <span>Boosting since {fmt_date(data.premium_since)}</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* - scrollable: roles - \\ */}
        {data && !loading && data.roles.length > 0 && (
          <div className="flex min-h-0 flex-col">
            <div className="shrink-0 px-5 pt-3 pb-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Roles</p>
            </div>
            <div className="overflow-y-auto px-5 pb-5 no-scrollbar">
              <div className="flex flex-wrap gap-1.5">
                {data.roles.map((r) => (
                  <span
                    key={r.id}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2 py-1 text-xs text-foreground"
                  >
                    {r.icon ? (
                      <Image src={r.icon} alt="" width={12} height={12} className="h-3 w-3 rounded-sm" unoptimized />
                    ) : (
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: r.color !== '#000000' ? r.color : 'var(--muted-foreground)' }} />
                    )}
                    {r.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
        {data && !loading && data.roles.length === 0 && <div className="pb-5" />}
      </DialogPanel>
    </Dialog>
  )
}

// - developer tab - \\
function DeveloperTab() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.22 }}
      className="space-y-10"
    >

      {/* - developer cards - \\ */}
      <div className="space-y-3">
        {__credits.map((credit) => (
          <div
            key={credit.name}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card/40 p-5 transition-colors hover:bg-card/70"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-muted text-sm font-bold text-foreground">
                {credit.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[15px] font-semibold text-foreground">{credit.name}</span>
                  <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {credit.role}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">@{credit.handle}</p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/75">{credit.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {credit.links.map((link) => (
                    <CreditLink key={link.label} {...link} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* - tech stack - \\ */}
      <div>
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Tech Stack</p>
        <div className="flex flex-wrap gap-2">
          {__stack.map((tech) => (
            <a
              key={tech.label}
              href={tech.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {tech.label}
            </a>
          ))}
        </div>
      </div>

    </motion.div>
  )
}

// - member grid - \\
function MemberGrid({ members, loading, on_click }: { members: role_member[]; loading: boolean; on_click: (id: string) => void }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-card/30 p-3">
            <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-2 w-1/2 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!members.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm text-muted-foreground">No records found.</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="grid grid-cols-2 gap-3 sm:grid-cols-3"
    >
      {members.map((m) => (
        <button
          key={m.id}
          onClick={() => on_click(m.id)}
          className="flex items-center gap-3 rounded-xl border border-border bg-card/40 p-3 text-left transition-colors hover:border-foreground/20 hover:bg-card/80"
        >
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
            <Image src={m.avatar_url} alt={m.username} fill className="object-cover" unoptimized />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{m.global_name || m.username}</p>
            <p className="truncate text-xs text-muted-foreground">@{m.username}</p>
          </div>
        </button>
      ))}
    </motion.div>
  )
}

export default function CreditsPage() {
  const [mounted,         set_mounted]         = useState(false)
  const [active_tab,      set_active_tab]      = useState('developer')
  const [supporters,      set_supporters]      = useState<role_member[]>([])
  const [staff,           set_staff]           = useState<role_member[]>([])
  const [members_loading, set_members_loading] = useState(false)
  const [members_fetched, set_members_fetched] = useState(false)
  const [selected_member, set_selected_member] = useState<string | null>(null)

  const open_member  = useCallback((id: string) => set_selected_member(id), [])
  const close_member = useCallback(() => set_selected_member(null), [])

  useEffect(() => { set_mounted(true) }, [])

  useEffect(() => {
    if ((active_tab === 'supporter' || active_tab === 'staff') && !members_fetched) {
      set_members_loading(true)

      const fetch_members = async (attempts = 0): Promise<void> => {
        const is_retry = attempts > 0
        const url      = is_retry ? '/api/discord-role-members?refresh=1' : '/api/discord-role-members'

        const res  = await fetch(url)
        const data = await res.json()

        const supporters_raw: role_member[] = Array.isArray(data.supporters) ? data.supporters : []
        const staff_raw     : role_member[] = Array.isArray(data.staff)      ? data.staff      : []

        if (data.loading && attempts < 3) {
          await new Promise((r) => setTimeout(r, 6000))
          return fetch_members(attempts + 1)
        }

        set_supporters(supporters_raw)
        set_staff(staff_raw)
        set_members_fetched(true)
      }

      fetch_members()
        .catch(() => {})
        .finally(() => set_members_loading(false))
    }
  }, [active_tab, members_fetched])

  return (
    <main className="relative min-h-screen bg-background text-foreground">

      {/* - subtle background rays - \\ */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 mix-blend-screen">
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={0.3}
          lightSpread={0.4}
          rayLength={2}
          followMouse={false}
          mouseInfluence={0}
          noiseAmount={0.05}
          distortion={0}
          pulsating={false}
          fadeDistance={0.8}
          saturation={0}
        />
      </div>

      <BypassTopbar />

      <div className="relative z-10 mx-auto max-w-2xl px-5 py-20 sm:py-28">

        {/* - page header - \\ */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Credits</h1>
          <p className="mt-2 text-base text-muted-foreground">The people behind this bypass network.</p>
        </div>

        {/* - animated tab switcher - \\ */}
        <div className="relative mb-8 inline-flex h-9 w-full max-w-xs rounded-lg bg-muted p-[3px]">
          {mounted && (
            <motion.div
              className="absolute top-[3px] left-[3px] h-[calc(100%-6px)] rounded-md bg-black shadow-sm"
              style={{ width: `calc(${100 / __tab_items.length}% - 3px)` }}
              animate={{ x: `${__tab_items.findIndex(t => t.value === active_tab) * 100}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          {__tab_items.map((tab) => (
            <button
              key={tab.value}
              onClick={() => set_active_tab(tab.value)}
              className={cn(
                'relative z-10 flex-1 inline-flex items-center justify-center rounded-md px-2 py-1 text-sm font-medium whitespace-nowrap transition-colors duration-200',
                mounted && active_tab === tab.value ? 'text-white' : 'text-muted-foreground hover:text-foreground/70',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* - tab content - \\ */}
        <div className="min-h-[420px]">
          <AnimatePresence mode="wait">
            {active_tab === 'developer' && <DeveloperTab key="dev" />}
            {active_tab === 'supporter' && <MemberGrid   key="sup" members={supporters} loading={members_loading} on_click={open_member} />}
            {active_tab === 'staff'     && <MemberGrid   key="stf" members={staff}      loading={members_loading} on_click={open_member} />}
          </AnimatePresence>
        </div>

        {/* - footer - \\ */}
        <div className="mt-16 border-t border-border pt-8 pb-10">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
            Atomic Lancar Jaya
          </p>
        </div>
      </div>

      <ProfileDialog member_id={selected_member} on_close={close_member} />
    </main>
  )
}

