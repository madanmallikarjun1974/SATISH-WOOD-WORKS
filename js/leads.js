/* ============================================================
   Leads — the one place every visitor / enquiry / quotation goes through.
   type 'registration' = entry form   'enquiry' = detailed enquiry form   'quotation' = price estimator
   Each event is delivered to: (1) the shop's e-mail  (2) the Google Sheet behind owner.html (if sheetUrl set)
   (3) the local server (only when start-server.bat is running).  Anything that fails is queued and retried.
   ============================================================ */
(function () {
  'use strict';
  var CFG = window.SWW || {};
  var VK = 'sww_visitor_v1', QK = 'sww_leadq_v2', LK = 'sww_leads_local_v1';
  function jget(k, d) { try { var v = JSON.parse(localStorage.getItem(k) || 'null'); return v == null ? d : v; } catch (e) { return d; } }
  function jset(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  function digits(v) { return String(v == null ? '' : v).replace(/[^\d]/g, '').replace(/^(91|0)(?=\d{10}$)/, ''); }
  function rid(n) { var s = ''; while (s.length < n) s += Math.random().toString(36).slice(2).toUpperCase().replace(/[^A-Z0-9]/g, ''); return s.slice(0, n); }
  function ist(d) { return new Date(d).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST'; }
  function inr(n) { return '₹' + Math.round(Number(n) || 0).toLocaleString('en-IN'); }

  /* ---------- the visitor who filled the entry form ---------- */
  function profile() { var p = jget(VK, null); return p && p.vid && p.name && /^[6-9]\d{9}$/.test(String(p.phone || '')) ? p : null; }
  function setProfile(p) { p = p || {}; p.vid = p.vid || ('V' + rid(7)); p.ts = p.ts || new Date().toISOString(); jset(VK, p); return p; }
  function clearProfile() { try { localStorage.removeItem(VK); } catch (e) {} }

  /* ---------- build one event record ---------- */
  var PREFIX = { registration: 'R', enquiry: 'E', quotation: 'Q', review: 'W' };
  function build(type, data) {
    var p = profile() || {}, rec = {}, k;
    for (k in data) if (Object.prototype.hasOwnProperty.call(data, k)) rec[k] = data[k];
    rec.type = type;
    rec.id = rec.id || (PREFIX[type] || 'X') + '-' + rid(6);
    rec.ts = new Date().toISOString(); rec.time = ist(rec.ts);
    rec.vid = rec.vid || p.vid || '';
    rec.name = String(rec.name || p.name || '').trim();
    rec.phone = digits(rec.phone || p.phone || '');
    if (!rec.email && p.email) rec.email = p.email;
    return rec;
  }
  function pretty(ph) { ph = digits(ph); return ph.length === 10 ? '+91 ' + ph.slice(0, 5) + ' ' + ph.slice(5) : ph; }

  /* ---------- a copy kept in this browser (powers the preview dashboard + never loses a lead) ---------- */
  function storeLocal(rec) { var a = jget(LK, []); a.push(rec); if (a.length > 300) a = a.slice(-300); jset(LK, a); }

  /* ---------- channel 1: e-mail (FormSubmit) ---------- */
  var SUBJ = { registration: 'NEW VISITOR', enquiry: 'DETAILED ENQUIRY', quotation: 'QUOTATION', review: 'NEW REVIEW' };
  function emailBody(r) {
    var b = { _subject: '[' + SUBJ[r.type] + '] ' + r.name + (r.type === 'review' ? ' — ' + r.stars + ' stars' : ' — +91 ' + r.phone), _template: 'table', _captcha: 'false', _honey: '' };
    function add(k, v) { if (v != null && v !== '' && !(Array.isArray(v) && !v.length)) b[k] = Array.isArray(v) ? v.join(', ') : String(v); }
    add('Lead type', r.type === 'registration' ? 'Website visitor (entry form)' : r.type === 'enquiry' ? 'Detailed enquiry form' : r.type === 'review' ? 'Customer review' : 'Price estimator / quotation');
    add('Lead ID', r.id); add('Name', r.name); add('Mobile', '+91 ' + r.phone); add('Area / location', r.area);
    if (r.type === 'registration') { add('Looking for', r.interest); add('Language', r.lang === 'kn' ? 'Kannada' : 'English'); }
    if (r.type === 'enquiry') {
      add('Property', r.propertyType); add('Looking for', r.interests); add('Style', r.style); add('Timeline', r.timeline); add('Best time to call', r.callTime);
      add('Design / material of interest', r.design); add('Details', r.details);
    }
    if (r.type === 'review') {
      add('Rating', '★'.repeat(r.stars || 0) + ' (' + r.stars + '/5)'); add('Work done', r.place); add('Review', r.text);
      add('Status', 'WAITING FOR YOUR APPROVAL - open the owner dashboard > Customer reviews > Approve to show it on the website');
    }
    if (r.type === 'quotation') {
      add('Quote no.', r.quoteNo); add('Sent via', r.channel); add('Items', r.items); add('Subtotal', r.subtotal != null ? inr(r.subtotal) : '');
      add('GST', r.gst); add('Approx. total', r.total != null ? inr(r.total) : ''); add('Range', r.lo != null ? inr(r.lo) + ' - ' + inr(r.hi) : '');
      add('Customer language', r.lang === 'kn' ? 'Kannada' : 'English'); if (r.sample) add('Note', 'SAMPLE RATES were active');
    }
    add('Received', r.time); if (r.email) b.email = r.email;
    return b;
  }
  function viaEmail(r) {
    var to = String(CFG.email || '').trim(); if (!to) return Promise.resolve(null);
    return fetch('https://formsubmit.co/ajax/' + encodeURIComponent(to), { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(emailBody(r)), keepalive: true })
      .then(function (x) { return x.json(); }).then(function (j) { return { ok: !!j && (j.success === true || j.success === 'true') }; }).catch(function () { return { ok: false }; });
  }

  /* ---------- channel 2: Google Sheet (Apps Script web app) ---------- */
  function viaSheet(r) {
    var u = String(CFG.sheetUrl || '').trim(); if (!u) return Promise.resolve(null);
    return fetch(u, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(r), keepalive: true })
      .then(function () { return { ok: true }; }).catch(function () { return { ok: false }; });
  }

  /* ---------- channel 3: local server (start-server.bat) ---------- */
  var srvP = null;
  function serverUp() {
    if (srvP) return srvP;
    srvP = (location.protocol === 'file:') ? Promise.resolve(false) : fetch('/api/health', { cache: 'no-store' }).then(function (x) { return x.ok && x.headers.get('content-type') && x.headers.get('content-type').indexOf('json') > -1; }).catch(function () { return false; });
    return srvP;
  }
  function viaServer(r) {
    return serverUp().then(function (up) {
      if (!up) return null;
      return fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(r) }).then(function (x) {
        return x.json().catch(function () { return {}; }).then(function (j) { return { ok: !!j.ok, ref: j.ref, invalid: x.status === 422 || x.status === 429, error: j.error }; });
      }).catch(function () { return { ok: false }; });
    });
  }

  function deliver(r) {
    return Promise.all([viaEmail(r), viaSheet(r), viaServer(r)]).then(function (a) {
      var used = a.filter(Boolean), ok = used.some(function (x) { return x.ok; });
      var bad = used.filter(function (x) { return x.invalid; })[0];
      var ref = (a[2] && a[2].ref) || r.id;
      if (!ok && bad) return { ok: false, invalid: true, error: bad.error, ref: ref };
      return { ok: ok, ref: ref };
    });
  }

  /* ---------- retry queue ---------- */
  function queue() { return jget(QK, []); }
  function enqueue(r) { var q = queue(); if (!q.some(function (x) { return x.id === r.id; })) { q.push(r); jset(QK, q.slice(-100)); } }
  var flushing = false;
  function flush() {
    if (flushing || CFG.previewMode) return; var q = queue(); if (!q.length) return; flushing = true;
    var left = [], chain = Promise.resolve();
    q.forEach(function (r) { chain = chain.then(function () { return deliver(r).then(function (x) { if (!x.ok && !x.invalid) left.push(r); }); }).catch(function () { left.push(r); }); });
    chain.then(function () { jset(QK, left); flushing = false; });
  }

  /* ---------- public: send an event ---------- */
  function send(type, data) {
    var rec = build(type, data || {}); storeLocal(rec);
    if (CFG.previewMode) return Promise.resolve({ ok: true, preview: true, id: rec.id, ref: rec.id, rec: rec });
    return deliver(rec).then(function (x) { if (!x.ok && !x.invalid) enqueue(rec); x.id = rec.id; x.rec = rec; return x; })
      .catch(function () { enqueue(rec); return { ok: false, queued: true, id: rec.id, ref: rec.id, rec: rec }; });
  }

  window.addEventListener('online', flush);
  setTimeout(flush, 2500);

  /* review approval status kept on this device (preview / no-Google-Sheet mode only) */
  var RK = 'sww_review_status_v1';
  function reviewStatus() { return jget(RK, {}); }
  function setReviewStatus(id, st) { var m = reviewStatus(); m[id] = st; jset(RK, m); }

  window.SWW_LEADS = { reviewStatus: reviewStatus, setReviewStatus: setReviewStatus, send: send, profile: profile, setProfile: setProfile, clearProfile: clearProfile, digits: digits, pretty: pretty, inr: inr, ist: ist, local: function () { return jget(LK, []); }, pending: function () { return queue().length; } };
})();
