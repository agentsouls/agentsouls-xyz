import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sell -- agentsouls.xyz",
  description: "List your AI skill, agent, or bundle on agentsouls.xyz.",
};

export default function SellPage() {
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
        Sell on agentsouls.xyz
      </h1>
      <p
        style={{
          fontSize: "16px",
          color: "#9ca3af",
          lineHeight: 1.8,
          marginBottom: "20px",
        }}
      >
        Built a serious AI skill, agent, bundle, or operator workflow? We are interested
        in outcome-driven tools that save time, improve decisions, or generate real leverage.
      </p>
      <p
        style={{
          fontSize: "16px",
          color: "#9ca3af",
          lineHeight: 1.8,
          marginBottom: "32px",
        }}
      >
        Strong fits: trading, research, operator automation, security, and business workflows.
        If it solves a real job and can ship cleanly, send it.
      </p>
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <a
          href="https://x.com/CapitalFlow69"
          target="_blank"
          rel="noopener noreferrer"
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
          DM @CapitalFlow69
        </a>
        <Link
          href="/shop"
          style={{
            display: "inline-block",
            color: "#6b7280",
            textDecoration: "none",
            fontSize: "14px",
            padding: "10px 0",
          }}
        >
          Browse current offers
        </Link>
      </div>
    </div>
  );
}
