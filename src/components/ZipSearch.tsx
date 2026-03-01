"use client";

import { useState, FormEvent } from "react";

export default function ZipSearch() {
  const [zip, setZip] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const cleaned = zip.trim();
    if (!/^\d{5}$/.test(cleaned)) {
      setError("Please enter a valid 5-digit zip code.");
      return;
    }
    setError("");
    document.getElementById("compare")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-2 w-full max-w-sm"
    >
      <div className="flex w-full rounded-xl overflow-hidden shadow-md border border-navy/15 bg-white">
        <input
          type="text"
          inputMode="numeric"
          maxLength={5}
          value={zip}
          onChange={(e) => {
            setZip(e.target.value.replace(/\D/g, ""));
            setError("");
          }}
          placeholder="Enter your zip code"
          aria-label="Zip code"
          className="flex-1 px-4 py-3.5 text-navy placeholder:text-navy/40 text-base outline-none bg-transparent"
        />
        <button
          type="submit"
          className="bg-navy text-cream font-semibold px-5 text-base hover:bg-navy/90 transition-colors whitespace-nowrap"
        >
          See Rates
        </button>
      </div>
      {error && (
        <p className="text-flame text-sm">{error}</p>
      )}
    </form>
  );
}
