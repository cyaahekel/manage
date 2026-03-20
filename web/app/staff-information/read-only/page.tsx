/*
 * Atomicals Bot for Discord
 * Copyright (C) 2026 Atomicals LancarJaya
 *
 * Licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
 * You may not use this file except in compliance with the License.
 * See the LICENSE file for more information.
 */

'use client'

import { useState, useEffect }              from 'react'
import ReactMarkdown                        from 'react-markdown'
import remarkGfm                            from 'remark-gfm'
import rehypeRaw                            from 'rehype-raw'
import { Skeleton }                         from "@/components/ui/skeleton"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
}                                           from "@/components/ui/collapsible"
import { ChevronRight, BookOpen, AlertCircle, FileText, Clock } from 'lucide-react'
import { cn }                              from "@/lib/utils"

interface section_item {
  id      : string
  tab_id  : string
  title   : string
  content : string
  position: number
}

interface tab_item {
  id      : string
  title   : string
  position: number
  sections: section_item[]
}

// ─── MARKDOWN RENDERER ───────────────────────────────────────────────────────
function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className={cn(
      "prose prose-invert prose-sm max-w-none",
      "prose-p:leading-relaxed prose-p:text-zinc-300 prose-p:my-2",
      "prose-headings:font-semibold prose-headings:text-white prose-headings:mt-4 prose-headings:mb-2",
      "prose-strong:text-white prose-strong:font-semibold",
      "prose-em:text-zinc-300",
      "prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline",
      "prose-ul:my-2 prose-li:text-zinc-300 prose-li:my-0.5",
      "prose-ol:my-2",
      "prose-code:text-zinc-200 prose-code:bg-zinc-800/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[12px] prose-code:font-mono",
      "prose-pre:bg-zinc-900/80 prose-pre:border prose-pre:border-zinc-800/60 prose-pre:rounded-lg",
      "prose-blockquote:border-l-zinc-700 prose-blockquote:text-zinc-400",
      "prose-hr:border-zinc-800",
    )}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // - handle ```img code blocks as actual image tags - \\
          code({ className, children, ...props }: any) {
            const lang = /language-(\w+)/.exec(className ?? "")?.[1]
            if (lang === "img") {
              const src = String(children).trim()
              return (
                <img
                  src={src}
                  alt=""
                  className="rounded-xl max-w-full my-3 shadow-md object-contain"
                />
              )
            }
            return <code className={className} {...props}>{children}</code>
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

// ─── SECTION CARD ────────────────────────────────────────────────────────────
function SectionCard({ section, index }: { section: section_item; index: number }) {
  const [open, set_open] = useState(false)

  return (
    <Collapsible open={open} onOpenChange={set_open}>
      <div className={cn(
        "rounded-xl transition-all duration-200",
        open
          ? "bg-zinc-900/50"
          : "bg-zinc-900/20 hover:bg-zinc-900/35"
      )}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center gap-3 px-5 py-3.5 cursor-pointer select-none">
            {/* index badge */}
            <span className="flex-shrink-0 text-[10px] font-mono font-bold text-zinc-700 w-5 text-right">
              {String(index + 1).padStart(2, "0")}
            </span>

            <FileText size={14} className={cn(
              "shrink-0 transition-colors",
              open ? "text-zinc-400" : "text-zinc-600"
            )} />

            <span className={cn(
              "flex-1 text-sm font-medium text-left transition-colors",
              open ? "text-white" : "text-zinc-300"
            )}>
              {section.title}
            </span>

            <ChevronRight size={15} className={cn(
              "text-zinc-600 transition-transform duration-200 shrink-0",
              open && "rotate-90"
            )} />
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-5 pb-5 pt-0 pl-[52px]">
            {section.content ? (
              <MarkdownRenderer content={section.content} />
            ) : (
              <p className="text-sm text-zinc-600 italic">Belum ada konten.</p>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function StaffInformationReadOnlyPage() {
  const [tabs,       set_tabs]       = useState<tab_item[]>([])
  const [active_tab, set_active_tab] = useState<string>("")
  const [loading,    set_loading]    = useState(true)
  const [error,      set_error]      = useState(false)

  useEffect(() => {
    fetch("/api/staff-information")
      .then(r => {
        if (!r.ok) throw new Error("Not ok")
        return r.json()
      })
      .then(data => {
        const loaded: tab_item[] = data.tabs ?? []
        set_tabs(loaded)
        set_active_tab(loaded[0]?.id ?? "")
        set_loading(false)
      })
      .catch(() => {
        set_error(true)
        set_loading(false)
      })
  }, [])

  const active_tab_data = tabs.find(t => t.id === active_tab)

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <div className="w-60 shrink-0 border-r border-border/30 p-4 space-y-2">
          {[1,2,3].map(i => <Skeleton key={i} className="h-10 w-full rounded-lg" />)}
        </div>
        <div className="flex-1 max-w-2xl mx-auto px-8 py-10 space-y-4">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-zinc-600">
        <div className="flex flex-col items-center gap-3">
          <AlertCircle size={32} />
          <p className="text-sm">Gagal memuat data. Coba refresh halaman.</p>
        </div>
      </div>
    )
  }

  if (tabs.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center text-zinc-600">
        <div className="flex flex-col items-center gap-3">
          <BookOpen size={32} />
          <p className="text-sm">Belum ada arahan yang tersedia.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">

      {/* ═══════════════════════════════════════
          LEFT — sticky tab navigation
      ═══════════════════════════════════════ */}
      <aside className="w-60 shrink-0 border-r border-border/30 bg-zinc-950/40">
        <div className="sticky top-0">
          {/* sidebar header */}
          <div className="px-5 py-5 border-b border-border/30">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-800 shrink-0">
                <BookOpen size={13} className="text-zinc-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Staff Info</p>
                <p className="text-[11px] text-zinc-600">Panduan & Arahan</p>
              </div>
            </div>
          </div>

          {/* tab list */}
          <nav className="p-2 space-y-0.5">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => set_active_tab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-colors",
                  tab.id === active_tab
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
                )}
              >
                <span className="flex-1 text-sm font-medium truncate">{tab.title}</span>
                {tab.sections.length > 0 && (
                  <span className={cn(
                    "text-[10px] font-mono shrink-0",
                    tab.id === active_tab ? "text-zinc-500" : "text-zinc-700"
                  )}>
                    {tab.sections.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* ═══════════════════════════════════════
          RIGHT — content area
      ═══════════════════════════════════════ */}
      <main className="flex-1 min-w-0">
        {active_tab_data && (
          <div className="max-w-2xl mx-auto px-8 py-8">

            {/* tab heading */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white">{active_tab_data.title}</h2>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-xs text-zinc-600">
                  {active_tab_data.sections.length} section{active_tab_data.sections.length !== 1 ? "s" : ""}
                </p>
                <span className="text-zinc-800 text-xs">·</span>
                <div className="flex items-center gap-1 text-xs text-zinc-600">
                  <Clock size={11} />
                  <span>Last updated {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                </div>
              </div>
            </div>

            {active_tab_data.sections.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-zinc-700 border border-dashed border-border/25 rounded-xl">
                <FileText size={24} className="mb-2" />
                <p className="text-sm">Tab ini belum punya section.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {active_tab_data.sections.map((section, i) => (
                  <SectionCard key={section.id} section={section} index={i} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
