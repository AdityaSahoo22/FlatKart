import { useState } from "react";
import API from "../api";

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    if (form.newPassword !== form.confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    if (form.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.put("/auth/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setMsg(data.message);
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (e) {
      setError(e.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔒 Change Password</h2>
        <p style={styles.subtitle}>Enter your current password and choose a new one</p>

        {msg && <div style={styles.success}>{msg}</div>}
        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.group}>
            <label style={styles.label}>Current Password</label>
            <input style={styles.input} type="password" placeholder="Enter current password"
              value={form.currentPassword}
              onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} required />
          </div>
          <div style={styles.group}>
            <label style={styles.label}>New Password</label>
            <input style={styles.input} type="password" placeholder="Enter new password"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })} required />
          </div>
          <div style={styles.group}>
            <label style={styles.label}>Confirm New Password</label>
            <input
              style={{ ...styles.input, borderColor: form.confirmPassword && form.newPassword !== form.confirmPassword ? "#e74c3c" : "#ddd" }}
              type="password" placeholder="Confirm new password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
            {form.confirmPassword && form.newPassword !== form.confirmPassword && (
              <span style={styles.hint}>Passwords do not match</span>
            )}
          </div>
          <button style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 60px)", background: "#f0f2f5" },
  card: { background: "#fff", borderRadius: "12px", padding: "36px", width: "100%", maxWidth: "420px", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" },
  title: { margin: "0 0 6px", fontSize: "1.4rem", color: "#2c3e50" },
  subtitle: { margin: "0 0 24px", color: "#888", fontSize: "0.9rem" },
  form: { display: "flex", flexDirection: "column", gap: "18px" },
  group: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "0.85rem", fontWeight: "600", color: "#555" },
  input: { padding: "10px 12px", fontSize: "1rem", borderRadius: "6px", border: "1px solid #ddd", outline: "none" },
  hint: { fontSize: "0.78rem", color: "#e74c3c" },
  btn: { padding: "12px", background: "#2c3e50", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "1rem", fontWeight: "600" },
  success: { background: "#eafaf1", color: "#27ae60", border: "1px solid #a9dfbf", borderRadius: "6px", padding: "10px 14px", marginBottom: "8px", fontSize: "0.9rem" },
  errorBox: { background: "#fdf0f0", color: "#e74c3c", border: "1px solid #f5c6cb", borderRadius: "6px", padding: "10px 14px", marginBottom: "8px", fontSize: "0.9rem" },
};
