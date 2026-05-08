"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StarRating from "@/components/StarRating";
import { allDestinations, mockTourDetail } from "@/data/mockData";
import { MapPin, Heart, Share, Star, CheckCircle2, Calendar, Users, ChevronDown, ChevronRight, Grid, Map as MapIcon, ChevronUp, MessageSquare } from "lucide-react";

export default function TourDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const tourBasic = allDestinations.find(t => t.id === parseInt(id)) || allDestinations[0];
  const tourDetail = mockTourDetail;

  const [wishlist, setWishlist] = useState(false);
  const [openFaq, setOpenFaq] = useState(0); // Mở câu hỏi đầu tiên mặc định
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleBooking = () => {
    if (!startDate || !endDate) {
      alert("Vui lòng chọn Ngày đi và Ngày về trước khi đặt!");
      return;
    }
    router.push("/checkout");
  };

  const mainImg = tourDetail.gallery[0];
  const subImgs = tourDetail.gallery.slice(1, 5);

  return (
    <>
      <Navbar />

      <div style={{ height: "72px" }}></div>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 20px 80px" }}>
        
        {/* BREADCRUMBS */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#64748b", marginBottom: "24px", fontWeight: 500 }}>
          <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>Trang chủ</Link>
          <ChevronRight size={14} />
          <Link href="/tours" style={{ color: "#64748b", textDecoration: "none" }}>Tours</Link>
          <ChevronRight size={14} />
          <span style={{ color: "#0f172a", fontWeight: 600 }}>{tourBasic.name}</span>
        </div>

        {/* HEADER INFO */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px" }}>
          <div>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "32px", fontWeight: 800, color: "#0f172a", marginBottom: "8px", letterSpacing: "-0.5px" }}>
              {tourBasic.name} - Hành trình {tourBasic.nights} đêm
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "14px", color: "#475569", fontWeight: 600 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                <span style={{ color: "#0f172a" }}>{tourBasic.rating}</span>
                <span style={{ textDecoration: "underline" }}>({tourBasic.reviews} đánh giá)</span>
              </div>
              <span>•</span>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <MapPin size={16} color="#0d9488" /> {tourBasic.country}
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
            {/* HOST PROFILE */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "32px", borderBottom: "1px solid rgba(0,0,0,0.05)", marginBottom: "32px" }}>
              <div>
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "22px", fontWeight: 800, color: "#0f172a", marginBottom: "4px" }}>Được tổ chức bởi {tourDetail.host.name}</h2>
                <div style={{ fontSize: "15px", color: "#64748b", fontWeight: 500 }}>Thành viên từ {tourDetail.host.joined} • {tourDetail.host.reviews.toLocaleString()} đánh giá</div>
              </div>
              <img src={tourDetail.host.avatar} alt="Host" style={{ width: "56px", height: "56px", borderRadius: "50%", objectFit: "cover" }} />
            </div>

            {/* DESCRIPTION */}
            <div style={{ paddingBottom: "32px", borderBottom: "1px solid rgba(0,0,0,0.05)", marginBottom: "32px" }}>
              <p style={{ color: "#475569", fontSize: "16px", lineHeight: 1.7, fontWeight: 500 }}>{tourDetail.description}</p>
            </div>

            {/* AMENITIES */}
            <div style={{ paddingBottom: "32px", borderBottom: "1px solid rgba(0,0,0,0.05)", marginBottom: "32px" }}>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "22px", fontWeight: 800, color: "#0f172a", marginBottom: "20px" }}>Tiện ích nổi bật</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {tourDetail.amenities.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "12px", color: "#0f172a", fontSize: "15px", fontWeight: 600 }}>
                    <CheckCircle2 size={20} color="#0d9488" /> {item}
                  </div>
                ))}
              </div>
            </div>

            {/* ITINERARY */}
            <div style={{ paddingBottom: "32px", borderBottom: "1px solid rgba(0,0,0,0.05)", marginBottom: "32px" }}>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "22px", fontWeight: 800, color: "#0f172a", marginBottom: "24px" }}>Lịch trình dự kiến</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {tourDetail.itinerary.map((day, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "20px" }}>
                    <div style={{ minWidth: "64px", height: "64px", background: "#f8fafc", borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "1px solid rgba(0,0,0,0.05)" }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748b" }}>{day.day}</span>
                    </div>
                    <div>
                      <h4 style={{ fontSize: "16px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>{day.title}</h4>
                      <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.6, fontWeight: 500 }}>{day.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MAP SECTION */}
            <div style={{ paddingBottom: "32px", borderBottom: "1px solid rgba(0,0,0,0.05)", marginBottom: "32px" }}>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "22px", fontWeight: 800, color: "#0f172a", marginBottom: "24px" }}>Vị trí điểm đến</h2>
              <div style={{ width: "100%", height: "300px", borderRadius: "16px", background: "#e2e8f0", position: "relative", overflow: "hidden" }}>
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&q=80" alt="Map mockup" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }} />
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "#ffffff", padding: "12px 20px", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, color: "#0f172a" }}>
                  <MapIcon size={20} color="#0d9488" /> Khu vực {tourBasic.name}
                </div>
              </div>
            </div>

            {/* REVIEWS */}
            <div style={{ paddingBottom: "32px", borderBottom: "1px solid rgba(0,0,0,0.05)", marginBottom: "32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <Star size={24} fill="#f59e0b" color="#f59e0b" />
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "24px", fontWeight: 800, color: "#0f172a" }}>{tourBasic.rating} • {tourBasic.reviews} đánh giá</h2>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
                {tourDetail.reviews.map((rev, idx) => (
                  <div key={idx} style={{ background: "#f8fafc", padding: "20px", borderRadius: "16px", border: "1px solid rgba(0,0,0,0.05)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                      <img src={rev.avatar} style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
                      <div>
                        <div style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>{rev.name}</div>
                        <div style={{ fontSize: "13px", color: "#64748b", fontWeight: 500 }}>{rev.date}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "2px", marginBottom: "8px" }}>
                      {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < rev.rating ? "#f59e0b" : "#cbd5e1"} color={i < rev.rating ? "#f59e0b" : "#cbd5e1"} />)}
                    </div>
                    <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.6, fontWeight: 500 }}>"{rev.comment}"</p>
                  </div>
                ))}
              </div>
              <button style={{ background: "#ffffff", border: "1px solid #0f172a", borderRadius: "10px", padding: "10px 24px", fontSize: "15px", fontWeight: 600, color: "#0f172a", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={e => {e.target.style.background="#0f172a"; e.target.style.color="#fff";}} onMouseLeave={e => {e.target.style.background="#ffffff"; e.target.style.color="#0f172a";}}>
                Hiển thị tất cả {tourBasic.reviews} đánh giá
              </button>
            </div>

            {/* FAQs */}
            <div style={{ paddingBottom: "32px" }}>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "22px", fontWeight: 800, color: "#0f172a", marginBottom: "24px" }}>Câu hỏi thường gặp</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {tourDetail.faqs.map((faq, idx) => (
                  <div key={idx} style={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius: "12px", overflow: "hidden" }}>
                    <button 
                      onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                      style={{ width: "100%", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", border: "none", cursor: "pointer", textAlign: "left" }}
                    >
                      <span style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>{faq.question}</span>
                      {openFaq === idx ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                    </button>
                    {openFaq === idx && (
                      <div style={{ padding: "0 20px 20px", fontSize: "15px", color: "#475569", lineHeight: 1.6, fontWeight: 500 }}>
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COL: STICKY BOOKING CARD */}
          <div>
            <div style={{ position: "sticky", top: "100px", background: "#ffffff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "24px", padding: "24px", boxShadow: "0 20px 40px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "24px" }}>
                <span style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a" }}>₫{tourBasic.price}</span>
                <span style={{ fontSize: "15px", color: "#64748b", fontWeight: 500 }}>/ khách</span>
              </div>

              {/* Form Input */}
              <div style={{ border: "1px solid #cbd5e1", borderRadius: "12px", overflow: "hidden", marginBottom: "20px" }}>
                <div style={{ display: "flex", borderBottom: "1px solid #cbd5e1" }}>
                  <div style={{ flex: 1, padding: "12px 16px", borderRight: "1px solid #cbd5e1", cursor: "pointer", background: "#fff", transition: "background 0.2s" }} onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
                    <div style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: "#0f172a" }}>Ngày đi</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px", color: "#64748b", fontSize: "14px" }}>
                      <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} style={{ background: "transparent", border: "none", outline: "none", fontSize: "14px", fontWeight: 600, color: "#0f172a", width: "100%", cursor: "pointer" }} />
                    </div>
                  </div>
                  <div style={{ flex: 1, padding: "12px 16px", cursor: "pointer", background: "#fff", transition: "background 0.2s" }} onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
                    <div style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: "#0f172a" }}>Ngày về</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px", color: "#64748b", fontSize: "14px" }}>
                      <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} style={{ background: "transparent", border: "none", outline: "none", fontSize: "14px", fontWeight: 600, color: "#0f172a", width: "100%", cursor: "pointer" }} />
                    </div>
                  </div>
                </div>
                <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", background: "#fff", transition: "background 0.2s" }} onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
                  <div>
                    <div style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: "#0f172a" }}>Khách</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px", color: "#0f172a", fontSize: "14px", fontWeight: 600 }}>
                      <Users size={14} /> 1 khách
                    </div>
                  </div>
                  <ChevronDown size={16} color="#0f172a" />
                </div>
              </div>

              <button onClick={handleBooking} className="shimmer-btn" style={{ width: "100%", padding: "16px", borderRadius: "12px", border: "none", fontSize: "16px", fontWeight: 700, cursor: "pointer", marginBottom: "16px", boxShadow: "0 4px 20px rgba(13,148,136,0.3)" }}>
                Đặt ngay
              </button>
              
              <div style={{ textAlign: "center", fontSize: "14px", color: "#64748b", fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <MessageSquare size={14} /> Bạn vẫn chưa bị trừ tiền
              </div>

              <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "15px", color: "#475569", fontWeight: 500 }}>
                  <span style={{ textDecoration: "underline" }}>₫{tourBasic.price} x 1 khách</span>
                  <span>₫{tourBasic.price}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "15px", color: "#475569", fontWeight: 500 }}>
                  <span style={{ textDecoration: "underline" }}>Phí dịch vụ VietJourney</span>
                  <span>₫0</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(0,0,0,0.05)", fontSize: "16px", color: "#0f172a", fontWeight: 800 }}>
                  <span>Tổng tiền</span>
                  <span>₫{tourBasic.price}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
