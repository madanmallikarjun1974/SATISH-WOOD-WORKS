/* ============================================================
   Customer reviews — real reviews only.
   Customers write a review (name, stars, comment) -> it is sent to the owner (e-mail + Google Sheet)
   -> the owner presses "Approve" in the owner dashboard -> it appears here with the customer's name.
   ============================================================ */
(function () {
  'use strict';
  var CFG = window.SWW || {}, L = window.SWW_LEADS, sec = document.getElementById('reviews'); if (!sec || !L) return;
  var $ = function (s, r) { return (r || sec).querySelector(s); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var rows = $('#rv-rows'), empty = $('#rv-empty'), wrap = $('#rv-form-wrap'), form = $('#rv-form'), openBtn = $('#rv-open');
  var pub = [], mine = [];

  /* ---------- where the approved reviews come from ---------- */
  function jsonp(url, params) {
    return new Promise(function (res, rej) {
      var cb = 'sww_rv_' + Math.random().toString(36).slice(2), s = document.createElement('script'), done = false;
      var q = Object.keys(params).map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]); }).join('&');
      var t = setTimeout(function () { if (!done) { done = true; clean(); rej(new Error('timeout')); } }, 15000);
      function clean() { clearTimeout(t); delete window[cb]; s.remove(); }
      window[cb] = function (d) { if (!done) { done = true; clean(); res(d); } };
      s.onerror = function () { if (!done) { done = true; clean(); rej(new Error('network')); } };
      s.src = url + (url.indexOf('?') > -1 ? '&' : '?') + q + '&callback=' + cb; document.head.appendChild(s);
    });
  }
  function localReviews() { return L.local().filter(function (r) { return r.type === 'review'; }); }
  function fromLocal() {
    var st = L.reviewStatus();
    return localReviews().filter(function (r) { return st[r.id] === 'approved'; });
  }
  function loadPublic() {
    var manual = (CFG.reviews || []).map(function (r) { return { id: 'M' + r.name, name: r.name, place: r.place, stars: r.stars || 5, text: r.text, ts: r.ts || '' }; });
    var u = String(CFG.sheetUrl || '').trim(), p;
    if (u && !CFG.previewMode) p = jsonp(u, { action: 'reviews' }).then(function (d) { return d && d.ok ? d.rows || [] : []; }).catch(function () { return []; });
    else if (location.protocol !== 'file:' && !CFG.previewMode) p = fetch('/api/reviews', { cache: 'no-store' }).then(function (r) { return r.ok && /json/.test(r.headers.get('content-type') || '') ? r.json() : { rows: [] }; }).then(function (d) { return d.rows || []; }).catch(function () { return []; });
    else p = Promise.resolve([]);
    return p.then(function (list) { return manual.concat(list, fromLocal()); });
  }

  /* ---------- drawing ---------- */
  function card(t, own) {
    var n = Math.max(1, Math.min(5, +t.stars || 5));
    return '<article class="rv' + (own ? ' rv-own' : '') + '">' + (own ? '<span class="smp">Waiting for approval · only you can see this</span>' : '') +
      '<div class="stars" role="img" aria-label="' + n + ' out of 5 stars">' + '★'.repeat(n) + '<i>' + '★'.repeat(5 - n) + '</i></div><p>“' + esc(t.text) + '”</p>' +
      '<footer><b>' + esc(t.name) + '</b><span>' + esc(t.place || '') + '</span></footer></article>';
  }
  function draw() {
    var ids = {}; pub.forEach(function (r) { ids[r.id] = 1; });
    var st = L.reviewStatus();
    var pend = mine.filter(function (r) { return !ids[r.id] && st[r.id] !== 'hidden' && st[r.id] !== 'approved'; });
    var all = pub.slice().sort(function (a, b) { return (a.ts || '') < (b.ts || '') ? 1 : -1; });
    var cards = pend.map(function (r) { return card(r, true); }).concat(all.map(function (r) { return card(r, false); }));
    var sum = $('#rv-sum');
    if (all.length) {
      var avg = all.reduce(function (a, r) { return a + (+r.stars || 5); }, 0) / all.length;
      $('#rv-avg').textContent = avg.toFixed(1); $('#rv-count').textContent = 'from ' + all.length + (all.length === 1 ? ' review' : ' reviews'); sum.hidden = false;
    } else sum.hidden = true;
    empty.hidden = cards.length > 0;
    if (!cards.length) { rows.innerHTML = ''; return; }
    if (cards.length < 4) { rows.className = 'rv-rows rv-static'; rows.innerHTML = cards.join(''); return; }
    rows.className = 'rv-rows';
    var half = Math.ceil(cards.length / 2), a = cards.slice(0, half), b = cards.slice(half);
    function row(list, cls) { var h = list.join(''); return '<div class="rv-row ' + cls + '">' + h + h + '</div>'; }
    rows.innerHTML = row(a, '') + (b.length ? row(b, 'rev') : '');
  }
  function refresh() { mine = localReviews(); return loadPublic().then(function (l) { pub = l; draw(); }); }

  /* ---------- the form ---------- */
  var stars = 0, starBtns = [].slice.call(sec.querySelectorAll('#rv-stars button'));
  function paintStars(n) { starBtns.forEach(function (b, i) { b.classList.toggle('on', i < n); b.setAttribute('aria-checked', String(i === n - 1)); }); }
  starBtns.forEach(function (b, i) {
    b.addEventListener('click', function () { stars = i + 1; paintStars(stars); $('#rv-stars').classList.remove('bad'); err.hidden = true; });
    b.addEventListener('mouseenter', function () { paintStars(i + 1); });
  });
  $('#rv-stars').addEventListener('mouseleave', function () { paintStars(stars); });
  var err = $('#rv-err');
  function fillName() { var p = L.profile(), n = form.elements.rname; if (p && p.name && n && !n.value) n.value = p.name; }
  openBtn.addEventListener('click', function () { wrap.hidden = !wrap.hidden; if (!wrap.hidden) { $('#rv-thanks').hidden = true; form.hidden = false; fillName(); wrap.scrollIntoView({ behavior: 'smooth', block: 'center' }); setTimeout(function () { var t = form.elements.rtext; if (t) t.focus({ preventScroll: true }); }, 500); } });
  $('#rv-cancel').addEventListener('click', function () { wrap.hidden = true; });
  window.addEventListener('sww:registered', fillName);
  var tx = form.elements.rtext, cnt = $('#rv-cnt');
  tx.addEventListener('input', function () { cnt.textContent = tx.value.length + ' / 500'; tx.classList.remove('bad'); err.hidden = true; });
  form.elements.rname.addEventListener('input', function () { this.classList.remove('bad'); err.hidden = true; });

  form.addEventListener('submit', function (e) {
    e.preventDefault(); err.hidden = true;
    var name = form.elements.rname.value.trim(), text = tx.value.trim(), place = form.elements.rplace.value, ok = form.elements.rconsent.checked, miss = [];
    if (name.length < 2) { miss.push('your name'); form.elements.rname.classList.add('bad'); }
    if (!stars) { miss.push('a star rating'); $('#rv-stars').classList.add('bad'); }
    if (text.length < 10) { miss.push('your review (at least 10 characters)'); tx.classList.add('bad'); }
    if (!ok) miss.push('your OK to show your name');
    if (miss.length) { err.textContent = 'Please add ' + miss.join(', ') + '.'; err.hidden = false; return; }
    if (form.elements.rwebsite.value) { form.hidden = true; $('#rv-thanks').hidden = false; return; }   /* honeypot */
    var p = L.profile() || {}, btn = $('button[type=submit]', form); btn.disabled = true;
    L.send('review', { name: name, place: place, stars: stars, text: text, vid: p.vid, phone: p.phone }).then(function (r) {
      btn.disabled = false;
      if (r && r.invalid) { err.textContent = r.error || 'Could not send your review. Please check your details.'; err.hidden = false; return; }
      form.hidden = true; form.reset(); stars = 0; paintStars(0); cnt.textContent = '0 / 500';
      $('#rv-thanks-name').textContent = name.split(' ')[0];
      $('#rv-thanks').hidden = false; refresh();
    });
  });

  refresh();
  setInterval(function () { if (!document.hidden && !CFG.previewMode) refresh(); }, 120000);
  window.addEventListener('storage', refresh);
  window.addEventListener('focus', refresh);
})();
