/*
 * Satish Interior World — tiny website server (no npm install needed, only Node.js 16+).
 *  - Serves this folder as a website
 *  - Receives every lead (entry form, detailed enquiry, quotation) and saves it into  data/leads.xlsx  (Excel)
 *  - Serves the owner dashboard data (owner.html, password protected)
 * Start:  double-click start-server.bat   (or run: node server.js)
 */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const XlsxLite = require('./js/xlsx-lite.js');
const SCHEMA = require('./js/schema.js');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const JSON_FILE = path.join(DATA_DIR, 'leads.json');
const XLSX_FILE = path.join(DATA_DIR, 'leads.xlsx');
fs.mkdirSync(DATA_DIR, { recursive: true });
const PW_FILE = path.join(DATA_DIR, 'owner-password.txt');
// password for owner.html when running locally: set OWNER_PASSWORD, or edit data/owner-password.txt (created on first run)
const OWNER_PASSWORD = process.env.OWNER_PASSWORD || (() => {
  try { const t = fs.readFileSync(PW_FILE, 'utf8').trim(); if (t) return t; } catch (e) {}
  const t = require('crypto').randomBytes(5).toString('hex'); try { fs.writeFileSync(PW_FILE, t + '\n'); } catch (e) {} return t;
})();
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8', '.woff2': 'font/woff2'
};
// never serve these to the public
const BLOCKED = [/^\/data(\/|$)/, /^\/owner-setup(\/|$)/, /^\/OWNER-SETUP/i, /^\/_redirects$/, /^\/netlify\.toml$/, /^\/server\.js$/, /^\/package\.json$/, /^\/start-server/, /^\/README/i, /^\/\./];

fs.mkdirSync(DATA_DIR, { recursive: true });

