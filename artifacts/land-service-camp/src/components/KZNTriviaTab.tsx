const sections = [
  {
    heading: "🏆 World Records & Geographic Wonders",
    items: [
      { bold: "World's Smallest Desert:", text: " Near Port Edward on the South Coast, the Red Desert is only 200 metres wide — made of unique crimson soil." },
      { bold: "World's Second-Highest Waterfall:", text: " Tugela Falls in Royal Natal National Park plunges nearly 948 metres down five stages." },
      { bold: "Highest Gorge Swing:", text: " The Wild Gorge Swing at Oribi Gorge drops 165 metres — like leaping off a 55-storey building!" },
      { bold: "Africa's Longest Promenade:", text: " Durban's beachfront promenade stretches 8 km — perfect for cycling and skating." },
      { bold: "Highest Peak in SA:", text: " Mafadi at 3,450 metres is the highest point in South Africa." },
    ],
  },
  {
    heading: "🦈 Wild Ocean & Nature",
    items: [
      { bold: "Greatest Shoal on Earth:", text: " Every winter, KZN hosts the Sardine Run — one of the planet's largest animal migrations, attracting thousands of dolphins, sharks, and whales in a massive feeding frenzy." },
      { bold: "Saved from Extinction:", text: " Hluhluwe-iMfolozi Park is credited with saving the white rhino from extinction and holds one of the world's largest populations." },
      { bold: "iSimangaliso Wetland Park", text: " means 'Miracle and Wonder' in isiZulu — a UNESCO World Heritage Site where you can see hippos, crocodiles, and sea turtle nesting sites all in one place." },
      { bold: "Rock Art:", text: " Over 35,000–40,000 individual San paintings are recorded across 600+ sites in the Drakensberg." },
    ],
  },
  {
    heading: "🇿🇦 Culture & History",
    items: [
      { bold: "People of Heaven:", text: " 'KwaZulu' means 'Place of the Zulu' and the Zulu people are called 'the people of heaven.'" },
      { bold: "India Outside India:", text: " Durban has the largest Indian community living outside of India anywhere in the world." },
      { bold: "The Only Province with a King:", text: " KZN is the only SA province with a constitutional provision for a Monarch — the Zulu King." },
      { bold: "Tony Hawk in Umhlanga:", text: " Gateway Shopping Centre has a skate park designed by legendary skater Tony Hawk." },
      { bold: "Mission: Impossible:", text: " Tom Cruise filmed major action sequences for MI8 right in the Central Drakensberg!" },
    ],
  },
  {
    heading: "🏟️ Sports & Industry",
    items: [
      { bold: "World's Oldest Ultramarathon:", text: " The Comrades Marathon between Durban and Pietermaritzburg is the oldest and largest ultramarathon on earth." },
      { bold: "Africa's Biggest Horse Race:", text: " The Durban July is the continent's biggest sporting event of its kind — and a massive fashion spectacle." },
      { bold: "Busiest Port:", text: " Durban has the busiest port in South Africa and one of the largest in the world." },
      { bold: "World Leader in Sand Mining:", text: " Richards Bay Minerals is the largest sand-mining and mineral-processing operation on Earth." },
      { bold: "Plastic Road:", text: " KZN built the country's first road made from recycled plastic — equivalent to about 40,000 milk cartons." },
      { bold: "Size of Portugal:", text: " At ~94,361 km², KZN is roughly the same size as Portugal — South Africa's third-smallest province but second-largest by population (nearly 13 million people)." },
    ],
  },
];

export default function KZNTriviaTab() {
  return (
    <div className="card">
      <div className="card-title"><span className="icon">🌍</span> Amazing KZN Trivia</div>
      {sections.map((s) => (
        <div className="trivia-section" key={s.heading}>
          <div className="trivia-heading">{s.heading}</div>
          <ul className="trivia-list">
            {s.items.map((item, i) => (
              <li key={i}>
                <strong>{item.bold}</strong>{item.text}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
