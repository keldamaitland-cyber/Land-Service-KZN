import { useState } from "react";

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

export default function SignInTab() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", region: "", role: "", phone: "", emergency: "", medical: ""
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await postToSheet({ type: "signin", timestamp: new Date().toISOString(), ...form });
    setSubmitted(true);
  }

  return (
    <>
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
                  <option>Durban North</option>
                  <option>Durban South</option>
                  <option>Pietermaritzburg</option>
                  <option>Richards Bay</option>
                  <option>Ladysmith</option>
                  <option>Newcastle</option>
                  <option>South Coast</option>
                  <option>Midlands</option>
                  <option>Other KZN</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-input" name="role" value={form.role} onChange={handleChange}>
                  <option value="">— Select Role —</option>
                  <option>Camper (Youth)</option>
                  <option>Junior Leader</option>
                  <option>Senior Leader</option>
                  <option>Group Leader</option>
                  <option>Volunteer / Staff</option>
                  <option>Facilitator</option>
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
            ✦ You're signed in! Your details have been recorded. Welcome to Camp! ✦
          </div>
        )}
        <div className="sheet-link">
          📊 All sign-ins sync to the camp register:&nbsp;
          <a
            href={import.meta.env.VITE_GOOGLE_SHEET_URL || "#"}
            target="_blank"
            rel="noreferrer"
          >
            Open Google Sheet ↗
          </a>
        </div>
        <p style={{ fontSize: "0.75rem", color: "rgba(253,250,243,0.4)", marginTop: "8px" }}>
          <em>To connect to Google Sheets: set <code>VITE_SHEET_WEBHOOK_URL</code> and <code>VITE_GOOGLE_SHEET_URL</code> in your environment.</em>
        </p>
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
