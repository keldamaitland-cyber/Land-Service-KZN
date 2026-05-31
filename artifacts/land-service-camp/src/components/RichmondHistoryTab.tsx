const entries = [
  {
    year: "PRE-1850 — The First Peoples",
    text: (
      <>
        The <strong>San (Bushmen)</strong> were the ultimate survivalists — using ostrich shells as water bottles,
        brewing secret beetle-based poisons for hunting, and leaving "spirit paintings" on rocks made with{" "}
        <strong>eland blood</strong> that still haven't faded. Hidden in the valleys were the{" "}
        <strong>amaBhaca</strong> ("People who Hide"), refugees who fled the legendary Zulu armies and used
        Richmond's rugged hills as a natural fortress.
      </>
    ),
  },
  {
    year: "1850 — The Byrne Settlers Arrive",
    text: (
      <>
        British immigrants brought out by J.C. Byrne &amp; Co. arrived, but their ship <em>Minerva</em> wrecked in
        Durban Bay. They hiked inland with almost nothing, finding wilderness instead of the promised paradise. One
        desperate family lived under a tarpaulin stretched over their <strong>four-poster bed</strong> for months.
        The town was first called <strong>Beaulieu-on-Illovo</strong>, then renamed Richmond after the Duke of
        Richmond.
      </>
    ),
  },
  {
    year: "19th Century — A Town of Firsts",
    text: (
      <>
        Richmond earned a remarkable string of records: <strong>oldest tennis club</strong> in South Africa, the{" "}
        <strong>first girls' boarding school</strong> in KwaZulu-Natal, the{" "}
        <strong>oldest consecrated Anglican Church</strong> in the province, and the birthplace of{" "}
        <strong>Dr Albert Hoffa</strong> — credited as the world's first modern bone doctor (orthopaedic surgeon).
      </>
    ),
  },
  {
    year: "1906 — The Bambatha Rebellion",
    text: (
      <>
        Richmond became a flashpoint for one of SA's most significant colonial-era uprisings. After two British
        officers were killed at nearby Byrne during enforcement of a Poll Tax, <strong>martial law</strong> was
        declared and the Bambatha Rebellion ignited — a massive moment of resistance that changed South African
        history forever.
      </>
    ),
  },
  {
    year: "Anglo-Boer War Era",
    text: (
      <>
        The town and surrounding hills saw several skirmishes during the Anglo-Boer War. Artifacts from this
        period are preserved in the Richmond Byrne Museum. The <strong>Old Court House</strong> (now Heritage
        House) and <strong>Blarney Cottage</strong> — a rare unchanged settler home and national monument — still
        stand.
      </>
    ),
  },
  {
    year: "Today — Agricultural Heart of the Midlands",
    text: (
      <>
        Richmond is a farming community focused on <strong>forestry, timber, sugar cane, poultry, and dairy</strong>.
        Its main street retains Victorian architecture. <strong>Baynesfield Estate</strong>, pioneered by Joseph
        Baynes (a founder of the SA dairy industry), was bequeathed to the nation. Richmond falls under the
        uMgungundlovu District Municipality.
      </>
    ),
  },
];

export default function RichmondHistoryTab() {
  return (
    <div className="card">
      <div className="card-title"><span className="icon">🏛️</span> Richmond — A Story of Survival &amp; Firsts</div>
      <p
        style={{
          fontSize: "0.9rem",
          lineHeight: "1.65",
          color: "var(--off-white)",
          marginBottom: "22px",
          fontStyle: "italic",
          borderLeft: "3px solid var(--gold)",
          paddingLeft: "14px",
        }}
      >
        Imagine it's 1850. You've just spent months on a cramped wooden ship called the <em>Minerva</em>, dreaming
        of a fresh start — and then your ship slams into a reef and sinks. Welcome to Africa.
      </p>
      <div className="timeline">
        {entries.map((e) => (
          <div className="timeline-item" key={e.year}>
            <div className="timeline-year">{e.year}</div>
            <div className="timeline-text">{e.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
