import { useEffect, useState } from "react";
import { Users, TrendingUp, Activity, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [newStock, setNewStock] = useState({ symbol: "", name: "", currentPrice: "", sector: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "admin") { navigate("/login"); return; }
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [statsRes, usersRes, txRes, stocksRes] = await Promise.all([
        API.get("/admin/stats"),
        API.get("/admin/users"),
        API.get("/admin/transactions"),
        API.get("/admin/stocks"),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setTransactions(txRes.data);
      setStocks(stocksRes.data);
    } catch (error) {
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUser = async (id) => {
    try {
      const { data } = await API.patch(`/admin/users/${id}/toggle`);
      toast.success(data.message);
      fetchAll();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
    }
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    try {
      await API.post("/admin/stocks", { ...newStock, currentPrice: parseFloat(newStock.currentPrice) });
      toast.success("Stock added successfully");
      setNewStock({ symbol: "", name: "", currentPrice: "", sector: "" });
      fetchAll();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add stock");
    }
  };

  const tabs = ["overview", "users", "stocks", "transactions"];

  return (
    <div style={s.page}>
      <style>{css}</style>

      {/* Admin Navbar */}
      <nav style={s.nav}>
        <div style={s.navLeft}>
          <div style={s.logoIcon}>
            <Shield size={18} color="#00d4ff" />
          </div>
          <span style={s.logoText}>Admin Panel</span>
          <span style={s.adminBadge}>ADMIN</span>
        </div>
        <div style={s.navRight}>
          <div style={s.navUserChip}>
            <div style={s.navAvatar}>{user?.name?.charAt(0)}</div>
            <span style={s.navUserName}>{user?.name}</span>
          </div>
          <button
            onClick={() => { logout(); navigate("/login"); }}
            style={s.logoutBtn}
            className="admin-logout-btn"
          >
            Logout
          </button>
        </div>
      </nav>
      <div style={{ height: 64 }} />

      <div style={s.container}>

        {/* Tabs */}
        <div style={s.tabsWrap}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{ ...s.tab, ...(activeTab === tab ? s.tabActive : {}) }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && <div style={s.tabUnderline} />}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <div style={s.statsGrid}>
            <AdminStatCard title="Total Users" value={stats.totalUsers || 0} icon={<Users size={20} color="#00d4ff" />} color="#00d4ff" />
            <AdminStatCard title="Active Stocks" value={stats.totalStocks || 0} icon={<TrendingUp size={20} color="#a855f7" />} color="#a855f7" />
            <AdminStatCard title="Transactions" value={stats.totalTransactions || 0} icon={<Activity size={20} color="#f59e0b" />} color="#f59e0b" />
            <AdminStatCard
              title="Total Volume"
              value={`₹${((stats.totalVolume || 0) / 1000).toFixed(0)}K`}
              icon={<span style={{ fontSize: "1rem", color: "#00ff88", fontWeight: 900 }}>₹</span>}
              color="#00ff88"
            />
          </div>
        )}

        {/* ── USERS ── */}
        {activeTab === "users" && (
          <div style={s.section}>
            <div style={s.sectionHeader}>
              <div style={s.sectionTitleWrap}>
                <div style={s.sectionDot} />
                <h2 style={s.sectionTitle}>All Users</h2>
                <span style={s.sectionCount}>{users.length} accounts</span>
              </div>
            </div>
            <div style={s.tableWrapper}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Name</th>
                    <th style={s.th}>Email</th>
                    <th style={s.th}>Role</th>
                    <th style={s.th}>Balance</th>
                    <th style={s.th}>Status</th>
                    <th style={s.th}>Joined</th>
                    <th style={s.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr
                      key={u._id}
                      style={s.tr}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(0,212,255,0.025)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={s.td}>
                        <div style={s.userCell}>
                          <div style={s.userAvatar}>{u.name?.charAt(0)}</div>
                          <span style={{ color: "#fff", fontWeight: 700, fontSize: "0.85rem" }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={s.td}><span style={{ color: "#8888aa", fontSize: "0.825rem" }}>{u.email}</span></td>
                      <td style={s.td}>
                        <span style={{
                          ...s.roleBadge,
                          color: u.role === "admin" ? "#a855f7" : "#00d4ff",
                          background: u.role === "admin" ? "rgba(168,85,247,0.08)" : "rgba(0,212,255,0.08)",
                          border: `1px solid ${u.role === "admin" ? "rgba(168,85,247,0.2)" : "rgba(0,212,255,0.2)"}`,
                        }}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td style={s.td}><span style={{ color: "#00ff88", fontWeight: 700, fontSize: "0.85rem" }}>₹{u.balance?.toLocaleString("en-IN")}</span></td>
                      <td style={s.td}>
                        <span style={{
                          fontSize: "0.7rem", fontWeight: 700,
                          color: u.isActive ? "#00ff88" : "#ff4466",
                          background: u.isActive ? "rgba(0,255,136,0.07)" : "rgba(255,68,102,0.07)",
                          border: `1px solid ${u.isActive ? "rgba(0,255,136,0.15)" : "rgba(255,68,102,0.15)"}`,
                          padding: "0.2rem 0.6rem", borderRadius: 20,
                        }}>
                          {u.isActive ? "● Active" : "● Inactive"}
                        </span>
                      </td>
                      <td style={s.td}><span style={{ color: "#8888aa", fontSize: "0.775rem" }}>{new Date(u.createdAt).toLocaleDateString("en-IN")}</span></td>
                      <td style={s.td}>
                        {u.role !== "admin" && (
                          <button
                            onClick={() => handleToggleUser(u._id)}
                            style={{
                              padding: "0.35rem 0.75rem",
                              background: u.isActive ? "rgba(255,68,102,0.08)" : "rgba(0,255,136,0.08)",
                              border: `1px solid ${u.isActive ? "rgba(255,68,102,0.2)" : "rgba(0,255,136,0.2)"}`,
                              borderRadius: 7, cursor: "pointer",
                              color: u.isActive ? "#ff4466" : "#00ff88",
                              fontSize: "0.72rem", fontWeight: 800,
                              fontFamily: "'Syne', sans-serif",
                              transition: "all 0.2s",
                            }}
                          >
                            {u.isActive ? "Deactivate" : "Activate"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── STOCKS ── */}
        {activeTab === "stocks" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Add Stock */}
            <div style={s.section}>
              <div style={s.sectionHeader}>
                <div style={s.sectionTitleWrap}>
                  <div style={s.sectionDot} />
                  <h2 style={s.sectionTitle}>Add New Stock</h2>
                </div>
              </div>
              <form onSubmit={handleAddStock} style={s.stockForm}>
                {[
                  { key: "symbol", placeholder: "Symbol (e.g. WIPRO)" },
                  { key: "name", placeholder: "Company Name" },
                  { key: "currentPrice", placeholder: "Current Price", type: "number" },
                  { key: "sector", placeholder: "Sector" },
                ].map((field) => (
                  <input
                    key={field.key}
                    type={field.type || "text"}
                    placeholder={field.placeholder}
                    value={newStock[field.key]}
                    onChange={e => setNewStock({ ...newStock, [field.key]: e.target.value })}
                    required={field.key !== "sector"}
                    style={s.formInput}
                    onFocus={e => e.target.style.borderColor = "rgba(0,212,255,0.4)"}
                    onBlur={e => e.target.style.borderColor = "rgba(0,212,255,0.08)"}
                  />
                ))}
                <button type="submit" style={s.addBtn} className="add-btn">
                  + Add Stock
                </button>
              </form>
            </div>

            {/* Stocks List */}
            <div style={s.section}>
              <div style={s.sectionHeader}>
                <div style={s.sectionTitleWrap}>
                  <div style={s.sectionDot} />
                  <h2 style={s.sectionTitle}>All Stocks</h2>
                  <span style={s.sectionCount}>{stocks.length} listed</span>
                </div>
              </div>
              <div style={s.tableWrapper}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      <th style={s.th}>Symbol</th>
                      <th style={s.th}>Company</th>
                      <th style={s.th}>Price</th>
                      <th style={s.th}>Sector</th>
                      <th style={s.th}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stocks.map((stock) => (
                      <tr
                        key={stock._id}
                        style={s.tr}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(0,212,255,0.025)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <td style={s.td}><span style={s.symbol}>{stock.symbol}</span></td>
                        <td style={s.td}><span style={{ color: "#ccccdd", fontWeight: 500 }}>{stock.name}</span></td>
                        <td style={s.td}><span style={{ color: "#fff", fontWeight: 700 }}>₹{stock.currentPrice.toLocaleString("en-IN")}</span></td>
                        <td style={s.td}><span style={s.sectorBadge}>{stock.sector}</span></td>
                        <td style={s.td}><span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#00ff88", background: "rgba(0,255,136,0.07)", border: "1px solid rgba(0,255,136,0.15)", padding: "0.2rem 0.6rem", borderRadius: 20 }}>● Active</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── TRANSACTIONS ── */}
        {activeTab === "transactions" && (
          <div style={s.section}>
            <div style={s.sectionHeader}>
              <div style={s.sectionTitleWrap}>
                <div style={s.sectionDot} />
                <h2 style={s.sectionTitle}>All Transactions</h2>
                <span style={s.sectionCount}>{transactions.length} records</span>
              </div>
            </div>
            <div style={s.tableWrapper}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>User</th>
                    <th style={s.th}>Type</th>
                    <th style={s.th}>Symbol</th>
                    <th style={s.th}>Qty</th>
                    <th style={s.th}>Price</th>
                    <th style={s.th}>Total</th>
                    <th style={s.th}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr
                      key={tx._id}
                      style={s.tr}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(0,212,255,0.025)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={s.td}>
                        <div style={s.userCell}>
                          <div style={s.userAvatar}>{tx.user?.name?.charAt(0)}</div>
                          <div>
                            <p style={{ color: "#fff", fontSize: "0.825rem", fontWeight: 700 }}>{tx.user?.name}</p>
                            <p style={{ color: "#8888aa", fontSize: "0.72rem" }}>{tx.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td style={s.td}>
                        <span style={{ color: tx.type === "BUY" ? "#00d4ff" : "#ff4466", fontWeight: 800, fontSize: "0.775rem", letterSpacing: "0.05em" }}>
                          {tx.type}
                        </span>
                      </td>
                      <td style={s.td}><span style={s.symbol}>{tx.symbol}</span></td>
                      <td style={s.td}><span style={{ color: "#fff", fontWeight: 700 }}>{tx.quantity}</span></td>
                      <td style={s.td}><span style={{ color: "#ccccdd", fontWeight: 600 }}>₹{tx.price.toLocaleString("en-IN")}</span></td>
                      <td style={s.td}><span style={{ color: "#fff", fontWeight: 800 }}>₹{tx.totalAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span></td>
                      <td style={s.td}><span style={{ color: "#8888aa", fontSize: "0.775rem" }}>{new Date(tx.createdAt).toLocaleDateString("en-IN")}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AdminStatCard({ title, value, icon, color }) {
  return (
    <div
      style={s.statCard}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${color}33`;
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.3), 0 0 30px ${color}12`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "rgba(0,212,255,0.08)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${color}50, transparent)` }} />
      <div style={{ width: 46, height: 46, borderRadius: 12, background: `${color}12`, border: `1px solid ${color}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: "0.68rem", color: "#8888aa", marginBottom: "0.3rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>{title}</p>
        <p style={{ fontSize: "1.3rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", fontFamily: "'Syne', sans-serif" }}>{value}</p>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "#05050f", fontFamily: "'Syne', sans-serif" },

  nav: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.5rem", background: "rgba(5,5,15,0.92)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(168,85,247,0.12)" },
  navLeft: { display: "flex", alignItems: "center", gap: "0.75rem" },
  logoIcon: { width: 34, height: 34, borderRadius: 9, background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" },
  logoText: { fontSize: "0.9rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" },
  adminBadge: { fontSize: "0.6rem", fontWeight: 800, color: "#a855f7", background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)", padding: "0.2rem 0.5rem", borderRadius: 4, letterSpacing: "0.1em" },
  navRight: { display: "flex", alignItems: "center", gap: "0.75rem" },
  navUserChip: { display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.3rem 0.625rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8 },
  navAvatar: { width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg, #a855f7, #6633cc)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 800, color: "#fff" },
  navUserName: { fontSize: "0.8rem", fontWeight: 700, color: "#fff" },
  logoutBtn: { padding: "0.4rem 0.875rem", background: "rgba(255,68,102,0.08)", border: "1px solid rgba(255,68,102,0.15)", borderRadius: 8, color: "#ff4466", cursor: "pointer", fontSize: "0.775rem", fontWeight: 800, fontFamily: "'Syne', sans-serif", transition: "all 0.2s" },

  container: { padding: "1.5rem", maxWidth: 1400, margin: "0 auto" },

  tabsWrap: { display: "flex", gap: 0, marginBottom: "1.5rem", borderBottom: "1px solid rgba(0,212,255,0.06)", position: "relative" },
  tab: { padding: "0.75rem 1.25rem", background: "transparent", border: "none", color: "#8888aa", fontSize: "0.825rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Syne', sans-serif", letterSpacing: "0.02em", position: "relative", transition: "color 0.2s" },
  tabActive: { color: "#00d4ff" },
  tabUnderline: { position: "absolute", bottom: -1, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #00d4ff, #0066ff)", borderRadius: 1 },

  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" },
  statCard: { background: "rgba(13,13,26,0.85)", border: "1px solid rgba(0,212,255,0.08)", borderRadius: 14, padding: "1.375rem", display: "flex", alignItems: "center", gap: "1rem", backdropFilter: "blur(10px)", transition: "all 0.3s", position: "relative", overflow: "hidden", cursor: "default" },

  section: { background: "rgba(13,13,26,0.85)", border: "1px solid rgba(0,212,255,0.08)", borderRadius: 14, overflow: "hidden", backdropFilter: "blur(10px)", marginBottom: "1rem" },
  sectionHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.125rem 1.5rem", borderBottom: "1px solid rgba(0,212,255,0.06)", background: "rgba(0,212,255,0.02)" },
  sectionTitleWrap: { display: "flex", alignItems: "center", gap: "0.625rem" },
  sectionDot: { width: 6, height: 6, borderRadius: "50%", background: "#00d4ff", boxShadow: "0 0 8px #00d4ff" },
  sectionTitle: { fontSize: "0.9rem", fontWeight: 800, color: "#fff" },
  sectionCount: { fontSize: "0.7rem", color: "#8888aa", background: "rgba(255,255,255,0.05)", padding: "0.15rem 0.5rem", borderRadius: 20, fontWeight: 600 },

  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "0.75rem 1.25rem", textAlign: "left", fontSize: "0.68rem", color: "#8888aa", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, background: "rgba(0,212,255,0.02)", borderBottom: "1px solid rgba(0,212,255,0.06)" },
  tr: { borderBottom: "1px solid rgba(0,212,255,0.04)", transition: "background 0.15s" },
  td: { padding: "0.875rem 1.25rem" },

  symbol: { fontWeight: 800, color: "#00d4ff", fontSize: "0.85rem", letterSpacing: "0.03em" },
  sectorBadge: { fontSize: "0.7rem", color: "#8888aa", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", padding: "0.2rem 0.6rem", borderRadius: 20, fontWeight: 600 },
  roleBadge: { fontSize: "0.68rem", fontWeight: 800, padding: "0.2rem 0.6rem", borderRadius: 20, letterSpacing: "0.05em" },
  userCell: { display: "flex", alignItems: "center", gap: "0.625rem" },
  userAvatar: { width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #00d4ff, #0066ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 800, color: "#000", flexShrink: 0 },

  stockForm: { display: "flex", gap: "0.75rem", padding: "1.25rem", flexWrap: "wrap", alignItems: "center" },
  formInput: { padding: "0.625rem 0.875rem", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(0,212,255,0.08)", borderRadius: 9, color: "#fff", fontSize: "0.825rem", outline: "none", flex: 1, minWidth: 140, fontFamily: "'Syne', sans-serif", transition: "border-color 0.2s" },
  addBtn: { padding: "0.625rem 1.5rem", background: "linear-gradient(135deg, #00d4ff, #0066ff)", border: "none", borderRadius: 9, color: "#000", fontWeight: 900, cursor: "pointer", fontFamily: "'Syne', sans-serif", fontSize: "0.825rem", letterSpacing: "0.02em", transition: "all 0.2s" },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&display=swap');
  .admin-logout-btn:hover { background: rgba(255,68,102,0.15) !important; transform: scale(1.03); }
  .add-btn:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 20px rgba(0,212,255,0.3) !important; }
  @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.5); } }
  .pulse { animation: pulse 1.5s ease-in-out infinite; }
`;