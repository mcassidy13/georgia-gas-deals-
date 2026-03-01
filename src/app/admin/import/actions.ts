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

export type ImportRow = {
  provider: string;
  plan_name: string;
  plan_type: string;
  rate_per_therm: number;
  monthly_fee?: number;
  contract_months?: number;
  affiliate_url?: string;
  badge?: string;
};

export async function importPlans(rows: ImportRow[]) {
  await requireAdmin();
  const supabase = createSupabaseAdmin();

  // Build supplier name → id map
  const { data: suppliers, error: supErr } = await supabase
    .from("suppliers")
    .select("id, name");
  if (supErr) throw new Error(supErr.message);

  const supplierMap = new Map<string, string>(
    (suppliers ?? []).map((s) => [s.name.toLowerCase(), s.id])
  );

  const plans = rows.map((row) => {
    const supplierId = supplierMap.get(row.provider.toLowerCase());
    if (!supplierId) throw new Error(`Unknown supplier: ${row.provider}`);
    return {
      supplier_id: supplierId,
      plan_name: row.plan_name,
      plan_type: row.plan_type,
      rate_per_therm: row.rate_per_therm,
      monthly_fee: row.monthly_fee ?? 0,
      contract_months: row.contract_months ?? 0,
      affiliate_url: row.affiliate_url ?? null,
      badge: row.badge ?? null,
      active: true,
      updated_at: new Date().toISOString(),
    };
  });

  const { error } = await supabase
    .from("plans")
    .upsert(plans, { onConflict: "supplier_id,plan_name" });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/plans");
  revalidatePath("/");

  return { imported: plans.length };
}
