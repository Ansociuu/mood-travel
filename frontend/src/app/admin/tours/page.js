"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, Search, Filter, 
  Edit, Trash2, Eye, MapPin, Star,
  Clock, Calendar
} from "lucide-react";
import { toursApi } from "@/lib/api";

export default function AdminToursPage() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const data = await toursApi.getMyTours();
      setTours(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa tour này?")) {
      try {
        await toursApi.remove(id);
        setTours(tours.filter(t => t.id !== id));
      } catch (err) {
        alert("Lỗi: " + err.message);
      }
    }
  };

  const filteredTours = tours.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>Quản lý Tours</h1>
          <p style={{ color: "#64748b", fontWeight: 500 }}>Danh sách các tour du lịch bạn đang sở hữu và quản lý.</p>
        </div>
        <Link 
          href="/admin/tours/new" 
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "8px", 
            padding: "12px 24px", 
            borderRadius: "12px", 
            background: "#0d9488", 
            color: "#fff", 
            fontWeight: 700, 
            textDecoration: "none",
            boxShadow: "0 4px 12px rgba(13,148,136,0.2)"
          }}
        >
          <Plus size={20} /> Thêm tour mới
        </Link>
      </div>

      {/* FILTERS */}
      <div style={{ background: "#fff", padding: "20px", borderRadius: "20px", border: "1px solid rgba(0,0,0,0.05)", marginBottom: "32px", display: "flex", gap: "16px" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={18} color="#94a3b8" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} />
          <input 
            type="text" 
            placeholder="Tìm kiếm tên tour, địa điểm..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "12px 16px 12px 48px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none", fontSize: "14px" }}
          />
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 20px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "#fff", color: "#0f172a", fontWeight: 600, cursor: "pointer" }}>
          <Filter size={18} /> Bộ lọc
        </button>
      </div>

      {/* TOUR LIST */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "24px" }}>
        {loading ? (
          [1, 2, 3].map(i => <div key={i} style={{ height: "300px", borderRadius: "24px", background: "#eee", animation: "pulse 1.5s infinite" }} />)
        ) : filteredTours.length === 0 ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "80px", background: "#fff", borderRadius: "24px", border: "1px dashed #cbd5e1" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏔️</div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a" }}>Chưa có tour nào</h3>
            <p style={{ color: "#64748b", marginBottom: "24px" }}>Hãy bắt đầu bằng cách thêm tour du lịch đầu tiên của bạn.</p>
            <Link href="/admin/tours/new" style={{ color: "#0d9488", fontWeight: 700, textDecoration: "none" }}>Thêm ngay &rarr;</Link>
          </div>
        ) : filteredTours.map((tour) => (
          <div key={tour.id} style={{ background: "#fff", borderRadius: "24px", border: "1px solid rgba(0,0,0,0.05)", overflow: "hidden", transition: "transform 0.2s", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
            <div style={{ position: "relative", height: "200px" }}>
              <img 
                src={tour.images?.[0] || "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=500&q=80"} 
                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
              />
              <div style={{ position: "absolute", top: "12px", right: "12px", display: "flex", gap: "8px" }}>
                <Link href={`/admin/tours/${tour.id}`} style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#0f172a", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} title="Chỉnh sửa">
                  <Edit size={16} />
                </Link>
                <button 
                  onClick={() => handleDelete(tour.id)}
                  style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#fff", border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  title="Xóa"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>{tour.name}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#f59e0b", fontWeight: 700 }}>
                  <Star size={16} fill="#f59e0b" /> {tour.rating}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748b", fontSize: "14px", marginBottom: "16px" }}>
                <MapPin size={14} /> {tour.location}
              </div>
              
              <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#0d9488", fontSize: "13px", fontWeight: 700, padding: "6px 12px", background: "rgba(13,148,136,0.1)", borderRadius: "8px" }}>
                  <Clock size={14} /> {tour.durationDays} ngày {tour.durationNights} đêm
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#f59e0b", fontSize: "13px", fontWeight: 700, padding: "6px 12px", background: "rgba(245,158,11,0.1)", borderRadius: "8px" }}>
                  <Calendar size={14} /> {tour.availability?.length || 0} Ngày khởi hành
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "16px" }}>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "#0d9488" }}>₫{Number(tour.basePrice).toLocaleString()}</div>
                <Link href={`/tours/${tour.id}`} target="_blank" style={{ display: "flex", alignItems: "center", gap: "4px", color: "#64748b", fontWeight: 700, fontSize: "14px", textDecoration: "none" }}>
                  Xem trang web <Eye size={14} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
