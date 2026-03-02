'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Search } from "lucide-react"

export default function TranscriptsPage() {
  return (
    <div className="flex-1 space-y-6 lg:p-10 p-4 md:p-8 pt-6 pb-20 dark text-foreground bg-background min-h-full selection:bg-primary/20">
      
      {/* - HEADER - \\ */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-1">Transcripts</h2>
          <p className="text-muted-foreground text-sm">
            Search and view previously saved ticket transcripts.
          </p>
        </div>
      </div>

      {/* - CONTENT - \\ */}
      <Card className="bg-zinc-950/40 border-border/40 backdrop-blur-sm shadow-sm max-w-2xl mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="w-4 h-4 text-primary" /> Lookup Transcript
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Enter a Ticket ID or User ID to fetch chat logs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 mt-2">
            <input 
              type="text" 
              placeholder="e.g. ticket-1234..." 
              className="flex-1 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-all text-zinc-200 placeholder:text-zinc-600"
            />
            <button className="px-5 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors">
              Search
            </button>
          </div>
          
          <div className="mt-8 flex flex-col items-center justify-center p-8 border border-dashed border-zinc-800 rounded-lg text-center bg-zinc-900/10">
            <Search className="w-8 h-8 text-zinc-700 mb-3" />
            <h3 className="text-zinc-300 font-medium text-sm">No recent searches</h3>
            <p className="text-zinc-500 text-xs mt-1 max-w-[250px]">
              Transcripts will appear here when you lookup a ticket.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}