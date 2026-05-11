"use client";
import { useState, useEffect } from "react";
import { 
  User, Lock, Bell, Shield, 
  Save, Camera, Mail, Phone,
  ChevronRight, Globe, CreditCard
} from "lucide-react";
import { authApi, uploadApi } from "@/lib/api";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Profile state
  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    avatar: ""
  });

  // Password state
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await authApi.getMe();
      setUser(data);
      setProfileData({
        name: data.name || "",
        phone: data.phone || "",
        avatar: data.avatar || ""
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authApi.updateMe(profileData);
      alert("Cập nhật thông tin thành công!");
    } catch (err) {
      alert("Lỗi: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Mật khẩu mới không khớp!");
      return;
    }
    setSaving(true);
    try {
      await authApi.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      alert("Đổi mật khẩu thành công!");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      alert("Lỗi: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const res = await uploadApi.uploadImage(file);
      setProfileData({ ...profileData, avatar: res.url });
    } catch (err) {
      alert("Lỗi tải ảnh: " + err.message);
    }
  };

  if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Đang tải...</div>;

  return (
    <div style={{ maxWidth: "1000px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>Cài đặt hệ thống</h1>
        <p style={{ color: "#64748b", fontWeight: 500 }}>Quản lý thông tin cá nhân và cấu hình tài khoản của bạn.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "32px" }}>
        {/* SIDE NAV */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <button 
            onClick={() => setActiveTab("profile")}
            style={{ 
              display: "flex", alignItems: "center", gap: "12px", padding: "14px 20px", borderRadius: "14px", 
              border: "none", background: activeTab === "profile" ? "#0d9488" : "transparent", 
              color: activeTab === "profile" ? "#fff" : "#64748b", fontWeight: 700, cursor: "pointer", textAlign: "left",
              transition: "all 0.2s"
            }}
          >
            <User size={20} /> Hồ sơ cá nhân
          </button>
          <button 
            onClick={() => setActiveTab("password")}
            style={{ 
              display: "flex", alignItems: "center", gap: "12px", padding: "14px 20px", borderRadius: "14px", 
              border: "none", background: activeTab === "password" ? "#0d9488" : "transparent", 
              color: activeTab === "password" ? "#fff" : "#64748b", fontWeight: 700, cursor: "pointer", textAlign: "left",
              transition: "all 0.2s"
            }}
          >
            <Lock size={20} /> Đổi mật khẩu
          </button>
          <button 
            onClick={() => setActiveTab("notifications")}
            style={{ 
              display: "flex", alignItems: "center", gap: "12px", padding: "14px 20px", borderRadius: "14px", 
              border: "none", background: activeTab === "notifications" ? "#0d9488" : "transparent", 
              color: activeTab === "notifications" ? "#fff" : "#64748b", fontWeight: 700, cursor: "pointer", textAlign: "left",
              transition: "all 0.2s"
            }}
          >
            <Bell size={20} /> Thông báo
          </button>
          <button 
            onClick={() => setActiveTab("security")}
            style={{ 
              display: "flex", alignItems: "center", gap: "12px", padding: "14px 20px", borderRadius: "14px", 
              border: "none", background: activeTab === "security" ? "#0d9488" : "transparent", 
              color: activeTab === "security" ? "#fff" : "#64748b", fontWeight: 700, cursor: "pointer", textAlign: "left",
              transition: "all 0.2s"
            }}
          >
            <Shield size={20} /> Quyền riêng tư
          </button>
        </div>

        {/* CONTENT AREA */}
        <div style={{ background: "#fff", borderRadius: "24px", padding: "40px", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
          {activeTab === "profile" && (
            <form onSubmit={handleProfileUpdate}>
              <div style={{ marginBottom: "32px", display: "flex", alignItems: "center", gap: "24px" }}>
                <div style={{ position: "relative" }}>
                  <img 
                    src={profileData.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200"} 
                    style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", border: "4px solid #f1f5f9" }} 
                  />
                  <label style={{ 
                    position: "absolute", bottom: "0", right: "0", width: "32px", height: "32px", 
                    background: "#0d9488", color: "#fff", borderRadius: "50%", display: "flex", 
                    alignItems: "center", justifyContent: "center", cursor: "pointer", border: "2px solid #fff"
                  }}>
                    <Camera size={16} />
                    <input type="file" hidden onChange={handleAvatarUpload} accept="image/*" />
                  </label>
                </div>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", marginBottom: "4px" }}>Ảnh đại diện</h3>
                  <p style={{ fontSize: "14px", color: "#64748b" }}>Sử dụng ảnh JPG hoặc PNG chất lượng cao.</p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Họ và tên</label>
                  <input 
                    type="text" 
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Số điện thoại</label>
                  <input 
                    type="text" 
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "32px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Email (Không thể thay đổi)</label>
                <input 
                  type="email" 
                  value={user?.email} 
                  disabled
                  style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #f1f5f9", background: "#f8fafc", color: "#94a3b8", cursor: "not-allowed" }}
                />
              </div>

              <button 
                type="submit" 
                disabled={saving}
                style={{ padding: "14px 28px", borderRadius: "12px", background: "#0d9488", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Save size={18} /> {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </form>
          )}

          {activeTab === "password" && (
            <form onSubmit={handlePasswordChange}>
              <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "32px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Mật khẩu hiện tại</label>
                  <input 
                    type="password" 
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none" }}
                  />
                </div>
                <hr style={{ border: "none", borderTop: "1px solid #f1f5f9" }} />
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Mật khẩu mới</label>
                  <input 
                    type="password" 
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Xác nhận mật khẩu mới</label>
                  <input 
                    type="password" 
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none" }}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={saving}
                style={{ padding: "14px 28px", borderRadius: "12px", background: "#0d9488", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Save size={18} /> {saving ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
              </button>
            </form>
          )}

          {activeTab === "notifications" && (
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", marginBottom: "24px" }}>Cấu hình thông báo</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {[
                  { title: "Thông báo đơn đặt mới", desc: "Nhận thông báo khi có khách hàng đặt Homestay/Tour mới." },
                  { title: "Đánh giá từ khách hàng", desc: "Nhận thông báo khi có đánh giá mới về dịch vụ của bạn." },
                  { title: "Cập nhật hệ thống", desc: "Các thông báo quan trọng về tính năng và bảo trì hệ thống." }
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: "4px" }}>{item.title}</div>
                      <div style={{ fontSize: "13px", color: "#64748b" }}>{item.desc}</div>
                    </div>
                    <div style={{ width: "48px", height: "24px", borderRadius: "100px", background: "#0d9488", position: "relative", cursor: "pointer" }}>
                      <div style={{ position: "absolute", right: "4px", top: "4px", width: "16px", height: "16px", borderRadius: "50%", background: "#fff" }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", marginBottom: "24px" }}>Bảo mật & Quyền riêng tư</h3>
              <div style={{ padding: "20px", borderRadius: "16px", background: "#fef2f2", border: "1px solid #fee2e2", marginBottom: "24px" }}>
                <div style={{ color: "#991b1b", fontWeight: 700, marginBottom: "8px" }}>Xóa tài khoản</div>
                <p style={{ fontSize: "13px", color: "#b91c1c", marginBottom: "16px" }}>Một khi bạn xóa tài khoản, tất cả dữ liệu (sản phẩm, đơn hàng, đánh giá) sẽ bị xóa vĩnh viễn.</p>
                <button style={{ padding: "10px 20px", borderRadius: "10px", background: "#ef4444", color: "#fff", border: "none", fontWeight: 700, cursor: "pointer" }}>
                  Xóa tài khoản ngay
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
