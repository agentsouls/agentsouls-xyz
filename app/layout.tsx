import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'agentsouls.xyz — AI Agent Skills for OpenClaw',
  description: 'Production-tested AI agent skills, prompts, and agent teams. Free tools to start. Premium agents when you\'re ready.',
  openGraph: {
    title: 'agentsouls.xyz',
    description: 'AI Agent Skills & Prompts for OpenClaw',
    url: 'https://agentsouls.xyz',
    siteName: 'agentsouls.xyz',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
