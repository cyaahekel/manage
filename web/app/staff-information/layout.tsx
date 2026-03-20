/*
 * Atomicals Bot for Discord
 * Copyright (C) 2026 Atomicals LancarJaya
 *
 * Licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
 * You may not use this file except in compliance with the License.
 * See the LICENSE file for more information.
 */

'use client'

import { useEffect, useState }  from 'react'
import { useRouter }            from 'next/navigation'
import { Skeleton }             from '@/components/ui/skeleton'

export default function StaffInformationLayout({ children }: { children: React.ReactNode }) {
  const router                          = useRouter()
  const [loading, set_loading]          = useState(true)
  const [authorized, set_authorized]    = useState(false)

  useEffect(() => {
    fetch('/api/auth/check')
      .then(r => r.json())
      .then(data => {
        if (!data.authenticated) {
          router.push(`/api/auth/discord?return_to=/staff-information/read-only`)
          return
        }
        set_authorized(true)
        set_loading(false)
      })
      .catch(() => router.push('/login'))
  }, [router])

  if (loading || !authorized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-foreground dark">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    )
  }

  return (
    <div className="dark bg-background text-foreground min-h-screen font-sans">
      {children}
    </div>
  )
}
