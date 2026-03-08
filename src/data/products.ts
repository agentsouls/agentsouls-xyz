export type ProductType = "skill" | "agent" | "team";
export type CategoryType = "crypto" | "productivity" | "security";

export interface Product {
  slug: string;
  name: string;
  type: ProductType;
  category: CategoryType;
  description: string;
  price: number;
  downloads: number;
  github: string;
  tags: string[];
  featured: boolean;
  new: boolean;
}

export const products: Product[] = [
  {
    slug: "crypto-sentiment-digest",
    name: "Crypto Sentiment Digest",
    type: "skill",
    category: "crypto",
    description:
      "Daily sentiment brief: Fear & Greed, funding rates, BTC basis, options P/C ratio. One command, full picture.",
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
    description:
      "Scans Gitcoin, Immunefi, Layer3, and Dework for open grants and bounties. Updated daily. Zero missed opportunities.",
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
    description:
      "7-phase quality protocol that activates on trigger phrases. Prevents errors before they happen. Crypto-safe.",
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
    description:
      "Passive context monitor. Saves session state before the cliff. Auto-flushes to memory files and re-embeds with QMD.",
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
    description:
      "30 copy-paste prompts: morning signals, on-chain intel, GitHub monetization, Reddit distribution, CT content, portfolio tracking.",
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
    description:
      "Passive security patrol. Validates wallet addresses, scans for exposed keys, checks destructive commands before execution.",
    price: 0,
    downloads: 0,
    github: "https://github.com/capitalflow93/coin-watchdog",
    tags: ["security", "crypto", "wallet", "safety", "free"],
    featured: false,
    new: true,
  },
  {
    slug: "polymarket-scanner",
    name: "Polymarket Scanner",
    type: "skill",
    category: "crypto",
    description:
      "8 scanners: momentum, spread, resolution, whale, contradiction, sports, wallets, insiders. Full Polymarket alpha in one skill.",
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
    description:
      "Real-money prediction market scanner. Volume spikes, liquidity depth, contract expiry alerts, arb vs Polymarket.",
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
    description:
      "Real-time alerts for Polymarket price movements, whale entries, and resolution events. Never miss a move.",
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
    description:
      "Cross-exchange arbitrage scanner for BTC and ETH. Spot vs perp, CEX vs CEX, Kalshi vs Polymarket spreads.",
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
    description:
      "Monitors known whale wallets on BTC and ETH. Large movements, accumulation patterns, exchange inflows flagged instantly.",
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
    description:
      "Real-time liquidation level monitoring. Heatmaps, cascade risk, nearest clusters above and below spot.",
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
    description:
      "Deribit options flow: large block trades, unusual put/call positioning, IV skew changes, expiry clustering.",
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
    description:
      "Detects when Reddit/CT sentiment diverges from price action. Contrarian signals before the move.",
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
    description:
      "BTC and ETH funding rates across OKX, Binance, Bybit. Historical context, extreme readings flagged.",
    price: 12,
    downloads: 0,
    github: "https://github.com/capitalflow93/funding-rate-tool",
    tags: ["funding-rates", "crypto", "bitcoin", "trading"],
    featured: false,
    new: false,
  },
  {
    slug: "alex-crypto-analyst",
    name: "Alex -- Crypto Analyst",
    type: "agent",
    category: "crypto",
    description:
      "Quant mindset. Trader voice. Sends a daily 5-line alpha brief at 9am. On-demand market intel all day.",
    price: 49,
    downloads: 0,
    github: "https://github.com/capitalflow93/alex-crypto-analyst",
    tags: ["agent", "crypto", "analyst", "daily-brief", "bitcoin"],
    featured: true,
    new: true,
  },
  {
    slug: "the-crypto-team",
    name: "The Crypto Team",
    type: "team",
    category: "crypto",
    description:
      "Three-agent pipeline: Analyst reads the market, Researcher adds context, Writer ships the CT post. Signal to publish in one command.",
    price: 149,
    downloads: 0,
    github: "https://github.com/capitalflow93/the-crypto-team",
    tags: ["agent-team", "crypto", "analyst", "writer", "pipeline"],
    featured: true,
    new: true,
  },
];
