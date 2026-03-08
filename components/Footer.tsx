import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-[#1f1f1f] mt-24">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#555]">
        <span>© 2026 agentsouls.xyz</span>
        <div className="flex items-center gap-5">
          <Link href="/shop" className="hover:text-[#888] transition-colors">Shop</Link>
          <Link href="/about" className="hover:text-[#888] transition-colors">About</Link>
          <a href="https://x.com/CapitalFlow69" target="_blank" rel="noopener noreferrer" className="hover:text-[#888] transition-colors">Twitter</a>
          <a href="https://github.com/capitalflow93" target="_blank" rel="noopener noreferrer" className="hover:text-[#888] transition-colors">GitHub</a>
        </div>
        <span className="text-[#333]">Built with OpenClaw</span>
      </div>
    </footer>
  )
}
