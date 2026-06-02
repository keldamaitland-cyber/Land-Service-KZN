import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function QRCodeTab() {
  const [appUrl, setAppUrl] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const url = window.location.origin + window.location.pathname.replace(/\/$/, "");
    setAppUrl(url);
  }, []);

  function handlePrint() {
    const printContent = printRef.current;
    if (!printContent) return;
    const win = window.open("", "_blank", "width=800,height=900");
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8"/>
        <title>Land Service Camp 2026 — QR Code</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Cinzel:wght@400;600;700&family=Lato:wght@300;400;700&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Lato', sans-serif;
            background: #fff;
            display: flex; align-items: center; justify-content: center;
            min-height: 100vh; padding: 32px;
          }
          .poster {
            border: 3px solid #1a4731;
            border-radius: 16px;
            padding: 48px 40px;
            max-width: 520px;
            width: 100%;
            text-align: center;
            position: relative;
          }
          .poster::before {
            content: '';
            position: absolute; inset: 6px;
            border: 1px solid #c9a227;
            border-radius: 12px;
            pointer-events: none;
          }
          .eyebrow {
            font-family: 'Cinzel', serif;
            font-size: 0.65rem;
            letter-spacing: 0.35em;
            color: #c9a227;
            text-transform: uppercase;
            margin-bottom: 10px;
          }
          h1 {
            font-family: 'Cinzel Decorative', serif;
            font-size: 1.7rem;
            font-weight: 900;
            color: #1a4731;
            line-height: 1.2;
            margin-bottom: 4px;
          }
          h1 span { color: #c9a227; }
          .sub {
            font-family: 'Cinzel', serif;
            font-size: 0.7rem;
            letter-spacing: 0.15em;
            color: #555;
            margin-bottom: 28px;
          }
          .divider {
            display: flex; align-items: center; gap: 12px;
            margin: 0 auto 28px;
            max-width: 300px;
          }
          .divider-line { flex:1; height:1px; background: #c9a227; }
          .divider-diamond { width:7px; height:7px; background:#c9a227; transform:rotate(45deg); flex-shrink:0; }
          .qr-wrap {
            display: inline-block;
            padding: 16px;
            border: 2px solid #c9a227;
            border-radius: 12px;
            background: #fdfaf3;
            box-shadow: 0 4px 20px rgba(26,71,49,0.12);
            margin-bottom: 24px;
          }
          .instructions {
            font-family: 'Cinzel', serif;
            font-size: 0.78rem;
            letter-spacing: 0.12em;
            color: #1a4731;
            text-transform: uppercase;
            margin-bottom: 8px;
          }
          .url-display {
            font-family: 'Lato', sans-serif;
            font-size: 0.72rem;
            color: #888;
            word-break: break-all;
            margin-bottom: 24px;
          }
          .footer-divider {
            display: flex; align-items: center; gap: 12px; margin-bottom: 14px;
          }
          .footer-divider hr { flex:1; border:none; border-top:1px solid #e0d8c0; }
          .footer {
            font-family: 'Cinzel', serif;
            font-size: 0.6rem;
            letter-spacing: 0.18em;
            color: #aaa;
            text-transform: uppercase;
          }
          .pillars {
            display: flex; justify-content: center; gap: 16px;
            margin-bottom: 24px; flex-wrap: wrap;
          }
          .pillar {
            font-family: 'Cinzel', serif;
            font-size: 0.62rem;
            letter-spacing: 0.1em;
            color: #1a4731;
            text-transform: uppercase;
            background: #f5e4a0;
            padding: 4px 10px;
            border-radius: 20px;
          }
        </style>
      </head>
      <body>
        <div class="poster">
          <div class="eyebrow">KwaZulu-Natal · 2026</div>
          <h1>Land Service<br/><span>National Camp</span></h1>
          <div class="sub">Richmond · KZN · Building Tomorrow's Leaders</div>
          <div class="divider">
            <div class="divider-line"></div>
            <div class="divider-diamond"></div>
            <div class="divider-line"></div>
          </div>
          <div class="pillars">
            <span class="pillar">📋 Sign In</span>
            <span class="pillar">📅 Schedule</span>
            <span class="pillar">🎨 Arts & Crafts</span>
            <span class="pillar">🌍 KZN Trivia</span>
          </div>
          <div class="qr-wrap">
            ${printRef.current?.querySelector("svg")?.outerHTML ?? ""}
          </div>
          <div class="instructions">Scan to access the camp app</div>
          <div class="url-display">${appUrl}</div>
          <div class="footer-divider"><hr/><div class="divider-diamond" style="width:6px;height:6px;background:#c9a227;transform:rotate(45deg);flex-shrink:0;"></div><hr/></div>
          <div class="footer">Land Service KZN National Camp 2026 &nbsp;✦&nbsp; Richmond, KwaZulu-Natal</div>
        </div>
      </body>
      </html>
    `);
    win.document.close();
    setTimeout(() => { win.print(); }, 600);
  }

  return (
    <div className="card" style={{ maxWidth: 560, margin: "0 auto" }}>
      <div className="card-title"><span className="icon">📱</span> QR Code — Camp App Access</div>

      <p style={{ fontSize: "0.88rem", color: "var(--gold-pale)", marginBottom: "24px", lineHeight: 1.6 }}>
        Print this page and pin it to your noticeboard. Campers scan the code to open the app directly on their phones — no typing needed.
      </p>

      {/* Noticeboard poster preview */}
      <div
        ref={printRef}
        style={{
          background: "rgba(253,250,243,0.06)",
          border: "2px solid rgba(201,162,39,0.35)",
          borderRadius: "12px",
          padding: "32px 24px",
          textAlign: "center",
          position: "relative",
          marginBottom: "24px",
        }}
      >
        {/* Inner border accent */}
        <div style={{
          position: "absolute", inset: 6,
          border: "1px solid rgba(201,162,39,0.15)",
          borderRadius: "8px",
          pointerEvents: "none",
        }} />

        <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.65rem", letterSpacing: "0.32em", color: "var(--gold)", textTransform: "uppercase", marginBottom: "8px" }}>
          KwaZulu-Natal · 2026
        </div>
        <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: "clamp(1.1rem, 3vw, 1.6rem)", fontWeight: 900, color: "var(--white)", lineHeight: 1.2, marginBottom: "4px" }}>
          Land Service<br />
          <span style={{ color: "var(--gold-light)" }}>National Camp</span>
        </div>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.68rem", letterSpacing: "0.15em", color: "var(--gold-pale)", marginBottom: "20px" }}>
          Richmond · KZN
        </div>

        {/* Pillar badges */}
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
          {["📋 Sign In", "📅 Schedule", "🎨 Arts & Crafts", "🌍 KZN Trivia"].map((p) => (
            <span key={p} style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.6rem",
              letterSpacing: "0.08em",
              background: "rgba(201,162,39,0.15)",
              border: "1px solid rgba(201,162,39,0.3)",
              color: "var(--gold-pale)",
              padding: "3px 10px",
              borderRadius: "20px",
              textTransform: "uppercase",
            }}>
              {p}
            </span>
          ))}
        </div>

        {/* QR Code */}
        <div style={{
          display: "inline-block",
          padding: "16px",
          background: "#fdfaf3",
          border: "2px solid var(--gold)",
          borderRadius: "10px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
          marginBottom: "16px",
        }}>
          {appUrl ? (
            <QRCodeSVG
              value={appUrl}
              size={200}
              bgColor="#fdfaf3"
              fgColor="#0e2a1c"
              level="M"
              marginSize={1}
            />
          ) : (
            <div style={{ width: 200, height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold-pale)", fontSize: "0.8rem" }}>
              Loading…
            </div>
          )}
        </div>

        <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.75rem", letterSpacing: "0.14em", color: "var(--gold)", textTransform: "uppercase", marginBottom: "6px" }}>
          Scan to access the camp app
        </div>
        <div style={{ fontSize: "0.72rem", color: "rgba(253,250,243,0.45)", wordBreak: "break-all", marginBottom: "16px" }}>
          {appUrl || "Loading URL…"}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
          <div style={{ flex: 1, height: 1, background: "rgba(201,162,39,0.2)" }} />
          <div style={{ width: 6, height: 6, background: "var(--gold)", transform: "rotate(45deg)", flexShrink: 0 }} />
          <div style={{ flex: 1, height: 1, background: "rgba(201,162,39,0.2)" }} />
        </div>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.58rem", letterSpacing: "0.18em", color: "rgba(201,162,39,0.35)", textTransform: "uppercase" }}>
          Land Service KZN National Camp 2026 · Richmond, KwaZulu-Natal
        </div>
      </div>

      {/* Instructions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
        {[
          { icon: "📱", title: "Android", text: "Open Chrome → scan or go to URL → Add to Home Screen" },
          { icon: "🍎", title: "iPhone / iPad", text: "Open Safari → scan or go to URL → Share → Add to Home Screen" },
        ].map((item) => (
          <div key={item.title} style={{ background: "rgba(14,42,28,0.5)", border: "1px solid rgba(201,162,39,0.15)", borderRadius: "6px", padding: "12px 14px" }}>
            <div style={{ fontSize: "1.2rem", marginBottom: "4px" }}>{item.icon}</div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.72rem", color: "var(--gold)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>{item.title}</div>
            <div style={{ fontSize: "0.78rem", color: "var(--off-white)", lineHeight: 1.45 }}>{item.text}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button
          onClick={handlePrint}
          className="btn-primary"
          style={{ flex: 1 }}
        >
          🖨 Print / Save as PDF
        </button>
        <button
          onClick={() => appUrl && navigator.clipboard.writeText(appUrl)}
          style={{
            padding: "14px 20px",
            background: "rgba(201,162,39,0.1)",
            border: "1px solid rgba(201,162,39,0.3)",
            borderRadius: "4px",
            color: "var(--gold-light)",
            fontFamily: "'Cinzel', serif",
            fontSize: "0.8rem",
            letterSpacing: "0.1em",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          📋 Copy URL
        </button>
      </div>
    </div>
  );
}
