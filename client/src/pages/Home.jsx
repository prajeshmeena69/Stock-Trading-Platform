import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const STOCKS = [
  { symbol: "RELIANCE", price: "₹2,850.75", change: "+1.07%" },
  { symbol: "TCS", price: "₹3,920.40", change: "+0.78%" },
  { symbol: "INFY", price: "₹1,478.90", change: "+0.93%" },
  { symbol: "HDFCBANK", price: "₹1,642.55", change: "+0.75%" },
  { symbol: "WIPRO", price: "₹456.80", change: "+1.23%" },
  { symbol: "SBIN", price: "₹745.20", change: "+0.89%" },
  { symbol: "TATAMOTORS", price: "₹812.60", change: "+1.71%" },
  { symbol: "BAJFINANCE", price: "₹6,985.45", change: "+0.94%" },
  { symbol: "MARUTI", price: "₹10,845.60", change: "+1.17%" },
  { symbol: "SUNPHARMA", price: "₹1,678.45", change: "+1.46%" },
];

const FEATURES = [
  { icon: "⚡", title: "Instant Execution", desc: "Trades execute in milliseconds. No delays, no slippage. Pure paper trading precision." },
  { icon: "🛡️", title: "Risk-Free Trading", desc: "Start with ₹1,00,000 virtual capital. Learn the market without risking real money." },
  { icon: "📊", title: "Live Portfolio Tracking", desc: "Real-time P&L, average buy price, and sector-wise breakdown of your holdings." },
  { icon: "🔐", title: "Secure by Design", desc: "JWT authentication, bcrypt hashing, and role-based access control built in." },
  { icon: "🖥️", title: "Terminal-Grade UI", desc: "Designed for traders who demand clarity. Every pixel serves a purpose." },
  { icon: "📈", title: "15+ Indian Stocks", desc: "Trade RELIANCE, TCS, INFY, HDFC and more from India's top market players." },
];

const STATS = [
  { value: "15+", label: "Listed Stocks" },
  { value: "₹1L", label: "Starting Balance" },
  { value: "100%", label: "Risk Free" },
  { value: "24/7", label: "Always On" },
];

function Counter({ target }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const num = parseFloat(target.replace(/[^0-9.]/g, ""));
          const duration = 1500;
          const steps = 60;
          const increment = num / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= num) {
              setCount(num);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {target.startsWith("₹") ? `₹${count}L` : target.endsWith("%") ? `${count}%` : target.endsWith("+") ? `${count}+` : target}
    </span>
  );
}

