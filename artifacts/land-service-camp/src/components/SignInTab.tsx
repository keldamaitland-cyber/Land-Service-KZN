import { useState } from "react";
import type { SignInRecord } from "../App";

const SHEET_WEBHOOK_URL = import.meta.env.VITE_SHEET_WEBHOOK_URL || "YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";

async function postToSheet(data: object) {
  if (SHEET_WEBHOOK_URL === "YOUR_APPS_SCRIPT_WEB_APP_URL_HERE") {
    console.log("Sheet webhook not configured. Data:", data);
    return true;
  }
  try {
    await fetch(SHEET_WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return true;
  } catch (e) {
    console.error("Sheet post error:", e);
    return false;
  }
}

const REGIONS = [
  "Durban North", "Durban South", "Pietermaritzburg", "Richards Bay",
  "Ladysmith", "Newcastle", "South Coast", "Midlands", "Other KZN",
];

const ROLES = [
  "Camper (Youth)", "Junior Leader", "Senior Leader",
  "Group Leader", "Volunteer / Staff", "Facilitator",
];

const ROLE_COLORS: Record<string, string> = {
  "Camper (Youth)":    "#2d7a52",
  "Junior Leader":     "#c9a227",
  "Senior Leader":     "#e8c35a",
  "Group Leader":      "#f5a623",
  "Volunteer / Staff": "#7ec8a0",
  "Facilitator":       "#a8d8c0",
};

interface Props {
  onSignIn: (record: SignInRecord) => void;
  signIns: SignInRecord[];
}

function AttendanceWidget({ signIns }: { signIns: SignInRecord[] }) {
  const total = signIns.length;

  const regionCounts: Record<string, number> = {};
  for (const s of signIns) {
    const r = s.region || "Unknown";
    regionCounts[r] = (regionCounts[r] || 0) + 1;
  }

  const roleCounts: Record<string, number> = {};
  for (const s of signIns) {
    const r = s.role || "Unknown";
    roleCounts[r] = (roleCounts[r] || 0) + 1;
  }

  const maxRegion = Math.max(...Object.values(regionCounts), 1);
  const recent = [...signIns].reverse().slice(0, 5);

  return (
    <div className="card">
      <div className="card-title">
        <span className="icon">📊</span> Live Attendance
        {total > 0 && (
          <span style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "#4ade80",
              boxShadow: "0 0 6px #4ade80",
              animation: "pulse 2s infinite",
              display: "inline-block",
            }} />
            <span style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "#4ade80",
              letterSpacing: 0,
            }}>Live</span>
          </span>
        )}
      </div>

      {/* Total counter */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: "16px 0 20px",
        borderBottom: "1px solid rgba(201,162,39,0.12)",
        marginBottom: 20,
        flexWrap: "wrap",
      }}>
        <div style={{ textAlign: "center", minWidth: 80 }}>
          <div style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: "clamp(2.2rem, 6vw, 3rem)",
            fontWeight: 900,
            color: "var(--gold-light)",
            lineHeight: 1,
          }}>{total}</div>
          <div style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "0.62rem",
            letterSpacing: "0.2em",
            color: "var(--gold)",
            textTransform: "uppercase",
            marginTop: 4,
          }}>Registered</div>
        </div>

        {/* Role pill breakdown */}
        <div style={{ flex: 1, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
          {total === 0 ? (
            <span style={{ fontSize: "0.85rem", color: "rgba(253,250,243,0.35)", fontStyle: "italic" }}>
              No sign-ins yet — be the first!
            </span>
          ) : (
            ROLES.filter(r => roleCounts[r]).map(role => (
              <div key={role} style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                background: "rgba(14,42,28,0.5)",
                border: "1px solid rgba(201,162,39,0.15)",
                borderRadius: 20,
                padding: "4px 10px 4px 7px",
              }}>
                <span style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: ROLE_COLORS[role] || "var(--gold)",
                  flexShrink: 0,
                }} />
                <span style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.78rem", color: "var(--off-white)" }}>
                  {role}
                </span>
                <span style={{
                  fontFamily: "'Lato', sans-serif",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: ROLE_COLORS[role] || "var(--gold)",
                  marginLeft: 3,
                }}>
                  {roleCounts[role]}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Regional breakdown */}
      {total > 0 && (
        <>
          <div style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "0.72rem",
            letterSpacing: "0.18em",
            color: "var(--gold)",
            textTransform: "uppercase",
            marginBottom: 12,
          }}>By Region</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            {REGIONS.filter(r => regionCounts[r]).sort((a, b) => (regionCounts[b] || 0) - (regionCounts[a] || 0)).map(region => {
              const count = regionCounts[region] || 0;
              const pct = Math.round((count / maxRegion) * 100);
              return (
                <div key={region} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    fontFamily: "'Lato', sans-serif",
                    fontSize: "0.82rem",
                    color: "var(--off-white)",
                    width: 160,
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>
                    {region}
                  </div>
                  <div style={{
                    flex: 1,
                    height: 8,
                    background: "rgba(14,42,28,0.6)",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}>
                    <div style={{
                      height: "100%",
                      width: `${pct}%`,
                      background: "linear-gradient(90deg, var(--gold), var(--gold-light))",
                      borderRadius: 4,
                      transition: "width 0.6s ease",
                    }} />
                  </div>
                  <div style={{
                    fontFamily: "'Lato', sans-serif",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: "var(--gold-light)",
                    width: 24,
                    textAlign: "right",
                    flexShrink: 0,
                  }}>
                    {count}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent arrivals */}
          <div style={{
            borderTop: "1px solid rgba(201,162,39,0.12)",
            paddingTop: 16,
          }}>
            <div style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.72rem",
              letterSpacing: "0.18em",
              color: "var(--gold)",
              textTransform: "uppercase",
              marginBottom: 10,
            }}>Recent Arrivals</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {recent.map((s, i) => (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "6px 10px",
                  background: i === 0 ? "rgba(201,162,39,0.08)" : "rgba(14,42,28,0.35)",
                  border: `1px solid ${i === 0 ? "rgba(201,162,39,0.25)" : "rgba(201,162,39,0.08)"}`,
                  borderRadius: 5,
                }}>
                  {i === 0 && (
                    <span style={{ fontSize: "0.7rem" }}>✦</span>
                  )}
                  <span style={{
                    fontFamily: "'Lato', sans-serif",
                    fontSize: "0.88rem",
                    fontWeight: i === 0 ? 700 : 400,
                    color: i === 0 ? "var(--white)" : "var(--off-white)",
                    flex: 1,
                  }}>
                    {s.name || "Anonymous"}
                  </span>
                  {s.region && (
                    <span style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: "0.62rem",
                      letterSpacing: "0.08em",
                      color: "var(--gold-pale)",
                      textTransform: "uppercase",
                    }}>
                      {s.region}
                    </span>
                  )}
                  {s.role && (
                    <span style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: ROLE_COLORS[s.role] || "var(--gold)",
                      flexShrink: 0,
                    }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}

export default function SignInTab({ onSignIn, signIns }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", region: "", role: "", phone: "", emergency: "", medical: ""
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const record: SignInRecord = { timestamp: new Date().toISOString(), ...form };
    await postToSheet({ type: "signin", ...record });
    onSignIn(record);
    setSubmitted(true);
  }

  return (
    <>
      {/* Live attendance — shown above form so leaders see it immediately */}
      <AttendanceWidget signIns={signIns} />

      <div className="card">
        <div className="card-title"><span className="icon">📋</span> Camper Sign In</div>
        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                type="text"
                name="name"
                placeholder="Enter your full name"
                required
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Region / Group</label>
                <select className="form-input" name="region" value={form.region} onChange={handleChange}>
                  <option value="">— Select Region —</option>
                  {REGIONS.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-input" name="role" value={form.role} onChange={handleChange}>
                  <option value="">— Select Role —</option>
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Contact Number</label>
              <input
                className="form-input"
                type="tel"
                name="phone"
                placeholder="e.g. 082 000 0000"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Emergency Contact Name &amp; Number</label>
              <input
                className="form-input"
                type="text"
                name="emergency"
                placeholder="Name — 082 000 0000"
                value={form.emergency}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Dietary / Medical Notes (if any)</label>
              <textarea
                className="form-input"
                name="medical"
                placeholder="Allergies, medication, special dietary requirements..."
                value={form.medical}
                onChange={handleChange}
                style={{ resize: "vertical", minHeight: "90px" }}
              />
            </div>
            <button type="submit" className="btn-primary">✦ Sign In to Camp ✦</button>
          </form>
        ) : (
          <div className="success-msg">
            ✦ You are signed in! Your details have been recorded. Welcome to Camp! ✦
          </div>
        )}
        {import.meta.env.VITE_GOOGLE_SHEET_URL && (
          <div className="sheet-link">
            📊 All sign-ins sync to the camp register:&nbsp;
            <a href={import.meta.env.VITE_GOOGLE_SHEET_URL} target="_blank" rel="noreferrer">
              Open Google Sheet ↗
            </a>
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-title"><span className="icon">ℹ️</span> Camp Information</div>
        <div className="info-grid">
          <div className="info-item">
            <div className="label">Location</div>
            <div className="value">Richmond, KwaZulu-Natal Midlands</div>
          </div>
          <div className="info-item">
            <div className="label">Year</div>
            <div className="value">2026 National Camp</div>
          </div>
          <div className="info-item">
            <div className="label">Theme</div>
            <div className="value">4 Pillars of Land Service</div>
          </div>
          <div className="info-item">
            <div className="label">Province</div>
            <div className="value">KwaZulu-Natal</div>
          </div>
        </div>
      </div>
    </>
  );
}
