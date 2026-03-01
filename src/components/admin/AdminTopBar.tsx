import LogoutButton from "./LogoutButton";

export default function AdminTopBar() {
  return (
    <header className="h-14 border-b border-navy/10 bg-white flex items-center justify-between px-6 shrink-0">
      <p className="text-sm text-navy/50">Admin Panel</p>
      <LogoutButton />
    </header>
  );
}
