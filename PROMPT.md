Build a complete Next.js 14 website for agentsouls.xyz — a marketplace for OpenClaw AI agent skills, prompts, and agent teams. Similar to souls.zip in concept but crypto-native and broader.

Working directory: ~/Projects/agentsouls-xyz

---

## Tech Stack

- Next.js 14 (App Router, TypeScript)
- Tailwind CSS
- Static site generation (no backend needed yet)
- Vercel deployment ready (vercel.json included)

---

## Design Aesthetic

Minimal, dark-mode first. Reference: souls.zip, linear.app, vercel.com
- Background: #0a0a0a (near black)
- Text: #e5e5e5 (off-white)
- Accent: #7c3aed (purple — brand color)
- Card backgrounds: #111111
- Border: #1f1f1f
- Font: Geist (Next.js default) or Inter
- Monospace for code/labels: Geist Mono
- NO rounded-full pills — use rounded-md max
- Tight spacing, generous whitespace between sections
- Download counts in muted text, small size

---

## Site Structure

### Pages

1. **`/` — Homepage**
   - Hero: "Production-tested AI agents and skills for OpenClaw."
   - Subhead: "Free tools to start. Premium agents when you're ready."
   - CTA button: "Browse all" → /shop
   - Featured section: 4 cards (top by download count)
   - Categories strip: All | Crypto & Trading | Productivity | Security | Agent Teams
   - Full product grid below categories (all 17 products)

2. **`/shop` — Full catalog**
   - Category filter tabs at top
   - Sortable: by downloads, by price (free first), by newest
   - Full grid of all products

3. **`/items/[slug]` — Product page**
   - Product name + type badge (Skill / Agent / Agent Team)
   - Description
   - Price (Free or $XX USDC)
   - Download count
   - Category tags
   - File preview section (show README content rendered as markdown)
   - For FREE: "Download" button → links to GitHub repo
   - For PAID: "Buy — $XX USDC" button → shows Solana Pay panel with address + instructions
   - "View on GitHub" link for all products

4. **`/about`** — one paragraph, no fluff. "agentsouls.xyz is a marketplace for production-ready OpenClaw skills and agents. Built by operators, for operators."

---

## Product Catalog Data

Create `src/data/products.ts` with this exact data:

