'use client'

import { useEffect, useState }  from 'react'
import { cn }                   from '@/lib/utils'
import { BypassTopbar }         from '@/components/bypass-topbar'
import { Loader2, Search, Globe, CheckCircle2, XCircle, Clock } from 'lucide-react'

interface supported_service {
  name    : string
  type    : string
  status  : string
  domains : string[]
}

// - STATUS BADGE CONFIG - \\
const __status_config: Record<string, { label: string; dot: string; text: string }> = {
  active      : { label: 'Active',      dot: 'bg-foreground',            text: 'text-foreground'      },
  maintenance : { label: 'Maintenance', dot: 'bg-muted-foreground',      text: 'text-muted-foreground' },
  inactive    : { label: 'Inactive',    dot: 'bg-muted-foreground/40',   text: 'text-muted-foreground' },
}

function __get_status(status: string) {
  return __status_config[status.toLowerCase()] ?? __status_config.inactive
}

export default function SupportedPage() {
  const [services, set_services]   = useState<supported_service[]>([])
  const [filtered, set_filtered]   = useState<supported_service[]>([])
  const [query, set_query]         = useState('')
  const [loading, set_loading]     = useState(true)
  const [error, set_error]         = useState<string | null>(null)

  useEffect(() => {
    const fetch_services = async () => {
      try {
        const res = await fetch('/api/supported')

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          set_error(data.error || 'Failed to load supported services.')
          return
        }

        const data: supported_service[] = await res.json()
        set_services(data)
        set_filtered(data)
      } catch {
        set_error('Network error. Please try again.')
      } finally {
        set_loading(false)
      }
    }

    fetch_services()
  }, [])

  // - FILTER ON QUERY CHANGE - \\
  useEffect(() => {
    const q = query.trim().toLowerCase()
    if (!q) {
      set_filtered(services)
      return
    }
    set_filtered(
      services.filter(s =>
        s.name.toLowerCase().includes(q)    ||
        s.type.toLowerCase().includes(q)    ||
        s.status.toLowerCase().includes(q)  ||
        s.domains.some(d => d.toLowerCase().includes(q))
      )
    )
  }, [query, services])

  const active_count = services.filter(s => s.status.toLowerCase() === 'active').length

  return (
    <div className="min-h-screen bg-background">
      <BypassTopbar />

<div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16">

        {/* - PAGE HEADER - \\ */}
        <div className="mb-10 space-y-4">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-bold tracking-tight">Supported Links</h1>
            {!loading && !error && (
              <p className="text-sm text-muted-foreground">
                {active_count} active service{active_count !== 1 ? 's' : ''} out of {services.length} total
              </p>
            )}
          </div>

          {/* - SEARCH - \\ */}
          {!loading && !error && services.length > 0 && (
            <div className="flex items-center gap-2.5 bg-card border border-border rounded-xl px-3 py-2 w-full max-w-sm focus-within:border-foreground/25 transition-colors">
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                value={query}
                onChange={e => set_query(e.target.value)}
                placeholder="Search by name, domain..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/40"
              />
            </div>
          )}
        </div>

        {/* - LOADING STATE - \\ */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* - ERROR STATE - \\ */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <XCircle className="w-8 h-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        )}

        {/* - EMPTY SEARCH - \\ */}
        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <Search className="w-8 h-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No services match &quot;{query}&quot;</p>
            <button
              onClick={() => set_query('')}
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
            >
              Clear search
            </button>
          </div>
        )}

        {/* - SERVICE GRID - \\ */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid gap-px bg-border rounded-2xl overflow-hidden border border-border">
            {/* - TABLE HEADER - \\ */}
            <div className="grid grid-cols-12 bg-card px-4 py-2.5 text-xs font-medium text-muted-foreground">
              <span className="col-span-4">Service</span>
              <span className="col-span-3">Type</span>
              <span className="col-span-3">Domains</span>
              <span className="col-span-2 text-right">Status</span>
            </div>

            {/* - SERVICE ROWS - \\ */}
            {filtered.map((service, i) => {
              const cfg     = __get_status(service.status)
              const is_last = i === filtered.length - 1

              return (
                <div
                  key={`${service.name}-${i}`}
                  className={cn(
                    'grid grid-cols-12 bg-card px-4 py-3 items-center gap-2 text-sm hover:bg-accent/30 transition-colors',
                    !is_last && 'border-b border-border'
                  )}
                >
                  {/* - NAME - \\ */}
                  <div className="col-span-4 flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <span className="font-medium truncate">{service.name}</span>
                  </div>

                  {/* - TYPE - \\ */}
                  <div className="col-span-3 min-w-0">
                    <span className="text-muted-foreground capitalize truncate block">{service.type}</span>
                  </div>

                  {/* - DOMAINS - \\ */}
                  <div className="col-span-3 min-w-0">
                    {service.domains.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {service.domains.slice(0, 2).map(d => (
                          <span
                            key={d}
                            className="inline-block text-xs bg-secondary text-muted-foreground rounded-md px-1.5 py-0.5 font-mono truncate max-w-[120px]"
                          >
                            {d}
                          </span>
                        ))}
                        {service.domains.length > 2 && (
                          <span className="text-xs text-muted-foreground/60">
                            +{service.domains.length - 2}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground/40">—</span>
                    )}
                  </div>

                  {/* - STATUS - \\ */}
                  <div className="col-span-2 flex items-center justify-end gap-1.5">
                    <div className={cn('h-1.5 w-1.5 rounded-full shrink-0', cfg.dot)} />
                    <span className={cn('text-xs', cfg.text)}>{cfg.label}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* - FOOTER - \\ */}
        {!loading && !error && services.length > 0 && (
          <p className="mt-6 text-xs text-muted-foreground/40 text-center">
            Data cached for 5 minutes
          </p>
        )}

      </div>
    </div>
  )
}
