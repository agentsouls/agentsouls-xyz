"use client";

import { useState } from "react";

const WALLET = "GyPhG2mBWuWGBHou9cPfDdoPMnuPYcM9QhmY4VP26ggv";

interface SolanaPayPanelProps {
  price: number;
  productName: string;
}

export default function SolanaPayPanel({
  price,
  productName,
}: SolanaPayPanelProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(WALLET).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          background: "#7c3aed",
          color: "#fff",
          border: "none",
          padding: "12px 28px",
          borderRadius: "6px",
          fontSize: "15px",
          fontWeight: 600,
          cursor: "pointer",
          width: "100%",
        }}
      >
        Buy &mdash; ${price} USDC
      </button>
    );
  }

  return (
    <div
      style={{
        background: "#111111",
        border: "1px solid #1f1f1f",
        borderRadius: "8px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div>
        <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "8px" }}>
          Send <strong style={{ color: "#e5e5e5" }}>${price} USDC</strong> on
          Solana to:
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <code
            style={{
              background: "#0a0a0a",
              border: "1px solid #1f1f1f",
              borderRadius: "6px",
              padding: "8px 12px",
              fontSize: "12px",
              color: "#a78bfa",
              flex: 1,
              wordBreak: "break-all",
              fontFamily: "var(--font-geist-mono), monospace",
            }}
          >
            {WALLET}
          </code>
          <button
            onClick={copy}
            style={{
              background: copied ? "rgba(22,163,74,0.13)" : "#1f1f1f",
              color: copied ? "#4ade80" : "#9ca3af",
              border: "1px solid #1f1f1f",
              borderRadius: "6px",
              padding: "8px 14px",
              fontSize: "13px",
              cursor: "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      <div
        style={{
          background: "#0a0a0a",
          border: "1px solid #1f1f1f",
          borderRadius: "6px",
          padding: "14px",
        }}
      >
        <p
          style={{
            fontSize: "11px",
            color: "#6b7280",
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            marginBottom: "6px",
          }}
        >
          After sending
        </p>
        <p style={{ fontSize: "13px", color: "#9ca3af" }}>
          DM proof of payment to{" "}
          <a
            href="https://x.com/CapitalFlow69"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#7c3aed", textDecoration: "none" }}
          >
            @CapitalFlow69
          </a>{" "}
          on X with your transaction hash and the product name:{" "}
          <strong style={{ color: "#e5e5e5" }}>{productName}</strong>
        </p>
      </div>

      <button
        onClick={() => setOpen(false)}
        style={{
          background: "transparent",
          color: "#6b7280",
          border: "none",
          fontSize: "13px",
          cursor: "pointer",
          padding: 0,
          textAlign: "left",
        }}
      >
        Cancel
      </button>
    </div>
  );
}
