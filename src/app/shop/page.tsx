import type { Metadata } from "next";
import { products } from "@/data/products";
import CategoryFilter from "@/components/CategoryFilter";

export const metadata: Metadata = {
  title: "Shop -- agentsouls.xyz",
  description:
    "Browse all AI agent skills, prompts, and agent teams for OpenClaw.",
};

export default function ShopPage() {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ marginBottom: "40px" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "#e5e5e5",
            marginBottom: "8px",
          }}
        >
          All Skills & Agents
        </h1>
        <p style={{ color: "#9ca3af", fontSize: "15px" }}>
          {products.length} products &mdash; free and paid
        </p>
      </div>

      <CategoryFilter products={products} showSort />
    </div>
  );
}
