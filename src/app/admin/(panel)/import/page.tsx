"use client";

import { useState, useTransition } from "react";
import * as XLSX from "xlsx";
import { importPlans, type ImportRow } from "./actions";

const REQUIRED_COLUMNS = ["provider", "plan_name", "plan_type", "rate_per_therm"];

function validateRows(rows: Record<string, unknown>[]): ImportRow[] {
  return rows.map((row, i) => {
    for (const col of REQUIRED_COLUMNS) {
      if (row[col] == null || row[col] === "") {
        throw new Error(`Row ${i + 2}: missing required column "${col}"`);
      }
    }
    return {
      provider: String(row.provider),
      plan_name: String(row.plan_name),
      plan_type: String(row.plan_type),
      rate_per_therm: Number(row.rate_per_therm),
      monthly_fee: row.monthly_fee != null ? Number(row.monthly_fee) : undefined,
      contract_months:
        row.contract_months != null ? Number(row.contract_months) : undefined,
      affiliate_url: row.affiliate_url ? String(row.affiliate_url) : undefined,
      badge: row.badge ? String(row.badge) : undefined,
    };
  });
}

export default function ImportPage() {
  const [rows, setRows] = useState<ImportRow[] | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    setParseError(null);
    setRows(null);
    setResult(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = ev.target?.result;
        const wb = XLSX.read(data, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws);
        const validated = validateRows(json);
        setRows(validated);
      } catch (err) {
        setParseError(err instanceof Error ? err.message : "Failed to parse file");
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function handleImport() {
    if (!rows) return;
    startTransition(async () => {
      try {
        const { imported } = await importPlans(rows);
        setResult(`Successfully imported ${imported} plan(s).`);
        setRows(null);
      } catch (err) {
        setParseError(err instanceof Error ? err.message : "Import failed");
      }
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy font-display mb-2">Import Plans</h1>
      <p className="text-navy/50 text-sm mb-6">
        Upload an Excel (.xlsx) file. Required columns:{" "}
        <code className="bg-gray-100 px-1 rounded">provider</code>,{" "}
        <code className="bg-gray-100 px-1 rounded">plan_name</code>,{" "}
        <code className="bg-gray-100 px-1 rounded">plan_type</code>,{" "}
        <code className="bg-gray-100 px-1 rounded">rate_per_therm</code>. Optional:{" "}
        <code className="bg-gray-100 px-1 rounded">monthly_fee</code>,{" "}
        <code className="bg-gray-100 px-1 rounded">contract_months</code>,{" "}
        <code className="bg-gray-100 px-1 rounded">affiliate_url</code>,{" "}
        <code className="bg-gray-100 px-1 rounded">badge</code>.
      </p>

      <div className="bg-white rounded-xl border border-navy/10 p-6 max-w-2xl">
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFile}
          className="block text-sm text-navy/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-navy file:text-cream hover:file:bg-navy/90 cursor-pointer"
        />

        {parseError && (
          <p className="mt-4 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {parseError}
          </p>
        )}

        {result && (
          <p className="mt-4 text-green-700 text-sm bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            {result}
          </p>
        )}

        {rows && rows.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-medium text-navy mb-3">
              Preview — {rows.length} row(s) ready to import
            </p>
            <div className="overflow-x-auto rounded-lg border border-navy/10 max-h-64 overflow-y-auto">
              <table className="w-full text-xs min-w-[600px]">
                <thead className="sticky top-0 bg-gray-50 border-b border-navy/10">
                  <tr>
                    {["provider", "plan_name", "plan_type", "rate_per_therm", "monthly_fee", "contract_months", "badge"].map(
                      (col) => (
                        <th key={col} className="text-left px-3 py-2 font-semibold text-navy/70">
                          {col}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i} className="border-b border-navy/5">
                      <td className="px-3 py-1.5">{row.provider}</td>
                      <td className="px-3 py-1.5">{row.plan_name}</td>
                      <td className="px-3 py-1.5">{row.plan_type}</td>
                      <td className="px-3 py-1.5">{row.rate_per_therm}</td>
                      <td className="px-3 py-1.5">{row.monthly_fee ?? "—"}</td>
                      <td className="px-3 py-1.5">{row.contract_months ?? "—"}</td>
                      <td className="px-3 py-1.5">{row.badge ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={handleImport}
              disabled={isPending}
              className="mt-4 bg-navy text-cream font-semibold px-6 py-2.5 rounded-xl hover:bg-navy/90 transition-colors disabled:opacity-60 text-sm"
            >
              {isPending ? "Importing…" : `Import ${rows.length} plan(s)`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
