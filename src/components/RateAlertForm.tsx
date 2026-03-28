"use client";

import { useState, FormEvent } from "react";
import { subscribeRateAlert } from "@/app/actions/rateAlert";

type PlanTypeOption = "any" | "fixed" | "variable";

const PLAN_TYPE_OPTIONS: { label: string; value: PlanTypeOption }[] = [
  { label: "Either", value: "any" },
  { label: "Fixed", value: "fixed" },
  { label: "Variable", value: "variable" },
];

export default function RateAlertForm() {
  const [email, setEmail] = useState("");
  const [zip, setZip] = useState("");
  const [targetRate, setTargetRate] = useState("");
  const [planType, setPlanType] = useState<PlanTypeOption>("any");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const threshold = targetRate ? parseFloat(targetRate) : undefined;

    const result = await subscribeRateAlert({
      email,
      zip_code: zip || undefined,
      threshold_rate: threshold,
      plan_type: planType,
    });

    setLoading(false);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error);
    }
  }

  if (success) {
    return (
      <div className="text-center py-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold/20 mb-4">
          <svg className="w-7 h-7 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-cream font-display mb-2">You&apos;re on the list!</h3>
        <p className="text-cream/70 text-sm">
          We&apos;ll email you when Georgia gas rates drop to your target. No spam, ever.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      {/* Email — required */}
      <div>
        <label className="block text-sm font-medium text-cream/80 mb-1.5">
          Email address <span className="text-flame">*</span>
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full bg-navy/60 border border-cream/15 rounded-lg px-4 py-3 text-cream placeholder:text-cream/30 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Target rate — optional */}
        <div>
          <label className="block text-sm font-medium text-cream/80 mb-1.5">
            Alert me when rate drops below
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/40 text-sm">$</span>
            <input
              type="number"
              min="0.01"
              max="5.00"
              step="0.001"
              value={targetRate}
              onChange={(e) => setTargetRate(e.target.value)}
              placeholder="0.45 / therm"
              className="w-full bg-navy/60 border border-cream/15 rounded-lg pl-7 pr-4 py-3 text-cream placeholder:text-cream/30 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <p className="text-cream/35 text-xs mt-1">Optional — leave blank to get all updates</p>
        </div>

        {/* Zip code — optional */}
        <div>
          <label className="block text-sm font-medium text-cream/80 mb-1.5">
            Your zip code
          </label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={5}
            value={zip}
            onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))}
            placeholder="e.g. 30301"
            className="w-full bg-navy/60 border border-cream/15 rounded-lg px-4 py-3 text-cream placeholder:text-cream/30 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <p className="text-cream/35 text-xs mt-1">Optional — helps us personalize alerts</p>
        </div>
      </div>

      {/* Plan type */}
      <div>
        <label className="block text-sm font-medium text-cream/80 mb-2">
          Plan type preference
        </label>
        <div className="flex gap-2">
          {PLAN_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setPlanType(opt.value)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                planType === opt.value
                  ? "bg-gold text-navy border-gold"
                  : "bg-navy/40 text-cream/60 border-cream/15 hover:border-cream/30"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-red-300 text-sm bg-red-900/30 border border-red-500/30 rounded-lg px-4 py-2.5">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-1 bg-gold text-navy font-bold py-3.5 rounded-xl hover:bg-gold/90 transition-colors disabled:opacity-60 text-sm"
      >
        {loading ? "Setting up alert…" : "Notify Me When Rates Drop →"}
      </button>

      <p className="text-center text-cream/30 text-xs">
        No spam. Unsubscribe anytime. We never sell your email.
      </p>
    </form>
  );
}
