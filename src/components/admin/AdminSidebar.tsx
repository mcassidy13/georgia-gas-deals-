"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/suppliers", label: "Suppliers", icon: "🏢" },
  { href: "/admin/plans", label: "Plans", icon: "📋" },
  { href: "/admin/import", label: "Import", icon: "📥" },
  { href: "/admin/alerts", label: "Alerts", icon: "🔔" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 min-h-screen bg-navy text-cream flex flex-col shrink-0">
      <div className="px-5 py-5 border-b border-white/10">
        <p className="text-xs uppercase tracking-widest text-white/40 font-semibold">Admin</p>
        <p className="font-display font-bold text-gold text-lg leading-tight mt-0.5">Georgia Gas Deals</p>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map(({ href, label, icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-gold/20 text-gold"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
