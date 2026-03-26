import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";

const socket = io("http://localhost:5000");

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });
    return () => socket.off("receive_message");
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const msg = { sender: user?.id || "Guest", text, time: new Date().toLocaleTimeString() };
    socket.emit("send_message", msg);
    setText("");
  };

  return (
    <div style={styles.container}>
      <h2>Live Chat</h2>
      <div style={styles.chatBox}>
        {messages.map((m, i) => (
          <div key={i} style={{ ...styles.msg, alignSelf: m.sender === user?.id ? "flex-end" : "flex-start" }}>
            <span style={styles.sender}>{m.sender === user?.id ? "You" : m.sender}</span>
            <p style={{ ...styles.bubble, background: m.sender === user?.id ? "#2c3e50" : "#eee", color: m.sender === user?.id ? "#fff" : "#000" }}>
              {m.text}
            </p>
            <span style={styles.time}>{m.time}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={sendMessage} style={styles.inputRow}>
        <input style={styles.input} placeholder="Type a message..." value={text}
          onChange={(e) => setText(e.target.value)} />
        <button style={styles.btn} type="submit">Send</button>
      </form>
    </div>
  );
}

const styles = {
  container: { maxWidth: "600px", margin: "40px auto", padding: "0 16px" },
  chatBox: { display: "flex", flexDirection: "column", gap: "8px", height: "400px", overflowY: "auto", border: "1px solid #ddd", borderRadius: "8px", padding: "12px", marginBottom: "12px" },
  msg: { display: "flex", flexDirection: "column", maxWidth: "70%" },
  sender: { fontSize: "0.75rem", color: "#888", marginBottom: "2px" },
  bubble: { margin: 0, padding: "8px 12px", borderRadius: "12px", wordBreak: "break-word" },
  time: { fontSize: "0.7rem", color: "#aaa", marginTop: "2px" },
  inputRow: { display: "flex", gap: "8px" },
  input: { flex: 1, padding: "10px", fontSize: "1rem", borderRadius: "4px", border: "1px solid #ccc" },
  btn: { padding: "10px 20px", background: "#2c3e50", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" },
};
