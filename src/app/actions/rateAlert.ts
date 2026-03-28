"use server";

import { createSupabaseAdmin } from "@/lib/supabase-admin";

export type RateAlertInput = {
  email: string;
  zip_code?: string;
  threshold_rate?: number;
  plan_type?: "fixed" | "variable" | "any";
};

export type RateAlertResult =
  | { success: true }
  | { success: false; error: string };

export async function subscribeRateAlert(
  input: RateAlertInput
): Promise<RateAlertResult> {
  const { email, zip_code, threshold_rate, plan_type } = input;

  // Basic server-side validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }
  if (zip_code && !/^\d{5}$/.test(zip_code)) {
    return { success: false, error: "Zip code must be 5 digits." };
  }
  if (threshold_rate !== undefined && (threshold_rate <= 0 || threshold_rate > 5)) {
    return { success: false, error: "Please enter a rate between $0.01 and $5.00." };
  }

  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("rate_alerts").insert({
    email: email.toLowerCase().trim(),
    zip_code: zip_code?.trim() || null,
    threshold_rate: threshold_rate ?? null,
    plan_type: plan_type ?? "any",
  });

  if (error) {
    console.error("rate_alerts insert error:", error.message);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  return { success: true };
}
