
"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface LogEntry {
  id: number
  bot_name: string
  level: string
  message: string
  created_at: string
}

const BOTS = ["All", "JKT48 Bot", "Bypass BOT", "Atomicals BOT"]

export default function ConsolePage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [selectedBot, setSelectedBot] = useState("All")
  const [autoScroll, setAutoScroll] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/logs")
      if (res.ok) {
        const data = await res.json()
        setLogs(data)
      }
    } catch (error) {
      console.error("Failed to fetch logs", error)
    }
  }

  useEffect(() => {
    fetchLogs()
    const interval = setInterval(fetchLogs, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs, autoScroll, selectedBot])

  const filteredLogs = logs.filter(log => 
    selectedBot === "All" || log.bot_name === selectedBot
  ).reverse() // API returns Newest first, we want Oldest first (at top) for terminal feel
  
  const getLevelColor = (level: string) => {
    switch (level.toUpperCase()) {
      case "INFO": return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
      case "WARN": return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      case "ERROR": return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      case "SUCCESS": return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      default: return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
    }
  }

  return (
    <div className="container mx-auto p-6 h-screen flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bot Console</h1>
        <div className="flex gap-2">
          <Button 
            variant={autoScroll ? "default" : "outline"}
            onClick={() => setAutoScroll(!autoScroll)}
            size="sm"
          >
            {autoScroll ? "Auto-scroll: ON" : "Auto-scroll: OFF"}
          </Button>
          <Button variant="outline" size="sm" onClick={fetchLogs}>
            Refresh
          </Button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {BOTS.map(bot => (
          <Button
            key={bot}
            variant={selectedBot === bot ? "default" : "secondary"}
            onClick={() => setSelectedBot(bot)}
            className="min-w-[100px]"
          >
            {bot}
          </Button>
        ))}
      </div>

      <Card className="flex-1 overflow-hidden bg-black border-zinc-800">
        <CardContent className="p-0 h-full">
          <div 
            ref={scrollRef}
            className="h-full overflow-auto p-4 space-y-2 font-mono text-sm"
          >
            {filteredLogs.length === 0 ? (
              <div className="text-zinc-500 text-center py-10">No logs found...</div>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="flex gap-2">
                  <span className="text-zinc-500 whitespace-nowrap">
                    {new Date(log.created_at).toLocaleTimeString()}
                  </span>
                  <Badge variant="outline" className={`text-[10px] px-1 py-0 h-5 border-0 ${getLevelColor(log.level)}`}>
                    {log.level}
                  </Badge>
                  <span className="text-zinc-400 font-bold whitespace-nowrap min-w-[120px]">
                    [{log.bot_name}]
                  </span>
                  <span className="text-zinc-300 break-all whitespace-pre-wrap">
                    {log.message.replace(`[${log.bot_name}]`, "").replace(/\[.*?\]/g, "").trim() || log.message}
                  </span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
