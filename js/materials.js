/* ============================================================
   MATERIALS CATALOGUE — shown in the "Our materials" section.
   Edit the words here; no other file needs touching.
   meters = [label, 1-5] (a simple guide, not a lab test).  img = file in assets/mat/ (without .webp).
   ============================================================ */
window.SWW_MATERIALS = {
  categories: [
    {
      id: 'plywood', name: 'Plywood', short: 'Strong, stable boards', cover: 'bwp', interest: 'Materials (plywood / wood / boards)',
      intro: 'Plywood is made by gluing thin wood veneers in alternating directions, which makes it strong and flat. The grade you choose is really a choice of glue — and the glue decides how much water the board can take.',
      uses: ['Kitchen carcasses', 'Wardrobes', 'TV units', 'Bathroom vanities', 'Ceiling frames'],
      items: [
        { id: 'commercial', name: 'Commercial Plywood', sub: 'MR grade · IS 303', img: 'commercial',
          what: 'Everyday interior plywood bonded with moisture-resistant glue. The most economical way to get a strong carcass for dry rooms.',
          meters: [['Water resistance', 2], ['Strength', 3], ['Relative cost', 1]],
          best: ['Bedroom wardrobes', 'Shelves & storage', 'Ceiling frames', 'Office furniture'],
          note: 'Not for kitchens, bathrooms or damp walls.' },
        { id: 'bwr', name: 'BWR Plywood', sub: 'Boiling Water Resistant · IS 303', img: 'bwr',
          what: 'Phenolic-resin bonded plywood that stands up to humidity, damp walls and the occasional splash — the sensible step up from commercial ply.',
          meters: [['Water resistance', 3], ['Strength', 4], ['Relative cost', 2]],
          best: ['Kitchen wall units', 'Wardrobes in humid homes', 'TV units & panelling', 'Bathroom cabinets (dry side)'],
          note: 'For constant water contact choose BWP or marine.' },
        { id: 'bwp', name: 'BWP Plywood', sub: 'Boiling Water Proof · IS 303', img: 'bwp',
          what: 'Top-grade phenolic bonding built to survive prolonged water exposure without the layers coming apart. The standard choice for wet zones.',
          meters: [['Water resistance', 4], ['Strength', 4], ['Relative cost', 3]],
          best: ['Modular kitchens (sink & hob)', 'Bathroom vanities', 'Utility & wash areas', 'Balcony-side cabinets'],
          note: 'Costs more than BWR, so use it where moisture really is.' },
        { id: 'marine', name: 'Marine Plywood', sub: 'IS 710', img: 'marine',
          what: 'Durable hardwood veneers, waterproof glue and tighter quality control — the top of the plywood range. Not only for boats: the safest pick wherever water is constant.',
          meters: [['Water resistance', 5], ['Strength', 5], ['Relative cost', 4]],
          best: ['Wet kitchens & islands', 'Bathroom & balcony furniture', 'Premium long-life carcasses', 'Covered outdoor units'],
          note: 'More than you need for a dry bedroom wardrobe.' }
      ]
    },
    {
      id: 'solid', name: 'Solid Wood', short: 'Real timber', cover: 'teak', interest: 'Materials (plywood / wood / boards)',
      intro: 'Real timber is timeless, repairable and improves with age. Choose by the job: frames and doors need hard, stable woods; carved and statement pieces reward fine-grained, richly coloured ones.',
      uses: ['Main doors', 'Door & window frames', 'Dining tables', 'Beds', 'Carved mandirs'],
      items: [
        { id: 'teak', name: 'Teak', sub: 'Tectona grandis', img: 'teak', look: 'Golden brown, straight grain',
          what: 'The benchmark timber for doors and furniture: naturally oily, stable, resistant to termites and moisture, and slow to warp.',
          meters: [['Strength', 4], ['Pest & weather resistance', 5], ['Relative cost', 5]],
          best: ['Main doors', 'Windows & frames', 'Dining tables', 'Carved pieces'], note: 'Premium price; plantation teak is paler than old-growth.' },
        { id: 'neem', name: 'Neem', sub: 'Azadirachta indica', img: 'neem', look: 'Light to reddish brown, even grain',
          what: 'A homegrown hardwood that termites and borers tend to avoid. Easy to work, good-looking and friendlier on the budget than teak.',
          meters: [['Strength', 3], ['Pest & weather resistance', 4], ['Relative cost', 2]],
          best: ['Furniture', 'Doors & shutters', 'Beds', 'Carved panels'], note: 'Needs proper seasoning to stay straight.' },
        { id: 'honne', name: 'Honne', sub: 'Pterocarpus marsupium (Indian kino)', img: 'honne', look: 'Golden to red-brown with dark streaks',
          what: 'A heavy, strong South Indian hardwood prized for beams, frames and long-lasting furniture. The heartwood is naturally durable.',
          meters: [['Strength', 5], ['Pest & weather resistance', 4], ['Relative cost', 4]],
          best: ['Door & window frames', 'Doors', 'Beams', 'Heavy furniture'], note: 'Dense and hard — best worked by experienced hands.' },
        { id: 'mahogany', name: 'Mahogany', sub: 'Swietenia / Khaya', img: 'mahogany', look: 'Reddish brown, fine straight grain',
          what: 'Carves and polishes beautifully to a deep, warm glow. Stable and dependable for premium furniture and panelled interiors.',
          meters: [['Strength', 3], ['Pest & weather resistance', 3], ['Relative cost', 4]],
          best: ['Premium furniture', 'Carved doors', 'Wall panelling', 'Bed frames'], note: 'Often imported or plantation-grown; shade varies by lot.' },
        { id: 'acacia', name: 'Acacia', sub: 'Acacia species', img: 'acacia', look: 'Medium to dark brown, bold streaks',
          what: 'A dense, hard-wearing timber with real character — a budget-friendly way to get solid-wood strength.',
          meters: [['Strength', 4], ['Pest & weather resistance', 3], ['Relative cost', 2]],
          best: ['Tables & chairs', 'Beds', 'Shelving', 'Frames'], note: 'Heavy and hard to machine; seasoning matters.' },
        { id: 'redsal', name: 'Red Sal', sub: 'Sal-type hardwood', img: 'redsal', look: 'Deep reddish brown, coarse even grain',
          what: 'A dependable heavy-duty hardwood widely used for door and window frames, beams and rafters. Strong and economical for structural work.',
          meters: [['Strength', 5], ['Pest & weather resistance', 4], ['Relative cost', 2]],
          best: ['Door frames', 'Window frames', 'Beams & framing', 'Heavy-duty furniture'], note: 'Choose well-seasoned lots; polish gives a refined finish.' },
        { id: 'rosewood', name: 'Rosewood', sub: 'Dalbergia species', img: 'rosewood', look: 'Deep purple-brown with dark streaks',
          what: 'The luxury choice: very dense, richly figured and able to take a mirror polish. Used for statement furniture, carving and inlay.',
          meters: [['Strength', 5], ['Pest & weather resistance', 5], ['Relative cost', 5]],
          best: ['Statement furniture', 'Carvings', 'Pooja mandirs', 'Accent panels'], note: 'Rare, regulated timber — availability varies, so ask before you plan around it.' }
      ]
    },
    {
      id: 'laminated', name: 'Laminated Work', short: 'Colour & wipe-clean finish', cover: 'laminates', interest: 'Materials (plywood / wood / boards)',
      intro: 'Laminated work puts colour, texture and a wipe-clean surface over a strong base board. It is the most popular route for modular kitchens, wardrobes and TV units — and it comes in two forms.',
      uses: ['Modular kitchens', 'Wardrobes', 'TV units', 'Office furniture', 'Wall panelling'],
      items: [
        { id: 'prelam', name: 'Pre-laminated Boards', sub: 'Particle board / MDF with factory-fused laminate', img: 'prelam',
          what: 'Boards that arrive already finished — a decorative melamine surface fused to the core at the factory. Quick to install and consistent in colour: the efficient choice for dry-area furniture.',
          meters: [['Water resistance', 1], ['Strength', 2], ['Relative cost', 1]],
          best: ['Wardrobe interiors', 'Shelves & storage', 'Office workstations', 'Partitions'], note: 'Seal the edges; avoid kitchens and wet areas.' },
        { id: 'laminates', name: 'Decorative Laminates', sub: 'High-pressure laminate · commonly 0.8 mm & 1 mm', img: 'laminates',
          what: 'Thin, hard-wearing sheets pasted over plywood or MDF. Hundreds of woodgrains, solid colours, high-gloss, matte, suede and textured finishes — resistant to scratches, heat and stains.',
          meters: [['Water resistance', 3], ['Strength', 3], ['Relative cost', 2]],
          best: ['Kitchen shutters', 'Wardrobe doors', 'TV units', 'Worktops (1 mm)'], note: 'The base board decides how long the job lasts.' }
      ]
    },
    {
      id: 'veneer', name: 'Veneer Work', short: 'Real-wood look', cover: 'veneer-natural', interest: 'Materials (plywood / wood / boards)',
      intro: 'Veneer is a paper-thin slice of wood glued onto a stable board. You get the look of solid timber at a fraction of the weight and cost, finished with a PU or melamine polish.',
      uses: ['Feature walls', 'TV units', 'Wardrobe shutters', 'Doors', 'Premium furniture'],
      items: [
        { id: 'natural', name: 'Natural Veneer', sub: 'Sliced from real logs · typically 0.3–0.6 mm', img: 'veneer-natural',
          what: 'Real wood grain, every sheet slightly different — teak, oak, walnut, ash and more. Warm and authentic, and it can be polished and touched up like timber.',
          meters: [['Natural look', 5], ['Colour consistency', 2], ['Relative cost', 4]],
          best: ['Feature walls', 'TV units', 'Wardrobe shutters', 'Doors'], note: 'Shade varies between logs and fades in strong sun.' },
        { id: 'engineered', name: 'Engineered Veneer', sub: 'Reconstituted — dyed, pressed & re-sliced', img: 'veneer-engineered',
          what: 'Made by dyeing fast-growing wood, pressing it into blocks and slicing it again. Every sheet matches the next — ideal for large, consistent surfaces, in grains nature rarely offers.',
          meters: [['Natural look', 3], ['Colour consistency', 5], ['Relative cost', 3]],
          best: ['Large wall panels', 'Matching wardrobes', 'Fluted / ribbed panels', 'Commercial interiors'], note: 'Uniform look — less natural variation.' }
      ]
    },
    {
      id: 'mdf', name: 'MDF / HDF Work', short: 'Smooth boards for carving & paint', cover: 'hdhmr', interest: 'Materials (plywood / wood / boards)',
      intro: 'Fibreboards are wood fibres pressed with resin into smooth, uniform boards — no grain, no knots. That is why they take paint, PU and CNC carving so well. The three types differ in density and moisture handling.',
      uses: ['Pooja units', 'Carved jaali panels', 'Painted / PU shutters', 'Fluted wall panels', 'Wardrobes'],
      items: [
        { id: 'mdf', name: 'MDF', sub: 'Medium Density Fibreboard', img: 'mdf',
          what: 'Super-smooth, uniform board that routes cleanly — perfect for carved jaali, fluted profiles, moulded shutters and paint or PU finishes. Keep it dry.',
          meters: [['Water resistance', 1], ['Strength', 2], ['Relative cost', 2]],
          best: ['Pooja units', 'Carved panels', 'Paint / PU shutters', 'Wall panelling'], note: 'Avoid wet areas and long unsupported shelf spans.' },
        { id: 'hdhmr', name: 'HDHMR', sub: 'High Density High Moisture Resistant', img: 'hdhmr',
          what: 'A denser board made with moisture-resistant resin. Holds screws far better than MDF, copes with humidity, and can be routed or laminated — a popular alternative to plywood for kitchens and wardrobes.',
          meters: [['Water resistance', 3], ['Strength', 4], ['Relative cost', 3]],
          best: ['Modular kitchens', 'Wardrobes', 'Wall units', 'Routed / laminated shutters'], note: 'Not for standing water — use BWP or marine there.' },
        { id: 'hdf', name: 'HDF', sub: 'High Density Fibreboard', img: 'hdf',
          what: 'A harder, denser fibreboard with a very smooth, tough surface that holds fine embossing and moulded detail. Usually supplied in thinner sheets.',
          meters: [['Water resistance', 2], ['Strength', 3], ['Relative cost', 2]],
          best: ['Moulded door skins', 'Cabinet back panels', 'Drawer bottoms', 'Embossed panels'], note: 'Thin sheets need a supporting frame or core.' }
      ]
    },
    {
      id: 'finish', name: 'Finishes & Fittings', short: 'The final touch', cover: null, interest: 'Materials (plywood / wood / boards)',
      intro: 'The surface and the hardware decide how a piece looks on day one and how it feels ten years later. We match both to the material underneath.',
      uses: ['Kitchens', 'Wardrobes', 'Doors', 'TV units', 'Mandirs'],
      items: [
        { id: 'pu', name: 'PU & Duco Paint', sub: 'Sprayed finishes', chip: ['#e9e1d3', '#8c8f7a'],
          what: 'A smooth sprayed finish in almost any colour, over MDF, HDHMR or plywood. Repairable and easy to touch up.',
          best: ['Shutters', 'Pooja units', 'Wall panels', 'Doors'], note: 'Needs a smooth base board.' },
        { id: 'polish', name: 'Melamine & Lacquer Polish', sub: 'Clear finishes for wood', chip: ['#c99358', '#7a4a22'],
          what: 'A clear protective coat that shows off the grain of natural veneer and solid timber — matt, semi-gloss or gloss.',
          best: ['Veneer shutters', 'Teak & rosewood', 'Dining tables', 'Doors'], note: 'Re-polish every few years keeps timber fresh.' },
        { id: 'acrylic', name: 'Acrylic & High-gloss', sub: 'Mirror-like panels', chip: ['#f4f1ea', '#aeb5c0'],
          what: 'Deep, glossy panels for a clean modern look. Wipe-clean and colour-rich, popular for kitchens and TV walls.',
          best: ['Kitchen shutters', 'TV units', 'Wardrobes', 'Feature panels'], note: 'Shows fingerprints — pair with profile handles.' },
        { id: 'hardware', name: 'Hardware & Lighting', sub: 'Hinges, channels, handles, LEDs', chip: ['#9aa0a6', '#3d4046'],
          what: 'Soft-close hinges and drawer channels, pull-out pantries, handles and profile handles, plus LED strip lighting for cabinets, coves and mandirs.',
          best: ['Modular kitchens', 'Wardrobes', 'Ceilings', 'Mandirs'], note: 'Good hardware matters as much as the board.' }
      ]
    }
  ],

  /* "Which material for which job" */
  guide: [
    { use: 'Modular kitchen', body: 'BWP or marine plywood, or HDHMR', face: 'Laminate, acrylic or PU', tip: 'Use BWP / marine around the sink and hob.', interest: 'Kitchen' },
    { use: 'Wardrobe', body: 'Commercial or BWR plywood, or pre-laminated board', face: 'Laminate or veneer', tip: 'Choose BWR in humid homes.', interest: 'Wardrobe' },
    { use: 'Main door', body: 'Teak, Honne or Mahogany', face: 'PU / melamine polish', tip: 'Teak is the classic; Honne is a strong alternative.', interest: 'Doors' },
    { use: 'Door & window frames', body: 'Red Sal, Honne or Teak', face: 'Polish or paint', tip: 'Frames carry the load — pick well-seasoned timber.', interest: 'Doors' },
    { use: 'TV unit & wall panel', body: 'Commercial / BWR plywood or MDF', face: 'Veneer, laminate or fluted panels', tip: 'Engineered veneer keeps big walls consistent.', interest: 'TV unit' },
    { use: 'Pooja mandir', body: 'Carved MDF, Teak or Rosewood', face: 'Natural polish or paint', tip: 'MDF for budget carving; timber for heirloom pieces.', interest: 'Pooja mandir' },
    { use: 'Bathroom vanity', body: 'Marine or BWP plywood, or HDHMR', face: 'Laminate or acrylic', tip: 'Avoid MDF and commercial plywood here.', interest: 'Something else' },
    { use: 'Beds & dining', body: 'Teak, Neem, Acacia or Mahogany — or plywood + veneer', face: 'Polish', tip: 'Solid frames, plywood panels is a common mix.', interest: 'Bedroom' },
    { use: 'False ceiling / wooden panelling', body: 'Commercial / BWR plywood or MDF', face: 'Veneer or laminate + cove light', tip: 'Light boards keep the load on the ceiling low.', interest: 'False ceiling' },
    { use: 'Office & shop furniture', body: 'Pre-laminated board or laminate on plywood', face: 'Melamine finish', tip: 'Fast, tidy and economical.', interest: 'Something else' }
  ],

  /* Boards compared at a glance (1-5; relative guide) */
  compare: {
    cols: ['Water resistance', 'Strength', 'Relative cost'],
    rows: [
      { name: 'Commercial plywood', v: [2, 3, 1], use: 'Dry-room carcasses' },
      { name: 'BWR plywood', v: [3, 4, 2], use: 'Humid-area cabinets' },
      { name: 'BWP plywood', v: [4, 4, 3], use: 'Kitchens & wet zones' },
      { name: 'Marine plywood', v: [5, 5, 4], use: 'Constant moisture' },
      { name: 'Pre-laminated board', v: [1, 2, 1], use: 'Dry office / wardrobe interiors' },
      { name: 'MDF', v: [1, 2, 2], use: 'Carving, paint & PU' },
      { name: 'HDHMR', v: [3, 4, 3], use: 'Kitchens & wardrobes' },
      { name: 'HDF', v: [2, 3, 2], use: 'Door skins & back panels' }
    ]
  },

  faq: [
    { q: 'BWR or BWP — which is right for my kitchen?', a: 'Use BWP (or marine) wherever water can sit — around the sink, hob and base units. BWR is usually fine for wall units and dry-side cabinets. If you are unsure, we can suggest the right grade after seeing the layout.' },
    { q: 'What is the difference between plywood, MDF and HDHMR?', a: 'Plywood is layered wood veneer: strong, flexible and the best with screws and moisture. MDF is a smooth fibreboard that is excellent for paint and carving but dislikes water. HDHMR sits in between — denser and moisture-resistant, so it is a popular alternative to plywood in kitchens and wardrobes.' },
    { q: 'Laminate or veneer?', a: 'Laminate is a decorative surface: wipe-clean, colour-consistent, wide choice and lower cost. Veneer is real wood: natural variation, can be polished and touched up, and feels more premium — but needs a little more care.' },
    { q: 'Is solid wood better than plywood?', a: 'They do different jobs. Solid wood is ideal for doors, frames and statement furniture. Plywood and boards suit large flat parts — kitchens and wardrobes — because wide panels of solid wood can warp. Most good projects use both.' },
    { q: 'Which wood is best for a main door?', a: 'Teak is the classic choice for its stability and weather resistance. Honne and Mahogany are strong alternatives, and Red Sal is a sturdy, economical option for frames. We can show you samples and help you compare.' },
    { q: 'Do you supply materials only, or complete interiors?', a: 'Both. We manufacture finished work to your measurements and also supply wood products in quantity to builders, designers and dealers. Tell us which you need in the enquiry form.' },
    { q: 'How is the price decided?', a: 'By the material, the size, the finish and the fittings. The Instant Quote tool on this page gives an approximate figure in seconds; the final price is confirmed after we discuss your requirements and take measurements.' },
    { q: 'Can I visit and see the materials?', a: 'Yes — you are welcome at our shop — {{ADDR}} — {{HOURS}}. You can also call or message us on WhatsApp first.' }
  ]
};
