"use client";
import { useState } from "react";
import { Camera, X, Save, Plus, Trash2, MapPin, Info, Settings, Tag, Upload, Home, Link, List, CheckCircle2, Smile, Coffee, Compass, Heart, Leaf, CloudRain } from "lucide-react";
import { uploadApi } from "@/lib/api";

const HOTEL_TYPES = ["HOTEL", "VILLA", "HOMESTAY", "RESORT"];
const MOOD_TAGS = [
  { id: "Happy", label: "Vui vẻ", icon: Smile, color: "#facc15" },
  { id: "Relaxed", label: "Thư giãn", icon: Coffee, color: "#2dd4bf" },
  { id: "Adventurous", label: "Khám phá", icon: Compass, color: "#f43f5e" },
  { id: "Romantic", label: "Lãng mạn", icon: Heart, color: "#f472b6" },
  { id: "Peaceful", label: "Yên bình", icon: Leaf, color: "#60a5fa" },
  { id: "Melancholy", label: "Tâm trạng", icon: CloudRain, color: "#94a3b8" },
];
const ROOM_TYPES = ["Single", "Double", "Twin", "Triple", "Deluxe", "Suite", "Family", "Bungalow", "Villa"];
const ROOM_TYPE_DEFAULTS = {
  Single: { capacity: 1 },
  Double: { capacity: 2 },
  Twin: { capacity: 2 },
  Triple: { capacity: 3 },
  Deluxe: { capacity: 2 },
  Suite: { capacity: 2 },
  Family: { capacity: 4 },
  Bungalow: { capacity: 2 },
  Villa: { capacity: 6 },
};
const DEFAULT_ROOM = { name: "", description: "", type: "Double", basePrice: 500000, capacity: 2, bathrooms: 1, totalRooms: 1, images: [] };

const PRESET_AMENITIES = [
  { id: "Wifi", icon: "Wifi", label: "Wi-Fi miễn phí" },
  { id: "Coffee", icon: "Coffee", label: "Bếp / nấu ăn" },
  { id: "Tv", icon: "Tv", label: "TV cáp" },
  { id: "Car", icon: "Car", label: "Bãi đỗ xe" },
  { id: "Wind", icon: "Wind", label: "Máy lạnh" },
  { id: "Waves", icon: "Waves", label: "Hồ bơi" },
  { id: "Bath", icon: "Bath", label: "Bồn tắm" },
  { id: "CheckCircle2", icon: "CheckCircle2", label: "Bữa sáng bao gồm" },
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
].sort();

