"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { homestays, mockHomestayDetail } from "@/data/mockData";
import { MapPin, Heart, Share, Star, CheckCircle2, ChevronRight, Grid, ChevronDown, ChevronUp, MessageSquare, Bed, Bath, Users, Wifi, Coffee, Tv, Car, Wind, Waves } from "lucide-react";

export default function HomestayDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const homeBasic = homestays.find(h => h.id === parseInt(id)) || homestays[0];
  const homeDetail = mockHomestayDetail;

  const [wishlist, setWishlist] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleBooking = () => {
    if (!startDate || !endDate) {
      alert("Vui lòng chọn Nhận phòng và Trả phòng trước khi đặt!");
      return;
    }
    router.push("/checkout");
  };

  const mainImg = homeDetail.gallery[0];
  const subImgs = homeDetail.gallery.slice(1, 5);

  const getIcon = (iconName) => {
    switch (iconName) {
      case "Wifi": return <Wifi size={24} color="#0f172a" strokeWidth={1.5} />;
      case "Coffee": return <Coffee size={24} color="#0f172a" strokeWidth={1.5} />;
      case "Tv": return <Tv size={24} color="#0f172a" strokeWidth={1.5} />;
      case "Car": return <Car size={24} color="#0f172a" strokeWidth={1.5} />;
      case "Wind": return <Wind size={24} color="#0f172a" strokeWidth={1.5} />;
      case "Waves": return <Waves size={24} color="#0f172a" strokeWidth={1.5} />;
      default: return <CheckCircle2 size={24} color="#0f172a" strokeWidth={1.5} />;
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ height: "72px" }}></div>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 20px 80px" }}>
        
        {/* BREADCRUMBS */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#64748b", marginBottom: "24px", fontWeight: 500 }}>
          <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>Trang chủ</Link>
          <ChevronRight size={14} />
          <Link href="/homestays" style={{ color: "#64748b", textDecoration: "none" }}>Homestays</Link>
          <ChevronRight size={14} />
          <span style={{ color: "#0f172a", fontWeight: 600 }}>{homeBasic.name}</span>
        </div>

        {/* HEADER INFO */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px" }}>
          <div>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "32px", fontWeight: 800, color: "#0f172a", marginBottom: "8px", letterSpacing: "-0.5px" }}>
              {homeBasic.name}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "14px", color: "#475569", fontWeight: 600 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#0f172a" }}>
                <Star size={16} fill="#0f172a" color="#0f172a" />
                <span style={{ fontWeight: 800 }}>{homeBasic.rating}</span>
                <span style={{ textDecoration: "underline" }}>({homeDetail.reviews.length} đánh giá)</span>
              </div>
              <span>•</span>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <MapPin size={16} color="#0f172a" /> <span style={{ textDecoration: "underline", color: "#0f172a" }}>{homeBasic.location}</span>
              </div>
            </div>
          </div>
          
          <div style={{ display: "flex", gap: "16px" }}>
            <button style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: "#0f172a", fontSize: "14px", fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}>
              <Share size={16} /> Chia sẻ
            </button>
            <button onClick={() => setWishlist(!wishlist)} style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: "#0f172a", fontSize: "14px", fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}>
              <Heart size={16} fill={wishlist ? "#ef4444" : "transparent"} color={wishlist ? "#ef4444" : "#0f172a"} /> 
              {wishlist ? "Đã lưu" : "Lưu"}
            </button>
          </div>
        </div>

        {/* PHOTO GALLERY */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", height: "500px", borderRadius: "24px", overflow: "hidden", marginBottom: "48px", position: "relative" }}>
          <div style={{ width: "100%", height: "100%" }}>
            <img src={mainImg} style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "pointer", transition: "opacity 0.2s" }} onMouseEnter={e => e.target.style.opacity = 0.9} onMouseLeave={e => e.target.style.opacity = 1} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: "8px" }}>
            {subImgs.map((img, idx) => (
              <img key={idx} src={img} style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "pointer", transition: "opacity 0.2s" }} onMouseEnter={e => e.target.style.opacity = 0.9} onMouseLeave={e => e.target.style.opacity = 1} />
            ))}
          </div>
          <button style={{ position: "absolute", bottom: "24px", right: "24px", background: "#ffffff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "12px", padding: "8px 16px", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 600, color: "#0f172a", cursor: "pointer", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", transition: "all 0.2s" }} onMouseEnter={e => e.target.style.transform = "scale(1.05)"} onMouseLeave={e => e.target.style.transform = "scale(1)"}>
            <Grid size={16} /> Hiển thị tất cả ảnh
          </button>
        </div>

        {/* MAIN CONTENT 2 COLS */}
        <div style={{ display: "grid", gridTemplateColumns: "65% 30%", gap: "5%" }}>
          
          {/* LEFT COL */}
          <div>
            {/* OVERVIEW */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "32px", borderBottom: "1px solid rgba(0,0,0,0.05)", marginBottom: "32px" }}>
              <div>
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "24px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>{homeDetail.type} - Chủ nhà {homeDetail.host.name}</h2>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "16px", color: "#0f172a", fontWeight: 500 }}>
                  <span>{homeDetail.capacity.guests} khách</span>
                  <span>•</span>
                  <span>{homeDetail.capacity.bedrooms} phòng ngủ</span>
                  <span>•</span>
                  <span>{homeDetail.capacity.beds} giường</span>
                  <span>•</span>
                  <span>{homeDetail.capacity.baths} phòng tắm</span>
                </div>
              </div>
              <img src={homeDetail.host.avatar} alt="Host" style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
            </div>

            {/* DESCRIPTION */}
            <div style={{ paddingBottom: "32px", borderBottom: "1px solid rgba(0,0,0,0.05)", marginBottom: "32px" }}>
              <p style={{ color: "#475569", fontSize: "16px", lineHeight: 1.7, fontWeight: 500 }}>{homeDetail.description}</p>
            </div>

            {/* AMENITIES */}
            <div style={{ paddingBottom: "32px", borderBottom: "1px solid rgba(0,0,0,0.05)", marginBottom: "32px" }}>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "22px", fontWeight: 800, color: "#0f172a", marginBottom: "24px" }}>Nơi này có những gì cho bạn</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                {homeDetail.amenities.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "16px", color: "#475569", fontSize: "16px", fontWeight: 500 }}>
                    {getIcon(item.icon)} {item.label}
                  </div>
                ))}
              </div>
              <button style={{ marginTop: "32px", background: "#ffffff", border: "1px solid #0f172a", borderRadius: "10px", padding: "12px 24px", fontSize: "15px", fontWeight: 600, color: "#0f172a", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => {e.target.style.background="#0f172a"; e.target.style.color="#fff";}} onMouseLeave={e => {e.target.style.background="#ffffff"; e.target.style.color="#0f172a";}}>
                Hiển thị tất cả tiện nghi
              </button>
            </div>

            {/* RULES */}
            <div style={{ paddingBottom: "32px", borderBottom: "1px solid rgba(0,0,0,0.05)", marginBottom: "32px" }}>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "22px", fontWeight: 800, color: "#0f172a", marginBottom: "20px" }}>Nội quy nhà</h2>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                {homeDetail.rules.map((rule, idx) => (
                  <li key={idx} style={{ display: "flex", alignItems: "center", gap: "12px", color: "#475569", fontSize: "16px", fontWeight: 500 }}>
                    <div style={{ width: "6px", height: "6px", background: "#0f172a", borderRadius: "50%" }}></div> {rule}
                  </li>
                ))}
              </ul>
            </div>

            {/* REVIEWS */}
            <div style={{ paddingBottom: "32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <Star size={24} fill="#0f172a" color="#0f172a" />
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "24px", fontWeight: 800, color: "#0f172a" }}>{homeBasic.rating} • {homeDetail.reviews.length} đánh giá</h2>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                {homeDetail.reviews.map((rev, idx) => (
                  <div key={idx}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                      <img src={rev.avatar} style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover" }} />
                      <div>
                        <div style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>{rev.name}</div>
                        <div style={{ fontSize: "14px", color: "#64748b", fontWeight: 500 }}>{rev.date}</div>
                      </div>
                    </div>
                    <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.6, fontWeight: 500 }}>"{rev.comment}"</p>
                  </div>
                ))}
              </div>
              <button style={{ marginTop: "32px", background: "#ffffff", border: "1px solid #0f172a", borderRadius: "10px", padding: "12px 24px", fontSize: "15px", fontWeight: 600, color: "#0f172a", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => {e.target.style.background="#0f172a"; e.target.style.color="#fff";}} onMouseLeave={e => {e.target.style.background="#ffffff"; e.target.style.color="#0f172a";}}>
                Hiển thị tất cả đánh giá
              </button>
            </div>

          </div>

          {/* RIGHT COL: STICKY BOOKING CARD */}
          <div>
            <div style={{ position: "sticky", top: "100px", background: "#ffffff", border: "1px solid rgba(0,0,0,0.15)", borderRadius: "24px", padding: "24px", boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "24px" }}>
                <span style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a" }}>₫{homeBasic.price}</span>
                <span style={{ fontSize: "16px", color: "#64748b", fontWeight: 500 }}>/ đêm</span>
              </div>

              {/* Form Input */}
              <div style={{ border: "1px solid #cbd5e1", borderRadius: "12px", overflow: "hidden", marginBottom: "20px" }}>
                <div style={{ display: "flex", borderBottom: "1px solid #cbd5e1" }}>
                  <div style={{ flex: 1, padding: "12px 16px", borderRight: "1px solid #cbd5e1", cursor: "pointer", background: "#fff", transition: "background 0.2s" }} onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
                    <div style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: "#0f172a", marginBottom: "2px" }}>Nhận phòng</div>
                    <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} style={{ background: "transparent", border: "none", outline: "none", fontSize: "14px", fontWeight: 600, color: "#0f172a", width: "100%", cursor: "pointer", padding: 0 }} />
                  </div>
                  <div style={{ flex: 1, padding: "12px 16px", cursor: "pointer", background: "#fff", transition: "background 0.2s" }} onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
                    <div style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: "#0f172a", marginBottom: "2px" }}>Trả phòng</div>
                    <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} style={{ background: "transparent", border: "none", outline: "none", fontSize: "14px", fontWeight: 600, color: "#0f172a", width: "100%", cursor: "pointer", padding: 0 }} />
                  </div>
                </div>
                <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", background: "#fff", transition: "background 0.2s" }} onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
                  <div>
                    <div style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: "#0f172a", marginBottom: "2px" }}>Khách</div>
                    <div style={{ color: "#0f172a", fontSize: "14px", fontWeight: 600 }}>1 khách</div>
                  </div>
                  <ChevronDown size={20} color="#0f172a" />
                </div>
              </div>

              <button onClick={handleBooking} className="shimmer-btn" style={{ width: "100%", padding: "16px", borderRadius: "12px", border: "none", fontSize: "16px", fontWeight: 700, cursor: "pointer", marginBottom: "16px", boxShadow: "0 4px 20px rgba(13,148,136,0.3)" }}>
                Đặt phòng
              </button>
              
              <div style={{ textAlign: "center", fontSize: "14px", color: "#64748b", fontWeight: 500, marginBottom: "24px" }}>
                Bạn vẫn chưa bị trừ tiền
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", fontSize: "16px", color: "#475569", fontWeight: 500 }}>
                <span style={{ textDecoration: "underline" }}>₫{homeBasic.price} x 1 đêm</span>
                <span>₫{homeBasic.price}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", fontSize: "16px", color: "#475569", fontWeight: 500 }}>
                <span style={{ textDecoration: "underline" }}>Phí dịch vụ VietJourney</span>
                <span>₫0</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px", paddingTop: "24px", borderTop: "1px solid rgba(0,0,0,0.1)", fontSize: "18px", color: "#0f172a", fontWeight: 800 }}>
                <span>Tổng trước thuế</span>
                <span>₫{homeBasic.price}</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
