"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AdminTourForm from "@/components/AdminTourForm";
import { toursApi } from "@/lib/api";

export default function EditTourPage() {
  const router = useRouter();
  const params = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const data = await toursApi.getById(params.id);
        setTour(data);
      } catch (err) {
        alert("Lỗi: " + err.message);
        router.push("/admin/tours");
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [params.id, router]);

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      await toursApi.update(params.id, formData);
      alert("Cập nhật tour thành công!");
      router.push("/admin/tours");
    } catch (err) {
      alert("Lỗi: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Đang tải thông tin tour...</div>;

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <Link 
          href="/admin/tours" 
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#64748b", textDecoration: "none", fontWeight: 700, fontSize: "14px", marginBottom: "16px" }}
        >
          <ArrowLeft size={16} /> Quay lại danh sách
        </Link>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a" }}>Chỉnh sửa Tour: {tour?.name}</h1>
      </div>

      <AdminTourForm initialData={tour} onSubmit={handleSubmit} loading={saving} />
    </div>
  );
}