```typescript
export const products = [
  // FREE SKILLS
  {
    slug: "crypto-sentiment-digest",
    name: "Crypto Sentiment Digest",
    type: "skill",
    category: "crypto",
    description: "Daily sentiment brief: Fear & Greed, funding rates, BTC basis, options P/C ratio. One command, full picture.",
    price: 0,
    downloads: 184,
    github: "https://github.com/capitalflow93/crypto-sentiment-digest",
    tags: ["crypto", "sentiment", "bitcoin", "daily-brief", "free"],
    featured: true,
    new: false,
  },
  {
    slug: "grant-bounty-aggregator",
    name: "Grant & Bounty Aggregator",
    type: "skill",
    category: "crypto",
    description: "Scans Gitcoin, Immunefi, Layer3, and Dework for open grants and bounties. Updated daily. Zero missed opportunities.",
    price: 0,
    downloads: 142,
    github: "https://github.com/capitalflow93/grant-bounty-aggregator",
    tags: ["crypto", "grants", "bounties", "defi", "free"],
    featured: false,
    new: false,
  },
  {
    slug: "zero-mistakes",
    name: "Zero Mistakes",
    type: "skill",
    category: "productivity",
    description: "7-phase quality protocol that activates on trigger phrases. Prevents errors before they happen. Crypto-safe.",
    price: 0,
    downloads: 0,
    github: "https://github.com/capitalflow93/zero-mistakes",
    tags: ["quality", "safety", "protocol", "productivity", "free"],
    featured: true,
    new: true,
  },
  {
    slug: "memory-guard",
    name: "Memory Guard",
    type: "skill",
    category: "productivity",
    description: "Passive context monitor. Saves session state before the cliff. Auto-flushes to memory files and re-embeds with QMD.",
    price: 0,
    downloads: 0,
    github: "https://github.com/capitalflow93/memory-guard",
    tags: ["memory", "context", "productivity", "handoff", "free"],
    featured: false,
    new: true,
  },
  {
    slug: "crypto-workflows",
    name: "30 Crypto Revenue Workflows",
    type: "skill",
    category: "crypto",
    description: "30 copy-paste prompts: morning signals, on-chain intel, GitHub monetization, Reddit distribution, CT content, portfolio tracking.",
    price: 0,
    downloads: 0,
    github: "https://github.com/capitalflow93/crypto-workflows",
    tags: ["crypto", "workflows", "prompts", "productivity", "free"],
    featured: true,
    new: true,
  },
  {
    slug: "coin-watchdog",
    name: "Coin Watchdog",
    type: "skill",
    category: "security",
    description: "Passive security patrol. Validates wallet addresses, scans for exposed keys, checks destructive commands before execution.",
    price: 0,
    downloads: 0,
    github: "https://github.com/capitalflow93/coin-watchdog",
    tags: ["security", "crypto", "wallet", "safety", "free"],
    featured: false,
    new: true,
  },
  // PAID SKILLS
  {
    slug: "polymarket-scanner",
    name: "Polymarket Scanner",
    type: "skill",
    category: "crypto",
    description: "8 scanners: momentum, spread, resolution, whale, contradiction, sports, wallets, insiders. Full Polymarket alpha in one skill.",
    price: 15,
    downloads: 0,
    github: "https://github.com/capitalflow93/polymarket-scanner",
    tags: ["polymarket", "prediction-markets", "crypto", "trading"],
    featured: false,
    new: false,
  },
  {
    slug: "kalshi-scanner",
    name: "Kalshi Scanner",
    type: "skill",
    category: "crypto",
    description: "Real-money prediction market scanner. Volume spikes, liquidity depth, contract expiry alerts, arb vs Polymarket.",
    price: 20,
    downloads: 0,
    github: "https://github.com/capitalflow93/kalshi-scanner",
    tags: ["kalshi", "prediction-markets", "crypto", "trading"],
    featured: false,
    new: false,
  },
  {
    slug: "polymarket-alert-bot",
    name: "Polymarket Alert Bot",
    type: "skill",
    category: "crypto",
    description: "Real-time alerts for Polymarket price movements, whale entries, and resolution events. Never miss a move.",
    price: 18,
    downloads: 0,
    github: "https://github.com/capitalflow93/polymarket-alert-bot",
    tags: ["polymarket", "alerts", "crypto", "trading"],
    featured: false,
    new: false,
  },
  {
    slug: "arb-scanner",
    name: "Arb Scanner",
    type: "skill",
    category: "crypto",
    description: "Cross-exchange arbitrage scanner for BTC and ETH. Spot vs perp, CEX vs CEX, Kalshi vs Polymarket spreads.",
    price: 30,
    downloads: 0,
    github: "https://github.com/capitalflow93/arb-scanner",
    tags: ["arb", "trading", "crypto", "bitcoin"],
    featured: false,
    new: false,
  },
  {
    slug: "whale-wallet-tracker",
    name: "Whale Wallet Tracker",
    type: "skill",
    category: "crypto",
    description: "Monitors known whale wallets on BTC and ETH. Large movements, accumulation patterns, exchange inflows flagged instantly.",
    price: 30,
    downloads: 0,
    github: "https://github.com/capitalflow93/whale-wallet-tracker",
    tags: ["whale", "on-chain", "crypto", "bitcoin", "trading"],
    featured: true,
    new: false,
  },
  {
    slug: "liquidation-alerts",
    name: "Liquidation Alerts",
    type: "skill",
    category: "crypto",
    description: "Real-time liquidation level monitoring. Heatmaps, cascade risk, nearest clusters above and below spot.",
    price: 25,
    downloads: 0,
    github: "https://github.com/capitalflow93/liquidation-alerts",
    tags: ["liquidations", "trading", "crypto", "bitcoin"],
    featured: false,
    new: false,
  },
  {
    slug: "options-flow-scanner",
    name: "Options Flow Scanner",
    type: "skill",
    category: "crypto",
    description: "Deribit options flow: large block trades, unusual put/call positioning, IV skew changes, expiry clustering.",
    price: 30,
    downloads: 0,
    github: "https://github.com/capitalflow93/options-flow-scanner",
    tags: ["options", "deribit", "crypto", "trading"],
    featured: false,
    new: false,
  },
  {
    slug: "social-sentiment-divergence",
    name: "Social Sentiment Divergence",
    type: "skill",
    category: "crypto",
    description: "Detects when Reddit/CT sentiment diverges from price action. Contrarian signals before the move.",
    price: 20,
    downloads: 0,
    github: "https://github.com/capitalflow93/social-sentiment-divergence",
    tags: ["sentiment", "reddit", "crypto", "trading"],
    featured: false,
    new: false,
  },
  {
    slug: "funding-rate-tool",
    name: "Funding Rate Tool",
    type: "skill",
    category: "crypto",
    description: "BTC and ETH funding rates across OKX, Binance, Bybit. Historical context, extreme readings flagged.",
    price: 12,
    downloads: 0,
    github: "https://github.com/capitalflow93/funding-rate-tool",
    tags: ["funding-rates", "crypto", "bitcoin", "trading"],
    featured: false,
    new: false,
  },
  // PAID AGENTS
  {
    slug: "alex-crypto-analyst",
    name: "Alex — Crypto Analyst",
    type: "agent",
    category: "crypto",
    description: "Quant mindset. Trader voice. Sends a daily 5-line alpha brief at 9am. On-demand market intel all day.",
    price: 49,
    downloads: 0,
    github: "https://github.com/capitalflow93/alex-crypto-analyst",
    tags: ["agent", "crypto", "analyst", "daily-brief", "bitcoin"],
    featured: true,
    new: true,
  },
  // PAID AGENT TEAMS
  {
    slug: "the-crypto-team",
    name: "The Crypto Team",
    type: "team",
    category: "crypto",
    description: "Three-agent pipeline: Analyst reads the market, Researcher adds context, Writer ships the CT post. Signal to publish in one command.",
    price: 149,
    downloads: 0,
    github: "https://github.com/capitalflow93/the-crypto-team",
    tags: ["agent-team", "crypto", "analyst", "writer", "pipeline"],
    featured: true,
    new: true,
  },
]
```

