'use client'
import { useState } from 'react'
import { SOLANA_ADDRESS, X_HANDLE } from '@/data/products'

export default function SolanaPayPanel({ price }: { price: number }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(SOLANA_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="border border-[#2a2a2a] rounded-md p-5 bg-[#0d0d0d] space-y-4">
      <div>
        <p className="text-sm text-[#888] mb-1">Send <span className="text-white font-semibold">${price} USDC</span> on Solana to:</p>
        <div className="flex items-center gap-2">
          <code className="text-xs text-[#a78bfa] bg-[#1a1a2e] px-3 py-2 rounded flex-1 break-all font-mono">
            {SOLANA_ADDRESS}
          </code>
          <button
            onClick={copy}
            className="shrink-0 text-xs px-3 py-2 rounded bg-[#1f1f1f] hover:bg-[#2a2a2a] text-[#888] hover:text-white transition-colors border border-[#2a2a2a]"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
      <p className="text-sm text-[#666]">
        After sending, DM proof to{' '}
        <a
          href="https://x.com/CapitalFlow69"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#7c3aed] hover:text-[#a78bfa] transition-colors"
        >
          {X_HANDLE}
        </a>{' '}
        on X. You will receive all files within 24 hours.
      </p>
    </div>
  )
}
