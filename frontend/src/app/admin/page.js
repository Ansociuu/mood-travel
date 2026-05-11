"use client";
import { useState, useEffect } from "react";
import { 
  TrendingUp, Users, ShoppingBag, Star, 
  ArrowUpRight, ArrowDownRight, Calendar,
  MoreVertical, ExternalLink
} from "lucide-react";
import { authApi, adminApi } from "@/lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminApi.getStats();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ label, value, icon: Icon, trend, growth, color }) => (
    <div style={{ background: "#fff", padding: "24px", borderRadius: "24px", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: `${color}10`, color: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={24} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 8px", borderRadius: "100px", background: trend === 'up' ? "#f0fdf4" : "#fef2f2", color: trend === 'up' ? "#10b981" : "#ef4444", fontSize: "12px", fontWeight: 700 }}>
          {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {growth}%
        </div>
      </div>
      <div>
        <div style={{ fontSize: "14px", color: "#64748b", fontWeight: 600, marginBottom: "4px" }}>{label}</div>
        <div style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a" }}>{value}</div>
      </div>
    </div>
  );

  if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Đang tải dữ liệu báo cáo...</div>;
  if (!stats) return <div style={{ padding: "40px", textAlign: "center", color: "#ef4444" }}>Lỗi tải dữ liệu.</div>;

  return (
    <div>
      <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>Tổng quan quản trị</h1>
          <p style={{ color: "#64748b", fontWeight: 500 }}>Chào mừng bạn quay lại! Dưới đây là tình hình kinh doanh của bạn.</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button style={{ padding: "10px 20px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "#fff", color: "#0f172a", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
            <Calendar size={18} /> 30 ngày qua
          </button>
          <button style={{ padding: "10px 20px", borderRadius: "12px", border: "none", background: "#0d9488", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* STATS GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", marginBottom: "40px" }}>
        <StatCard 
          label="Tổng doanh thu" 
          value={`₫${Number(stats.revenue).toLocaleString()}`} 
          icon={TrendingUp} 
          trend="up" 
          growth={stats.revenueGrowth} 
          color="#0d9488" 
        />
        <StatCard 
          label="Đơn đặt chỗ" 
          value={stats.bookings} 
          icon={ShoppingBag} 
          trend="up" 
          growth={stats.bookingsGrowth} 
          color="#8b5cf6" 
        />
        <StatCard 
          label="Sản phẩm hoạt động" 
          value={stats.products} 
          icon={Star} 
          trend="up" 
          growth={2.4} 
          color="#f59e0b" 
        />
        <StatCard 
          label="Đánh giá trung bình" 
          value={stats.rating} 
          icon={Star} 
          trend="up" 
          growth={0.5} 
          color="#ec4899" 
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "32px" }}>
        {/* RECENT BOOKINGS */}
        <div style={{ background: "#fff", borderRadius: "24px", padding: "32px", border: "1px solid rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>Đơn hàng gần đây</h3>
            <button style={{ background: "none", border: "none", color: "#0d9488", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
              Xem tất cả <ExternalLink size={14} />
            </button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <th style={{ textAlign: "left", padding: "16px 0", fontSize: "13px", fontWeight: 700, color: "#64748b" }}>KHÁCH HÀNG</th>
                  <th style={{ textAlign: "left", padding: "16px 0", fontSize: "13px", fontWeight: 700, color: "#64748b" }}>SẢN PHẨM</th>
                  <th style={{ textAlign: "left", padding: "16px 0", fontSize: "13px", fontWeight: 700, color: "#64748b" }}>NGÀY</th>
                  <th style={{ textAlign: "left", padding: "16px 0", fontSize: "13px", fontWeight: 700, color: "#64748b" }}>SỐ TIỀN</th>
                  <th style={{ textAlign: "left", padding: "16px 0", fontSize: "13px", fontWeight: 700, color: "#64748b" }}>TRẠNG THÁI</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentBookings.map((b) => (
                  <tr key={b.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                    <td style={{ padding: "16px 0" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700 }}>
                          {b.guestName.charAt(0)}
                        </div>
                        <div style={{ fontSize: "14px", fontWeight: 600 }}>{b.guestName}</div>
                      </div>
                    </td>
                    <td style={{ padding: "16px 0", fontSize: "14px", fontWeight: 500 }}>{b.productName}</td>
                    <td style={{ padding: "16px 0", fontSize: "14px", color: "#64748b" }}>{new Date(b.date).toLocaleDateString('vi-VN')}</td>
                    <td style={{ padding: "16px 0", fontSize: "14px", fontWeight: 700 }}>₫{Number(b.amount).toLocaleString()}</td>
                    <td style={{ padding: "16px 0" }}>
                      <span style={{ fontSize: "11px", fontWeight: 800, padding: "4px 8px", borderRadius: "6px", background: "#f0fdf4", color: "#10b981" }}>{b.status}</span>
                    </td>
                  </tr>
                ))}
                {stats.recentBookings.length === 0 && (
                  <tr><td colSpan="5" style={{ padding: "30px", textAlign: "center", color: "#94a3b8" }}>Chưa có hoạt động nào.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* TOP PRODUCTS (STILL MOCK FOR NOW) */}
        <div style={{ background: "#fff", borderRadius: "24px", padding: "32px", border: "1px solid rgba(0,0,0,0.05)" }}>
          <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", marginBottom: "24px" }}>Thông báo & Tin nhắn</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <p style={{ fontSize: "14px", color: "#64748b", fontStyle: "italic" }}>Không có thông báo mới nào.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
