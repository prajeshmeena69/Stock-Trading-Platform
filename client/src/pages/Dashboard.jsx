import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, PieChart, Activity } from "lucide-react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { user, refreshUser } = useAuth();
  const [stocks, setStocks] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyModal, setBuyModal] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [buying, setBuying] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [stocksRes, portfolioRes] = await Promise.all([
        API.get("/stocks"),
        API.get("/trade/portfolio"),
      ]);
      setStocks(stocksRes.data);
      setPortfolio(portfolioRes.data);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async () => {
    if (quantity < 1) return toast.error("Quantity must be at least 1");
    setBuying(true);
    try {
      const { data } = await API.post("/trade/buy", {
        symbol: buyModal.symbol,
        quantity: parseInt(quantity),
      });
      toast.success(data.message);
      await refreshUser();
      setBuyModal(null);
      setQuantity(1);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Buy failed");
    } finally {
      setBuying(false);
    }
  };

  const totalInvested = portfolio.reduce((sum, h) => sum + h.totalInvested, 0);
  const totalCurrentValue = portfolio.reduce((sum, h) => sum + h.currentValue, 0);
  const totalPnL = totalCurrentValue - totalInvested;

  const filteredStocks = stocks.filter(
    (s) =>
      s.symbol.toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={s.page}>
      <style>{css}</style>
      <Navbar />

      <div style={s.container}>

        {/* Stats */}
        <div style={s.statsGrid}>
          <StatCard
            title="Available Balance"
            value={`₹${user?.balance?.toLocaleString("en-IN") || 0}`}
            icon={<span style={{ fontSize: "1.1rem", color: "#00d4ff", fontWeight: 900 }}>₹</span>}
            color="#00d4ff"
          />
          <StatCard
            title="Portfolio Value"
            value={`₹${totalCurrentValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
            icon={<PieChart size={20} color="#a855f7" />}
            color="#a855f7"
          />
          <StatCard
            title="Total Invested"
            value={`₹${totalInvested.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
            icon={<Activity size={20} color="#f59e0b" />}
            color="#f59e0b"
          />
          <StatCard
            title="Total P&L"
            value={`${totalPnL >= 0 ? "+" : ""}₹${totalPnL.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
            icon={totalPnL >= 0
              ? <TrendingUp size={20} color="#00ff88" />
              : <TrendingDown size={20} color="#ff4466" />}
            color={totalPnL >= 0 ? "#00ff88" : "#ff4466"}
            valueColor={totalPnL >= 0 ? "#00ff88" : "#ff4466"}
          />
        </div>

        {/* Market Table */}
        <div style={s.section}>
          {/* Section header */}
          <div style={s.sectionHeader}>
            <div style={s.sectionTitleWrap}>
              <div style={s.sectionDot} />
              <h2 style={s.sectionTitle}>Market</h2>
              <span style={s.sectionCount}>{filteredStocks.length} stocks</span>
            </div>
            <input
              type="text"
              placeholder="Search symbol or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={s.searchInput}
              onFocus={e => e.target.style.borderColor = "rgba(0,212,255,0.4)"}
              onBlur={e => e.target.style.borderColor = "rgba(0,212,255,0.08)"}
            />
          </div>

          {loading ? (
            <div style={s.loading}>
              <div style={s.loadingDot} className="pulse" />
              Loading market data...
            </div>
          ) : (
            <div style={s.tableWrapper}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Symbol</th>
                    <th style={s.th}>Company</th>
                    <th style={s.th}>Sector</th>
                    <th style={s.th}>Price</th>
                    <th style={s.th}>Change</th>
                    <th style={s.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStocks.map((stock) => (
                    <tr
                      key={stock._id}
                      style={s.tr}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(0,212,255,0.025)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={s.td}>
                        <span style={s.symbol}>{stock.symbol}</span>
                      </td>
                      <td style={s.td}>
                        <span style={s.companyName}>{stock.name}</span>
                      </td>
                      <td style={s.td}>
                        <span style={s.sectorBadge}>{stock.sector}</span>
                      </td>
                      <td style={s.td}>
                        <span style={s.price}>₹{stock.currentPrice.toLocaleString("en-IN")}</span>
                      </td>
                      <td style={s.td}>
                        <span style={{
                          ...s.changeBadge,
                          color: stock.change >= 0 ? "#00ff88" : "#ff4466",
                          background: stock.change >= 0 ? "rgba(0,255,136,0.08)" : "rgba(255,68,102,0.08)",
                          border: `1px solid ${stock.change >= 0 ? "rgba(0,255,136,0.15)" : "rgba(255,68,102,0.15)"}`,
                        }}>
                          {stock.change >= 0 ? "▲" : "▼"} {stock.changePercent}%
                        </span>
                      </td>
                      <td style={s.td}>
                        <button
                          onClick={() => { setBuyModal(stock); setQuantity(1); }}
                          style={s.buyBtn}
                          className="buy-btn"
                        >
                          Buy
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Buy Modal */}
      {buyModal && (
        <div style={s.overlay} onClick={() => setBuyModal(null)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            {/* Modal glow line */}
            <div style={s.modalGlow} />

            <div style={s.modalHeader}>
              <div>
                <h3 style={s.modalTitle}>Buy {buyModal.symbol}</h3>
                <p style={s.modalCompany}>{buyModal.name}</p>
              </div>
              <span style={s.modalSector}>{buyModal.sector}</span>
            </div>

            <div style={s.modalInfoGrid}>
              <div style={s.modalInfoItem}>
                <span style={s.modalInfoLabel}>Current Price</span>
                <span style={s.modalInfoValue}>₹{buyModal.currentPrice.toLocaleString("en-IN")}</span>
              </div>
              <div style={s.modalInfoItem}>
                <span style={s.modalInfoLabel}>Available</span>
                <span style={s.modalInfoValue}>₹{user?.balance?.toLocaleString("en-IN")}</span>
              </div>
              <div style={{ ...s.modalInfoItem, gridColumn: "span 2", background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.12)" }}>
                <span style={s.modalInfoLabel}>Total Cost</span>
                <span style={{ ...s.modalInfoValue, color: "#00d4ff", fontSize: "1.1rem" }}>
                  ₹{(buyModal.currentPrice * quantity).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div style={s.qtySection}>
              <span style={s.qtyLabel}>Quantity</span>
              <div style={s.qtyRow}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={s.qtyBtn}>−</button>
                <input
                  type="number"
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  style={s.qtyInput}
                  min="1"
                />
                <button onClick={() => setQuantity(quantity + 1)} style={s.qtyBtn}>+</button>
              </div>
            </div>

            <div style={s.modalActions}>
              <button onClick={() => setBuyModal(null)} style={s.cancelBtn}>Cancel</button>
              <button
                onClick={handleBuy}
                disabled={buying}
                style={{ ...s.confirmBtn, opacity: buying ? 0.7 : 1 }}
                className="confirm-btn"
              >
                {buying ? "Processing..." : `Buy ${quantity} Share${quantity > 1 ? "s" : ""}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── STAT CARD ───────────────────────────────────────
function StatCard({ title, value, icon, color, valueColor }) {
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
        <p style={{ fontSize: "1.3rem", fontWeight: 900, color: valueColor || "#fff", letterSpacing: "-0.03em", fontFamily: "'Syne', sans-serif" }}>{value}</p>
      </div>
    </div>
  );
}

// ─── STYLES ──────────────────────────────────────────
const s = {
  page: { minHeight: "100vh", background: "#05050f", fontFamily: "'Syne', sans-serif" },
  container: { padding: "1.5rem", maxWidth: 1400, margin: "0 auto" },

  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" },
  statCard: {
    background: "rgba(13,13,26,0.85)", border: "1px solid rgba(0,212,255,0.08)",
    borderRadius: 14, padding: "1.375rem",
    display: "flex", alignItems: "center", gap: "1rem",
    backdropFilter: "blur(10px)", transition: "all 0.3s",
    position: "relative", overflow: "hidden", cursor: "default",
  },

  section: {
    background: "rgba(13,13,26,0.85)", border: "1px solid rgba(0,212,255,0.08)",
    borderRadius: 14, overflow: "hidden", backdropFilter: "blur(10px)",
  },
  sectionHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "1.125rem 1.5rem", borderBottom: "1px solid rgba(0,212,255,0.06)",
    background: "rgba(0,212,255,0.02)",
  },
  sectionTitleWrap: { display: "flex", alignItems: "center", gap: "0.625rem" },
  sectionDot: { width: 6, height: 6, borderRadius: "50%", background: "#00d4ff", boxShadow: "0 0 8px #00d4ff" },
  sectionTitle: { fontSize: "0.9rem", fontWeight: 800, color: "#fff" },
  sectionCount: { fontSize: "0.7rem", color: "#8888aa", background: "rgba(255,255,255,0.05)", padding: "0.15rem 0.5rem", borderRadius: 20, fontWeight: 600 },
  searchInput: {
    padding: "0.5rem 0.875rem", background: "rgba(0,0,0,0.3)",
    border: "1px solid rgba(0,212,255,0.08)", borderRadius: 8,
    color: "#fff", fontSize: "0.825rem", outline: "none",
    width: 240, fontFamily: "'Syne', sans-serif",
    transition: "border-color 0.2s",
  },

  loading: { padding: "3rem", textAlign: "center", color: "#8888aa", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", fontSize: "0.875rem" },
  loadingDot: { width: 8, height: 8, borderRadius: "50%", background: "#00d4ff" },

  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    padding: "0.75rem 1.5rem", textAlign: "left",
    fontSize: "0.68rem", color: "#8888aa",
    textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700,
    background: "rgba(0,212,255,0.02)",
    borderBottom: "1px solid rgba(0,212,255,0.06)",
  },
  tr: { borderBottom: "1px solid rgba(0,212,255,0.04)", transition: "background 0.15s" },
  td: { padding: "0.9rem 1.5rem" },

  symbol: { fontWeight: 800, color: "#00d4ff", fontSize: "0.85rem", letterSpacing: "0.03em", fontFamily: "'Syne', sans-serif" },
  companyName: { color: "#ccccdd", fontSize: "0.85rem", fontWeight: 500 },
  sectorBadge: { fontSize: "0.7rem", color: "#8888aa", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", padding: "0.2rem 0.6rem", borderRadius: 20, fontWeight: 600 },
  price: { fontWeight: 700, color: "#fff", fontSize: "0.875rem" },
  changeBadge: { fontSize: "0.72rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: 6, display: "inline-block" },
  buyBtn: {
    padding: "0.4rem 1.1rem",
    background: "linear-gradient(135deg, #00d4ff, #0066ff)",
    border: "none", borderRadius: 7,
    color: "#000", fontWeight: 800, fontSize: "0.775rem",
    cursor: "pointer", fontFamily: "'Syne', sans-serif",
    letterSpacing: "0.02em",
    transition: "all 0.2s",
  },

  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 },
  modal: {
    background: "rgba(10,10,20,0.97)", border: "1px solid rgba(0,212,255,0.15)",
    borderRadius: 18, padding: "2rem", width: "100%", maxWidth: 400,
    boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(0,212,255,0.06)",
    position: "relative", overflow: "hidden",
    fontFamily: "'Syne', sans-serif",
  },
  modalGlow: { position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.5), transparent)" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" },
  modalTitle: { fontSize: "1.2rem", fontWeight: 900, color: "#fff", marginBottom: "0.2rem", letterSpacing: "-0.02em" },
  modalCompany: { fontSize: "0.8rem", color: "#8888aa", fontWeight: 500 },
  modalSector: { fontSize: "0.65rem", fontWeight: 700, color: "#00d4ff", background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.2)", padding: "0.25rem 0.625rem", borderRadius: 20, letterSpacing: "0.05em" },

  modalInfoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.5rem" },
  modalInfoItem: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "0.75rem 1rem" },
  modalInfoLabel: { display: "block", fontSize: "0.65rem", color: "#8888aa", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.3rem", fontWeight: 700 },
  modalInfoValue: { display: "block", fontSize: "0.9rem", fontWeight: 800, color: "#fff" },

  qtySection: { marginBottom: "1.5rem" },
  qtyLabel: { fontSize: "0.68rem", color: "#8888aa", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, display: "block", marginBottom: "0.625rem" },
  qtyRow: { display: "flex", alignItems: "center", gap: "0.75rem", width: "100%" },
  qtyBtn: { minWidth: 44, height: 44, background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.15)", borderRadius: 9, color: "#00d4ff", fontSize: "1.4rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontFamily: "'Syne', sans-serif", transition: "all 0.2s", flexShrink: 0 },
  qtyInput: { flex: 1, minWidth: 0, textAlign: "center", padding: "0.625rem", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(0,212,255,0.12)", borderRadius: 9, color: "#fff", fontSize: "1rem", fontWeight: 800, outline: "none", fontFamily: "'Syne', sans-serif" },

  modalActions: { display: "flex", gap: "0.75rem" },
  cancelBtn: { flex: 1, padding: "0.75rem", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 9, color: "#8888aa", cursor: "pointer", fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: "0.875rem" },
  confirmBtn: { flex: 2, padding: "0.75rem", background: "linear-gradient(135deg, #00d4ff, #0066ff)", border: "none", borderRadius: 9, color: "#000", fontWeight: 900, fontSize: "0.875rem", cursor: "pointer", fontFamily: "'Syne', sans-serif", letterSpacing: "0.02em" },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&display=swap');

  .buy-btn:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 20px rgba(0,212,255,0.3) !important;
  }
  .confirm-btn:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 25px rgba(0,212,255,0.4) !important;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.5); }
  }
  .pulse { animation: pulse 1.5s ease-in-out infinite; }
`;