export default function AdminHotelForm({ initialData, onSubmit, loading }) {
  const [formData, setFormData] = useState(initialData || {
    name: "", description: "", address: "", city: "", country: "Việt Nam",
    type: "HOMESTAY", lat: null, lng: null, images: [], moodTags: [],
    policies: { checkIn: "14:00", checkOut: "12:00", cancellation: "", rules: [] },
    amenities: [],
    rooms: [{ ...DEFAULT_ROOM }]  // Mặc định 1 phòng — host chỉ cần điền giá
  });
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageTab, setImageTab] = useState("url");
  // Single combined coordinate field
  const [coordInput, setCoordInput] = useState(
    formData.lat && formData.lng ? `${formData.lat}, ${formData.lng}` : ""
  );
  const [coordError, setCoordError] = useState("");

  // ─── COORD PARSER + REVERSE GEOCODE ──────────────────────────
  const parseAndApplyCoords = async (value) => {
    setCoordInput(value);
    setCoordError("");
    const parts = value.trim().split(/[,\s]+/).filter(Boolean);
    if (parts.length >= 2) {
      const lat = parseFloat(parts[0]);
      const lng = parseFloat(parts[1]);
      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        setFormData(prev => ({ ...prev, lat, lng }));
        setCoordError("");
        // Reverse geocode via OpenStreetMap Nominatim (free, no API key needed)
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=vi`,
            { headers: { 'Accept-Language': 'vi,en' } }
          );
          const geo = await res.json();
          if (geo && geo.address) {
            const a = geo.address;
            // Build address string
            const street = [a.house_number, a.road, a.neighbourhood, a.quarter].filter(Boolean).join(', ');
            // Map province to dropdown list
            const rawProvince = a.city || a.town || a.county || a.state || '';
            const matchedProvince = VIETNAM_PROVINCES.find(p =>
              rawProvince.toLowerCase().includes(p.toLowerCase()) ||
              p.toLowerCase().includes(rawProvince.replace(/tỉnh |thành phố |city of /gi, '').toLowerCase().trim())
            );
            setFormData(prev => ({
              ...prev,
              lat, lng,
              address: street && !prev.address ? street : prev.address,
              city: matchedProvince || prev.city,
            }));
          }
        } catch (_) { /* silent fail - geocoding is best-effort */ }
        return;
      }
    }
    if (value.trim().length > 5) {
      setCoordError('Định dạng không hợp lệ. VD: 21.028511, 105.804817');
      setFormData(prev => ({ ...prev, lat: null, lng: null }));
    }
  };

  const getMapUrl = () => {
    if (formData.lat && formData.lng) {
      return `https://maps.google.com/maps?q=${formData.lat},${formData.lng}&z=15&output=embed`;
    }
    const q = [formData.address, formData.city, "Việt Nam"].filter(Boolean).join(", ");
    return `https://maps.google.com/maps?q=${encodeURIComponent(q || "Việt Nam")}&z=10&output=embed`;
  };

  // ─── IMAGES ──────────────────────────────────────────────────
  const addImageByUrl = () => {
    const url = imageUrl.trim();
    if (!url) return;
    if (!url.startsWith("http")) { alert("Vui lòng nhập URL hợp lệ (bắt đầu bằng http)"); return; }
    setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
    setImageUrl("");
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const results = await Promise.all(files.map(f => uploadApi.uploadImage(f)));
      setFormData(prev => ({ ...prev, images: [...prev.images, ...results.map(r => r.url)] }));
    } catch (err) { alert("Lỗi upload: " + err.message); }
    finally { setUploading(false); e.target.value = ""; }
  };

  const removeImage = (i) => setFormData(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }));

  // ─── AMENITIES ────────────────────────────────────
  const [customAmenity, setCustomAmenity] = useState("");
  const toggleAmenity = (amenity) => {
    const cur = formData.amenities || [];
    const exists = cur.find(a => a.id === amenity.id);
    setFormData(p => ({ ...p, amenities: exists ? cur.filter(a => a.id !== amenity.id) : [...cur, amenity] }));
  };
  const addCustomAmenity = () => {
    const label = customAmenity.trim();
    if (!label) return;
    const id = "custom_" + Date.now();
    setFormData(p => ({ ...p, amenities: [...(p.amenities || []), { id, icon: "CheckCircle2", label }] }));
    setCustomAmenity("");
  };
  const removeAmenity = (id) => setFormData(p => ({ ...p, amenities: (p.amenities || []).filter(a => a.id !== id) }));

  // ─── HOUSE RULES ────────────────────────────────
  const [newRule, setNewRule] = useState("");
  const addRule = () => {
    const rule = newRule.trim();
    if (!rule) return;
    setFormData(p => ({ ...p, policies: { ...(p.policies || {}), rules: [...(p.policies?.rules || []), rule] } }));
    setNewRule("");
  };
  const removeRule = (i) => setFormData(p => ({
    ...p,
    policies: { ...(p.policies || {}), rules: (p.policies?.rules || []).filter((_, idx) => idx !== i) }
  }));

  // ─── MOOD TAGS ──────────────────────────────────
  const toggleMoodTag = (tag) => {
    const current = formData.moodTags || [];
    setFormData(prev => ({
      ...prev,
      moodTags: current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag]
    }));
  };

  // ─── ROOMS ─────────────────────────────────────────
  const addRoom = () => setFormData(prev => ({ ...prev, rooms: [...(prev.rooms || []), { ...DEFAULT_ROOM }] }));
  const updateRoom = (i, field, value) => {
    const rooms = [...(formData.rooms || [])];
    const updated = { ...rooms[i], [field]: value };
    // Auto-fill capacity when room type changes
    if (field === 'type' && ROOM_TYPE_DEFAULTS[value]) {
      updated.capacity = ROOM_TYPE_DEFAULTS[value].capacity;
    }
    rooms[i] = updated;
    setFormData(prev => ({ ...prev, rooms }));
  };
  const removeRoom = (i) => setFormData(prev => ({ ...prev, rooms: prev.rooms.filter((_, idx) => idx !== i) }));

  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };

  // ─── STYLES ───────────────────────────────────────────────────
  const inp = {
    width: "100%", padding: "11px 14px", borderRadius: "10px", fontFamily: "inherit",
    border: "1.5px solid #e2e8f0", outline: "none", fontSize: "14px", color: "#0f172a",
    background: "#fff", transition: "border-color 0.2s", boxSizing: "border-box"
  };
  const lbl = { display: "block", fontSize: "12px", fontWeight: 700, color: "#64748b", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.4px" };
  const card = { background: "#fff", padding: "24px", borderRadius: "18px", border: "1px solid #f1f5f9", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" };
  const cardTitle = { fontSize: "15px", fontWeight: 800, color: "#0f172a", marginBottom: "18px", display: "flex", alignItems: "center", gap: "8px" };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "20px", alignItems: "start" }}>

        {/* ══════════ LEFT COLUMN ══════════ */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

          {/* BASIC INFO */}
          <div style={card}>
            <div style={cardTitle}><Info size={17} color="#0d9488" /> Thông tin cơ bản</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={lbl}>Tên cơ sở lưu trú *</label>
                <input style={inp} type="text" required placeholder="VD: Homestay Rừng Thông Sapa"
                  value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label style={lbl}>Mô tả chi tiết *</label>
                <textarea style={{ ...inp, height: "130px", resize: "vertical" }} required
                  placeholder="Giới thiệu không gian, tiện ích, điểm nổi bật..."
                  value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={lbl}>Loại hình *</label>
                  <select style={inp} value={formData.type} onChange={e => setFormData(p => ({ ...p, type: e.target.value }))}>
                    {HOTEL_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Quốc gia</label>
                  <input style={{ ...inp, background: "#f8fafc" }} value={formData.country}
                    onChange={e => setFormData(p => ({ ...p, country: e.target.value }))} />
                </div>
              </div>
            </div>
          </div>

          {/* LOCATION */}
          <div style={card}>
            <div style={cardTitle}><MapPin size={17} color="#0d9488" /> Vị trí</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={lbl}>Địa chỉ cụ thể *</label>
                <input style={inp} type="text" required placeholder="Số nhà, đường, phường/xã..."
                  value={formData.address} onChange={e => setFormData(p => ({ ...p, address: e.target.value }))} />
              </div>
              <div>
                <label style={lbl}>Tỉnh / Thành phố *</label>
                <select style={inp} required value={formData.city} onChange={e => setFormData(p => ({ ...p, city: e.target.value }))}>
                  <option value="">-- Chọn tỉnh/thành phố --</option>
                  {VIETNAM_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              {/* SMART COORD INPUT */}
              <div>
                <label style={lbl}>Tọa độ GPS</label>
                <input
                  style={{ ...inp, borderColor: coordError ? "#ef4444" : formData.lat ? "#0d9488" : "#e2e8f0" }}
                  type="text"
                  placeholder="Dán tọa độ từ Google Maps: 21.028511, 105.804817"
                  value={coordInput}
                  onChange={e => parseAndApplyCoords(e.target.value)}
                />
                {coordError ? (
                  <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "5px" }}>⚠ {coordError}</p>
                ) : formData.lat && formData.lng ? (
                  <p style={{ fontSize: "12px", color: "#0d9488", marginTop: "5px", fontWeight: 600 }}>
                    ✓ Đã xác định: {formData.lat.toFixed(5)}, {formData.lng.toFixed(5)}
                  </p>
                ) : (
                  <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "5px" }}>
                    💡 Vào <a href="https://maps.google.com" target="_blank" rel="noreferrer" style={{ color: "#0d9488" }}>Google Maps</a> → click chuột phải vào địa điểm → Copy tọa độ → dán vào đây
                  </p>
                )}
              </div>

              {/* MAP PREVIEW */}
              <div style={{ borderRadius: "12px", overflow: "hidden", border: "1.5px solid #e2e8f0", height: "230px" }}>
                <iframe width="100%" height="230" frameBorder="0" style={{ border: 0 }}
                  src={getMapUrl()} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            </div>
          </div>

          {/* POLICIES */}
          <div style={card}>
            <div style={cardTitle}><Settings size={17} color="#0d9488" /> Chính sách & Đặt phòng</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={lbl}>Giờ nhận phòng</label>
                <input style={inp} type="time" value={formData.policies?.checkIn || "14:00"}
                  onChange={e => setFormData(p => ({ ...p, policies: { ...(p.policies || {}), checkIn: e.target.value } }))} />
              </div>
              <div>
                <label style={lbl}>Giờ trả phòng</label>
                <input style={inp} type="time" value={formData.policies?.checkOut || "12:00"}
                  onChange={e => setFormData(p => ({ ...p, policies: { ...(p.policies || {}), checkOut: e.target.value } }))} />
              </div>
              <div style={{ gridColumn: "1/-1" }}>
                <label style={lbl}>Chính sách hủy phòng</label>
                <textarea style={{ ...inp, height: "72px", resize: "none" }}
                  placeholder="VD: Miễn phí hủy trước 48 giờ. Sau đó tính 100% giá trị đặt phòng."
                  value={formData.policies?.cancellation || ""}
                  onChange={e => setFormData(p => ({ ...p, policies: { ...(p.policies || {}), cancellation: e.target.value } }))} />
              </div>
            </div>
          </div>

        </div>

        {/* ══════════ RIGHT COLUMN ══════════ */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

          {/* MOOD TAGS */}
          <div style={card}>
            <div style={cardTitle}><Tag size={17} color="#0d9488" /> Tâm trạng phù hợp</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {MOOD_TAGS.map(({ id, label, icon: Icon, color }) => {
                const active = (formData.moodTags || []).includes(id);
                return (
                  <button key={id} type="button" onClick={() => toggleMoodTag(id)} style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    padding: "6px 14px", borderRadius: "100px", fontSize: "13px", fontWeight: 700,
                    cursor: "pointer", fontFamily: "inherit", transition: "all 0.18s", border: "1.5px solid",
                    background: active ? color : "transparent",
                    color: active ? "#fff" : "#64748b",
                    borderColor: active ? color : "#e2e8f0"
                  }}>
                    <Icon size={13} />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* IMAGES */}
          <div style={card}>
            <div style={cardTitle}><Camera size={17} color="#0d9488" /> Hình ảnh</div>

            {/* Tab */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
              {[
                { key: "url", Icon: Link, label: "Dán link URL" },
                { key: "upload", Icon: Upload, label: "Tải lên" },
              ].map(({ key, Icon, label }) => (
                <button key={key} type="button" onClick={() => setImageTab(key)} style={{
                  flex: 1, padding: "8px", borderRadius: "9px", border: "1.5px solid", fontFamily: "inherit",
                  fontWeight: 700, fontSize: "13px", cursor: "pointer", transition: "all 0.18s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                  background: imageTab === key ? "#0d9488" : "#fff",
                  color: imageTab === key ? "#fff" : "#64748b",
                  borderColor: imageTab === key ? "#0d9488" : "#e2e8f0"
                }}>
                  <Icon size={13} />
                  {label}
                </button>
              ))}
            </div>

            {imageTab === "url" && (
              <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
                <input style={{ ...inp, flex: 1 }} type="url" placeholder="https://..."
                  value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addImageByUrl())} />
                <button type="button" onClick={addImageByUrl} style={{
                  padding: "11px 14px", borderRadius: "10px", background: "#0d9488", color: "#fff",
                  border: "none", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap"
                }}>+ Thêm</button>
              </div>
            )}

            {imageTab === "upload" && (
              <label style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                height: "72px", border: "2px dashed #cbd5e1", borderRadius: "10px", cursor: "pointer",
                color: "#94a3b8", marginBottom: "14px"
              }}>
                <Upload size={18} />
                <span style={{ fontSize: "12px", fontWeight: 700, marginTop: "4px" }}>
                  {uploading ? "Đang tải lên..." : "Click để chọn ảnh"}
                </span>
                <input type="file" hidden multiple accept="image/*" onChange={handleImageUpload} disabled={uploading} />
              </label>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {formData.images.map((url, i) => (
                <div key={i} style={{ position: "relative", borderRadius: "10px", overflow: "hidden", aspectRatio: "16/9" }}>
                  <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={e => { e.target.style.background = "#f1f5f9"; }} />
                  <button type="button" onClick={() => removeImage(i)} style={{
                    position: "absolute", top: "4px", right: "4px", background: "rgba(0,0,0,0.55)",
                    color: "#fff", border: "none", width: "22px", height: "22px", borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
                  }}><X size={11} /></button>
                </div>
              ))}
            </div>
            {formData.images.length === 0 && (
              <p style={{ textAlign: "center", color: "#cbd5e1", fontSize: "13px", padding: "8px 0" }}>Chưa có ảnh nào</p>
            )}
          </div>

          {/* AMENITIES */}
          <div style={card}>
            <div style={cardTitle}><CheckCircle2 size={17} color="#0d9488" /> Tiện nghi</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
              {PRESET_AMENITIES.map(amenity => {
                const active = (formData.amenities || []).some(a => a.id === amenity.id);
                return (
                  <label key={amenity.id} style={{
                    display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px",
                    borderRadius: "10px", border: `1.5px solid ${active ? "#0d9488" : "#e2e8f0"}`,
                    background: active ? "rgba(13,148,136,0.04)" : "#fff", cursor: "pointer", transition: "all 0.18s"
                  }}>
                    <input type="checkbox" checked={active} onChange={() => toggleAmenity(amenity)}
                      style={{ accentColor: "#0d9488", width: "16px", height: "16px", cursor: "pointer" }} />
                    <span style={{ fontSize: "13px", fontWeight: 600, color: active ? "#0d9488" : "#475569" }}>{amenity.label}</span>
                  </label>
                );
              })}
            </div>
            <label style={lbl}>Thêm tiện nghi khác</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input style={{ ...inp, flex: 1 }} placeholder="VD: Sân vườn, Hầm rượu..."
                value={customAmenity} onChange={e => setCustomAmenity(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addCustomAmenity())} />
              <button type="button" onClick={addCustomAmenity} style={{
                padding: "11px 14px", borderRadius: "10px", background: "#0d9488", color: "#fff",
                border: "none", fontWeight: 700, cursor: "pointer", fontFamily: "inherit"
              }}>+ Thêm</button>
            </div>
            {(formData.amenities || []).filter(a => a.id.startsWith("custom_")).length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
                {(formData.amenities || []).filter(a => a.id.startsWith("custom_")).map(a => (
                  <span key={a.id} style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    padding: "4px 10px", borderRadius: "100px", background: "#f1f5f9",
                    fontSize: "13px", fontWeight: 600, color: "#475569"
                  }}>
                    {a.label}
                    <button type="button" onClick={() => removeAmenity(a.id)} style={{
                      background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0, lineHeight: 1
                    }}><X size={12} /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* HOUSE RULES */}
          <div style={card}>
            <div style={cardTitle}><List size={17} color="#0d9488" /> Nội quy nhà</div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              <input style={{ ...inp, flex: 1 }} placeholder="VD: Không hút thuốc trong phòng"
                value={newRule} onChange={e => setNewRule(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addRule())} />
              <button type="button" onClick={addRule} style={{
                padding: "11px 14px", borderRadius: "10px", background: "#0d9488", color: "#fff",
                border: "none", fontWeight: 700, cursor: "pointer", fontFamily: "inherit"
              }}>+ Thêm</button>
            </div>
            {(formData.policies?.rules || []).length === 0 ? (
              <p style={{ fontSize: "13px", color: "#cbd5e1", textAlign: "center", padding: "12px 0" }}>Chưa có nội quy nào. Nhấp &quot;+ Thêm&quot; để bắt đầu.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                {(formData.policies?.rules || []).map((rule, i) => (
                  <li key={i} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "9px 12px", borderRadius: "10px", background: "#f8fafc",
                    border: "1px solid #f1f5f9", fontSize: "14px", fontWeight: 500, color: "#475569"
                  }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#0d9488", flexShrink: 0 }} />
                      {rule}
                    </span>
                    <button type="button" onClick={() => removeRule(i)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: 0 }}>
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ROOMS */}
          <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <div style={cardTitle}><Home size={17} color="#0d9488" /> Loại phòng</div>
              <button type="button" onClick={addRoom} style={{
                display: "flex", alignItems: "center", gap: "5px", padding: "7px 14px", borderRadius: "9px",
                background: "rgba(13,148,136,0.08)", color: "#0d9488", border: "1px solid rgba(13,148,136,0.2)",
                fontWeight: 700, cursor: "pointer", fontSize: "13px", fontFamily: "inherit"
              }}><Plus size={14} /> Thêm phòng</button>
            </div>

            {(!formData.rooms || formData.rooms.length === 0) ? (
              <div style={{ textAlign: "center", padding: "28px", color: "#94a3b8", fontSize: "13px", background: "#f8fafc", borderRadius: "10px", border: "1.5px dashed #e2e8f0" }}>
                Chưa có loại phòng. Nhấn "+ Thêm phòng" để bắt đầu.
              </div>
            ) : formData.rooms.map((room, idx) => (
              <div key={idx} style={{ padding: "16px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span style={{ fontWeight: 800, color: "#0d9488", fontSize: "12px", letterSpacing: "0.4px" }}>PHÒNG {idx + 1}</span>
                  <button type="button" onClick={() => removeRoom(idx)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: 0 }}>
                    <Trash2 size={15} />
                  </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {/* Tên phòng - full width */}
                  <div style={{ gridColumn: "1/-1" }}>
                    <label style={lbl}>Tên phòng *</label>
                    <input style={inp} type="text" required placeholder="VD: Phòng Deluxe View Núi"
                      value={room.name} onChange={e => updateRoom(idx, "name", e.target.value)} />
                  </div>

                  {/* Loại phòng + Sức chứa: liên quan nhau */}
                  <div>
                    <label style={lbl}>Loại phòng</label>
                    <select style={inp} value={room.type || "Double"}
                      onChange={e => updateRoom(idx, "type", e.target.value)}>
                      {ROOM_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ ...lbl }}>
                      Sức chứa
                    </label>
                    <div style={{ position: "relative" }}>
                      <input style={{ ...inp, paddingRight: "48px" }} type="number" min="1" max="20"
                        value={room.capacity} onChange={e => updateRoom(idx, "capacity", parseInt(e.target.value) || 1)} />
                      <span style={{
                        position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                        fontSize: "12px", color: "#94a3b8", fontWeight: 600, pointerEvents: "none"
                      }}>khách</span>
                    </div>
                  </div>
                  <div>
                    <label style={lbl}>Số phòng tắm</label>
                    <div style={{ position: "relative" }}>
                      <input style={{ ...inp, paddingRight: "60px" }} type="number" min="1" max="10"
                        value={room.bathrooms ?? 1} onChange={e => updateRoom(idx, "bathrooms", parseInt(e.target.value) || 1)} />
                      <span style={{
                        position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                        fontSize: "12px", color: "#94a3b8", fontWeight: 600, pointerEvents: "none"
                      }}>phòng</span>
                    </div>
                  </div>

                  {/* Giá + Số lượng */}
                  <div>
                    <label style={lbl}>Giá/đêm (VNĐ) *</label>
                    <input style={inp} type="number" min="0" required
                      value={room.basePrice} onChange={e => updateRoom(idx, "basePrice", parseFloat(e.target.value) || 0)} />
                  </div>
                  <div>
                    <label style={lbl}>Số lượng phòng</label>
                    <input style={inp} type="number" min="1"
                      value={room.totalRooms} onChange={e => updateRoom(idx, "totalRooms", parseInt(e.target.value) || 1)} />
                  </div>

                  {/* Mô tả */}
                  <div style={{ gridColumn: "1/-1" }}>
                    <label style={lbl}>Mô tả phòng</label>
                    <textarea style={{ ...inp, height: "60px", resize: "none" }}
                      placeholder="Tiện nghi, view, diện tích..."
                      value={room.description || ""} onChange={e => updateRoom(idx, "description", e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SUBMIT */}
          <button type="submit" disabled={loading || uploading} style={{
            width: "100%", padding: "15px", borderRadius: "14px", border: "none", fontFamily: "inherit",
            background: loading ? "#94a3b8" : "linear-gradient(135deg, #0d9488, #059669)",
            color: "#fff", fontSize: "16px", fontWeight: 800, cursor: loading ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
            boxShadow: "0 6px 20px rgba(13,148,136,0.25)", transition: "all 0.2s"
          }}>
            <Save size={20} />
            {loading ? "Đang lưu..." : "Lưu thông tin"}
          </button>
        </div>
      </div>
    </form>
  );
}
