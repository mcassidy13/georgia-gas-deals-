"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase-server";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

async function requireAdmin() {
  const supabase = createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
}

export async function createPlan(data: {
  supplier_id: string;
  plan_name: string;
  plan_type: "fixed" | "variable";
  rate_per_therm: number;
  monthly_fee?: number;
  contract_months?: number;
}) {
  await requireAdmin();
  if (!data.supplier_id || !data.plan_name.trim() || !data.plan_type || !data.rate_per_therm) {
    throw new Error("supplier, plan name, type, and rate are required");
  }
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("plans").insert({
    supplier_id: data.supplier_id,
    plan_name: data.plan_name.trim(),
    plan_type: data.plan_type,
    rate_per_therm: data.rate_per_therm,
    monthly_fee: data.monthly_fee ?? 0,
    contract_months: data.contract_months ?? 0,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/plans");
  revalidatePath("/");
}

export async function deletePlan(id: string) {
  await requireAdmin();
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("plans").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/plans");
  revalidatePath("/");
}

export async function updatePlan(
  id: string,
  data: {
    plan_name?: string;
    plan_type?: string;
    rate_per_therm?: number;
    monthly_fee?: number;
    contract_months?: number;
    affiliate_url?: string;
    badge?: string;
    supplier_id?: string;
  }
) {
  await requireAdmin();
  const supabase = createSupabaseAdmin();
  const { error } = await supabase
    .from("plans")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/plans");
  revalidatePath("/");
}

export async function togglePlanActive(id: string, active: boolean) {
  await requireAdmin();
  const supabase = createSupabaseAdmin();
  const { error } = await supabase
    .from("plans")
    .update({ active, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/plans");
  revalidatePath("/");
}
