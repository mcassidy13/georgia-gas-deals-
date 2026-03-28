"use client";

import { useState, useTransition } from "react";
import {
  createSupplier,
  updateSupplier,
  toggleSupplierActive,
  deleteSupplier,
} from "@/app/admin/(panel)/suppliers/actions";

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
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [addError, setAddError] = useState<string | null>(null);

  function handleUpdate(id: string, field: string, value: string) {
    startTransition(() => updateSupplier(id, { [field]: value }));
  }

  function handleToggle(id: string, current: boolean) {
    startTransition(() => toggleSupplierActive(id, !current));
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This will also delete all their plans.`)) return;
    startTransition(() => deleteSupplier(id));
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setAddError(null);
    startTransition(async () => {
      try {
        await createSupplier(newName);
        setNewName("");
        setShowAddForm(false);
      } catch (err: unknown) {
        setAddError(err instanceof Error ? err.message : "Failed to create supplier");
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Add supplier button / form */}
      {showAddForm ? (
        <form
          onSubmit={handleCreate}
          className="bg-white border border-gold/40 rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center"
        >
          <input
            autoFocus
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Supplier name"
            className="flex-1 border border-navy/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
          />
          {addError && <p className="text-red-500 text-xs">{addError}</p>}
          <div className="flex gap-2 shrink-0">
            <button
              type="submit"
              disabled={isPending || !newName.trim()}
              className="bg-navy text-cream text-sm font-semibold px-4 py-2 rounded-lg hover:bg-navy/90 disabled:opacity-50"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => { setShowAddForm(false); setNewName(""); setAddError(null); }}
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
            + Add Supplier
          </button>
        </div>
      )}

      {/* Table */}
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
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-navy/40">
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
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(s.id, s.name)}
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
