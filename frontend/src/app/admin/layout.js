"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { authApi } from "@/lib/api";
import { Bell, Search, Menu } from "lucide-react";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

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
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 95 }}
        />
      )}

      {/* Sidebar Wrapper */}
      <div className={`sidebar-wrapper ${mobileMenuOpen ? 'mobile-open' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <AdminSidebar user={user} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      </div>
      
      <div className={`content-wrapper ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* TOP BAR */}
        <header className="top-header">
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button 
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setMobileMenuOpen(!mobileMenuOpen);
                } else {
                  setSidebarCollapsed(!sidebarCollapsed);
                }
              }}
              style={{ background: "#f8fafc", border: "1px solid #e2e8f0", width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#0f172a" }}
            >
              <Menu size={20} />
            </button>
            <div style={{ position: "relative", width: "300px" }} className="top-search">
              <Search size={18} color="#94a3b8" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} />
              <input 
                type="text" 
                placeholder="Tìm kiếm..." 
                style={{ width: "100%", padding: "10px 16px 10px 48px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none", background: "#f8fafc", fontSize: "14px" }}
              />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <div style={{ position: "relative" }} className="top-notifications">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                style={{ position: "relative", background: "none", border: "none", color: "#64748b", cursor: "pointer" }}
              >
                <Bell size={22} />
                <div style={{ position: "absolute", top: "0", right: "0", width: "8px", height: "8px", background: "#ef4444", borderRadius: "50%", border: "2px solid #fff" }} />
              </button>

              {showNotifications && (
                <div style={{ position: "absolute", right: 0, top: "40px", width: "320px", background: "#fff", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.1)", border: "1px solid #f1f5f9", zIndex: 100, overflow: "hidden" }}>
                  <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", fontWeight: 800, fontSize: "14px", color: "#0f172a" }}>Thông báo mới</div>
                  <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                    {[
                      { title: "Đơn hàng mới", desc: "Khách hàng Nguyễn Văn A vừa đặt Homestay Ocean", time: "2 phút trước" },
                      { title: "Đánh giá mới", desc: "Bạn có 1 đánh giá 5 sao cho Tour Sapa", time: "1 giờ trước" },
                      { title: "Hệ thống", desc: "Chào mừng bạn đến với trang quản trị VietJourney", time: "Hôm qua" }
                    ].map((n, i) => (
                      <div key={i} style={{ padding: "16px 20px", borderBottom: "1px solid #f8fafc", cursor: "pointer" }}>
                        <div style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a", marginBottom: "4px" }}>{n.title}</div>
                        <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>{n.desc}</div>
                        <div style={{ fontSize: "11px", color: "#94a3b8" }}>{n.time}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: "12px", textAlign: "center", background: "#f8fafc", fontSize: "12px", fontWeight: 700, color: "#0d9488", cursor: "pointer" }}>Xem tất cả</div>
                </div>
              )}
            </div>
            <div style={{ width: "1px", height: "32px", background: "#e2e8f0" }} className="divider" />
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ textAlign: "right" }} className="user-info-text">
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>{user.name}</div>
                <div style={{ fontSize: "12px", color: "#0d9488", fontWeight: 700 }}>{user.role}</div>
              </div>
              <img src={user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"} style={{ width: "40px", height: "40px", borderRadius: "12px", objectFit: "cover" }} />
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="admin-main">
          {children}
        </main>
      </div>
      
      <style>{`
        .sidebar-wrapper {
          position: fixed;
          top: 0; bottom: 0;
          z-index: 100;
          transition: all 0.3s ease;
          width: 280px;
          left: 0;
        }
        .sidebar-wrapper.collapsed { width: 80px; }
        
        .content-wrapper {
          flex: 1;
          margin-left: 280px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          min-width: 0;
        }
        .content-wrapper.sidebar-collapsed { margin-left: 80px; }
        
        .top-header {
          height: 72px;
          background: #fff;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          position: sticky;
          top: 0;
          zIndex: 90;
        }
        
        .admin-main { padding: 40px; }

        @media (max-width: 1200px) {
          .sidebar-wrapper { width: 80px; }
          .content-wrapper { margin-left: 80px; }
          /* Note: We need to tell the sidebar component it's collapsed via props, 
             which is already handled by sidebarCollapsed state in most cases, 
             but here we force the container width */
        }

        @media (max-width: 1024px) {
          .top-search { width: 200px !important; }
          .top-header { padding: 0 20px; }
          .admin-main { padding: 24px 20px; }
        }

        @media (max-width: 768px) {
          .sidebar-wrapper { left: -280px; width: 280px !important; }
          .sidebar-wrapper.mobile-open { left: 0; }
          .content-wrapper { margin-left: 0 !important; }
          .top-search { display: none !important; }
        }
        
        @media (max-width: 640px) {
          .user-info-text { display: none; }
          .divider { display: none; }
          .top-notifications { margin-right: 8px; }
        }
      `}</style>
    </div>
  );
}
