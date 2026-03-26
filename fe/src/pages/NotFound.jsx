import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={styles.container}>
      <h1 style={styles.code}>404</h1>
      <p style={styles.msg}>Page not found</p>
      <Link to="/" style={styles.btn}>Go Home</Link>
    </div>
  );
}

const styles = {
  container: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "calc(100vh - 50px)", gap: "12px" },
  code: { fontSize: "6rem", fontWeight: "bold", color: "#2c3e50", margin: 0 },
  msg: { fontSize: "1.2rem", color: "#888", margin: 0 },
  btn: { marginTop: "8px", padding: "10px 24px", background: "#2c3e50", color: "#fff", borderRadius: "6px", textDecoration: "none" },
};
