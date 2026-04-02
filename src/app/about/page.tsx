import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About -- agentsouls.xyz",
  description:
    "agentsouls.xyz sells outcome-driven AI tools, bundles, and operator workflows for traders, builders, and researchers.",
};

export default function AboutPage() {
  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "80px 24px" }}>
      <h1
        style={{
          fontSize: "28px",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: "#e5e5e5",
          marginBottom: "24px",
        }}
      >
        About
      </h1>
      <p
        style={{
          fontSize: "16px",
          color: "#9ca3af",
          lineHeight: 1.8,
          marginBottom: "20px",
        }}
      >
        agentsouls.xyz is a marketplace for outcome-driven AI tools, skills, bundles,
        and operator workflows. Built by operators, for operators. The focus is simple:
        help traders, researchers, and builders move faster with tools that solve real jobs.
      </p>
      <p
        style={{
          fontSize: "16px",
          color: "#9ca3af",
          lineHeight: 1.8,
          marginBottom: "32px",
        }}
      >
        That means pricing clarity, direct use cases, and products designed around execution:
        market discovery, strategy validation, operator automation, and security hardening.
      </p>
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <Link
          href="/shop"
          style={{
            display: "inline-block",
            background: "#7c3aed",
            color: "#fff",
            textDecoration: "none",
            padding: "10px 24px",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          Browse the shop
        </Link>
        <Link
          href="/items/security-audit-sku"
          style={{
            display: "inline-block",
            background: "transparent",
            color: "#9ca3af",
            textDecoration: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: 500,
            border: "1px solid #1f1f1f",
          }}
        >
          View the security audit
        </Link>
      </div>
    </div>
  );
}
