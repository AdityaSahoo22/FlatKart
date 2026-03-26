import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import toast from "react-hot-toast";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "tenant" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await API.post("/auth/register", form);
      toast.success("Registration Successful! Please login 🎉");
      navigate("/login");
    } catch {
      setError("Registration failed. Email may already exist.");
      toast.error("Registration failed. Email may already exist.");
    } finally {
      setLoading(false);
    }
  };

  const isOwner = form.role === "owner";

  return (
    <div style={styles.page}>
      {/* Left Panel */}
      <div style={{ ...styles.left, background: isOwner ? "linear-gradient(135deg, #0f2027, #203a43, #2c5364)" : "linear-gradient(135deg, #1a252f 0%, #2c3e50 100%)" }}>
        <div style={styles.leftContent}>
          <h1 style={{ ...styles.brand, color: isOwner ? "#f1c40f" : "#1abc9c" }}>🏠 FLATKART</h1>
          {isOwner ? (
            <>
              <h2 style={styles.leftTitle}>List & Earn with <span style={{ color: "#f1c40f" }}>FLATKART</span></h2>
              <p style={styles.leftSub}>Join hundreds of property owners earning passive income by listing their flats on FLATKART.</p>
              <div style={styles.features}>
                {["📋 List flats in minutes", "✅ Full booking control", "💬 Chat with tenants", "📊 Powerful dashboard"].map((f, i) => (
                  <div key={i} style={{ ...styles.featureItem, borderLeft: "3px solid #f1c40f" }}><span>{f}</span></div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h2 style={styles.leftTitle}>Find Your Perfect <span style={{ color: "#1abc9c" }}>Home</span></h2>
              <p style={styles.leftSub}>Join thousands of tenants who found their ideal flat on FLATKART — fast, easy, and verified.</p>
              <div style={styles.features}>
                {["🔍 Smart flat search", "📅 Instant booking", "💬 Live chat with owners", "⭐ Verified reviews"].map((f, i) => (
                  <div key={i} style={styles.featureItem}><span>{f}</span></div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div style={styles.right}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.title}>Create Account</h2>
            <p style={styles.subtitle}>Fill in the details to get started</p>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Role Toggle */}
          <div style={styles.roleToggle}>
            <button type="button"
              style={{ ...styles.roleBtn, ...(form.role === "tenant" ? styles.roleBtnActive : {}) }}
              onClick={() => setForm({ ...form, role: "tenant" })}>
              🏠 Tenant
            </button>
            <button type="button"
              style={{ ...styles.roleBtn, ...(form.role === "owner" ? styles.roleBtnOwnerActive : {}) }}
              onClick={() => setForm({ ...form, role: "owner" })}>
              🏢 Owner
            </button>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.group}>
              <label style={styles.label}>Full Name</label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>👤</span>
                <input style={styles.input} placeholder="Enter your full name"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
            </div>

            <div style={styles.group}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>📧</span>
                <input style={styles.input} placeholder="you@example.com" type="email"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>

            <div style={styles.group}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>🔒</span>
                <input
                  style={{ ...styles.input, paddingRight: "42px" }}
                  placeholder="Create a strong password"
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

            <button
              style={{ ...styles.btn, opacity: loading ? 0.75 : 1, background: isOwner ? "linear-gradient(135deg, #f1c40f, #f39c12)" : "linear-gradient(135deg, #1abc9c, #16a085)", color: isOwner ? "#1a252f" : "#fff" }}
              type="submit" disabled={loading}>
              {loading ? "Creating account..." : `Create ${isOwner ? "Owner" : "Tenant"} Account →`}
            </button>
          </form>

          <p style={styles.bottomText}>
            Already have an account? <Link to="/login" style={styles.link}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", minHeight: "calc(100vh - 60px)" },
  left: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px" },
  leftContent: { maxWidth: "400px" },
  brand: { fontSize: "1.5rem", margin: "0 0 32px", fontWeight: "800" },
  leftTitle: { color: "#fff", fontSize: "2rem", margin: "0 0 12px", lineHeight: 1.3 },
  leftSub: { color: "#bdc3c7", fontSize: "1rem", lineHeight: 1.7, margin: "0 0 32px" },
  features: { display: "flex", flexDirection: "column", gap: "12px" },
  featureItem: { display: "flex", alignItems: "center", gap: "10px", color: "#ecf0f1", fontSize: "0.95rem", background: "rgba(255,255,255,0.06)", padding: "10px 16px", borderRadius: "8px", borderLeft: "3px solid #1abc9c" },
  right: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f2f5", padding: "32px 24px" },
  card: { background: "#fff", borderRadius: "16px", padding: "40px", width: "100%", maxWidth: "420px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)" },
  cardHeader: { marginBottom: "20px" },
  title: { margin: "0 0 6px", fontSize: "1.7rem", color: "#2c3e50", fontWeight: "700" },
  subtitle: { margin: 0, color: "#888", fontSize: "0.92rem" },
  errorBox: { display: "flex", alignItems: "center", gap: "8px", background: "#fdf0f0", color: "#e74c3c", border: "1px solid #f5c6cb", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", fontSize: "0.9rem" },
  roleToggle: { display: "flex", background: "#f0f2f5", borderRadius: "10px", padding: "4px", marginBottom: "20px", gap: "4px" },
  roleBtn: { flex: 1, padding: "9px", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "0.92rem", fontWeight: "600", background: "transparent", color: "#888" },
  roleBtnActive: { background: "#fff", color: "#1abc9c", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" },
  roleBtnOwnerActive: { background: "#fff", color: "#f39c12", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  group: { display: "flex", flexDirection: "column", gap: "7px" },
  label: { fontSize: "0.85rem", fontWeight: "600", color: "#444" },
  inputWrapper: { position: "relative", display: "flex", alignItems: "center" },
  inputIcon: { position: "absolute", left: "12px", fontSize: "0.95rem", pointerEvents: "none" },
  input: { width: "100%", padding: "11px 12px 11px 38px", fontSize: "0.97rem", borderRadius: "8px", border: "1.5px solid #e0e0e0", outline: "none", boxSizing: "border-box", background: "#fafafa" },
  eyeBtn: { position: "absolute", right: "12px", background: "none", border: "none", cursor: "pointer", fontSize: "1rem", padding: 0 },
  btn: { padding: "13px", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "1rem", fontWeight: "700", letterSpacing: "0.3px", marginTop: "4px" },
  bottomText: { textAlign: "center", margin: "20px 0 0", fontSize: "0.92rem", color: "#666" },
  link: { color: "#1abc9c", fontWeight: "600", textDecoration: "none" },
};
