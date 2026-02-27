import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, PieChart } from "lucide-react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import toast from "react-hot-toast";

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sellModal, setSellModal] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selling, setSelling] = useState(false);

  useEffect(() => { fetchPortfolio(); }, []);

  const fetchPortfolio = async () => {
    try {
      const { data } = await API.get("/trade/portfolio");
      setPortfolio(data);
    } catch (error) {
      toast.error("Failed to load portfolio");
    } finally {
      setLoading(false);
    }
  };

  const handleSell = async () => {
    if (quantity < 1) return toast.error("Quantity must be at least 1");
    if (quantity > sellModal.quantity) return toast.error("Not enough shares");
    setSelling(true);
    try {
      const { data } = await API.post("/trade/sell", {
        symbol: sellModal.symbol,
        quantity: parseInt(quantity),
      });
      toast.success(data.message);
      setSellModal(null);
      setQuantity(1);
      fetchPortfolio();
    } catch (error) {
      toast.error(error.response?.data?.message || "Sell failed");
    } finally {
      setSelling(false);
    }
  };

  const totalInvested = portfolio.reduce((s, h) => s + h.totalInvested, 0);
  const totalValue = portfolio.reduce((s, h) => s + h.currentValue, 0);
  const totalPnL = totalValue - totalInvested;

  return (
    <div style={s.page}>
      <style>{css}</style>
      <Navbar />

      <div style={s.container}>

        {/* Page Header */}
        <div style={s.pageHeader}>
          <div>
            <h1 style={s.pageTitle}>Portfolio</h1>
            <p style={s.pageSubtitle}>Your holdings and performance</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={s.summaryGrid}>
          <SummaryCard label="Total Invested" value={`₹${totalInvested.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`} color="#00d4ff" />
          <SummaryCard label="Current Value" value={`₹${totalValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`} color="#a855f7" />
          <SummaryCard
            label="Overall P&L"
            value={`${totalPnL >= 0 ? "+" : ""}₹${totalPnL.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
            color={totalPnL >= 0 ? "#00ff88" : "#ff4466"}
            valueColor={totalPnL >= 0 ? "#00ff88" : "#ff4466"}
          />
          <SummaryCard label="Holdings" value={`${portfolio.length} Stocks`} color="#f59e0b" />
        </div>

        {/* Holdings Table */}
        <div style={s.section}>
          <div style={s.sectionHeader}>
            <div style={s.sectionTitleWrap}>
              <div style={s.sectionDot} />
              <h2 style={s.sectionTitle}>Holdings</h2>
              <span style={s.sectionCount}>{portfolio.length} positions</span>
            </div>
          </div>

          {loading ? (
            <div style={s.loading}>
              <div style={s.loadingDot} className="pulse" />
              Loading portfolio...
            </div>
          ) : portfolio.length === 0 ? (
            <div style={s.empty}>
              <PieChart size={52} color="rgba(0,212,255,0.15)" />
              <p style={s.emptyTitle}>No holdings yet</p>
              <p style={s.emptySubtitle}>Go to Dashboard and buy your first stock</p>
            </div>
          ) : (
            <div style={s.tableWrapper}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Symbol</th>
                    <th style={s.th}>Company</th>
                    <th style={s.th}>Qty</th>
                    <th style={s.th}>Avg Buy</th>
                    <th style={s.th}>Current</th>
                    <th style={s.th}>Invested</th>
                    <th style={s.th}>Value</th>
                    <th style={s.th}>P&L</th>
                    <th style={s.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.map((h) => (
                    <tr
                      key={h.symbol}
                      style={s.tr}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(0,212,255,0.025)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={s.td}><span style={s.symbol}>{h.symbol}</span></td>
                      <td style={s.td}><span style={s.companyName}>{h.name}</span></td>
                      <td style={s.td}><span style={s.qty}>{h.quantity}</span></td>
                      <td style={s.td}><span style={s.numVal}>₹{h.averageBuyPrice.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span></td>
                      <td style={s.td}><span style={s.numVal}>₹{h.currentPrice.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span></td>
                      <td style={s.td}><span style={s.numVal}>₹{h.totalInvested.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span></td>
                      <td style={s.td}><span style={s.numVal}>₹{h.currentValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span></td>
                      <td style={s.td}>
                        <div style={s.pnlCell}>
                          {h.profitLoss >= 0
                            ? <TrendingUp size={13} color="#00ff88" />
                            : <TrendingDown size={13} color="#ff4466" />}
                          <div>
                            <span style={{ color: h.profitLoss >= 0 ? "#00ff88" : "#ff4466", fontWeight: 800, fontSize: "0.8rem", display: "block" }}>
                              {h.profitLoss >= 0 ? "+" : ""}₹{h.profitLoss.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                            </span>
                            <span style={{ color: h.profitLoss >= 0 ? "#00ff8880" : "#ff446680", fontSize: "0.68rem" }}>
                              {h.profitLossPercent}%
                            </span>
                          </div>
                        </div>
                      </td>
                      <td style={s.td}>
                        <button
                          onClick={() => { setSellModal(h); setQuantity(1); }}
                          style={s.sellBtn}
                          className="sell-btn"
                        >
                          Sell
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

      {/* Sell Modal */}
      {sellModal && (
        <div style={s.overlay} onClick={() => setSellModal(null)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.modalGlow} />
            <div style={s.modalHeader}>
              <div>
                <h3 style={s.modalTitle}>Sell {sellModal.symbol}</h3>
                <p style={s.modalCompany}>{sellModal.name}</p>
              </div>
              <span style={{ ...s.modalBadge, color: "#ff4466", background: "rgba(255,68,102,0.08)", border: "1px solid rgba(255,68,102,0.2)" }}>SELL</span>
            </div>

            <div style={s.modalInfoGrid}>
              <div style={s.modalInfoItem}>
                <span style={s.modalInfoLabel}>Current Price</span>
                <span style={s.modalInfoValue}>₹{sellModal.currentPrice.toLocaleString("en-IN")}</span>
              </div>
              <div style={s.modalInfoItem}>
                <span style={s.modalInfoLabel}>You Own</span>
                <span style={s.modalInfoValue}>{sellModal.quantity} shares</span>
              </div>
              <div style={{ ...s.modalInfoItem, gridColumn: "span 2", background: "rgba(0,255,136,0.04)", border: "1px solid rgba(0,255,136,0.12)" }}>
                <span style={s.modalInfoLabel}>Total Revenue</span>
                <span style={{ ...s.modalInfoValue, color: "#00ff88", fontSize: "1.1rem" }}>
                  ₹{(sellModal.currentPrice * quantity).toLocaleString("en-IN")}
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
                  onChange={e => setQuantity(Math.max(1, Math.min(sellModal.quantity, parseInt(e.target.value) || 1)))}
                  style={s.qtyInput}
                  min="1"
                  max={sellModal.quantity}
                />
                <button onClick={() => setQuantity(Math.min(sellModal.quantity, quantity + 1))} style={s.qtyBtn}>+</button>
              </div>
            </div>

            <div style={s.modalActions}>
              <button onClick={() => setSellModal(null)} style={s.cancelBtn}>Cancel</button>
              <button
                onClick={handleSell}
                disabled={selling}
                style={{ ...s.confirmSellBtn, opacity: selling ? 0.7 : 1 }}
                className="confirm-sell-btn"
              >
                {selling ? "Processing..." : `Sell ${quantity} Share${quantity > 1 ? "s" : ""}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value, color, valueColor }) {
  return (
    <div
      style={s.summaryCard}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${color}30`;
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.3), 0 0 30px ${color}10`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "rgba(0,212,255,0.08)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${color}50, transparent)` }} />
      <p style={{ fontSize: "0.68rem", color: "#8888aa", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: "0.5rem" }}>{label}</p>
      <p style={{ fontSize: "1.3rem", fontWeight: 900, color: valueColor || "#fff", letterSpacing: "-0.03em", fontFamily: "'Syne', sans-serif" }}>{value}</p>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "#05050f", fontFamily: "'Syne', sans-serif" },
  container: { padding: "1.5rem", maxWidth: 1400, margin: "0 auto" },
  pageHeader: { marginBottom: "1.5rem" },
  pageTitle: { fontSize: "1.5rem", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", marginBottom: "0.25rem" },
  pageSubtitle: { color: "#8888aa", fontSize: "0.825rem", fontWeight: 500 },

  summaryGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" },
  summaryCard: {
    background: "rgba(13,13,26,0.85)", border: "1px solid rgba(0,212,255,0.08)",
    borderRadius: 14, padding: "1.375rem",
    backdropFilter: "blur(10px)", transition: "all 0.3s",
    position: "relative", overflow: "hidden", cursor: "default",
  },

  section: { background: "rgba(13,13,26,0.85)", border: "1px solid rgba(0,212,255,0.08)", borderRadius: 14, overflow: "hidden", backdropFilter: "blur(10px)" },
  sectionHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.125rem 1.5rem", borderBottom: "1px solid rgba(0,212,255,0.06)", background: "rgba(0,212,255,0.02)" },
  sectionTitleWrap: { display: "flex", alignItems: "center", gap: "0.625rem" },
  sectionDot: { width: 6, height: 6, borderRadius: "50%", background: "#00d4ff", boxShadow: "0 0 8px #00d4ff" },
  sectionTitle: { fontSize: "0.9rem", fontWeight: 800, color: "#fff" },
  sectionCount: { fontSize: "0.7rem", color: "#8888aa", background: "rgba(255,255,255,0.05)", padding: "0.15rem 0.5rem", borderRadius: 20, fontWeight: 600 },

  loading: { padding: "3rem", textAlign: "center", color: "#8888aa", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", fontSize: "0.875rem" },
  loadingDot: { width: 8, height: 8, borderRadius: "50%", background: "#00d4ff" },
  empty: { padding: "5rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" },
  emptyTitle: { color: "#fff", fontWeight: 800, fontSize: "1rem" },
  emptySubtitle: { color: "#8888aa", fontSize: "0.825rem" },

  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "0.75rem 1.25rem", textAlign: "left", fontSize: "0.68rem", color: "#8888aa", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, background: "rgba(0,212,255,0.02)", borderBottom: "1px solid rgba(0,212,255,0.06)" },
  tr: { borderBottom: "1px solid rgba(0,212,255,0.04)", transition: "background 0.15s" },
  td: { padding: "0.875rem 1.25rem", fontSize: "0.85rem" },

  symbol: { fontWeight: 800, color: "#00d4ff", fontSize: "0.85rem", letterSpacing: "0.03em" },
  companyName: { color: "#ccccdd", fontWeight: 500 },
  qty: { fontWeight: 800, color: "#fff", fontSize: "0.875rem" },
  numVal: { color: "#ccccdd", fontWeight: 600 },
  pnlCell: { display: "flex", alignItems: "center", gap: "0.4rem" },

  sellBtn: { padding: "0.4rem 1rem", background: "rgba(255,68,102,0.08)", border: "1px solid rgba(255,68,102,0.2)", borderRadius: 7, color: "#ff4466", fontWeight: 800, fontSize: "0.775rem", cursor: "pointer", fontFamily: "'Syne', sans-serif", transition: "all 0.2s" },

  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.78)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 },
  modal: { background: "rgba(10,10,20,0.97)", border: "1px solid rgba(0,212,255,0.15)", borderRadius: 18, padding: "2rem", width: "100%", maxWidth: 400, boxShadow: "0 40px 80px rgba(0,0,0,0.6)", position: "relative", overflow: "hidden", fontFamily: "'Syne', sans-serif" },
  modalGlow: { position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,68,102,0.5), transparent)" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" },
  modalTitle: { fontSize: "1.2rem", fontWeight: 900, color: "#fff", marginBottom: "0.2rem", letterSpacing: "-0.02em" },
  modalCompany: { fontSize: "0.8rem", color: "#8888aa" },
  modalBadge: { fontSize: "0.65rem", fontWeight: 800, padding: "0.25rem 0.625rem", borderRadius: 20, letterSpacing: "0.08em" },
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
  cancelBtn: { flex: 1, padding: "0.75rem", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 9, color: "#8888aa", cursor: "pointer", fontFamily: "'Syne', sans-serif", fontWeight: 600 },
  confirmSellBtn: { flex: 2, padding: "0.75rem", background: "linear-gradient(135deg, #ff4466, #cc2244)", border: "none", borderRadius: 9, color: "#fff", fontWeight: 900, fontSize: "0.875rem", cursor: "pointer", fontFamily: "'Syne', sans-serif" },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&display=swap');
  .sell-btn:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 20px rgba(255,68,102,0.25) !important; background: rgba(255,68,102,0.15) !important; }
  .confirm-sell-btn:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 25px rgba(255,68,102,0.4) !important; }
  @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.5); } }
  .pulse { animation: pulse 1.5s ease-in-out infinite; }
`;