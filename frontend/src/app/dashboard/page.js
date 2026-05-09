"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, ShoppingBag, LogOut, Camera, MapPin, Calendar, Clock, CreditCard, ChevronRight, XCircle, CheckCircle, AlertCircle } from "lucide-react";
import { authApi, bookingsApi, uploadApi, paymentsApi } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile"); // profile, bookings
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // Profile state
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [avatar, setAvatar] = useState("");

  // Bookings state
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  useEffect(() => {
    const initDashboard = async () => {
      try {
        const userData = await authApi.getMe();
        setUser(userData);
        setFormData({ name: userData.name || "", phone: userData.phone || "" });
        setAvatar(userData.avatar || "");
        
        // Fetch bookings if active tab is bookings or on init
        fetchBookings();
      } catch (err) {
        router.push("/login?redirect=/dashboard");
      } finally {
        setLoading(false);
      }
    };
    initDashboard();
  }, []);

  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const data = await bookingsApi.getMyBookings();
      setBookings(data);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const updated = await authApi.updateMe({ ...formData, avatar });
      setUser(updated);
      // Update local storage if needed
      localStorage.setItem('user', JSON.stringify(updated));
      alert("Cập nhật hồ sơ thành công!");
    } catch (err) {
      alert("Lỗi cập nhật: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUpdating(true);
    try {
      const res = await uploadApi.uploadImage(file);
      setAvatar(res.url);
      // Update DB immediately
      const updated = await authApi.updateMe({ avatar: res.url });
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
    } catch (err) {
      alert("Lỗi upload ảnh: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) return;
    try {
      await bookingsApi.cancel(id);
      fetchBookings();
    } catch (err) {
      alert("Lỗi hủy đơn: " + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (loading) return <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>Đang tải...</div>;

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ height: "72px" }}></div>

      <main style={{ maxWidth: "1200px", margin: "48px auto", padding: "0 20px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "40px" }}>
          
          {/* SIDEBAR */}
          <aside>
            <div style={{ background: "#fff", borderRadius: "24px", padding: "32px 24px", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
              <div style={{ textAlign: "center", marginBottom: "32px" }}>
                <div style={{ position: "relative", width: "100px", height: "100px", margin: "0 auto 16px" }}>
                  <img src={avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80"} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "4px solid #f0fdfa" }} />
                  <label style={{ position: "absolute", bottom: "0", right: "0", background: "#0d9488", color: "#fff", width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "3px solid #fff" }}>
                    <Camera size={16} />
                    <input type="file" hidden onChange={handleAvatarChange} disabled={updating} />
                  </label>
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", marginBottom: "4px" }}>{user?.name || "Người dùng"}</h3>
                <p style={{ fontSize: "14px", color: "#64748b", fontWeight: 500 }}>{user?.email}</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <button onClick={() => setActiveTab("profile")} style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%", padding: "12px 16px", borderRadius: "12px", border: "none", background: activeTab === "profile" ? "rgba(13,148,136,0.1)" : "transparent", color: activeTab === "profile" ? "#0d9488" : "#475569", fontWeight: 700, fontSize: "15px", cursor: "pointer", transition: "all 0.2s" }}>
                  <User size={20} /> Hồ sơ cá nhân
                </button>
                <button onClick={() => { setActiveTab("bookings"); fetchBookings(); }} style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%", padding: "12px 16px", borderRadius: "12px", border: "none", background: activeTab === "bookings" ? "rgba(13,148,136,0.1)" : "transparent", color: activeTab === "bookings" ? "#0d9488" : "#475569", fontWeight: 700, fontSize: "15px", cursor: "pointer", transition: "all 0.2s" }}>
                  <ShoppingBag size={20} /> Lịch sử đặt chỗ
                </button>
                <div style={{ height: "1px", background: "rgba(0,0,0,0.05)", margin: "8px 0" }}></div>
                <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%", padding: "12px 16px", borderRadius: "12px", border: "none", background: "transparent", color: "#ef4444", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}>
                  <LogOut size={20} /> Đăng xuất
                </button>
              </div>
            </div>
          </aside>

          {/* CONTENT */}
          <div style={{ background: "#fff", borderRadius: "24px", padding: "40px", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
            
            {activeTab === "profile" && (
              <div>
                <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", marginBottom: "32px" }}>Hồ sơ cá nhân</h2>
                <form onSubmit={handleUpdateProfile} style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "500px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Họ và tên</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none", fontSize: "15px", fontWeight: 500 }} placeholder="Nhập họ tên của bạn" />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Số điện thoại</label>
                    <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none", fontSize: "15px", fontWeight: 500 }} placeholder="Ví dụ: 0912 345 678" />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Email (Không thể thay đổi)</label>
                    <input type="email" value={user?.email} disabled style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "#f8fafc", color: "#94a3b8", fontSize: "15px", fontWeight: 500, cursor: "not-allowed" }} />
                  </div>
                  <button type="submit" disabled={updating} className="shimmer-btn" style={{ width: "fit-content", padding: "14px 32px", borderRadius: "12px", border: "none", fontSize: "15px", fontWeight: 700, cursor: updating ? "not-allowed" : "pointer", opacity: updating ? 0.7 : 1 }}>
                    {updating ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                </form>
              </div>
            )}

            {activeTab === "bookings" && (
              <div>
                <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", marginBottom: "32px" }}>Lịch sử đặt chỗ</h2>
                
                {bookingsLoading ? (
                  <div style={{ textAlign: "center", padding: "40px" }}>Đang tải đơn hàng...</div>
                ) : bookings.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "80px 0" }}>
                    <ShoppingBag size={48} color="#cbd5e1" style={{ marginBottom: "16px" }} />
                    <p style={{ color: "#64748b", fontWeight: 500 }}>Bạn chưa có đơn đặt chỗ nào.</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {bookings.map((booking) => (
                      <div key={booking.id} style={{ border: "1px solid rgba(0,0,0,0.05)", borderRadius: "20px", overflow: "hidden", background: "#fff", transition: "all 0.2s" }}>
                        <div style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <span style={{ fontSize: "13px", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>Mã đơn: #{booking.shortId}</span>
                            <div style={{ padding: "4px 12px", borderRadius: "100px", fontSize: "12px", fontWeight: 800, background: booking.status === 'CONFIRMED' ? "#f0fdf4" : booking.status === 'PENDING' ? "#fffbeb" : "#fef2f2", color: booking.status === 'CONFIRMED' ? "#10b981" : booking.status === 'PENDING' ? "#f59e0b" : "#ef4444" }}>
                              {booking.status === 'CONFIRMED' ? "Thành công" : booking.status === 'PENDING' ? "Chờ thanh toán" : "Đã hủy"}
                            </div>
                          </div>
                          <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 500 }}>{new Date(booking.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                        
                        <div style={{ padding: "24px", display: "grid", gridTemplateColumns: "1fr auto", gap: "24px" }}>
                          <div style={{ display: "flex", gap: "20px" }}>
                            <div style={{ width: "100px", height: "100px", borderRadius: "16px", overflow: "hidden" }}>
                              <img src={booking.tour?.images?.[0] || booking.hotel?.images?.[0] || "https://images.unsplash.com/photo-1542322304-4b53bb8968f9?w=200&q=80"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                            <div>
                              <h4 style={{ fontSize: "17px", fontWeight: 800, color: "#0f172a", marginBottom: "12px" }}>{booking.tour?.name || booking.hotel?.name}</h4>
                              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#475569", fontWeight: 500 }}>
                                  <Calendar size={14} color="#0d9488" /> 
                                  {new Date(booking.checkIn).toLocaleDateString('vi-VN')} {booking.checkOut ? `- ${new Date(booking.checkOut).toLocaleDateString('vi-VN')}` : ''}
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#475569", fontWeight: 500 }}>
                                  <MapPin size={14} color="#0d9488" /> {booking.tour?.location || booking.hotel?.address}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div style={{ textAlign: "right", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                            <div>
                              <div style={{ fontSize: "13px", color: "#64748b", fontWeight: 600, marginBottom: "4px" }}>Tổng thanh toán</div>
                              <div style={{ fontSize: "20px", fontWeight: 800, color: "#0d9488" }}>₫{Number(booking.totalAmount).toLocaleString()}</div>
                            </div>
                            
                            <div style={{ display: "flex", gap: "12px" }}>
                              {booking.status === 'PENDING' && (
                                <>
                                  <button onClick={() => handleCancelBooking(booking.id)} style={{ padding: "8px 16px", borderRadius: "10px", border: "1px solid #ef4444", background: "transparent", color: "#ef4444", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>Hủy đơn</button>
                                  <button onClick={() => {
                                    sessionStorage.setItem('pendingBooking', JSON.stringify({
                                      type: booking.tourId ? 'tour' : 'hotel',
                                      tourId: booking.tourId,
                                      hotelId: booking.hotelId,
                                      checkIn: booking.checkIn,
                                      checkOut: booking.checkOut,
                                      totalAmount: booking.totalAmount,
                                      quantity: booking.bookingTours?.[0]?.quantity || booking.bookingRooms?.[0]?.quantity || 1,
                                      priceAtBooking: booking.bookingTours?.[0]?.priceAtBooking || booking.bookingRooms?.[0]?.priceAtBooking || 0,
                                      tourName: booking.tour?.name,
                                      hotelName: booking.hotel?.name,
                                      image: booking.tour?.images?.[0] || booking.hotel?.images?.[0]
                                    }));
                                    router.push("/checkout");
                                  }} style={{ padding: "8px 16px", borderRadius: "10px", border: "none", background: "#0d9488", color: "#fff", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>Thanh toán</button>
                                </>
                              )}
                              <Link href={booking.tourId ? `/tours/${booking.tourId}` : `/homestays/${booking.hotelId}`} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", fontWeight: 700, color: "#64748b", textDecoration: "none" }}>
                                Xem chi tiết <ChevronRight size={14} />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
