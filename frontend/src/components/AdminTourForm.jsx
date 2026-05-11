"use client";
import { useState } from "react";
import { 
  Camera, X, Save, ArrowLeft, 
  MapPin, Info, Settings, Tag,
  Clock, Plus, Calendar, List,
  Smile, Coffee, Compass, Heart, Leaf, CloudRain,
  CheckCircle2, XCircle, Globe, DollarSign, Image as ImageIcon, Users
} from "lucide-react";
import { uploadApi, toursApi } from "@/lib/api";

const MOOD_TAGS = [
  { id: "Happy",       label: "Vui vẻ",   icon: Smile,     color: "#facc15" },
  { id: "Relaxed",     label: "Thư giãn",  icon: Coffee,    color: "#2dd4bf" },
  { id: "Adventurous", label: "Khám phá",  icon: Compass,   color: "#f43f5e" },
  { id: "Romantic",    label: "Lãng mạn",  icon: Heart,     color: "#f472b6" },
  { id: "Peaceful",    label: "Yên bình",  icon: Leaf,      color: "#60a5fa" },
  { id: "Melancholy",  label: "Tâm trạng", icon: CloudRain, color: "#94a3b8" },
];

const VIETNAM_PROVINCES = [
  "An Giang", "Bà Rịa - Vũng Tàu", "Bạc Liêu", "Bắc Giang", "Bắc Kạn", "Bắc Ninh",
  "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước", "Bình Thuận", "Cà Mau", "Cần Thơ",
  "Cao Bằng", "Đà Lạt", "Đà Nẵng", "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai",
  "Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam", "Hà Nội", "Hà Tĩnh", "Hải Dương",
  "Hải Phòng", "Hậu Giang", "Hòa Bình", "Hội An", "Hưng Yên", "Khánh Hòa", "Kiên Giang",
  "Kon Tum", "Lai Châu", "Lạng Sơn", "Lào Cai", "Lâm Đồng", "Long An", "Mũi Né", "Nam Định",
  "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Quốc", "Phú Thọ", "Phú Yên", "Quảng Bình",
  "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sapa", "Sóc Trăng", "Sơn La",
  "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang",
  "TP. Hồ Chí Minh", "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái",
];

