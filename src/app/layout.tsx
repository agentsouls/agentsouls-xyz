import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgentSouls — Private Beta",
  description:
    "AI agents built for crypto. On-chain analysis, DeFi yield, whale tracking, smart contract audits, and more.",
  openGraph: {
    title: "AgentSouls — Private Beta",
    description: "AI agents built for crypto. Request early access.",
    url: "https://agentsouls.xyz",
  },
};

// BETA MODE: Header and Footer hidden during private beta gate.
// To restore, re-add <Header /> and <Footer /> around {children}.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://assets.calendly.com/assets/external/widget.css"
          rel="stylesheet"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <main>{children}</main>
        <Script
          src="https://assets.calendly.com/assets/external/widget.js"
          strategy="lazyOnload"
        />
        <Script id="calendly-init" strategy="lazyOnload">
          {`Calendly.initBadgeWidget({ url: 'https://calendly.com/clawbuilt-proton', text: 'Book a Call', color: '#0069ff', textColor: '#ffffff', branding: false });`}
        </Script>
      </body>
    </html>
  );
}
