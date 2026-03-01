"use client";

import { useState, useTransition } from "react";
import { updatePlan, togglePlanActive } from "@/app/admin/(panel)/plans/actions";

type Plan = {
  id: string;
  plan_name: string;
  plan_type?: string | null;
  rate_per_therm?: number | null;
  monthly_fee?: number | null;
  contract_months?: number | null;
  affiliate_url?: string | null;
  badge?: string | null;
  active?: boolean;
  supplier_id?: string | null;
  suppliers?: { name: string } | null;
};

type Supplier = { id: string; name: string };

function EditableCell({
  value,
  onSave,
  type = "text",
}: {
  value: string | number | null | undefined;
  onSave: (val: string) => void;
  type?: string;
}) {
  const [editing, setEditing] = useState(false);
  const displayVal = value != null ? String(value) : "";
  const [draft, setDraft] = useState(displayVal);

  if (editing) {
    return (
      <input
        autoFocus
        type={type}
        className="border border-gold rounded px-2 py-0.5 text-sm w-full max-w-[140px]"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          setEditing(false);
          if (draft !== displayVal) onSave(draft);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setEditing(false);
            if (draft !== displayVal) onSave(draft);
          }
          if (e.key === "Escape") {
            setDraft(displayVal);
            setEditing(false);
          }
        }}
      />
    );
  }

  return (
    <span
      className="cursor-pointer hover:bg-gold/10 rounded px-1 block truncate max-w-[140px]"
      onClick={() => setEditing(true)}
      title={displayVal || "—"}
    >
      {displayVal || <span className="text-navy/30 italic">—</span>}
    </span>
  );
}

function SupplierSelect({
  value,
  suppliers,
  onSave,
}: {
  value: string | null | undefined;
  suppliers: Supplier[];
  onSave: (id: string) => void;
}) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onSave(e.target.value)}
      className="border border-navy/20 rounded px-2 py-0.5 text-sm bg-white max-w-[140px]"
    >
      <option value="">— none —</option>
      {suppliers.map((s) => (
        <option key={s.id} value={s.id}>
          {s.name}
        </option>
      ))}
    </select>
  );
}

export default function PlansTable({
  plans,
  suppliers,
}: {
  plans: Plan[];
  suppliers: Supplier[];
}) {
  const [isPending, startTransition] = useTransition();

  function handleUpdate(id: string, field: string, value: string) {
    const numFields = ["rate_per_therm", "monthly_fee", "contract_months"];
    const parsed = numFields.includes(field) ? parseFloat(value) : value;
    startTransition(() => updatePlan(id, { [field]: parsed } as Parameters<typeof updatePlan>[1]));
  }

  function handleToggle(id: string, current: boolean) {
    startTransition(() => togglePlanActive(id, !current));
  }

  return (
    <div className="bg-white rounded-xl border border-navy/10 overflow-x-auto">
      {isPending && (
        <div className="px-4 py-2 bg-gold/10 text-gold text-xs font-medium">Saving…</div>
      )}
      <table className="w-full text-sm min-w-[900px]">
        <thead>
          <tr className="border-b border-navy/10 bg-gray-50">
            <th className="text-left px-4 py-3 font-semibold text-navy/70">Plan Name</th>
            <th className="text-left px-4 py-3 font-semibold text-navy/70">Supplier</th>
            <th className="text-left px-4 py-3 font-semibold text-navy/70">Type</th>
            <th className="text-left px-4 py-3 font-semibold text-navy/70">Rate/Therm</th>
            <th className="text-left px-4 py-3 font-semibold text-navy/70">Mo. Fee</th>
            <th className="text-left px-4 py-3 font-semibold text-navy/70">Contract</th>
            <th className="text-left px-4 py-3 font-semibold text-navy/70">Badge</th>
            <th className="text-left px-4 py-3 font-semibold text-navy/70">Affiliate URL</th>
            <th className="text-left px-4 py-3 font-semibold text-navy/70">Active</th>
          </tr>
        </thead>
        <tbody>
          {plans.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-4 py-8 text-center text-navy/40">
                No plans yet
              </td>
            </tr>
          ) : (
            plans.map((p) => (
              <tr key={p.id} className="border-b border-navy/5 hover:bg-gray-50/50">
                <td className="px-4 py-3">
                  <EditableCell
                    value={p.plan_name}
                    onSave={(v) => handleUpdate(p.id, "plan_name", v)}
                  />
                </td>
                <td className="px-4 py-3">
                  <SupplierSelect
                    value={p.supplier_id}
                    suppliers={suppliers}
                    onSave={(v) => handleUpdate(p.id, "supplier_id", v)}
                  />
                </td>
                <td className="px-4 py-3">
                  <EditableCell
                    value={p.plan_type}
                    onSave={(v) => handleUpdate(p.id, "plan_type", v)}
                  />
                </td>
                <td className="px-4 py-3">
                  <EditableCell
                    value={p.rate_per_therm}
                    type="number"
                    onSave={(v) => handleUpdate(p.id, "rate_per_therm", v)}
                  />
                </td>
                <td className="px-4 py-3">
                  <EditableCell
                    value={p.monthly_fee}
                    type="number"
                    onSave={(v) => handleUpdate(p.id, "monthly_fee", v)}
                  />
                </td>
                <td className="px-4 py-3">
                  <EditableCell
                    value={p.contract_months}
                    type="number"
                    onSave={(v) => handleUpdate(p.id, "contract_months", v)}
                  />
                </td>
                <td className="px-4 py-3">
                  <EditableCell
                    value={p.badge}
                    onSave={(v) => handleUpdate(p.id, "badge", v)}
                  />
                </td>
                <td className="px-4 py-3">
                  <EditableCell
                    value={p.affiliate_url}
                    onSave={(v) => handleUpdate(p.id, "affiliate_url", v)}
                  />
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggle(p.id, p.active ?? false)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                      p.active
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {p.active ? "Active" : "Inactive"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
