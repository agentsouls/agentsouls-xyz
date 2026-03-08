import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { products } from "@/data/products";
import SolanaPayPanel from "@/components/SolanaPayPanel";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return {};
  return {
    title: `${product.name} -- agentsouls.xyz`,
    description: product.description,
  };
}

const TYPE_BADGE: Record<string, { label: string; color: string; bg: string }> =
  {
    skill: { label: "Skill", color: "#3b82f6", bg: "rgba(30,58,95,0.13)" },
    agent: { label: "Agent", color: "#7c3aed", bg: "rgba(61,29,150,0.13)" },
    team: {
      label: "Agent Team",
      color: "#d97706",
      bg: "rgba(120,53,15,0.13)",
    },
  };

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const badge = TYPE_BADGE[product.type] ?? TYPE_BADGE.skill;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 24px" }}>
      <Link
        href="/shop"
        style={{
          color: "#6b7280",
          textDecoration: "none",
          fontSize: "13px",
          display: "inline-block",
          marginBottom: "32px",
        }}
      >
        &larr; Back to shop
      </Link>

      <div style={{ marginBottom: "32px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "16px",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              background: badge.bg,
              color: badge.color,
              fontSize: "11px",
              fontWeight: 600,
              padding: "3px 8px",
              borderRadius: "4px",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            {badge.label}
          </span>
          {product.new && (
            <span
              style={{
                background: "rgba(124,58,237,0.13)",
                color: "#a78bfa",
                fontSize: "11px",
                fontWeight: 600,
                padding: "3px 8px",
                borderRadius: "4px",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              NEW
            </span>
          )}
          {product.downloads > 0 && (
            <span
              style={{
                fontSize: "13px",
                color: "#6b7280",
                marginLeft: "auto",
              }}
            >
              &darr; {product.downloads} downloads
            </span>
          )}
        </div>

        <h1
          style={{
            fontSize: "32px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "#e5e5e5",
            marginBottom: "16px",
          }}
        >
          {product.name}
        </h1>

        <p
          style={{
            fontSize: "16px",
            color: "#9ca3af",
            lineHeight: 1.7,
            marginBottom: "24px",
          }}
        >
          {product.description}
        </p>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {product.tags.map((tag) => (
            <span
              key={tag}
              style={{
                background: "#111111",
                border: "1px solid #1f1f1f",
                color: "#6b7280",
                fontSize: "11px",
                padding: "3px 8px",
                borderRadius: "4px",
                fontFamily: "var(--font-geist-mono), monospace",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div style={{ borderTop: "1px solid #1f1f1f", marginBottom: "32px" }} />

      <div style={{ marginBottom: "32px" }}>
        <div style={{ marginBottom: "20px" }}>
          <span
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: product.price === 0 ? "#4ade80" : "#e5e5e5",
            }}
          >
            {product.price === 0 ? "Free" : `$${product.price} USDC`}
          </span>
        </div>

        {product.price === 0 ? (
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <a
              href={product.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                background: "#e5e5e5",
                color: "#0a0a0a",
                textDecoration: "none",
                padding: "12px 28px",
                borderRadius: "6px",
                fontSize: "15px",
                fontWeight: 600,
              }}
            >
              Download free
            </a>
            <a
              href={product.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                background: "transparent",
                color: "#9ca3af",
                textDecoration: "none",
                padding: "12px 20px",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: 500,
                border: "1px solid #1f1f1f",
              }}
            >
              View on GitHub &rarr;
            </a>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <SolanaPayPanel price={product.price} productName={product.name} />
            <a
              href={product.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#9ca3af",
                textDecoration: "none",
                fontSize: "13px",
              }}
            >
              View on GitHub &rarr;
            </a>
          </div>
        )}
      </div>

      <div
        style={{
          background: "#111111",
          border: "1px solid #1f1f1f",
          borderRadius: "8px",
          padding: "24px",
        }}
      >
        <h2
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "#6b7280",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            marginBottom: "14px",
          }}
        >
          README
        </h2>
        <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: 1.7 }}>
          {product.description}
        </p>
        <a
          href={`${product.github}#readme`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            color: "#7c3aed",
            textDecoration: "none",
            fontSize: "13px",
            marginTop: "16px",
          }}
        >
          Read full documentation on GitHub &rarr;
        </a>
      </div>
    </div>
  );
}
