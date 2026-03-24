/*
 * Atomicals Bot for Discord
 * Copyright (C) 2026 Atomicals LancarJaya
 *
 * Licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
 * You may not use this file except in compliance with the License.
 * See the LICENSE file for more information.
 */

"use client"

import { useState }           from "react"
import { TranscriptMessage }  from "@/components/features/transcript/transcript_message"
import {
  Mic, Users, Clock, MessageSquare,
  Search, Bell,
}                              from "lucide-react"
import { Card, CardContent }   from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input }               from "@/components/ui/input"
import { Button }              from "@/components/ui/button"
import { Checkbox }            from "@/components/ui/checkbox"
import { Label }               from "@/components/ui/label"
import { AtomicLogo }          from "@/components/icons/atomic_logo"

// - 时间格式化 - \\
// - format duration from seconds - \\
function format_duration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m ${s}s`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

export function TempvoiceClientView({
  transcript,
  user_data,
}: {
  transcript: any
  user_data : any
}) {
  const [search_query, set_search_query] = useState("")
  const [hide_bot, set_hide_bot]         = useState(false)

  const created_date = new Date(transcript.created_at * 1000).toLocaleString("en-US", {
    month  : "short",
    day    : "numeric",
    year   : "numeric",
    hour   : "2-digit",
    minute : "2-digit",
  })

  const deleted_date = new Date(transcript.deleted_at * 1000).toLocaleString("en-US", {
    month  : "short",
    day    : "numeric",
    year   : "numeric",
    hour   : "2-digit",
    minute : "2-digit",
  })

  const stats = [
    {
      title    : "Channel",
      subtitle : transcript.channel_name,
      icon     : Mic,
    },
    {
      title    : "Duration",
      subtitle : format_duration(transcript.duration_seconds),
      icon     : Clock,
    },
    {
      title    : "Visitors",
      subtitle : String(transcript.total_visitors),
      icon     : Users,
    },
    {
      title    : "Messages",
      subtitle : String(transcript.messages?.length ?? 0),
      icon     : MessageSquare,
    },
  ]

  const filtered_messages = (transcript.messages ?? []).filter((msg: any) => {
    if (hide_bot && msg.is_bot) return false
    if (!search_query) return true

    const q              = search_query.toLowerCase()
    const content_match  = msg.content?.toLowerCase().includes(q)
    const author_match   = msg.author_tag?.toLowerCase().includes(q)

    return content_match || author_match
  })

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4 md:px-6 w-full max-w-7xl mx-auto justify-between">
          {/* left: logo */}
          <div className="flex items-center gap-2">
            <AtomicLogo className="w-5 h-5 text-foreground" />
            <span className="font-semibold text-lg tracking-tight hidden sm:inline-block text-foreground">
              Voice Chat<span className="text-[#888] font-normal"> History</span>
            </span>
          </div>

          {/* center: search */}
          <div className="hidden md:flex flex-1 items-center justify-center max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search messages..."
                value={search_query}
                onChange={(e) => set_search_query(e.target.value)}
                className="w-full bg-muted/50 border-border/50 pl-9 rounded-full h-9 text-sm focus-visible:ring-1 focus-visible:bg-background"
              />
            </div>
          </div>

          {/* right: hide bot + user */}
          <div className="flex items-center gap-1 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <Checkbox
                id="hide_bot"
                checked={hide_bot}
                onCheckedChange={(v) => set_hide_bot(v === true)}
                className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 focus-visible:ring-blue-500/20"
              />
              <Label htmlFor="hide_bot" className="text-sm text-muted-foreground cursor-pointer select-none whitespace-nowrap">
                Hide BOT messages
              </Label>
            </div>

            <div className="h-4 w-px bg-border/40 mx-1 hidden sm:block" />

            <button className="flex items-center gap-2 rounded-full p-1 pl-1.5 pr-3 hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50 focus:outline-none">
              <Avatar className="h-7 w-7 border border-border/50">
                <AvatarImage src={user_data?.avatar ? `https://cdn.discordapp.com/avatars/${user_data.id}/${user_data.avatar}.png` : ""} />
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {user_data?.username?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground/90 hidden sm:block">
                {user_data?.username || "User"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* main content */}
      <div className="flex-1 w-full pt-8 pb-24">
        <div className="max-w-4xl mx-auto px-4 w-full">

          {/* mobile search */}
          <div className="w-full md:hidden relative mb-3">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search messages..."
              value={search_query}
              onChange={(e) => set_search_query(e.target.value)}
              className="w-full bg-muted/50 border-border/50 pl-9 rounded-full h-9 text-sm focus-visible:ring-1 focus-visible:bg-background"
            />
          </div>

          {/* mobile hide bot toggle */}
          <div className="flex sm:hidden items-center gap-2 mb-5">
            <Checkbox
              id="hide_bot_mobile"
              checked={hide_bot}
              onCheckedChange={(v) => set_hide_bot(v === true)}
              className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 focus-visible:ring-blue-500/20"
            />
            <Label htmlFor="hide_bot_mobile" className="text-sm text-muted-foreground cursor-pointer select-none">
              Hide BOT messages
            </Label>
          </div>

          {/* timeline info */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3 px-1">
            <span>Created: {created_date}</span>
            <span>Ended: {deleted_date}</span>
          </div>

          {/* stats cards */}
          <Card className="p-0 border-border/40 bg-[#0c0c0c] mb-5 rounded-lg shadow-sm">
            <CardContent className="flex items-center w-full lg:flex-nowrap flex-wrap px-0 py-0">
              {stats.map((item, index) => {
                const IconComponent = item.icon
                return (
                  <div
                    className="lg:w-3/12 md:w-6/12 w-full border-b md:border-b-0 border-e-0 md:border-e border-border/40 last:border-b-0 last:border-e-0 lg:[&:nth-child(2)]:border-e lg:[&:nth-child(3)]:border-e md:[&:nth-child(2)]:border-e-0"
                    key={index}
                  >
                    <div className="p-4">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex justify-between items-start">
                          <h5 className="text-sm font-medium text-[#888]">{item.title}</h5>
                          <div className="p-1.5 rounded-full border border-border/20 text-foreground/60 bg-white/[0.02]">
                            <IconComponent width={14} height={14} />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 mt-1">
                          <h5 className="text-lg font-semibold text-white truncate leading-tight" title={item.subtitle}>
                            {item.subtitle}
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* messages */}
          <div className="bg-[#0c0c0c] border border-border/40 overflow-hidden shadow-sm rounded-xl">
            {filtered_messages.length === 0 ? (
              <div className="py-12 text-center text-[#888] text-sm font-medium">
                {search_query ? "No messages found matching your search." : "No messages recorded in this voice chat."}
              </div>
            ) : (
              <div className="flex flex-col">
                {filtered_messages.map((message: any) => (
                  <TranscriptMessage
                    key={message.id}
                    message={message}
                    transcript_id={transcript.transcript_id}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
