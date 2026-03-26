import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Footer() {
  const { user } = useAuth();
  const isOwner = user?.role === "owner";
  const isTenant = user?.role === "tenant";

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>

        <div style={styles.brand}>
          <span style={styles.brandName}>🏠 FLATKART</span>
          <p style={styles.tagline}>Find your perfect flat, hassle-free.</p>
        </div>

        <div style={styles.col}>
          <h4 style={styles.colTitle}>Quick Links</h4>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/flats" style={styles.link}>Flats</Link>
          {!user && <Link to="/login" style={styles.link}>Login</Link>}
          {!user && <Link to="/register" style={styles.link}>Register</Link>}
          {user && <Link to="/chat" style={styles.link}>Chat</Link>}
        </div>

        <div style={styles.col}>
          <h4 style={styles.colTitle}>Account</h4>
          {isTenant && <Link to="/my-bookings" style={styles.link}>My Bookings</Link>}
          {isOwner && <Link to="/dashboard" style={styles.link}>Owner Dashboard</Link>}
          {user && <Link to="/change-password" style={styles.link}>Change Password</Link>}
          <Link to="/forgot-password" style={styles.link}>Forgot Password</Link>
        </div>

        <div style={styles.col}>
          <h4 style={styles.colTitle}>Contact</h4>
          <p style={styles.info}>📧 flatkart.support@gmail.com</p>
          <p style={styles.info}>📞 +91 9439074636</p>
          <p style={styles.info}>📍 Bhubaneswar, Odisha</p>
        </div>

      </div>

      <div style={styles.bottom}>
        <p style={styles.copy}>© {new Date().getFullYear()} FLATKART. All rights reserved.</p>
      </div>
    </footer>
  );
}

const styles = {
  footer: { background: "#1a252f", color: "#bdc3c7", marginTop: "auto" },
  container: { display: "flex", flexWrap: "wrap", gap: "32px", justifyContent: "space-between", padding: "40px 48px 24px" },
  brand: { display: "flex", flexDirection: "column", gap: "8px", maxWidth: "220px" },
  brandName: { color: "#fff", fontWeight: "700", fontSize: "1.2rem" },
  tagline: { margin: 0, fontSize: "0.88rem", color: "#95a5a6", lineHeight: "1.5" },
  col: { display: "flex", flexDirection: "column", gap: "8px" },
  colTitle: { margin: "0 0 4px", color: "#fff", fontSize: "0.95rem", fontWeight: "600" },
  link: { color: "#95a5a6", textDecoration: "none", fontSize: "0.88rem" },
  info: { margin: 0, fontSize: "0.88rem", color: "#95a5a6" },
  bottom: { borderTop: "1px solid rgba(255,255,255,0.08)", padding: "16px 48px", textAlign: "center" },
  copy: { margin: 0, fontSize: "0.82rem", color: "#636e72" },
};
