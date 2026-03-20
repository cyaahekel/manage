/*
 * Atomicals Bot for Discord
 * Copyright (C) 2026 Atomicals LancarJaya
 *
 * Licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
 * You may not use this file except in compliance with the License.
 * See the LICENSE file for more information.
 */

'use client'

import { useState, useEffect, useCallback, useRef }                        from 'react'
import ReactMarkdown                                                        from 'react-markdown'
import remarkGfm                                                            from 'remark-gfm'
import rehypeRaw                                                            from 'rehype-raw'
import { Button }                                                          from "@/components/ui/button"
import { Input }                                                           from "@/components/ui/input"
import { Skeleton }                                                        from "@/components/ui/skeleton"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
}                                                                          from "@/components/ui/input-group"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
}                                                                          from "@/components/ui/alert-dialog"
import {
  Loader2, Plus, Trash2, Save, Pencil,
  ChevronUp, ChevronDown, BookMarked, FolderOpen,
  Bold, Italic, Underline, Link, List, Image,
}                                                                          from 'lucide-react'
import { toast }                                                           from "sonner"
import { cn }                                                              from "@/lib/utils"

interface section_item {
  id?      : string
  title    : string
  content  : string
  position : number
}

interface tab_item {
  id?      : string
  title    : string
  position : number
  sections : section_item[]
}

type delete_target =
  | { type: "tab"; tab_idx: number }
  | { type: "section"; tab_idx: number; sec_idx: number }

function next_id() {
  return "new_" + Math.random().toString(36).slice(2, 9)
}

