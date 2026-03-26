import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api";

export default function Flats() {
  const [flats, setFlats] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/flats/search").then(({ data }) => {
      setFlats(data);
      setFiltered(data);
      setLoading(false);
    });
  }, []);

  const handleSearch = () => {
    let result = flats;
    if (location) result = result.filter((f) => f.location.toLowerCase().includes(location.toLowerCase()));
    if (price) result = result.filter((f) => f.price <= Number(price));
    if (type) result = result.filter((f) => f.type === type);
    setFiltered(result);
  };

  const handleReset = () => {
    setLocation(""); setPrice(""); setType("");
    setFiltered(flats);
  };

  const types = [...new Set(flats.map((f) => f.type).filter(Boolean))];

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>🏘️ Available Flats</h1>
        <p style={styles.subtitle}>{filtered.length} flat{filtered.length !== 1 ? "s" : ""} found</p>
      </div>

      {/* Filters */}
      <div style={styles.filterBar}>
        <input style={styles.filterInput} placeholder="🔍 Search by location..." value={location}
          onChange={(e) => setLocation(e.target.value)} />
        <input style={styles.filterInput} placeholder="₹ Max price" type="number" value={price}
          onChange={(e) => setPrice(e.target.value)} />
        <select style={styles.filterInput} value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All Types</option>
          {types.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <button style={styles.searchBtn} onClick={handleSearch}>Search</button>
        <button style={styles.resetBtn} onClick={handleReset}>Reset</button>
      </div>

      {loading ? (
        <p style={styles.empty}>Loading flats...</p>
      ) : filtered.length === 0 ? (
        <div style={styles.emptyBox}>
          <p style={styles.emptyIcon}>🏚️</p>
          <p style={styles.emptyText}>No flats found matching your criteria.</p>
          <button style={styles.searchBtn} onClick={handleReset}>Clear Filters</button>
        </div>
      ) : (
        <div style={styles.grid}>
          {filtered.map((flat) => (
            <div key={flat._id} style={styles.card}>
              {flat.image ? (
                <img src={`http://localhost:5000/uploads/${flat.image}`} alt="flat" style={styles.img} />
              ) : (
                <div style={styles.noImg}>🏠</div>
              )}
              <div style={styles.cardBody}>
                <div style={styles.cardTop}>
                  <span style={styles.typeBadge}>{flat.type}</span>
                </div>
                <h3 style={styles.cardTitle}>{flat.location}</h3>
                <p style={styles.cardDesc}>{flat.description}</p>
                <div style={styles.cardFooter}>
                  <span style={styles.price}>₹{flat.price?.toLocaleString()}<span style={styles.perMonth}>/month</span></span>
                  <Link to={`/flat/${flat._id}`} style={styles.detailBtn}>View Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" },
  header: { marginBottom: "24px" },
  title: { margin: "0 0 6px", fontSize: "1.8rem", color: "#2c3e50" },
  subtitle: { margin: 0, color: "#888", fontSize: "0.95rem" },
  filterBar: { display: "flex", gap: "10px", flexWrap: "wrap", background: "#fff", padding: "16px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", marginBottom: "28px" },
  filterInput: { flex: 1, minWidth: "140px", padding: "10px 12px", fontSize: "0.95rem", borderRadius: "6px", border: "1px solid #ddd", outline: "none" },
  searchBtn: { padding: "10px 22px", background: "#2c3e50", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600" },
  resetBtn: { padding: "10px 18px", background: "#f0f2f5", color: "#555", border: "1px solid #ddd", borderRadius: "6px", cursor: "pointer" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" },
  card: { background: "#fff", borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", transition: "transform 0.2s" },
  img: { width: "100%", height: "190px", objectFit: "cover" },
  noImg: { height: "190px", background: "#f0f2f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem" },
  cardBody: { padding: "16px" },
  cardTop: { marginBottom: "8px" },
  typeBadge: { background: "#eaf4fb", color: "#2980b9", padding: "3px 10px", borderRadius: "10px", fontSize: "0.78rem", fontWeight: "600" },
  cardTitle: { margin: "0 0 6px", fontSize: "1.05rem", color: "#2c3e50" },
  cardDesc: { margin: "0 0 14px", fontSize: "0.88rem", color: "#777", lineHeight: "1.5" },
  cardFooter: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  price: { fontSize: "1.1rem", fontWeight: "700", color: "#2c3e50" },
  perMonth: { fontSize: "0.78rem", fontWeight: "400", color: "#888" },
  detailBtn: { padding: "7px 16px", background: "#1abc9c", color: "#fff", borderRadius: "6px", textDecoration: "none", fontSize: "0.85rem", fontWeight: "600" },
  empty: { textAlign: "center", color: "#888", marginTop: "40px" },
  emptyBox: { textAlign: "center", padding: "60px 0" },
  emptyIcon: { fontSize: "3rem", margin: "0 0 12px" },
  emptyText: { color: "#888", marginBottom: "16px" },
};
