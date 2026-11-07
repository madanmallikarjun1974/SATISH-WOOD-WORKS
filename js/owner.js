/* Owner dashboard — password protected view of every visitor, enquiry and quotation. */
(function () {
  'use strict';
  var CFG = window.SWW || {}, L = window.SWW_LEADS, SC = window.SWW_SCHEMA;
  /* The real owner password is NEVER stored in the website files — Google checks it (see OWNER-SETUP.txt).
     Until the Google Sheet is connected there is nothing private to protect (only sample data / this device's own forms),
     so this demo mode accepts any non-empty password. */
  var DEMO_PW = '__demo__';
  var SK = 'sww_owner_key_v1';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var st = { mode: 'local', key: '', recs: [], sample: false, range: '30', view: 'cust', seg: 'all', q: '', timer: null, rvSeg: 'pending', sampleStatus: {} };

  /* ---------- where is the data? ---------- */
  function detect() {
    if (String(CFG.sheetUrl || '').trim()) { st.mode = 'sheet'; return Promise.resolve(); }
    if (location.protocol === 'file:') { st.mode = 'local'; return Promise.resolve(); }
    return fetch('/api/health', { cache: 'no-store' }).then(function (r) { return r.ok && /json/.test(r.headers.get('content-type') || ''); }).then(function (ok) { st.mode = ok ? 'server' : 'local'; }).catch(function () { st.mode = 'local'; });
  }
  function jsonp(url, params) {
    return new Promise(function (res, rej) {
      var cb = 'sww_cb_' + Math.random().toString(36).slice(2), s = document.createElement('script'), done = false;
      var q = Object.keys(params).map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]); }).join('&');
      var t = setTimeout(function () { if (!done) { done = true; cleanup(); rej(new Error('timeout')); } }, 20000);
      function cleanup() { clearTimeout(t); delete window[cb]; s.remove(); }
      window[cb] = function (d) { if (!done) { done = true; cleanup(); res(d); } };
      s.onerror = function () { if (!done) { done = true; cleanup(); rej(new Error('network')); } };
      s.src = url + (url.indexOf('?') > -1 ? '&' : '?') + q + '&callback=' + cb; document.head.appendChild(s);
    });
  }
  function fetchAll(key) {
    if (st.mode === 'sheet') return jsonp(CFG.sheetUrl, { action: 'list', key: key }).then(function (d) { if (!d || !d.ok) throw new Error((d && d.error) || 'Wrong password'); return d.rows || []; });
    if (st.mode === 'server') return fetch('/api/owner/leads?key=' + encodeURIComponent(key), { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (d) { if (!d.ok) throw new Error(d.error || 'Wrong password'); return d.rows || []; });
    return new Promise(function (res, rej) { if (!key || (CFG.previewPassword && key !== CFG.previewPassword)) rej(new Error('Wrong password')); else res(st.sample ? sampleData() : L.local()); });
  }

  /* ---------- sample data (clearly labelled) ---------- */
  function sampleData() {
    var names = ['Ravi Kumar', 'Anitha S', 'Mohammed Irfan', 'Lakshmi Devi', 'Suresh Gowda', 'Priya Nair', 'Manjunath R', 'Kavitha M', 'Arun Prakash', 'Divya Shetty', 'Naveen B', 'Shobha K', 'Rakesh Jain', 'Meena Iyer', 'Harish Reddy', 'Pooja Patil', 'Vinay Hegde', 'Sunitha G', 'Ganesh Rao', 'Farah Khan'];
    var areas = ['Ganigarahalli', 'Yeshwanthpur', 'Peenya', 'Jalahalli', 'Rajajinagar', 'Nagasandra', 'Abbigere', 'Dasarahalli', 'T. Dasarahalli', 'Hesaraghatta Rd'];
    var interests = ['Modular kitchen', 'Wardrobes', 'Doors & windows', 'Furniture', 'Full home interiors', 'Plywood / wood / boards', 'Just browsing'];
    var cats = ['Modular Kitchen — Laminate on BWP plywood', 'Wardrobe — Laminate on BWR plywood', 'False Ceiling — Gypsum board', 'Doors — Teak panel door', 'TV Unit — Veneer finish', 'Pooja Unit — Carved MDF'];
    var seed = 7; function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    var out = [], now = Date.now();
    names.forEach(function (n, i) {
      var vid = 'DEMO' + i, ph = '98' + String(40000000 + i * 91731).slice(0, 8), t0 = now - Math.floor(rnd() * 20 * 86400000) - Math.floor(rnd() * 8) * 3600000;
      var base = { vid: vid, name: n, phone: ph, demo: true };
      out.push(Object.assign({}, base, { type: 'registration', id: 'R-D' + i, ts: new Date(t0).toISOString(), time: L.ist(t0), email: i % 3 ? '' : n.split(' ')[0].toLowerCase() + '@example.com', area: areas[i % areas.length], interest: interests[Math.floor(rnd() * interests.length)], lang: i % 4 === 0 ? 'kn' : 'en' }));
      if (rnd() < .62) {
        var tq = t0 + 600000 + Math.floor(rnd() * 3600000), tot = Math.round((20000 + rnd() * 240000) / 100) * 100;
        out.push(Object.assign({}, base, { type: 'quotation', id: 'Q-D' + i, ts: new Date(tq).toISOString(), time: L.ist(tq), quoteNo: 'Q-' + (1000 + i), channel: ['PDF download', 'WhatsApp', 'PDF share'][i % 3], items: '1. ' + cats[i % cats.length] + ' | 10 × 7 ft | 70 sq ft | ' + L.inr(tot), subtotal: tot, gst: 'not included', total: tot, lo: Math.round(tot * .9), hi: Math.round(tot * 1.1), cats: [cats[i % cats.length]], lang: 'en', sample: true }));
        if (rnd() < .4) {
          var te = tq + 900000 + Math.floor(rnd() * 7200000);
          out.push(Object.assign({}, base, { type: 'enquiry', id: 'SIW-D' + i, clientRef: 'SIW-D' + i, ts: new Date(te).toISOString(), time: L.ist(te), area: areas[i % areas.length], propertyType: ['Apartment', 'Independent house', 'Villa'][i % 3], interests: [interests[i % 5]], style: ['Modern', 'Heritage', 'Fusion'][i % 3], timeline: ['Within a month', '1–3 months', '3–6 months'][i % 3], callTime: ['Morning', 'Evening', 'Anytime'][i % 3], details: 'Need design + site visit. 3BHK, want laminate/veneer mix. Please call after 6 PM.' }));
        }
      } else if (rnd() < .3) {
        var te2 = t0 + 3600000 * (1 + Math.floor(rnd() * 20));
        out.push(Object.assign({}, base, { type: 'enquiry', id: 'SIW-E' + i, clientRef: 'SIW-E' + i, ts: new Date(te2).toISOString(), time: L.ist(te2), area: areas[i % areas.length], propertyType: 'Apartment', interests: ['Wardrobe', 'Kitchen'], style: 'Modern', timeline: '1–3 months', callTime: 'Evening', details: 'Looking for wardrobe and kitchen for new flat.' }));
      }
    });
    var rv = [
      ['Ravi Kumar', 'Modular kitchen', 5, 'Sample review text: neat finish and delivered on the promised day.', 'approved', 3],
      ['Anitha S', 'Wardrobes', 4, 'Sample review text: sliding wardrobe works smoothly. Would like a faster follow-up call.', 'approved', 6],
      ['Suresh Gowda', 'Plywood / wood / boards (materials)', 5, 'Sample review text: good quality BWP plywood and fair dealing for our bulk order.', 'pending', 0],
      ['Farah Khan', 'Furniture', 5, 'Sample review text: solid wood dining table made exactly to our size.', 'pending', 1]
    ];
    rv.forEach(function (x, i) { var t = now - (x[5] * 86400000 + 3600000 * (i + 1)); out.push({ type: 'review', id: 'W-D' + i, vid: 'DEMO' + i, name: x[0], phone: '98' + String(40000000 + i * 91731).slice(0, 8), place: x[1], stars: x[2], text: x[3], status: x[4], ts: new Date(t).toISOString(), time: L.ist(t), demo: true }); });
    return out;
  }

  /* ---------- analysis ---------- */
  var istDay = function (ts) { return new Date(ts).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }); };
  function inRange(r) {
    if (st.range === 'all') return true;
    var days = +st.range, today = istDay(Date.now()), from = istDay(Date.now() - (days - 1) * 86400000);
    var d = istDay(r.ts); return d >= from && d <= today;
  }
  function group(recs) {
    var by = {}, order = [];
    recs.slice().sort(function (a, b) { return a.ts < b.ts ? -1 : 1; }).forEach(function (r) {
      var k = r.vid || ('P' + r.phone); var v = by[k];
      if (!v) { v = by[k] = { key: k, name: '', phone: '', email: '', area: '', interest: '', first: r.ts, last: r.ts, events: [], reg: null, enq: [], quo: [], lang: '' }; order.push(v); }
      v.events.push(r); v.last = r.ts;
      if (r.name) v.name = r.name; if (r.phone) v.phone = r.phone; if (r.email) v.email = r.email; if (r.area) v.area = r.area; if (r.lang) v.lang = r.lang;
      if (r.type === 'registration') { v.reg = r; if (r.interest) v.interest = r.interest; } else if (r.type === 'enquiry') v.enq.push(r); else if (r.type === 'quotation') v.quo.push(r);
    });
    order.forEach(function (v) { v.status = v.enq.length ? 'enq' : v.quo.length ? 'quo' : 'reg'; });
    return order.sort(function (a, b) { return a.last < b.last ? 1 : -1; });
  }
  function counts(recs, vis) {
    return {
      visitors: vis.length, enquiries: recs.filter(function (r) { return r.type === 'enquiry'; }).length, quotes: recs.filter(function (r) { return r.type === 'quotation'; }).length,
      enqPeople: vis.filter(function (v) { return v.enq.length; }).length, quoPeople: vis.filter(function (v) { return v.quo.length; }).length,
      quoteOnly: vis.filter(function (v) { return v.quo.length && !v.enq.length; }).length, regOnly: vis.filter(function (v) { return !v.quo.length && !v.enq.length; }).length
    };
  }

  /* ---------- render ---------- */
  var SEG_CUST = [['all', 'All customers'], ['enq', 'Detailed enquiry'], ['quo', 'Quotation only'], ['reg', 'Visited only']];
  var SEG_ACT = [['all', 'All activity'], ['registration', 'Visitors'], ['quotation', 'Quotations'], ['enquiry', 'Detailed enquiries']];
  var TL = SC.TYPE_LABEL;
  function wa(ph) { return 'https://wa.me/91' + ph; }
  function ago(ts) { var m = Math.round((Date.now() - new Date(ts)) / 60000); if (m < 1) return 'just now'; if (m < 60) return m + ' min ago'; if (m < 1440) return Math.round(m / 60) + ' h ago'; return new Date(ts).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short' }); }
  function badge(t) { return '<span class="bdg b-' + t + '">' + esc(({ registration: 'Visitor', enquiry: 'Detailed enquiry', quotation: 'Quotation', reg: 'Visited only', enq: 'Detailed enquiry', quo: 'Quotation only' })[t] || t) + '</span>'; }

  function revStatus(r) { return st.mode === 'local' ? ((st.sample ? st.sampleStatus[r.id] : L.reviewStatus()[r.id]) || (st.sample ? r.status : '') || 'pending') : (r.status || 'pending'); }
  function render() {
    var recs = st.recs.filter(function (r) { return r.type !== 'review' && inRange(r); }), vis = group(recs), c = counts(recs, vis);
    var revs = st.recs.filter(function (r) { return r.type === 'review'; }); revs.forEach(function (r) { r.status = revStatus(r); });
    c.rvPending = revs.filter(function (r) { return r.status === 'pending'; }).length;
    $('#kpis').innerHTML = [
      ['reg', 'Visitors registered', c.visitors, 'Filled the entry form', 'all'],
      ['enq', 'Detailed enquiries', c.enquiries, c.enqPeople + (c.enqPeople === 1 ? ' customer' : ' customers') + ' sent the full form', 'enq'],
      ['quo', 'Quotations generated', c.quotes, c.quoPeople + (c.quoPeople === 1 ? ' customer' : ' customers') + ' used the estimator', 'qall'],
      ['qo', 'Quotation only', c.quoteOnly, 'Took a quote, no detailed enquiry yet', 'quo'],
      ['ro', 'Visited only', c.regOnly, 'Registered, no quote or enquiry', 'reg'],
      ['rev', 'Customer reviews', revs.length, c.rvPending ? c.rvPending + ' waiting for your approval' : 'Nothing waiting for approval', 'rv']
    ].map(function (k) { return '<button type="button" class="kpi k-' + k[0] + '" data-seg="' + k[4] + '"><span>' + k[1] + '</span><b>' + k[2] + '</b><small>' + k[3] + '</small></button>'; }).join('');
    chart(); reviewsView(revs); saveInfo();
    var segs = st.view === 'cust' ? SEG_CUST : SEG_ACT; if (!segs.some(function (s) { return s[0] === st.seg; })) st.seg = 'all';
    $('#chips').innerHTML = segs.map(function (s) { return '<button type="button" data-s="' + s[0] + '" class="' + (st.seg === s[0] ? 'on' : '') + '">' + s[1] + '</button>'; }).join('');
    $$('.oview button').forEach(function (b) { b.classList.toggle('on', b.dataset.v === st.view); });
    $$('.orange button').forEach(function (b) { b.classList.toggle('on', b.dataset.r === st.range); });
    var q = st.q.trim().toLowerCase();
    var hit = function (o) { return !q || [o.name, o.phone, o.area, o.email, o.interest, SC.summary(o)].join(' ').toLowerCase().indexOf(q) > -1; };
    var h;
    if (st.view === 'cust') {
      var rows = vis.filter(function (v) { return (st.seg === 'all' || v.status === st.seg) && hit(v); });
      h = rows.length ? '<table><thead><tr><th>Last activity</th><th>Name</th><th>Phone</th><th>Area</th><th>Interested in</th><th>Activity</th></tr></thead><tbody>' + rows.map(function (v) {
        var lastQ = v.quo[v.quo.length - 1], want = v.enq.length ? [].concat(v.enq[v.enq.length - 1].interests || []).join(', ') : v.interest;
        return '<tr tabindex="0" data-k="' + esc(v.key) + '"><td data-l="Last activity"><b>' + esc(ago(v.last)) + '</b><small>' + esc(L.ist(v.last).replace(' IST', '')) + '</small></td><td data-l="Name"><b>' + esc(v.name || '—') + '</b></td>' +
          '<td data-l="Phone"><a href="tel:+91' + esc(v.phone) + '" class="ph">' + esc(SC.ph(v.phone)) + '</a></td><td data-l="Area">' + esc(v.area || '—') + '</td><td data-l="Interested in">' + esc(want || '—') + '</td>' +
          '<td data-l="Activity">' + (v.enq.length ? badge('enq') : v.quo.length ? badge('quo') : badge('reg')) + (v.quo.length ? '<small class="tot">' + v.quo.length + ' quote' + (v.quo.length > 1 ? 's' : '') + ' · ' + esc(L.inr(lastQ.total)) + '</small>' : '') + '</td></tr>';
      }).join('') + '</tbody></table>' : empty();
    } else {
      var ev = recs.filter(function (r) { return (st.seg === 'all' || r.type === st.seg) && hit(r); }).sort(function (a, b) { return a.ts < b.ts ? 1 : -1; });
      h = ev.length ? '<table><thead><tr><th>Time (IST)</th><th>Type</th><th>Name</th><th>Phone</th><th>Details</th></tr></thead><tbody>' + ev.map(function (r) {
        var vk = r.vid || ('P' + r.phone);
        return '<tr tabindex="0" data-k="' + esc(vk) + '"><td data-l="Time"><b>' + esc(r.time || '') + '</b></td><td data-l="Type">' + badge(r.type) + '</td><td data-l="Name"><b>' + esc(r.name || '—') + '</b></td><td data-l="Phone"><a href="tel:+91' + esc(r.phone) + '" class="ph">' + esc(SC.ph(r.phone)) + '</a></td><td data-l="Details" class="sum">' + esc(SC.summary(r)) + '</td></tr>';
      }).join('') + '</tbody></table>' : empty();
    }
    $('#table').innerHTML = h;
  }
  function empty() {
    var msg = st.recs.length ? 'Nothing matches this filter.' : (st.mode === 'local' ? 'No leads have been captured on this device yet.' : 'No leads yet — they will appear here as customers fill the forms.');
    var extra = st.mode === 'local' && !st.sample && !st.recs.length ? '<button type="button" class="btn btn-brass btn-sm" id="b-sample">Show sample data</button>' : '';
    return '<div class="oempty"><p>' + msg + '</p>' + extra + '</div>';
  }
  function chart() {
    var days = [], i; for (i = 13; i >= 0; i--) days.push(istDay(Date.now() - i * 86400000));
    var m = {}; days.forEach(function (d) { m[d] = { registration: 0, quotation: 0, enquiry: 0 }; });
    st.recs.forEach(function (r) { var d = istDay(r.ts); if (m[d] && m[d][r.type] != null) m[d][r.type]++; });
    var max = Math.max(4, Math.max.apply(null, days.map(function (d) { return m[d].registration + m[d].quotation + m[d].enquiry; })));
    var W = 700, H = 180, pad = 26, bw = (W - pad * 2) / days.length, g = '';
    days.forEach(function (d, k) {
      var x = pad + k * bw + bw * .18, w = bw * .64, y = H - 24, parts = [['registration', 'c-reg'], ['quotation', 'c-quo'], ['enquiry', 'c-enq']];
      parts.forEach(function (p) { var v = m[d][p[0]]; if (!v) return; var hh = v / max * (H - 50); y -= hh; g += '<rect class="' + p[1] + '" x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + hh.toFixed(1) + '" rx="3"><title>' + d + ': ' + v + ' ' + p[0] + '</title></rect>'; });
      g += '<text x="' + (x + w / 2).toFixed(1) + '" y="' + (H - 6) + '" text-anchor="middle">' + d.slice(8) + '</text>';
    });
    $('#chart').innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Visitors, quotations and enquiries for the last 14 days">' + g + '</svg>';
  }

  /* ---------- customer reviews (approve / hide) ---------- */
  var RV_SEG = [['pending', 'Waiting for approval'], ['approved', 'Approved (shown on website)'], ['hidden', 'Hidden'], ['all', 'All']];
  function reviewsView(revs) {
    var n = function (k) { return revs.filter(function (r) { return k === 'all' || r.status === k; }).length; };
    $('#rv-chips').innerHTML = RV_SEG.map(function (x) { return '<button type="button" data-s="' + x[0] + '" class="' + (st.rvSeg === x[0] ? 'on' : '') + '">' + x[1] + ' (' + n(x[0]) + ')</button>'; }).join('');
    var list = revs.filter(function (r) { return st.rvSeg === 'all' || r.status === st.rvSeg; }).sort(function (a, b) { return a.ts < b.ts ? 1 : -1; });
    if (!list.length) { $('#rv-list').innerHTML = '<div class="oempty"><p>' + (revs.length ? 'No reviews in this list.' : 'No reviews yet. Customers can write one from the “Customer voices” section of the website.') + '</p></div>'; return; }
    $('#rv-list').innerHTML = '<div class="rvl">' + list.map(function (r) {
      var sN = Math.max(1, Math.min(5, +r.stars || 5)), a = '';
      if (r.status !== 'approved') a += '<button type="button" class="btn btn-brass btn-sm" data-act="approved" data-id="' + esc(r.id) + '">✓ Approve</button>';
      if (r.status !== 'hidden') a += '<button type="button" class="btn btn-ghost btn-sm" data-act="hidden" data-id="' + esc(r.id) + '">' + (r.status === 'approved' ? 'Remove from website' : 'Hide') + '</button>';
      if (r.status === 'hidden') a += '<button type="button" class="btn btn-ghost btn-sm" data-act="pending" data-id="' + esc(r.id) + '">Undo</button>';
      return '<article class="rvi is-' + r.status + '"><div><div class="rvi-st" aria-label="' + sN + ' of 5 stars">' + '★'.repeat(sN) + '<i>' + '★'.repeat(5 - sN) + '</i></div><p>“' + esc(r.text) + '”</p>' +
        '<small><b>' + esc(r.name) + '</b>' + (r.place ? ' · ' + esc(r.place) : '') + ' · ' + esc(r.time || '') + '</small><small>Phone (private, never shown): <a href="tel:+91' + esc(r.phone) + '">' + esc(SC.ph(r.phone)) + '</a></small></div>' +
        '<div class="rvi-act"><span class="bdg b-rv-' + r.status + ' rvi-badge">' + ({ pending: 'Waiting for approval', approved: 'Shown on website', hidden: 'Hidden' })[r.status] + '</span>' + a + '</div></article>';
    }).join('') + '</div>';
  }
  function setReview(id, status) {
    var done;
    if (st.mode === 'sheet') done = jsonp(CFG.sheetUrl, { action: 'review_set', key: st.key, id: id, status: status }).then(function (d) { if (!d || !d.ok) throw new Error((d && d.error) || 'failed'); });
    else if (st.mode === 'server') done = fetch('/api/owner/review?key=' + encodeURIComponent(st.key) + '&id=' + encodeURIComponent(id) + '&status=' + status, { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (d) { if (!d.ok) throw new Error(d.error || 'failed'); });
    else { if (st.sample) st.sampleStatus[id] = status; else L.setReviewStatus(id, status); done = Promise.resolve(); }
    return done.then(function () { st.recs.forEach(function (r) { if (r.id === id) r.status = status; }); if (st.mode !== 'local') st.recs.forEach(function (r) { if (r.id === id) r.status = status; }); render(); }).catch(function (e) { alert('Could not update the review: ' + e.message); });
  }
  $('#rv-chips').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) { st.rvSeg = b.dataset.s; render(); } });
  $('#rv-list').addEventListener('click', function (e) { var b = e.target.closest('button[data-act]'); if (b) { b.disabled = true; setReview(b.dataset.id, b.dataset.act); } });

  function saveInfo() {
    var em = $('#osave-state'), note = $('#osave-note');
    if (st.mode === 'sheet') { em.textContent = 'Connected to your Google Sheet'; em.className = 'ok'; note.innerHTML = 'Every form is also in your Google Sheet (tabs <code>Leads</code> and <code>Reviews</code>) — open it in Google Sheets any time. This page auto-refreshes every minute.'; }
    else if (st.mode === 'server') { em.textContent = 'Connected to the local server'; em.className = 'ok'; note.innerHTML = 'Saved in <code>data/leads.xlsx</code> next to the website files.'; }
    else { em.textContent = st.sample ? 'Showing sample data' : 'Preview · not connected to Google yet'; em.className = '';
      note.innerHTML = st.sample ? 'These are made-up customers, only to show how the dashboard looks. Nothing here is real.' : 'Right now (preview) forms are only kept in <u>this browser</u>, so you can test the whole flow: fill the website forms, then open this page. On the live site, after the one-time Google Sheet setup (<code>OWNER-SETUP.txt</code>), every form from every customer lands here and in your Google Sheet.'; }
  }

  /* ---------- drawer ---------- */
  function openDrawer(key) {
    var v = group(st.recs.filter(function (r) { return r.type !== 'review'; })).filter(function (x) { return x.key === key; })[0]; if (!v) return;
    var ev = v.events.slice().reverse().map(function (r) {
      var rows = [];
      function add(k, val) { if (val != null && val !== '' && !(Array.isArray(val) && !val.length)) rows.push('<div><dt>' + esc(k) + '</dt><dd>' + esc(Array.isArray(val) ? val.join(', ') : val).replace(/\n/g, '<br>') + '</dd></div>'); }
      if (r.type === 'registration') { add('Looking for', r.interest); add('Email', r.email); add('Area', r.area); add('Language', r.lang === 'kn' ? 'Kannada' : 'English'); }
      if (r.type === 'enquiry') { add('Property', r.propertyType); add('Wants to build', r.interests); add('Style', r.style); add('When needed', r.timeline); add('Best time to call', r.callTime); add('Design / material', r.design); add('Details', r.details); add('Email', r.email); add('Area', r.area); }
      if (r.type === 'quotation') { add('Quote no.', r.quoteNo); add('Sent via', r.channel); add('Items', r.items); add('Approx. total', L.inr(r.total) + (r.gst && r.gst !== 'not included' ? ' (GST ' + r.gst + ')' : '')); add('Range', L.inr(r.lo) + ' – ' + L.inr(r.hi)); if (r.sample) add('Note', 'Sample rates were active'); }
      return '<li><div class="ev-h">' + badge(r.type) + '<span>' + esc(r.time || '') + '</span></div><dl>' + rows.join('') + '</dl></li>';
    }).join('');
    $('#drawer-in').innerHTML = '<button class="od-x" id="od-x" aria-label="Close">×</button><p class="eyebrow">Customer</p><h3>' + esc(v.name || '—') + '</h3><p class="od-ph"><a href="tel:+91' + esc(v.phone) + '">' + esc(SC.ph(v.phone)) + '</a></p>' +
      '<div class="od-act"><a class="btn btn-brass btn-sm" href="tel:+91' + esc(v.phone) + '">Call</a><a class="btn btn-ghost btn-sm" target="_blank" rel="noopener" href="' + wa(esc(v.phone)) + '">WhatsApp</a>' + (v.email ? '<a class="btn btn-ghost btn-sm" href="mailto:' + esc(v.email) + '">Email</a>' : '') + '</div>' +
      '<p class="mat-h">Activity (newest first)</p><ol class="evs">' + ev + '</ol>';
    $('#drawer').hidden = false; $('#scrim').hidden = false; $('#od-x').focus();
  }
  function closeDrawer() { $('#drawer').hidden = true; $('#scrim').hidden = true; }

  /* ---------- load + login ---------- */
  function banner() {
    var b = $('#banner'), m = '';
    if (st.mode === 'local') m = (st.sample ? '<b>SAMPLE DATA</b> — made-up customers, only to show how the dashboard looks. <button type="button" id="b-sample2" class="lnk">Show my real data</button><br>Connect the Google Sheet (see OWNER-SETUP.txt) to see your real leads from every phone.' : '<b>Not connected yet</b> — showing only forms filled on <u>this device</u>. Connect the Google Sheet (see OWNER-SETUP.txt) to see every customer from every phone. <button type="button" id="b-sample2" class="lnk">Show sample data</button>');
    else if (st.mode === 'server') m = '<b>Connected</b> — local server. Leads are also saved in <code>data/leads.xlsx</code>.';
    b.innerHTML = m; b.className = 'obanner ' + (st.mode === 'local' ? 'warn' : 'ok'); b.hidden = !m;
  }
  function load(key, quiet) {
    return fetchAll(key).then(function (rows) {
      st.recs = rows.filter(function (r) { return r && r.type && r.ts; }); st.key = key;
      try { sessionStorage.setItem(SK, key); } catch (e) {}
      $('#login').hidden = true; $('#dash').hidden = false; $('#stamp').textContent = 'Updated ' + new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
      banner(); render();
      clearInterval(st.timer); if (st.mode !== 'local') st.timer = setInterval(function () { load(st.key, true).catch(function () {}); }, 60000);
    });
  }
  function logout() { try { sessionStorage.removeItem(SK); } catch (e) {} clearInterval(st.timer); st.key = ''; st.recs = []; st.sample = false; closeDrawer(); $('#dash').hidden = true; $('#login').hidden = false; $('#pw').value = ''; $('#pw').focus(); }

  $('#login-form').addEventListener('submit', function (e) {
    e.preventDefault(); var pw = $('#pw').value, err = $('#login-err'), btn = $('#login-go'); err.hidden = true; btn.disabled = true; $('span', btn).textContent = 'Checking…';
    load(pw).catch(function (ex) { err.textContent = /Wrong|password/i.test(ex.message) ? 'That password is not correct.' : 'Could not reach the lead store (' + ex.message + '). Check your internet and the Google Sheet link, then try again.'; err.hidden = false; }).then(function () { btn.disabled = false; $('span', btn).textContent = 'Open dashboard'; });
  });
  $('#b-out').addEventListener('click', logout);
  $('#b-refresh').addEventListener('click', function () { var b = this; b.disabled = true; load(st.key).catch(function (e) { alert('Could not refresh: ' + e.message); }).then(function () { b.disabled = false; }); });
  $('#b-xlsx').addEventListener('click', function () {
    var bytes = XlsxLite.build(SC.sheets(st.recs)), blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'Satish-Interior-World-leads-' + istDay(Date.now()) + (st.sample ? '-SAMPLE' : '') + '.xlsx'; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 600);
  });
  $('#range').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) { st.range = b.dataset.r; render(); } });
  $('.oview').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) { st.view = b.dataset.v; st.seg = 'all'; render(); } });
  $('#chips').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) { st.seg = b.dataset.s; render(); } });
  $('#kpis').addEventListener('click', function (e) {
    var b = e.target.closest('.kpi'); if (!b) return; var s = b.dataset.seg;
    if (s === 'rv') { st.rvSeg = 'pending'; render(); $('#rvcard').scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    if (s === 'qall') { st.view = 'act'; st.seg = 'quotation'; } else { st.view = 'cust'; st.seg = s; }
    render(); $('#custcard').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  $('#q').addEventListener('input', function () { st.q = this.value; render(); });
  $('#table').addEventListener('click', function (e) { if (e.target.closest('a')) return; var tr = e.target.closest('tr[data-k]'); if (tr) openDrawer(tr.dataset.k); var s = e.target.closest('#b-sample'); if (s) { st.sample = true; load(st.key || DEMO_PW); } });
  $('#table').addEventListener('keydown', function (e) { if (e.key === 'Enter') { var tr = e.target.closest('tr[data-k]'); if (tr) openDrawer(tr.dataset.k); } });
  $('#banner').addEventListener('click', function (e) { if (e.target.id === 'b-sample2') { st.sample = !st.sample; load(st.key || DEMO_PW); } });
  $('#scrim').addEventListener('click', closeDrawer);
  $('#drawer').addEventListener('click', function (e) { if (e.target.closest('#od-x')) closeDrawer(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !$('#drawer').hidden) closeDrawer(); });

  detect().then(function () {
    $('#login-mode').textContent = st.mode === 'sheet' ? 'Connected to your Google Sheet.' : st.mode === 'server' ? 'Connected to the local server.' : 'Demo mode: the Google Sheet is not connected yet, so any password opens sample / this-device data only (see OWNER-SETUP.txt).';
    var saved = ''; try { saved = sessionStorage.getItem(SK) || ''; } catch (e) {}
    if (saved) load(saved).catch(function () { try { sessionStorage.removeItem(SK); } catch (e) {} });
  });
})();
