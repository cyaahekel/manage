'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppSidebar from '@/components/shadcn-space/blocks/dashboard-shell-01/app-sidebar'
import { Loader2 } from 'lucide-react'

export type DiscordUser = {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
};

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [loading, set_loading] = useState(true)
  const [user, set_user] = useState<DiscordUser | null>(null)

  useEffect(() => {
    fetch('/api/auth/check')
      .then(r => r.json())
      .then(data => {
        if (!data.authenticated) {
          router.push(`/api/auth/discord?return_to=/staff/dashboard`)
          return
        }
        set_user(data.user)
        set_loading(false)
      })
      .catch(() => router.push('/login'))
  }, [router])

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-foreground dark">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="dark bg-background text-foreground min-h-screen font-sans overflow-hidden">
      <AppSidebar user={user}>
        <div className="w-full p-6 md:p-8 animate-in fade-in slide-in-from-bottom-2 duration-500 overflow-y-auto">
          {children}
        </div>
      </AppSidebar>
    </div>
  )
}
