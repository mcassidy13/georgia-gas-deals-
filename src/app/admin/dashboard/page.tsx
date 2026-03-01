import { createSupabaseAdmin } from "@/lib/supabase-admin";

async function getStats() {
  const supabase = createSupabaseAdmin();
  const [suppliers, plans, alerts] = await Promise.all([
    supabase.from("suppliers").select("id", { count: "exact", head: true }),
    supabase.from("plans").select("id", { count: "exact", head: true }),
    supabase.from("rate_alerts").select("id", { count: "exact", head: true }),
  ]);
  return {
    suppliers: suppliers.count ?? 0,
    plans: plans.count ?? 0,
    alerts: alerts.count ?? 0,
  };
}

export default async function DashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: "Suppliers", value: stats.suppliers, icon: "🏢", href: "/admin/suppliers" },
    { label: "Plans", value: stats.plans, icon: "📋", href: "/admin/plans" },
    { label: "Rate Alert Signups", value: stats.alerts, icon: "🔔", href: "/admin/alerts" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy font-display mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map(({ label, value, icon, href }) => (
          <a
            key={label}
            href={href}
            className="bg-white rounded-xl border border-navy/10 p-6 hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-3">{icon}</div>
            <div className="text-3xl font-bold text-navy">{value}</div>
            <div className="text-sm text-navy/50 mt-1">{label}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
