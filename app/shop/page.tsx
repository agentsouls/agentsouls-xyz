import ProductCard from '@/components/ProductCard'
import { products } from '@/data/products'

interface PageProps {
  searchParams: Promise<{ cat?: string; sort?: string }>
}

export default async function ShopPage({ searchParams }: PageProps) {
  const params = await searchParams
  const cat = params.cat ?? 'all'

  const filtered = cat === 'all'
    ? products
    : cat === 'team'
    ? products.filter(p => p.type === 'team')
    : products.filter(p => p.category === cat)

  const sorted = [...filtered].sort((a, b) => {
    // free first, then by price asc
    if (a.price === 0 && b.price > 0) return -1
    if (a.price > 0 && b.price === 0) return 1
    return a.price - b.price
  })

  const TABS = [
    { key: 'all', label: 'All' },
    { key: 'crypto', label: 'Crypto & Trading' },
    { key: 'productivity', label: 'Productivity' },
    { key: 'security', label: 'Security' },
    { key: 'team', label: 'Agent Teams' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white mb-2">Shop</h1>
        <p className="text-[#666] text-sm">{products.length} products — free to start, premium when ready</p>
      </div>

      {/* Category tabs */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1">
        {TABS.map(tab => (
          <a
            key={tab.key}
            href={`/shop${tab.key === 'all' ? '' : `?cat=${tab.key}`}`}
            className={`shrink-0 px-3 py-1.5 rounded text-sm transition-colors ${
              cat === tab.key
                ? 'bg-[#7c3aed] text-white'
                : 'text-[#666] hover:text-white border border-[#1f1f1f] hover:border-[#333]'
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sorted.map(p => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>

      {sorted.length === 0 && (
        <div className="text-center py-20 text-[#444]">No products in this category yet.</div>
      )}
    </div>
  )
}
