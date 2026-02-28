import { Metadata } from 'next'
import './globals.css'
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title       : 'Atomic Bypasser',
  description : 'Bypass links with Atomic Bypasser - Fast, reliable, and secure link bypassing service.',
  icons       : {
    icon   : '/atomc.svg',
    apple  : '/atomc.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn("dark", GeistSans.variable, GeistMono.variable)}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
