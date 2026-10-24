/*
 * Satish Wood Works — tiny website server (no npm install needed, only Node.js 16+).
 *  - Serves this folder as a website
 *  - Receives the enquiry form and saves every enquiry into  data/enquiries.xlsx  (Excel)
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
const JSON_FILE = path.join(DATA_DIR, 'enquiries.json');
const XLSX_FILE = path.join(DATA_DIR, 'enquiries.xlsx');
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8', '.woff2': 'font/woff2'
};
// never serve these to the public
const BLOCKED = [/^\/data(\/|$)/, /^\/server\.js$/, /^\/package\.json$/, /^\/start-server/, /^\/README/i, /^\/\./];

fs.mkdirSync(DATA_DIR, { recursive: true });

function istStamp(d) {
  return new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).format(d) + ' IST';
}
function load() { try { return JSON.parse(fs.readFileSync(JSON_FILE, 'utf8')); } catch (e) { return []; } }
function writeXlsx(records) {
  const buf = Buffer.from(XlsxLite.build([SCHEMA.sheet(records)]));
  const tmp = XLSX_FILE + '.tmp';
  fs.writeFileSync(tmp, buf);
  try { fs.renameSync(tmp, XLSX_FILE); return XLSX_FILE; }
  catch (e) {
    // Excel keeps the file locked while it is open on Windows — save a side copy so nothing is lost
    const alt = path.join(DATA_DIR, 'enquiries-latest.xlsx');
    try { fs.copyFileSync(tmp, alt); fs.unlinkSync(tmp); } catch (e2) {}
    console.warn('  ! enquiries.xlsx is open in Excel — wrote data/enquiries-latest.xlsx instead. Close Excel to refresh the main file.');
    return alt;
  }
}
const clean = (v, max) => String(v == null ? '' : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max || 200);
const hits = new Map();
function limited(ip) {
  const now = Date.now(), arr = (hits.get(ip) || []).filter(t => now - t < 60000);
  arr.push(now); hits.set(ip, arr); return arr.length > 6;
}
function handleEnquiry(req, res) {
  let size = 0; const chunks = [];
  req.on('data', c => { size += c.length; if (size > 60000) { req.destroy(); } else chunks.push(c); });
  req.on('end', () => {
    const send = (code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(obj)); };
    let body; try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch (e) { return send(400, { ok: false, error: 'Bad request' }); }
    if (body.website) return send(200, { ok: true, ref: 'SWW-0000' }); // honeypot: pretend success
    if (limited(req.socket.remoteAddress || 'x')) return send(429, { ok: false, error: 'Too many requests, please try again in a minute.' });
    const phone = clean(body.phone, 20).replace(/[^\d+]/g, '');
    const digits = phone.replace(/^\+?91/, '');
    if (clean(body.name, 80).length < 2) return send(422, { ok: false, error: 'Please enter your name.' });
    if (!/^[6-9]\d{9}$/.test(digits)) return send(422, { ok: false, error: 'Please enter a valid 10-digit mobile number.' });
    const records = load();
    const n = records.length + 1;
    const rec = {
      ref: 'SWW-' + String(n).padStart(4, '0'),
      receivedAt: istStamp(new Date()),
      name: clean(body.name, 80), phone: '+91 ' + digits.slice(0, 5) + ' ' + digits.slice(5),
      email: clean(body.email, 120), area: clean(body.area, 80), propertyType: clean(body.propertyType, 40),
      interests: Array.isArray(body.interests) ? body.interests.map(x => clean(x, 40)).slice(0, 14).join(', ') : clean(body.interests, 300),
      style: clean(body.style, 40), timeline: clean(body.timeline, 40), callTime: clean(body.callTime, 40),
      details: clean(body.details, 2000), design: clean(body.design, 120), status: 'New'
    };
    records.push(rec);
    try {
      fs.writeFileSync(JSON_FILE, JSON.stringify(records, null, 1));
      const file = writeXlsx(records);
      console.log('  + ' + rec.ref + '  ' + rec.name + '  ' + rec.phone + '  → ' + path.basename(file));
      send(200, { ok: true, ref: rec.ref });
    } catch (e) { console.error(e); send(500, { ok: false, error: 'Could not save the enquiry on the server.' }); }
  });
}
function serveStatic(req, res) {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
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
  if (req.method === 'POST' && req.url === '/api/enquiry') return handleEnquiry(req, res);
  if (req.method === 'GET' && req.url === '/api/health') { res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end('{"ok":true}'); }
  if (req.method === 'GET' || req.method === 'HEAD') return serveStatic(req, res);
  res.writeHead(405); res.end();
}).listen(PORT, () => {
  console.log('\n  Satish Wood Works website is running');
  console.log('  Open  http://localhost:' + PORT);
  console.log('  Enquiries are saved to  ' + XLSX_FILE + '\n');
  if (!fs.existsSync(XLSX_FILE)) writeXlsx(load());
});
