import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import { useAuth } from "../context/AuthContext";

export default function FlatDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [flat, setFlat] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ rating: 5, comment: "" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    API.get(`/flats/${id}`).then(({ data }) => setFlat(data));
    API.get(`/reviews/${id}`).then(({ data }) => setReviews(data));
  }, [id]);

  const handleBook = async () => {
    try {
      await API.post("/bookings", { flat_id: id });
      setMsg("Booking request sent!");
    } catch (e) {
      setMsg(e.response?.data?.message || "Booking failed");
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/reviews", { flat_id: id, ...form });
      setReviews((prev) => [...prev, data]);
      setForm({ rating: 5, comment: "" });
    } catch {
      setMsg("Failed to submit review");
    }
  };

  if (!flat) return <p style={{ textAlign: "center", marginTop: "40px" }}>Loading...</p>;

  return (
    <div style={styles.container}>
      {flat.image && (
        <img src={`http://localhost:5000/uploads/${flat.image}`} alt="flat" style={styles.img} />
      )}
      <h2>{flat.location}</h2>
      <p style={styles.meta}>Type: {flat.type} &nbsp;|&nbsp; Price: <strong>₹{flat.price}/month</strong></p>
      <p style={styles.desc}>{flat.description}</p>

      {msg && <p style={{ color: msg.includes("sent") ? "green" : "red" }}>{msg}</p>}

      {user && user.role === "tenant" && (
        <button style={styles.btn} onClick={handleBook}>Book This Flat</button>
      )}

      <hr style={{ margin: "24px 0" }} />
      <h3>Reviews</h3>
      {reviews.length === 0 && <p style={{ color: "#888" }}>No reviews yet.</p>}
      {reviews.map((r, i) => (
        <div key={i} style={styles.reviewCard}>
          <strong>{r.user_id?.name || "User"}</strong>
          <span style={styles.stars}> {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
          <p style={{ margin: "4px 0 0" }}>{r.comment}</p>
        </div>
      ))}

      {user && (
        <form onSubmit={handleReview} style={styles.reviewForm}>
          <h4>Leave a Review</h4>
          <select style={styles.input} value={form.rating}
            onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}>
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Stars</option>)}
          </select>
          <textarea style={{ ...styles.input, height: "70px" }} placeholder="Comment"
            value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
          <button style={styles.btn} type="submit">Submit Review</button>
        </form>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "700px", margin: "40px auto", padding: "0 16px" },
  img: { width: "100%", height: "300px", objectFit: "cover", borderRadius: "8px", marginBottom: "16px" },
  meta: { color: "#555", margin: "6px 0" },
  desc: { color: "#777", margin: "10px 0" },
  btn: { padding: "10px 24px", background: "#2c3e50", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", marginTop: "8px" },
  reviewCard: { background: "#f9f9f9", padding: "12px", borderRadius: "6px", marginBottom: "10px" },
  stars: { color: "#f39c12" },
  reviewForm: { display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" },
  input: { padding: "10px", fontSize: "1rem", borderRadius: "4px", border: "1px solid #ccc", resize: "vertical" },
};
