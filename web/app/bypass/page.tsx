'use client'

import { useState, useRef, useCallback } from 'react'
import { Button as StatefulButton } from '@/components/ui/stateful-button'
import { cn }                       from '@/lib/utils'
import { BypassTopbar }  from '@/components/bypass-topbar'
import ShinyText          from '@/components/ShinyText'
import Aurora             from '@/components/Aurora'
import { FlipWords }      from '@/components/ui/flip-words'
import {
  Link2,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
} from 'lucide-react'

// - BYPASS STATE TYPE - \\
type bypass_state =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; result: string }
  | { status: 'error';   message: string }

export default function BypassPage() {
  const [url, set_url]       = useState('')
  const [state, set_state]   = useState<bypass_state>({ status: 'idle' })
  const [copied, set_copied] = useState(false)
  const input_ref            = useRef<HTMLInputElement>(null)
  const submitted_url        = useRef<string>('')

  // - CORE BYPASS LOGIC, RETURNS PROMISE FOR STATEFUL BUTTON - \\
  const run_bypass = useCallback(async (): Promise<void> => {
    const trimmed = url.trim()
    if (!trimmed) {
      input_ref.current?.focus()
      return
    }

    try {
      new URL(trimmed)
    } catch {
      set_state({ status: 'error', message: 'Please enter a valid URL (e.g. https://example.com/...)' })
      return
    }

    set_state({ status: 'loading' })

    try {
      const res = await fetch('/api/bypass', {
        method  : 'POST',
        headers : { 'Content-Type': 'application/json' },
        body    : JSON.stringify({ url: trimmed }),
      })

      const data = await res.json().catch(() => ({ error: 'Unexpected response from server.' }))

      if (!res.ok || !data.success) {
        set_state({ status: 'error', message: data.error || 'Something went wrong.' })
        return
      }

      submitted_url.current = trimmed
      set_state({ status: 'success', result: data.result })
    } catch {
      set_state({ status: 'error', message: 'Network error. Please check your connection.' })
    }
  }, [url])

  const handle_submit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    run_bypass()
  }, [run_bypass])

  const handle_copy = useCallback(async () => {
    if (state.status !== 'success') return
    await navigator.clipboard.writeText(state.result).catch(() => null)
    set_copied(true)
    setTimeout(() => set_copied(false), 2000)
  }, [state])

  const handle_reset = useCallback(() => {
    set_url('')
    set_state({ status: 'idle' })
    setTimeout(() => input_ref.current?.focus(), 50)
  }, [])

  const is_loading = state.status === 'loading'
  const is_done    = state.status === 'success' || state.status === 'error'

  return (
    <div className="min-h-screen relative">
      {/* - AURORA BACKGROUND - \\ */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Aurora
          colorStops={['#1a0533', '#0f172a', '#0c1a0f']}
          amplitude={1.2}
          blend={0.6}
          speed={0.5}
        />
      </div>

      <BypassTopbar />

      {/* - PAGE CONTENT - \\ */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20">
        <div className="w-full max-w-xl space-y-8">

          {/* - HEADING - \\ */}
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold tracking-tight flex items-center justify-center gap-3">
              <img src="/atomc.svg" alt="Atomic" className="w-9 h-9 shrink-0" />
              Link Bypass
            </h1>
            <p className="text-muted-foreground text-base font-normal">
              Bypass
              <FlipWords words={['Platoboost', 'Linkvertise', 'Hydrogen', 'Pandadevelopment', 'Lockrso']} className="text-foreground font-semibold" />
              with Atomic Bypasser
            </p>
          </div>

          {/* - INPUT FORM - \\ */}
          <form
            onSubmit={handle_submit}
            className={cn(
              'flex items-center gap-2 bg-card border rounded-2xl p-2 transition-colors',
              state.status === 'error'
                ? 'border-border/80'
                : 'border-border focus-within:border-foreground/25'
            )}
          >
            <div className="flex-1 flex items-center gap-2.5 px-2">
              <Link2 className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                ref={input_ref}
                type="url"
                value={url}
                onChange={e => {
                  set_url(e.target.value)
                  if (state.status === 'error') set_state({ status: 'idle' })
                }}
                placeholder="https://linkvertise.com/..."
                disabled={is_loading}
                autoFocus
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/40 disabled:opacity-50 min-w-0"
              />
            </div>
            <StatefulButton
              type="button"
              disabled={!url.trim() || is_done}
              onClick={run_bypass}
              className="rounded-xl px-5 shrink-0 min-w-fit text-sm font-medium"
            >
              Bypass
            </StatefulButton>
          </form>

          {/* - ERROR - \\ */}
          {state.status === 'error' && (
            <div className="animate-in fade-in slide-in-from-top-1 duration-200 flex items-start gap-3 bg-card border border-border rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-sm">{state.message}</p>
            </div>
          )}

          {/* - LOADING - \\ */}
          {is_loading && (
            <div className="animate-in fade-in duration-200 px-1">
              <ShinyText
                text="Contacting bypass service..."
                speed={2}
                delay={0}
                color="#6b7280"
                shineColor="#e5e7eb"
                spread={120}
                direction="left"
                className="text-sm"
              />
            </div>
          )}

          {/* - SUCCESS - \\ */}
          {state.status === 'success' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300 rounded-2xl border border-border bg-card overflow-hidden">

              {/* - RESULT HEADER - \\ */}
              <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground" />
                  Direct link
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handle_copy}
                    className="inline-flex items-center gap-1.5 h-7 px-2.5 text-xs rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <a
                    href={submitted_url.current || '#'}
                    className="inline-flex items-center gap-1.5 h-7 px-2.5 text-xs rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Open
                  </a>
                </div>
              </div>

              {/* - RESULT URL - \\ */}
              <div className="px-4 py-4">
                <p className="text-sm font-mono break-all leading-relaxed text-foreground">
                  {state.result}
                </p>
              </div>

              {/* - RESET - \\ */}
              <div className="px-4 pb-4">
                <button
                  onClick={handle_reset}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
                >
                  Bypass another link
                </button>
              </div>

            </div>
          )}

          {/* - HINT FOOTER - \\ */}
          {state.status === 'idle' && (
            <p className="text-center text-xs text-muted-foreground/40">
              5 requests per minute per client
            </p>
          )}

        </div>
      </div>
    </div>
  )
}
