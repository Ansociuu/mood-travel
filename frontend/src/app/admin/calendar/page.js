"use client";
import { useState, useEffect } from "react";
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  MapPin, User, Clock, Info
} from "lucide-react";
import { bookingsApi } from "@/lib/api";

export default function AdminCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isSameDay = (d1, d2) => {
    return d1.getDate() === d2.getDate() && 
           d1.getMonth() === d2.getMonth() && 
           d1.getFullYear() === d2.getFullYear();
  };

  const isBetween = (date, start, end) => {
    const d = new Date(date).setHours(0,0,0,0);
    const s = new Date(start).setHours(0,0,0,0);
    const e = new Date(end).setHours(0,0,0,0);
    return d >= s && d <= e;
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  // Padding for first day of month
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }

  const monthNames = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
  ];

  return (
    <div>
      <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>Lịch Quản lý Đặt chỗ</h1>
          <p style={{ color: "#64748b", fontWeight: 500 }}>Theo dõi lịch trình đón khách và tình trạng phòng trống trực quan.</p>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", background: "#fff", padding: "8px", borderRadius: "12px", border: "1px solid #e2e8f0", gap: "16px" }}>
            <button onClick={prevMonth} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}><ChevronLeft size={20}/></button>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a", minWidth: "120px", textAlign: "center" }}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </div>
            <button onClick={nextMonth} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}><ChevronRight size={20}/></button>
          </div>
          <button onClick={() => setCurrentDate(new Date())} style={{ padding: "10px 16px", borderRadius: "12px", background: "#f1f5f9", border: "none", color: "#0f172a", fontWeight: 700, cursor: "pointer" }}>Hôm nay</button>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: "24px", border: "1px solid rgba(0,0,0,0.05)", overflow: "hidden", boxShadow: "0 10px 25px rgba(0,0,0,0.02)" }}>
        {/* WEEKDAYS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
          {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map(d => (
            <div key={d} style={{ padding: "16px", textAlign: "center", fontSize: "12px", fontWeight: 800, color: "#94a3b8" }}>{d}</div>
          ))}
        </div>

        {/* CALENDAR GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gridAutoRows: "minmax(140px, auto)" }}>
          {days.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} style={{ background: "#fdfdfd", border: "0.5px solid #f1f5f9" }} />;
            
            const dayBookings = bookings.filter(b => {
              if (b.hotelId) return isBetween(day, b.checkIn, b.checkOut);
              if (b.tourId) return isSameDay(day, new Date(b.checkIn));
              return false;
            });

            const isToday = isSameDay(day, new Date());

            return (
              <div key={idx} style={{ 
                background: isToday ? "#fff" : "#fff", 
                border: "0.5px solid #f1f5f9", 
                padding: "12px",
                position: "relative"
              }}>
                <div style={{ 
                  fontSize: "14px", 
                  fontWeight: 800, 
                  color: isToday ? "#0d9488" : "#475569",
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}>
                  <span style={{ 
                    width: isToday ? "28px" : "auto", 
                    height: isToday ? "28px" : "auto", 
                    borderRadius: "50%", 
                    background: isToday ? "#0d9488" : "transparent",
                    color: isToday ? "#fff" : "inherit",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>{day.getDate()}</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {dayBookings.slice(0, 3).map((b, bIdx) => (
                    <div 
                      key={bIdx}
                      onClick={() => setSelectedBooking(b)}
                      style={{ 
                        fontSize: "10px", 
                        padding: "4px 8px", 
                        borderRadius: "6px", 
                        background: b.hotelId ? "rgba(13,148,136,0.1)" : "rgba(139,92,246,0.1)", 
                        color: b.hotelId ? "#0d9488" : "#7c3aed",
                        borderLeft: `3px solid ${b.hotelId ? "#0d9488" : "#7c3aed"}`,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        cursor: "pointer",
                        fontWeight: 700
                      }}
                    >
                      {b.hotelId ? "🏨" : "🏃"} {b.hotel?.name || b.tour?.name}
                    </div>
                  ))}
                  {dayBookings.length > 3 && (
                    <div style={{ fontSize: "10px", color: "#94a3b8", fontWeight: 700, paddingLeft: "4px" }}>
                      + {dayBookings.length - 3} đơn khác
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BOOKING DETAIL MODAL */}
      {selectedBooking && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "#fff", borderRadius: "24px", width: "100%", maxWidth: "500px", padding: "32px", position: "relative" }}>
            <button onClick={() => setSelectedBooking(null)} style={{ position: "absolute", right: "24px", top: "24px", border: "none", background: "#f1f5f9", width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer" }}>✕</button>
            
            <div style={{ marginBottom: "24px" }}>
              <div style={{ 
                display: "inline-block", padding: "4px 12px", borderRadius: "100px", fontSize: "11px", fontWeight: 800, marginBottom: "12px",
                background: selectedBooking.status === 'COMPLETED' ? "#f0fdf4" : selectedBooking.status === 'CANCELLED' ? "#fef2f2" : "#fffbeb",
                color: selectedBooking.status === 'COMPLETED' ? "#10b981" : selectedBooking.status === 'CANCELLED' ? "#ef4444" : "#f59e0b"
              }}>
                {selectedBooking.status === 'COMPLETED' ? 'HOÀN TẤT' : selectedBooking.status === 'CANCELLED' ? 'ĐÃ HỦY' : 'ĐÃ XÁC NHẬN'}
              </div>
              <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a" }}>{selectedBooking.hotel?.name || selectedBooking.tour?.name}</h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}><User size={18}/></div>
                <div>
                  <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600 }}>Khách hàng</div>
                  <div style={{ fontSize: "14px", fontWeight: 700 }}>{selectedBooking.user.name} ({selectedBooking.user.email})</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}><Clock size={18}/></div>
                <div>
                  <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600 }}>Thời gian</div>
                  <div style={{ fontSize: "14px", fontWeight: 700 }}>
                    {selectedBooking.hotelId ? 
                      `${new Date(selectedBooking.checkIn).toLocaleDateString('vi-VN')} - ${new Date(selectedBooking.checkOut).toLocaleDateString('vi-VN')}` : 
                      new Date(selectedBooking.checkIn).toLocaleDateString('vi-VN')
                    }
                  </div>
                </div>
              </div>

              <div style={{ padding: "20px", borderRadius: "16px", background: "#f8fafc", marginTop: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "14px", color: "#64748b", fontWeight: 600 }}>Tổng tiền:</span>
                  <span style={{ fontSize: "16px", fontWeight: 800, color: "#0d9488" }}>₫{Number(selectedBooking.totalAmount).toLocaleString()}</span>
                </div>
                <div style={{ fontSize: "12px", color: "#94a3b8" }}>Mã đơn hàng: {selectedBooking.shortId}</div>
              </div>
            </div>

            <div style={{ marginTop: "32px", display: "flex", gap: "12px" }}>
              <button style={{ flex: 1, padding: "12px", borderRadius: "12px", background: "#0d9488", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer" }}>Liên hệ khách hàng</button>
              <button onClick={() => setSelectedBooking(null)} style={{ flex: 1, padding: "12px", borderRadius: "12px", background: "#f1f5f9", color: "#475569", fontWeight: 700, border: "none", cursor: "pointer" }}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
