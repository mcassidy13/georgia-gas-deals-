import { createSupabaseAdmin } from "@/lib/supabase-admin";
import PlansTable from "@/components/admin/PlansTable";

export default async function PlansPage() {
  const supabase = createSupabaseAdmin();
  const [{ data: plans, error: plansError }, { data: suppliers }] =
    await Promise.all([
      supabase
        .from("plans")
        .select("*, suppliers(name)")
        .order("plan_name"),
      supabase.from("suppliers").select("id, name").order("name"),
    ]);

  if (plansError) throw new Error(plansError.message);

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy font-display mb-6">Plans</h1>
      <PlansTable plans={plans ?? []} suppliers={suppliers ?? []} />
    </div>
  );
}
