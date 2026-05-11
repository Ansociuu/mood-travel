"use client";
import { useState } from "react";
import { 
  Camera, X, Save, ArrowLeft, 
  MapPin, Info, Settings, Tag,
  Clock, Plus, Calendar, List
} from "lucide-react";
import { uploadApi } from "@/lib/api";

const MOOD_TAGS = ["Lãng mạn", "Yên bình", "Phiêu lưu", "Gia đình", "Sang trọng", "Gần gũi thiên nhiên", "Thể thao", "Văn hóa"];

export default function AdminTourForm({ initialData, onSubmit, loading }) {
  const [formData, setFormData] = useState(initialData || {
    name: "",
    description: "",
    location: "",
    durationDays: 1,
    durationNights: 0,
    basePrice: 0,
    images: [],
    moodTags: [],
    itineraries: [],
    availability: []
  });
  const [uploading, setUploading] = useState(false);

  // Itinerary handlers
  const addItineraryDay = () => {
    const nextDay = formData.itineraries.length + 1;
    setFormData({
      ...formData,
      itineraries: [...formData.itineraries, { dayNumber: nextDay, title: "", description: "" }]
    });
  };

  const updateItinerary = (index, field, value) => {
    const newItineraries = [...formData.itineraries];
    newItineraries[index][field] = value;
    setFormData({ ...formData, itineraries: newItineraries });
  };

  const removeItinerary = (index) => {
    const newItineraries = formData.itineraries.filter((_, i) => i !== index)
      .map((item, i) => ({ ...item, dayNumber: i + 1 }));
    setFormData({ ...formData, itineraries: newItineraries });
  };

  // Image handlers
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
    <form onSubmit={handleSubmit} style={{ maxWidth: "1200px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "32px" }}>
        
        {/* LEFT COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* BASIC INFO */}
          <div style={{ background: "#fff", padding: "32px", borderRadius: "24px", border: "1px solid rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
              <Info size={20} color="#0d9488" /> Thông tin cơ bản
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Tên Tour</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Tour Khám Phá Vịnh Hạ Long 2 Ngày 1 Đêm"
                  required
                  style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none", fontSize: "15px" }}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Địa điểm</label>
                  <input 
                    type="text" 
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Quảng Ninh"
                    required
                    style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none", fontSize: "15px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Số ngày</label>
                  <input 
                    type="number" 
                    value={formData.durationDays}
                    onChange={e => setFormData({ ...formData, durationDays: parseInt(e.target.value) })}
                    min="1"
                    style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none", fontSize: "15px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Số đêm</label>
                  <input 
                    type="number" 
                    value={formData.durationNights}
                    onChange={e => setFormData({ ...formData, durationNights: parseInt(e.target.value) })}
                    min="0"
                    style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none", fontSize: "15px" }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Mô tả tổng quát</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: "100%", height: "150px", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none", fontSize: "15px", resize: "none" }}
                />
              </div>
            </div>
          </div>

          {/* ITINERARY */}
          <div style={{ background: "#fff", padding: "32px", borderRadius: "24px", border: "1px solid rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", display: "flex", alignItems: "center", gap: "10px" }}>
                <List size={20} color="#0d9488" /> Lịch trình chi tiết
              </h3>
              <button 
                type="button" 
                onClick={addItineraryDay}
                style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "100px", background: "rgba(13,148,136,0.1)", color: "#0d9488", border: "none", fontWeight: 700, cursor: "pointer" }}
              >
                <Plus size={16} /> Thêm ngày
              </button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {formData.itineraries.map((day, index) => (
                <div key={index} style={{ padding: "24px", background: "#f8fafc", borderRadius: "20px", border: "1px solid #e2e8f0", position: "relative" }}>
                  <button 
                    type="button" 
                    onClick={() => removeItinerary(index)}
                    style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}
                  >
                    <X size={18} />
                  </button>
                  <div style={{ fontWeight: 800, color: "#0d9488", marginBottom: "16px", fontSize: "14px", textTransform: "uppercase" }}>NGÀY {day.dayNumber}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <input 
                      type="text" 
                      value={day.title}
                      onChange={e => updateItinerary(index, 'title', e.target.value)}
                      placeholder="Tiêu đề ngày (ví dụ: Hà Nội - Vịnh Hạ Long)"
                      style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none", fontSize: "14px", fontWeight: 700 }}
                    />
                    <textarea 
                      value={day.description}
                      onChange={e => updateItinerary(index, 'description', e.target.value)}
                      placeholder="Mô tả chi tiết các hoạt động trong ngày..."
                      style={{ width: "100%", height: "100px", padding: "12px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none", fontSize: "14px", resize: "none" }}
                    />
                  </div>
                </div>
              ))}
              {formData.itineraries.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8", fontSize: "14px", fontStyle: "italic" }}>Chưa có lịch trình nào được tạo.</div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* PRICING & MOOD */}
          <div style={{ background: "#fff", padding: "32px", borderRadius: "24px", border: "1px solid rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
              <Settings size={20} color="#0d9488" /> Cài đặt & Giá
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" }}>Giá cơ bản (VND)</label>
                <input 
                  type="number" 
                  value={formData.basePrice}
                  onChange={e => setFormData({ ...formData, basePrice: parseFloat(e.target.value) })}
                  style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none", fontSize: "18px", fontWeight: 800, color: "#0d9488" }}
                />
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

          {/* IMAGES */}
          <div style={{ background: "#fff", padding: "32px", borderRadius: "24px", border: "1px solid rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
              <Camera size={20} color="#0d9488" /> Hình ảnh
            </h3>
            <div style={{ gridTemplateColumns: "repeat(2, 1fr)", display: "grid", gap: "12px", marginBottom: "16px" }}>
              {formData.images.map((url, index) => (
                <div key={index} style={{ position: "relative", height: "100px", borderRadius: "12px", overflow: "hidden" }}>
                  <img src={url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button 
                    type="button"
                    onClick={() => {
                      const newImages = [...formData.images];
                      newImages.splice(index, 1);
                      setFormData({ ...formData, images: newImages });
                    }}
                    style={{ position: "absolute", top: "4px", right: "4px", background: "rgba(0,0,0,0.5)", color: "#fff", border: "none", width: "20px", height: "20px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <label style={{ height: "100px", border: "2px dashed #e2e8f0", borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#94a3b8" }}>
                <Plus size={20} />
                <span style={{ fontSize: "12px", fontWeight: 700 }}>Thêm ảnh</span>
                <input type="file" hidden multiple onChange={handleImageUpload} disabled={uploading} />
              </label>
            </div>
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
            <Save size={20} /> {loading ? "Đang lưu..." : "Lưu Tour"}
          </button>
        </div>
      </div>
    </form>
  );
}
