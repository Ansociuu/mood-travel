"use client";
import { useState } from "react";
import { 
  Camera, X, Save, ArrowLeft, 
  MapPin, Info, Settings, Tag 
} from "lucide-react";
import { uploadApi } from "@/lib/api";

const HOTEL_TYPES = ["HOTEL", "VILLA", "HOMESTAY", "RESORT"];
const MOOD_TAGS = ["Lãng mạn", "Yên bình", "Phiêu lưu", "Gia đình", "Sang trọng", "Gần gũi thiên nhiên"];

export default function AdminHotelForm({ initialData, onSubmit, loading }) {
  const [formData, setFormData] = useState(initialData || {
    name: "",
    description: "",
    address: "",
    city: "",
    country: "Việt Nam",
    type: "HOMESTAY",
    images: [],
    moodTags: []
  });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    try {
      const uploadPromises = files.map(file => uploadApi.uploadImage(file));
      const results = await Promise.all(uploadPromises);
      const newUrls = results.map(res => res.url);
      setFormData({ ...formData, images: [...formData.images, ...newUrls] });
    } catch (err) {
      alert("Lỗi upload ảnh: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const toggleMoodTag = (tag) => {
    const currentTags = formData.moodTags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    setFormData({ ...formData, moodTags: newTags });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "1000px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "32px" }}>
        
        {/* LEFT COLUMN: BASIC INFO */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ background: "#fff", padding: "32px", borderRadius: "24px", border: "1px solid rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
              <Info size={20} color="#0d9488" /> Thông tin cơ bản
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Tên cơ sở lưu trú</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Homestay Rừng Thông Sapa"
                  required
                  style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none", fontSize: "15px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Mô tả chi tiết</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Giới thiệu về không gian, tiện ích, vị trí..."
                  required
                  style={{ width: "100%", height: "200px", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none", fontSize: "15px", resize: "none" }}
                />
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", padding: "32px", borderRadius: "24px", border: "1px solid rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
              <MapPin size={20} color="#0d9488" /> Vị trí
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Địa chỉ cụ thể</label>
                <input 
                  type="text" 
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Số nhà, tên đường, phường/xã..."
                  required
                  style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none", fontSize: "15px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Thành phố / Tỉnh</label>
                <input 
                  type="text" 
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Ví dụ: Lào Cai"
                  required
                  style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none", fontSize: "15px" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Quốc gia</label>
                <input 
                  type="text" 
                  value={formData.country}
                  onChange={e => setFormData({ ...formData, country: e.target.value })}
                  style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none", fontSize: "15px", background: "#f8fafc" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SETTINGS & IMAGES */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ background: "#fff", padding: "32px", borderRadius: "24px", border: "1px solid rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
              <Settings size={20} color="#0d9488" /> Cấu hình
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Loại hình</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none", fontSize: "15px", background: "#fff" }}
                >
                  {HOTEL_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "12px" }}>Tâm trạng phù hợp</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {MOOD_TAGS.map(tag => (
                    <button 
                      key={tag}
                      type="button"
                      onClick={() => toggleMoodTag(tag)}
                      style={{ 
                        padding: "6px 14px", 
                        borderRadius: "100px", 
                        fontSize: "13px", 
                        fontWeight: 700, 
                        cursor: "pointer", 
                        transition: "all 0.2s",
                        border: "1px solid",
                        background: (formData.moodTags || []).includes(tag) ? "#0d9488" : "transparent",
                        color: (formData.moodTags || []).includes(tag) ? "#fff" : "#64748b",
                        borderColor: (formData.moodTags || []).includes(tag) ? "#0d9488" : "#e2e8f0"
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", padding: "32px", borderRadius: "24px", border: "1px solid rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
              <Camera size={20} color="#0d9488" /> Hình ảnh
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", marginBottom: "16px" }}>
              {formData.images.map((url, index) => (
                <div key={index} style={{ position: "relative", height: "100px", borderRadius: "12px", overflow: "hidden" }}>
                  <img src={url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button 
                    type="button"
                    onClick={() => removeImage(index)}
                    style={{ position: "absolute", top: "4px", right: "4px", background: "rgba(0,0,0,0.5)", color: "#fff", border: "none", width: "20px", height: "20px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <label style={{ height: "100px", border: "2px dashed #e2e8f0", borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#94a3b8", transition: "all 0.2s" }}>
                <Plus size={20} />
                <span style={{ fontSize: "12px", fontWeight: 700, marginTop: "4px" }}>Thêm ảnh</span>
                <input type="file" hidden multiple onChange={handleImageUpload} disabled={uploading} />
              </label>
            </div>
            {uploading && <p style={{ fontSize: "12px", color: "#0d9488", fontWeight: 600 }}>Đang tải ảnh lên...</p>}
          </div>

          <button 
            type="submit" 
            disabled={loading || uploading}
            style={{ 
              width: "100%", 
              padding: "16px", 
              borderRadius: "16px", 
              border: "none", 
              background: "#0d9488", 
              color: "#fff", 
              fontSize: "16px", 
              fontWeight: 800, 
              cursor: "pointer", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              gap: "10px",
              boxShadow: "0 8px 24px rgba(13,148,136,0.2)"
            }}
          >
            <Save size={20} /> {loading ? "Đang lưu..." : "Lưu thông tin"}
          </button>
        </div>
      </div>
    </form>
  );
}