export default function Home() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouse = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: `${Math.random() * 100}%`,
    size: `${Math.random() * 3 + 1}px`,
    dur: `${Math.random() * 15 + 10}s`,
    delay: `${Math.random() * 10}s`,
    dx: `${(Math.random() - 0.5) * 200}px`,
    color: i % 3 === 0 ? "rgba(0,212,255,0.6)" : i % 3 === 1 ? "rgba(0,255,136,0.4)" : "rgba(0,102,255,0.5)",
  }));

  return (
    <div style={s.root}>
      <style>{css}</style>

      {/* Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            "--x": p.x,
            "--size": p.size,
            "--dur": p.dur,
            "--delay": p.delay,
            "--dx": p.dx,
            "--color": p.color,
          }}
        />
      ))}

      {/* Scan sweep */}
      <div className="scan-sweep" />

      {/* Cursor glow */}
      <div style={{ ...s.cursorGlow, left: mousePos.x - 200, top: mousePos.y - 200 }} />

      {/* Grid + scanlines */}
      <div style={s.gridBg} />
      <div style={s.scanlines} />

      {/* ═══ NAVBAR ═══ */}
      <nav style={s.nav}>
        <div style={s.navInner}>
          <div style={s.navLogo}>
            <div style={s.navLogoIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" stroke="#00d4ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="16 7 22 7 22 13" stroke="#00d4ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={s.navLogoText}>Stock Trading Platform</span>
            <span style={s.navBeta}>BETA</span>
          </div>
          <div style={s.navLinks}>
            <Link to="/login" style={s.navLoginBtn}>Sign In</Link>
            <Link to="/register" style={s.navRegisterBtn}>Start Trading →</Link>
          </div>
        </div>
      </nav>

      {/* ═══ TICKER ═══ */}
      <div style={s.tickerBar}>
        <div style={s.tickerTrack} className="ticker-scroll">
          {[...STOCKS, ...STOCKS].map((s2, i) => (
            <span key={i} style={s.tickerItem}>
              <span style={s.tickerSymbol}>{s2.symbol}</span>
              <span style={s.tickerPrice}>{s2.price}</span>
              <span style={s.tickerChange}>{s2.change}</span>
              <span style={s.tickerDot}>◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══ HERO ═══ */}
      <section style={s.hero}>
        <div className="orbit-ring-1" />
        <div className="orbit-ring-2" />
        <div className="orbit-ring-3" />
        <div style={{ ...s.orb, ...s.orb1 }} />
        <div style={{ ...s.orb, ...s.orb2 }} />

        <div style={s.heroInner}>
          <div style={s.heroBadge} className="fade-up-1">
            <span className="pulse-dot" style={s.heroBadgeDot} />
            &nbsp;&nbsp;PAPER TRADING PLATFORM — INDIA
          </div>

          <h1 style={s.heroTitle} className="fade-up-2">
            <span className="glitch-wrap" data-text="Trade Smarter." style={s.heroTitleLine1}>
              Trade Smarter.
            </span>
            <br />
            <span style={s.heroTitleLine2}>
              Risk{" "}
              <span className="glitch-wrap neon-flicker" data-text="Nothing." style={s.heroTitleAccent}>
                Nothing.
              </span>
            </span>
          </h1>

          <p style={s.heroSubtitle} className="fade-up-3">
            <span className="typewriter">
              Master the Indian stock market with ₹1,00,000 virtual capital. Real stocks. Zero risk.
            </span>
          </p>

          <div style={s.heroCtas} className="fade-up-4">
            <Link to="/register" style={s.ctaPrimary} className="cta-primary">
              <span>Launch Terminal</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link to="/login" style={s.ctaSecondary}>Sign In</Link>
          </div>

          <div style={{ ...s.terminalCard, position: "relative" }} className="fade-up-5">
            <div className="terminal-corner corner-tl" />
            <div className="terminal-corner corner-tr" />
            <div className="terminal-corner corner-bl" />
            <div className="terminal-corner corner-br" />
            <div style={s.terminalHeader}>
              <div style={s.terminalDots}>
                <span style={{ ...s.dot, background: "#ff5f56" }} />
                <span style={{ ...s.dot, background: "#ffbd2e" }} />
                <span style={{ ...s.dot, background: "#27c93f" }} />
              </div>
              <span style={s.terminalTitle}>MARKET_TERMINAL_v2.4</span>
              <span style={s.terminalStatus}>● LIVE</span>
            </div>
            <div style={s.terminalBody}>
              {STOCKS.slice(0, 5).map((stock, i) => (
                <div key={i} style={s.terminalRow} className="terminal-row-animate">
                  <span style={s.terminalSymbol}>{stock.symbol}</span>
                  <div style={s.terminalBar}>
                    <div
                      className="bar-grow"
                      style={{
                        ...s.terminalBarFill,
                        "--target-w": `${40 + i * 12}%`,
                        "--bar-delay": `${0.8 + i * 0.15}s`,
                      }}
                    />
                  </div>
                  <span style={s.terminalPrice}>{stock.price}</span>
                  <span style={s.terminalChange}>{stock.change}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section style={s.statsSection}>
        <div style={s.statsSectionInner}>
          {STATS.map((stat, i) => (
            <div key={i} style={s.statItem} className="stat-float">
              <div style={s.statValue} className="shimmer-text">
                <Counter target={stat.value} />
              </div>
              <div style={s.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section style={s.featuresSection}>
        <div style={s.featuresInner}>
          <div style={s.sectionLabel}>CAPABILITIES</div>
          <h2 style={s.sectionTitle}>
            Built for traders who{" "}
            <span style={s.sectionTitleAccent}>demand more.</span>
          </h2>
          <div style={s.featuresGrid}>
            {FEATURES.map((f, i) => (
              <div key={i} style={s.featureCard} className="feature-card">
                <div style={s.featureIcon} className="feature-icon-el">{f.icon}</div>
                <h3 style={s.featureTitle}>{f.title}</h3>
                <p style={s.featureDesc}>{f.desc}</p>
                <div style={s.featureGlow} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MARKET PREVIEW ═══ */}
      <section style={s.marketSection}>
        <div style={s.marketInner}>
          <div style={s.sectionLabel}>LIVE MARKET</div>
          <h2 style={s.sectionTitle}>
            15+ stocks.{" "}
            <span style={s.sectionTitleAccent}>Real prices.</span>
          </h2>
          <div style={s.marketGrid}>
            {STOCKS.map((stock, i) => (
              <div key={i} style={s.marketCard} className="market-card">
                <div style={s.marketCardTop}>
                  <span style={s.marketSymbol}>{stock.symbol}</span>
                  <span style={s.marketChangeBadge}>{stock.change}</span>
                </div>
                <div style={s.marketPrice}>{stock.price}</div>
                <div style={s.marketSparkline}>
                  {[40,55,45,60,50,70,65,75,68,80].map((h, j) => (
                    <div key={j} style={{ ...s.sparkBar, height: `${h}%`, opacity: 0.3 + j * 0.07 }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={s.ctaSection}>
        <div style={s.ctaSectionInner}>
          <div style={s.ctaBigOrb} />
          <div style={s.sectionLabel}>GET STARTED</div>
          <h2 style={s.ctaTitle}>
            Your trading journey<br />
            <span style={s.sectionTitleAccent}>starts now.</span>
          </h2>
          <p style={s.ctaSubtitle}>Join traders learning the market. No real money needed.</p>
          <Link to="/register" style={s.ctaBigBtn} className="cta-primary">
            <span>Create Free Account</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={s.footer}>
        <div style={s.footerInner}>
          <div style={s.footerLogo}>
            <div style={s.navLogoIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" stroke="#00d4ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="16 7 22 7 22 13" stroke="#00d4ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={s.footerLogoText}>Stock Trading Platform</span>
          </div>
          <p style={s.footerNote}>For educational purposes only. Not real financial advice.</p>
          <div style={s.footerLinks}>
            <Link to="/login" style={s.footerLink}>Sign In</Link>
            <Link to="/register" style={s.footerLink}>Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ══════════════════════════════════════
// STYLES
// ══════════════════════════════════════
const s = {
  root: { minHeight: "100vh", background: "#05050f", color: "#fff", fontFamily: "'Syne', sans-serif", overflowX: "hidden", position: "relative" },
  cursorGlow: { position: "fixed", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0, transition: "left 0.08s, top 0.08s" },
  gridBg: { position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none", zIndex: 0 },
  scanlines: { position: "fixed", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)", pointerEvents: "none", zIndex: 0 },
  nav: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, borderBottom: "1px solid rgba(0,212,255,0.08)", backdropFilter: "blur(20px)", background: "rgba(5,5,15,0.85)" },
  navInner: { maxWidth: 1200, margin: "0 auto", padding: "0 2rem", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" },
  navLogo: { display: "flex", alignItems: "center", gap: "0.75rem" },
  navLogoIcon: { width: 36, height: 36, borderRadius: 10, background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" },
  navLogoText: { fontSize: "0.95rem", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" },
  navBeta: { fontSize: "0.6rem", fontWeight: 800, color: "#00d4ff", background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)", padding: "0.15rem 0.4rem", borderRadius: 4, letterSpacing: "0.1em" },
  navLinks: { display: "flex", alignItems: "center", gap: "0.75rem" },
  navLoginBtn: { padding: "0.5rem 1rem", color: "#8888aa", textDecoration: "none", fontSize: "0.875rem", fontWeight: 500 },
  navRegisterBtn: { padding: "0.5rem 1.25rem", background: "linear-gradient(135deg, #00d4ff, #0066ff)", borderRadius: 8, color: "#000", textDecoration: "none", fontSize: "0.875rem", fontWeight: 800 },
  tickerBar: { position: "fixed", top: 64, left: 0, right: 0, zIndex: 99, height: 36, background: "rgba(0,212,255,0.04)", borderBottom: "1px solid rgba(0,212,255,0.08)", overflow: "hidden", display: "flex", alignItems: "center" },
  tickerTrack: { display: "flex", alignItems: "center", whiteSpace: "nowrap" },
  tickerItem: { display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0 1.5rem" },
  tickerSymbol: { fontSize: "0.7rem", fontWeight: 800, color: "#00d4ff", letterSpacing: "0.05em" },
  tickerPrice: { fontSize: "0.7rem", color: "#ffffff", fontWeight: 600 },
  tickerChange: { fontSize: "0.7rem", color: "#00ff88", fontWeight: 700 },
  tickerDot: { fontSize: "0.4rem", color: "rgba(0,212,255,0.3)" },
  hero: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 120, paddingBottom: 80, position: "relative", zIndex: 1, overflow: "hidden" },
  heroInner: { maxWidth: 1200, margin: "0 auto", padding: "0 2rem", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", position: "relative", zIndex: 2 },
  orb: { position: "absolute", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" },
  orb1: { width: 600, height: 600, background: "radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)", top: "10%", left: "50%", transform: "translateX(-50%)" },
  orb2: { width: 400, height: 400, background: "radial-gradient(circle, rgba(0,102,255,0.06) 0%, transparent 70%)", top: "40%", right: "10%" },
  heroBadge: { display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 1rem", background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.15)", borderRadius: 20, fontSize: "0.7rem", fontWeight: 700, color: "#00d4ff", letterSpacing: "0.1em", marginBottom: "2rem" },
  heroBadgeDot: { width: 6, height: 6, borderRadius: "50%", background: "#00ff88", boxShadow: "0 0 6px #00ff88", display: "inline-block" },
  heroTitle: { fontSize: "clamp(3rem, 8vw, 7rem)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.04em", marginBottom: "1.5rem" },
  heroTitleLine1: { color: "#ffffff" },
  heroTitleLine2: { color: "#ffffff" },
  heroTitleAccent: { color: "transparent", WebkitTextStroke: "2px #00d4ff", textShadow: "0 0 40px rgba(0,212,255,0.4)" },
  heroSubtitle: { fontSize: "1.1rem", color: "#8888aa", lineHeight: 1.7, marginBottom: "2.5rem", maxWidth: 500 },
  heroCtas: { display: "flex", gap: "1rem", alignItems: "center", marginBottom: "4rem" },
  ctaPrimary: { display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.875rem 2rem", background: "linear-gradient(135deg, #00d4ff, #0066ff)", borderRadius: 10, color: "#000", textDecoration: "none", fontWeight: 800, fontSize: "0.95rem", boxShadow: "0 0 40px rgba(0,212,255,0.25)" },
  ctaSecondary: { padding: "0.875rem 1.5rem", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#ffffff", textDecoration: "none", fontWeight: 600, fontSize: "0.875rem" },
  terminalCard: { width: "100%", maxWidth: 600, background: "rgba(10,10,20,0.85)", border: "1px solid rgba(0,212,255,0.15)", borderRadius: 16, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(0,212,255,0.06)", backdropFilter: "blur(20px)" },
  terminalHeader: { display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1.25rem", borderBottom: "1px solid rgba(0,212,255,0.08)", background: "rgba(0,212,255,0.03)" },
  terminalDots: { display: "flex", gap: "0.375rem" },
  dot: { width: 10, height: 10, borderRadius: "50%" },
  terminalTitle: { flex: 1, fontSize: "0.7rem", fontWeight: 700, color: "#00d4ff", letterSpacing: "0.1em" },
  terminalStatus: { fontSize: "0.65rem", color: "#00ff88", fontWeight: 700 },
  terminalBody: { padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.875rem" },
  terminalRow: { display: "flex", alignItems: "center", gap: "0.875rem" },
  terminalSymbol: { width: 100, fontSize: "0.75rem", fontWeight: 800, color: "#00d4ff", letterSpacing: "0.05em", textAlign: "left" },
  terminalBar: { flex: 1, height: 4, background: "rgba(0,212,255,0.08)", borderRadius: 2, overflow: "hidden" },
  terminalBarFill: { height: "100%", background: "linear-gradient(90deg, #00d4ff, #0066ff)", borderRadius: 2, boxShadow: "0 0 8px rgba(0,212,255,0.4)" },
  terminalPrice: { width: 90, fontSize: "0.8rem", fontWeight: 700, color: "#ffffff", textAlign: "right" },
  terminalChange: { width: 60, fontSize: "0.75rem", fontWeight: 700, color: "#00ff88", textAlign: "right" },
  statsSection: { position: "relative", zIndex: 1, borderTop: "1px solid rgba(0,212,255,0.06)", borderBottom: "1px solid rgba(0,212,255,0.06)", background: "rgba(0,212,255,0.02)" },
  statsSectionInner: { maxWidth: 1200, margin: "0 auto", padding: "3rem 2rem", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2rem" },
  statItem: { textAlign: "center", padding: "1rem" },
  statValue: { fontSize: "2.5rem", fontWeight: 900, color: "#00d4ff", letterSpacing: "-0.04em", marginBottom: "0.5rem" },
  statLabel: { fontSize: "0.75rem", fontWeight: 700, color: "#8888aa", textTransform: "uppercase", letterSpacing: "0.1em" },
  featuresSection: { position: "relative", zIndex: 1, padding: "8rem 2rem" },
  featuresInner: { maxWidth: 1200, margin: "0 auto" },
  sectionLabel: { fontSize: "0.65rem", fontWeight: 800, color: "#00d4ff", letterSpacing: "0.2em", marginBottom: "1rem", textTransform: "uppercase" },
  sectionTitle: { fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "3rem", lineHeight: 1.1 },
  sectionTitleAccent: { color: "transparent", WebkitTextStroke: "1.5px #00d4ff" },
  featuresGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" },
  featureCard: { position: "relative", padding: "2rem", background: "rgba(10,10,20,0.6)", border: "1px solid rgba(0,212,255,0.08)", borderRadius: 16, overflow: "hidden", cursor: "default" },
  featureIcon: { fontSize: "1.75rem", marginBottom: "1rem", display: "inline-block", transition: "transform 0.3s ease" },
  featureTitle: { fontSize: "1rem", fontWeight: 800, color: "#ffffff", marginBottom: "0.625rem", letterSpacing: "-0.02em" },
  featureDesc: { fontSize: "0.85rem", color: "#8888aa", lineHeight: 1.6 },
  featureGlow: { position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.3), transparent)" },
  marketSection: { position: "relative", zIndex: 1, padding: "4rem 2rem 8rem" },
  marketInner: { maxWidth: 1200, margin: "0 auto" },
  marketGrid: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1rem" },
  marketCard: { padding: "1.25rem", background: "rgba(10,10,20,0.6)", border: "1px solid rgba(0,212,255,0.08)", borderRadius: 12, cursor: "default" },
  marketCardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.625rem" },
  marketSymbol: { fontSize: "0.75rem", fontWeight: 800, color: "#00d4ff", letterSpacing: "0.05em" },
  marketChangeBadge: { fontSize: "0.65rem", fontWeight: 700, color: "#00ff88", background: "rgba(0,255,136,0.08)", padding: "0.15rem 0.4rem", borderRadius: 4 },
  marketPrice: { fontSize: "0.875rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.875rem" },
  marketSparkline: { display: "flex", alignItems: "flex-end", gap: 2, height: 28 },
  sparkBar: { flex: 1, background: "linear-gradient(180deg, #00d4ff, #0066ff)", borderRadius: 2, minHeight: 2 },
  ctaSection: { position: "relative", zIndex: 1, padding: "8rem 2rem", textAlign: "center", overflow: "hidden" },
  ctaSectionInner: { maxWidth: 600, margin: "0 auto", position: "relative" },
  ctaBigOrb: { position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none" },
  ctaTitle: { fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: "1.25rem" },
  ctaSubtitle: { fontSize: "1rem", color: "#8888aa", marginBottom: "2.5rem" },
  ctaBigBtn: { display: "inline-flex", alignItems: "center", gap: "0.625rem", padding: "1rem 2.5rem", background: "linear-gradient(135deg, #00d4ff, #0066ff)", borderRadius: 12, color: "#000", textDecoration: "none", fontWeight: 800, fontSize: "1rem", boxShadow: "0 0 60px rgba(0,212,255,0.3)" },
  footer: { position: "relative", zIndex: 1, borderTop: "1px solid rgba(0,212,255,0.06)", padding: "2rem" },
  footerInner: { maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" },
  footerLogo: { display: "flex", alignItems: "center", gap: "0.625rem" },
  footerLogoText: { fontSize: "0.875rem", fontWeight: 700, color: "#ffffff" },
  footerNote: { fontSize: "0.75rem", color: "#55556a" },
  footerLinks: { display: "flex", gap: "1.5rem" },
  footerLink: { fontSize: "0.8rem", color: "#8888aa", textDecoration: "none" },
};

// ══════════════════════════════════════
// CSS ANIMATIONS
// ══════════════════════════════════════
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&display=swap');

  @keyframes ticker {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .ticker-scroll { animation: ticker 30s linear infinite; }

  @keyframes blastIn {
    0%   { opacity: 0; transform: translateY(60px) scale(0.92); }
    60%  { opacity: 1; transform: translateY(-8px) scale(1.01); }
    80%  { transform: translateY(4px) scale(0.99); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
  .fade-up-1 { animation: blastIn 0.8s cubic-bezier(0.22,1,0.36,1) 0.0s forwards; opacity: 0; }
  .fade-up-2 { animation: blastIn 0.8s cubic-bezier(0.22,1,0.36,1) 0.15s forwards; opacity: 0; }
  .fade-up-3 { animation: blastIn 0.8s cubic-bezier(0.22,1,0.36,1) 0.28s forwards; opacity: 0; }
  .fade-up-4 { animation: blastIn 0.8s cubic-bezier(0.22,1,0.36,1) 0.40s forwards; opacity: 0; }
  .fade-up-5 { animation: blastIn 0.9s cubic-bezier(0.22,1,0.36,1) 0.55s forwards; opacity: 0; }

  @keyframes glitch {
    0%   { clip-path: inset(0 0 98% 0); transform: translate(-4px,0); opacity:0.8; }
    10%  { clip-path: inset(40% 0 50% 0); transform: translate(4px,0); }
    20%  { clip-path: inset(80% 0 5% 0); transform: translate(-3px,0); }
    30%  { clip-path: inset(20% 0 70% 0); transform: translate(3px,0); }
    40%  { clip-path: inset(60% 0 20% 0); transform: translate(-2px,0); }
    50%  { clip-path: inset(10% 0 85% 0); transform: translate(2px,0); opacity:0.9; }
    100% { clip-path: inset(0 0 98% 0); transform: translate(0); opacity:0; }
  }
  @keyframes glitch2 {
    0%   { clip-path: inset(50% 0 30% 0); transform: translate(4px,0); opacity:0.6; }
    25%  { clip-path: inset(15% 0 75% 0); transform: translate(-4px,0); }
    50%  { clip-path: inset(70% 0 10% 0); transform: translate(3px,0); }
    75%  { clip-path: inset(35% 0 55% 0); transform: translate(-3px,0); }
    100% { clip-path: inset(90% 0 5% 0); transform: translate(0); opacity:0; }
  }
  .glitch-wrap { position: relative; display: inline-block; }
  .glitch-wrap::before, .glitch-wrap::after {
    content: attr(data-text);
    position: absolute;
    inset: 0;
    font-size: inherit;
    font-weight: inherit;
    letter-spacing: inherit;
    line-height: inherit;
  }
  .glitch-wrap::before { color: #00ffff; animation: glitch 4s infinite linear; animation-delay: 2s; }
  .glitch-wrap::after  { color: #ff0066; animation: glitch2 4s infinite linear; animation-delay: 2.15s; }

  @keyframes typewriter {
    from { width: 0; }
    to   { width: 100%; }
  }
  @keyframes blinkCaret {
    0%, 100% { border-color: transparent; }
    50%       { border-color: #00d4ff; }
  }
  .typewriter {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    border-right: 2px solid #00d4ff;
    animation: typewriter 2.5s steps(50,end) 1s forwards, blinkCaret 0.75s step-end infinite;
    width: 0;
  }

  @keyframes pulseRing {
    0%   { transform: scale(0.8); opacity: 0.8; }
    100% { transform: scale(2.5); opacity: 0; }
  }
  .pulse-dot { position: relative; display: inline-block; }
  .pulse-dot::before, .pulse-dot::after {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    background: #00ff88;
    animation: pulseRing 1.8s ease-out infinite;
  }
  .pulse-dot::after { animation-delay: 0.6s; }

  @keyframes orbitSpin        { from { transform: translate(-50%,-50%) rotate(0deg); }   to { transform: translate(-50%,-50%) rotate(360deg); } }
  @keyframes orbitSpinReverse { from { transform: translate(-50%,-50%) rotate(0deg); }   to { transform: translate(-50%,-50%) rotate(-360deg); } }
  .orbit-ring-1 {
    position: absolute; width: 700px; height: 700px; border-radius: 50%;
    border: 1px solid rgba(0,212,255,0.07); border-top-color: rgba(0,212,255,0.3);
    top: 50%; left: 50%;
    animation: orbitSpin 12s linear infinite; pointer-events: none; z-index: 0;
  }
  .orbit-ring-2 {
    position: absolute; width: 550px; height: 550px; border-radius: 50%;
    border: 1px solid rgba(0,102,255,0.06); border-bottom-color: rgba(0,102,255,0.25);
    top: 50%; left: 50%;
    animation: orbitSpinReverse 8s linear infinite; pointer-events: none; z-index: 0;
  }
  .orbit-ring-3 {
    position: absolute; width: 420px; height: 420px; border-radius: 50%;
    border: 1px dashed rgba(0,212,255,0.05); border-right-color: rgba(0,255,136,0.2);
    top: 50%; left: 50%;
    animation: orbitSpin 6s linear infinite; pointer-events: none; z-index: 0;
  }

  @keyframes floatUp {
    0%   { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 0.6; }
    100% { transform: translateY(-100vh) translateX(var(--dx)) scale(0.3); opacity: 0; }
  }
  .particle {
    position: fixed;
    width: var(--size); height: var(--size);
    border-radius: 50%;
    background: var(--color);
    box-shadow: 0 0 6px var(--color);
    bottom: -10px; left: var(--x);
    animation: floatUp var(--dur) ease-in var(--delay) infinite;
    pointer-events: none; z-index: 0;
  }

  @keyframes scanSweep {
    0%   { top: -4px; opacity: 0.6; }
    100% { top: 100vh; opacity: 0; }
  }
  .scan-sweep {
    position: fixed; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, rgba(0,212,255,0.4), transparent);
    animation: scanSweep 6s linear infinite;
    pointer-events: none; z-index: 1;
  }

  @keyframes dataStream {
    0%   { opacity: 0.4; transform: translateX(-4px); }
    50%  { opacity: 1;   transform: translateX(0); }
    100% { opacity: 0.4; transform: translateX(-4px); }
  }
  .terminal-row-animate { animation: dataStream 3s ease-in-out infinite; }
  .terminal-row-animate:nth-child(1) { animation-delay: 0.0s; }
  .terminal-row-animate:nth-child(2) { animation-delay: 0.4s; }
  .terminal-row-animate:nth-child(3) { animation-delay: 0.8s; }
  .terminal-row-animate:nth-child(4) { animation-delay: 1.2s; }
  .terminal-row-animate:nth-child(5) { animation-delay: 1.6s; }

  @keyframes barGrow {
    from { width: 0 !important; }
    to   { width: var(--target-w); }
  }
  .bar-grow {
    animation: barGrow 1.5s cubic-bezier(0.22,1,0.36,1) forwards;
    animation-delay: var(--bar-delay);
    width: 0 !important;
  }

  .feature-card { transition: all 0.35s cubic-bezier(0.22,1,0.36,1) !important; }
  .feature-card:hover {
    border-color: rgba(0,212,255,0.25) !important;
    background: rgba(0,212,255,0.05) !important;
    transform: translateY(-8px) scale(1.01) !important;
    box-shadow: 0 20px 60px rgba(0,212,255,0.08), 0 0 0 1px rgba(0,212,255,0.1) !important;
  }
  .feature-card:hover .feature-icon-el {
    transform: scale(1.2) rotate(-5deg);
    transition: transform 0.3s ease;
  }

  .market-card { transition: all 0.3s cubic-bezier(0.22,1,0.36,1) !important; }
  .market-card:hover {
    border-color: rgba(0,212,255,0.3) !important;
    transform: translateY(-6px) !important;
    box-shadow: 0 16px 40px rgba(0,212,255,0.1) !important;
  }

  .cta-primary { transition: all 0.25s cubic-bezier(0.22,1,0.36,1) !important; position: relative; overflow: hidden; }
  .cta-primary::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent); opacity: 0; transition: opacity 0.2s; }
  .cta-primary:hover::after { opacity: 1; }
  .cta-primary:hover { transform: translateY(-3px) scale(1.03) !important; box-shadow: 0 0 80px rgba(0,212,255,0.5), 0 20px 40px rgba(0,0,0,0.3) !important; }
  .cta-primary:active { transform: translateY(0) scale(0.98) !important; }

  @keyframes floatValue {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-6px); }
  }
  .stat-float { animation: floatValue 4s ease-in-out infinite; }
  .stat-float:nth-child(1) { animation-delay: 0s; }
  .stat-float:nth-child(2) { animation-delay: 0.5s; }
  .stat-float:nth-child(3) { animation-delay: 1s; }
  .stat-float:nth-child(4) { animation-delay: 1.5s; }

  @keyframes neonFlicker {
    0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { text-shadow: 0 0 20px rgba(0,212,255,0.5), 0 0 40px rgba(0,212,255,0.3); }
    20%, 24%, 55% { text-shadow: none; }
  }
  .neon-flicker { animation: neonFlicker 6s infinite; animation-delay: 3s; }

  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  .shimmer-text {
    background: linear-gradient(90deg, #00d4ff 0%, #ffffff 30%, #00d4ff 60%, #0066ff 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }

  .terminal-corner { position: absolute; width: 12px; height: 12px; border-color: rgba(0,212,255,0.5); border-style: solid; }
  .corner-tl { top: 8px; left: 8px; border-width: 1px 0 0 1px; }
  .corner-tr { top: 8px; right: 8px; border-width: 1px 1px 0 0; }
  .corner-bl { bottom: 8px; left: 8px; border-width: 0 0 1px 1px; }
  .corner-br { bottom: 8px; right: 8px; border-width: 0 1px 1px 0; }
`;