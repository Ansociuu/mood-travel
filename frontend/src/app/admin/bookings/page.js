"use client";
import { useState, useEffect } from "react";
import { 
  Search, Filter, CheckCircle, XCircle, 
  Eye, Calendar, Clock, User, 
  MapPin, Phone, Mail, MoreHorizontal
} from "lucide-react";
import { bookingsApi } from "@/lib/api";

const STATUS_MAP = {
  'PENDING': { label: 'Đang chờ', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  'CONFIRMED': { label: 'Đã xác nhận', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  'CANCELLED': { label: 'Đã hủy', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  'COMPLETED': { label: 'Hoàn thành', color: '#0d9488', bg: 'rgba(13,148,136,0.1)' },
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await bookingsApi.getOwnerBookings();
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    if (!confirm(`Bạn có chắc muốn chuyển trạng thái đơn hàng sang ${STATUS_MAP[newStatus].label}?`)) return;
    
    try {
      await bookingsApi.updateStatus(id, newStatus);
      setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking({ ...selectedBooking, status: newStatus });
      }
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.shortId.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.guestName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>Quản lý Đơn đặt chỗ</h1>
        <p style={{ color: "#64748b", fontWeight: 500 }}>Theo dõi và xử lý các yêu cầu đặt phòng/tour từ khách hàng.</p>
      </div>

      {/* FILTERS ... same as before ... */}
      <div style={{ background: "#fff", padding: "20px", borderRadius: "20px", border: "1px solid rgba(0,0,0,0.05)", marginBottom: "32px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "250px" }}>
          <Search size={18} color="#94a3b8" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} />
          <input 
            type="text" 
            placeholder="Tìm theo Mã đơn, Tên khách..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "12px 16px 12px 48px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none", fontSize: "14px" }}
          />
        </div>
        
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none", fontSize: "14px", background: "#fff", cursor: "pointer" }}
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="PENDING">Đang chờ</option>
          <option value="CONFIRMED">Đã xác nhận</option>
          <option value="CANCELLED">Đã hủy</option>
          <option value="COMPLETED">Hoàn thành</option>
        </select>
      </div>

      {/* TABLE */}
      <div style={{ background: "#fff", borderRadius: "24px", border: "1px solid rgba(0,0,0,0.05)", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead style={{ background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
            <tr>
              <th style={{ padding: "20px 24px", fontSize: "13px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Mã đơn / Khách hàng</th>
              <th style={{ padding: "20px 24px", fontSize: "13px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Sản phẩm</th>
              <th style={{ padding: "20px 24px", fontSize: "13px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Thời gian</th>
              <th style={{ padding: "20px 24px", fontSize: "13px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Tổng tiền</th>
              <th style={{ padding: "20px 24px", fontSize: "13px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Trạng thái</th>
              <th style={{ padding: "20px 24px", fontSize: "13px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", textAlign: "right" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1, 2, 3].map(i => (
                <tr key={i}><td colSpan="6" style={{ padding: "30px", textAlign: "center", color: "#94a3b8" }}>Đang tải...</td></tr>
              ))
            ) : filteredBookings.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: "60px", textAlign: "center", color: "#94a3b8" }}>Không tìm thấy đơn hàng nào.</td></tr>
            ) : filteredBookings.map((booking) => (
              <tr key={booking.id} style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.2s" }} className="table-row-hover">
                <td style={{ padding: "20px 24px" }}>
                  <div style={{ fontWeight: 800, color: "#0f172a", marginBottom: "4px" }}>#{booking.shortId}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#64748b" }}>
                    <User size={14} /> {booking.guestName}
                  </div>
                </td>
                <td style={{ padding: "20px 24px" }}>
                  <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "14px", marginBottom: "4px" }}>
                    {booking.hotel?.name || booking.tour?.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                    {booking.hotel ? 'Homestay' : 'Tour du lịch'}
                  </div>
                </td>
                <td style={{ padding: "20px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#0f172a", fontWeight: 600, marginBottom: "4px" }}>
                    <Calendar size={14} color="#0d9488" /> {new Date(booking.checkIn).toLocaleDateString('vi-VN')}
                  </div>
                  {booking.checkOut && (
                    <div style={{ fontSize: "12px", color: "#64748b" }}>
                      đến {new Date(booking.checkOut).toLocaleDateString('vi-VN')}
                    </div>
                  )}
                </td>
                <td style={{ padding: "20px 24px" }}>
                  <div style={{ fontWeight: 800, color: "#0d9488" }}>₫{Number(booking.totalAmount).toLocaleString()}</div>
                </td>
                <td style={{ padding: "20px 24px" }}>
                  <span style={{ 
                    padding: "6px 12px", 
                    borderRadius: "100px", 
                    fontSize: "12px", 
                    fontWeight: 700, 
                    color: STATUS_MAP[booking.status].color,
                    background: STATUS_MAP[booking.status].bg,
                    border: `1px solid ${STATUS_MAP[booking.status].color}20`
                  }}>
                    {STATUS_MAP[booking.status].label}
                  </span>
                </td>
                <td style={{ padding: "20px 24px", textAlign: "right" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                    {booking.status === 'PENDING' && (
                      <>
                        <button 
                          onClick={() => handleUpdateStatus(booking.id, 'CONFIRMED')}
                          style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#ecfdf5", border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981", cursor: "pointer" }}
                          title="Xác nhận"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(booking.id, 'CANCELLED')}
                          style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#fef2f2", border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444", cursor: "pointer" }}
                          title="Hủy đơn"
                        >
                          <XCircle size={18} />
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => setSelectedBooking(booking)}
                      style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#f8fafc", border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", cursor: "pointer" }}
                      title="Xem chi tiết"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DETAILS MODAL */}
      {selectedBooking && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "#fff", borderRadius: "28px", width: "100%", maxWidth: "700px", maxHeight: "90vh", overflowY: "auto", position: "relative", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
            <div style={{ padding: "32px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#64748b", marginBottom: "4px" }}>CHI TIẾT ĐƠN HÀNG</div>
                <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a" }}>#{selectedBooking.shortId}</h2>
              </div>
              <button onClick={() => setSelectedBooking(null)} style={{ border: "none", background: "#f1f5f9", width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>✕</button>
            </div>

            <div style={{ padding: "32px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginBottom: "40px" }}>
                <div>
                  <h4 style={{ fontSize: "14px", fontWeight: 800, color: "#94a3b8", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Thông tin khách</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <User size={16} color="#0d9488" />
                      <span style={{ fontSize: "15px", fontWeight: 700 }}>{selectedBooking.guestName}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <Mail size={16} color="#94a3b8" />
                      <span style={{ fontSize: "14px", color: "#475569" }}>{selectedBooking.guestEmail}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <Phone size={16} color="#94a3b8" />
                      <span style={{ fontSize: "14px", color: "#475569" }}>{selectedBooking.guestPhone || "N/A"}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: "14px", fontWeight: 800, color: "#94a3b8", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Thông tin dịch vụ</h4>
                  <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "8px" }}>{selectedBooking.hotel?.name || selectedBooking.tour?.name}</div>
                  <div style={{ fontSize: "14px", color: "#64748b", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Clock size={14} />
                    {selectedBooking.hotelId ? 
                      `${new Date(selectedBooking.checkIn).toLocaleDateString('vi-VN')} - ${new Date(selectedBooking.checkOut).toLocaleDateString('vi-VN')}` : 
                      new Date(selectedBooking.startDate).toLocaleDateString('vi-VN')
                    }
                  </div>
                </div>
              </div>

              {selectedBooking.specialRequest && (
                <div style={{ marginBottom: "40px", padding: "20px", borderRadius: "16px", background: "#fffbeb", border: "1px solid #fef3c7" }}>
                  <h4 style={{ fontSize: "13px", fontWeight: 800, color: "#d97706", marginBottom: "8px" }}>Yêu cầu đặc biệt:</h4>
                  <p style={{ fontSize: "14px", color: "#92400e", lineHeight: 1.6 }}>{selectedBooking.specialRequest}</p>
                </div>
              )}

              <div style={{ background: "#f8fafc", borderRadius: "20px", padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span style={{ color: "#64748b", fontWeight: 600 }}>Phương thức thanh toán:</span>
                  <span style={{ fontWeight: 700 }}>{selectedBooking.payments?.[0]?.method || 'Chưa xác định'}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span style={{ color: "#64748b", fontWeight: 600 }}>Trạng thái thanh toán:</span>
                  <span style={{ 
                    fontWeight: 700, 
                    color: selectedBooking.paymentStatus === 'PAID' ? "#10b981" : selectedBooking.paymentStatus === 'FAILED' ? "#ef4444" : "#f59e0b" 
                  }}>
                    {selectedBooking.paymentStatus === 'PAID' ? 'Đã thanh toán' : 
                     selectedBooking.paymentStatus === 'UNPAID' ? 'Chưa thanh toán' : 
                     selectedBooking.paymentStatus === 'FAILED' ? 'Thất bại' : selectedBooking.paymentStatus}
                  </span>
                </div>
                <hr style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: "20px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>Tổng cộng:</span>
                  <span style={{ fontSize: "24px", fontWeight: 900, color: "#0d9488" }}>₫{Number(selectedBooking.totalAmount).toLocaleString()}</span>
                </div>
              </div>

              <div style={{ marginTop: "40px", display: "flex", gap: "12px" }}>
                {selectedBooking.status === 'PENDING' && (
                  <button 
                    onClick={() => handleUpdateStatus(selectedBooking.id, 'CONFIRMED')}
                    style={{ flex: 1, padding: "16px", borderRadius: "14px", background: "#0d9488", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer" }}
                  >
                    Xác nhận đơn hàng
                  </button>
                )}
                <button 
                  onClick={() => window.print()}
                  style={{ flex: 1, padding: "16px", borderRadius: "14px", background: "#fff", color: "#475569", fontWeight: 700, border: "1px solid #e2e8f0", cursor: "pointer" }}
                >
                  In hóa đơn
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .table-row-hover:hover { background: #f8fafc; }
      `}</style>
    </div>
  );
}
