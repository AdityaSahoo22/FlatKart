import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await API.post("/auth/login", form);
      login(data.token, data.user);
      toast.success("Login Successful! Welcome back 👋");
      navigate("/");
    } catch {
      setError("Invalid email or password. Please try again.");
      toast.error("Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Left Panel */}
      <div style={styles.left}>
        <div style={styles.leftContent}>
          <h1 style={styles.brand}>🏠 FLATKART</h1>
          <h2 style={styles.leftTitle}>Welcome back!</h2>
          <p style={styles.leftSub}>Log in to explore thousands of verified flats and connect with owners instantly.</p>
          <div style={styles.features}>
            {["🔍 Smart flat search", "📅 Instant booking", "💬 Live chat with owners", "⭐ Verified reviews"].map((f, i) => (
              <div key={i} style={styles.featureItem}>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={styles.right}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.title}>Sign In</h2>
            <p style={styles.subtitle}>Enter your credentials to continue</p>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.group}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>📧</span>
                <input style={styles.input} placeholder="you@example.com" type="email"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>

            <div style={styles.group}>
              <div style={styles.labelRow}>
                <label style={styles.label}>Password</label>
                <Link to="/forgot-password" style={styles.forgotLink}>Forgot password?</Link>
              </div>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>🔒</span>
                <input
                  style={{ ...styles.input, paddingRight: "42px" }}
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button type="button" style={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button style={{ ...styles.btn, opacity: loading ? 0.75 : 1 }} type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <div style={styles.divider}><span style={styles.dividerText}>or</span></div>

          <p style={styles.bottomText}>
            Don't have an account? <Link to="/register" style={styles.link}>Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", minHeight: "calc(100vh - 60px)" },
  left: { flex: 1, background: "linear-gradient(135deg, #1a252f 0%, #2c3e50 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px", "@media(max-width:768px)": { display: "none" } },
  leftContent: { maxWidth: "400px" },
  brand: { color: "#1abc9c", fontSize: "1.5rem", margin: "0 0 32px", fontWeight: "800" },
  leftTitle: { color: "#fff", fontSize: "2rem", margin: "0 0 12px", lineHeight: 1.3 },
  leftSub: { color: "#bdc3c7", fontSize: "1rem", lineHeight: 1.7, margin: "0 0 32px" },
  features: { display: "flex", flexDirection: "column", gap: "12px" },
  featureItem: { display: "flex", alignItems: "center", gap: "10px", color: "#ecf0f1", fontSize: "0.95rem", background: "rgba(255,255,255,0.06)", padding: "10px 16px", borderRadius: "8px", borderLeft: "3px solid #1abc9c" },
  right: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f2f5", padding: "32px 24px" },
  card: { background: "#fff", borderRadius: "16px", padding: "40px", width: "100%", maxWidth: "420px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)" },
  cardHeader: { marginBottom: "24px" },
  title: { margin: "0 0 6px", fontSize: "1.7rem", color: "#2c3e50", fontWeight: "700" },
  subtitle: { margin: 0, color: "#888", fontSize: "0.92rem" },
  errorBox: { display: "flex", alignItems: "center", gap: "8px", background: "#fdf0f0", color: "#e74c3c", border: "1px solid #f5c6cb", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", fontSize: "0.9rem" },
  form: { display: "flex", flexDirection: "column", gap: "18px" },
  group: { display: "flex", flexDirection: "column", gap: "7px" },
  labelRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  label: { fontSize: "0.85rem", fontWeight: "600", color: "#444" },
  forgotLink: { fontSize: "0.82rem", color: "#1abc9c", textDecoration: "none" },
  inputWrapper: { position: "relative", display: "flex", alignItems: "center" },
  inputIcon: { position: "absolute", left: "12px", fontSize: "0.95rem", pointerEvents: "none" },
  input: { width: "100%", padding: "11px 12px 11px 38px", fontSize: "0.97rem", borderRadius: "8px", border: "1.5px solid #e0e0e0", outline: "none", boxSizing: "border-box", background: "#fafafa" },
  eyeBtn: { position: "absolute", right: "12px", background: "none", border: "none", cursor: "pointer", fontSize: "1rem", padding: 0 },
  btn: { padding: "13px", background: "linear-gradient(135deg, #1abc9c, #16a085)", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "1rem", fontWeight: "700", letterSpacing: "0.3px", marginTop: "4px" },
  divider: { display: "flex", alignItems: "center", margin: "20px 0", gap: "12px" },
  dividerText: { color: "#ccc", fontSize: "0.85rem", background: "#fff", padding: "0 8px" },
  bottomText: { textAlign: "center", margin: 0, fontSize: "0.92rem", color: "#666" },
  link: { color: "#1abc9c", fontWeight: "600", textDecoration: "none" },
};
