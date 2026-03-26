import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, logout, updateUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropOpen, setDropOpen] = useState(false);
  const [modal, setModal] = useState(null); // "name" | "password"
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (path) => location.pathname === path;
  const linkStyle = (path) => ({ ...styles.link, ...(isActive(path) ? styles.activeLink : {}) });
  const handleLogout = () => { logout(); setDropOpen(false); toast.success("Logged out successfully"); navigate("/login"); };

  return (
    <>
      <nav style={styles.nav}>
        <Link to="/" style={styles.brand}><span>🏠</span> FLATKART</Link>

        <div style={styles.links}>
          <Link to="/" style={linkStyle("/")}>Home</Link>
          {user?.role !== "owner" && <Link to="/flats" style={linkStyle("/flats")}>Flats</Link>}
          {user?.role === "owner" && <Link to="/dashboard" style={linkStyle("/dashboard")}>Dashboard</Link>}
          {user?.role === "tenant" && <Link to="/my-bookings" style={linkStyle("/my-bookings")}>My Bookings</Link>}
          {user && <Link to="/chat" style={linkStyle("/chat")}>Chat</Link>}
        </div>

        <div style={styles.right}>
          {user ? (
            <div style={styles.profileArea} ref={dropRef}>
              <span style={styles.greeting}>Hi, {user.name?.toUpperCase()}</span>
              <button style={styles.avatarBtn} onClick={() => setDropOpen(!dropOpen)}>
                <div style={styles.avatarInitial}>{user.name?.[0]?.toUpperCase() || "U"}</div>
                <span style={styles.chevron}>{dropOpen ? "▲" : "▼"}</span>
              </button>

              {dropOpen && (
                <div style={styles.dropdown}>
                  <div style={styles.dropHeader}>
                    <div style={styles.dropAvatarCircle}>{user.name?.[0]?.toUpperCase()}</div>
                    <div>
                      <p style={styles.dropName}>{user.name}</p>
                      <p style={styles.dropEmail}>{user.email}</p>
                      <span style={styles.dropRole}>{user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}</span>
                    </div>
                  </div>
                  <hr style={styles.divider} />
                  <button style={styles.dropItem} onClick={() => { setModal("name"); setDropOpen(false); }}>✏️ Edit Name</button>
                  <button style={styles.dropItem} onClick={() => { setModal("password"); setDropOpen(false); }}>🔒 Change Password</button>
                  <hr style={styles.divider} />
                  <button style={{ ...styles.dropItem, color: "#e74c3c" }} onClick={handleLogout}>🚪 Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div style={styles.authLinks}>
              <Link to="/login" style={styles.loginBtn}>Login</Link>
              <Link to="/register" style={styles.registerBtn}>Register</Link>
            </div>
          )}
        </div>
      </nav>

      {modal && (
        <ProfileModal modal={modal} onClose={() => setModal(null)} user={user} updateUser={updateUser} />
      )}
    </>
  );
}

function ProfileModal({ modal, onClose, user, updateUser }) {
  const [name, setName] = useState(user?.name || "");
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSaveName = async () => {
    if (!name.trim()) { setError("Name cannot be empty"); return; }
    setLoading(true); setError(""); setMsg("");
    try {
      const { data } = await API.put("/auth/update-profile", { name });
      updateUser({ name: data.name });
      toast.success("Name updated successfully!");
      setMsg("Name updated successfully!");
    } catch { setError("Failed to update name"); }
    finally { setLoading(false); }
  };

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) { setError("Passwords do not match"); return; }
    if (passwords.newPassword.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true); setError(""); setMsg("");
    try {
      await API.put("/auth/change-password", { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success("Password changed successfully!");
      setMsg("Password changed successfully!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (e) { setError(e.response?.data?.message || "Failed to change password"); }
    finally { setLoading(false); }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>{modal === "name" ? "✏️ Edit Name" : "🔒 Change Password"}</h3>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {msg && <div style={styles.success}>{msg}</div>}
        {error && <div style={styles.errorBox}>{error}</div>}

        {modal === "name" && (
          <div style={styles.fieldSection}>
            <label style={styles.label}>Full Name</label>
            <input style={styles.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter new name" />
            <button style={{ ...styles.saveBtn, opacity: loading ? 0.7 : 1 }} onClick={handleSaveName} disabled={loading}>
              {loading ? "Saving..." : "Save Name"}
            </button>
          </div>
        )}

        {modal === "password" && (
          <div style={styles.fieldSection}>
            {[
              { key: "currentPassword", label: "Current Password", show: "current" },
              { key: "newPassword", label: "New Password", show: "new" },
              { key: "confirmPassword", label: "Confirm Password", show: "confirm" },
            ].map(({ key, label, show }) => (
              <div key={key} style={styles.group}>
                <label style={styles.label}>{label}</label>
                <div style={styles.pwdWrapper}>
                  <input
                    style={{ ...styles.input, paddingRight: "40px", borderColor: key === "confirmPassword" && passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword ? "#e74c3c" : "#ddd" }}
                    type={showPwd[show] ? "text" : "password"}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    value={passwords[key]}
                    onChange={(e) => setPasswords({ ...passwords, [key]: e.target.value })}
                  />
                  <button type="button" style={styles.eyeBtn} onClick={() => setShowPwd({ ...showPwd, [show]: !showPwd[show] })}>
                    {showPwd[show] ? "🙈" : "👁️"}
                  </button>
                </div>
                {key === "confirmPassword" && passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword && (
                  <span style={{ fontSize: "0.78rem", color: "#e74c3c" }}>Passwords do not match</span>
                )}
              </div>
            ))}
            <button style={{ ...styles.saveBtn, opacity: loading ? 0.7 : 1 }} onClick={handleChangePassword} disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  nav: { position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", background: "#1a252f", boxShadow: "0 2px 10px rgba(0,0,0,0.3)", height: "60px" },
  brand: { display: "flex", alignItems: "center", gap: "8px", color: "#fff", fontWeight: "700", fontSize: "1.25rem", textDecoration: "none" },
  links: { display: "flex", gap: "4px", alignItems: "center" },
  link: { color: "#bdc3c7", textDecoration: "none", padding: "6px 14px", borderRadius: "6px", fontSize: "0.95rem" },
  activeLink: { color: "#fff", background: "rgba(255,255,255,0.1)" },
  right: { display: "flex", alignItems: "center", gap: "12px" },
  profileArea: { position: "relative", display: "flex", alignItems: "center", gap: "10px" },
  greeting: { color: "#1abc9c", fontWeight: "700", fontSize: "0.9rem", letterSpacing: "0.5px" },
  avatarBtn: { display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", cursor: "pointer", padding: "4px 8px", borderRadius: "8px" },
  avatarInitial: { width: "34px", height: "34px", borderRadius: "50%", background: "#1abc9c", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "0.95rem", color: "#fff" },
  chevron: { color: "#bdc3c7", fontSize: "0.7rem" },
  dropdown: { position: "absolute", right: 0, top: "48px", background: "#fff", borderRadius: "10px", boxShadow: "0 8px 24px rgba(0,0,0,0.15)", minWidth: "240px", zIndex: 200, overflow: "hidden" },
  dropHeader: { display: "flex", alignItems: "center", gap: "12px", padding: "16px" },
  dropAvatarCircle: { width: "48px", height: "48px", borderRadius: "50%", background: "#1abc9c", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "bold", fontSize: "1.2rem", flexShrink: 0 },
  dropName: { margin: 0, fontWeight: "700", color: "#2c3e50", fontSize: "0.95rem" },
  dropEmail: { margin: "2px 0 4px", color: "#888", fontSize: "0.8rem" },
  dropRole: { background: "#eaf4fb", color: "#2980b9", padding: "2px 8px", borderRadius: "10px", fontSize: "0.75rem", fontWeight: "600" },
  divider: { margin: 0, border: "none", borderTop: "1px solid #f0f0f0" },
  dropItem: { display: "block", width: "100%", padding: "11px 16px", background: "none", border: "none", textAlign: "left", cursor: "pointer", fontSize: "0.9rem", color: "#333" },
  authLinks: { display: "flex", gap: "8px", alignItems: "center" },
  loginBtn: { color: "#ecf0f1", textDecoration: "none", padding: "6px 14px", borderRadius: "6px", fontSize: "0.9rem", border: "1px solid rgba(255,255,255,0.2)" },
  registerBtn: { color: "#fff", textDecoration: "none", padding: "6px 14px", borderRadius: "6px", fontSize: "0.9rem", background: "#1abc9c" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center" },
  modal: { background: "#fff", borderRadius: "12px", padding: "28px", width: "100%", maxWidth: "400px", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  modalTitle: { margin: 0, fontSize: "1.15rem", color: "#2c3e50" },
  closeBtn: { background: "none", border: "none", fontSize: "1.1rem", cursor: "pointer", color: "#888" },
  fieldSection: { display: "flex", flexDirection: "column", gap: "14px" },
  group: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "0.85rem", fontWeight: "600", color: "#555" },
  input: { padding: "10px 12px", fontSize: "1rem", borderRadius: "6px", border: "1px solid #ddd", outline: "none", width: "100%", boxSizing: "border-box" },
  pwdWrapper: { position: "relative" },
  eyeBtn: { position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "1rem", padding: 0 },
  saveBtn: { padding: "11px", background: "#2c3e50", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "1rem", fontWeight: "600", width: "100%" },
  success: { background: "#eafaf1", color: "#27ae60", border: "1px solid #a9dfbf", borderRadius: "6px", padding: "10px 14px", marginBottom: "12px", fontSize: "0.9rem" },
  errorBox: { background: "#fdf0f0", color: "#e74c3c", border: "1px solid #f5c6cb", borderRadius: "6px", padding: "10px 14px", marginBottom: "12px", fontSize: "0.9rem" },
};
