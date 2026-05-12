"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Building2, Globe, TrendingUp, ShieldCheck, Heart, ArrowRight, CheckCircle2, Loader2, LayoutDashboard } from "lucide-react";
import { authApi } from "@/lib/api";

export default function BecomeHostPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleAction = async () => {
    if (!user) {
      router.push("/register?role=OWNER");
      return;
    }

    if (user.role === 'ADMIN' || user.role === 'OWNER') {
      router.push("/admin");
      return;
    }

    // Regular user wanting to upgrade
    if (!confirm("Bạn có chắc chắn muốn nâng cấp tài khoản lên Chủ nhà (Owner)?")) return;
    
    setLoading(true);
    try {
      await authApi.becomeHost();
      const refreshData = await authApi.refreshToken();
      localStorage.setItem('token', refreshData.access_token);
      localStorage.setItem('user', JSON.stringify(refreshData.user));
      setUser(refreshData.user);
      alert("Chúc mừng! Tài khoản của bạn đã được nâng cấp lên Chủ nhà. Hãy bắt đầu đăng tải sản phẩm của mình.");
      router.push("/admin");
    } catch (err) {
      alert("Lỗi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (loading) return "Đang xử lý...";
    if (!user) return "Bắt đầu ngay";
    if (user.role === 'ADMIN' || user.role === 'OWNER') return "Vào trang quản trị";
    return "Nâng cấp tài khoản ngay";
  };

  const features = [
    {
      icon: <Globe size={32} />,
      title: "Tiếp cận hàng triệu du khách",
      desc: "VietJourney kết nối bạn với cộng đồng du khách đam mê khám phá văn hóa và trải nghiệm cảm xúc."
    },
    {
      icon: <TrendingUp size={32} />,
      title: "Tăng doanh thu bền vững",
      desc: "Công cụ quản lý thông minh giúp bạn tối ưu giá phòng và lịch trình tour một cách dễ dàng."
    },
    {
      icon: <ShieldCheck size={32} />,
      title: "Hỗ trợ & Bảo mật 24/7",
      desc: "Chúng tôi luôn đồng hành để bảo vệ quyền lợi và hỗ trợ kỹ thuật cho các đối tác của mình."
    }
  ];

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <style jsx>{`
        .hero-section { padding: 100px 20px; }
        .hero-title { fontSize: 48px; }
        .features-grid { 
          display: grid; 
          grid-template-columns: repeat(3, 1fr); 
          gap: 40px; 
        }
        .steps-grid { 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 80px; 
          align-items: center; 
        }
        @media (max-width: 1024px) {
          .steps-grid { gap: 40px; }
        }
        @media (max-width: 768px) {
          .hero-section { padding: 60px 20px; }
          .hero-title { font-size: 32px !important; }
          .features-grid { grid-template-columns: 1fr; gap: 24px; }
          .steps-grid { grid-template-columns: 1fr; gap: 40px; }
          .cta-box { padding: 40px 24px !important; }
        }
      `}</style>
      <Navbar />
      <div style={{ height: "72px" }}></div>

      {/* Hero Section */}
      <section className="hero-section" style={{
        background: "linear-gradient(135deg, #0d9488 0%, #064e3b 100%)",
        color: "#fff",
        textAlign: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: "-50%", left: "-20%", width: "600px", height: "600px", background: "rgba(255,255,255,0.05)", borderRadius: "50%", blur: "80px" }}></div>
        <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 2 }}>
          <h1 className="hero-title" style={{ fontWeight: 800, marginBottom: "24px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Kinh doanh dễ dàng cùng VietJourney
          </h1>
          <p style={{ fontSize: "18px", opacity: 0.9, marginBottom: "40px", lineHeight: 1.6 }}>
            Trở thành đối tác để chia sẻ những homestay xinh xắn hoặc những tour du lịch độc bản của bạn đến với thế giới.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={handleAction}
              disabled={loading}
              style={{ padding: "18px 40px", borderRadius: "14px", border: "none", background: "#fff", color: "#0d9488", fontWeight: 800, fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", opacity: loading ? 0.7 : 1 }}
            >
              {loading && <Loader2 size={20} className="animate-spin" />}
              {getButtonText()} {(!loading && (!user || user.role === 'USER')) ? <ArrowRight size={20} /> : <LayoutDashboard size={20} />}
            </button>
            {!user && (
              <button 
                onClick={() => router.push("/login")}
                style={{ padding: "18px 40px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.1)", color: "#fff", fontWeight: 700, fontSize: "16px", cursor: "pointer", backdropFilter: "blur(10px)" }}
              >
                Đăng nhập
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "100px 20px", maxWidth: "1240px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <h2 style={{ fontSize: "32px", fontWeight: 800, color: "#0f172a", marginBottom: "16px" }}>Tại sao nên chọn chúng tôi?</h2>
          <p style={{ color: "#64748b", fontSize: "18px" }}>Chúng tôi cung cấp mọi công cụ bạn cần để thành công.</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} style={{ padding: "40px", borderRadius: "24px", border: "1px solid #f1f5f9", transition: "all 0.3s", background: "#fff" }}>
              <div style={{ color: "#0d9488", marginBottom: "24px" }}>{f.icon}</div>
              <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", marginBottom: "16px" }}>{f.title}</h3>
              <p style={{ color: "#64748b", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps Section */}
      <section style={{ padding: "80px 20px", background: "#f8fafc" }}>
        <div className="steps-grid" style={{ maxWidth: "1240px", margin: "0 auto" }}>
          <div>
            <h2 style={{ fontSize: "36px", fontWeight: 800, color: "#0f172a", marginBottom: "32px" }}>
              3 bước đơn giản để <br />bắt đầu kinh doanh
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              {[
                { step: "01", title: "Đăng ký tài khoản Đối tác", desc: "Chỉ mất 2 phút để tạo hồ sơ và xác thực thông tin cơ bản." },
                { step: "02", title: "Đăng tải dịch vụ", desc: "Thêm hình ảnh, mô tả và giá cho homestay hoặc tour của bạn." },
                { step: "03", title: "Đón những vị khách đầu tiên", desc: "Nhận yêu cầu đặt chỗ và bắt đầu hành trình kinh doanh của bạn." }
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: "24px" }}>
                  <div style={{ fontSize: "24px", fontWeight: 900, color: "#0d9488", opacity: 0.3 }}>{s.step}</div>
                  <div>
                    <h4 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>{s.title}</h4>
                    <p style={{ color: "#64748b" }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <img
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80"
              style={{ width: "100%", borderRadius: "32px", boxShadow: "0 30px 60px rgba(0,0,0,0.1)" }}
              alt="Partnership"
            />
            <div style={{ position: "absolute", bottom: "-30px", right: "-30px", background: "#fff", padding: "24px", borderRadius: "24px", boxShadow: "0 20px 40px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#dcfce7", color: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CheckCircle2 size={24} />
              </div>
              <div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>+500</div>
                <div style={{ fontSize: "13px", color: "#64748b", fontWeight: 600 }}>Đối tác tin dùng</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 20px", textAlign: "center" }}>
        <div className="cta-box" style={{ maxWidth: "800px", margin: "0 auto", padding: "64px", borderRadius: "32px", background: "#0f172a", color: "#fff" }}>
          <h2 style={{ fontSize: "32px", fontWeight: 800, marginBottom: "24px" }}>Bạn đã sẵn sàng bứt phá?</h2>
          <p style={{ fontSize: "18px", opacity: 0.8, marginBottom: "40px" }}>Đăng ký ngay hôm nay để nhận ưu đãi miễn phí hoa hồng trong 3 tháng đầu tiên.</p>
          <button
            onClick={handleAction}
            disabled={loading}
            style={{ padding: "18px 40px", borderRadius: "14px", border: "none", background: "#0d9488", color: "#fff", fontWeight: 800, fontSize: "16px", cursor: "pointer", opacity: loading ? 0.7 : 1 }}
          >
            {getButtonText()}
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
