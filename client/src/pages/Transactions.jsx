import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownLeft, History } from "lucide-react";
import Navbar from "../components/Navbar";
import API from "../services/api";
import toast from "react-hot-toast";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => { fetchTransactions(); }, []);

  const fetchTransactions = async () => {
    try {
      const { data } = await API.get("/trade/transactions");
      setTransactions(data);
    } catch (error) {
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const filtered = transactions.filter(t => filter === "ALL" ? true : t.type === filter);
  const totalBought = transactions.filter(t => t.type === "BUY").reduce((s, t) => s + t.totalAmount, 0);
  const totalSold = transactions.filter(t => t.type === "SELL").reduce((s, t) => s + t.totalAmount, 0);

  return (
    <div style={s.page}>
      <style>{css}</style>
      <Navbar />

      <div style={s.container}>
        <div style={s.pageHeader}>
          <h1 style={s.pageTitle}>Transaction History</h1>
          <p style={s.pageSubtitle}>Complete record of all your trades</p>
        </div>

        {/* Summary */}
        <div style={s.summaryGrid}>
          <SummaryCard label="Total Transactions" value={transactions.length} color="#00d4ff" />
          <SummaryCard label="Total Bought" value={`₹${totalBought.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`} color="#00d4ff" valueColor="#00d4ff" />
          <SummaryCard label="Total Sold" value={`₹${totalSold.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`} color="#ff4466" valueColor="#ff4466" />
        </div>

        {/* Table */}
        <div style={s.section}>
          <div style={s.sectionHeader}>
            <div style={s.sectionTitleWrap}>
              <div style={s.sectionDot} />
              <h2 style={s.sectionTitle}>All Trades</h2>
              <span style={s.sectionCount}>{filtered.length} records</span>
            </div>
            <div style={s.filterGroup}>
              {["ALL", "BUY", "SELL"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    ...s.filterBtn,
                    ...(filter === f ? {
                      color: f === "SELL" ? "#ff4466" : "#00d4ff",
                      background: f === "SELL" ? "rgba(255,68,102,0.08)" : "rgba(0,212,255,0.08)",
                      border: `1px solid ${f === "SELL" ? "rgba(255,68,102,0.25)" : "rgba(0,212,255,0.25)"}`,
                    } : {}),
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={s.loading}>
              <div style={s.loadingDot} className="pulse" />
              Loading transactions...
            </div>
          ) : filtered.length === 0 ? (
            <div style={s.empty}>
              <History size={52} color="rgba(0,212,255,0.15)" />
              <p style={s.emptyTitle}>No transactions yet</p>
              <p style={s.emptySubtitle}>Your trade history will appear here</p>
            </div>
          ) : (
            <div style={s.tableWrapper}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Type</th>
                    <th style={s.th}>Symbol</th>
                    <th style={s.th}>Company</th>
                    <th style={s.th}>Quantity</th>
                    <th style={s.th}>Price</th>
                    <th style={s.th}>Total</th>
                    <th style={s.th}>Status</th>
                    <th style={s.th}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((tx) => (
                    <tr
                      key={tx._id}
                      style={s.tr}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(0,212,255,0.025)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={s.td}>
                        <div style={s.typeCell}>
                          <div style={{
                            ...s.typeIcon,
                            background: tx.type === "BUY" ? "rgba(0,212,255,0.08)" : "rgba(255,68,102,0.08)",
                            border: `1px solid ${tx.type === "BUY" ? "rgba(0,212,255,0.15)" : "rgba(255,68,102,0.15)"}`,
                          }}>
                            {tx.type === "BUY"
                              ? <ArrowDownLeft size={13} color="#00d4ff" />
                              : <ArrowUpRight size={13} color="#ff4466" />}
                          </div>
                          <span style={{ color: tx.type === "BUY" ? "#00d4ff" : "#ff4466", fontWeight: 800, fontSize: "0.775rem", letterSpacing: "0.05em" }}>
                            {tx.type}
                          </span>
                        </div>
                      </td>
                      <td style={s.td}><span style={s.symbol}>{tx.symbol}</span></td>
                      <td style={s.td}><span style={s.companyName}>{tx.stock?.name || "—"}</span></td>
                      <td style={s.td}><span style={s.qty}>{tx.quantity}</span></td>
                      <td style={s.td}><span style={s.numVal}>₹{tx.price.toLocaleString("en-IN")}</span></td>
                      <td style={s.td}>
                        <span style={{ fontWeight: 800, color: "#fff", fontSize: "0.875rem" }}>
                          ₹{tx.totalAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                        </span>
                      </td>
                      <td style={s.td}>
                        <span style={s.statusBadge}>✓ {tx.status}</span>
                      </td>
                      <td style={s.td}>
                        <span style={s.dateVal}>
                          {new Date(tx.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
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

  summaryGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" },
  summaryCard: { background: "rgba(13,13,26,0.85)", border: "1px solid rgba(0,212,255,0.08)", borderRadius: 14, padding: "1.375rem", backdropFilter: "blur(10px)", transition: "all 0.3s", position: "relative", overflow: "hidden", cursor: "default" },

  section: { background: "rgba(13,13,26,0.85)", border: "1px solid rgba(0,212,255,0.08)", borderRadius: 14, overflow: "hidden", backdropFilter: "blur(10px)" },
  sectionHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.125rem 1.5rem", borderBottom: "1px solid rgba(0,212,255,0.06)", background: "rgba(0,212,255,0.02)" },
  sectionTitleWrap: { display: "flex", alignItems: "center", gap: "0.625rem" },
  sectionDot: { width: 6, height: 6, borderRadius: "50%", background: "#00d4ff", boxShadow: "0 0 8px #00d4ff" },
  sectionTitle: { fontSize: "0.9rem", fontWeight: 800, color: "#fff" },
  sectionCount: { fontSize: "0.7rem", color: "#8888aa", background: "rgba(255,255,255,0.05)", padding: "0.15rem 0.5rem", borderRadius: 20, fontWeight: 600 },

  filterGroup: { display: "flex", gap: "0.5rem" },
  filterBtn: { padding: "0.375rem 0.875rem", background: "transparent", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 7, color: "#8888aa", fontSize: "0.75rem", fontWeight: 800, cursor: "pointer", fontFamily: "'Syne', sans-serif", letterSpacing: "0.05em", transition: "all 0.2s" },

  loading: { padding: "3rem", textAlign: "center", color: "#8888aa", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", fontSize: "0.875rem" },
  loadingDot: { width: 8, height: 8, borderRadius: "50%", background: "#00d4ff" },
  empty: { padding: "5rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" },
  emptyTitle: { color: "#fff", fontWeight: 800, fontSize: "1rem" },
  emptySubtitle: { color: "#8888aa", fontSize: "0.825rem" },

  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "0.75rem 1.25rem", textAlign: "left", fontSize: "0.68rem", color: "#8888aa", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, background: "rgba(0,212,255,0.02)", borderBottom: "1px solid rgba(0,212,255,0.06)" },
  tr: { borderBottom: "1px solid rgba(0,212,255,0.04)", transition: "background 0.15s" },
  td: { padding: "0.875rem 1.25rem" },

  typeCell: { display: "flex", alignItems: "center", gap: "0.5rem" },
  typeIcon: { width: 28, height: 28, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" },
  symbol: { fontWeight: 800, color: "#00d4ff", fontSize: "0.85rem", letterSpacing: "0.03em" },
  companyName: { color: "#ccccdd", fontSize: "0.85rem", fontWeight: 500 },
  qty: { fontWeight: 800, color: "#fff" },
  numVal: { color: "#ccccdd", fontWeight: 600, fontSize: "0.85rem" },
  statusBadge: { fontSize: "0.7rem", fontWeight: 700, color: "#00ff88", background: "rgba(0,255,136,0.07)", border: "1px solid rgba(0,255,136,0.15)", padding: "0.2rem 0.6rem", borderRadius: 20 },
  dateVal: { color: "#8888aa", fontSize: "0.775rem", fontWeight: 500 },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&display=swap');
  @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.5); } }
  .pulse { animation: pulse 1.5s ease-in-out infinite; }
`;