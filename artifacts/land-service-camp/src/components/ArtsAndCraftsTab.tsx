const crafts = [
  { icon: "🎄", name: "Christmas Ornaments", desc: "Using air-dry clay to shape and paint festive decorations." },
  { icon: "🍂", name: "Nature Bookmarks", desc: "Press leaves and flowers into bookmarks using plastic containers." },
  { icon: "💅", name: "Nail Polish Flowers", desc: "Wire flowers and shapes created using nail polish on water." },
  { icon: "🐚", name: "Painted Seashells", desc: "Paint designs onto seashells collected from the KZN coast." },
  { icon: "☀️", name: "Sun-Dried Tote Bags", desc: "Sun-dried art on cotton tote bags — unique wearable creations." },
  { icon: "🧦", name: "Leaf-Print Socks", desc: "Hammer leaves and flowers into white socks for natural prints." },
  { icon: "🔲", name: "Mosaic CD Coasters", desc: "Cut old CDs into blocks and heat-fuse into mosaic coasters." },
  { icon: "🌈", name: "Faux Stained Glass", desc: "Plastic containers, Mod Podge and food colouring for a stained-glass effect." },
  { icon: "🐻", name: "Pompom Bear", desc: "Craft adorable bears from colourful wool pompoms." },
  { icon: "🎑", name: "Eco Suncatchers", desc: "Eco-friendly suncatchers using natural and recycled materials." },
  { icon: "❄️", name: "Christmas Snow Globes", desc: "DIY snow globes with festive figures and glitter." },
  { icon: "🪨", name: "Rock Footprint Clay Art", desc: "Use rocks to press a footprint into clay, then paint it." },
  { icon: "🧂", name: "Salt Painting", desc: "Apply watercolour over salt crystals for stunning texture effects." },
  { icon: "🔮", name: "Marble Christmas Magnets", desc: "Clear flat marbles with Christmas napkin backgrounds as fridge magnets." },
  { icon: "🌲", name: "Toilet Roll Christmas Tree", desc: "Stack and decorate toilet paper rolls into a festive Christmas tree." },
  { icon: "✝️", name: "Origami Flower Cross", desc: "DIY origami flower cross wall hanging — meaningful and decorative." },
  { icon: "🌀", name: "Quilling Paper Art", desc: "Roll and shape paper strips into intricate quilling designs." },
  { icon: "🌸", name: "Wind Charm", desc: "Plastic bottle wind charms decorated with pressed leaves and flowers." },
  { icon: "☕", name: "Coffee Painting", desc: "Use brewed coffee as 'ink' to paint artwork on paper or bottle bases." },
  { icon: "🌿", name: "Nature Glass Coaster", desc: "Arrange flowers and leaves on a glass bottle lid with resin to make coasters." },
  { icon: "🧺", name: "Newspaper Seed Baskets", desc: "Weave mini baskets from newspapers to hold Agrimark-sponsored seeds." },
  { icon: "🔑", name: "Leather Key Rings", desc: "Craft personalised leather key rings with stamps or pyrography." },
  { icon: "💎", name: "Bag Charms", desc: "Fabric strands, key chains, and colourful beads for bag/bag charms." },
  { icon: "💐", name: "Hammered Flower Card", desc: "Gently hammer flowers and leaves into handmade greeting cards." },
];

export default function ArtsAndCraftsTab() {
  return (
    <div className="card">
      <div className="card-title"><span className="icon">🎨</span> Arts &amp; Crafts Ideas</div>
      <p style={{ fontSize: "0.85rem", color: "var(--gold-pale)", marginBottom: "18px", fontStyle: "italic" }}>
        All activities aligned with the 4 Pillars of Land Service
      </p>
      <div className="craft-grid">
        {crafts.map((c) => (
          <div className="craft-card" key={c.name}>
            <div className="craft-icon">{c.icon}</div>
            <div className="craft-name">{c.name}</div>
            <div className="craft-desc">{c.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
