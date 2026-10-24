/* Shared by the browser (Excel download fallback) and server.js (Excel file on disk). */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SWW_SCHEMA = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  var COLUMNS = [
    { key: 'ref',          header: 'Enquiry No.',        width: 14 },
    { key: 'receivedAt',   header: 'Received (IST)',     width: 24 },
    { key: 'name',         header: 'Customer Name',      width: 22 },
    { key: 'phone',        header: 'Phone / WhatsApp',   width: 18 },
    { key: 'email',        header: 'Email',              width: 26 },
    { key: 'area',         header: 'Area / City',        width: 20 },
    { key: 'propertyType', header: 'Property Type',      width: 18 },
    { key: 'interests',    header: 'Wants to Build',     width: 34 },
    { key: 'style',        header: 'Style',              width: 16 },
    { key: 'timeline',     header: 'When Needed',        width: 18 },
    { key: 'callTime',     header: 'Best Time to Call',  width: 18 },
    { key: 'details',      header: 'Details / Requirements', width: 60 },
    { key: 'design',       header: 'Design They Liked',  width: 30 },
    { key: 'status',       header: 'Follow-up Status',   width: 18 }
  ];
  function toRow(rec) { return COLUMNS.map(function (c) { return rec[c.key] == null ? '' : String(rec[c.key]); }); }
  function sheet(records) { return { name: 'Enquiries', columns: COLUMNS, rows: records.map(toRow) }; }
  return { COLUMNS: COLUMNS, toRow: toRow, sheet: sheet };
});
