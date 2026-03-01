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
