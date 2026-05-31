const days = [
  {
    title: "Day 1 — Arrival & Orientation",
    rows: [
      ["08:00", "Registration & Sign In"],
      ["09:30", "Opening Ceremony & Welcome"],
      ["11:00", "Orientation Walk & Campsite Tour"],
      ["13:00", "Lunch"],
      ["14:30", "Introduction: 4 Pillars of Land Service"],
      ["16:30", "Arts & Crafts Session 1"],
      ["18:00", "Dinner & Evening Devotion"],
      ["20:00", "Campfire & KZN Trivia Night"],
    ],
  },
  {
    title: "Day 2 — Service & Learning",
    rows: [
      ["07:00", "Morning Devotion & Breakfast"],
      ["09:00", "Land Service Projects"],
      ["13:00", "Lunch"],
      ["14:30", "Richmond History Walk"],
      ["16:00", "Arts & Crafts Session 2"],
      ["18:00", "Dinner"],
      ["19:30", "Group Reflection & Team Building"],
    ],
  },
  {
    title: "Day 3 — Celebration & Closing",
    rows: [
      ["07:00", "Morning Devotion & Breakfast"],
      ["09:00", "Final Land Service Activities"],
      ["11:00", "Arts & Crafts Display & Showcase"],
      ["13:00", "Closing Lunch"],
      ["14:30", "Closing Ceremony & Awards"],
      ["16:00", "Departure"],
    ],
  },
];

export default function ScheduleTab() {
  return (
    <div className="card">
      <div className="card-title"><span className="icon">📅</span> Camp Programme</div>
      {days.map((day) => (
        <div className="schedule-day" key={day.title}>
          <div className="schedule-day-title">{day.title}</div>
          {day.rows.map(([time, event]) => (
            <div className="schedule-row" key={time}>
              <span className="schedule-time">{time}</span>
              <span className="schedule-event">{event}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
