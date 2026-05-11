"use client";
import { useState, useEffect } from "react";
import { 
  Star, MessageSquare, User, 
  Calendar, Reply, CheckCircle, 
  Clock, Filter, Search
} from "lucide-react";
import { reviewsApi } from "@/lib/api";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState({});
  const [submitting, setSubmitting] = useState({});
  const [filterRating, setFilterRating] = useState("ALL");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await reviewsApi.getOwnerReviews();
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (reviewId) => {
    if (!replyText[reviewId]?.trim()) return;

    setSubmitting({ ...submitting, [reviewId]: true });
    try {
      await reviewsApi.reply(reviewId, replyText[reviewId]);
      setReviews(reviews.map(r => 
        r.id === reviewId ? { ...r, reply: replyText[reviewId], repliedAt: new Date() } : r
      ));
      setReplyText({ ...replyText, [reviewId]: "" });
    } catch (err) {
      alert("Lỗi: " + err.message);
    } finally {
      setSubmitting({ ...submitting, [reviewId]: false });
    }
  };

  const filteredReviews = reviews.filter(r => {
    if (filterRating === "ALL") return true;
    return r.rating === parseInt(filterRating);
  });

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>Quản lý Đánh giá</h1>
        <p style={{ color: "#64748b", fontWeight: 500 }}>Lắng nghe và phản hồi ý kiến từ khách hàng để cải thiện dịch vụ.</p>
      </div>

      {/* FILTERS */}
      <div style={{ background: "#fff", padding: "20px", borderRadius: "20px", border: "1px solid rgba(0,0,0,0.05)", marginBottom: "32px", display: "flex", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 600, color: "#64748b" }}>
          <Filter size={18} /> Lọc theo:
        </div>
        <select 
          value={filterRating}
          onChange={(e) => setFilterRating(e.target.value)}
          style={{ padding: "8px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", outline: "none", background: "#fff" }}
        >
          <option value="ALL">Tất cả số sao</option>
          <option value="5">5 sao</option>
          <option value="4">4 sao</option>
          <option value="3">3 sao</option>
          <option value="2">2 sao</option>
          <option value="1">1 sao</option>
        </select>
      </div>

      {/* REVIEWS LIST */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>Đang tải đánh giá...</div>
        ) : filteredReviews.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center", color: "#94a3b8", background: "#fff", borderRadius: "24px", border: "1px solid rgba(0,0,0,0.05)" }}>
            Chưa có đánh giá nào.
          </div>
        ) : filteredReviews.map((review) => (
          <div key={review.id} style={{ background: "#fff", borderRadius: "24px", padding: "32px", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <div style={{ display: "flex", gap: "16px" }}>
                <img src={review.user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"} style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover" }} />
                <div>
                  <div style={{ fontWeight: 800, color: "#0f172a", fontSize: "16px" }}>{review.user.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#64748b" }}>
                    <div style={{ display: "flex", gap: "2px" }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < review.rating ? "#f59e0b" : "#e2e8f0"} color={i < review.rating ? "#f59e0b" : "#e2e8f0"} />
                      ))}
                    </div>
                    • {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>Đánh giá cho</div>
                <div style={{ fontSize: "14px", fontWeight: 800, color: "#0d9488" }}>{review.hotel?.name || review.tour?.name}</div>
              </div>
            </div>

            <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "16px", marginBottom: "24px", color: "#334155", lineHeight: "1.6" }}>
              {review.comment}
            </div>

            {review.reply ? (
              <div style={{ marginLeft: "40px", padding: "20px", borderRadius: "16px", background: "rgba(13,148,136,0.05)", border: "1px solid rgba(13,148,136,0.1)", position: "relative" }}>
                <div style={{ position: "absolute", left: "-20px", top: "20px", width: "20px", height: "2px", background: "rgba(13,148,136,0.1)" }}></div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", color: "#0d9488", fontWeight: 700, fontSize: "14px" }}>
                  <Reply size={16} /> Bạn đã phản hồi
                  <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 500 }}>
                    • {new Date(review.repliedAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div style={{ color: "#475569", fontSize: "14px" }}>{review.reply}</div>
              </div>
            ) : (
              <div style={{ marginLeft: "40px" }}>
                <div style={{ display: "flex", gap: "12px" }}>
                  <textarea 
                    placeholder="Viết phản hồi của bạn..."
                    value={replyText[review.id] || ""}
                    onChange={(e) => setReplyText({ ...replyText, [review.id]: e.target.value })}
                    style={{ flex: 1, padding: "16px", borderRadius: "16px", border: "1px solid #e2e8f0", outline: "none", fontSize: "14px", minHeight: "80px", resize: "none" }}
                  />
                  <button 
                    onClick={() => handleReply(review.id)}
                    disabled={!replyText[review.id]?.trim() || submitting[review.id]}
                    style={{ 
                      alignSelf: "flex-end", padding: "12px 24px", borderRadius: "12px", background: "#0d9488", color: "#fff", 
                      fontWeight: 700, border: "none", cursor: "pointer", transition: "all 0.2s",
                      opacity: (!replyText[review.id]?.trim() || submitting[review.id]) ? 0.5 : 1
                    }}
                  >
                    {submitting[review.id] ? "Đang gửi..." : "Gửi phản hồi"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
