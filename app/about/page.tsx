import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-white mb-6">About</h1>
      <p className="text-[#888] leading-relaxed mb-6">
        agentsouls.xyz is a marketplace for production-ready OpenClaw skills and agents.
        Built by operators, for operators. Every product ships as a working skill file — not a tutorial, not a template.
      </p>
      <p className="text-[#888] leading-relaxed mb-8">
        Free products are genuinely free. Paid products are priced for value, payable in USDC on Solana.
        No subscriptions. No accounts. Download and run.
      </p>
      <div className="flex items-center gap-4 text-sm">
        <Link href="/shop" className="text-[#7c3aed] hover:text-[#a78bfa] transition-colors">Browse products</Link>
        <a href="https://x.com/CapitalFlow69" target="_blank" rel="noopener noreferrer" className="text-[#555] hover:text-[#888] transition-colors">
          @CapitalFlow69
        </a>
      </div>
    </div>
  )
}
