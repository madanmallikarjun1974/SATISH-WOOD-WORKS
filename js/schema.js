/* Shared by the browser (owner dashboard Excel download, enquiry fallback) and server.js (Excel file on disk). */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SWW_SCHEMA = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  function s(v) { return v == null ? '' : Array.isArray(v) ? v.join(', ') : String(v); }
  function ph(v) { v = s(v).replace(/[^\d]/g, ''); return v.length === 10 ? '+91 ' + v.slice(0, 5) + ' ' + v.slice(5) : v; }
  function money(v) { return v == null || v === '' ? '' : '₹' + Math.round(Number(v)).toLocaleString('en-IN'); }

  /* the sheets of leads.xlsx — each column is [header, width, getter(record)] */
  var SHEETS = {
    registrations: { name: 'Visitors (entry form)', type: 'registration', cols: [
      ['Received (IST)', 24, function (r) { return r.time; }], ['Lead ID', 14, function (r) { return r.id; }], ['Name', 22, function (r) { return r.name; }],
      ['Phone / WhatsApp', 18, function (r) { return ph(r.phone); }], ['Email', 26, function (r) { return r.email; }], ['Area / City', 20, function (r) { return r.area; }],
      ['Looking for', 26, function (r) { return r.interest; }], ['Language', 10, function (r) { return r.lang === 'kn' ? 'Kannada' : 'English'; }]
    ] },
    enquiries: { name: 'Detailed enquiries', type: 'enquiry', cols: [
      ['Received (IST)', 24, function (r) { return r.time; }], ['Enquiry no.', 14, function (r) { return r.clientRef || r.id; }], ['Customer name', 22, function (r) { return r.name; }],
      ['Phone / WhatsApp', 18, function (r) { return ph(r.phone); }], ['Email', 26, function (r) { return r.email; }], ['Area / City', 20, function (r) { return r.area; }],
      ['Property type', 18, function (r) { return r.propertyType; }], ['Wants to build', 34, function (r) { return r.interests; }], ['Style', 14, function (r) { return r.style; }],
      ['When needed', 16, function (r) { return r.timeline; }], ['Best time to call', 16, function (r) { return r.callTime; }], ['Details / requirements', 60, function (r) { return r.details; }],
      ['Design / material of interest', 30, function (r) { return r.design; }]
    ] },
    reviews: { name: 'Customer reviews', type: 'review', cols: [
      ['Received (IST)', 24, function (r) { return r.time; }], ['Review ID', 14, function (r) { return r.id; }], ['Name', 22, function (r) { return r.name; }],
      ['Phone / WhatsApp', 18, function (r) { return ph(r.phone); }], ['Stars', 8, function (r) { return r.stars; }], ['Work done', 24, function (r) { return r.place; }],
      ['Review', 80, function (r) { return r.text; }], ['Status', 14, function (r) { return r.status === 'approved' ? 'Approved' : r.status === 'hidden' ? 'Hidden' : 'Waiting for approval'; }]
    ] },
    quotations: { name: 'Quotations', type: 'quotation', cols: [
      ['Received (IST)', 24, function (r) { return r.time; }], ['Quote no.', 14, function (r) { return r.quoteNo; }], ['Name', 22, function (r) { return r.name; }],
      ['Phone / WhatsApp', 18, function (r) { return ph(r.phone); }], ['Items', 70, function (r) { return r.items; }], ['Subtotal', 14, function (r) { return money(r.subtotal); }],
      ['GST', 18, function (r) { return r.gst; }], ['Approx. total', 16, function (r) { return money(r.total); }], ['Range', 24, function (r) { return r.lo != null ? money(r.lo) + ' – ' + money(r.hi) : ''; }],
      ['Sent via', 18, function (r) { return r.channel; }], ['Language', 10, function (r) { return r.lang === 'kn' ? 'Kannada' : 'English'; }], ['Sample rates?', 12, function (r) { return r.sample ? 'Yes' : ''; }]
    ] }
  };
  function summary(r) {
    if (r.type === 'registration') return r.interest || '';
    if (r.type === 'enquiry') return s(r.interests) + (r.details ? ' — ' + r.details : '');
    if (r.type === 'review') return '★'.repeat(+r.stars || 0) + ' ' + s(r.text);
    if (r.type === 'quotation') return (s(r.cats) || '') + (r.total != null ? ' · ' + money(r.total) : '');
    return '';
  }
  function build(def, records) {
    var rows = records.filter(function (r) { return r.type === def.type; }).sort(function (a, b) { return a.ts < b.ts ? 1 : -1; });
    return { name: def.name, columns: def.cols.map(function (c) { return { header: c[0], width: c[1] }; }), rows: rows.map(function (r) { return def.cols.map(function (c) { return s(c[2](r)); }); }) };
  }
  var TYPE_LABEL = { registration: 'Visitor (entry form)', enquiry: 'Detailed enquiry', quotation: 'Quotation', review: 'Customer review' };
  function all(records) {
    var rows = records.slice().sort(function (a, b) { return a.ts < b.ts ? 1 : -1; });
    return { name: 'All activity', columns: [{ header: 'Received (IST)', width: 24 }, { header: 'Type', width: 22 }, { header: 'Name', width: 22 }, { header: 'Phone / WhatsApp', width: 18 }, { header: 'Email', width: 26 }, { header: 'Area / City', width: 20 }, { header: 'Summary', width: 70 }],
      rows: rows.map(function (r) { return [s(r.time), TYPE_LABEL[r.type] || r.type, s(r.name), ph(r.phone), s(r.email), s(r.area), summary(r)]; }) };
  }
  /* every sheet for leads.xlsx */
  function sheets(records) { return [all(records), build(SHEETS.registrations, records), build(SHEETS.enquiries, records), build(SHEETS.quotations, records), build(SHEETS.reviews, records)]; }
  /* a single enquiry (the visitor's own "download my enquiry" fallback) */
  function sheet(records) { return build(SHEETS.enquiries, records.map(function (r) { return Object.assign({ type: 'enquiry', ts: '' }, r); })); }
  return { sheets: sheets, sheet: sheet, summary: summary, ph: ph, money: money, TYPE_LABEL: TYPE_LABEL };
});
