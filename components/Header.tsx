import Link from 'next/link'

export default function Header() {
  return (
    <header className="border-b border-[#1f1f1f] bg-[#0a0a0a] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-0.5 font-bold text-lg tracking-tight">
          <span className="text-white">agentsouls</span>
          <span className="text-[#7c3aed]">.xyz</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-[#888]">
          <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
          <a
            href="https://x.com/CapitalFlow69"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            X
          </a>
        </nav>
      </div>
    </header>
  )
}
