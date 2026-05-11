"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AdminHotelForm from "@/components/AdminHotelForm";
import { hotelsApi } from "@/lib/api";

export default function NewHotelPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      await hotelsApi.create(formData);
      alert("Tạo cơ sở lưu trú thành công!");
      router.push("/admin/hotels");
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
          href="/admin/hotels" 
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#64748b", textDecoration: "none", fontWeight: 700, fontSize: "14px", marginBottom: "16px" }}
        >
          <ArrowLeft size={16} /> Quay lại danh sách
        </Link>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a" }}>Thêm cơ sở lưu trú mới</h1>
      </div>

      <AdminHotelForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
