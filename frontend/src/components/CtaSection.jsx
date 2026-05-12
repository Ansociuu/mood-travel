"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlaneTakeoff, Mail, Gift, Map, Home } from "lucide-react";

export default function CtaSection() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const glassCard = {
    background: "#ffffff",
    border: "1px solid rgba(0,0,0,0.05)",
    borderRadius: "24px",
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleRegisterRedirect = () => {
    setError("");
    if (!email) {
      setError("Vui lòng nhập email của bạn");
      return;
    }
    if (!validateEmail(email)) {
      setError("Email không hợp lệ");
      return;
    }

    // Redirect to register page with email as query param
    router.push(`/register?email=${encodeURIComponent(email)}`);
  };

  return (
    <section className="section-pad" style={{ position: "relative", zIndex: 1, padding: "0 40px 100px" }}>
      <div className="cta-pad" style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center", ...glassCard, padding: "64px", background: "linear-gradient(135deg, rgba(20,184,166,0.08) 0%, #ffffff 50%, rgba(217,119,6,0.08) 100%)", position: "relative", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.06)" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(20,184,166,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />
        
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px", animation: "float 3s ease-in-out infinite" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(13,148,136,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <PlaneTakeoff size={32} color="#0d9488" />
          </div>
        </div>

        <h2 className="cta-h2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "38px", fontWeight: 800, marginBottom: "16px", letterSpacing: "-0.5px", color: "#0f172a" }}>
          Sẵn sàng cho<br />
          <span style={{ color: "#d97706" }}>chuyến đi tiếp theo?</span>
        </h2>
        <p style={{ color: "#475569", fontSize: "16px", marginBottom: "36px", lineHeight: 1.7, fontWeight: 500 }}>
          Đăng ký tài khoản ngay hôm nay và nhận ngay voucher <strong style={{ color: "#0d9488" }}>200.000₫</strong> cho chuyến đầu tiên.
        </p>

        {/* Newsletter-style Register input */}
        <div style={{ maxWidth: "480px", margin: "0 auto 32px" }}>
          <div style={{ display: "flex", gap: "8px", position: "relative" }}>
            <div style={{ flex: 1, background: "#f8fafc", border: error ? "1px solid #ef4444" : "1px solid rgba(0,0,0,0.05)", borderRadius: "14px", padding: "14px 18px", display: "flex", alignItems: "center", gap: "10px", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)", transition: "all 0.2s" }}>
              <Mail size={18} color={error ? "#ef4444" : "#94a3b8"} />
              <input 
                placeholder="Nhập email của bạn..." 
                value={email} 
                onChange={e => { setEmail(e.target.value); setError(""); }} 
                style={{ fontSize: "15px", color: "#0f172a", fontWeight: 500, width: "100%", background: "transparent", border: "none", outline: "none" }} 
                onKeyDown={e => e.key === "Enter" && handleRegisterRedirect()} 
              />
            </div>
            <button 
              onClick={handleRegisterRedirect} 
              className="shimmer-btn" 
              style={{ color: "#fff", padding: "14px 24px", borderRadius: "14px", cursor: "pointer", fontSize: "15px", fontWeight: 700, border: "none", whiteSpace: "nowrap", boxShadow: "0 4px 20px rgba(13,148,136,0.3)", display: "flex", alignItems: "center", gap: "8px" }}
            >
              <Gift size={16} /> Đăng ký ngay
            </button>
          </div>
          {error && <div style={{ color: "#ef4444", fontSize: "13px", fontWeight: 600, marginTop: "8px", textAlign: "left", paddingLeft: "18px" }}>{error}</div>}
        </div>

        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <button style={{ background: "#0f172a", color: "#fff", border: "none", padding: "14px 28px", borderRadius: "14px", cursor: "pointer", fontSize: "15px", fontFamily: "'Inter', sans-serif", fontWeight: 700, transition: "all 0.2s", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 10px 20px rgba(15,23,42,0.15)" }} onClick={() => router.push("/tours")} onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; }} onMouseLeave={e => { e.target.style.transform = "translateY(0)"; }}>
            <Map size={18} /> Xem tất cả tour
          </button>
          <button style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.1)", color: "#0f172a", padding: "14px 28px", borderRadius: "14px", cursor: "pointer", fontSize: "15px", fontFamily: "'Inter', sans-serif", fontWeight: 700, transition: "all 0.2s", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 10px 20px rgba(0,0,0,0.03)" }} onClick={() => router.push("/homestays")} onMouseEnter={e => { e.target.style.background = "#f8fafc"; e.target.style.transform = "translateY(-2px)"; }} onMouseLeave={e => { e.target.style.background = "#ffffff"; e.target.style.transform = "translateY(0)"; }}>
            <Home size={18} /> Khám phá Homestay
          </button>
        </div>
      </div>
    </section>
  );
}
