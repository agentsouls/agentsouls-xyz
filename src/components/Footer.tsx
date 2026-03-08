import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid #1f1f1f",
        background: "#0a0a0a",
        marginTop: "80px",
        padding: "32px 24px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <p style={{ color: "#6b7280", fontSize: "13px" }}>
          &copy; 2026 agentsouls.xyz &mdash; Built with OpenClaw
        </p>
        <nav style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <Link
            href="/shop"
            style={{ color: "#6b7280", textDecoration: "none", fontSize: "13px" }}
          >
            Shop
          </Link>
          <Link
            href="/about"
            style={{ color: "#6b7280", textDecoration: "none", fontSize: "13px" }}
          >
            About
          </Link>
          <a
            href="https://x.com/CapitalFlow69"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#6b7280", textDecoration: "none", fontSize: "13px" }}
          >
            Twitter
          </a>
          <a
            href="https://github.com/capitalflow93"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#6b7280", textDecoration: "none", fontSize: "13px" }}
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
