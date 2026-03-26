import { useState, useEffect } from "react";
import API from "../api";

const statusColor = { pending: "#f39c12", approved: "#27ae60", rejected: "#e74c3c" };

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    API.get("/bookings/my").then(({ data }) => setBookings(data));
  }, []);

  return (
    <div style={styles.container}>
      <h2>My Bookings</h2>
      {bookings.length === 0 ? (
        <p style={{ color: "#888" }}>No bookings yet.</p>
      ) : (
        bookings.map((b) => (
          <div key={b._id} style={styles.card}>
            <h3>{b.flat_id?.location || "Flat"}</h3>
            <p style={styles.meta}>Type: {b.flat_id?.type} &nbsp;|&nbsp; Price: ₹{b.flat_id?.price}/month</p>
            <p>Status: <strong style={{ color: statusColor[b.status] }}>{b.status}</strong></p>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "700px", margin: "40px auto", padding: "0 16px" },
  card: { border: "1px solid #ddd", borderRadius: "8px", padding: "16px", marginBottom: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" },
  meta: { color: "#555", margin: "4px 0" },
};
