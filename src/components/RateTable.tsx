"use client";

import { useState } from "react";
import { Rate, PlanType } from "@/types/rate";

// Average Georgia residential usage per month in therms.
// Used to calculate the estimated monthly bill shown to users.
const AVG_THERMS = 50;

function estimatedMonthly(rate: Rate): number {
  return rate.rate_per_therm * AVG_THERMS + rate.monthly_fee;
}

type Filter = "all" | PlanType;

const FILTERS: { label: string; value: Filter }[] = [
  { label: "All Plans", value: "all" },
  { label: "Fixed Rate", value: "fixed" },
  { label: "Variable Rate", value: "variable" },
];

const BADGE_STYLES: Record<string, string> = {
  "Best Value":    "bg-gold/15 text-gold",
  "Most Popular":  "bg-flame/15 text-flame",
};

function PlanBadge({ label }: { label: string }) {
  const style = BADGE_STYLES[label] ?? "bg-navy/10 text-navy";
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${style}`}>
      {label}
    </span>
  );
}

function ContractLabel({ months }: { months: number }) {
  if (months === 0) return <span className="text-navy/50">Month-to-month</span>;
  return <span className="text-navy/50">{months}-month contract</span>;
}

export default function RateTable({ rates, zip }: { rates: Rate[]; zip?: string }) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = rates
    .filter((r) => filter === "all" || r.plan_type === filter)
    .sort((a, b) => estimatedMonthly(a) - estimatedMonthly(b));

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">

      {/* Section header */}
      <div className="text-center flex flex-col gap-2">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy">
          {zip ? `Gas Rates for ${zip}` : "Current Georgia Gas Rates"}
        </h2>
        <p className="text-navy/60 text-sm">
          Sorted by estimated monthly cost · Based on {AVG_THERMS} therms/month average usage
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 justify-center flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
              filter === f.value
                ? "bg-navy text-cream border-navy"
                : "bg-white text-navy border-navy/20 hover:border-navy/50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Rate cards */}
      <div className="flex flex-col gap-3">

        {/* Desktop column headers */}
        <div className="hidden md:grid md:grid-cols-[2fr_1fr_1fr_1fr_120px] gap-4 px-5 text-xs font-semibold uppercase tracking-wide text-navy/40">
          <span>Provider &amp; Plan</span>
          <span>Rate / Therm</span>
          <span>Monthly Fee</span>
          <span>Est. Monthly</span>
          <span></span>
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-navy/40 py-10 text-sm">
            No plans match this filter.
          </p>
        )}

        {filtered.map((rate, index) => (
          <div
            key={rate.id}
            className={`bg-white rounded-xl border p-5 flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr_120px] gap-4 items-start md:items-center shadow-sm transition-shadow hover:shadow-md ${
              index === 0 ? "border-gold" : "border-navy/10"
            }`}
          >
            {/* Provider + plan info */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-navy">{rate.provider}</span>
                {rate.badge && <PlanBadge label={rate.badge} />}
              </div>
              <span className="text-sm text-navy/60">{rate.plan_name}</span>
              <ContractLabel months={rate.contract_months} />
            </div>

            {/* Rate per therm */}
            <div className="flex flex-col">
              <span className="text-xs text-navy/40 md:hidden">Rate / Therm</span>
              <span className="text-lg font-bold text-navy">
                ${rate.rate_per_therm.toFixed(3)}
              </span>
            </div>

            {/* Monthly fee */}
            <div className="flex flex-col">
              <span className="text-xs text-navy/40 md:hidden">Monthly Fee</span>
              <span className="text-navy/70">
                {rate.monthly_fee === 0 ? "None" : `$${rate.monthly_fee.toFixed(2)}`}
              </span>
            </div>

            {/* Estimated monthly — most important number */}
            <div className="flex flex-col">
              <span className="text-xs text-navy/40 md:hidden">Est. Monthly</span>
              <span className={`text-xl font-bold ${index === 0 ? "text-gold" : "text-navy"}`}>
                ${estimatedMonthly(rate).toFixed(2)}
              </span>
            </div>

            {/* CTA */}
            <a
              href={rate.affiliate_url}
              className="w-full md:w-auto text-center bg-flame text-cream text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-flame/90 transition-colors whitespace-nowrap"
            >
              Sign Up →
            </a>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="text-center text-xs text-navy/40 pb-2">
        Estimated monthly cost = (rate × {AVG_THERMS} therms) + monthly fee. Actual bills vary by usage, taxes, and distribution charges. Verify rates with the provider before signing up.
      </p>

    </div>
  );
}
