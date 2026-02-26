import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TrendingUp, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import toast from "react-hot-toast";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.post("/auth/register", form);
      login(data.user, data.token);
      toast.success(`Welcome to Stock Trading Platform, ${data.user.name}!`);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.grid} />
      <div style={styles.card}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <div style={{ ...styles.logoArea, cursor: "pointer" }}>
            <div style={styles.logoIcon}>
              <TrendingUp size={28} color="#00d4ff" />
            </div>
            <h1 style={styles.logoText}>Stock Trading Platform</h1>
            <p style={{ ...styles.logoSub, color: "#00d4ff" }}>← Back to Home</p>
          </div>
        </Link>

        {/* Starting balance badge */}
        <div style={styles.balanceBadge}>
          🎁 Start with ₹1,00,000 virtual balance
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <div style={styles.inputWrapper}>
              <User size={16} color="#8888aa" style={styles.inputIcon} />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
                style={styles.input}
                onFocus={e => e.target.style.borderColor = "#00d4ff"}
                onBlur={e => e.target.style.borderColor = "#2a2a3a"}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <Mail size={16} color="#8888aa" style={styles.inputIcon} />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                style={styles.input}
                onFocus={e => e.target.style.borderColor = "#00d4ff"}
                onBlur={e => e.target.style.borderColor = "#2a2a3a"}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={16} color="#8888aa" style={styles.inputIcon} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                required
                style={{ ...styles.input, paddingRight: "2.5rem" }}
                onFocus={e => e.target.style.borderColor = "#00d4ff"}
                onBlur={e => e.target.style.borderColor = "#2a2a3a"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                {showPassword ? <EyeOff size={16} color="#8888aa" /> : <Eye size={16} color="#8888aa" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            onMouseEnter={e => !loading && (e.target.style.boxShadow = "0 0 25px #00d4ff60")}
            onMouseLeave={e => e.target.style.boxShadow = "0 0 15px #00d4ff30"}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p style={styles.switchText}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0a0a0f",
    position: "relative",
    padding: "1rem",
  },
  grid: {
    position: "fixed",
    inset: 0,
    backgroundImage: `linear-gradient(#2a2a3a22 1px, transparent 1px),
      linear-gradient(90deg, #2a2a3a22 1px, transparent 1px)`,
    backgroundSize: "40px 40px",
    pointerEvents: "none",
  },
  card: {
    background: "rgba(22, 22, 31, 0.85)",
    backdropFilter: "blur(20px)",
    border: "1px solid #2a2a3a",
    borderRadius: "16px",
    padding: "2.5rem",
    width: "100%",
    maxWidth: "420px",
    position: "relative",
    zIndex: 1,
    boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(0,212,255,0.05)",
  },
  logoArea: {
    textAlign: "center",
    marginBottom: "1.5rem",
  },
  logoIcon: {
    width: "56px",
    height: "56px",
    borderRadius: "14px",
    background: "rgba(0,212,255,0.1)",
    border: "1px solid rgba(0,212,255,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1rem",
    boxShadow: "0 0 20px rgba(0,212,255,0.2)",
  },
  logoText: {
    fontSize: "1.3rem",
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: "0.25rem",
  },
  logoSub: {
    fontSize: "0.875rem",
    color: "#8888aa",
  },
  balanceBadge: {
    background: "rgba(0,255,136,0.08)",
    border: "1px solid rgba(0,255,136,0.2)",
    borderRadius: "8px",
    padding: "0.625rem 1rem",
    textAlign: "center",
    fontSize: "0.825rem",
    color: "#00ff88",
    marginBottom: "1.5rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: {
    fontSize: "0.8rem",
    fontWeight: "500",
    color: "#8888aa",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: "0.875rem",
    pointerEvents: "none",
  },
  input: {
    width: "100%",
    padding: "0.75rem 0.875rem 0.75rem 2.5rem",
    background: "#0a0a0f",
    border: "1px solid #2a2a3a",
    borderRadius: "8px",
    color: "#ffffff",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "Inter, sans-serif",
  },
  eyeBtn: {
    position: "absolute",
    right: "0.875rem",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    display: "flex",
    alignItems: "center",
  },
  submitBtn: {
    marginTop: "0.5rem",
    padding: "0.875rem",
    background: "linear-gradient(135deg, #00d4ff, #0099cc)",
    border: "none",
    borderRadius: "8px",
    color: "#000000",
    fontWeight: "700",
    fontSize: "0.95rem",
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 0 15px #00d4ff30",
    fontFamily: "Inter, sans-serif",
  },
  switchText: {
    textAlign: "center",
    marginTop: "1.5rem",
    fontSize: "0.875rem",
    color: "#8888aa",
  },
  link: {
    color: "#00d4ff",
    textDecoration: "none",
    fontWeight: "500",
  },
};