"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AdminHotelForm from "@/components/AdminHotelForm";
import { hotelsApi } from "@/lib/api";

export default function EditHotelPage() {
  const router = useRouter();
  const params = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const data = await hotelsApi.getById(params.id);
        setHotel(data);
      } catch (err) {
        alert("Lỗi: " + err.message);
        router.push("/admin/hotels");
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [params.id, router]);

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      await hotelsApi.update(params.id, formData);
      alert("Cập nhật thành công!");
      router.push("/admin/hotels");
    } catch (err) {
      alert("Lỗi: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Đang tải thông tin...</div>;

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <Link 
          href="/admin/hotels" 
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#64748b", textDecoration: "none", fontWeight: 700, fontSize: "14px", marginBottom: "16px" }}
        >
          <ArrowLeft size={16} /> Quay lại danh sách
        </Link>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a" }}>Chỉnh sửa: {hotel?.name}</h1>
      </div>

      <AdminHotelForm initialData={hotel} onSubmit={handleSubmit} loading={saving} />
    </div>
  );
}
