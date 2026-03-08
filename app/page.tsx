import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import { products } from '@/data/products'

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'crypto', label: 'Crypto & Trading' },
  { key: 'productivity', label: 'Productivity' },
  { key: 'security', label: 'Security' },
  { key: 'team', label: 'Agent Teams' },
]

export default function Home() {
  const featured = products.filter(p => p.featured)
  const freeCount = products.filter(p => p.price === 0).length
  const totalDownloads = products.reduce((sum, p) => sum + p.downloads, 0)

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Hero */}
      <div className="mb-16 max-w-2xl">
        <div className="inline-flex items-center gap-2 text-xs text-[#7c3aed] bg-[#7c3aed]/10 border border-[#7c3aed]/20 px-3 py-1 rounded mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed] animate-pulse" />
          {products.length} products — {freeCount} free
        </div>
        <h1 className="text-4xl font-bold text-white mb-4 leading-tight tracking-tight">
          Production-tested AI agents<br />and skills for OpenClaw.
        </h1>
        <p className="text-[#666] text-lg mb-8">
          Free tools to start. Premium agents when you're ready.
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/shop"
            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-5 py-2.5 rounded-md text-sm font-medium transition-colors"
          >
            Browse all
          </Link>
          <a
            href="https://github.com/capitalflow93"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#666] hover:text-white px-5 py-2.5 rounded-md text-sm transition-colors border border-[#1f1f1f] hover:border-[#333]"
          >
            GitHub
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-8 mb-16 text-sm">
        <div>
          <span className="text-2xl font-bold text-white">{products.length}</span>
          <span className="text-[#555] ml-2">products</span>
        </div>
        <div className="w-px h-8 bg-[#1f1f1f]" />
        <div>
          <span className="text-2xl font-bold text-white">{freeCount}</span>
          <span className="text-[#555] ml-2">free</span>
        </div>
        <div className="w-px h-8 bg-[#1f1f1f]" />
        <div>
          <span className="text-2xl font-bold text-white">{totalDownloads.toLocaleString()}</span>
          <span className="text-[#555] ml-2">downloads</span>
        </div>
      </div>

      {/* Featured */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-medium text-[#666] uppercase tracking-wider">Featured</h2>
          <Link href="/shop" className="text-sm text-[#555] hover:text-white transition-colors">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {featured.map(p => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-sm font-medium text-[#666] uppercase tracking-wider mb-6">Browse by category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CATEGORIES.filter(c => c.key !== 'all').map(cat => {
            const count = cat.key === 'team'
              ? products.filter(p => p.type === 'team').length
              : products.filter(p => p.category === cat.key).length
            return (
              <Link
                key={cat.key}
                href={`/shop?cat=${cat.key}`}
                className="border border-[#1f1f1f] rounded-md p-4 hover:border-[#333] transition-colors group"
              >
                <div className="text-white font-medium text-sm group-hover:text-[#a78bfa] transition-colors">
                  {cat.label}
                </div>
                <div className="text-[#444] text-xs mt-1">{count} products</div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
