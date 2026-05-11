"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, Search, Filter, MoreVertical, 
  Edit, Trash2, Eye, MapPin, Star
} from "lucide-react";
import { hotelsApi } from "@/lib/api";

export default function AdminHotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const data = await hotelsApi.getMyHotels();
      setHotels(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa cơ sở này?")) {
      try {
        await hotelsApi.remove(id);
        setHotels(hotels.filter(h => h.id !== id));
      } catch (err) {
        alert("Lỗi: " + err.message);
      }
    }
  };

  const filteredHotels = hotels.filter(h => 
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>Quản lý Homestays</h1>
          <p style={{ color: "#64748b", fontWeight: 500 }}>Danh sách các cơ sở lưu trú bạn đang sở hữu và quản lý.</p>
        </div>
        <Link 
          href="/admin/hotels/new" 
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
          <Plus size={20} /> Thêm cơ sở mới
        </Link>
      </div>

      {/* FILTERS */}
      <div style={{ background: "#fff", padding: "20px", borderRadius: "20px", border: "1px solid rgba(0,0,0,0.05)", marginBottom: "32px", display: "flex", gap: "16px" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={18} color="#94a3b8" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} />
          <input 
            type="text" 
            placeholder="Tìm kiếm tên, địa điểm..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "12px 16px 12px 48px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none", fontSize: "14px" }}
          />
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 20px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "#fff", color: "#0f172a", fontWeight: 600, cursor: "pointer" }}>
          <Filter size={18} /> Bộ lọc
        </button>
      </div>

      {/* HOTEL LIST */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "24px" }}>
        {loading ? (
          [1, 2, 3].map(i => <div key={i} style={{ height: "300px", borderRadius: "24px", background: "#eee", animation: "pulse 1.5s infinite" }} />)
        ) : filteredHotels.length === 0 ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "80px", background: "#fff", borderRadius: "24px", border: "1px dashed #cbd5e1" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏠</div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a" }}>Chưa có cơ sở nào</h3>
            <p style={{ color: "#64748b", marginBottom: "24px" }}>Hãy bắt đầu bằng cách thêm cơ sở lưu trú đầu tiên của bạn.</p>
            <Link href="/admin/hotels/new" style={{ color: "#0d9488", fontWeight: 700, textDecoration: "none" }}>Thêm ngay &rarr;</Link>
          </div>
        ) : filteredHotels.map((hotel) => (
          <div key={hotel.id} style={{ background: "#fff", borderRadius: "24px", border: "1px solid rgba(0,0,0,0.05)", overflow: "hidden", transition: "transform 0.2s", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
            <div style={{ position: "relative", height: "200px" }}>
              <img 
                src={hotel.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80"} 
                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
              />
              <div style={{ position: "absolute", top: "12px", right: "12px", display: "flex", gap: "8px" }}>
                <Link href={`/admin/hotels/${hotel.id}`} style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#0f172a", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} title="Chỉnh sửa">
                  <Edit size={16} />
                </Link>
                <button 
                  onClick={() => handleDelete(hotel.id)}
                  style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#fff", border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  title="Xóa"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div style={{ position: "absolute", bottom: "12px", left: "12px", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", padding: "4px 12px", borderRadius: "100px", color: "#fff", fontSize: "12px", fontWeight: 700 }}>
                {hotel.type}
              </div>
            </div>
            <div style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>{hotel.name}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#f59e0b", fontWeight: 700 }}>
                  <Star size={16} fill="#f59e0b" /> {hotel.rating}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>
                <MapPin size={14} /> {hotel.city}, {hotel.country}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "16px" }}>
                <div style={{ fontSize: "13px", color: "#64748b", fontWeight: 600 }}>{hotel.rooms?.length || 0} Loại phòng</div>
                <Link href={`/homestays/${hotel.id}`} target="_blank" style={{ display: "flex", alignItems: "center", gap: "4px", color: "#0d9488", fontWeight: 700, fontSize: "14px", textDecoration: "none" }}>
                  Xem trang web <Eye size={14} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 0.8; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
