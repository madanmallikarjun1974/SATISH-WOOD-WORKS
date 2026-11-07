/* ==========================================================================
   SATISH INTERIOR WORLD — lead store (Google Apps Script)
   Paste this whole file into:  Google Sheet  >  Extensions  >  Apps Script
   Step-by-step guide: your-website/owner-guide  (also OWNER-SETUP.txt).
   ========================================================================== */

var OWNER_PASSWORD = 'PUT-YOUR-PASSWORD-HERE';   // <-- type your owner password here, inside Google only (never in the website files or on GitHub). Then deploy — see owner-guide.
var SHEET_NAME = 'Leads';
var HEADERS = ['Time (IST)', 'Type', 'Name', 'Phone', 'Email', 'Area', 'Looking for', 'Details', 'Quote total (Rs)', 'Lead ID', 'Visitor ID', 'Timestamp (UTC)', 'Raw data (JSON)'];
var REVIEW_SHEET = 'Reviews';
var REVIEW_HEADERS = ['Time (IST)', 'Status', 'Name', 'Work done', 'Stars', 'Review', 'Phone', 'Review ID', 'Timestamp (UTC)'];   // Status: Pending / Approved / Hidden
var TYPES = { registration: 'Visitor (entry form)', enquiry: 'Detailed enquiry', quotation: 'Quotation' };

function reviewSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(REVIEW_SHEET) || ss.insertSheet(REVIEW_SHEET);
  if (sh.getLastRow() === 0) {
    sh.appendRow(REVIEW_HEADERS); sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, REVIEW_HEADERS.length).setFontWeight('bold').setBackground('#f2c577');
    sh.setColumnWidth(1, 170); sh.setColumnWidth(3, 160); sh.setColumnWidth(6, 460);
  }
  return sh;
}
function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS); sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#f2c577');
    sh.setColumnWidth(1, 170); sh.setColumnWidth(3, 160); sh.setColumnWidth(4, 130); sh.setColumnWidth(8, 420);
  }
  return sh;
}
/* stop a customer's text from being treated as a spreadsheet formula */
function safe_(v, max) {
  var s = String(v == null ? '' : (Array.isArray(v) ? v.join(', ') : v)).slice(0, max || 500);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
function details_(r) {
  if (r.type === 'enquiry') return [r.propertyType, r.style, r.timeline, r.callTime, r.details, r.design].filter(Boolean).join(' | ');
  if (r.type === 'quotation') return [r.quoteNo, r.channel, r.items].filter(Boolean).join(' | ');
  return [r.area, r.lang === 'kn' ? 'Kannada' : ''].filter(Boolean).join(' | ');
}

/* receives every lead from the website */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var raw = e && e.postData && e.postData.contents || '';
    if (raw.length > 20000) return out_({ ok: false, error: 'too large' });
    var r = JSON.parse(raw);
    if (!r || !r.id || (!TYPES[r.type] && r.type !== 'review')) return out_({ ok: false, error: 'bad request' });
    lock.waitLock(20000);
    if (r.type === 'review') return addReview_(r);
    var sh = sheet_(), n = sh.getLastRow();
    if (n > 1) {                                   // ignore a lead we already have (the website retries on a bad connection)
      var ids = sh.getRange(2, 10, n - 1, 1).getValues();
      for (var i = 0; i < ids.length; i++) if (ids[i][0] === r.id) return out_({ ok: true, duplicate: true });
    }
    var looking = r.type === 'enquiry' ? r.interests : r.type === 'registration' ? r.interest : r.cats;
    sh.appendRow([
      safe_(r.time, 40), TYPES[r.type], safe_(r.name, 120), "'" + safe_(r.phone, 20), safe_(r.email, 120), safe_(r.area, 120),
      safe_(looking, 300), safe_(details_(r), 1500), r.type === 'quotation' ? Number(r.total) || '' : '',
      safe_(r.id, 40), safe_(r.vid, 40), safe_(r.ts, 40), JSON.stringify(r)
    ]);
    return out_({ ok: true });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

/* a customer's review: saved as "Pending" until the owner approves it (dashboard button, or type Approved in the Status column) */
function addReview_(r) {
  var stars = Math.round(Number(r.stars));
  if (!(stars >= 1 && stars <= 5) || String(r.text || '').length < 10) return out_({ ok: false, error: 'invalid review' });
  var sh = reviewSheet_(), n = sh.getLastRow();
  if (n > 1) { var ids = sh.getRange(2, 8, n - 1, 1).getValues(); for (var i = 0; i < ids.length; i++) if (ids[i][0] === r.id) return out_({ ok: true, duplicate: true }); }
  sh.appendRow([safe_(r.time, 40), 'Pending', safe_(r.name, 60), safe_(r.place, 80), stars, safe_(r.text, 600), "'" + safe_(r.phone, 20), safe_(r.id, 40), safe_(r.ts, 40)]);
  return out_({ ok: true });
}
function reviews_(all) {
  var sh = reviewSheet_(), n = sh.getLastRow(), out = [];
  if (n < 2) return out;
  var v = sh.getRange(2, 1, n - 1, 9).getValues();
  for (var i = v.length - 1; i >= 0; i--) {
    var st = String(v[i][1] || 'Pending').toLowerCase();
    if (!all && st !== 'approved') continue;
    var o = { id: String(v[i][7]), name: String(v[i][2]), place: String(v[i][3]), stars: Number(v[i][4]), text: String(v[i][5]), ts: String(v[i][8]) };
    if (all) { o.type = 'review'; o.time = String(v[i][0]); o.status = st; o.phone = String(v[i][6]).replace(/^'/, ''); }
    out.push(o);
    if (!all && out.length >= 60) break;
  }
  return out;
}

/* the owner dashboard (owner.html) reads everything from here — only with the right password */
function doGet(e) {
  var p = (e && e.parameter) || {};
  if (p.action === 'list') {
    if (OWNER_PASSWORD === 'PUT-YOUR-PASSWORD-HERE' || String(p.key || '') !== OWNER_PASSWORD) { Utilities.sleep(1200); return out_({ ok: false, error: 'Wrong password' }, p.callback); }
    var sh = sheet_(), n = sh.getLastRow(), rows = [];
    if (n > 1) {
      var vals = sh.getRange(2, 13, n - 1, 1).getValues();
      for (var i = 0; i < vals.length; i++) { try { rows.push(JSON.parse(vals[i][0])); } catch (x) {} }
    }
    return out_({ ok: true, rows: rows.concat(reviews_(true)) }, p.callback);
  }
  if (p.action === 'reviews') return out_({ ok: true, rows: reviews_(false) }, p.callback);          // public: approved reviews only (no phone numbers)
  if (p.action === 'review_set') {                                                                   // owner presses Approve / Hide in the dashboard
    if (OWNER_PASSWORD === 'PUT-YOUR-PASSWORD-HERE' || String(p.key || '') !== OWNER_PASSWORD) { Utilities.sleep(1200); return out_({ ok: false, error: 'Wrong password' }, p.callback); }
    var want = { approved: 'Approved', hidden: 'Hidden', pending: 'Pending' }[String(p.status)];
    if (!want) return out_({ ok: false, error: 'bad status' }, p.callback);
    var rs = reviewSheet_(), rn = rs.getLastRow();
    if (rn > 1) { var rid = rs.getRange(2, 8, rn - 1, 1).getValues(); for (var j = 0; j < rid.length; j++) if (rid[j][0] === p.id) { rs.getRange(j + 2, 2).setValue(want); return out_({ ok: true }, p.callback); } }
    return out_({ ok: false, error: 'not found' }, p.callback);
  }
  return out_({ ok: true, service: 'Satish Interior World lead store' }, p.callback);
}

function out_(obj, cb) {
  var s = JSON.stringify(obj);
  if (cb && /^[A-Za-z0-9_.$]+$/.test(cb)) return ContentService.createTextOutput(cb + '(' + s + ');').setMimeType(ContentService.MimeType.JAVASCRIPT);
  return ContentService.createTextOutput(s).setMimeType(ContentService.MimeType.JSON);
}