function istStamp(d) {
  return new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).format(d) + ' IST';
}
function load() { try { return JSON.parse(fs.readFileSync(JSON_FILE, 'utf8')); } catch (e) { return []; } }
function writeXlsx(records) {
  const buf = Buffer.from(XlsxLite.build(SCHEMA.sheets(records)));
  const tmp = XLSX_FILE + '.tmp';
  fs.writeFileSync(tmp, buf);
  try { fs.renameSync(tmp, XLSX_FILE); return XLSX_FILE; }
  catch (e) {
    // Excel keeps the file locked while it is open on Windows — save a side copy so nothing is lost
    const alt = path.join(DATA_DIR, 'leads-latest.xlsx');
    try { fs.copyFileSync(tmp, alt); fs.unlinkSync(tmp); } catch (e2) {}
    console.warn('  ! leads.xlsx is open in Excel — wrote data/leads-latest.xlsx instead. Close Excel to refresh the main file.');
    return alt;
  }
}
const clean = (v, max) => String(v == null ? '' : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max || 200);
const hits = new Map();
function limited(ip) {
  const now = Date.now(), arr = (hits.get(ip) || []).filter(t => now - t < 60000);
  arr.push(now); hits.set(ip, arr); return arr.length > 6;
}
const TYPES = ['registration', 'enquiry', 'quotation', 'review'];
const REVIEW_FILE = path.join(DATA_DIR, 'review-status.json');   // id -> 'approved' | 'hidden'
const reviewStatus = () => { try { return JSON.parse(fs.readFileSync(REVIEW_FILE, 'utf8')); } catch (e) { return {}; } };
const KEEP = ['id', 'type', 'ts', 'time', 'vid', 'name', 'phone', 'email', 'area', 'interest', 'lang', 'propertyType', 'interests', 'style', 'timeline', 'callTime', 'details', 'design', 'clientRef', 'quoteNo', 'channel', 'items', 'subtotal', 'gst', 'total', 'lo', 'hi', 'cats', 'sample', 'stars', 'place', 'text'];
function handleLead(req, res) {
  let size = 0; const chunks = [];
  req.on('data', c => { size += c.length; if (size > 60000) { req.destroy(); } else chunks.push(c); });
  req.on('end', () => {
    const send = (code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(obj)); };
    let body; try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch (e) { return send(400, { ok: false, error: 'Bad request' }); }
    if (!body || TYPES.indexOf(body.type) < 0) return send(400, { ok: false, error: 'Bad request' });
    if (limited(req.socket.remoteAddress || 'x')) return send(429, { ok: false, error: 'Too many requests, please try again in a minute.' });
    const digits = clean(body.phone, 20).replace(/[^\d+]/g, '').replace(/^\+?91/, '');
    if (clean(body.name, 80).length < 2) return send(422, { ok: false, error: 'Please enter your name.' });
    if (!/^[6-9]\d{9}$/.test(digits)) return send(422, { ok: false, error: 'Please enter a valid 10-digit mobile number.' });
    const rec = {};
    KEEP.forEach(k => { const v = body[k]; if (v == null) return; rec[k] = Array.isArray(v) ? v.map(x => clean(x, 200)).slice(0, 20) : (typeof v === 'number' ? v : clean(v, k === 'details' || k === 'items' ? 2000 : k === 'text' ? 600 : 200)); });
    rec.phone = digits; rec.time = rec.time || istStamp(new Date()); rec.ts = rec.ts || new Date().toISOString();
    if (rec.type === 'review') {
      rec.stars = Math.max(1, Math.min(5, Math.round(+rec.stars || 0)));
      if (!rec.stars || String(rec.text || '').length < 10) return send(422, { ok: false, error: 'Please write your review and choose the stars.' });
    }
    const records = load();
    if (rec.id && records.some(r => r.id === rec.id)) return send(200, { ok: true, ref: rec.id, duplicate: true });
    rec.id = rec.id || (rec.type[0].toUpperCase() + '-' + Date.now().toString(36).toUpperCase());
    records.push(rec);
    try {
      fs.writeFileSync(JSON_FILE, JSON.stringify(records, null, 1));
      const file = writeXlsx(records);
      console.log('  + ' + rec.type.padEnd(12) + rec.name + '  ' + rec.phone + '  → ' + path.basename(file));
      send(200, { ok: true, ref: rec.id });
    } catch (e) { console.error(e); send(500, { ok: false, error: 'Could not save on the server.' }); }
  });
}
const bad = new Map();
function handleOwner(req, res) {
  const u = new URL(req.url, 'http://x'), ip = req.socket.remoteAddress || 'x', now = Date.now();
  const send = (code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(obj)); };
  const fails = (bad.get(ip) || []).filter(t => now - t < 60000);
  if (fails.length >= 8) return send(429, { ok: false, error: 'Too many wrong passwords — wait a minute.' });
  if (u.searchParams.get('key') !== OWNER_PASSWORD) { fails.push(now); bad.set(ip, fails); return send(401, { ok: false, error: 'Wrong password' }); }
  const st = reviewStatus();
  if (u.pathname === '/api/owner/review') {
    const id = u.searchParams.get('id'), val = u.searchParams.get('status');
    if (!id || ['approved', 'hidden', 'pending'].indexOf(val) < 0) return send(400, { ok: false, error: 'Bad request' });
    if (val === 'pending') delete st[id]; else st[id] = val;
    fs.writeFileSync(REVIEW_FILE, JSON.stringify(st, null, 1));
    return send(200, { ok: true });
  }
  send(200, { ok: true, rows: load().map(r => r.type === 'review' ? Object.assign({}, r, { status: st[r.id] || 'pending' }) : r) });
}
function handlePublicReviews(req, res) {
  const st = reviewStatus();
  const rows = load().filter(r => r.type === 'review' && st[r.id] === 'approved').sort((a, b) => a.ts < b.ts ? 1 : -1).slice(0, 60)
    .map(r => ({ id: r.id, name: r.name, place: r.place || '', stars: r.stars, text: r.text, ts: r.ts }));
  res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify({ ok: true, rows }));
}
function serveStatic(req, res) {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/') && p.length > 1) p = p.slice(0, -1);
  if (p === '/owner' || p === '/owner-guide') p += '.html';
  if (p === '/') p = '/index.html';
  if (BLOCKED.some(r => r.test(p))) { res.writeHead(404); return res.end('Not found'); }
  const file = path.normalize(path.join(ROOT, p));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Not found'); }
    const ext = path.extname(file).toLowerCase();
    const cache = /\.(webp|jpg|png|svg|woff2)$/.test(ext) ? 'public, max-age=2592000' : 'no-cache';
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Content-Length': st.size, 'Cache-Control': cache });
    fs.createReadStream(file).pipe(res);
  });
}
http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/lead') return handleLead(req, res);
  if (req.method === 'GET' && (req.url.startsWith('/api/owner/leads') || req.url.startsWith('/api/owner/review'))) return handleOwner(req, res);
  if (req.method === 'GET' && req.url.split('?')[0] === '/api/reviews') return handlePublicReviews(req, res);
  if (req.method === 'GET' && req.url === '/api/health') { res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end('{"ok":true}'); }
  if (req.method === 'GET' || req.method === 'HEAD') return serveStatic(req, res);
  res.writeHead(405); res.end();
}).listen(PORT, () => {
  console.log('\n  Satish Interior World website is running');
  console.log('  Open  http://localhost:' + PORT);
  console.log('  Owner dashboard  http://localhost:' + PORT + '/owner.html   (password: ' + OWNER_PASSWORD + ')');
  console.log('  Leads are saved to  ' + XLSX_FILE + '\n');
  if (!fs.existsSync(XLSX_FILE)) writeXlsx(load());
});
