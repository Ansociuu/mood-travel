"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Building2, Map, Calendar, 
  Users, MessageSquare, CreditCard, Settings, LogOut,
  ChevronLeft, ChevronRight, Menu
} from "lucide-react";
import { useState } from "react";

const sidebarLinks = [
  { label: "Tổng quan", icon: LayoutDashboard, href: "/admin" },
  { label: "Homestays", icon: Building2, href: "/admin/hotels" },
  { label: "Tours", icon: Map, href: "/admin/tours" },
  { label: "Đơn đặt chỗ", icon: Calendar, href: "/admin/bookings" },
  { label: "Đánh giá", icon: MessageSquare, href: "/admin/reviews" },
  { label: "Tài chính", icon: CreditCard, href: "/admin/finance" },
  { label: "Người dùng", icon: Users, href: "/admin/users", adminOnly: true },
  { label: "Cài đặt", icon: Settings, href: "/admin/settings" },
];

export default function AdminSidebar({ user }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const filteredLinks = sidebarLinks.filter(link => {
    if (link.adminOnly && user?.role !== 'ADMIN') return false;
    return true;
  });

  return (
    <div style={{ 
      width: collapsed ? "80px" : "280px", 
      background: "#0f172a", 
      color: "#fff", 
      height: "100vh", 
      position: "fixed", 
      left: 0, 
      top: 0, 
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      zIndex: 100,
      display: "flex",
      flexDirection: "column",
      boxShadow: "4px 0 24px rgba(0,0,0,0.1)"
    }}>
      {/* LOGO */}
      <div style={{ padding: "32px 24px", display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #0d9488, #14b8a6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontWeight: 900, fontSize: "18px" }}>M</span>
        </div>
        {!collapsed && (
          <span style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px" }}>Mood<span style={{ color: "#0d9488" }}>Admin</span></span>
        )}
      </div>

      {/* LINKS */}
      <div style={{ flex: 1, padding: "24px 12px", display: "flex", flexDirection: "column", gap: "4px", overflowY: "auto" }}>
        {filteredLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link 
              key={link.href} 
              href={link.href}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "12px", 
                padding: "12px 16px", 
                borderRadius: "12px",
                textDecoration: "none",
                color: isActive ? "#fff" : "#94a3b8",
                background: isActive ? "rgba(13,148,136,0.15)" : "transparent",
                fontWeight: isActive ? 700 : 500,
                transition: "all 0.2s",
                position: "relative"
              }}
            >
              {isActive && (
                <div style={{ position: "absolute", left: "-12px", top: "25%", bottom: "25%", width: "4px", background: "#0d9488", borderRadius: "0 4px 4px 0" }} />
              )}
              <link.icon size={20} color={isActive ? "#0d9488" : "currentColor"} />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* USER & COLLAPSE */}
      <div style={{ padding: "20px", borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.1)" }}>
        {!collapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", padding: "0 4px" }}>
            <img src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"} style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }} />
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{user?.name || 'Admin'}</div>
              <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: 800 }}>{user?.role}</div>
            </div>
          </div>
        )}
        
        <button 
          onClick={() => setCollapsed(!collapsed)}
          style={{ 
            width: "100%", 
            padding: "10px", 
            borderRadius: "8px", 
            background: "rgba(255,255,255,0.03)", 
            border: "1px solid rgba(255,255,255,0.05)", 
            color: "#94a3b8", 
            cursor: "pointer", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center" 
          }}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </div>
  );
}
