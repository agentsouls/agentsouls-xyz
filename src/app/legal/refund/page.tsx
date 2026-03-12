import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy — ClawBuilt",
  description: "ClawBuilt refund and guarantee policy for configs, services, and support plans.",
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5] px-6 py-20">
      <article className="max-w-3xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-white">Refund Policy</h1>
          <p className="mt-2 text-sm text-[#7a7a8a]">Last updated: March 11, 2026</p>
        </header>

        <section className="space-y-4 text-sm leading-relaxed text-[#c5c5c5]">
          <p>
            We stand behind everything we sell. Here&apos;s exactly how our refund and guarantee policy
            works for each product type.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-[#c5c5c5]">
          <h2 className="text-lg font-semibold text-white">Config Purchases ($497&ndash;$1,497)</h2>
          <p>
            Full refund within <strong className="text-white">14 days</strong> of purchase, no
            questions asked. If the Config doesn&apos;t fit your needs, email us and we&apos;ll process
            your refund.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-[#c5c5c5]">
          <h2 className="text-lg font-semibold text-white">Guided Setup ($597)</h2>
          <p>
            Full refund if the setup session does not result in a working agent deployment. Refund
            requests must be made within 7 days of the scheduled session.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-[#c5c5c5]">
          <h2 className="text-lg font-semibold text-white">Done Install ($2,497)</h2>
          <p>
            If we cannot get you live on the agreed timeline, or if the deployment does not meet the
            scope defined in your pre-install scoping call, we will refund the service fee in full.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-[#c5c5c5]">
          <h2 className="text-lg font-semibold text-white">Custom Tuning ($4,497)</h2>
          <p>
            Same scope-based guarantee as Done Install. If the delivered tuning does not meet the agreed
            scope and requirements, you receive a full refund.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-[#c5c5c5]">
          <h2 className="text-lg font-semibold text-white">Harness Migration ($1,497)</h2>
          <p>
            Same scope-based guarantee as Done Install. If the migration does not meet the agreed scope
            and timeline, you receive a full refund.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-[#c5c5c5]">
          <h2 className="text-lg font-semibold text-white">Security Audit ($997)</h2>
          <p>
            Full refund if the audit report is not delivered within the agreed timeline.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-[#c5c5c5]">
          <h2 className="text-lg font-semibold text-white">
            Support Plans (Watchdog / Guardian / Command)
          </h2>
          <p>
            No refunds on retainer months already billed. You may cancel at any time to stop future
            billing. Cancellation takes effect at the end of the current billing period.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-[#c5c5c5]">
          <h2 className="text-lg font-semibold text-white">Block Hours</h2>
          <p>
            Unused block hours can be refunded pro-rata within{" "}
            <strong className="text-white">30 days</strong> of purchase. After 30 days, remaining hours
            are non-refundable but remain valid for 12 months from purchase date.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-[#c5c5c5]">
          <h2 className="text-lg font-semibold text-white">How to Request a Refund</h2>
          <p>
            Email{" "}
            <a href="mailto:hello@clawbuilt.ai" className="text-[#e8a830] hover:underline">
              hello@clawbuilt.ai
            </a>{" "}
            with your order details. We process all refunds within 5 business days. Refunds are issued
            to the original payment method via Stripe.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-[#c5c5c5]">
          <h2 className="text-lg font-semibold text-white">Questions?</h2>
          <p>
            If you&apos;re unsure whether a product is right for you before purchasing,{" "}
            <a href="mailto:hello@clawbuilt.ai" className="text-[#e8a830] hover:underline">
              reach out
            </a>{" "}
            or book a free scoping call. We&apos;d rather help you choose the right Config than process
            a refund.
          </p>
        </section>
      </article>
    </div>
  );
}
