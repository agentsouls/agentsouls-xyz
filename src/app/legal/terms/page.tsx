import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — ClawBuilt",
  description: "ClawBuilt terms of service for AI agent configs, deployment services, and support plans.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5] px-6 py-20">
      <article className="max-w-3xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-white">Terms of Service</h1>
          <p className="mt-2 text-sm text-[#7a7a8a]">Last updated: March 11, 2026</p>
        </header>

        <section className="space-y-4 text-sm leading-relaxed text-[#c5c5c5]">
          <h2 className="text-lg font-semibold text-white">1. Overview</h2>
          <p>
            These Terms of Service (&quot;Terms&quot;) govern your purchase and use of AI agent configuration
            bundles (&quot;Configs&quot;), deployment services, and support plans offered by ClawBuilt
            (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) through clawbuilt.ai. By completing a
            purchase, you agree to these Terms.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-[#c5c5c5]">
          <h2 className="text-lg font-semibold text-white">2. Products and Services</h2>

          <h3 className="font-medium text-white">2.1 Config Bundles</h3>
          <p>
            Configs are digital products delivered as downloadable ZIP files. Each purchase grants a
            single, non-transferable license to deploy the Config in your business, except for Agency
            tier purchases which include reseller rights as described in Section 3.
          </p>

          <h3 className="font-medium text-white">2.2 Add-On Services</h3>
          <p>
            We offer optional deployment services including Guided Setup ($597), Done Install ($2,497),
            and Custom Tuning ($4,497). Service scope and timeline are defined during a pre-service
            scoping call. Services are delivered remotely unless otherwise agreed.
          </p>

          <h3 className="font-medium text-white">2.3 Support Plans (ActiveCare Retainers)</h3>
          <p>
            Monthly retainer plans (Watchdog $349/mo, Guardian $699/mo, Command $1,299/mo) provide
            ongoing agent monitoring, tuning, and support. Retainers include a defined number of
            support hours per month. Unused hours do not roll over unless your plan specifies otherwise.
          </p>

          <h3 className="font-medium text-white">2.4 Block Hours</h3>
          <p>
            Pre-purchased support hours (5hr/$575, 10hr/$1,100, 20hr/$2,000, 40hr/$3,800) that can be
            used for ad-hoc support requests. Block hours expire 12 months from the date of purchase.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-[#c5c5c5]">
          <h2 className="text-lg font-semibold text-white">3. Licensing</h2>
          <p>
            <strong className="text-white">Starter and Pro tiers:</strong> One license per purchase.
            The Config may be deployed for one business entity at one location. The license is
            non-transferable and non-sublicensable.
          </p>
          <p>
            <strong className="text-white">Agency tier:</strong> Includes reseller rights. You may
            deploy the Config on behalf of your clients and charge for your deployment services. You may
            not redistribute the Config files themselves without a separate written agreement.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-[#c5c5c5]">
          <h2 className="text-lg font-semibold text-white">4. Delivery</h2>
          <p>
            All Configs are delivered digitally. Upon successful payment, you will receive an email with
            a download link and license key. Download links expire after 1 hour and are limited to 5
            downloads. If you need additional downloads, contact support.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-[#c5c5c5]">
          <h2 className="text-lg font-semibold text-white">5. Refund Policy</h2>
          <p>
            <strong className="text-white">Config purchases ($497&ndash;$1,497):</strong> Full refund
            within 14 days of purchase, no questions asked.
          </p>
          <p>
            <strong className="text-white">Done Install ($2,497) and Custom Tuning ($4,497):</strong>{" "}
            If we cannot get you live on the agreed timeline, or if the deployment does not meet the
            scope defined in our pre-install scoping call, we will refund the service fee in full.
          </p>
          <p>
            <strong className="text-white">Harness Migration ($1,497):</strong> Same scope-based
            guarantee as Done Install.
          </p>
          <p>
            <strong className="text-white">Support plans:</strong> No refunds on retainer months
            already billed. You may cancel at any time to stop future billing.
          </p>
          <p>
            <strong className="text-white">Block hours:</strong> Unused block hours can be refunded
            pro-rata within 30 days of purchase.
          </p>
          <p>
            For full details, see our{" "}
            <a href="/legal/refund" className="text-[#e8a830] hover:underline">
              Refund Policy
            </a>
            .
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-[#c5c5c5]">
          <h2 className="text-lg font-semibold text-white">6. Your Responsibilities</h2>
          <p>
            You are responsible for providing accurate business information for Config setup, securing
            your own API keys and credentials, complying with all applicable laws and regulations
            (including HIPAA, state licensing requirements, and data privacy laws) in your use of the
            deployed agent, and maintaining the security of your deployment environment.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-[#c5c5c5]">
          <h2 className="text-lg font-semibold text-white">7. Limitation of Liability</h2>
          <p>
            Configs are tools that assist your business operations. They are not a substitute for
            professional advice (legal, medical, financial, or otherwise). We do not guarantee
            regulatory compliance in your jurisdiction. You are solely responsible for ensuring your use
            of any deployed agent complies with applicable laws and industry regulations.
          </p>
          <p>
            To the maximum extent permitted by law, ClawBuilt&apos;s total liability for any claim
            arising from these Terms or your use of our products shall not exceed the amount you paid
            for the specific product or service giving rise to the claim.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-[#c5c5c5]">
          <h2 className="text-lg font-semibold text-white">8. Intellectual Property</h2>
          <p>
            The Config files, system prompts, deployment guides, and all associated materials are the
            intellectual property of ClawBuilt. Your license grants you the right to use and deploy
            these materials for your business, but not to reverse-engineer, redistribute, or create
            derivative works for resale (except as permitted by Agency tier reseller rights).
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-[#c5c5c5]">
          <h2 className="text-lg font-semibold text-white">9. Modifications</h2>
          <p>
            We may update these Terms from time to time. Material changes will be communicated via email
            to active customers. Continued use of our products after changes constitutes acceptance.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-[#c5c5c5]">
          <h2 className="text-lg font-semibold text-white">10. Contact</h2>
          <p>
            For questions about these Terms, contact us at{" "}
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
