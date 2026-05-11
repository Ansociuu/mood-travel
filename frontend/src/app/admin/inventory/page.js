"use client";
import { useState, useEffect } from "react";
import { 
  ShoppingBag, Building2, Calendar, 
  DollarSign, CheckCircle2, AlertCircle,
  Save, Filter, ChevronRight
} from "lucide-react";
import { hotelsApi, toursApi } from "@/lib/api";

export default function AdminInventoryPage() {
  const [products, setProducts] = useState({ hotels: [], tours: [] });
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null); // { id, type, name, rooms }
  const [selectedRoomId, setSelectedRoomId] = useState("ALL");
  const [activeTab, setActiveTab] = useState("HOTEL");

  const [bulkData, setBulkData] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
    price: "",
    status: "OPEN" // OPEN, CLOSED
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const [hotels, tours] = await Promise.all([
        hotelsApi.getMyHotels(),
        toursApi.getMyTours()
      ]);
      setProducts({ hotels, tours });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpdate = async (e) => {
    e.preventDefault();
    if (!selectedProduct) {
      alert("Vui lòng chọn sản phẩm cần cập nhật!");
      return;
    }
    
    setLoading(true);
    try {
      if (activeTab === "HOTEL") {
        await hotelsApi.updateInventory(selectedProduct.id, {
          ...bulkData,
          roomId: selectedRoomId
        });
      } else {
        // Handle Tours similarly if needed
        alert("Tính năng cập nhật hàng loạt cho Tour đang được phát triển.");
        setLoading(false);
        return;
      }

      alert(`Đã cập nhật thành công cho ${selectedProduct.name}`);
      fetchProducts(); // Refresh data
      setBulkData({ ...bulkData, price: "" }); // Reset price field
    } catch (err) {
      alert("Lỗi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>Quản lý Kho & Giá</h1>
        <p style={{ color: "#64748b", fontWeight: 500 }}>Thiết lập giá linh hoạt và đóng/mở bán sản phẩm theo thời điểm.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "32px" }}>
        {/* PRODUCT LIST */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ background: "#fff", padding: "24px", borderRadius: "24px", border: "1px solid rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
              <button 
                onClick={() => setActiveTab("HOTEL")}
                style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none", background: activeTab === "HOTEL" ? "#0d9488" : "#f1f5f9", color: activeTab === "HOTEL" ? "#fff" : "#64748b", fontWeight: 700, cursor: "pointer" }}
              >
                Homestays
              </button>
              <button 
                onClick={() => setActiveTab("TOUR")}
                style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none", background: activeTab === "TOUR" ? "#0d9488" : "#f1f5f9", color: activeTab === "TOUR" ? "#fff" : "#64748b", fontWeight: 700, cursor: "pointer" }}
              >
                Tours
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {(activeTab === "HOTEL" ? products.hotels : products.tours).map(p => (
                <div 
                  key={p.id}
                  onClick={() => {
                    setSelectedProduct(p);
                    setSelectedRoomId("ALL");
                  }}
                  style={{ 
                    padding: "16px", borderRadius: "16px", border: "1px solid", 
                    borderColor: selectedProduct?.id === p.id ? "#0d9488" : "#f1f5f9",
                    background: selectedProduct?.id === p.id ? "rgba(13,148,136,0.02)" : "#fff",
                    cursor: "pointer", transition: "all 0.2s"
                  }}
                >
                  <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: "4px" }}>{p.name}</div>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>
                    {activeTab === "HOTEL" 
                      ? `${p.city || ''}${p.city && p.country ? ', ' : ''}${p.country || ''}`
                      : p.location || ''}
                  </div>
                </div>
              ))}
              {((activeTab === "HOTEL" ? products.hotels : products.tours).length === 0) && (
                <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8", fontSize: "14px" }}>Chưa có sản phẩm nào.</div>
              )}
            </div>
          </div>
        </div>

        {/* BULK UPDATE FORM */}
        <div style={{ background: "#fff", padding: "40px", borderRadius: "24px", border: "1px solid rgba(0,0,0,0.05)", position: "sticky", top: "100px", height: "fit-content" }}>
          {!selectedProduct ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "20px", background: "#f8fafc", color: "#cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                <ShoppingBag size={32} />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>Chọn sản phẩm để bắt đầu</h3>
              <p style={{ color: "#94a3b8", maxWidth: "240px", margin: "0 auto" }}>Vui lòng chọn một Homestay hoặc Tour từ danh sách bên trái để thiết lập giá và kho.</p>
            </div>
          ) : (
            <form onSubmit={handleBulkUpdate}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(13,148,136,0.1)", color: "#0d9488", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {activeTab === "HOTEL" ? <Building2 size={20}/> : <ChevronRight size={20}/>}
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>ĐANG CẤU HÌNH</div>
                  <div style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>{selectedProduct.name}</div>
                </div>
              </div>

              {activeTab === "HOTEL" && (
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Chọn loại phòng</label>
                  <select 
                    value={selectedRoomId}
                    onChange={(e) => setSelectedRoomId(e.target.value)}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none", background: "#fff", cursor: "pointer" }}
                  >
                    <option value="ALL">Tất cả loại phòng</option>
                    {selectedProduct.rooms?.map((room, index) => (
                      <option key={room.id || index} value={room.id}>{room.name} (Hiện tại: ₫{Number(room.basePrice).toLocaleString()})</option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Từ ngày</label>
                  <input 
                    type="date" 
                    value={bulkData.startDate}
                    onChange={(e) => setBulkData({...bulkData, startDate: e.target.value})}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Đến ngày</label>
                  <input 
                    type="date" 
                    value={bulkData.endDate}
                    onChange={(e) => setBulkData({...bulkData, endDate: e.target.value})}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Giá mới (VNĐ)</label>
                <div style={{ position: "relative" }}>
                  <DollarSign size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                  <input 
                    type="number" 
                    placeholder="Để trống nếu không muốn đổi giá"
                    value={bulkData.price}
                    onChange={(e) => setBulkData({...bulkData, price: e.target.value})}
                    style={{ width: "100%", padding: "12px 16px 12px 48px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none" }}
                  />
                </div>
                <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "8px" }}>Mẹo: Giá sẽ được áp dụng cho tất cả các ngày trong khoảng thời gian đã chọn.</p>
              </div>

              <div style={{ marginBottom: "32px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Trạng thái bán</label>
                <div style={{ display: "flex", gap: "12px" }}>
                  <div 
                    onClick={() => setBulkData({...bulkData, status: "OPEN"})}
                    style={{ 
                      flex: 1, padding: "16px", borderRadius: "16px", border: "1px solid", 
                      borderColor: bulkData.status === "OPEN" ? "#10b981" : "#f1f5f9",
                      background: bulkData.status === "OPEN" ? "#f0fdf4" : "#fff",
                      cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", transition: "all 0.2s"
                    }}
                  >
                    <CheckCircle2 size={18} color={bulkData.status === "OPEN" ? "#10b981" : "#cbd5e1"} />
                    <span style={{ fontSize: "14px", fontWeight: 700, color: bulkData.status === "OPEN" ? "#065f46" : "#64748b" }}>Mở bán</span>
                  </div>
                  <div 
                    onClick={() => setBulkData({...bulkData, status: "CLOSED"})}
                    style={{ 
                      flex: 1, padding: "16px", borderRadius: "16px", border: "1px solid", 
                      borderColor: bulkData.status === "CLOSED" ? "#ef4444" : "#f1f5f9",
                      background: bulkData.status === "CLOSED" ? "#fef2f2" : "#fff",
                      cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", transition: "all 0.2s"
                    }}
                  >
                    <AlertCircle size={18} color={bulkData.status === "CLOSED" ? "#ef4444" : "#cbd5e1"} />
                    <span style={{ fontSize: "14px", fontWeight: 700, color: bulkData.status === "CLOSED" ? "#991b1b" : "#64748b" }}>Đóng bán</span>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                style={{ width: "100%", padding: "16px", borderRadius: "16px", background: "#0f172a", color: "#fff", fontWeight: 800, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", boxShadow: "0 10px 20px rgba(15,23,42,0.1)" }}
              >
                <Save size={20} /> Cập nhật thay đổi
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
