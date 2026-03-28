import { Rate } from "@/types/rate";
import { mockRates } from "@/lib/mockRates";

export async function getRates(): Promise<Rate[]> {
  // If Supabase isn't configured yet, return mock data so the site still works locally.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return mockRates;
  }

  // Dynamically import the client so it's only used when env vars exist.
  const { supabase } = await import("@/lib/supabase");

  const { data, error } = await supabase
    .from("rates")
    .select("id, provider, plan_name, plan_type, rate_per_therm, monthly_fee, contract_months, affiliate_url, badge")
    .eq("active", true);

  if (error) {
    console.error("Supabase fetch failed, falling back to mock data:", error.message);
    return mockRates;
  }

  // Fall back to mock data when no plans have been added to the DB yet.
  if (!data || data.length === 0) {
    return mockRates;
  }

  return data as Rate[];
}
