import Link from "next/link";

export default function Header() {
  return (
    <header
      style={{
        borderBottom: "1px solid #1f1f1f",
        background: "#0a0a0a",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <span
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#e5e5e5",
              letterSpacing: "-0.02em",
            }}
          >
            agentsouls
            <span style={{ color: "#7c3aed" }}>.xyz</span>
          </span>
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <Link
            href="/shop"
            style={{
              color: "#9ca3af",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Shop
          </Link>
          <Link
            href="/about"
            style={{
              color: "#9ca3af",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            About
          </Link>
          <Link
            href="/sell"
            style={{
              color: "#7c3aed",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 500,
              border: "1px solid #3d1d96",
              padding: "6px 14px",
              borderRadius: "6px",
            }}
          >
            Start Selling
          </Link>
        </nav>
      </div>
    </header>
  );
}
