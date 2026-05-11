"use client";
import { useState, useEffect } from "react";
import { 
  TrendingUp, Users, ShoppingBag, Star, 
  ArrowUpRight, ArrowDownRight, Calendar,
  MoreVertical, ExternalLink
} from "lucide-react";
import { authApi } from "@/lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    revenue: 125000000,
    bookings: 48,
    products: 12,
    rating: 4.8,
    revenueGrowth: 12.5,
    bookingsGrowth: 8.2
  });

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
          value={`₫${(stats.revenue).toLocaleString()}`} 
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
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f8fafc" }}>
                    <td style={{ padding: "16px 0" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700 }}>ND</div>
                        <div style={{ fontSize: "14px", fontWeight: 600 }}>Nguyễn Văn A</div>
                      </div>
                    </td>
                    <td style={{ padding: "16px 0", fontSize: "14px", fontWeight: 500 }}>Sapa Tour 3N2Đ</td>
                    <td style={{ padding: "16px 0", fontSize: "14px", color: "#64748b" }}>12/05/2026</td>
                    <td style={{ padding: "16px 0", fontSize: "14px", fontWeight: 700 }}>₫2,500,000</td>
                    <td style={{ padding: "16px 0" }}>
                      <span style={{ fontSize: "11px", fontWeight: 800, padding: "4px 8px", borderRadius: "6px", background: "#f0fdf4", color: "#10b981" }}>HOÀN TẤT</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TOP PRODUCTS */}
        <div style={{ background: "#fff", borderRadius: "24px", padding: "32px", border: "1px solid rgba(0,0,0,0.05)" }}>
          <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", marginBottom: "24px" }}>Sản phẩm bán chạy</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <img src={`https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=100&q=80`} style={{ width: "56px", height: "56px", borderRadius: "12px", objectFit: "cover" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "4px" }}>Homestay Rừng Thông</div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>12 đơn đặt • ₫18,000,000</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "14px", fontWeight: 800, color: "#0d9488" }}>4.9</div>
                  <div style={{ display: "flex", gap: "1px" }}>
                    <Star size={10} fill="#f59e0b" color="#f59e0b" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button style={{ width: "100%", marginTop: "32px", padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "none", color: "#64748b", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
            Xem báo cáo chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}
