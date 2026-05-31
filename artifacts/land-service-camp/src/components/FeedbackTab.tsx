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

const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent!"];

const ratingFields: { key: string; label: string }[] = [
  { key: "overall", label: "Overall Camp Experience" },
  { key: "programme", label: "Programme Quality" },
  { key: "crafts", label: "Arts & Crafts Sessions" },
  { key: "accom", label: "Accommodation & Catering" },
];

const enjoyedOptions = [
  "Land Service Projects",
  "Arts & Crafts",
  "Campfire & Trivia",
  "History Walk",
  "Team Building",
  "New Friendships",
];

function StarRating({
  label,
  ratingKey,
  value,
  onChange,
}: {
  label: string;
  ratingKey: string;
  value: number;
  onChange: (key: string, val: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div className="stars">
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={`star${n <= (hovered || value) ? " active" : ""}`}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(ratingKey, n)}
          >
            ★
          </span>
        ))}
      </div>
      <div className="rating-label">
        {hovered ? ratingLabels[hovered] : value ? ratingLabels[value] : "Click a star to rate"}
      </div>
    </div>
  );
}

export default function FeedbackTab() {
  const [submitted, setSubmitted] = useState(false);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [enjoyed, setEnjoyed] = useState<string[]>([]);
  const [form, setForm] = useState({ name: "", group: "", improve: "", comments: "", wouldReturn: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleRating(key: string, val: number) {
    setRatings(r => ({ ...r, [key]: val }));
  }

  function handleEnjoyed(option: string) {
    setEnjoyed(prev =>
      prev.includes(option) ? prev.filter(x => x !== option) : [...prev, option]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await postToSheet({
      type: "feedback",
      timestamp: new Date().toISOString(),
      name: form.name || "Anonymous",
      group: form.group,
      ratings,
      enjoyed: enjoyed.join(", "),
      improvements: form.improve,
      comments: form.comments,
      wouldReturn: form.wouldReturn,
    });
    setSubmitted(true);
  }

  return (
    <div className="card">
      <div className="card-title"><span className="icon">💬</span> Camp Feedback Form</div>
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Your Name (optional)</label>
            <input
              className="form-input"
              type="text"
              name="name"
              placeholder="Anonymous if left blank"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Group / Region</label>
            <select className="form-input" name="group" value={form.group} onChange={handleChange}>
              <option value="">— Select —</option>
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

          {ratingFields.map((rf) => (
            <StarRating
              key={rf.key}
              label={rf.label}
              ratingKey={rf.key}
              value={ratings[rf.key] || 0}
              onChange={handleRating}
            />
          ))}

          <div className="form-group">
            <label className="form-label">What did you enjoy most?</label>
            <div className="checkbox-group">
              {enjoyedOptions.map((opt) => (
                <div className="checkbox-item" key={opt}>
                  <input
                    type="checkbox"
                    id={`enj-${opt}`}
                    checked={enjoyed.includes(opt)}
                    onChange={() => handleEnjoyed(opt)}
                  />
                  <label className="checkbox-label" htmlFor={`enj-${opt}`}>{opt}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">What could be improved?</label>
            <textarea
              className="form-input"
              name="improve"
              placeholder="Share your honest thoughts — your feedback helps make future camps better..."
              value={form.improve}
              onChange={handleChange}
              style={{ resize: "vertical", minHeight: "90px" }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Any additional comments or suggestions?</label>
            <textarea
              className="form-input"
              name="comments"
              placeholder="Ideas, highlights, shout-outs..."
              value={form.comments}
              onChange={handleChange}
              style={{ resize: "vertical", minHeight: "90px" }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Would you attend again?</label>
            <select className="form-input" name="wouldReturn" value={form.wouldReturn} onChange={handleChange}>
              <option value="">— Select —</option>
              <option>Definitely Yes!</option>
              <option>Probably Yes</option>
              <option>Not Sure</option>
              <option>Probably Not</option>
              <option>No</option>
            </select>
          </div>

          <button type="submit" className="btn-primary">✦ Submit Feedback ✦</button>
        </form>
      ) : (
        <div className="success-msg">
          ✦ Thank you for your feedback! It means a great deal to the Land Service team. ✦
        </div>
      )}
    </div>
  );
}
