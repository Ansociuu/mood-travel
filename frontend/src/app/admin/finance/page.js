"use client";
import { useState, useEffect } from "react";
import { 
  DollarSign, TrendingUp, BarChart3, 
  ArrowUpRight, ArrowDownRight, Calendar,
  Download, PieChart, Building2, Map,
  ShieldCheck, AlertCircle, XCircle, Info, Clock
} from "lucide-react";
import { adminApi } from "@/lib/api";

export default function AdminFinancePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchFinanceData();
  }, [filters]);

  const fetchFinanceData = async () => {
    setLoading(true);
    try {
      const result = await adminApi.getFinance(filters);
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !data) return <div style={{ padding: "40px", textAlign: "center" }}>Đang tải báo cáo tài chính...</div>;

  const stats = data?.stats || {};
  const maxRevenue = data ? Math.max(...data.monthlyRevenue.map(m => m.revenue)) || 1 : 1;

  return (
    <div>
      <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>Quản trị Tài chính chuyên sâu</h1>
          <p style={{ color: "#64748b", fontWeight: 500 }}>Báo cáo chi tiết doanh thu, chiết khấu và hiệu quả kinh doanh.</p>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div style={{ display: "flex", background: "#fff", padding: "8px", borderRadius: "12px", border: "1px solid #e2e8f0", gap: "8px" }}>
            <input 
              type="date" 
              value={filters.startDate}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              style={{ border: "none", outline: "none", fontSize: "13px", fontWeight: 600, color: "#0f172a" }} 
            />
            <span style={{ color: "#cbd5e1" }}>→</span>
            <input 
              type="date" 
              value={filters.endDate}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              style={{ border: "none", outline: "none", fontSize: "13px", fontWeight: 600, color: "#0f172a" }} 
            />
          </div>
          <button style={{ padding: "12px 20px", borderRadius: "12px", background: "#0d9488", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
            <Download size={18} /> Xuất dữ liệu
          </button>
        </div>
      </div>

      {/* CORE STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "32px" }}>
        <div style={{ background: "linear-gradient(135deg, #0d9488, #14b8a6)", padding: "24px", borderRadius: "24px", color: "#fff", boxShadow: "0 10px 25px rgba(13,148,136,0.2)" }}>
          <div style={{ fontSize: "14px", fontWeight: 600, opacity: 0.9, marginBottom: "8px" }}>Tổng doanh thu (Gross)</div>
          <div style={{ fontSize: "24px", fontWeight: 900 }}>₫{Number(stats.grossRevenue || 0).toLocaleString()}</div>
          <div style={{ marginTop: "12px", fontSize: "12px", background: "rgba(255,255,255,0.2)", padding: "4px 8px", borderRadius: "6px", display: "inline-block" }}>
            Tổng tiền khách đã thanh toán
          </div>
        </div>

        <div style={{ background: "#fff", padding: "24px", borderRadius: "24px", border: "1px solid rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: "14px", color: "#64748b", fontWeight: 600, marginBottom: "8px" }}>Thực nhận (Net)</div>
          <div style={{ fontSize: "24px", fontWeight: 900, color: "#0f172a" }}>₫{Number(stats.netRevenue || 0).toLocaleString()}</div>
          <div style={{ marginTop: "12px", fontSize: "12px", color: "#0d9488", fontWeight: 700 }}>
            Đã khấu trừ 10% phí sàn
          </div>
        </div>

        <div style={{ background: "#fff", padding: "24px", borderRadius: "24px", border: "1px solid rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: "14px", color: "#64748b", fontWeight: 600, marginBottom: "8px" }}>Tiền hụt (Cancelled)</div>
          <div style={{ fontSize: "24px", fontWeight: 900, color: "#ef4444" }}>₫{Number(stats.lostRevenue || 0).toLocaleString()}</div>
          <div style={{ marginTop: "12px", fontSize: "12px", color: "#64748b", fontWeight: 600 }}>
            {stats.cancelledCount || 0} đơn đã bị hủy
          </div>
        </div>

        <div style={{ background: "#fff", padding: "24px", borderRadius: "24px", border: "1px solid rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: "14px", color: "#64748b", fontWeight: 600, marginBottom: "8px" }}>Hoa hồng trả sàn</div>
          <div style={{ fontSize: "24px", fontWeight: 900, color: "#f59e0b" }}>₫{Number(stats.commission || 0).toLocaleString()}</div>
          <div style={{ marginTop: "12px", fontSize: "12px", color: "#64748b", fontWeight: 600 }}>
            Tỉ lệ chiết khấu cố định 10%
          </div>
        </div>
      </div>

      {/* REVENUE BREAKDOWN */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px", marginBottom: "32px" }}>
        <div style={{ background: "#fff", padding: "24px", borderRadius: "20px", border: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div style={{ padding: "8px", borderRadius: "10px", background: "#f0fdf4", color: "#10b981" }}><ShieldCheck size={20}/></div>
            <div style={{ fontSize: "15px", fontWeight: 700 }}>Đã hoàn tất (Completed)</div>
          </div>
          <div style={{ fontSize: "20px", fontWeight: 800, color: "#10b981" }}>₫{Number(stats.completedRevenue || 0).toLocaleString()}</div>
          <p style={{ fontSize: "12px", color: "#64748b", marginTop: "8px" }}>Doanh thu từ các chuyến đi đã kết thúc.</p>
        </div>

        <div style={{ background: "#fff", padding: "24px", borderRadius: "20px", border: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div style={{ padding: "8px", borderRadius: "10px", background: "#fffbeb", color: "#f59e0b" }}><Clock size={20}/></div>
            <div style={{ fontSize: "15px", fontWeight: 700 }}>Đang chờ (Expected)</div>
          </div>
          <div style={{ fontSize: "20px", fontWeight: 800, color: "#f59e0b" }}>₫{Number(stats.pendingRevenue || 0).toLocaleString()}</div>
          <p style={{ fontSize: "12px", color: "#64748b", marginTop: "8px" }}>Các đơn hàng đã xác nhận nhưng chưa thực hiện.</p>
        </div>

        <div style={{ background: "#fff", padding: "24px", borderRadius: "20px", border: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div style={{ padding: "8px", borderRadius: "10px", background: "#fef2f2", color: "#ef4444" }}><XCircle size={20}/></div>
            <div style={{ fontSize: "15px", fontWeight: 700 }}>Tỉ lệ hủy đơn</div>
          </div>
          <div style={{ fontSize: "20px", fontWeight: 800, color: "#ef4444" }}>
            {((stats.cancelledCount / (stats.bookingCount + stats.cancelledCount || 1)) * 100).toFixed(1)}%
          </div>
          <p style={{ fontSize: "12px", color: "#64748b", marginTop: "8px" }}>Dựa trên tổng số đơn hàng đã đặt.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "32px" }}>
        {/* MONTHLY CHART */}
        <div style={{ background: "#fff", borderRadius: "24px", padding: "32px", border: "1px solid rgba(0,0,0,0.05)" }}>
          <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", marginBottom: "32px" }}>Biểu đồ doanh thu theo thời gian</h3>
          <div style={{ height: "300px", display: "flex", alignItems: "flex-end", gap: "20px", paddingBottom: "40px", position: "relative" }}>
            {data?.monthlyRevenue.map((m, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", position: "relative" }}>
                <div style={{ 
                  width: "100%", 
                  height: `${(m.revenue / maxRevenue) * 100}%`, 
                  background: "linear-gradient(to top, #0d9488, #14b8a6)", 
                  borderRadius: "6px",
                  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer"
                }} title={`₫${Number(m.revenue).toLocaleString()}`}></div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", whiteSpace: "nowrap" }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CATEGORY & TOP PRODUCTS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          <div style={{ background: "#fff", borderRadius: "24px", padding: "32px", border: "1px solid rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", marginBottom: "24px" }}>Cơ cấu doanh thu</h3>
            {data?.categories.map((cat, i) => {
              const percentage = stats.grossRevenue > 0 ? (cat.value / stats.grossRevenue) * 100 : 0;
              return (
                <div key={i} style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" }}>
                    <span style={{ fontWeight: 700, color: "#475569" }}>{cat.name}</span>
                    <span style={{ fontWeight: 800 }}>{percentage.toFixed(1)}%</span>
                  </div>
                  <div style={{ height: "8px", background: "#f1f5f9", borderRadius: "100px", overflow: "hidden" }}>
                    <div style={{ width: `${percentage}%`, height: "100%", background: cat.color }}></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ background: "#fff", borderRadius: "24px", padding: "32px", border: "1px solid rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", marginBottom: "20px" }}>Sản phẩm nổi bật</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {data?.topProducts.map((p, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>{p.name}</div>
                  <div style={{ fontSize: "14px", fontWeight: 800, color: "#0d9488" }}>{p.bookings} đơn</div>
                </div>
              ))}
              {data?.topProducts.length === 0 && <p style={{ fontSize: "13px", color: "#94a3b8", textAlign: "center" }}>Chưa có dữ liệu sản phẩm.</p>}
            </div>
          </div>

          {data?.topOwners && data.topOwners.length > 0 && (
            <div style={{ background: "#fff", borderRadius: "24px", padding: "32px", border: "1px solid rgba(0,0,0,0.05)" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", marginBottom: "20px" }}>Top Đối tác doanh thu</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {data.topOwners.map((owner, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9", paddingBottom: "12px" }}>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>{owner.name}</div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>{owner.email}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "14px", fontWeight: 800, color: "#0d9488" }}>₫{Number(owner.revenue).toLocaleString()}</div>
                      <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600 }}>{owner.bookings} đơn</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PAYOUT MOCK SECTION */}
      <div style={{ marginTop: "32px", background: "rgba(13,148,136,0.05)", padding: "24px", borderRadius: "24px", border: "1px solid rgba(13,148,136,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ padding: "12px", borderRadius: "14px", background: "#0d9488", color: "#fff" }}><Info size={24}/></div>
          <div>
            <div style={{ fontWeight: 800, color: "#0f172a" }}>Lịch thanh toán tiếp theo</div>
            <div style={{ fontSize: "14px", color: "#64748b" }}>Số tiền dự kiến: ₫{Number(stats.netRevenue || 0).toLocaleString()} • Ngày: 15/05/2026</div>
          </div>
        </div>
        <button style={{ padding: "12px 24px", borderRadius: "12px", background: "#fff", border: "1px solid #0d9488", color: "#0d9488", fontWeight: 700, cursor: "pointer" }}>
          Cài đặt thanh toán
        </button>
      </div>
    </div>
  );
}
