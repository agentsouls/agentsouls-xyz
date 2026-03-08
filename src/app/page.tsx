import Link from "next/link";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const FEATURED = products.filter((p) => p.featured);

const CATEGORIES = [
  { key: "all", label: "All", href: "/shop" },
  { key: "crypto", label: "Crypto & Trading", href: "/shop" },
  { key: "productivity", label: "Productivity", href: "/shop" },
  { key: "security", label: "Security", href: "/shop" },
  { key: "team", label: "Agent Teams", href: "/shop" },
];

export default function HomePage() {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
      {/* Hero */}
      <section style={{ padding: "80px 0 64px" }}>
        <div style={{ maxWidth: "640px" }}>
          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "#e5e5e5",
              marginBottom: "20px",
            }}
          >
            Production-tested AI agents and skills for OpenClaw.
          </h1>
          <p
            style={{
              fontSize: "17px",
              color: "#9ca3af",
              lineHeight: 1.6,
              marginBottom: "32px",
            }}
          >
            Free tools to start. Premium agents when you&apos;re ready.
          </p>
          <Link
            href="/shop"
            style={{
              display: "inline-block",
              background: "#7c3aed",
              color: "#fff",
              textDecoration: "none",
              padding: "12px 28px",
              borderRadius: "6px",
              fontSize: "15px",
              fontWeight: 600,
            }}
          >
            Browse all
          </Link>
        </div>
      </section>

      {/* Featured */}
      <section style={{ marginBottom: "64px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "#e5e5e5",
              letterSpacing: "-0.01em",
            }}
          >
            Featured
          </h2>
          <Link
            href="/shop"
            style={{
              color: "#7c3aed",
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            View all &rarr;
          </Link>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {FEATURED.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      {/* Categories strip */}
      <section style={{ marginBottom: "48px" }}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.key}
              href={cat.href}
              style={{
                color: "#9ca3af",
                textDecoration: "none",
                border: "1px solid #1f1f1f",
                padding: "6px 14px",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      {/* All products grid */}
      <section style={{ marginBottom: "80px" }}>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 600,
            color: "#e5e5e5",
            letterSpacing: "-0.01em",
            marginBottom: "24px",
          }}
        >
          All skills & agents
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
