"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import TourCard from "./TourCard";
import HotelCard from "./HotelCard";
import SkeletonCard from "./SkeletonCard";

export default function MoodRecommendations({ mood }) {
  const [recommendations, setRecommendations] = useState({ tours: [], hotels: [] });
  const [loading, setLoading] = useState(false);
  const scrollRefTours = useRef(null);
  const scrollRefHotels = useRef(null);

  useEffect(() => {
    if (!mood) return;

    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3002/recommendations/mood?mood=${mood}`);
        const data = await response.json();
        setRecommendations(data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [mood]);

  const scroll = (ref, direction) => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
      ref.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!mood) return null;

  return (
    <section style={{ 
      padding: "60px 0", 
      background: "rgba(241, 245, 249, 0.5)", 
      borderTop: "1px solid rgba(0,0,0,0.03)",
      borderBottom: "1px solid rgba(0,0,0,0.03)",
      overflow: "hidden"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "32px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "#0d9488", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
            <Sparkles size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Hành trình gợi ý <span style={{ color: "#0d9488" }}>"{mood}"</span>
            </h3>
            <p style={{ fontSize: "14px", color: "#64748b" }}>Những lựa chọn tuyệt vời nhất dành riêng cho tâm hồn bạn hôm nay.</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <div style={{ display: "flex", gap: "24px", overflow: "hidden" }}>
              {[1, 2, 3, 4].map((i) => <div key={i} style={{ minWidth: "300px" }}><SkeletonCard /></div>)}
            </div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: "flex", flexDirection: "column", gap: "48px" }}
            >
              {/* Tours Section */}
              {recommendations.tours.length > 0 && (
                <div style={{ position: "relative" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h4 style={{ fontSize: "18px", fontWeight: 700, color: "#334155", display: "flex", alignItems: "center", gap: "8px" }}>
                      Các Tour trải nghiệm
                    </h4>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => scroll(scrollRefTours, 'left')} style={scrollBtnStyle}><ChevronLeft size={18} /></button>
                      <button onClick={() => scroll(scrollRefTours, 'right')} style={scrollBtnStyle}><ChevronRight size={18} /></button>
                    </div>
                  </div>
                  <div 
                    ref={scrollRefTours}
                    className="no-scrollbar"
                    style={{ 
                      display: "flex", 
                      gap: "24px", 
                      overflowX: "auto", 
                      paddingBottom: "20px",
                      scrollSnapType: "x mandatory",
                      msOverflowStyle: 'none',
                      scrollbarWidth: 'none'
                    }}
                  >
                    {recommendations.tours.map((tour) => (
                      <div key={tour.id} style={{ minWidth: "300px", maxWidth: "300px", scrollSnapAlign: "start" }}>
                        <TourCard tour={tour} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hotels Section */}
              {recommendations.hotels.length > 0 && (
                <div style={{ position: "relative" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h4 style={{ fontSize: "18px", fontWeight: 700, color: "#334155", display: "flex", alignItems: "center", gap: "8px" }}>
                      Điểm lưu trú lý tưởng
                    </h4>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => scroll(scrollRefHotels, 'left')} style={scrollBtnStyle}><ChevronLeft size={18} /></button>
                      <button onClick={() => scroll(scrollRefHotels, 'right')} style={scrollBtnStyle}><ChevronRight size={18} /></button>
                    </div>
                  </div>
                  <div 
                    ref={scrollRefHotels}
                    className="no-scrollbar"
                    style={{ 
                      display: "flex", 
                      gap: "24px", 
                      overflowX: "auto", 
                      paddingBottom: "20px",
                      scrollSnapType: "x mandatory",
                      msOverflowStyle: 'none',
                      scrollbarWidth: 'none'
                    }}
                  >
                    {recommendations.hotels.map((hotel) => (
                      <div key={hotel.id} style={{ minWidth: "300px", maxWidth: "300px", scrollSnapAlign: "start" }}>
                        <HotelCard 
                          hotel={{
                            ...hotel,
                            location: hotel.city,
                            price: hotel.price || 0,
                            beds: 2,
                            baths: 1,
                          }} 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {recommendations.tours.length === 0 && recommendations.hotels.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px 40px", background: "#fff", borderRadius: "24px", border: "1px dashed #cbd5e1" }}>
                  <p style={{ color: "#64748b", fontSize: "16px" }}>Chưa có gợi ý nào cho tâm trạng này. Hãy thử chọn tâm trạng khác nhé!</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

const scrollBtnStyle = {
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  background: "#fff",
  border: "1px solid #e2e8f0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#64748b",
  cursor: "pointer",
  transition: "all 0.2s ease",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
};
