"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { homestays } from "@/data/mockData";
import { Search, MapPin, Bed, Bath, Users, Star, Heart, Calendar, Filter } from "lucide-react";

export default function HomestaysPage() {
  const router = useRouter();
  const [wishlist, setWishlist] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [guests, setGuests] = useState(0);
  
  // Date states
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  // Advanced Filter Modal states
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [priceRange, setPriceRange] = useState("all");
  const [minBedrooms, setMinBedrooms] = useState(0);

  const toggleWishlist = (id) => setWishlist(p => ({ ...p, [id]: !p[id] }));

  const parsePrice = (priceStr) => parseInt(priceStr.replace(/,/g, ''));

  const filteredHomestays = homestays.filter(h => {
    const matchSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) || h.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchGuests = guests === 0 || h.guests >= guests;
    const matchBedrooms = minBedrooms === 0 || h.beds >= minBedrooms;
    
    let matchPrice = true;
    const numPrice = parsePrice(h.price);
    if (priceRange === "under1m") matchPrice = numPrice < 1000000;
    else if (priceRange === "1m-3m") matchPrice = numPrice >= 1000000 && numPrice <= 3000000;
    else if (priceRange === "over3m") matchPrice = numPrice > 3000000;

    return matchSearch && matchGuests && matchBedrooms && matchPrice;
  });

  const glassCard = {
    background: "#ffffff",
    border: "1px solid rgba(0,0,0,0.05)",
    borderRadius: "24px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 0.3s"
  };

  return (
    <>
      <Navbar />
      
      {/* SPACING CHO TOP NAV */}
      <div style={{ height: "72px" }}></div>

      {/* TOP FILTER BAR */}
      <div style={{ position: "sticky", top: "72px", zIndex: 90, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(0,0,0,0.05)", padding: "20px 40px", boxShadow: "0 10px 30px rgba(0,0,0,0.02)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
          
          <div style={{ flex: 1, minWidth: "200px", display: "flex", alignItems: "center", gap: "12px", background: "#f8fafc", padding: "12px 20px", borderRadius: "16px", border: "1px solid rgba(0,0,0,0.05)" }}>
            <MapPin size={18} color="#64748b" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Tìm kiếm địa điểm..." style={{ background: "transparent", border: "none", outline: "none", fontSize: "15px", fontWeight: 600, color: "#0f172a", width: "100%" }} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#f8fafc", padding: "4px 20px", borderRadius: "16px", border: "1px solid rgba(0,0,0,0.05)" }}>
            <Calendar size={18} color="#64748b" />
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} style={{ background: "transparent", border: "none", outline: "none", fontSize: "15px", fontWeight: 600, color: "#0f172a", width: "120px", cursor: "pointer" }} />
              <span style={{ color: "#cbd5e1" }}>→</span>
              <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} style={{ background: "transparent", border: "none", outline: "none", fontSize: "15px", fontWeight: 600, color: "#0f172a", width: "120px", cursor: "pointer" }} />
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <select value={guests} onChange={(e) => setGuests(parseInt(e.target.value))} style={{ appearance: "none", display: "flex", alignItems: "center", gap: "12px", background: "#f8fafc", padding: "14px 40px 14px 44px", borderRadius: "16px", border: "1px solid rgba(0,0,0,0.05)", cursor: "pointer", fontSize: "15px", fontWeight: 600, color: "#0f172a", outline: "none" }}>
              <option value={0}>Mọi số khách</option>
              <option value={1}>1 khách</option>
              <option value={2}>2 khách</option>
              <option value={4}>4 khách</option>
              <option value={6}>6+ khách</option>
            </select>
            <div style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <Users size={18} color="#64748b" />
            </div>
          </div>

          <button style={{ background: "#0d9488", color: "#fff", border: "none", padding: "14px 24px", borderRadius: "16px", fontWeight: 700, fontSize: "15px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 4px 15px rgba(13,148,136,0.3)" }}>
            <Search size={18} /> Tìm
          </button>

          <button onClick={() => setShowFilterModal(true)} style={{ background: "#ffffff", color: "#0f172a", border: "1px solid rgba(0,0,0,0.1)", padding: "14px", borderRadius: "16px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s" }} onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"} onMouseLeave={e=>e.currentTarget.style.background="#ffffff"}>
            <Filter size={18} />
          </button>

        </div>
      </div>

      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 40px 80px" }}>
        
        {/* HOMESTAYS FULL-WIDTH GRID */}
        {filteredHomestays.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "32px" }}>
            {filteredHomestays.map((h, i) => (
              <div key={h.id} className="glass-hover" style={{ ...glassCard, display: "flex", flexDirection: "column" }} onClick={() => router.push(`/homestays/${h.id}`)}>
                <div style={{ position: "relative", height: "300px", overflow: "hidden" }}>
                  <img src={h.img} alt={h.name} className="card-img" />
                  <button className="wishlist-btn" onClick={(e) => { e.stopPropagation(); toggleWishlist(h.id); }} style={{ position: "absolute", top: "16px", right: "16px", width: "40px", height: "40px", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", border: "none", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", zIndex: 10 }}>
                    <Heart size={20} fill={wishlist[h.id] ? "#ef4444" : "transparent"} color={wishlist[h.id] ? "#ef4444" : "#64748b"} />
                  </button>
                </div>
                <div style={{ padding: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a" }}>{h.location}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>
                      <Star size={14} fill="#0f172a" color="#0f172a" /> {h.rating}
                    </div>
                  </div>
                  <div style={{ fontSize: "15px", color: "#64748b", marginBottom: "4px", fontWeight: 500 }}>{h.name}</div>
                  <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                    <span style={{ fontSize: "14px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}><Users size={14} /> {h.guests}</span>
                    <span style={{ fontSize: "14px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}><Bed size={14} /> {h.beds}</span>
                    <span style={{ fontSize: "14px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}><Bath size={14} /> {h.baths}</span>
                  </div>
                  <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                    <span style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>₫{h.price}</span>
                    <span style={{ fontSize: "14px", color: "#64748b", fontWeight: 500 }}> / {h.per}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 20px", background: "#ffffff", borderRadius: "24px", border: "1px solid rgba(0,0,0,0.05)" }}>
            <Search size={48} color="#cbd5e1" style={{ margin: "0 auto 16px" }} />
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}>Không tìm thấy homestay nào phù hợp</h3>
            <p style={{ color: "#64748b", fontSize: "14px", fontWeight: 500 }}>Thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh bộ lọc.</p>
            <button onClick={() => {setSearchQuery(""); setGuests(0); setPriceRange("all"); setMinBedrooms(0);}} style={{ marginTop: "20px", background: "#f8fafc", border: "1px solid rgba(0,0,0,0.1)", color: "#0f172a", padding: "10px 20px", borderRadius: "10px", cursor: "pointer", fontWeight: 600, fontSize: "14px" }}>
              Xóa tất cả bộ lọc
            </button>
          </div>
        )}

      </main>

      {/* FILTER MODAL */}
      {showFilterModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* Backdrop */}
          <div onClick={() => setShowFilterModal(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}></div>
          
          {/* Modal Content */}
          <div style={{ position: "relative", background: "#ffffff", width: "100%", maxWidth: "500px", borderRadius: "24px", padding: "32px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)", zIndex: 1001 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", paddingBottom: "16px", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
              <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", margin: 0 }}>Bộ lọc nâng cao</h2>
              <button onClick={() => setShowFilterModal(false)} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#64748b" }}>&times;</button>
            </div>

            {/* Price Range */}
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "16px" }}>Khoảng giá (1 đêm)</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", fontSize: "15px", color: "#475569", fontWeight: 500 }}>
                  <input type="radio" name="price" checked={priceRange === "all"} onChange={() => setPriceRange("all")} style={{ width: "auto", transform: "scale(1.2)", margin: 0 }} /> <span>Mọi mức giá</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", fontSize: "15px", color: "#475569", fontWeight: 500 }}>
                  <input type="radio" name="price" checked={priceRange === "under1m"} onChange={() => setPriceRange("under1m")} style={{ width: "auto", transform: "scale(1.2)", margin: 0 }} /> <span>Dưới 1,000,000 ₫</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", fontSize: "15px", color: "#475569", fontWeight: 500 }}>
                  <input type="radio" name="price" checked={priceRange === "1m-3m"} onChange={() => setPriceRange("1m-3m")} style={{ width: "auto", transform: "scale(1.2)", margin: 0 }} /> <span>1,000,000 ₫ - 3,000,000 ₫</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", fontSize: "15px", color: "#475569", fontWeight: 500 }}>
                  <input type="radio" name="price" checked={priceRange === "over3m"} onChange={() => setPriceRange("over3m")} style={{ width: "auto", transform: "scale(1.2)", margin: 0 }} /> <span>Trên 3,000,000 ₫</span>
                </label>
              </div>
            </div>

            {/* Bedrooms */}
            <div style={{ marginBottom: "40px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "16px" }}>Phòng ngủ</h3>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "15px", color: "#475569", fontWeight: 500 }}>Số lượng tối thiểu</span>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <button onClick={() => setMinBedrooms(Math.max(0, minBedrooms - 1))} style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid #cbd5e1", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#0f172a", fontSize: "18px" }}>-</button>
                  <span style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", width: "20px", textAlign: "center" }}>{minBedrooms === 0 ? "Bất kỳ" : minBedrooms}</span>
                  <button onClick={() => setMinBedrooms(minBedrooms + 1)} style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid #cbd5e1", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#0f172a", fontSize: "18px" }}>+</button>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "20px", borderTop: "1px solid rgba(0,0,0,0.05)" }}>
              <button onClick={() => {setPriceRange("all"); setMinBedrooms(0);}} style={{ background: "none", border: "none", fontSize: "15px", fontWeight: 600, color: "#0f172a", cursor: "pointer", textDecoration: "underline" }}>Xóa tất cả</button>
              <button className="shimmer-btn" onClick={() => setShowFilterModal(false)} style={{ padding: "12px 24px", borderRadius: "12px", border: "none", fontSize: "15px", fontWeight: 700, cursor: "pointer" }}>
                Hiển thị kết quả
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
