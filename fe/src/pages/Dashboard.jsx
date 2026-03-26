import { useState, useEffect } from "react";
import API from "../api";
import { useAuth } from "../context/AuthContext";

const TABS = ["My Flats", "List a Flat", "Booking Requests"];
const statusColor = { pending: "#f39c12", approved: "#27ae60", rejected: "#e74c3c" };

export default function Dashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState(0);
  const [flats, setFlats] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({ location: "", price: "", type: "", description: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get("/flats/mine").then(({ data }) => setFlats(data));
    API.get("/bookings/owner").then(({ data }) => setBookings(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const { data } = await API.post("/flats", form);
      setFlats((prev) => [...prev, data]);
      setMsg("Flat listed successfully!");
      setForm({ location: "", price: "", type: "", description: "" });
      setTab(0);
    } catch {
      setMsg("Failed to list flat.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this flat?")) return;
    await API.delete(`/flats/${id}`);
    setFlats((prev) => prev.filter((f) => f._id !== id));
  };

  const updateBooking = async (id, status) => {
    const { data } = await API.put(`/bookings/${id}`, { status });
    setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status: data.status } : b)));
  };

  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div style={styles.profile}>
          <div style={styles.avatar}>{user?.name?.[0]?.toUpperCase() || "O"}</div>
          <div>
            <p style={styles.profileName}>{user?.name || "Owner"}</p>
            <p style={styles.profileRole}>Owner</p>
          </div>
        </div>
        <div style={styles.stats}>
          <div style={styles.statBox}>
            <span style={styles.statNum}>{flats.length}</span>
            <span style={styles.statLabel}>Listings</span>
          </div>
          <div style={styles.statBox}>
            <span style={styles.statNum}>{pendingCount}</span>
            <span style={styles.statLabel}>Pending</span>
          </div>
          <div style={styles.statBox}>
            <span style={styles.statNum}>{bookings.filter((b) => b.status === "approved").length}</span>
            <span style={styles.statLabel}>Approved</span>
          </div>
        </div>
        <nav style={styles.nav}>
          {TABS.map((t, i) => (
            <button key={i} onClick={() => { setTab(i); setMsg(""); }}
              style={{ ...styles.navBtn, ...(tab === i ? styles.navBtnActive : {}) }}>
              {t}
              {i === 2 && pendingCount > 0 && <span style={styles.badge}>{pendingCount}</span>}
            </button>
          ))}
        </nav>
      </aside>

      <main style={styles.main}>
        {/* My Flats */}
        {tab === 0 && (
          <div>
            <div style={styles.mainHeader}>
              <h2 style={styles.title}>My Listings</h2>
              <button style={styles.addBtn} onClick={() => setTab(1)}>+ Add New Flat</button>
            </div>
            {flats.length === 0 ? (
              <div style={styles.empty}>
                <p>No flats listed yet.</p>
                <button style={styles.addBtn} onClick={() => setTab(1)}>List your first flat</button>
              </div>
            ) : (
              <div style={styles.grid}>
                {flats.map((flat) => (
                  <div key={flat._id} style={styles.flatCard}>
                    <div style={styles.flatIconBox}>🏠</div>
                    <div style={styles.flatBody}>
                      <h3 style={styles.flatLocation}>{flat.location}</h3>
                      <p style={styles.flatMeta}>{flat.type}</p>
                      <p style={styles.flatPrice}>₹{flat.price}<span style={styles.perMonth}>/month</span></p>
                      <p style={styles.flatDesc}>{flat.description}</p>
                      <button style={styles.deleteBtn} onClick={() => handleDelete(flat._id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* List a Flat */}
        {tab === 1 && (
          <div>
            <h2 style={styles.title}>List a New Flat</h2>
            {msg && <p style={{ color: msg.includes("success") ? "#27ae60" : "#e74c3c", marginBottom: "12px" }}>{msg}</p>}
            <div style={styles.formCard}>
              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Location</label>
                    <input style={styles.input} placeholder="e.g. Mumbai, Andheri" value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })} required />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Price / Month (₹)</label>
                    <input style={styles.input} placeholder="e.g. 15000" type="number" value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                  </div>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Flat Type</label>
                  <select style={styles.input} value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })} required>
                    <option value="">Select type</option>
                    {["Studio", "1BHK", "2BHK", "3BHK", "4BHK", "Duplex", "Penthouse"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Description</label>
                  <textarea style={{ ...styles.input, height: "90px" }} placeholder="Describe the flat..."
                    value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <button style={{ ...styles.addBtn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
                  {loading ? "Listing..." : "List Flat"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Booking Requests */}
        {tab === 2 && (
          <div>
            <h2 style={styles.title}>Booking Requests</h2>
            {bookings.length === 0 ? (
              <div style={styles.empty}><p>No booking requests yet.</p></div>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thead}>
                    <th style={styles.th}>Flat</th>
                    <th style={styles.th}>Tenant</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Price</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id} style={styles.tr}>
                      <td style={styles.td}>{b.flat_id?.location}</td>
                      <td style={styles.td}>{b.tenant_id?.name}</td>
                      <td style={styles.td}>{b.tenant_id?.email}</td>
                      <td style={styles.td}>₹{b.flat_id?.price}/month</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.statusBadge, background: statusColor[b.status] }}>{b.status}</span>
                      </td>
                      <td style={styles.td}>
                        {b.status === "pending" ? (
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button style={{ ...styles.actionBtn, background: "#27ae60" }} onClick={() => updateBooking(b._id, "approved")}>Approve</button>
                            <button style={{ ...styles.actionBtn, background: "#e74c3c" }} onClick={() => updateBooking(b._id, "rejected")}>Reject</button>
                          </div>
                        ) : (
                          <span style={{ color: "#aaa", fontSize: "0.85rem" }}>Done</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  page: { display: "flex", minHeight: "calc(100vh - 60px)", background: "#f0f2f5" },
  sidebar: { width: "240px", background: "#2c3e50", color: "#fff", padding: "24px 16px", display: "flex", flexDirection: "column", gap: "24px", flexShrink: 0 },
  profile: { display: "flex", alignItems: "center", gap: "12px" },
  avatar: { width: "44px", height: "44px", borderRadius: "50%", background: "#1abc9c", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", fontWeight: "bold", flexShrink: 0 },
  profileName: { margin: 0, fontWeight: "bold", fontSize: "0.95rem" },
  profileRole: { margin: 0, fontSize: "0.75rem", color: "#95a5a6" },
  stats: { display: "flex", justifyContent: "space-between" },
  statBox: { display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(255,255,255,0.08)", borderRadius: "8px", padding: "10px 12px" },
  statNum: { fontSize: "1.4rem", fontWeight: "bold", color: "#1abc9c" },
  statLabel: { fontSize: "0.7rem", color: "#bdc3c7", marginTop: "2px" },
  nav: { display: "flex", flexDirection: "column", gap: "6px" },
  navBtn: { background: "none", border: "none", color: "#bdc3c7", padding: "10px 14px", borderRadius: "6px", cursor: "pointer", textAlign: "left", fontSize: "0.95rem", display: "flex", justifyContent: "space-between", alignItems: "center" },
  navBtnActive: { background: "rgba(255,255,255,0.12)", color: "#fff" },
  badge: { background: "#e74c3c", color: "#fff", borderRadius: "10px", padding: "1px 7px", fontSize: "0.75rem" },
  main: { flex: 1, padding: "32px" },
  mainHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  title: { margin: 0, fontSize: "1.4rem", color: "#2c3e50" },
  addBtn: { padding: "10px 20px", background: "#2c3e50", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.95rem" },
  empty: { textAlign: "center", padding: "60px 0", color: "#888", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" },
  flatCard: { background: "#fff", borderRadius: "10px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  flatIconBox: { height: "120px", background: "#f0f2f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem" },
  flatBody: { padding: "14px" },
  flatLocation: { margin: "0 0 4px", fontSize: "1rem" },
  flatMeta: { color: "#888", fontSize: "0.85rem", margin: "2px 0" },
  flatPrice: { fontSize: "1.1rem", fontWeight: "bold", color: "#2c3e50", margin: "6px 0" },
  perMonth: { fontSize: "0.8rem", fontWeight: "normal", color: "#888" },
  flatDesc: { fontSize: "0.85rem", color: "#777", margin: "4px 0 10px" },
  deleteBtn: { background: "none", border: "1px solid #e74c3c", color: "#e74c3c", padding: "5px 12px", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem" },
  formCard: { background: "#fff", borderRadius: "10px", padding: "28px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", maxWidth: "680px" },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  formRow: { display: "flex", gap: "16px" },
  formGroup: { display: "flex", flexDirection: "column", gap: "6px", flex: 1 },
  label: { fontSize: "0.85rem", fontWeight: "600", color: "#555" },
  input: { padding: "10px 12px", fontSize: "1rem", borderRadius: "6px", border: "1px solid #ddd", resize: "vertical", outline: "none" },
  table: { width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "10px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  thead: { background: "#2c3e50" },
  th: { padding: "12px 16px", color: "#fff", textAlign: "left", fontSize: "0.85rem", fontWeight: "600" },
  tr: { borderBottom: "1px solid #f0f0f0" },
  td: { padding: "12px 16px", fontSize: "0.9rem", color: "#444" },
  statusBadge: { padding: "3px 10px", borderRadius: "12px", color: "#fff", fontSize: "0.8rem", fontWeight: "600" },
  actionBtn: { padding: "5px 12px", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.82rem" },
};
