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

export async function createSupplier(name: string) {
  await requireAdmin();
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Name is required");
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("suppliers").insert({ name: trimmed });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/suppliers");
  revalidatePath("/");
}

export async function deleteSupplier(id: string) {
  await requireAdmin();
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("suppliers").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/suppliers");
  revalidatePath("/admin/plans");
  revalidatePath("/");
}

export async function updateSupplier(
  id: string,
  data: { name?: string; website?: string; logo_url?: string; affiliate_url?: string }
) {
  await requireAdmin();
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("suppliers").update(data).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/suppliers");
  revalidatePath("/");
}

export async function toggleSupplierActive(id: string, active: boolean) {
  await requireAdmin();
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("suppliers").update({ active }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/suppliers");
  revalidatePath("/");
}
