import { createSupabaseAdmin } from "@/lib/supabase-admin";

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
      <div className="bg-white rounded-xl border border-navy/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-navy/10 bg-gray-50">
              <th className="text-left px-4 py-3 font-semibold text-navy/70">Email</th>
              <th className="text-left px-4 py-3 font-semibold text-navy/70">Zip</th>
              <th className="text-left px-4 py-3 font-semibold text-navy/70">Threshold</th>
              <th className="text-left px-4 py-3 font-semibold text-navy/70">Plan Type</th>
              <th className="text-left px-4 py-3 font-semibold text-navy/70">Active</th>
              <th className="text-left px-4 py-3 font-semibold text-navy/70">Created</th>
            </tr>
          </thead>
          <tbody>
            {(alerts ?? []).length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-navy/40">
                  No signups yet
                </td>
              </tr>
            ) : (
              (alerts ?? []).map((alert) => (
                <tr key={alert.id} className="border-b border-navy/5 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-navy">{alert.email}</td>
                  <td className="px-4 py-3 text-navy/70">{alert.zip_code ?? "—"}</td>
                  <td className="px-4 py-3 text-navy/70">
                    {alert.threshold_rate != null ? `$${alert.threshold_rate}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-navy/70">{alert.plan_type ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        alert.active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {alert.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-navy/50">
                    {alert.created_at
                      ? new Date(alert.created_at).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