---

## Key Components to Build

### ProductCard component
- Name (bold)
- Type badge: "Skill" (blue) / "Agent" (purple) / "Agent Team" (gold)
- "NEW" badge if new: true
- Description (2 lines max, truncate)
- Price: "Free" (green) or "$XX USDC" (white)
- Downloads: "↓ 184" in muted text
- On hover: subtle border highlight

### CategoryFilter component
- Pills: All | Crypto & Trading | Productivity | Security | Agent Teams
- Active state: purple accent
- Client component for filtering

### SolanaPayPanel component (for paid product pages)
- Shows on "Buy" click
- Wallet address: `GyPhG2mBWuWGBHou9cPfDdoPMnuPYcM9QhmY4VP26ggv`
- Copy button
- Instructions: "Send $[price] USDC on Solana, then DM proof to @CapitalFlow69 on X"
- QR code optional (can skip for v1)

### Header
- Logo: "agentsouls" in bold + ".xyz" in muted purple
- Nav: Shop | About
- Right: "Start Selling" link (placeholder → /sell, page TBD)

### Footer
- "© 2026 agentsouls.xyz"
- Links: Shop | About | Twitter (@CapitalFlow69) | GitHub (capitalflow93)
- "Built with OpenClaw"

---

## SEO

In `src/app/layout.tsx`:
```typescript
export const metadata = {
  title: 'agentsouls.xyz — AI Agent Skills & Prompts for OpenClaw',
  description: 'Production-tested AI agent skills, prompts, and agent teams. Free tools to start. Premium agents when you\'re ready.',
  openGraph: {
    title: 'agentsouls.xyz',
    description: 'AI Agent Skills & Prompts for OpenClaw',
    url: 'https://agentsouls.xyz',
  }
}
```

---

## File Structure

```
agentsouls-xyz/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx          (homepage)
│   │   ├── shop/
│   │   │   └── page.tsx
│   │   ├── items/
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   └── about/
│   │       └── page.tsx
│   ├── components/
│   │   ├── ProductCard.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── SolanaPayPanel.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── data/
│       └── products.ts
├── public/
├── next.config.js
├── tailwind.config.ts
├── vercel.json
└── package.json
```

---

## vercel.json

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next"
}
```

---

## Important constraints

- No em dashes anywhere in copy
- All copy is short, direct, no puffery
- Dark mode only (no light mode toggle needed for v1)
- Must build successfully with `npm run build` — no TypeScript errors
- Product pages must be statically generated at build time using generateStaticParams
- The site must work without JavaScript for the basic listing (SSR/SSG)

---

## After building

1. Run `npm run build` to verify it compiles clean
2. Run `git add -A && git commit -m "feat: agentsouls.xyz v1.0.0 — Next.js marketplace"`
3. Install Vercel CLI if not present: `npm i -g vercel`
4. Run `vercel --prod --yes` to deploy (it will create a project automatically)
5. Note the deployment URL
6. Notify: `openclaw system event --text "Done: agentsouls.xyz built and deployed to Vercel — URL: [paste URL]" --mode now`
