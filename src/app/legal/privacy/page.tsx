import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — ClawBuilt",
  description: "How ClawBuilt collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5] px-6 py-20">
      <article className="max-w-3xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-white">Privacy Policy</h1>
          <p className="mt-2 text-sm text-[#7a7a8a]">Last updated: March 11, 2026</p>
        </header>

        <section className="space-y-4 text-sm leading-relaxed text-[#c5c5c5]">
          <h2 className="text-lg font-semibold text-white">1. Introduction</h2>
          <p>
            ClawBuilt (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy. This
            Privacy Policy explains how we collect, use, disclose, and safeguard your information when
            you visit clawbuilt.ai or purchase our products and services.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-[#c5c5c5]">
          <h2 className="text-lg font-semibold text-white">2. Information We Collect</h2>

          <h3 className="font-medium text-white">2.1 Information You Provide</h3>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Email address (at checkout and booking)</li>
            <li>Name and business details (during scoping calls and service delivery)</li>
            <li>Payment information (processed by Stripe; we do not store card numbers)</li>
            <li>Booking preferences (via Cal.com)</li>
            <li>Support communications (via email and Slack)</li>
          </ul>

          <h3 className="font-medium text-white">2.2 Information Collected Automatically</h3>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Browser type, device type, and operating system</li>
            <li>IP address and approximate location</li>
            <li>Pages visited, time spent, and referral source</li>
            <li>Download activity associated with your license key</li>
          </ul>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-[#c5c5c5]">
          <h2 className="text-lg font-semibold text-white">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Process payments and deliver purchased products</li>
            <li>Send transactional emails (purchase confirmations, download links, service updates)</li>
            <li>Provide deployment and support services</li>
            <li>Manage license keys and download access</li>
            <li>Improve our website and products</li>
            <li>Respond to support inquiries</li>
          </ul>
          <p>
            We do not sell your personal information. We do not send marketing emails unless you
            explicitly opt in.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-[#c5c5c5]">
          <h2 className="text-lg font-semibold text-white">4. Third-Party Services</h2>
          <p>We use the following third-party services to operate our business:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>
              <strong className="text-white">Stripe</strong> &mdash; Payment processing. Stripe
              collects and processes payment information under its own privacy policy.
            </li>
            <li>
              <strong className="text-white">Supabase</strong> &mdash; Database hosting for customer
              records, license keys, and order data.
            </li>
            <li>
              <strong className="text-white">Resend</strong> &mdash; Transactional email delivery.
            </li>
            <li>
              <strong className="text-white">Cloudflare</strong> &mdash; Content delivery and config
              file hosting (R2).
            </li>
            <li>
              <strong className="text-white">Cal.com</strong> &mdash; Appointment booking.
            </li>
            <li>
              <strong className="text-white">Vercel</strong> &mdash; Website hosting and analytics.
            </li>
          </ul>
          <p>
            Each third-party service processes data in accordance with its own privacy policy. We only
            share the minimum data necessary for each service to function.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-[#c5c5c5]">
          <h2 className="text-lg font-semibold text-white">5. Data Retention</h2>
          <p>
            We retain your purchase records and license information for as long as your license is
            active. Support communications are retained for 2 years after last contact. You may request
            deletion at any time (see Section 7).
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-[#c5c5c5]">
          <h2 className="text-lg font-semibold text-white">6. Data Security</h2>
          <p>
            We implement commercially reasonable security measures to protect your information,
            including encrypted connections (TLS), secure credential storage, and access controls on our
            databases. However, no method of transmission over the internet is 100% secure.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-[#c5c5c5]">
          <h2 className="text-lg font-semibold text-white">7. Your Rights</h2>
          <p>
            Depending on your jurisdiction (including under CCPA and GDPR), you may have the right to:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your personal information</li>
            <li>Request a portable copy of your data</li>
            <li>Opt out of any future marketing communications</li>
          </ul>
          <p>
            To exercise any of these rights, email us at{" "}
            <a href="mailto:hello@clawbuilt.ai" className="text-[#e8a830] hover:underline">
              hello@clawbuilt.ai
            </a>
            . We will respond within 30 days.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-[#c5c5c5]">
          <h2 className="text-lg font-semibold text-white">8. Cookies</h2>
          <p>
            We use essential cookies for site functionality. We may use analytics cookies (via Vercel
            Analytics) to understand site usage. You can disable cookies in your browser settings,
            though some site features may not function properly.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-[#c5c5c5]">
          <h2 className="text-lg font-semibold text-white">9. Children&apos;s Privacy</h2>
          <p>
            Our services are not directed to individuals under 18. We do not knowingly collect personal
            information from children.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-[#c5c5c5]">
          <h2 className="text-lg font-semibold text-white">10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify active customers of
            material changes via email. The &quot;Last updated&quot; date at the top of this page
            reflects the most recent revision.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-[#c5c5c5]">
          <h2 className="text-lg font-semibold text-white">11. Contact</h2>
          <p>
            For questions about this Privacy Policy, contact us at{" "}
            <a href="mailto:hello@clawbuilt.ai" className="text-[#e8a830] hover:underline">
              hello@clawbuilt.ai
            </a>
            .
          </p>
        </section>
      </article>
    </div>
  );
}