// ─── MARKDOWN PREVIEW ────────────────────────────────────────────────────────
function ContentPreview({ content }: { content: string }) {
  return (
    <div className={cn(
      "prose prose-invert prose-sm max-w-none",
      "prose-p:leading-relaxed prose-p:text-zinc-300 prose-p:my-1.5",
      "prose-headings:font-semibold prose-headings:text-white prose-headings:mt-3 prose-headings:mb-1.5",
      "prose-strong:text-white prose-strong:font-semibold",
      "prose-em:text-zinc-300",
      "prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline",
      "prose-ul:my-1.5 prose-li:text-zinc-300 prose-li:my-0.5",
      "prose-ol:my-1.5",
      "prose-code:text-zinc-200 prose-code:bg-zinc-800/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[12px] prose-code:font-mono",
      "prose-pre:bg-zinc-900/80 prose-pre:border prose-pre:border-zinc-800/60 prose-pre:rounded-lg",
      "prose-blockquote:border-l-zinc-700 prose-blockquote:text-zinc-400",
    )}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ className, children, ...props }: any) {
            const lang = /language-(\w+)/.exec(className ?? "")?.[1]
            if (lang === "img") {
              const src = String(children).trim()
              return <img src={src} alt="" className="rounded-xl max-w-full my-3 shadow-md object-contain" />
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

// ─── SECTION EDITOR ─────────────────────────────────────────────────────────
function SectionEditor({
  section,
  section_idx,
  tab_idx,
  total,
  on_change,
  on_delete,
  on_move,
}: {
  section     : section_item
  section_idx : number
  tab_idx     : number
  total       : number
  on_change   : (tab_idx: number, sec_idx: number, field: keyof section_item, value: string) => void
  on_delete   : (tab_idx: number, sec_idx: number) => void
  on_move     : (tab_idx: number, sec_idx: number, dir: "up" | "down") => void
}) {
  const [editing_title,   set_editing_title]   = useState(false)
  const [editing_content, set_editing_content] = useState(false)
  const textarea_ref                            = useRef<HTMLTextAreaElement>(null)
  const editor_container_ref                    = useRef<HTMLDivElement>(null)

  // - keep textarea focused after auto-entering edit mode - \\
  const enter_edit = useCallback(() => {
    set_editing_content(true)
    requestAnimationFrame(() => textarea_ref.current?.focus())
  }, [])

  // - exit edit mode only when focus leaves the entire editor block - \\
  const handle_editor_blur = useCallback((e: React.FocusEvent) => {
    if (editor_container_ref.current?.contains(e.relatedTarget as Node)) return
    set_editing_content(false)
  }, [])

  // - apply markdown formatting around the current text selection - \\
  const apply_format = useCallback((type: "bold" | "italic" | "underline" | "link" | "list" | "image") => {
    const el = textarea_ref.current
    if (!el) return

    const start    = el.selectionStart
    const end      = el.selectionEnd
    const value    = section.content
    const selected = value.slice(start, end)

    let replacement = ""

    switch (type) {
      case "bold"      : replacement = `**${selected || "bold text"}**`          ; break
      case "italic"    : replacement = `*${selected || "italic text"}*`          ; break
      case "underline" : replacement = `<u>${selected || "underlined"}</u>`      ; break
      case "link"      : replacement = `[${selected || "link text"}](url)`       ; break
      case "image"     : replacement = `\`\`\`img\n${selected || "https://example.com/image.png"}\n\`\`\`` ; break
      case "list": {
        const lines = (selected || "list item").split("\n")
        replacement = lines.map(l => `- ${l}`).join("\n")
        break
      }
    }

    const new_value = value.slice(0, start) + replacement + value.slice(end)
    on_change(tab_idx, section_idx, "content", new_value)

    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(start + replacement.length, start + replacement.length)
    })
  }, [section.content, tab_idx, section_idx, on_change])

  return (
    <div className="group/section relative">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-4 py-2.5 transition-colors">
        <span className="text-[10px] font-mono text-zinc-700 tabular-nums select-none w-5 text-right shrink-0">
          {String(section_idx + 1).padStart(2, "0")}
        </span>

        <div className="flex-1 min-w-0">
          {editing_title ? (
            <Input
              autoFocus
              value={section.title}
              onChange={e => on_change(tab_idx, section_idx, "title", e.target.value)}
              onBlur={() => set_editing_title(false)}
              onKeyDown={e => { if (e.key === "Enter") set_editing_title(false) }}
              className="h-6 text-[13px] bg-transparent border-0 border-b border-zinc-700/60 rounded-none shadow-none ring-0 focus-visible:ring-0 px-0 text-white font-medium w-full"
            />
          ) : (
            <button
              onClick={() => set_editing_title(true)}
              className="group/title flex items-center gap-1.5 text-[13px] font-medium text-zinc-200 hover:text-white transition-colors text-left w-full outline-none"
            >
              <span className="truncate">{section.title || <span className="text-zinc-600 font-normal italic">Untitled</span>}</span>
              <Pencil size={10} className="text-zinc-700 opacity-0 group-hover/title:opacity-100 transition-opacity shrink-0" />
            </button>
          )}
        </div>

        {/* ── Controls ── */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover/section:opacity-100 transition-opacity shrink-0">
          <button
            disabled={section_idx === 0}
            onClick={() => on_move(tab_idx, section_idx, "up")}
            className="flex items-center justify-center h-5 w-5 rounded text-zinc-700 hover:text-zinc-300 hover:bg-zinc-800 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronUp size={11} />
          </button>
          <button
            disabled={section_idx === total - 1}
            onClick={() => on_move(tab_idx, section_idx, "down")}
            className="flex items-center justify-center h-5 w-5 rounded text-zinc-700 hover:text-zinc-300 hover:bg-zinc-800 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronDown size={11} />
          </button>
          <div className="w-px h-3 bg-zinc-800 mx-1" />
          <button
            onClick={() => on_delete(tab_idx, section_idx)}
            className="flex items-center justify-center h-5 w-5 rounded text-zinc-700 hover:text-red-400 hover:bg-red-950/30 transition-colors"
          >
            <Trash2 size={10} />
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="pl-9 pr-4 pb-3" ref={editor_container_ref} onBlur={handle_editor_blur}>
        {editing_content ? (
          <InputGroup className="w-full overflow-hidden">

            {/* ── Toolbar ── */}
            <InputGroupAddon align="block-start" className="border-b border-zinc-800/50 px-0 py-1 gap-0">
              <InputGroupButton aria-label="Bold" size="icon-xs" variant="ghost" className="text-zinc-600 hover:text-zinc-200 hover:bg-zinc-800/60" onMouseDown={(e) => e.preventDefault()} onClick={() => apply_format("bold")}>
                <Bold size={12} />
              </InputGroupButton>
              <InputGroupButton aria-label="Italic" size="icon-xs" variant="ghost" className="text-zinc-600 hover:text-zinc-200 hover:bg-zinc-800/60" onMouseDown={(e) => e.preventDefault()} onClick={() => apply_format("italic")}>
                <Italic size={12} />
              </InputGroupButton>
              <InputGroupButton aria-label="Underline" size="icon-xs" variant="ghost" className="text-zinc-600 hover:text-zinc-200 hover:bg-zinc-800/60" onMouseDown={(e) => e.preventDefault()} onClick={() => apply_format("underline")}>
                <Underline size={12} />
              </InputGroupButton>
              <div className="w-px h-3 bg-zinc-800/80 mx-1 self-center" />
              <InputGroupButton aria-label="Link" size="icon-xs" variant="ghost" className="text-zinc-600 hover:text-zinc-200 hover:bg-zinc-800/60" onMouseDown={(e) => e.preventDefault()} onClick={() => apply_format("link")}>
                <Link size={12} />
              </InputGroupButton>
              <InputGroupButton aria-label="List" size="icon-xs" variant="ghost" className="text-zinc-600 hover:text-zinc-200 hover:bg-zinc-800/60" onMouseDown={(e) => e.preventDefault()} onClick={() => apply_format("list")}>
                <List size={12} />
              </InputGroupButton>
              <InputGroupButton aria-label="Image" size="icon-xs" variant="ghost" className="text-zinc-600 hover:text-zinc-200 hover:bg-zinc-800/60" onMouseDown={(e) => e.preventDefault()} onClick={() => apply_format("image")}>
                <Image size={12} />
              </InputGroupButton>
            </InputGroupAddon>

            {/* ── Textarea ── */}
            <InputGroupTextarea
              ref={textarea_ref as any}
              value={section.content}
              onChange={e => on_change(tab_idx, section_idx, "content", e.target.value)}
              placeholder="Tulis arahan di sini..."
              className="text-zinc-300 text-[13px] min-h-[100px] font-sans leading-relaxed placeholder:text-zinc-700 px-0 py-2"
            />
          </InputGroup>
        ) : (
          // - click anywhere on content to enter edit mode - \\
          <div
            onClick={enter_edit}
            className="cursor-text py-1 min-h-[32px]"
          >
            {section.content ? (
              <ContentPreview content={section.content} />
            ) : (
              <span className="text-[13px] text-zinc-700 font-sans select-none hover:text-zinc-500 transition-colors">
                Tulis arahan di sini...
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function StaffInformationEditorPage() {
  const [tabs,          set_tabs]          = useState<tab_item[]>([])
  const [active_tab,    set_active_tab]    = useState<string>("")
  const [loading,       set_loading]       = useState(true)
  const [saving,        set_saving]        = useState(false)
  const [dirty,         set_dirty]         = useState(false)
  const [delete_target, set_delete_target] = useState<delete_target | null>(null)
  const [editing_tab,   set_editing_tab]   = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/staff-information")
      .then(r => r.json())
      .then(data => {
        const loaded: tab_item[] = (data.tabs ?? []).map((t: any) => ({
          id      : t.id,
          title   : t.title,
          position: t.position,
          sections: t.sections.map((s: any) => ({
            id      : s.id,
            title   : s.title,
            content : s.content,
            position: s.position,
          })),
        }))
        set_tabs(loaded)
        set_active_tab(loaded[0]?.id ?? loaded[0]?.title ?? "")
        set_loading(false)
      })
      .catch(() => {
        toast.error("Gagal load data")
        set_loading(false)
      })
  }, [])

  const change_section = useCallback((tab_idx: number, sec_idx: number, field: keyof section_item, value: string) => {
    set_tabs(prev => {
      const next = [...prev]
      const tab  = { ...next[tab_idx], sections: [...next[tab_idx].sections] }
      tab.sections[sec_idx] = { ...tab.sections[sec_idx], [field]: value }
      next[tab_idx] = tab
      return next
    })
    set_dirty(true)
  }, [])

  const add_section = useCallback((tab_idx: number) => {
    set_tabs(prev => {
      const next = [...prev]
      const tab  = { ...next[tab_idx], sections: [...next[tab_idx].sections] }
      tab.sections.push({ id: next_id(), title: "New Section", content: "", position: tab.sections.length })
      next[tab_idx] = tab
      return next
    })
    set_dirty(true)
  }, [])

  const move_section = useCallback((tab_idx: number, sec_idx: number, dir: "up" | "down") => {
    set_tabs(prev => {
      const next     = [...prev]
      const sections = [...next[tab_idx].sections]
      const swap_idx = dir === "up" ? sec_idx - 1 : sec_idx + 1
      if (swap_idx < 0 || swap_idx >= sections.length) return prev;
      [sections[sec_idx], sections[swap_idx]] = [sections[swap_idx], sections[sec_idx]]
      sections.forEach((s, i) => { s.position = i })
      next[tab_idx] = { ...next[tab_idx], sections }
      return next
    })
    set_dirty(true)
  }, [])

  const confirm_delete = useCallback(() => {
    if (!delete_target) return
    if (delete_target.type === "section") {
      const { tab_idx, sec_idx } = delete_target
      set_tabs(prev => {
        const next     = [...prev]
        const sections = next[tab_idx].sections.filter((_, i) => i !== sec_idx)
        sections.forEach((s, i) => { s.position = i })
        next[tab_idx] = { ...next[tab_idx], sections }
        return next
      })
    } else {
      const { tab_idx } = delete_target
      set_tabs(prev => {
        const next = prev.filter((_, i) => i !== tab_idx)
        next.forEach((t, i) => { t.position = i })
        return next
      })
      set_active_tab(prev => {
        const remaining = tabs.filter((_, i) => i !== tab_idx)
        return remaining[0]?.id ?? remaining[0]?.title ?? ""
      })
    }
    set_delete_target(null)
    set_dirty(true)
  }, [delete_target, tabs])

  const add_tab = useCallback(() => {
    const new_tab: tab_item = {
      id      : next_id(),
      title   : "New Tab",
      position: tabs.length,
      sections: [],
    }
    set_tabs(prev => [...prev, new_tab])
    set_active_tab(new_tab.id!)
    set_editing_tab(new_tab.id!)
    set_dirty(true)
  }, [tabs.length])

  const change_tab_title = useCallback((tab_id: string, value: string) => {
    set_tabs(prev => prev.map(t => t.id === tab_id ? { ...t, title: value } : t))
    set_dirty(true)
  }, [])

  const handle_save = useCallback(async () => {
    for (const tab of tabs) {
      if (!tab.title.trim()) { toast.error("Semua tab harus punya judul"); return }
      for (const sec of tab.sections) {
        if (!sec.title.trim()) { toast.error("Semua section harus punya judul"); return }
      }
    }

    set_saving(true)
    try {
      const payload = {
        tabs: tabs.map((t, ti) => ({
          id      : t.id?.startsWith("new_") ? undefined : t.id,
          title   : t.title,
          position: ti,
          sections: t.sections.map((s, si) => ({
            id      : s.id?.startsWith("new_") ? undefined : s.id,
            title   : s.title,
            content : s.content,
            position: si,
          })),
        })),
      }

      const res = await fetch("/api/staff-information", {
        method : "PATCH",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? "Unknown error")
      }

      const fresh = await fetch("/api/staff-information").then(r => r.json())
      const reloaded: tab_item[] = (fresh.tabs ?? []).map((t: any) => ({
        id      : t.id,
        title   : t.title,
        position: t.position,
        sections: t.sections.map((s: any) => ({
          id      : s.id,
          title   : s.title,
          content : s.content,
          position: s.position,
        })),
      }))
      set_tabs(reloaded)

      toast.success("Saved!")
      set_dirty(false)
    } catch (err: any) {
      toast.error(err.message ?? "Gagal save")
    } finally {
      set_saving(false)
    }
  }, [tabs])

  const active_tab_idx = tabs.findIndex(t => (t.id ?? t.title) === active_tab)
  const active_tab_data = tabs[active_tab_idx]

  if (loading) {
    return (
      <div className="flex flex-col space-y-4 p-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <Skeleton className="h-10 w-full md:w-3/4 rounded-xl" />
        <div className="space-y-2 mt-4">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* ── HEADER & SAVE ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-white">Staff Information</h2>
          <p className="text-zinc-500 text-[13px] mt-0.5">
            Manage internal guidelines and instructions for Atomicals staffs.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          {dirty && (
            <span className="text-[12px] text-amber-400/80 font-medium">
              Unsaved changes
            </span>
          )}
          <Button
            onClick={handle_save}
            disabled={saving || !dirty}
            size="sm"
            className="gap-1.5 px-4 h-8 bg-white text-black hover:bg-zinc-200 shadow-sm text-[13px] transition-all"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* ── TABS STRIP ── */}
      <div className="flex overflow-x-auto border-b border-zinc-800/50">
        {tabs.map((tab, ti) => {
          const is_active = (tab.id ?? tab.title) === active_tab
          return (
            <div
              key={tab.id ?? tab.title}
              className={cn(
                "group/tab relative flex items-center h-9 px-4 gap-2 cursor-pointer select-none whitespace-nowrap shrink-0 transition-colors",
                is_active ? "text-white" : "text-zinc-500 hover:text-zinc-300"
              )}
              onClick={() => set_active_tab(tab.id ?? tab.title)}
            >
              {/* ── active underline indicator ── */}
              {is_active && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-zinc-400 translate-y-px" />
              )}

              {editing_tab === tab.id ? (
                <Input
                  autoFocus
                  value={tab.title}
                  onChange={e => change_tab_title(tab.id!, e.target.value)}
                  onBlur={() => set_editing_tab(null)}
                  onKeyDown={e => { if (e.key === "Enter") set_editing_tab(null) }}
                  className="h-6 w-24 px-1.5 text-xs bg-zinc-900 border-zinc-700 text-white rounded focus-visible:ring-0"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span
                  onDoubleClick={() => set_editing_tab(tab.id!)}
                  className="text-[13px] font-medium"
                >
                  {tab.title}
                </span>
              )}

              {tab.sections.length > 0 && (
                <span className={cn(
                  "text-[10px] font-mono tabular-nums",
                  is_active ? "text-zinc-600" : "text-zinc-700"
                )}>
                  {tab.sections.length}
                </span>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); set_delete_target({ type: "tab", tab_idx: ti }) }}
                className="opacity-0 group-hover/tab:opacity-100 p-0.5 rounded hover:bg-red-500/10 text-zinc-600 hover:text-red-400 transition-opacity"
              >
                <Trash2 size={10} />
              </button>
            </div>
          )
        })}
        <button
          onClick={add_tab}
          className="flex items-center gap-1.5 h-9 px-4 text-[13px] text-zinc-600 hover:text-zinc-400 whitespace-nowrap shrink-0 transition-colors"
        >
          <Plus size={12} />
          Add Tab
        </button>
      </div>

      {/* ── CONTENT AREA ── */}
      {active_tab_data ? (
        <div className="pb-16 space-y-3">
          {active_tab_data.sections.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-zinc-600 rounded-xl border border-dashed border-zinc-800/50">
              <FolderOpen size={18} className="mb-2.5 text-zinc-700" />
              <p className="text-[13px] font-medium text-zinc-400">Tab ini belum punya section.</p>
              <p className="text-[12px] mt-0.5 text-zinc-600">Klik tombol di bawah untuk menambah section pertama.</p>
            </div>
          ) : (
            // ── all sections in one unified container row ── \\
            <div className="rounded-xl border border-zinc-800/50 overflow-hidden divide-y divide-zinc-800/50 bg-zinc-950/50">
              {active_tab_data.sections.map((section, si) => (
                <SectionEditor
                  key={section.id ?? si}
                  section={section}
                  section_idx={si}
                  tab_idx={active_tab_idx}
                  total={active_tab_data.sections.length}
                  on_change={change_section}
                  on_delete={(ti, si) => set_delete_target({ type: "section", tab_idx: ti, sec_idx: si })}
                  on_move={move_section}
                />
              ))}
            </div>
          )}

          <button
            onClick={() => add_section(active_tab_idx)}
            className="w-full h-8 flex items-center justify-center gap-1.5 text-[12px] text-zinc-700 hover:text-zinc-400 rounded-lg transition-colors border border-dashed border-zinc-800/50 hover:border-zinc-700/60"
          >
            <Plus size={12} />
            Add Section
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-60 text-zinc-600 border border-dashed border-zinc-800/60 rounded-xl">
          <BookMarked size={22} className="mb-3 text-zinc-700" />
          <p className="text-[13px] font-medium text-zinc-400">Belum ada tab.</p>
          <p className="text-[12px] mt-1">Klik &ldquo;Add Tab&rdquo; di atas untuk mulai.</p>
        </div>
      )}

      {/* ── Delete dialog ── */}
      <AlertDialog open={!!delete_target} onOpenChange={open => { if (!open) set_delete_target(null) }}>
        <AlertDialogContent className="bg-zinc-950 border-zinc-800/80 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-zinc-100 flex items-center gap-2">
              <div className="p-1.5 bg-red-500/10 rounded-md">
                <Trash2 size={16} className="text-red-400" />
              </div>
              {delete_target?.type === "tab" ? "Delete Tab?" : "Delete Section?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400 text-[14px]">
              {delete_target?.type === "tab"
                ? "This will delete the tab and all sections inside it. This action cannot be undone."
                : "This will permanently delete this section. This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-2">
            <AlertDialogCancel className="bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800 h-9">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirm_delete} className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 hover:text-red-400 h-9">
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}
