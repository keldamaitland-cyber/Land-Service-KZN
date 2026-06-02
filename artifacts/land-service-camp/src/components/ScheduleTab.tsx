import { useState } from "react";

const REGIONS = [
  "Durban North", "Durban South", "Pietermaritzburg", "Richards Bay",
  "Ladysmith", "Newcastle", "South Coast", "Midlands", "Other KZN",
];

// Group-specific details keyed by region
const GROUP_DETAILS: Record<string, {
  checkin: string;
  meetPoint: string;
  craftsGroup: "A" | "B";
  teamColour: string;
  colourHex: string;
  reminderExtra?: string;
}> = {
  "Durban North":      { checkin: "08:00 – 08:20", meetPoint: "Main Gate (North Entrance)", craftsGroup: "A", teamColour: "Indigo",  colourHex: "#4f46e5" },
  "Durban South":      { checkin: "08:20 – 08:40", meetPoint: "Main Gate (South Entrance)", craftsGroup: "B", teamColour: "Coral",   colourHex: "#e85c45" },
  "Pietermaritzburg":  { checkin: "08:40 – 09:00", meetPoint: "Registration Marquee — Table C", craftsGroup: "A", teamColour: "Amber",  colourHex: "#f59e0b" },
  "Richards Bay":      { checkin: "08:00 – 08:25", meetPoint: "Registration Marquee — Table A", craftsGroup: "B", teamColour: "Teal",   colourHex: "#0d9488" },
  "Ladysmith":         { checkin: "08:25 – 08:50", meetPoint: "Registration Marquee — Table B", craftsGroup: "A", teamColour: "Rose",   colourHex: "#e11d48" },
  "Newcastle":         { checkin: "08:00 – 08:30", meetPoint: "Main Gate (West Entrance)",     craftsGroup: "B", teamColour: "Sky",    colourHex: "#0ea5e9" },
  "South Coast":       { checkin: "08:30 – 08:55", meetPoint: "Registration Marquee — Table D", craftsGroup: "A", teamColour: "Lime",   colourHex: "#65a30d" },
  "Midlands":          { checkin: "08:55 – 09:15", meetPoint: "Registration Marquee — Table E", craftsGroup: "B", teamColour: "Purple", colourHex: "#9333ea" },
  "Other KZN":         { checkin: "09:00 – 09:20", meetPoint: "Welcome Tent (Camp Entrance)",  craftsGroup: "A", teamColour: "Gold",   colourHex: "#c9a227" },
};

// Which schedule rows to highlight per group (time key → note)
const HIGHLIGHTS: Record<string, string> = {
  "08:00": "Your group's check-in window — arrive promptly",
  "09:30": "All groups assemble at the Main Hall",
  "16:30": "Arts & Crafts — check your group assignment",
  "16:00": "Arts & Crafts Session 2 — check your group",
  "19:30": "Group Reflection — your team leader will brief you beforehand",
  "14:30": "Closing Ceremony — wear your team colour",
  "16:00 ": "Departure — your bus/transport departs from the Main Car Park",
};

const days = [
  {
    title: "Day 1 — Arrival & Orientation",
    rows: [
      { time: "08:00", event: "Registration & Sign In",               highlight: true },
      { time: "09:30", event: "Opening Ceremony & Welcome",           highlight: true },
      { time: "11:00", event: "Orientation Walk & Campsite Tour",     highlight: false },
      { time: "13:00", event: "Lunch",                                highlight: false },
      { time: "14:30", event: "Introduction: 4 Pillars of Land Service", highlight: false },
      { time: "16:30", event: "Arts & Crafts Session 1",              highlight: true },
      { time: "18:00", event: "Dinner & Evening Devotion",            highlight: false },
      { time: "20:00", event: "Campfire & KZN Trivia Night",          highlight: false },
    ],
  },
  {
    title: "Day 2 — Service & Learning",
    rows: [
      { time: "07:00", event: "Morning Devotion & Breakfast",         highlight: false },
      { time: "09:00", event: "Land Service Projects",                highlight: false },
      { time: "13:00", event: "Lunch",                                highlight: false },
      { time: "14:30", event: "Richmond History Walk",                highlight: false },
      { time: "16:00", event: "Arts & Crafts Session 2",              highlight: true },
      { time: "18:00", event: "Dinner",                               highlight: false },
      { time: "19:30", event: "Group Reflection & Team Building",     highlight: true },
    ],
  },
  {
    title: "Day 3 — Celebration & Closing",
    rows: [
      { time: "07:00", event: "Morning Devotion & Breakfast",         highlight: false },
      { time: "09:00", event: "Final Land Service Activities",        highlight: false },
      { time: "11:00", event: "Arts & Crafts Display & Showcase",     highlight: false },
      { time: "13:00", event: "Closing Lunch",                        highlight: false },
      { time: "14:30", event: "Closing Ceremony & Awards",            highlight: true },
      { time: "16:00", event: "Departure",                            highlight: true },
    ],
  },
];

