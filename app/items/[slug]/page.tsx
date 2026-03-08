import { notFound } from 'next/navigation'
import Link from 'next/link'
import { products, SOLANA_ADDRESS, X_HANDLE } from '@/data/products'
import SolanaPayPanel from '@/components/SolanaPayPanel'

export async function generateStaticParams() {
  return products.map(p => ({ slug: p.slug }))
}

interface PageProps {
  params: Promise<{ slug: string }>
}

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

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const product = products.find(p => p.slug === slug)
  if (!product) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#444] mb-8">
        <Link href="/shop" className="hover:text-[#888] transition-colors">Shop</Link>
        <span>/</span>
        <span className="text-[#666]">{product.name}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-xs font-medium px-2 py-0.5 rounded ${TYPE_STYLES[product.type]}`}>
            {TYPE_LABELS[product.type]}
          </span>
          {product.isNew && (
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/30">
              NEW
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold text-white mb-3">{product.name}</h1>
        <p className="text-[#888] text-lg leading-relaxed">{product.description}</p>
      </div>

      {/* Price + CTA */}
      <div className="border border-[#1f1f1f] rounded-md p-6 mb-8 bg-[#0d0d0d]">
        <div className="flex items-center justify-between mb-4">
          <span className={`text-2xl font-bold ${product.price === 0 ? 'text-emerald-400' : 'text-white'}`}>
            {product.price === 0 ? 'Free' : `$${product.price} USDC`}
          </span>
          {product.downloads > 0 && (
            <span className="text-sm text-[#444]">↓ {product.downloads.toLocaleString()} downloads</span>
          )}
        </div>

        {product.price === 0 ? (
          <a
            href={product.github}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-5 py-3 rounded-md text-sm font-medium transition-colors"
          >
            Download on GitHub
          </a>
        ) : (
          <SolanaPayPanel price={product.price} />
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        {product.tags.map(tag => (
          <span key={tag} className="text-xs px-2 py-1 rounded bg-[#111] border border-[#1f1f1f] text-[#555]">
            {tag}
          </span>
        ))}
      </div>

      {/* GitHub link */}
      <div className="border-t border-[#1f1f1f] pt-6">
        <a
          href={product.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[#555] hover:text-[#888] transition-colors flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          View on GitHub
        </a>
      </div>
    </div>
  )
}
