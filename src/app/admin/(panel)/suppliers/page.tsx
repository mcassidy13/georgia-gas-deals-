import { createSupabaseAdmin } from "@/lib/supabase-admin";
import SuppliersTable from "@/components/admin/SuppliersTable";

export default async function SuppliersPage() {
  const supabase = createSupabaseAdmin();
  const { data: suppliers, error } = await supabase
    .from("suppliers")
    .select("*")
    .order("name");

  if (error) throw new Error(error.message);

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy font-display mb-6">Suppliers</h1>
      <SuppliersTable suppliers={suppliers ?? []} />
    </div>
  );
}
