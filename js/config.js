/* ============================================================
   SATISH WOOD WORKS — edit this file to update the website
   ============================================================ */
window.SWW = {
  name: 'Satish Wood Works',
  tagline: 'Manufacturer · Wholesaler · Interior Woodworks',
  established: 2017,
  manager: 'Mr. Srinivas',

  // ➜ PUT THE SHOP WHATSAPP NUMBER HERE (10 digits, no spaces). Enquiries are then sent to this WhatsApp number, and the Call + WhatsApp buttons switch on.
  phone: '',
  email: '',

  address: {
    line1: '#456 / #52, 1st Cross, Narayanaswamy Layout',
    line2: 'Abbigere, Bengaluru, Karnataka 560090',
    mapsLink: 'https://maps.app.goo.gl/VZY8yzGxyXu1Qmnt9',
    embed: 'https://www.google.com/maps?q=Satish+Wood+Works,+Narayanaswamy+Layout,+Abbigere,+Bengaluru+560090&output=embed'
  },

  // Opening hours in Indian time. day 0 = Sunday … 6 = Saturday. null = closed all day.
  timezone: 'Asia/Kolkata',
  hours: {
    0: null,
    1: ['09:00', '19:30'], 2: ['09:00', '19:30'], 3: ['09:00', '19:30'],
    4: ['09:00', '19:30'], 5: ['09:00', '19:30'], 6: ['09:00', '19:30']
  },

  // Show a small "Sample" tag on testimonials until you replace them with real customer reviews.
  showSampleBadge: true,

  /* ➜ REPLACE these with real customer reviews (copy from Google reviews / WhatsApp).
       Set sample:false on each real one. */
  testimonials: [
    { name: 'Sample review', place: 'Living room', text: 'The fluted wall panel and TV unit turned out exactly like the design we picked on the website. Neat finish and on-time installation.', stars: 5, sample: true },
    { name: 'Sample review', place: 'Modular kitchen', text: 'They measured our kitchen, suggested a better layout and built everything in their own workshop. The pull-out pantry is our favourite part.', stars: 5, sample: true },
    { name: 'Sample review', place: 'Wardrobes', text: 'Sliding wardrobe with a fitted interior — the drawers and shelves are solid and the doors glide smoothly.', stars: 5, sample: true },
    { name: 'Sample review', place: 'Pooja mandir', text: 'A carved teak mandir for our new home. The detailing on the pillars and arch is beautiful.', stars: 5, sample: true },
    { name: 'Sample review', place: 'Main door', text: 'We wanted a heritage-style carved entrance door. The team understood the style and delivered a door we are proud of.', stars: 5, sample: true },
    { name: 'Sample review', place: 'Bedroom', text: 'Upholstered headboard with side tables and under-bed storage — comfortable, sturdy and exactly to our room size.', stars: 5, sample: true },
    { name: 'Sample review', place: 'False ceiling', text: 'The wooden slat ceiling with cove lights changed the whole look of our hall.', stars: 5, sample: true },
    { name: 'Sample review', place: 'Dining set', text: 'Solid wood dining table and chairs made to our size. Delivery was careful and quick.', stars: 5, sample: true },
    { name: 'Sample review', place: 'TV unit', text: 'Clean design, concealed wiring and plenty of storage. They finished the work in the promised time.', stars: 5, sample: true },
    { name: 'Sample review', place: 'Bulk order', text: 'We order wood products in quantity for our projects. Consistent quality and a straightforward process every time.', stars: 5, sample: true },
    { name: 'Sample review', place: 'Showcase unit', text: 'Glass shelves with LED lighting and fluted side panels. Looks premium and fits the wall perfectly.', stars: 5, sample: true },
    { name: 'Sample review', place: 'Full home interiors', text: 'One team for kitchen, wardrobes, ceiling and furniture made the whole project easy to manage.', stars: 5, sample: true }
  ]
};
