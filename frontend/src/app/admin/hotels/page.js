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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);
  const paginatedHotels = filteredHotels.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
            display: "flex", alignItems: "center", gap: "8px", padding: "12px 24px", borderRadius: "12px", 
            background: "#0d9488", color: "#fff", fontWeight: 700, textDecoration: "none",
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
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            style={{ width: "100%", padding: "12px 16px 12px 48px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none", fontSize: "14px" }}
          />
        </div>
      </div>

      {/* HOTEL TABLE */}
      <div style={{ background: "#fff", borderRadius: "24px", border: "1px solid rgba(0,0,0,0.05)", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead style={{ background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
            <tr>
              <th style={{ padding: "20px 24px", fontSize: "13px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Homestay / Địa điểm</th>
              <th style={{ padding: "20px 24px", fontSize: "13px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Loại hình</th>
              <th style={{ padding: "20px 24px", fontSize: "13px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Số phòng</th>
              <th style={{ padding: "20px 24px", fontSize: "13px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Giá từ</th>
              <th style={{ padding: "20px 24px", fontSize: "13px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Đánh giá</th>
              <th style={{ padding: "20px 24px", fontSize: "13px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", textAlign: "right" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1, 2, 3].map(i => <tr key={i}><td colSpan="6" style={{ padding: "30px", textAlign: "center", color: "#94a3b8" }}>Đang tải...</td></tr>)
            ) : paginatedHotels.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: "60px", textAlign: "center", color: "#94a3b8" }}>Không tìm thấy cơ sở nào.</td></tr>
            ) : paginatedHotels.map((hotel) => (
              <tr key={hotel.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "20px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <img 
                      src={hotel.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100"} 
                      onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100"; }}
                      style={{ width: "48px", height: "48px", borderRadius: "12px", objectFit: "cover" }} 
                    />
                    <div>
                      <div style={{ fontWeight: 800, color: "#0f172a", marginBottom: "4px" }}>{hotel.name}</div>
                      <div style={{ fontSize: "13px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                        <MapPin size={12} /> {hotel.city}, {hotel.country}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "20px 24px" }}>
                  <span style={{ padding: "4px 12px", borderRadius: "100px", background: "#f1f5f9", fontSize: "12px", fontWeight: 700, color: "#475569" }}>
                    {hotel.type}
                  </span>
                </td>
                <td style={{ padding: "20px 24px" }}>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>
                    {hotel.rooms?.reduce((acc, room) => acc + (room.totalRooms || 0), 0) || 0} Phòng
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>({hotel.rooms?.length || 0} Loại)</div>
                </td>
                <td style={{ padding: "20px 24px" }}>
                  <div style={{ fontWeight: 800, color: "#0d9488" }}>
                    {(() => {
                      const prices = hotel.rooms?.filter(r => r.basePrice && !isNaN(Number(r.basePrice))).map(r => Number(r.basePrice)) || [];
                      return prices.length > 0 ? `₫${Math.min(...prices).toLocaleString()}` : "Chưa có giá";
                    })()}
                  </div>
                </td>
                <td style={{ padding: "20px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#f59e0b", fontWeight: 700, fontSize: "14px" }}>
                    <Star size={14} fill="#f59e0b" /> {hotel.rating}
                  </div>
                </td>
                <td style={{ padding: "20px 24px", textAlign: "right" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                    <Link href={`/homestays/${hotel.id}`} target="_blank" style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#f0fdf4", border: "1px solid #dcfce7", display: "flex", alignItems: "center", justifyContent: "center", color: "#0d9488" }} title="Xem trang web">
                      <Eye size={16} />
                    </Link>
                    <Link href={`/admin/hotels/${hotel.id}`} style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }} title="Chỉnh sửa">
                      <Edit size={16} />
                    </Link>
                    <button 
                      onClick={() => handleDelete(hotel.id)}
                      style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#fef2f2", border: "1px solid #fee2e2", display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444", cursor: "pointer" }}
                      title="Xóa"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div style={{ padding: "20px 24px", background: "#f8fafc", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "14px", color: "#64748b", fontWeight: 500 }}>
              Hiển thị {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredHotels.length)} trong số {filteredHotels.length} cơ sở
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#fff", cursor: currentPage === 1 ? "not-allowed" : "pointer", opacity: currentPage === 1 ? 0.5 : 1, fontWeight: 600, fontSize: "14px" }}
              >
                Trước
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  style={{ 
                    width: "36px", height: "36px", borderRadius: "8px", border: "1px solid", 
                    borderColor: currentPage === i + 1 ? "#0d9488" : "#e2e8f0",
                    background: currentPage === i + 1 ? "#0d9488" : "#fff",
                    color: currentPage === i + 1 ? "#fff" : "#64748b",
                    fontWeight: 700, cursor: "pointer"
                  }}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#fff", cursor: currentPage === totalPages ? "not-allowed" : "pointer", opacity: currentPage === totalPages ? 0.5 : 1, fontWeight: 600, fontSize: "14px" }}
              >
                Sau
              </button>
            </div>
          </div>
        )}
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
