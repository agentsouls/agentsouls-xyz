"use client";

import { useState } from "react";
import type { Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "crypto", label: "Crypto & Trading" },
  { key: "productivity", label: "Productivity" },
  { key: "security", label: "Security" },
  { key: "team", label: "Agent Teams" },
] as const;

type CategoryKey = (typeof CATEGORIES)[number]["key"];
type SortKey = "downloads" | "price-asc" | "newest";

interface CategoryFilterProps {
  products: Product[];
  showSort?: boolean;
}

export default function CategoryFilter({
  products,
  showSort = false,
}: CategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");
  const [sortKey, setSortKey] = useState<SortKey>("downloads");

  const filtered = products.filter((p) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "team") return p.type === "team";
    return p.category === activeCategory;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortKey === "downloads") return b.downloads - a.downloads;
    if (sortKey === "price-asc") return a.price - b.price;
    if (sortKey === "newest") return (b.new ? 1 : 0) - (a.new ? 1 : 0);
    return 0;
  });

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "28px",
        }}
      >
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              style={{
                background:
                  activeCategory === cat.key ? "#7c3aed" : "transparent",
                color: activeCategory === cat.key ? "#fff" : "#9ca3af",
                border:
                  activeCategory === cat.key
                    ? "1px solid #7c3aed"
                    : "1px solid #1f1f1f",
                padding: "6px 14px",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {showSort && (
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            style={{
              background: "#111111",
              color: "#9ca3af",
              border: "1px solid #1f1f1f",
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            <option value="downloads">Most downloaded</option>
            <option value="price-asc">Free first</option>
            <option value="newest">Newest</option>
          </select>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "16px",
        }}
      >
        {sorted.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
