"use client";
import { useState, useEffect } from "react";
import { 
  Users, UserCheck, UserX, Shield, 
  Trash2, Mail, Calendar, Search, 
  Filter, MoreVertical, CheckCircle2, XCircle, AlertCircle
} from "lucide-react";
import { usersApi } from "@/lib/api";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await usersApi.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVerify = async (userId) => {
    try {
      await usersApi.toggleVerify(userId);
      setUsers(users.map(u => u.id === userId ? { ...u, isVerified: !u.isVerified } : u));
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  const handleToggleVerifyOwner = async (userId) => {
    try {
      await usersApi.toggleVerifyOwner(userId);
      setUsers(users.map(u => u.id === userId ? { ...u, isVerifiedOwner: !u.isVerifiedOwner } : u));
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    if (!confirm(`Bạn có chắc chắn muốn đổi vai trò người dùng này sang ${newRole}?`)) return;
    try {
      await usersApi.updateRole(userId, newRole);
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm("Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa người dùng này?")) return;
    try {
      await usersApi.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "ALL" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div>
      <style jsx>{`
        .users-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }
        @media (max-width: 640px) {
          .users-header { flex-direction: column; align-items: flex-start; gap: 16px; }
          .users-header h1 { font-size: 24px !important; }
          .users-header p { font-size: 14px; }
        }
      `}</style>
      <div className="users-header">
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>Quản lý Người dùng</h1>
          <p style={{ color: "#64748b", fontWeight: 500 }}>Quản lý quyền hạn, xác thực và thông tin thành viên trên hệ thống.</p>
        </div>
      </div>

      {/* FILTERS */}
      <div style={{ background: "#fff", padding: "24px", borderRadius: "24px", border: "1px solid rgba(0,0,0,0.05)", marginBottom: "32px", display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: "300px", position: "relative" }}>
          <Search size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên hoặc email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "12px 16px 12px 48px", borderRadius: "14px", border: "1px solid #e2e8f0", outline: "none", fontSize: "14px" }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#64748b" }}>Vai trò:</div>
          <select 
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            style={{ padding: "10px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none", background: "#fff", cursor: "pointer", fontSize: "14px", fontWeight: 600 }}
          >
            <option value="ALL">Tất cả</option>
            <option value="USER">Khách hàng</option>
            <option value="OWNER">Chủ cơ sở</option>
            <option value="ADMIN">Quản trị viên</option>
          </select>
        </div>
      </div>

      {/* USERS TABLE */}
      <div style={{ background: "#fff", borderRadius: "24px", border: "1px solid rgba(0,0,0,0.05)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                <th style={{ textAlign: "left", padding: "20px 24px", fontSize: "13px", fontWeight: 700, color: "#64748b" }}>NGƯỜI DÙNG</th>
                <th style={{ textAlign: "left", padding: "20px 24px", fontSize: "13px", fontWeight: 700, color: "#64748b" }}>VAI TRÒ</th>
                <th style={{ textAlign: "left", padding: "20px 24px", fontSize: "13px", fontWeight: 700, color: "#64748b" }}>XÁC THỰC</th>
                <th style={{ textAlign: "left", padding: "20px 24px", fontSize: "13px", fontWeight: 700, color: "#64748b" }}>XÁC THỰC CHỦ NHÀ</th>
                <th style={{ textAlign: "center", padding: "20px 24px", fontSize: "13px", fontWeight: 700, color: "#64748b" }}>HOẠT ĐỘNG</th>
                <th style={{ textAlign: "left", padding: "20px 24px", fontSize: "13px", fontWeight: 700, color: "#64748b" }}>NGÀY THAM GIA</th>
                <th style={{ textAlign: "right", padding: "20px 24px", fontSize: "13px", fontWeight: 700, color: "#64748b" }}>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>Đang tải danh sách người dùng...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan="6" style={{ padding: "60px", textAlign: "center", color: "#94a3b8" }}>Không tìm thấy người dùng phù hợp.</td></tr>
              ) : filteredUsers.map((u) => (
                <tr key={u.id} style={{ borderBottom: "1px solid #f8fafc", transition: "background 0.2s" }}>
                  <td style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", fontSize: "16px", fontWeight: 800 }}>
                        {u.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: "#0f172a" }}>{u.name || "Chưa đặt tên"}</div>
                        <div style={{ fontSize: "13px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}><Mail size={12}/> {u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "20px 24px" }}>
                    <span style={{ 
                      fontSize: "11px", fontWeight: 800, padding: "4px 10px", borderRadius: "8px",
                      background: u.role === 'ADMIN' ? "#fef2f2" : u.role === 'OWNER' ? "#f0fdf4" : "#f1f5f9",
                      color: u.role === 'ADMIN' ? "#ef4444" : u.role === 'OWNER' ? "#10b981" : "#64748b"
                    }}>
                      {u.role === 'ADMIN' ? 'QUẢN TRỊ' : u.role === 'OWNER' ? 'CHỦ CƠ SỞ' : 'KHÁCH HÀNG'}
                    </span>
                  </td>
                  <td style={{ padding: "20px 24px" }}>
                    <div 
                      onClick={() => handleToggleVerify(u.id)}
                      style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", color: u.isVerified ? "#10b981" : "#94a3b8" }}
                    >
                      {u.isVerified ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                      <span style={{ fontSize: "13px", fontWeight: 600 }}>{u.isVerified ? "Đã xác thực" : "Chưa xác thực"}</span>
                    </div>
                  </td>
                  <td style={{ padding: "20px 24px" }}>
                    {u.role === 'OWNER' ? (
                      <div 
                        onClick={() => handleToggleVerifyOwner(u.id)}
                        style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", color: u.isVerifiedOwner ? "#10b981" : "#d97706" }}
                      >
                        {u.isVerifiedOwner ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        <span style={{ fontSize: "13px", fontWeight: 600 }}>{u.isVerifiedOwner ? "Đã duyệt" : "Chờ duyệt"}</span>
                      </div>
                    ) : (
                      <span style={{ color: "#94a3b8", fontSize: "13px" }}>N/A</span>
                    )}
                  </td>
                  <td style={{ padding: "20px 24px", textAlign: "center" }}>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#64748b" }}>
                      {u._count.bookings} đơn đặt • {u._count.ownedHotels + u._count.ownedTours} sản phẩm
                    </div>
                  </td>
                  <td style={{ padding: "20px 24px", fontSize: "14px", color: "#64748b" }}>
                    {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td style={{ padding: "20px 24px", textAlign: "right" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                      <select 
                        onChange={(e) => handleChangeRole(u.id, e.target.value)}
                        value={u.role}
                        style={{ padding: "6px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px", outline: "none" }}
                      >
                        <option value="USER">Đặt là Khách</option>
                        <option value="OWNER">Đặt là Chủ cơ sở</option>
                        <option value="ADMIN">Đặt là Admin</option>
                      </select>
                      <button 
                        onClick={() => handleDelete(u.id)}
                        style={{ width: "32px", height: "32px", borderRadius: "8px", border: "none", background: "#fef2f2", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
