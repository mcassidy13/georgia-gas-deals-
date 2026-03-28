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

export async function deactivateAlert(id: string) {
  await requireAdmin();
  const supabase = createSupabaseAdmin();
  const { error } = await supabase
    .from("rate_alerts")
    .update({ active: false })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/alerts");
}

export async function deleteAlert(id: string) {
  await requireAdmin();
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("rate_alerts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/alerts");
}