const craftsGroupDetails = {
  A: {
    day1: "Craft Station 1 (Marquee A) — Nature Bookmarks, Painted Seashells, Salt Painting",
    day2: "Craft Station 3 (Marquee A) — Quilling Paper Art, Wind Charm, Hammered Flower Card",
  },
  B: {
    day1: "Craft Station 2 (Marquee B) — Nail Polish Flowers, Mosaic CD Coasters, Pompom Bear",
    day2: "Craft Station 4 (Marquee B) — Coffee Painting, Leather Key Rings, Eco Suncatchers",
  },
};

function GroupBanner({ region }: { region: string }) {
  const d = GROUP_DETAILS[region];
  if (!d) return null;
  return (
    <div style={{
      background: `linear-gradient(135deg, rgba(14,42,28,0.9) 0%, rgba(26,71,49,0.7) 100%)`,
      border: `1px solid ${d.colourHex}55`,
      borderLeft: `4px solid ${d.colourHex}`,
      borderRadius: "8px",
      padding: "16px 20px",
      marginBottom: "16px",
      display: "flex",
      flexWrap: "wrap",
      gap: "16px",
      alignItems: "flex-start",
    }}>
      <div style={{ flex: 1, minWidth: 180 }}>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.62rem", letterSpacing: "0.2em", color: "var(--gold)", textTransform: "uppercase", marginBottom: 4 }}>
          Viewing as
        </div>
        <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: "1.1rem", fontWeight: 700, color: "var(--white)" }}>
          {region}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: d.colourHex, flexShrink: 0, boxShadow: `0 0 6px ${d.colourHex}88` }} />
          <span style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.82rem", color: "var(--off-white)" }}>
            Team Colour: <strong style={{ color: d.colourHex }}>{d.teamColour}</strong>
          </span>
        </div>
      </div>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {[
          { label: "Check-in Window", value: d.checkin, icon: "🕗" },
          { label: "Meeting Point", value: d.meetPoint, icon: "📍" },
          { label: "Crafts Group", value: `Group ${d.craftsGroup}`, icon: "🎨" },
        ].map(item => (
          <div key={item.label} style={{
            background: "rgba(14,42,28,0.55)",
            border: "1px solid rgba(201,162,39,0.15)",
            borderRadius: "6px",
            padding: "10px 14px",
            minWidth: 140,
          }}>
            <div style={{ fontSize: "1rem", marginBottom: 4 }}>{item.icon}</div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.6rem", letterSpacing: "0.14em", color: "var(--gold)", textTransform: "uppercase", marginBottom: 2 }}>{item.label}</div>
            <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.82rem", color: "var(--white)", fontWeight: 700 }}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GroupReminders({ region }: { region: string }) {
  const d = GROUP_DETAILS[region];
  if (!d) return null;
  const crafts = craftsGroupDetails[d.craftsGroup];
  const reminders = [
    `Arrive at ${d.meetPoint} during your check-in window: ${d.checkin}.`,
    `You are in Crafts ${d.craftsGroup}: Day 1 — ${crafts.day1}.`,
    `You are in Crafts ${d.craftsGroup}: Day 2 — ${crafts.day2}.`,
    `Wear or display your team colour (${d.teamColour}) at the Closing Ceremony on Day 3.`,
    `Ensure all group members have signed in at the Registration desk on arrival.`,
    `Group leaders: please collect your group's activity folder from the Registration Marquee after check-in.`,
  ];
  return (
    <div style={{
      background: "rgba(14,42,28,0.45)",
      border: "1px solid rgba(201,162,39,0.2)",
      borderRadius: "8px",
      padding: "18px 20px",
      marginBottom: "16px",
    }}>
      <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.78rem", letterSpacing: "0.14em", color: "var(--gold-light)", textTransform: "uppercase", marginBottom: "12px", display: "flex", alignItems: "center", gap: 8 }}>
        📋 Group Leader Reminders — {region}
      </div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {reminders.map((r, i) => (
          <li key={i} style={{
            padding: "7px 0 7px 18px",
            borderBottom: i < reminders.length - 1 ? "1px solid rgba(201,162,39,0.07)" : "none",
            fontSize: "0.87rem",
            lineHeight: 1.5,
            color: "var(--off-white)",
            position: "relative",
          }}>
            <span style={{ position: "absolute", left: 0, color: "var(--gold)", fontSize: "0.55rem", top: "10px" }}>◆</span>
            {r}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ScheduleTab() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const details = selectedRegion ? GROUP_DETAILS[selectedRegion] : null;

  return (
    <>
      {/* Region selector */}
      <div className="card">
        <div className="card-title"><span className="icon">👥</span> View Schedule For Your Group</div>
        <p style={{ fontSize: "0.85rem", color: "var(--gold-pale)", marginBottom: "16px", lineHeight: 1.5 }}>
          Select your region to see your personalised check-in times, craft station assignments, and group reminders — or view the full all-groups schedule below.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          <button
            onClick={() => setSelectedRegion(null)}
            style={{
              padding: "8px 16px",
              border: `1px solid ${!selectedRegion ? "var(--gold)" : "rgba(201,162,39,0.3)"}`,
              background: !selectedRegion ? "linear-gradient(135deg, var(--gold), var(--gold-light))" : "rgba(26,71,49,0.4)",
              color: !selectedRegion ? "var(--dark)" : "var(--gold-pale)",
              fontFamily: "'Cinzel', serif",
              fontSize: "0.72rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: !selectedRegion ? 700 : 400,
              transition: "all 0.2s",
            }}
          >
            🌍 All Groups
          </button>
          {REGIONS.map(r => {
            const d = GROUP_DETAILS[r];
            const active = selectedRegion === r;
            return (
              <button
                key={r}
                onClick={() => setSelectedRegion(r)}
                style={{
                  padding: "8px 14px",
                  border: `1px solid ${active ? d.colourHex : "rgba(201,162,39,0.25)"}`,
                  background: active ? `${d.colourHex}22` : "rgba(26,71,49,0.35)",
                  color: active ? "var(--white)" : "var(--gold-pale)",
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: active ? 700 : 400,
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {active && <span style={{ width: 7, height: 7, borderRadius: "50%", background: d.colourHex, boxShadow: `0 0 5px ${d.colourHex}`, flexShrink: 0 }} />}
                {r}
              </button>
            );
          })}
        </div>
      </div>

      {/* Personalised view */}
      {selectedRegion && details && (
        <>
          <GroupBanner region={selectedRegion} />
          <GroupReminders region={selectedRegion} />
        </>
      )}

      {/* Full schedule */}
      <div className="card">
        <div className="card-title">
          <span className="icon">📅</span>
          {selectedRegion ? `Camp Programme — ${selectedRegion}` : "Camp Programme — All Groups"}
        </div>
        {days.map((day) => (
          <div className="schedule-day" key={day.title}>
            <div className="schedule-day-title">{day.title}</div>
            {day.rows.map(({ time, event, highlight }) => {
              const isPersonalised = selectedRegion && highlight;
              let personalNote = "";
              if (selectedRegion && details) {
                if (time === "08:00" && day.title.includes("Day 1")) {
                  personalNote = `${details.checkin} — ${details.meetPoint}`;
                } else if ((time === "16:30" || time === "16:00") && event.includes("Arts")) {
                  const crafts = craftsGroupDetails[details.craftsGroup];
                  personalNote = time === "16:30" ? `Group ${details.craftsGroup}: ${crafts.day1}` : `Group ${details.craftsGroup}: ${crafts.day2}`;
                } else if (time === "19:30") {
                  personalNote = "Your team leader will brief your group at 19:15";
                } else if (time === "14:30" && day.title.includes("Day 3")) {
                  personalNote = `Wear your team colour: ${details.teamColour}`;
                } else if (time === "16:00" && day.title.includes("Day 3")) {
                  personalNote = "Buses depart from Main Car Park";
                }
              }
              return (
                <div
                  key={time + day.title}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "90px 1fr",
                    gap: "12px",
                    padding: "8px 4px",
                    borderBottom: "1px solid rgba(201,162,39,0.07)",
                    background: isPersonalised ? "rgba(201,162,39,0.05)" : "transparent",
                    borderLeft: isPersonalised ? "2px solid rgba(201,162,39,0.4)" : "2px solid transparent",
                    marginLeft: isPersonalised ? "-2px" : 0,
                    borderRadius: isPersonalised ? "0 4px 4px 0" : 0,
                  }}
                >
                  <span className="schedule-time" style={{ paddingTop: personalNote ? 2 : 0 }}>{time}</span>
                  <span>
                    <span className="schedule-event">{event}</span>
                    {personalNote && (
                      <span style={{
                        display: "block",
                        fontSize: "0.76rem",
                        color: details ? details.colourHex : "var(--gold)",
                        marginTop: "3px",
                        fontStyle: "italic",
                      }}>
                        ↳ {personalNote}
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}
