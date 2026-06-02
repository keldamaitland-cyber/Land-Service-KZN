import { useState } from "react";

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

function exportCSV(signIns: SignIn[]) {
  const headers = ["#", "Timestamp", "Full Name", "Region / Group", "Role", "Contact Number", "Emergency Contact", "Dietary / Medical Notes"];
  const rows = signIns.map((s, i) => [
    String(i + 1),
    new Date(s.timestamp).toLocaleString("en-ZA"),
    s.name,
    s.region,
    s.role,
    s.phone,
    s.emergency,
    s.medical,
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
  } catch {
    return iso;
  }
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
    if (pin === ADMIN_PIN) {
      setUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPin("");
    }
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
          Enter the camp admin PIN to view the sign-in register.
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
          <button type="submit" className="btn-primary">✦ Unlock Register ✦</button>
        </form>
      </div>
    );
  }

  return (
    <>
      <div className="card">
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
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        fontFamily: "'Cinzel', serif",
                        fontSize: "0.68rem",
                        letterSpacing: "0.1em",
                        color: "var(--gold)",
                        textTransform: "uppercase",
                        padding: "8px 10px",
                        borderBottom: "1px solid rgba(201,162,39,0.25)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr
                    key={i}
                    style={{ borderBottom: "1px solid rgba(201,162,39,0.07)" }}
                  >
                    <td style={{ padding: "8px 10px", color: "rgba(253,250,243,0.4)", fontSize: "0.75rem" }}>{signIns.indexOf(s) + 1}</td>
                    <td style={{ padding: "8px 10px", color: "var(--white)", fontWeight: 700 }}>{s.name || "—"}</td>
                    <td style={{ padding: "8px 10px", color: "var(--off-white)" }}>{s.region || "—"}</td>
                    <td style={{ padding: "8px 10px" }}>
                      <span style={{
                        display: "inline-block",
                        padding: "2px 8px",
                        borderRadius: 3,
                        fontSize: "0.72rem",
                        background: roleBadgeColor[s.role] || "#1a4731",
                        color: "var(--gold-pale)",
                        fontFamily: "'Cinzel', serif",
                        letterSpacing: "0.05em",
                        whiteSpace: "nowrap",
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
                padding: "8px 16px",
                background: "rgba(201,162,39,0.08)",
                border: "1px solid rgba(201,162,39,0.3)",
                borderRadius: 4,
                color: "var(--gold-pale)",
                fontFamily: "'Cinzel', serif",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                cursor: "pointer",
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
                border: "1px solid rgba(201,162,39,0.3)",
                borderRadius: 4,
                color: signIns.length === 0 ? "rgba(245,228,160,0.3)" : "var(--gold-light)",
                fontFamily: "'Cinzel', serif",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
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
                padding: "8px 16px",
                background: "rgba(180,40,40,0.1)",
                border: "1px solid rgba(180,40,40,0.35)",
                borderRadius: 4,
                color: "#ff9999",
                fontFamily: "'Cinzel', serif",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                cursor: "pointer",
              }}
            >
              🗑 Clear All Data
            </button>
          ) : (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: "0.8rem", color: "#ff9999" }}>Are you sure?</span>
              <button
                onClick={() => { onClear(); setConfirmClear(false); }}
                style={{
                  padding: "6px 14px",
                  background: "rgba(180,40,40,0.3)",
                  border: "1px solid rgba(180,40,40,0.6)",
                  borderRadius: 4,
                  color: "#ff9999",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                }}
              >
                Yes, clear
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                style={{
                  padding: "6px 14px",
                  background: "rgba(201,162,39,0.08)",
                  border: "1px solid rgba(201,162,39,0.3)",
                  borderRadius: 4,
                  color: "var(--gold-pale)",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                }}
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
