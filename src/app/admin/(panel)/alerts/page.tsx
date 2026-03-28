import { createSupabaseAdmin } from "@/lib/supabase-admin";
import AlertsTable from "@/components/admin/AlertsTable";

export default async function AlertsPage() {
  const supabase = createSupabaseAdmin();
  const { data: alerts, error } = await supabase
    .from("rate_alerts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy font-display mb-6">Rate Alert Signups</h1>
      <AlertsTable alerts={alerts ?? []} />
    </div>
  );
}
