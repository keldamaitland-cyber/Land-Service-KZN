import { useState, useEffect } from "react";
import type { Announcement } from "../hooks/useAnnouncement";

interface SignIn {
  timestamp: string;
  name: string;
  region: string;
  role: string;
  phone: string;
  emergency: string;
  medical: string;
}

const ADMIN_PIN = "2026";

const QUICK_MESSAGES = [
  { label: "⏰ Morning Devotion", text: "Morning Devotion starting now — all campers to the Main Hall." },
  { label: "🍽️ Meal Ready", text: "Meal is ready — please make your way to the Dining Area." },
  { label: "🏕️ Activity Starting", text: "Your next activity is starting — please assemble at your designated area." },
  { label: "📢 All to Main Hall", text: "All campers and leaders: please assemble at the Main Hall immediately." },
  { label: "🌙 Evening Devotion", text: "Evening Devotion & Campfire starting now — make your way to the fire pit." },
  { label: "🚌 Departure Soon", text: "Departure in 30 minutes — please collect your belongings and be ready at the Main Car Park." },
];

function exportCSV(signIns: SignIn[]) {
  const headers = ["#", "Timestamp", "Full Name", "Region / Group", "Role", "Contact Number", "Emergency Contact", "Dietary / Medical Notes"];
  const rows = signIns.map((s, i) => [
    String(i + 1),
    new Date(s.timestamp).toLocaleString("en-ZA"),
    s.name, s.region, s.role, s.phone, s.emergency, s.medical,
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `LS_Camp_2026_SignIns_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const roleBadgeColor: Record<string, string> = {
  "Camper (Youth)": "#1a4731",
  "Junior Leader": "#236040",
  "Senior Leader": "#2d7a52",
  "Group Leader": "#c9a227",
  "Volunteer / Staff": "#7a5a00",
  "Facilitator": "#6b3a00",
};

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-ZA", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return iso; }
}

const TYPE_CONFIG = {
  info:    { label: "ℹ️ Info",    bg: "rgba(14,100,160,0.2)", border: "rgba(56,182,255,0.35)", icon: "ℹ️" },
  urgent:  { label: "🚨 Urgent",  bg: "rgba(160,30,30,0.2)",  border: "rgba(255,100,100,0.4)", icon: "🚨" },
  success: { label: "✅ Success", bg: "rgba(22,100,50,0.2)",  border: "rgba(74,222,128,0.4)", icon: "✅" },
};

function BroadcastPanel() {
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState<"info" | "urgent" | "success">("info");
  const [sending, setSending] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [liveAnnouncement, setLiveAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    fetchLive();
    const id = setInterval(fetchLive, 6000);
    return () => clearInterval(id);
  }, []);

  async function fetchLive() {
    try {
      const res = await fetch("/api/announcements/current");
      if (!res.ok) return;
      const data = await res.json() as { announcement: Announcement | null };
      setLiveAnnouncement(data.announcement);
    } catch { /* offline */ }
  }

  async function handleBroadcast() {
    if (!message.trim()) return;
    setSending(true);
    setStatus(null);
    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: ADMIN_PIN, message: message.trim(), type: msgType }),
      });
      const data = await res.json() as { ok?: boolean; error?: string };
      if (data.ok) {
        setStatus({ ok: true, text: "✦ Announcement broadcast to all open devices!" });
        setMessage("");
        fetchLive();
      } else {
        setStatus({ ok: false, text: data.error ?? "Failed to broadcast" });
      }
    } catch {
      setStatus({ ok: false, text: "Could not reach the server. Is the API running?" });
    } finally {
      setSending(false);
    }
  }

  async function handleClear() {
    setClearing(true);
    try {
      const res = await fetch("/api/announcements", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: ADMIN_PIN }),
      });
      const data = await res.json() as { ok?: boolean };
      if (data.ok) {
        setLiveAnnouncement(null);
        setStatus({ ok: true, text: "Announcement cleared." });
      }
    } catch {
      setStatus({ ok: false, text: "Could not reach the server." });
    } finally {
      setClearing(false);
    }
  }

  const typeConf = TYPE_CONFIG[msgType];

  return (
    <div className="card" style={{ marginBottom: 0 }}>
      <div className="card-title"><span className="icon">📢</span> Broadcast Announcement</div>
      <p style={{ fontSize: "0.84rem", color: "var(--gold-pale)", marginBottom: 16, lineHeight: 1.5 }}>
        Send a message that appears as a banner on every device with the app open.
        Messages are refreshed every 8 seconds.
      </p>

      {/* Current live announcement */}
      {liveAnnouncement && (
        <div style={{
          background: TYPE_CONFIG[liveAnnouncement.type].bg,
          border: `1px solid ${TYPE_CONFIG[liveAnnouncement.type].border}`,
          borderRadius: 6,
          padding: "12px 14px",
          marginBottom: 18,
          display: "flex",
          gap: 10,
          alignItems: "flex-start",
        }}>
          <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{TYPE_CONFIG[liveAnnouncement.type].icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.6rem", letterSpacing: "0.15em", color: "var(--gold)", textTransform: "uppercase", marginBottom: 4 }}>
              Live Now · sent {formatTime(liveAnnouncement.sentAt)}
            </div>
            <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.9rem", color: "var(--white)", lineHeight: 1.4 }}>
              {liveAnnouncement.message}
            </div>
          </div>
          <button
            onClick={handleClear}
            disabled={clearing}
            style={{
              background: "rgba(180,40,40,0.2)",
              border: "1px solid rgba(180,40,40,0.4)",
              borderRadius: 4,
              color: "#ff9999",
              padding: "4px 10px",
              cursor: "pointer",
              fontSize: "0.75rem",
              flexShrink: 0,
            }}
          >
            {clearing ? "…" : "✕ Clear"}
          </button>
        </div>
      )}

      {/* Quick preset buttons */}
      <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--gold)", textTransform: "uppercase", marginBottom: 8 }}>
        Quick Messages
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        {QUICK_MESSAGES.map(q => (
          <button
            key={q.label}
            onClick={() => setMessage(q.text)}
            style={{
              padding: "6px 12px",
              background: message === q.text ? "rgba(201,162,39,0.2)" : "rgba(26,71,49,0.5)",
              border: `1px solid ${message === q.text ? "rgba(201,162,39,0.5)" : "rgba(201,162,39,0.2)"}`,
              borderRadius: 4,
              color: message === q.text ? "var(--gold-light)" : "var(--gold-pale)",
              fontFamily: "'Lato', sans-serif",
              fontSize: "0.78rem",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Message input */}
      <div className="form-group">
        <label className="form-label">Message</label>
        <textarea
          className="form-input"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Type your announcement here, or choose a quick message above…"
          style={{ resize: "vertical", minHeight: 80 }}
        />
      </div>

      {/* Type selector */}
      <div className="form-group" style={{ marginBottom: 18 }}>
        <label className="form-label">Alert Type</label>
        <div style={{ display: "flex", gap: 8 }}>
          {(["info", "urgent", "success"] as const).map(t => {
            const c = TYPE_CONFIG[t];
            const active = msgType === t;
            return (
              <button
                key={t}
                onClick={() => setMsgType(t)}
                style={{
                  flex: 1,
                  padding: "8px 10px",
                  background: active ? c.bg : "rgba(26,71,49,0.35)",
                  border: `1px solid ${active ? c.border : "rgba(201,162,39,0.15)"}`,
                  borderRadius: 4,
                  color: active ? "var(--white)" : "var(--gold-pale)",
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.68rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={handleBroadcast}
        disabled={sending || !message.trim()}
        style={{
          width: "100%",
          padding: "12px",
          background: message.trim()
            ? "linear-gradient(135deg, var(--gold), var(--gold-light))"
            : "rgba(201,162,39,0.1)",
          border: `1px solid ${message.trim() ? "var(--gold)" : "rgba(201,162,39,0.2)"}`,
          borderRadius: 4,
          color: message.trim() ? "var(--dark)" : "rgba(201,162,39,0.35)",
          fontFamily: "'Cinzel', serif",
          fontSize: "0.82rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          fontWeight: 700,
          cursor: message.trim() ? "pointer" : "not-allowed",
          transition: "all 0.2s",
        }}
      >
        {sending ? "Broadcasting…" : "📢 Broadcast to All Devices"}
      </button>

      {status && (
        <div style={{
          marginTop: 10,
          padding: "8px 12px",
          borderRadius: 4,
          background: status.ok ? "rgba(74,222,128,0.1)" : "rgba(255,100,100,0.1)",
          border: `1px solid ${status.ok ? "rgba(74,222,128,0.3)" : "rgba(255,100,100,0.3)"}`,
          color: status.ok ? "#4ade80" : "#ff9999",
          fontSize: "0.84rem",
        }}>
          {status.text}
        </div>
      )}
    </div>
  );
}

export default function AdminTab({ signIns, onClear }: { signIns: SignIn[]; onClear: () => void }) {
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);

  function handlePinSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pin === ADMIN_PIN) { setUnlocked(true); setPinError(false); }
    else { setPinError(true); setPin(""); }
  }

  const filtered = signIns.filter((s) => {
    const matchSearch = !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.region.toLowerCase().includes(search.toLowerCase());
    const matchRole = !filterRole || s.role === filterRole;
    return matchSearch && matchRole;
  });

  const roleCounts: Record<string, number> = {};
  for (const s of signIns) {
    roleCounts[s.role || "Unknown"] = (roleCounts[s.role || "Unknown"] || 0) + 1;
  }

  if (!unlocked) {
    return (
      <div className="card" style={{ maxWidth: 400, margin: "40px auto" }}>
        <div className="card-title"><span className="icon">🔐</span> Admin Access</div>
        <p style={{ fontSize: "0.88rem", color: "var(--gold-pale)", marginBottom: "20px", lineHeight: 1.5 }}>
          Enter the camp admin PIN to view the sign-in register and broadcast announcements.
        </p>
        <form onSubmit={handlePinSubmit}>
          <div className="form-group">
            <label className="form-label">Admin PIN</label>
            <input
              className="form-input"
              type="password"
              inputMode="numeric"
              maxLength={10}
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => { setPin(e.target.value); setPinError(false); }}
              autoFocus
              style={{ letterSpacing: "0.3em", fontSize: "1.2rem" }}
            />
            {pinError && (
              <p style={{ color: "#ff8a8a", fontSize: "0.8rem", marginTop: "6px" }}>
                Incorrect PIN. Please try again.
              </p>
            )}
          </div>
          <button type="submit" className="btn-primary">✦ Unlock Admin ✦</button>
        </form>
      </div>
    );
  }

  return (
    <>
      {/* Broadcast panel at top */}
      <BroadcastPanel />

      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-title"><span className="icon">📊</span> Camp Register — Admin View</div>

        <div className="info-grid" style={{ marginBottom: 20 }}>
          <div className="info-item" style={{ textAlign: "center" }}>
            <div className="label">Total Sign-Ins</div>
            <div className="value" style={{ fontSize: "2rem", fontFamily: "'Cinzel', serif", color: "var(--gold-light)", fontWeight: 700 }}>
              {signIns.length}
            </div>
          </div>
          <div className="info-item">
            <div className="label" style={{ marginBottom: 8 }}>By Role</div>
            {Object.entries(roleCounts).length === 0 ? (
              <div className="value" style={{ color: "rgba(253,250,243,0.4)", fontSize: "0.85rem" }}>No sign-ins yet</div>
            ) : (
              Object.entries(roleCounts).map(([role, count]) => (
                <div key={role} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", marginBottom: 4, color: "var(--off-white)" }}>
                  <span>{role || "Unknown"}</span>
                  <span style={{ color: "var(--gold)", fontWeight: 700 }}>{count}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <input
            className="form-input"
            type="text"
            placeholder="🔍 Search by name or region..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 180 }}
          />
          <select
            className="form-input"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            style={{ width: 200 }}
          >
            <option value="">All Roles</option>
            <option>Camper (Youth)</option>
            <option>Junior Leader</option>
            <option>Senior Leader</option>
            <option>Group Leader</option>
            <option>Volunteer / Staff</option>
            <option>Facilitator</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 16px", color: "rgba(253,250,243,0.4)", fontSize: "0.9rem" }}>
            {signIns.length === 0
              ? "No campers have signed in yet. Sign-ins will appear here."
              : "No results match your search."}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr>
                  {["#", "Name", "Region", "Role", "Phone", "Emergency", "Medical", "Time"].map((h) => (
                    <th key={h} style={{
                      textAlign: "left", fontFamily: "'Cinzel', serif", fontSize: "0.68rem",
                      letterSpacing: "0.1em", color: "var(--gold)", textTransform: "uppercase",
                      padding: "8px 10px", borderBottom: "1px solid rgba(201,162,39,0.25)", whiteSpace: "nowrap",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(201,162,39,0.07)" }}>
                    <td style={{ padding: "8px 10px", color: "rgba(253,250,243,0.4)", fontSize: "0.75rem" }}>{signIns.indexOf(s) + 1}</td>
                    <td style={{ padding: "8px 10px", color: "var(--white)", fontWeight: 700 }}>{s.name || "—"}</td>
                    <td style={{ padding: "8px 10px", color: "var(--off-white)" }}>{s.region || "—"}</td>
                    <td style={{ padding: "8px 10px" }}>
                      <span style={{
                        display: "inline-block", padding: "2px 8px", borderRadius: 3,
                        fontSize: "0.72rem", background: roleBadgeColor[s.role] || "#1a4731",
                        color: "var(--gold-pale)", fontFamily: "'Cinzel', serif",
                        letterSpacing: "0.05em", whiteSpace: "nowrap",
                      }}>
                        {s.role || "—"}
                      </span>
                    </td>
                    <td style={{ padding: "8px 10px", color: "var(--off-white)" }}>{s.phone || "—"}</td>
                    <td style={{ padding: "8px 10px", color: "var(--off-white)" }}>{s.emergency || "—"}</td>
                    <td style={{ padding: "8px 10px", color: "var(--off-white)", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.medical || "—"}</td>
                    <td style={{ padding: "8px 10px", color: "rgba(253,250,243,0.5)", whiteSpace: "nowrap", fontSize: "0.75rem" }}>{formatTime(s.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              onClick={() => setUnlocked(false)}
              style={{
                padding: "8px 16px", background: "rgba(201,162,39,0.08)",
                border: "1px solid rgba(201,162,39,0.3)", borderRadius: 4,
                color: "var(--gold-pale)", fontFamily: "'Cinzel', serif",
                fontSize: "0.75rem", letterSpacing: "0.1em", cursor: "pointer",
              }}
            >
              🔒 Lock
            </button>
            <button
              onClick={() => exportCSV(signIns)}
              disabled={signIns.length === 0}
              style={{
                padding: "8px 16px",
                background: signIns.length === 0 ? "rgba(201,162,39,0.04)" : "rgba(201,162,39,0.15)",
                border: "1px solid rgba(201,162,39,0.3)", borderRadius: 4,
                color: signIns.length === 0 ? "rgba(245,228,160,0.3)" : "var(--gold-light)",
                fontFamily: "'Cinzel', serif", fontSize: "0.75rem", letterSpacing: "0.1em",
                cursor: signIns.length === 0 ? "not-allowed" : "pointer",
              }}
            >
              ⬇ Export CSV
            </button>
          </div>

          {!confirmClear ? (
            <button
              onClick={() => setConfirmClear(true)}
              style={{
                padding: "8px 16px", background: "rgba(180,40,40,0.1)",
                border: "1px solid rgba(180,40,40,0.35)", borderRadius: 4,
                color: "#ff9999", fontFamily: "'Cinzel', serif",
                fontSize: "0.75rem", letterSpacing: "0.1em", cursor: "pointer",
              }}
            >
              🗑 Clear All Data
            </button>
          ) : (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: "0.8rem", color: "#ff9999" }}>Are you sure?</span>
              <button
                onClick={() => { onClear(); setConfirmClear(false); }}
                style={{ padding: "6px 14px", background: "rgba(180,40,40,0.3)", border: "1px solid rgba(180,40,40,0.6)", borderRadius: 4, color: "#ff9999", cursor: "pointer", fontSize: "0.8rem" }}
              >
                Yes, clear
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                style={{ padding: "6px 14px", background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.3)", borderRadius: 4, color: "var(--gold-pale)", cursor: "pointer", fontSize: "0.8rem" }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
