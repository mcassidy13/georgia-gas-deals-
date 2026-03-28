"use client";

import { useState, useTransition } from "react";
import {
  createPlan,
  updatePlan,
  togglePlanActive,
  deletePlan,
} from "@/app/admin/(panel)/plans/actions";

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

const EMPTY_FORM = {
  supplier_id: "",
  plan_name: "",
  plan_type: "fixed" as "fixed" | "variable",
  rate_per_therm: "",
  monthly_fee: "",
  contract_months: "",
};

export default function PlansTable({
  plans,
  suppliers,
}: {
  plans: Plan[];
  suppliers: Supplier[];
}) {
  const [isPending, startTransition] = useTransition();
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [addError, setAddError] = useState<string | null>(null);

  function handleUpdate(id: string, field: string, value: string) {
    const numFields = ["rate_per_therm", "monthly_fee", "contract_months"];
    const parsed = numFields.includes(field) ? parseFloat(value) : value;
    startTransition(() => updatePlan(id, { [field]: parsed } as Parameters<typeof updatePlan>[1]));
  }

  function handleToggle(id: string, current: boolean) {
    startTransition(() => togglePlanActive(id, !current));
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`Delete plan "${name}"?`)) return;
    startTransition(() => deletePlan(id));
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setAddError(null);
    const rate = parseFloat(form.rate_per_therm);
    if (!form.supplier_id || !form.plan_name.trim() || isNaN(rate)) {
      setAddError("Supplier, plan name, and rate are required.");
      return;
    }
    startTransition(async () => {
      try {
        await createPlan({
          supplier_id: form.supplier_id,
          plan_name: form.plan_name,
          plan_type: form.plan_type,
          rate_per_therm: rate,
          monthly_fee: form.monthly_fee ? parseFloat(form.monthly_fee) : 0,
          contract_months: form.contract_months ? parseInt(form.contract_months) : 0,
        });
        setForm(EMPTY_FORM);
        setShowAddForm(false);
      } catch (err: unknown) {
        setAddError(err instanceof Error ? err.message : "Failed to create plan");
      }
    });
  }

  const inputCls =
    "border border-navy/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold";

  return (
    <div className="flex flex-col gap-4">
      {/* Add plan button / form */}
      {showAddForm ? (
        <form
          onSubmit={handleCreate}
          className="bg-white border border-gold/40 rounded-xl p-5 flex flex-col gap-4"
        >
          <h3 className="font-semibold text-navy text-sm">New Plan</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-navy/60">Supplier *</label>
              <select
                value={form.supplier_id}
                onChange={(e) => setForm({ ...form, supplier_id: e.target.value })}
                className={inputCls}
              >
                <option value="">— select —</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-navy/60">Plan Name *</label>
              <input
                type="text"
                placeholder="e.g. 12-Month Fixed"
                value={form.plan_name}
                onChange={(e) => setForm({ ...form, plan_name: e.target.value })}
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-navy/60">Type *</label>
              <select
                value={form.plan_type}
                onChange={(e) => setForm({ ...form, plan_type: e.target.value as "fixed" | "variable" })}
                className={inputCls}
              >
                <option value="fixed">Fixed</option>
                <option value="variable">Variable</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-navy/60">Rate / Therm *</label>
              <input
                type="number"
                step="0.0001"
                min="0"
                placeholder="0.4690"
                value={form.rate_per_therm}
                onChange={(e) => setForm({ ...form, rate_per_therm: e.target.value })}
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-navy/60">Monthly Fee ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={form.monthly_fee}
                onChange={(e) => setForm({ ...form, monthly_fee: e.target.value })}
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-navy/60">Contract (months)</label>
              <input
                type="number"
                step="1"
                min="0"
                placeholder="0 = month-to-month"
                value={form.contract_months}
                onChange={(e) => setForm({ ...form, contract_months: e.target.value })}
                className={inputCls}
              />
            </div>
          </div>
          {addError && <p className="text-red-500 text-sm">{addError}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="bg-navy text-cream text-sm font-semibold px-5 py-2 rounded-lg hover:bg-navy/90 disabled:opacity-50"
            >
              Save Plan
            </button>
            <button
              type="button"
              onClick={() => { setShowAddForm(false); setForm(EMPTY_FORM); setAddError(null); }}
              className="text-navy/60 text-sm px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="flex justify-end">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-navy text-cream text-sm font-semibold px-4 py-2 rounded-lg hover:bg-navy/90 transition-colors"
          >
            + Add Plan
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-navy/10 overflow-x-auto">
        {isPending && (
          <div className="px-4 py-2 bg-gold/10 text-gold text-xs font-medium">Saving…</div>
        )}
        <table className="w-full text-sm min-w-[960px]">
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
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {plans.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-navy/40">
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
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(p.id, p.plan_name)}
                      className="text-red-400 hover:text-red-600 text-xs font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
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
