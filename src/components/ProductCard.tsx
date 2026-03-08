import Link from "next/link";
import type { Product } from "@/data/products";

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

export default function ProductCard({ product }: { product: Product }) {
  const badge = TYPE_BADGE[product.type] ?? TYPE_BADGE.skill;

  return (
    <Link
      href={`/items/${product.slug}`}
      style={{ textDecoration: "none", display: "block", height: "100%" }}
    >
      <div
        className="product-card"
        style={{
          background: "#111111",
          border: "1px solid #1f1f1f",
          borderRadius: "8px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          height: "100%",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "8px",
          }}
        >
          <h3
            style={{
              fontSize: "15px",
              fontWeight: 600,
              color: "#e5e5e5",
              lineHeight: "1.3",
            }}
          >
            {product.name}
          </h3>
          <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
            {product.new && (
              <span
                style={{
                  background: "rgba(124,58,237,0.13)",
                  color: "#a78bfa",
                  fontSize: "10px",
                  fontWeight: 600,
                  padding: "2px 6px",
                  borderRadius: "4px",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                NEW
              </span>
            )}
            <span
              style={{
                background: badge.bg,
                color: badge.color,
                fontSize: "10px",
                fontWeight: 600,
                padding: "2px 6px",
                borderRadius: "4px",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              {badge.label}
            </span>
          </div>
        </div>

        <p
          style={{
            fontSize: "13px",
            color: "#9ca3af",
            lineHeight: "1.5",
            flex: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.description}
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "4px",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: product.price === 0 ? "#4ade80" : "#e5e5e5",
            }}
          >
            {product.price === 0 ? "Free" : `$${product.price} USDC`}
          </span>
          {product.downloads > 0 && (
            <span style={{ fontSize: "12px", color: "#6b7280" }}>
              &darr; {product.downloads}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
