import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About -- agentsouls.xyz",
  description:
    "agentsouls.xyz is a marketplace for production-ready OpenClaw skills and agents.",
};

export default function AboutPage() {
  return (
    <div style={{ maxWidth: "640px", margin: "0 auto", padding: "80px 24px" }}>
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
          marginBottom: "32px",
        }}
      >
        agentsouls.xyz is a marketplace for production-ready OpenClaw skills and
        agents. Built by operators, for operators. Every tool here has been
        tested in real workflows, not demos.
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
        <a
          href="https://x.com/CapitalFlow69"
          target="_blank"
          rel="noopener noreferrer"
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
          @CapitalFlow69 on X
        </a>
      </div>
    </div>
  );
}
