"use client";
import { useState, useEffect } from "react";
import { 
  Ticket, Plus, Search, Filter, 
  Calendar, Trash2, Edit2, CheckCircle, 
  XCircle, Copy, MoreVertical
} from "lucide-react";
import { couponsApi } from "@/lib/api";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "PERCENTAGE",
    value: "",
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
    usageLimit: ""
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const data = await couponsApi.getAll();
      setCoupons(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await couponsApi.create(formData);
      alert("Đã tạo mã giảm giá thành công!");
      setShowAddModal(false);
      fetchCoupons();
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa mã này?")) return;
    try {
      await couponsApi.remove(id);
      fetchCoupons();
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    alert("Đã sao chép mã: " + code);
  };

  return (
    <div>
      <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>Quản lý Khuyến mãi</h1>
          <p style={{ color: "#64748b", fontWeight: 500 }}>Tạo và quản lý các mã giảm giá để thu hút khách hàng.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 24px", borderRadius: "12px", background: "#0d9488", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 10px 20px rgba(13,148,136,0.15)" }}
        >
          <Plus size={20} /> Tạo mã mới
        </button>
      </div>

      {/* STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", marginBottom: "32px" }}>
        {[
          { label: "Mã đang hoạt động", value: coupons.filter(c => c.isActive).length, color: "#0d9488", icon: <CheckCircle size={24}/> },
          { label: "Lượt đã sử dụng", value: coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0).toLocaleString(), color: "#8b5cf6", icon: <Ticket size={24}/> },
          { label: "Tổng số mã", value: coupons.length, color: "#f59e0b", icon: <Plus size={24}/> }
        ].map((stat, i) => (
          <div key={i} style={{ background: "#fff", padding: "24px", borderRadius: "24px", border: "1px solid rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: `${stat.color}10`, color: stat.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#64748b" }}>{stat.label}</div>
              <div style={{ fontSize: "24px", fontWeight: 900, color: "#0f172a" }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* LIST */}
      <div style={{ background: "#fff", borderRadius: "24px", border: "1px solid rgba(0,0,0,0.05)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead style={{ background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
            <tr>
              <th style={{ padding: "20px 24px", fontSize: "13px", fontWeight: 700, color: "#64748b" }}>MÃ CODE</th>
              <th style={{ padding: "20px 24px", fontSize: "13px", fontWeight: 700, color: "#64748b" }}>LOẠI GIẢM GIÁ</th>
              <th style={{ padding: "20px 24px", fontSize: "13px", fontWeight: 700, color: "#64748b" }}>GIÁ TRỊ</th>
              <th style={{ padding: "20px 24px", fontSize: "13px", fontWeight: 700, color: "#64748b" }}>THỜI HẠN</th>
              <th style={{ padding: "20px 24px", fontSize: "13px", fontWeight: 700, color: "#64748b" }}>SỬ DỤNG</th>
              <th style={{ padding: "20px 24px", fontSize: "13px", fontWeight: 700, color: "#64748b" }}>TRẠNG THÁI</th>
              <th style={{ padding: "20px 24px", fontSize: "13px", fontWeight: 700, color: "#64748b", textAlign: "right" }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "20px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <code style={{ background: "#f1f5f9", padding: "4px 8px", borderRadius: "6px", fontWeight: 800, color: "#0f172a" }}>{coupon.code}</code>
                    <button onClick={() => copyToClipboard(coupon.code)} style={{ border: "none", background: "none", cursor: "pointer", color: "#94a3b8" }}><Copy size={14}/></button>
                  </div>
                </td>
                <td style={{ padding: "20px 24px", fontSize: "14px", fontWeight: 600, color: "#475569" }}>
                  {coupon.discountType === 'PERCENTAGE' ? 'Phần trăm (%)' : 'Số tiền cố định'}
                </td>
                <td style={{ padding: "20px 24px", fontSize: "14px", fontWeight: 800, color: "#0d9488" }}>
                  {coupon.discountType === 'PERCENTAGE' ? `${coupon.value}%` : `₫${coupon.value.toLocaleString()}`}
                </td>
                <td style={{ padding: "20px 24px" }}>
                  <div style={{ fontSize: "13px", color: "#64748b" }}>{new Date(coupon.startDate).toLocaleDateString('vi-VN')}</div>
                  <div style={{ fontSize: "13px", color: "#94a3b8" }}>đến {new Date(coupon.endDate).toLocaleDateString('vi-VN')}</div>
                </td>
                <td style={{ padding: "20px 24px" }}>
                  <div style={{ width: "100px", height: "6px", background: "#f1f5f9", borderRadius: "3px", marginBottom: "4px" }}>
                    <div style={{ width: `${(coupon.usedCount / coupon.usageLimit) * 100}%`, height: "100%", background: "#0d9488", borderRadius: "3px" }}></div>
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>{coupon.usedCount}/{coupon.usageLimit} lượt</div>
                </td>
                <td style={{ padding: "20px 24px" }}>
                  <span style={{ 
                    padding: "4px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: 800,
                    background: coupon.isActive ? "#f0fdf4" : "#f1f5f9",
                    color: coupon.isActive ? "#10b981" : "#94a3b8"
                  }}>
                    {coupon.isActive ? 'ĐANG CHẠY' : 'DỪNG'}
                  </span>
                </td>
                <td style={{ padding: "20px 24px", textAlign: "right" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                    <button style={{ width: "32px", height: "32px", borderRadius: "8px", border: "none", background: "#f8fafc", color: "#64748b", cursor: "pointer" }}><Edit2 size={16}/></button>
                    <button onClick={() => handleDelete(coupon.id)} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "none", background: "#fef2f2", color: "#ef4444", cursor: "pointer" }}><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* ADD MODAL */}
      {showAddModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <form onSubmit={handleAdd} style={{ background: "#fff", borderRadius: "28px", width: "100%", maxWidth: "500px", padding: "32px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", marginBottom: "24px" }}>Tạo mã giảm giá mới</h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Mã Code</label>
                <input 
                  type="text" 
                  placeholder="Ví dụ: SUMMER2026"
                  value={formData.code}
                  onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  required
                  style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Loại giảm giá</label>
                  <select 
                    value={formData.discountType}
                    onChange={e => setFormData({...formData, discountType: e.target.value})}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none", background: "#fff" }}
                  >
                    <option value="PERCENTAGE">Phần trăm (%)</option>
                    <option value="FIXED_AMOUNT">Số tiền cố định (VNĐ)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Giá trị</label>
                  <input 
                    type="number"
                    value={formData.value}
                    onChange={e => setFormData({...formData, value: e.target.value})}
                    required
                    style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Từ ngày</label>
                  <input 
                    type="date"
                    value={formData.startDate}
                    onChange={e => setFormData({...formData, startDate: e.target.value})}
                    required
                    style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Đến ngày</label>
                  <input 
                    type="date"
                    value={formData.endDate}
                    onChange={e => setFormData({...formData, endDate: e.target.value})}
                    required
                    style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Giới hạn lượt dùng</label>
                <input 
                  type="number"
                  placeholder="Để trống nếu không giới hạn"
                  value={formData.usageLimit}
                  onChange={e => setFormData({...formData, usageLimit: e.target.value})}
                  style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
              <button 
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ flex: 1, padding: "14px", borderRadius: "12px", background: "#f1f5f9", color: "#475569", fontWeight: 700, border: "none", cursor: "pointer" }}
              >
                Hủy bỏ
              </button>
              <button 
                type="submit"
                style={{ flex: 1, padding: "14px", borderRadius: "12px", background: "#0d9488", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer" }}
              >
                Tạo mã ngay
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
