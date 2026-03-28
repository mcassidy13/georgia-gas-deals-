"use client";

import { useTransition } from "react";
import { deactivateAlert, deleteAlert } from "@/app/admin/(panel)/alerts/actions";

type Alert = {
  id: string;
  email: string;
  zip_code?: string | null;
  threshold_rate?: number | null;
  plan_type?: string | null;
  active: boolean;
  created_at?: string | null;
};

export default function AlertsTable({ alerts }: { alerts: Alert[] }) {
  const [isPending, startTransition] = useTransition();

  function handleDeactivate(id: string) {
    startTransition(() => deactivateAlert(id));
  }

  function handleDelete(id: string, email: string) {
    if (!confirm(`Delete alert for "${email}"?`)) return;
    startTransition(() => deleteAlert(id));
  }

  return (
    <div className="bg-white rounded-xl border border-navy/10 overflow-hidden">
      {isPending && (
        <div className="px-4 py-2 bg-gold/10 text-gold text-xs font-medium">Saving…</div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-navy/10 bg-gray-50">
            <th className="text-left px-4 py-3 font-semibold text-navy/70">Email</th>
            <th className="text-left px-4 py-3 font-semibold text-navy/70">Zip</th>
            <th className="text-left px-4 py-3 font-semibold text-navy/70">Threshold</th>
            <th className="text-left px-4 py-3 font-semibold text-navy/70">Plan Type</th>
            <th className="text-left px-4 py-3 font-semibold text-navy/70">Status</th>
            <th className="text-left px-4 py-3 font-semibold text-navy/70">Created</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {alerts.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-navy/40">
                No signups yet
              </td>
            </tr>
          ) : (
            alerts.map((alert) => (
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
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end">
                    {alert.active && (
                      <button
                        onClick={() => handleDeactivate(alert.id)}
                        className="text-navy/50 hover:text-navy text-xs font-medium px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                      >
                        Deactivate
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(alert.id, alert.email)}
                      className="text-red-400 hover:text-red-600 text-xs font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
