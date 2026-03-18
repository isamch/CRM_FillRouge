"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "⊞" },
  { href: "/dashboard/conversations", label: "Conversations", icon: "💬" },
  { href: "/dashboard/contacts", label: "Contacts", icon: "👥" },
  { href: "/dashboard/templates", label: "Templates", icon: "📄" },
  { href: "/dashboard/campaigns", label: "Campaigns", icon: "📢" },
  { href: "/dashboard/notifications", label: "Notifications", icon: "🔔" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthContext();
  const { logout } = useAuth();

  const isAdmin = user?.roles?.includes("admin");

  return (
    <aside style={{
      width: "240px",
      minHeight: "100vh",
      background: "#111B21",
      display: "flex",
      flexDirection: "column",
      padding: "24px 0",
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: "0 20px 24px", borderBottom: "1px solid #1F2C34" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>
          <span style={{ color: "#FFFFFF", fontWeight: "700", fontSize: "15px" }}>WhatsApp CRM</span>
        </div>
      </div>

      {/* Nav Links */}
      <nav style={{ flex: 1, padding: "16px 12px" }}>
        {navLinks.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "10px 12px", borderRadius: "8px", marginBottom: "4px",
              textDecoration: "none",
              background: active ? "#25D366" : "transparent",
              color: active ? "#FFFFFF" : "#8696A0",
              fontWeight: active ? "600" : "400",
              fontSize: "14px",
              transition: "all 0.15s",
            }}>
              <span>{icon}</span>
              {label}
            </Link>
          );
        })}

        {isAdmin && (
          <Link href="/dashboard/admin" style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "10px 12px", borderRadius: "8px", marginBottom: "4px",
            textDecoration: "none",
            background: pathname === "/dashboard/admin" ? "#25D366" : "transparent",
            color: pathname === "/dashboard/admin" ? "#FFFFFF" : "#8696A0",
            fontSize: "14px",
          }}>
            <span>🛡️</span>
            Admin
          </Link>
        )}
      </nav>

      {/* User + Logout */}
      <div style={{ padding: "16px 20px", borderTop: "1px solid #1F2C34" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ color: "#FFFFFF", fontSize: "13px", fontWeight: "600" }}>{user?.name}</div>
            <div style={{ color: "#8696A0", fontSize: "11px" }}>{user?.roles?.[0]}</div>
          </div>
          <button onClick={logout} style={{
            background: "transparent", border: "none", cursor: "pointer",
            color: "#8696A0", fontSize: "18px", padding: "4px",
          }}>⏻</button>
        </div>
      </div>
    </aside>
  );
}
