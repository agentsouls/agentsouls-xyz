"use client";
import { useState } from "react";

export default function BetaGate() {
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");
    try {
      const res = await fetch("https://formsubmit.co/ajax/agentsouls@proton.me", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          organisation: org || "Not specified",
          role: role || "Not specified",
          _subject: "AgentSouls Beta Signup",
          _captcha: "false",
        }),
      });
      const data = await res.json();
      if (data.success === "true" || res.ok) {
        setStatus("done");
      } else {
        setErrorMsg("Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
      }}
    >
      {/* Badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(124, 58, 237, 0.12)",
          border: "1px solid rgba(124, 58, 237, 0.3)",
          borderRadius: "100px",
          padding: "6px 16px",
          marginBottom: "40px",
        }}
      >
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#7c3aed",
            display: "inline-block",
          }}
        />
        <span
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "#a78bfa",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Private Beta
        </span>
      </div>

      {/* Headline */}
      <h1
        style={{
          fontSize: "clamp(28px, 5vw, 48px)",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          color: "#e5e5e5",
          textAlign: "center",
          maxWidth: "560px",
          marginBottom: "20px",
        }}
      >
        Purpose-built AI agents and skills.
      </h1>

      <p
        style={{
          fontSize: "16px",
          color: "#6b7280",
          lineHeight: 1.65,
          textAlign: "center",
          maxWidth: "480px",
          marginBottom: "16px",
        }}
      >
        Skills, agents, and multi-agent teams for traders, researchers,
        builders, and operators. Plug in and ship faster.
      </p>

      <p
        style={{
          fontSize: "14px",
          color: "#4b5563",
          textAlign: "center",
          marginBottom: "48px",
        }}
      >
        Works with Claude Code, Cursor, Windsurf, Codex, and more.
      </p>

      {/* Category chips */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "8px",
          maxWidth: "560px",
          marginBottom: "52px",
        }}
      >
        {[
          "Trading",
          "Research",
          "Productivity",
          "Security",
          "Writing",
          "Development",
          "Prediction Markets",
          "On-Chain",
          "Multi-Agent",
          "Data",
          "+ more",
        ].map((item) => (
          <span
            key={item}
            style={{
              fontSize: "12px",
              color: "#6b7280",
              border: "1px solid #1f1f1f",
              borderRadius: "4px",
              padding: "4px 10px",
              background: "#111",
            }}
          >
            {item}
          </span>
        ))}
      </div>

      {/* Native signup form */}
      {status === "done" ? (
        <div
          style={{
            width: "100%",
            maxWidth: "420px",
            background: "#111",
            borderRadius: "12px",
            border: "1px solid #1f1f1f",
            padding: "32px 28px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>✓</div>
          <p style={{ color: "#e5e5e5", fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>
            You&apos;re on the list.
          </p>
          <p style={{ color: "#6b7280", fontSize: "14px" }}>
            We&apos;ll reach out when your access is ready.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            maxWidth: "420px",
            background: "#111",
            borderRadius: "12px",
            border: "1px solid #1f1f1f",
            padding: "28px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div>
            <label style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "6px", display: "block" }}>
              Email <span style={{ color: "#7c3aed" }}>*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "#0a0a0a",
                border: "1px solid #2a2a2a",
                borderRadius: "8px",
                color: "#e5e5e5",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "6px", display: "block" }}>
              Organisation <span style={{ color: "#7c3aed" }}>*</span>
            </label>
            <input
              type="text"
              required
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              placeholder="Your company or fund"
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "#0a0a0a",
                border: "1px solid #2a2a2a",
                borderRadius: "8px",
                color: "#e5e5e5",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "6px", display: "block" }}>
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "#0a0a0a",
                border: "1px solid #2a2a2a",
                borderRadius: "8px",
                color: role ? "#e5e5e5" : "#6b7280",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
                appearance: "none",
                WebkitAppearance: "none",
              }}
            >
              <option value="">Select your role...</option>
              <option value="Trader">Trader</option>
              <option value="Developer">Developer</option>
              <option value="Fund / Portfolio">Fund / Portfolio</option>
              <option value="Researcher">Researcher</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {status === "error" && (
            <p style={{ color: "#ef4444", fontSize: "13px", marginTop: "-4px" }}>
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            style={{
              width: "100%",
              padding: "12px",
              background: status === "sending" ? "#4c1d95" : "#7c3aed",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: status === "sending" ? "wait" : "pointer",
              marginTop: "4px",
              transition: "background 0.2s",
            }}
          >
            {status === "sending" ? "Submitting..." : "Request Early Access"}
          </button>
        </form>
      )}

      {/* Social proof */}
      <p
        style={{
          fontSize: "13px",
          color: "#374151",
          marginTop: "40px",
          textAlign: "center",
        }}
      >
        Early access granted to traders, researchers, builders, and teams.
      </p>
    </div>
  );
}
