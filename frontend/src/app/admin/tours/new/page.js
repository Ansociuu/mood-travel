"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AdminTourForm from "@/components/AdminTourForm";
import { toursApi } from "@/lib/api";

export default function NewTourPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      await toursApi.create(formData);
      alert("Tạo tour thành công!");
      router.push("/admin/tours");
    } catch (err) {
      alert("Lỗi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <Link 
          href="/admin/tours" 
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#64748b", textDecoration: "none", fontWeight: 700, fontSize: "14px", marginBottom: "16px" }}
        >
          <ArrowLeft size={16} /> Quay lại danh sách
        </Link>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a" }}>Thêm tour du lịch mới</h1>
      </div>

      <AdminTourForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
