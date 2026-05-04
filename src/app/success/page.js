"use client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle, Download, ArrowRight } from "lucide-react";

export default function SuccessPage() {
  return (
    <>
      <Navbar />
      <div style={{ height: "72px" }}></div>

      <main style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.05)", borderRadius: "32px", padding: "64px 40px", maxWidth: "600px", width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.05)" }}>
          
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(16,185,129,0.1)", color: "#10b981", marginBottom: "32px" }}>
            <CheckCircle size={48} strokeWidth={2.5} />
          </div>

          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "36px", fontWeight: 800, color: "#0f172a", marginBottom: "16px", letterSpacing: "-0.5px" }}>
            Thanh toán thành công!
          </h1>
          
          <p style={{ fontSize: "16px", color: "#64748b", fontWeight: 500, lineHeight: 1.6, marginBottom: "32px", maxWidth: "400px", margin: "0 auto 32px" }}>
            Cảm ơn bạn đã tin tưởng lựa chọn VietJourney. Thông tin xác nhận đặt chỗ đã được gửi đến email của bạn.
          </p>

          <div style={{ background: "#f8fafc", padding: "24px", borderRadius: "16px", border: "1px dashed #cbd5e1", display: "inline-block", marginBottom: "40px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Mã đơn hàng</div>
            <div style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a", letterSpacing: "2px" }}>#VJ-892410</div>
          </div>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
            <button style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "12px", padding: "16px 24px", fontSize: "15px", fontWeight: 700, color: "#0f172a", cursor: "pointer", transition: "background 0.2s" }} onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <Download size={18} /> Tải hóa đơn
            </button>
            <Link href="/" className="shimmer-btn" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px", borderRadius: "12px", padding: "16px 32px", fontSize: "15px", fontWeight: 700 }}>
              Khám phá thêm <ArrowRight size={18} />
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
