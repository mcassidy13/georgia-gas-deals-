"use client";

import { useState, useTransition } from "react";
import { updateSupplier, toggleSupplierActive } from "@/app/admin/suppliers/actions";

type Supplier = {
  id: string;
  name: string;
  website?: string | null;
  logo_url?: string | null;
  affiliate_url?: string | null;
  active?: boolean;
};

function EditableCell({
  value,
  onSave,
}: {
  value: string | null | undefined;
  onSave: (val: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");

  if (editing) {
    return (
      <input
        autoFocus
        className="border border-gold rounded px-2 py-0.5 text-sm w-full"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          setEditing(false);
          if (draft !== (value ?? "")) onSave(draft);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setEditing(false);
            if (draft !== (value ?? "")) onSave(draft);
          }
          if (e.key === "Escape") {
            setDraft(value ?? "");
            setEditing(false);
          }
        }}
      />
    );
  }

  return (
    <span
      className="cursor-pointer hover:bg-gold/10 rounded px-1 block truncate max-w-[180px]"
      onClick={() => setEditing(true)}
      title={value ?? "—"}
    >
      {value || <span className="text-navy/30 italic">—</span>}
    </span>
  );
}

export default function SuppliersTable({ suppliers }: { suppliers: Supplier[] }) {
  const [isPending, startTransition] = useTransition();

  function handleUpdate(id: string, field: string, value: string) {
    startTransition(() => updateSupplier(id, { [field]: value }));
  }

  function handleToggle(id: string, current: boolean) {
    startTransition(() => toggleSupplierActive(id, !current));
  }

  return (
    <div className="bg-white rounded-xl border border-navy/10 overflow-hidden">
      {isPending && (
        <div className="px-4 py-2 bg-gold/10 text-gold text-xs font-medium">Saving…</div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-navy/10 bg-gray-50">
            <th className="text-left px-4 py-3 font-semibold text-navy/70">Name</th>
            <th className="text-left px-4 py-3 font-semibold text-navy/70">Website</th>
            <th className="text-left px-4 py-3 font-semibold text-navy/70">Logo URL</th>
            <th className="text-left px-4 py-3 font-semibold text-navy/70">Affiliate URL</th>
            <th className="text-left px-4 py-3 font-semibold text-navy/70">Active</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-navy/40">
                No suppliers yet
              </td>
            </tr>
          ) : (
            suppliers.map((s) => (
              <tr key={s.id} className="border-b border-navy/5 hover:bg-gray-50/50">
                <td className="px-4 py-3">
                  <EditableCell value={s.name} onSave={(v) => handleUpdate(s.id, "name", v)} />
                </td>
                <td className="px-4 py-3">
                  <EditableCell value={s.website} onSave={(v) => handleUpdate(s.id, "website", v)} />
                </td>
                <td className="px-4 py-3">
                  <EditableCell value={s.logo_url} onSave={(v) => handleUpdate(s.id, "logo_url", v)} />
                </td>
                <td className="px-4 py-3">
                  <EditableCell value={s.affiliate_url} onSave={(v) => handleUpdate(s.id, "affiliate_url", v)} />
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggle(s.id, s.active ?? false)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                      s.active
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {s.active ? "Active" : "Inactive"}
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
