"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CreditCard, Wallet, Landmark, ChevronLeft, Lock } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("card");

  // Mock order data
  const mockOrder = {
    title: "Eco Lodge Sapa",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&q=80",
    details: "Toàn bộ căn hộ • 2 đêm • 4 khách",
    dates: "15 Thg 6 - 17 Thg 6, 2024",
    pricePerNight: 1200000,
    nights: 2,
    serviceFee: 150000,
  };

  const totalBeforeTax = mockOrder.pricePerNight * mockOrder.nights;
  const total = totalBeforeTax + mockOrder.serviceFee;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate loading/processing
    router.push("/success");
  };

  const inputStyle = {
    width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.1)", background: "#ffffff", outline: "none", fontSize: "15px", color: "#0f172a", fontFamily: "'Inter', sans-serif"
  };

  const methodStyle = (active) => ({
    display: "flex", alignItems: "center", gap: "12px", padding: "20px", borderRadius: "16px", border: `2px solid ${active ? "#0d9488" : "rgba(0,0,0,0.05)"}`, background: active ? "rgba(13,148,136,0.02)" : "#ffffff", cursor: "pointer", transition: "all 0.2s"
  });

  return (
    <>
      <Navbar />
      <div style={{ height: "72px" }}></div>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px 80px" }}>
        
        {/* BREADCRUMB / BACK */}
        <div style={{ marginBottom: "32px" }}>
          <button onClick={() => router.back()} style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: "#64748b", fontSize: "15px", fontWeight: 600, cursor: "pointer" }}>
            <ChevronLeft size={18} /> Quay lại
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "64px" }} className="tours-layout-grid">
          
          {/* LEFT COL: FORM */}
          <div>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "32px", fontWeight: 800, color: "#0f172a", marginBottom: "40px" }}>
              Xác nhận và Thanh toán
            </h1>

            <form onSubmit={handleSubmit}>
              {/* CONTACT INFO */}
              <div style={{ marginBottom: "48px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", marginBottom: "24px" }}>Thông tin liên hệ</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Họ và tên đệm</label>
                    <input type="text" placeholder="Nguyễn Văn" style={inputStyle} required />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Tên</label>
                    <input type="text" placeholder="A" style={inputStyle} required />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Số điện thoại</label>
                    <input type="tel" placeholder="0912 345 678" style={inputStyle} required />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Email</label>
                    <input type="email" placeholder="example@email.com" style={inputStyle} required />
                  </div>
                </div>
              </div>

              {/* PAYMENT METHODS */}
              <div style={{ marginBottom: "48px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", marginBottom: "24px" }}>Phương thức thanh toán</h2>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={methodStyle(paymentMethod === "card")} onClick={() => setPaymentMethod("card")}>
                    <CreditCard size={24} color={paymentMethod === "card" ? "#0d9488" : "#64748b"} />
                    <span style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a" }}>Thẻ Tín dụng / Ghi nợ</span>
                  </div>

                  {paymentMethod === "card" && (
                    <div style={{ padding: "20px", background: "#f8fafc", borderRadius: "16px", border: "1px solid rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: "16px", marginLeft: "20px" }}>
                      <input type="text" placeholder="Số thẻ (0000 0000 0000 0000)" style={inputStyle} required={paymentMethod === "card"} />
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <input type="text" placeholder="MM/YY" style={inputStyle} required={paymentMethod === "card"} />
                        <input type="text" placeholder="CVC" style={inputStyle} required={paymentMethod === "card"} />
                      </div>
                    </div>
                  )}

                  <div style={methodStyle(paymentMethod === "wallet")} onClick={() => setPaymentMethod("wallet")}>
                    <Wallet size={24} color={paymentMethod === "wallet" ? "#0d9488" : "#64748b"} />
                    <span style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a" }}>Ví điện tử (Momo / ZaloPay)</span>
                  </div>

                  <div style={methodStyle(paymentMethod === "bank")} onClick={() => setPaymentMethod("bank")}>
                    <Landmark size={24} color={paymentMethod === "bank" ? "#0d9488" : "#64748b"} />
                    <span style={{ fontSize: "16px", fontWeight: 600, color: "#0f172a" }}>Chuyển khoản ngân hàng</span>
                  </div>
                </div>
              </div>

              <div style={{ padding: "24px", background: "rgba(13,148,136,0.05)", borderRadius: "16px", display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px", color: "#0f172a" }}>
                <Lock size={24} color="#0d9488" />
                <p style={{ fontSize: "14px", fontWeight: 500, lineHeight: 1.5, margin: 0 }}>
                  Thông tin thanh toán của bạn được mã hóa và bảo mật an toàn tuyệt đối. Chúng tôi không lưu trữ dữ liệu thẻ của bạn.
                </p>
              </div>

              <button type="submit" className="shimmer-btn" style={{ width: "100%", padding: "20px", borderRadius: "16px", border: "none", fontSize: "18px", fontWeight: 800, cursor: "pointer", boxShadow: "0 10px 30px rgba(13,148,136,0.3)" }}>
                Xác nhận và Thanh toán
              </button>
            </form>
          </div>

          {/* RIGHT COL: SUMMARY */}
          <div>
            <div style={{ position: "sticky", top: "100px", background: "#ffffff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "24px", padding: "24px", boxShadow: "0 20px 40px rgba(0,0,0,0.06)" }}>
              {/* Item Overview */}
              <div style={{ display: "flex", gap: "16px", paddingBottom: "24px", borderBottom: "1px solid rgba(0,0,0,0.05)", marginBottom: "24px" }}>
                <img src={mockOrder.image} alt="Order" style={{ width: "100px", height: "100px", borderRadius: "12px", objectFit: "cover" }} />
                <div>
                  <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600, marginBottom: "4px" }}>{mockOrder.details}</div>
                  <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>{mockOrder.title}</h3>
                  <div style={{ fontSize: "14px", color: "#475569", fontWeight: 500 }}>{mockOrder.dates}</div>
                </div>
              </div>

              <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", marginBottom: "20px" }}>Chi tiết giá</h2>
              
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", fontSize: "15px", color: "#475569", fontWeight: 500 }}>
                <span>₫{mockOrder.pricePerNight.toLocaleString()} x {mockOrder.nights} đêm</span>
                <span>₫{totalBeforeTax.toLocaleString()}</span>
              </div>
              
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", fontSize: "15px", color: "#475569", fontWeight: 500 }}>
                <span style={{ textDecoration: "underline" }}>Phí dịch vụ VietJourney</span>
                <span>₫{mockOrder.serviceFee.toLocaleString()}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px", paddingTop: "24px", borderTop: "1px solid rgba(0,0,0,0.1)", fontSize: "20px", color: "#0f172a", fontWeight: 800 }}>
                <span>Tổng cộng</span>
                <span>₫{total.toLocaleString()}</span>
              </div>

              <p style={{ fontSize: "13px", color: "#64748b", fontWeight: 500, textAlign: "center", marginTop: "24px", lineHeight: 1.5 }}>
                Bằng việc bấm Xác nhận và Thanh toán, bạn đồng ý với <Link href="#" style={{ color: "#0d9488" }}>Điều khoản Dịch vụ</Link> của chúng tôi.
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
