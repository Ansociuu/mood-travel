"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { authApi } from "@/lib/api";
import { Bell, Search } from "lucide-react";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await authApi.getMe();
        if (userData.role === 'USER') {
          router.push("/dashboard");
          return;
        }
        setUser(userData);
      } catch (err) {
        router.push("/login?redirect=/admin");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "40px", height: "40px", border: "4px solid #e2e8f0", borderTopColor: "#0d9488", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ fontWeight: 600, color: "#64748b" }}>Đang xác thực quyền truy cập...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <AdminSidebar user={user} />
      
      <div style={{ flex: 1, marginLeft: "var(--sidebar-width, 280px)", transition: "margin 0.3s" }}>
        {/* TOP BAR */}
        <header style={{ 
          height: "72px", 
          background: "#fff", 
          borderBottom: "1px solid rgba(0,0,0,0.05)", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between", 
          padding: "0 40px",
          position: "sticky",
          top: 0,
          zIndex: 90
        }}>
          <div style={{ position: "relative", width: "400px" }}>
            <Search size={18} color="#94a3b8" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} />
            <input 
              type="text" 
              placeholder="Tìm kiếm thông tin quản trị..." 
              style={{ width: "100%", padding: "10px 16px 10px 48px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none", background: "#f8fafc", fontSize: "14px" }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <button style={{ position: "relative", background: "none", border: "none", color: "#64748b", cursor: "pointer" }}>
              <Bell size={22} />
              <div style={{ position: "absolute", top: "0", right: "0", width: "8px", height: "8px", background: "#ef4444", borderRadius: "50%", border: "2px solid #fff" }} />
            </button>
            <div style={{ width: "1px", height: "32px", background: "#e2e8f0" }} />
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>{user.name}</div>
                <div style={{ fontSize: "12px", color: "#0d9488", fontWeight: 700 }}>{user.role}</div>
              </div>
              <img src={user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"} style={{ width: "40px", height: "40px", borderRadius: "12px", objectFit: "cover" }} />
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main style={{ padding: "40px" }}>
          {children}
        </main>
      </div>
      
      <style>{`
        :root {
          --sidebar-width: 280px;
        }
        /* Handle sidebar collapse margin adjustment */
      `}</style>
    </div>
  );
}
