"use client";
import { motion } from "framer-motion";
import { Smile, Coffee, Compass, Heart, Leaf, CloudRain } from "lucide-react";

const moods = [
  { id: "Happy", label: "Vui vẻ", icon: Smile, color: "#facc15" },
  { id: "Relaxed", label: "Thư giãn", icon: Coffee, color: "#2dd4bf" },
  { id: "Adventurous", label: "Khám phá", icon: Compass, color: "#f43f5e" },
  { id: "Romantic", label: "Lãng mạn", icon: Heart, color: "#f472b6" },
  { id: "Peaceful", label: "Yên bình", icon: Leaf, color: "#60a5fa" },
  { id: "Melancholy", label: "Tâm trạng", icon: CloudRain, color: "#94a3b8" },
];

export default function MoodSelector({ onMoodSelect, selectedMood }) {
  return (
    <section style={{ padding: "40px 20px", position: "relative", zIndex: 10 }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: "11px", color: "#0d9488", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>
          ✦ CẢM HỨNG DU LỊCH
        </div>
        <h2 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "8px", color: "#0f172a", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Hôm nay bạn cảm thấy thế nào?
        </h2>

        <div style={{
          display: "flex",
          gap: "12px",
          justifyContent: "center",
          flexWrap: "wrap",
          marginTop: "32px"
        }}>
          {moods.map((mood) => {
            const Icon = mood.icon;
            const isActive = selectedMood === mood.id;

            return (
              <motion.button
                key={mood.id}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onMoodSelect(mood.id)}
                style={{
                  position: "relative",
                  padding: "12px 24px",
                  borderRadius: "100px",
                  border: isActive ? `2px solid ${mood.color}` : "1px solid rgba(0,0,0,0.08)",
                  background: isActive ? "#fff" : "rgba(255,255,255,0.5)",
                  backdropFilter: "blur(8px)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  boxShadow: isActive ? `0 10px 20px ${mood.color}25` : "0 4px 12px rgba(0,0,0,0.02)",
                  transition: "all 0.3s ease",
                  outline: "none"
                }}
              >
                <div style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: isActive ? mood.color : "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isActive ? "#fff" : mood.color,
                  transition: "all 0.3s ease"
                }}>
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                </div>

                <span style={{
                  fontSize: "14px",
                  fontWeight: isActive ? 700 : 600,
                  color: isActive ? "#0f172a" : "#64748b"
                }}>
                  {mood.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
