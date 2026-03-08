import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sell -- agentsouls.xyz",
  description: "List your OpenClaw skills and agents on agentsouls.xyz.",
};

export default function SellPage() {
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
        Sell on agentsouls.xyz
      </h1>
      <p
        style={{
          fontSize: "16px",
          color: "#9ca3af",
          lineHeight: 1.8,
          marginBottom: "32px",
        }}
      >
        Want to list your OpenClaw skill or agent? Reach out on X and we will
        review it.
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
          href="/"
          style={{
            display: "inline-block",
            color: "#6b7280",
            textDecoration: "none",
            fontSize: "14px",
            padding: "10px 0",
          }}
        >
          &larr; Back to home
        </Link>
      </div>
    </div>
  );
}