export default function AdminTourForm({ initialData, onSubmit, loading }) {
  const [formData, setFormData] = useState(initialData || {
    name: "",
    description: "",
    location: "Đà Nẵng",
    durationDays: 1,
    durationNights: 0,
    basePrice: 500000,
    images: [],
    moodTags: [],
    itineraries: [{ dayNumber: 1, title: "", description: "", image: "" }],
    availability: [],
    includes: ["Hướng dẫn viên", "Xe đưa đón", "Vé tham quan"],
    excludes: ["Tiền tip", "Chi phí cá nhân"]
  });
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageTab, setImageTab] = useState("url");

  // Itinerary handlers
  const addItineraryDay = () => {
    const nextDay = formData.itineraries.length + 1;
    setFormData({
      ...formData,
      itineraries: [...formData.itineraries, { dayNumber: nextDay, title: "", description: "", image: "" }]
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

  // Includes / Excludes handlers
  const addInclude = () => setFormData({ ...formData, includes: [...(formData.includes || []), ""] });
  const updateInclude = (idx, val) => {
    const news = [...formData.includes];
    news[idx] = val;
    setFormData({ ...formData, includes: news });
  };
  const removeInclude = (idx) => setFormData({ ...formData, includes: formData.includes.filter((_, i) => i !== idx) });

  const addExclude = () => setFormData({ ...formData, excludes: [...(formData.excludes || []), ""] });
  const updateExclude = (idx, val) => {
    const news = [...formData.excludes];
    news[idx] = val;
    setFormData({ ...formData, excludes: news });
  };
  const removeExclude = (idx) => setFormData({ ...formData, excludes: formData.excludes.filter((_, i) => i !== idx) });

  // Availability handlers
  const addAvailability = () => {
    setFormData({ 
      ...formData, 
      availability: [...(formData.availability || []), { startDate: new Date().toISOString().split('T')[0], price: formData.basePrice, capacity: 10 }] 
    });
  };
  const updateAvail = (idx, field, val) => {
    const news = [...formData.availability];
    news[idx][field] = val;
    setFormData({ ...formData, availability: news });
  };
  const removeAvail = (idx) => setFormData({ ...formData, availability: formData.availability.filter((_, i) => i !== idx) });

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

  const addImageUrl = () => {
    if (!imageUrl) return;
    setFormData({ ...formData, images: [...formData.images, imageUrl] });
    setImageUrl("");
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

  // Styles
  const card = { background: "#fff", padding: "32px", borderRadius: "24px", border: "1px solid rgba(0,0,0,0.05)", marginBottom: "24px" };
  const cardTitle = { fontSize: "18px", fontWeight: 800, color: "#0f172a", marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" };
  const lbl = { display: "block", fontSize: "14px", fontWeight: 700, color: "#475569", marginBottom: "8px" };
  const inp = { width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", outline: "none", fontSize: "15px", transition: "all 0.2s" };
  const btnPrimary = { background: "#0d9488", color: "#fff", border: "none", padding: "16px", borderRadius: "16px", fontSize: "16px", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", boxShadow: "0 8px 24px rgba(13,148,136,0.2)" };
  const btnSecondary = { background: "rgba(13,148,136,0.08)", color: "#0d9488", border: "none", padding: "10px 20px", borderRadius: "100px", fontSize: "14px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "32px", alignItems: "start" }}>
        
        {/* CỘT TRÁI: THÔNG TIN CHÍNH */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          
          {/* Thông tin cơ bản */}
          <div style={card}>
            <h3 style={cardTitle}><Info size={20} color="#0d9488" /> Thông tin Tour</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={lbl}>Tên Tour *</label>
                <input style={inp} type="text" required value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Tour Khám Phá Vịnh Hạ Long 2 Ngày 1 Đêm" />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <label style={lbl}>Tỉnh / Thành phố *</label>
                  <select style={inp} required value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}>
                    {VIETNAM_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <label style={lbl}>Số ngày</label>
                    <input style={inp} type="number" min="1" value={formData.durationDays}
                      onChange={e => setFormData({ ...formData, durationDays: parseInt(e.target.value) || 1 })} />
                  </div>
                  <div>
                    <label style={lbl}>Số đêm</label>
                    <input style={inp} type="number" min="0" value={formData.durationNights}
                      onChange={e => setFormData({ ...formData, durationNights: parseInt(e.target.value) || 0 })} />
                  </div>
                </div>
              </div>

              <div>
                <label style={lbl}>Mô tả tổng quát</label>
                <textarea style={{ ...inp, height: "120px", resize: "none" }}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Chia sẻ những trải nghiệm thú vị của tour này..." />
              </div>
            </div>
          </div>

          {/* Bao gồm & Không bao gồm */}
          <div style={card}>
            <h3 style={cardTitle}><Globe size={20} color="#0d9488" /> Dịch vụ & Chính sách</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              <div>
                <label style={{ ...lbl, color: "#0d9488" }}>Bao gồm</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {(formData.includes || []).map((inc, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "8px" }}>
                      <input style={{ ...inp, padding: "8px 12px" }} value={inc} onChange={e => updateInclude(idx, e.target.value)} />
                      <button type="button" onClick={() => removeInclude(idx)} style={{ color: "#ef4444", border: "none", background: "none", cursor: "pointer" }}><X size={16} /></button>
                    </div>
                  ))}
                  <button type="button" onClick={addInclude} style={{ ...btnSecondary, padding: "6px 12px", width: "fit-content", marginTop: "4px" }}><Plus size={14} /> Thêm mục</button>
                </div>
              </div>
              <div>
                <label style={{ ...lbl, color: "#ef4444" }}>Không bao gồm</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {(formData.excludes || []).map((exc, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "8px" }}>
                      <input style={{ ...inp, padding: "8px 12px" }} value={exc} onChange={e => updateExclude(idx, e.target.value)} />
                      <button type="button" onClick={() => removeExclude(idx)} style={{ color: "#ef4444", border: "none", background: "none", cursor: "pointer" }}><X size={16} /></button>
                    </div>
                  ))}
                  <button type="button" onClick={addExclude} style={{ ...btnSecondary, color: "#ef4444", background: "rgba(239,68,68,0.08)", padding: "6px 12px", width: "fit-content", marginTop: "4px" }}><Plus size={14} /> Thêm mục</button>
                </div>
              </div>
            </div>
          </div>

          {/* Lịch trình chi tiết */}
          <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ ...cardTitle, marginBottom: 0 }}><List size={20} color="#0d9488" /> Lịch trình chi tiết</h3>
              <button type="button" onClick={addItineraryDay} style={btnSecondary}><Plus size={16} /> Thêm ngày</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {formData.itineraries.map((day, idx) => (
                <div key={idx} style={{ padding: "24px", background: "#f8fafc", borderRadius: "16px", border: "1px solid #e2e8f0", position: "relative" }}>
                  <button type="button" onClick={() => removeItinerary(idx)} style={{ position: "absolute", top: "16px", right: "16px", color: "#ef4444", border: "none", background: "none", cursor: "pointer" }}><X size={18} /></button>
                  <div style={{ fontWeight: 800, color: "#0d9488", marginBottom: "16px", fontSize: "13px" }}>NGÀY {day.dayNumber}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ ...lbl, fontSize: "12px" }}>Tiêu đề ngày *</label>
                        <input style={{ ...inp, fontWeight: 700 }} value={day.title} onChange={e => updateItinerary(idx, "title", e.target.value)} placeholder="VD: Hà Nội - Hạ Long" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ ...lbl, fontSize: "12px" }}>Ảnh minh họa *</label>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                          <div style={{ position: "relative", flex: 1 }}>
                            <input style={{ ...inp, paddingRight: "40px" }} value={day.image || ""} onChange={e => updateItinerary(idx, "image", e.target.value)} placeholder="Dán link hoặc tải lên..." />
                            <label style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#0d9488" }}>
                              <Camera size={18} />
                              <input type="file" hidden onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                try {
                                  const res = await uploadApi.uploadImage(file);
                                  updateItinerary(idx, "image", res.url);
                                } catch (err) {
                                  alert("Lỗi upload: " + err.message);
                                }
                              }} />
                            </label>
                          </div>
                          {day.image && (
                            <div style={{ width: "48px", height: "48px", borderRadius: "10px", overflow: "hidden", border: "2px solid #f1f5f9", flexShrink: 0, boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
                              <img src={day.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <textarea style={{ ...inp, height: "80px", resize: "none" }} value={day.description} onChange={e => updateItinerary(idx, "description", e.target.value)} placeholder="Mô tả chi tiết các hoạt động..." />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: GIÁ, LỊCH & TAGS */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          
          {/* Giá & Tâm trạng */}
          <div style={card}>
            <h3 style={cardTitle}><DollarSign size={20} color="#0d9488" /> Giá & Tâm trạng</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={lbl}>Giá cơ bản (người lớn) *</label>
                <div style={{ position: "relative" }}>
                  <input style={{ ...inp, fontSize: "18px", fontWeight: 800, color: "#0d9488" }} type="number"
                    value={formData.basePrice} onChange={e => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })} />
                  <span style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", fontWeight: 700, color: "#94a3b8" }}>₫</span>
                </div>
              </div>

              <div>
                <label style={lbl}>Tâm trạng phù hợp</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {MOOD_TAGS.map(({ id, label, icon: Icon, color }) => {
                    const active = (formData.moodTags || []).includes(id);
                    return (
                      <button key={id} type="button" onClick={() => toggleMoodTag(id)}
                        style={{
                          display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "100px", fontSize: "13px", fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
                          background: active ? color : "transparent",
                          color: active ? "#fff" : "#64748b",
                          border: `1.5px solid ${active ? color : "#e2e8f0"}`
                        }}>
                        <Icon size={14} /> {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Lịch khởi hành */}
          <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ ...cardTitle, marginBottom: 0 }}><Calendar size={20} color="#0d9488" /> Lịch khởi hành</h3>
              <button type="button" onClick={addAvailability} style={{ ...btnSecondary, padding: "6px 12px" }}><Plus size={14} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {formData.availability?.map((av, idx) => (
                <div key={idx} style={{ padding: "16px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0", display: "grid", gridTemplateColumns: "1.2fr 1fr 0.8fr 30px", gap: "10px", alignItems: "end" }}>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8" }}>Ngày đi</label>
                    <input style={{ ...inp, padding: "6px 10px", fontSize: "13px" }} type="date" value={av.startDate} onChange={e => updateAvail(idx, "startDate", e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8" }}>Giá</label>
                    <input style={{ ...inp, padding: "6px 10px", fontSize: "13px" }} type="number" value={av.price} onChange={e => updateAvail(idx, "price", parseFloat(e.target.value))} />
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8" }}>Chỗ</label>
                    <input style={{ ...inp, padding: "6px 10px", fontSize: "13px" }} type="number" value={av.capacity} onChange={e => updateAvail(idx, "capacity", parseInt(e.target.value))} />
                  </div>
                  <button type="button" onClick={() => removeAvail(idx)} style={{ color: "#ef4444", border: "none", background: "none", cursor: "pointer", marginBottom: "8px" }}><X size={14} /></button>
                </div>
              ))}
              {(!formData.availability || formData.availability.length === 0) && (
                <div style={{ textAlign: "center", padding: "12px", background: "#f8fafc", borderRadius: "12px", color: "#94a3b8", fontSize: "13px", fontStyle: "italic" }}>
                  Chưa có lịch. Mặc định dùng giá cơ bản.
                </div>
              )}
            </div>
          </div>

          {/* Hình ảnh */}
          <div style={card}>
            <h3 style={cardTitle}><Camera size={20} color="#0d9488" /> Hình ảnh</h3>
            
            <div style={{ display: "flex", gap: "2px", background: "#f1f5f9", padding: "4px", borderRadius: "12px", marginBottom: "16px" }}>
              <button type="button" onClick={() => setImageTab("url")} style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "none", background: imageTab === "url" ? "#fff" : "transparent", color: imageTab === "url" ? "#0f172a" : "#64748b", fontWeight: 700, fontSize: "12px", cursor: "pointer", transition: "all 0.2s" }}>Dán Link</button>
              <button type="button" onClick={() => setImageTab("upload")} style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "none", background: imageTab === "upload" ? "#fff" : "transparent", color: imageTab === "upload" ? "#0f172a" : "#64748b", fontWeight: 700, fontSize: "12px", cursor: "pointer", transition: "all 0.2s" }}>Tải lên</button>
            </div>

            {imageTab === "url" ? (
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                <input style={{ ...inp, padding: "10px 14px" }} value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Dán link ảnh tại đây..." />
                <button type="button" onClick={addImageUrl} style={{ background: "#0d9488", color: "#fff", border: "none", padding: "0 16px", borderRadius: "10px", cursor: "pointer" }}><Plus size={18} /></button>
              </div>
            ) : (
              <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "80px", border: "2px dashed #cbd5e1", borderRadius: "12px", cursor: "pointer", marginBottom: "16px", color: "#64748b" }}>
                <Camera size={24} />
                <span style={{ fontSize: "12px", fontWeight: 700, marginTop: "4px" }}>Chọn tệp tin</span>
                <input type="file" hidden multiple onChange={handleImageUpload} />
              </label>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
              {formData.images.map((url, idx) => (
                <div key={idx} style={{ position: "relative", paddingTop: "75%", borderRadius: "10px", overflow: "hidden", background: "#f8fafc" }}>
                  <img src={url} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  <button type="button" onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })}
                    style={{ position: "absolute", top: "4px", right: "4px", background: "rgba(0,0,0,0.5)", color: "#fff", border: "none", width: "20px", height: "20px", borderRadius: "50%", cursor: "pointer" }}><X size={12} /></button>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading || uploading} style={btnPrimary}>
            <Save size={20} /> {loading ? "Đang xử lý..." : "Lưu Tour ngay"}
          </button>
        </div>
      </div>
    </form>
  );
}
