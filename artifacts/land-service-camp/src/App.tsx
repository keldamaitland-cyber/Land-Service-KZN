import { useState } from "react";
import SignInTab from "./components/SignInTab";
import ScheduleTab from "./components/ScheduleTab";
import RichmondHistoryTab from "./components/RichmondHistoryTab";
import KZNTriviaTab from "./components/KZNTriviaTab";
import ArtsAndCraftsTab from "./components/ArtsAndCraftsTab";
import FeedbackTab from "./components/FeedbackTab";

const tabs = [
  { id: "signin", label: "📋 Sign In" },
  { id: "schedule", label: "📅 Schedule" },
  { id: "richmond", label: "🏛️ Richmond History" },
  { id: "trivia", label: "🌍 KZN Trivia" },
  { id: "crafts", label: "🎨 Arts & Crafts" },
  { id: "feedback", label: "💬 Feedback" },
];

function TabContent({ activeTab }: { activeTab: string }) {
  switch (activeTab) {
    case "signin": return <SignInTab />;
    case "schedule": return <ScheduleTab />;
    case "richmond": return <RichmondHistoryTab />;
    case "trivia": return <KZNTriviaTab />;
    case "crafts": return <ArtsAndCraftsTab />;
    case "feedback": return <FeedbackTab />;
    default: return <SignInTab />;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState("signin");

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
            </button>
          ))}
        </nav>

        <div className="camp-content">
          <div className="tab-panel" key={activeTab}>
            <TabContent activeTab={activeTab} />
          </div>
        </div>

        <footer className="camp-footer">
          Land Service KZN National Camp 2026 &nbsp;✦&nbsp; Richmond, KwaZulu-Natal &nbsp;✦&nbsp; Building Tomorrow's Leaders
        </footer>
      </div>
    </>
  );
}
