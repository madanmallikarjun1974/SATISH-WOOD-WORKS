/* ============================================================
   SATISH INTERIOR WORLD — edit this file to update the website
   ============================================================ */
window.SWW = {
  name: 'Satish Interior World',
  tagline: 'Manufacturer · Wholesaler · Interior Woodworks',

  // Shop phone / WhatsApp (10 digits, no spaces). Switches on the Call + WhatsApp buttons.
  phone: '9606080871',
  // Every visitor registration, enquiry and quotation is e-mailed to this address.
  // (First time only: FormSubmit sends one "activate" e-mail to this inbox — click the link in it.)
  email: 'satishinteriorworld@gmail.com',

  address: {
    line1: '#2, Pipeline Road, Ganigarahalli',
    line2: 'Bangalore – 560090',
    full: '#2 Pipeline Road, Ganigarahalli, Bangalore – 560090',
    mapsLink: 'https://maps.app.goo.gl/fVx5kCrVqAEBuy5YA',
    embed: 'https://www.google.com/maps?q=Pipeline+Road,+Ganigarahalli,+Bengaluru+560090&output=embed'
  },

  // Opening hours in Indian time. day 0 = Sunday … 6 = Saturday. null = closed all day.
  timezone: 'Asia/Kolkata',
  hours: {
    0: null,
    1: ['09:00', '18:00'], 2: ['09:00', '18:00'], 3: ['09:00', '18:00'],
    4: ['09:00', '18:00'], 5: ['09:00', '18:00'], 6: ['09:00', '18:00']
  },

  /* ---------- Owner dashboard (owner.html) ----------
     Google Apps Script "Web app" URL (the owner dashboard and the lead store).
     Until then, leads still arrive by e-mail; the dashboard needs this link to list them all. */
  sheetUrl: '',

  /* PREVIEW switch — when true nothing is sent to e-mail / Google Sheet (used for demos). Keep false when live. */
  previewMode: false,
  previewBadge: true,   // preview only: shows the small PREVIEW bar. Not used on the live website.

  /* ---------- Customer reviews ----------
     Reviews are written by real customers on the website (button "Write a review") and appear after the owner presses
     "Approve" in the owner dashboard. Nothing is made up. To add a review you already have (e.g. copied from Google
     reviews) with the customer's permission, add it here:  { name: 'Ramesh K', place: 'Modular kitchen', stars: 5, text: '…' }  */
  reviews: []
};
