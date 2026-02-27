import { Metadata } from 'next'
import './globals.css'
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="en" className={cn("dark", inter.variable)}>
      <body>{children}</body>
    </html>
  )
}
