"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "What's the difference between a fixed and variable rate?",
    a: "A fixed rate locks in your price per therm for the length of your contract — typically 6, 12, or 24 months. A variable rate can change each month based on the natural gas market. Fixed plans give you predictable bills; variable plans can sometimes be cheaper but carry more risk.",
  },
  {
    q: "Will switching providers affect my gas delivery?",
    a: "No. Your gas is delivered through the same pipes by Atlanta Gas Light regardless of which marketer you choose. Only the company that bills you for the gas itself changes. If there's ever a leak or outage, you still call Atlanta Gas Light.",
  },
  {
    q: "How do you make money?",
    a: "Georgia Gas Deals earns a referral fee from providers when you sign up through our links. This never influences the order rates are shown — we always sort by estimated monthly cost, cheapest first. The provider pays us; you don't.",
  },
  {
    q: "How accurate and up-to-date are these rates?",
    a: "We aim to update rates weekly. Variable rates can change monthly, so always confirm the current rate on the provider's site before signing up. Fixed rates are more stable but can change between contract periods.",
  },
  {
    q: "What is a therm, and how many do I use?",
    a: "A therm is the unit natural gas is measured and billed in. An average Georgia home uses roughly 40–60 therms per month, depending on home size, heating system, and season. We use 50 therms as a baseline for our estimated monthly cost calculations.",
  },
  {
    q: "Are there cancellation fees if I want to switch again later?",
    a: "It depends on your plan. Fixed-rate contracts often have an early termination fee — typically $50–$150. Variable-rate and month-to-month plans usually have no cancellation fee. Always check the plan's terms before signing up.",
  },
  {
    q: "Do I need to do anything with Atlanta Gas Light when I switch?",
    a: "No action needed on your end. Your new provider handles the switch with Atlanta Gas Light. There's no interruption to your service and no technician visit required.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-navy/10 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left py-5 flex items-start justify-between gap-4 group"
        aria-expanded={open}
      >
        <span className="font-medium text-navy group-hover:text-flame transition-colors">
          {q}
        </span>
        <span className={`text-navy/40 text-xl flex-shrink-0 transition-transform duration-200 ${open ? "rotate-45" : ""}`}>
          +
        </span>
      </button>

      {open && (
        <p className="pb-5 text-navy/70 text-sm leading-relaxed">
          {a}
        </p>
      )}
    </div>
  );
}

export default function Faq() {
  return (
    <section id="faq" className="bg-cream py-16 sm:py-24 px-4">
      <div className="max-w-3xl mx-auto flex flex-col gap-10">

        {/* Header */}
        <div className="text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy">
            Frequently asked questions
          </h2>
          <p className="mt-3 text-navy/60 text-sm sm:text-base">
            Everything you need to know before switching.
          </p>
        </div>

        {/* FAQ list */}
        <div className="bg-white rounded-2xl px-6 shadow-sm">
          {FAQS.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-navy/50 text-sm mb-4">Ready to see the best rate for you?</p>
          <a
            href="#compare"
            className="inline-block bg-flame text-cream font-semibold px-8 py-3.5 rounded-xl hover:bg-flame/90 transition-colors shadow-md"
          >
            Compare Rates Now →
          </a>
        </div>

      </div>
    </section>
  );
}
