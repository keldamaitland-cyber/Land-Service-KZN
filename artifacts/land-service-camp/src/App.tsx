import { useState, useCallback } from "react";
import SignInTab from "./components/SignInTab";
import ScheduleTab from "./components/ScheduleTab";
import RichmondHistoryTab from "./components/RichmondHistoryTab";
import KZNTriviaTab from "./components/KZNTriviaTab";
import ArtsAndCraftsTab from "./components/ArtsAndCraftsTab";
import FeedbackTab from "./components/FeedbackTab";
import AdminTab from "./components/AdminTab";
import QRCodeTab from "./components/QRCodeTab";

export interface SignInRecord {
  timestamp: string;
  name: string;
  region: string;
  role: string;
  phone: string;
  emergency: string;
  medical: string;
}

const STORAGE_KEY = "lskzn_signins";

function loadSignIns(): SignInRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSignIns(records: SignInRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

const tabs = [
  { id: "signin",   label: "📋 Sign In" },
  { id: "schedule", label: "📅 Schedule" },
  { id: "richmond", label: "🏛️ Richmond History" },
  { id: "trivia",   label: "🌍 KZN Trivia" },
  { id: "crafts",   label: "🎨 Arts & Crafts" },
  { id: "feedback", label: "💬 Feedback" },
  { id: "qr",       label: "📱 QR Code" },
  { id: "admin",    label: "🔐 Admin" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("signin");
  const [signIns, setSignIns] = useState<SignInRecord[]>(loadSignIns);

  const handleNewSignIn = useCallback((record: SignInRecord) => {
    setSignIns((prev) => {
      const updated = [...prev, record];
      saveSignIns(updated);
      return updated;
    });
  }, []);

  const handleClear = useCallback(() => {
    setSignIns([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  function renderTab() {
    switch (activeTab) {
      case "signin":   return <SignInTab onSignIn={handleNewSignIn} />;
      case "schedule": return <ScheduleTab />;
      case "richmond": return <RichmondHistoryTab />;
      case "trivia":   return <KZNTriviaTab />;
      case "crafts":   return <ArtsAndCraftsTab />;
      case "feedback": return <FeedbackTab />;
      case "qr":       return <QRCodeTab />;
      case "admin":    return <AdminTab signIns={signIns} onClear={handleClear} />;
      default:         return <SignInTab onSignIn={handleNewSignIn} />;
    }
  }

  return (
    <>
      <div className="bg-canvas" />
      <div className="leaves-bg" />

      <div id="app">
        <header className="camp-header">
          <div className="badge-ring">
            <svg width="56" height="56" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
              <circle cx="28" cy="28" r="26" fill="none" stroke="#c9a227" strokeWidth="1.5" />
              <circle cx="28" cy="28" r="20" fill="rgba(26,71,49,0.8)" stroke="#c9a227" strokeWidth="0.5" />
              <polygon points="28,10 38,28 18,28" fill="#c9a227" opacity="0.9" />
              <polygon points="28,18 36,32 20,32" fill="#c9a227" opacity="0.8" />
              <polygon points="28,24 35,36 21,36" fill="#c9a227" opacity="0.7" />
              <rect x="26" y="36" width="4" height="7" fill="#c9a227" opacity="0.85" />
              <text x="14" y="24" fontSize="5" fill="#c9a227" opacity="0.7">✦</text>
              <text x="38" y="24" fontSize="5" fill="#c9a227" opacity="0.7">✦</text>
            </svg>
          </div>
          <div className="header-eyebrow">KwaZulu-Natal · 2026</div>
          <h1 className="camp-title">
            Land Service<br />
            <span>National Camp</span>
          </h1>
          <div className="header-sub">Richmond · KZN · Building Tomorrow's Leaders</div>
          <div className="divider">
            <div className="divider-line" />
            <div className="divider-diamond" />
            <div className="divider-line" />
          </div>
        </header>

        <nav className="camp-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn${activeTab === tab.id ? " active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {tab.id === "admin" && signIns.length > 0 && (
                <span style={{
                  marginLeft: 6,
                  background: "var(--forest-light)",
                  color: "var(--gold-pale)",
                  borderRadius: "10px",
                  padding: "1px 7px",
                  fontSize: "0.7rem",
                  fontFamily: "'Lato', sans-serif",
                  fontWeight: 700,
                  letterSpacing: 0,
                }}>
                  {signIns.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="camp-content">
          <div className="tab-panel" key={activeTab}>
            {renderTab()}
          </div>
        </div>

        <footer className="camp-footer">
          Land Service KZN National Camp 2026 &nbsp;✦&nbsp; Richmond, KwaZulu-Natal &nbsp;✦&nbsp; Building Tomorrow's Leaders
        </footer>
      </div>
    </>
  );
}
