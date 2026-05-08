"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StarRating from "@/components/StarRating";
import { allDestinations } from "@/data/mockData";
import { MapPin, Heart, Moon, Search, Filter, SlidersHorizontal, ArrowDownAZ } from "lucide-react";

export default function ToursPage() {
  const router = useRouter();
  const [regionFilters, setRegionFilters] = useState([]);
  const [maxPrice, setMaxPrice] = useState(10000000);
  const [durationFilters, setDurationFilters] = useState([]);
  const [sortBy, setSortBy] = useState("default");
  const [wishlist, setWishlist] = useState({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter & Sort Logic
  const getParsedPrice = (priceStr) => parseInt(priceStr.replace(/,/g, ""));

  const filteredTours = allDestinations.filter((tour) => {
    // Region
    if (regionFilters.length > 0 && !regionFilters.includes(tour.region)) return false;

    // Price
    const price = getParsedPrice(tour.price);
    if (price > maxPrice) return false;

    // Duration
    if (durationFilters.length > 0) {
      let match = false;
      if (durationFilters.includes("short") && tour.nights <= 2) match = true;
      if (durationFilters.includes("medium") && (tour.nights === 3 || tour.nights === 4)) match = true;
      if (durationFilters.includes("long") && tour.nights > 4) match = true;
      if (!match) return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === "price_asc") return getParsedPrice(a.price) - getParsedPrice(b.price);
    if (sortBy === "price_desc") return getParsedPrice(b.price) - getParsedPrice(a.price);
    if (sortBy === "rating_desc") return b.rating - a.rating;
    return 0; // default
  });

  const toggleWishlist = (id) => setWishlist(p => ({ ...p, [id]: !p[id] }));

  const glassCard = {
    background: "#ffffff",
    border: "1px solid rgba(0,0,0,0.05)",
    borderRadius: "24px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 0.3s"
  };

  const tagColor = { Bestseller: "#0d9488", Hot: "#d97706", New: "#059669", Luxury: "#b45309" };

  const handleRegionChange = (val) => {
    setRegionFilters(p => p.includes(val) ? p.filter(x => x !== val) : [...p, val]);
  };

  const handleDurationChange = (val) => {
    setDurationFilters(p => p.includes(val) ? p.filter(x => x !== val) : [...p, val]);
  };

  return (
    <>
      <Navbar />

      {/* MINI BANNER HEADER */}
      <div style={{ position: "relative", height: "360px", width: "100%", overflow: "hidden" }}>
        <img src="https://i1.sndcdn.com/artworks-uweNAO1M9CzebZgc-0HRR1Q-t500x500.jpg" alt="Banner" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", width: "100%", padding: "0 20px" }}>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "48px", fontWeight: 800, color: "#fff", letterSpacing: "-1px", marginBottom: "16px", textShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
            Khám phá Hành trình
          </h1>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.9)", fontWeight: 500, marginBottom: "32px" }}>
            Tìm kiếm trong hơn 500+ điểm đến tuyệt vời nhất trên thế giới
          </p>
          <div style={{ maxWidth: "600px", margin: "0 auto", position: "relative" }}>
            <div style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }}>
              <Search size={20} />
            </div>
            <input type="text" placeholder="Bạn muốn đi đâu?" style={{ width: "100%", padding: "20px 20px 20px 56px", borderRadius: "16px", border: "none", fontSize: "16px", fontWeight: 500, outline: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }} />
            <button className="shimmer-btn" style={{ position: "absolute", right: "8px", top: "8px", bottom: "8px", border: "none", borderRadius: "12px", padding: "0 24px", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}>
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 20px 80px" }}>
        {/* Mobile Filter Toggle */}
        <div className="mobile-filter-btn" style={{ display: "none", marginBottom: "20px" }}>
          <button onClick={() => setShowMobileFilters(!showMobileFilters)} style={{ width: "100%", padding: "14px", background: "#f8fafc", border: "1px solid rgba(0,0,0,0.05)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontWeight: 700, fontSize: "15px", color: "#0f172a" }}>
            <SlidersHorizontal size={18} /> Bộ lọc tìm kiếm
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: "40px", alignItems: "start" }} className="tours-layout-grid">

          {/* LEFT SIDEBAR: FILTERS */}
          <aside className={`filters-sidebar ${showMobileFilters ? "show" : ""}`} style={{ display: "flex", flexDirection: "column", gap: "32px", position: "sticky", top: "100px", height: "max-content" }}>
            <div style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.05)", borderRadius: "20px", padding: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.02)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px", fontSize: "18px", fontWeight: 800, color: "#0f172a", borderBottom: "1px solid rgba(0,0,0,0.05)", paddingBottom: "16px" }}>
                <Filter size={20} color="#0d9488" /> Bộ lọc
              </div>

              {/* Khu vực */}
              <div style={{ marginBottom: "24px" }}>
                <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a", marginBottom: "12px" }}>Khu vực</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    { val: "bac", label: "Miền Bắc" },
                    { val: "trung", label: "Miền Trung" },
                    { val: "nam", label: "Miền Nam" },
                    { val: "quocte", label: "Quốc tế" }
                  ].map(opt => (
                    <label key={opt.val} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#475569", cursor: "pointer", fontWeight: 500 }}>
                      <input type="checkbox" checked={regionFilters.includes(opt.val)} onChange={() => handleRegionChange(opt.val)} style={{ width: "16px", height: "16px", accentColor: "#0d9488", cursor: "pointer" }} />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Mức giá */}
              <div style={{ marginBottom: "24px" }}>
                <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a", marginBottom: "12px" }}>Mức giá tối đa</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <input type="range" min="500000" max="10000000" step="500000" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} style={{ width: "100%", accentColor: "#0d9488", cursor: "pointer" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#64748b", fontWeight: 600 }}>
                    <span>0₫</span>
                    <span style={{ color: "#0d9488" }}>{maxPrice.toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>
              </div>

              {/* Thời gian */}
              <div style={{ marginBottom: "0" }}>
                <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a", marginBottom: "12px" }}>Thời gian</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    { val: "short", label: "1 - 2 ngày" },
                    { val: "medium", label: "3 - 4 ngày" },
                    { val: "long", label: "Trên 4 ngày" }
                  ].map(opt => (
                    <label key={opt.val} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#475569", cursor: "pointer", fontWeight: 500 }}>
                      <input type="checkbox" checked={durationFilters.includes(opt.val)} onChange={() => handleDurationChange(opt.val)} style={{ width: "16px", height: "16px", accentColor: "#0d9488", cursor: "pointer" }} />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT SIDE: RESULTS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Top Toolbar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#ffffff", padding: "16px 24px", borderRadius: "16px", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>
                Tìm thấy <span style={{ color: "#0d9488" }}>{filteredTours.length}</span> kết quả
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <ArrowDownAZ size={18} color="#64748b" />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: "8px 12px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.1)", background: "#f8fafc", fontSize: "14px", fontWeight: 600, color: "#0f172a", outline: "none", cursor: "pointer" }}>
                  <option value="default">Đề xuất</option>
                  <option value="price_asc">Giá: Thấp đến Cao</option>
                  <option value="price_desc">Giá: Cao đến Thấp</option>
                  <option value="rating_desc">Đánh giá cao nhất</option>
                </select>
              </div>
            </div>

            {/* Tours Grid */}
            <div className="results-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
              {filteredTours.map(dest => (
                <div key={dest.id} className="glass-hover" style={{ ...glassCard, display: "flex", flexDirection: "column" }} onClick={() => router.push(`/tours/${dest.id}`)}>
                  <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
                    <img src={dest.img} alt={dest.name} className="card-img" />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.7) 100%)" }} />
                    <span className="tag-badge" style={{ position: "absolute", top: "12px", right: "12px", background: tagColor[dest.tag] || "#0d9488", color: "#fff", boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }}>{dest.tag}</span>
                    <button className="wishlist-btn" onClick={(e) => { e.stopPropagation(); toggleWishlist(dest.id); }} style={{ position: "absolute", top: "12px", left: "12px", width: "32px", height: "32px", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", border: "none", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
                      <Heart size={14} fill={wishlist[dest.id] ? "#ef4444" : "transparent"} color={wishlist[dest.id] ? "#ef4444" : "#64748b"} />
                    </button>
                    <div style={{ position: "absolute", bottom: "12px", left: "12px", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", border: "none", borderRadius: "8px", padding: "4px 10px", fontSize: "11px", color: "#0f172a", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
                      <Moon size={12} color="#d97706" /> {dest.nights} đêm
                    </div>
                  </div>
                  <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>
                    <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "6px", display: "flex", alignItems: "center", gap: "4px", fontWeight: 600 }}>
                      <MapPin size={12} color="#0d9488" /> {dest.country}
                    </div>
                    <h3 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "10px", color: "#0f172a" }}>{dest.name}</h3>
                    <StarRating rating={dest.rating} />
                    <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px", marginBottom: "16px", fontWeight: 500 }}>{dest.reviews.toLocaleString()} đánh giá</div>

                    <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "16px", borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                      <div>
                        <span style={{ fontSize: "18px", fontWeight: 800, color: "#0d9488" }}>₫{dest.price}</span>
                      </div>
                      <button style={{ background: "rgba(13,148,136,0.1)", border: "1px solid rgba(13,148,136,0.2)", color: "#0d9488", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: 700, fontFamily: "'Inter', sans-serif", transition: "all 0.2s" }} onMouseEnter={e => { e.target.style.background = "#0d9488"; e.target.style.color = "#fff"; }} onMouseLeave={e => { e.target.style.background = "rgba(13,148,136,0.1)"; e.target.style.color = "#0d9488"; }}>Đặt ngay</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {filteredTours.length > 0 && (
              <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "40px" }}>
                <button style={{ padding: "8px 16px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.1)", background: "#fff", color: "#0f172a", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => e.target.style.background = "#f8fafc"} onMouseLeave={e => e.target.style.background = "#fff"}>Trước</button>
                <button style={{ padding: "8px 16px", borderRadius: "10px", border: "none", background: "#0d9488", color: "#fff", fontWeight: 600, cursor: "pointer" }}>1</button>
                <button style={{ padding: "8px 16px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.1)", background: "#fff", color: "#0f172a", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => e.target.style.background = "#f8fafc"} onMouseLeave={e => e.target.style.background = "#fff"}>2</button>
                <button style={{ padding: "8px 16px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.1)", background: "#fff", color: "#0f172a", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => e.target.style.background = "#f8fafc"} onMouseLeave={e => e.target.style.background = "#fff"}>Tiếp</button>
              </div>
            )}

            {filteredTours.length === 0 && (
              <div style={{ textAlign: "center", padding: "80px 20px", background: "#ffffff", borderRadius: "20px", border: "1px solid rgba(0,0,0,0.05)" }}>
                <Search size={48} color="#cbd5e1" style={{ margin: "0 auto 16px" }} />
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}>Không tìm thấy kết quả</h3>
                <p style={{ color: "#64748b", fontSize: "14px", fontWeight: 500 }}>Thử điều chỉnh bộ lọc để xem nhiều tour hơn nhé.</p>
                <button onClick={() => { setRegionFilters([]); setMaxPrice(10000000); setDurationFilters([]); }} style={{ marginTop: "20px", background: "#f8fafc", border: "1px solid rgba(0,0,0,0.1)", color: "#0f172a", padding: "10px 20px", borderRadius: "10px", cursor: "pointer", fontWeight: 600, fontSize: "14px" }}>
                  Xóa bộ lọc
                </button>
              </div>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
