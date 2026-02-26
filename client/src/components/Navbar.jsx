import { TrendingUp, LogOut, LayoutDashboard, BookOpen, History } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navLinks = [
    { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={15} /> },
    { path: "/portfolio", label: "Portfolio", icon: <BookOpen size={15} /> },
    { path: "/transactions", label: "History", icon: <History size={15} /> },
  ];

  return (
    <>
      <style>{navCss}</style>
      <nav style={s.nav}>
        {/* Logo */}
        <Link to="/dashboard" style={s.logo}>
          <div style={s.logoIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" stroke="#00d4ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="16 7 22 7 22 13" stroke="#00d4ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={s.logoText}>Stock Trading Platform</span>
          <span style={s.betaBadge}>BETA</span>
        </Link>

        {/* Nav Links */}
        <div style={s.links}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                ...s.link,
                ...(location.pathname === link.path ? s.linkActive : {}),
              }}
              className="nav-link"
            >
              {link.icon}
              {link.label}
              {location.pathname === link.path && <span style={s.activeDot} />}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div style={s.right}>
          <div style={s.balancePill}>
            <span style={s.balanceLabel}>Balance</span>
            <span style={s.balanceValue}>
              ₹{user?.balance?.toLocaleString("en-IN") || "0"}
            </span>
          </div>

          <div style={s.userChip}>
            <div style={s.avatar}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={s.userMeta}>
              <span style={s.userName}>{user?.name?.split(" ")[0]}</span>
              <span style={s.userRole}>{user?.role}</span>
            </div>
          </div>

          <button onClick={handleLogout} style={s.logoutBtn} className="logout-btn">
            <LogOut size={15} />
          </button>
        </div>
      </nav>
      {/* Spacer */}
      <div style={{ height: 64 }} />
    </>
  );
}

const navCss = `
  .nav-link:hover {
    color: #00d4ff !important;
    background: rgba(0,212,255,0.06) !important;
  }
  .logout-btn:hover {
    background: rgba(255,68,102,0.15) !important;
    border-color: rgba(255,68,102,0.4) !important;
    transform: scale(1.05);
  }
`;

const s = {
  nav: {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
    height: 64,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 1.5rem",
    background: "rgba(5,5,15,0.92)",
    backdropFilter: "blur(24px)",
    borderBottom: "1px solid rgba(0,212,255,0.08)",
    fontFamily: "'Syne', sans-serif",
  },
  logo: {
    display: "flex", alignItems: "center", gap: "0.625rem",
    textDecoration: "none",
  },
  logoIcon: {
    width: 34, height: 34, borderRadius: 9,
    background: "rgba(0,212,255,0.08)",
    border: "1px solid rgba(0,212,255,0.2)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  logoText: {
    fontSize: "0.9rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em",
  },
  betaBadge: {
    fontSize: "0.55rem", fontWeight: 800, color: "#00d4ff",
    background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.2)",
    padding: "0.15rem 0.35rem", borderRadius: 4, letterSpacing: "0.1em",
  },
  links: { display: "flex", alignItems: "center", gap: "0.25rem" },
  link: {
    display: "flex", alignItems: "center", gap: "0.375rem",
    padding: "0.45rem 0.875rem", borderRadius: 8,
    textDecoration: "none", color: "#666680",
    fontSize: "0.825rem", fontWeight: 600,
    transition: "all 0.2s", position: "relative",
    fontFamily: "'Syne', sans-serif",
  },
  linkActive: {
    color: "#00d4ff",
    background: "rgba(0,212,255,0.07)",
  },
  activeDot: {
    position: "absolute", bottom: 4, left: "50%",
    transform: "translateX(-50%)",
    width: 3, height: 3, borderRadius: "50%",
    background: "#00d4ff",
    boxShadow: "0 0 6px #00d4ff",
  },
  right: { display: "flex", alignItems: "center", gap: "0.75rem" },
  balancePill: {
    display: "flex", flexDirection: "column", alignItems: "flex-end",
    padding: "0.3rem 0.75rem",
    background: "rgba(0,255,136,0.05)",
    border: "1px solid rgba(0,255,136,0.12)",
    borderRadius: 8,
  },
  balanceLabel: {
    fontSize: "0.6rem", color: "#8888aa",
    textTransform: "uppercase", letterSpacing: "0.08em",
  },
  balanceValue: {
    fontSize: "0.825rem", fontWeight: 800, color: "#00ff88",
    fontFamily: "'Syne', sans-serif",
  },
  userChip: {
    display: "flex", alignItems: "center", gap: "0.5rem",
    padding: "0.3rem 0.625rem",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 8,
  },
  avatar: {
    width: 28, height: 28, borderRadius: "50%",
    background: "linear-gradient(135deg, #00d4ff, #0066ff)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "0.75rem", fontWeight: 800, color: "#000",
  },
  userMeta: { display: "flex", flexDirection: "column" },
  userName: { fontSize: "0.775rem", fontWeight: 700, color: "#fff" },
  userRole: { fontSize: "0.6rem", color: "#8888aa", textTransform: "uppercase", letterSpacing: "0.05em" },
  logoutBtn: {
    width: 34, height: 34,
    background: "rgba(255,68,102,0.08)",
    border: "1px solid rgba(255,68,102,0.15)",
    borderRadius: 8, color: "#ff4466",
    cursor: "pointer", display: "flex",
    alignItems: "center", justifyContent: "center",
    transition: "all 0.2s",
  },
};