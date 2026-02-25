import RateTable from "@/components/RateTable";
import HowItWorks from "@/components/HowItWorks";
import Faq from "@/components/Faq";

export default function Home() {
  return (
    <main>

      {/* Hero Section */}
      <section className="bg-cream py-20 sm:py-28 px-4">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">

          {/* Tag line badge */}
          <span className="bg-gold/15 text-gold font-semibold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full">
            Georgia Natural Gas Comparison
          </span>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-navy leading-tight">
            Stop overpaying for{" "}
            <span className="text-flame">natural gas</span>
          </h1>

          {/* Tagline */}
          <p className="text-navy/70 text-lg sm:text-xl max-w-xl">
            Sorted by what you actually pay — not who pays us the most.
            Compare every certified Georgia provider in seconds.
          </p>

          {/* Trust indicators */}
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-navy/50">
            <li>✓ No signup required</li>
            <li>✓ Rates updated weekly</li>
            <li>✓ All certified GA providers</li>
          </ul>

          {/* CTA */}
          <a
            href="#compare"
            className="mt-2 bg-flame text-cream font-semibold text-base px-8 py-3.5 rounded-xl hover:bg-flame/90 transition-colors shadow-md"
          >
            Compare Rates Now →
          </a>

        </div>
      </section>

      {/* Rate comparison table */}
      <section id="compare" className="bg-cream py-16 px-4">
        <RateTable />
      </section>

      {/* How it works */}
      <HowItWorks />

      {/* FAQ */}
      <Faq />

    </main>
  );
}
