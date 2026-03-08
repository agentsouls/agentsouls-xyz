import Link from 'next/link'
import { Product } from '@/data/products'

const TYPE_STYLES: Record<string, string> = {
  skill: 'bg-blue-950 text-blue-400 border border-blue-900',
  agent: 'bg-purple-950 text-purple-400 border border-purple-900',
  team: 'bg-yellow-950 text-yellow-400 border border-yellow-900',
}

const TYPE_LABELS: Record<string, string> = {
  skill: 'Skill',
  agent: 'Agent',
  team: 'Agent Team',
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/items/${product.slug}`}
      className="group block bg-[#111] border border-[#1f1f1f] rounded-md p-5 hover:border-[#333] transition-all duration-150"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-medium px-2 py-0.5 rounded ${TYPE_STYLES[product.type]}`}>
            {TYPE_LABELS[product.type]}
          </span>
          {product.isNew && (
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/30">
              NEW
            </span>
          )}
        </div>
        <span className={`text-sm font-semibold shrink-0 ${product.price === 0 ? 'text-emerald-400' : 'text-white'}`}>
          {product.price === 0 ? 'Free' : `$${product.price} USDC`}
        </span>
      </div>

      <h3 className="font-semibold text-[#e5e5e5] mb-1.5 group-hover:text-white transition-colors leading-snug">
        {product.name}
      </h3>
      <p className="text-sm text-[#666] leading-relaxed line-clamp-2">
        {product.description}
      </p>

      {product.downloads > 0 && (
        <div className="mt-3 text-xs text-[#444]">
          ↓ {product.downloads.toLocaleString()} downloads
        </div>
      )}
    </Link>
  )
}
