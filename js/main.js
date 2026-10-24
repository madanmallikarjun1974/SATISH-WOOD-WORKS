(function () {
  'use strict';
  var CFG = window.SWW, CAT = window.SWW_CATALOG || [];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var byId = {}; CAT.forEach(function (d) { byId[d.id] = d; });
  var CATS = [
    ['living', 'Living Rooms', 'Living room'], ['kitchen', 'Kitchens', 'Kitchen'], ['wardrobe', 'Wardrobes', 'Wardrobe'], ['bed', 'Beds', 'Bedroom'],
    ['ceiling', 'Ceilings', 'False ceiling'], ['sofa', 'Sofas', 'Sofa'], ['table', 'Tables', 'Tables'], ['showcase', 'Showcase Units', 'Showcase unit'],
    ['tv', 'TV Rooms', 'TV unit'], ['pooja', 'Pooja Mandirs', 'Pooja mandir'], ['door', 'Doors', 'Doors']
  ];
  var catInterest = {}; CATS.forEach(function (c) { catInterest[c[0]] = c[2]; });
  var thumb = function (id) { return 'assets/thumb/' + id + '.webp'; };
  var full = function (id, v) { return 'assets/full/' + id + '-' + (v || 'a') + '.webp'; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  $('#yr').textContent = new Date().getFullYear();

  /* ============ live open / closed ============ */
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  function t12(hhmm) { var p = hhmm.split(':'), h = +p[0], m = p[1]; return (h % 12 || 12) + ':' + m + ' ' + (h >= 12 ? 'PM' : 'AM'); }
  function mins(hhmm) { var p = hhmm.split(':'); return +p[0] * 60 + +p[1]; }
  function nowIST(d) {
    var parts = new Intl.DateTimeFormat('en-US', { timeZone: CFG.timezone, weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(d || new Date()), o = {};
    parts.forEach(function (p) { o[p.type] = p.value; });
    return { day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(o.weekday), min: (+o.hour % 24) * 60 + +o.minute };
  }
  function openStatus(d) {
    var n = nowIST(d), h = CFG.hours[n.day];
    if (h && n.min >= mins(h[0]) && n.min < mins(h[1])) {
      var left = mins(h[1]) - n.min;
      return left <= 60 ? { state: 'soon', label: 'Closing soon · closes ' + t12(h[1]) } : { state: 'open', label: 'Open now · closes ' + t12(h[1]) };
    }
    if (h && n.min < mins(h[0])) return { state: 'closed', label: 'Closed · opens today at ' + t12(h[0]) };
    for (var i = 1; i <= 7; i++) {
      var dd = (n.day + i) % 7, hh = CFG.hours[dd];
      if (hh) return { state: 'closed', label: 'Closed · opens ' + (i === 1 ? 'tomorrow' : DAYS[dd]) + ' at ' + t12(hh[0]) };
    }
    return { state: 'closed', label: 'Closed' };
  }
  function paintStatus() {
    var s = openStatus();
    $$('[data-status]').forEach(function (el) { el.setAttribute('data-state', s.state); $('.st-label', el).textContent = s.label; });
    var hl = $('[data-hours-line]'); if (hl) hl.textContent = 'Monday – Saturday: 9:00 AM – 7:30 PM · Sunday: Closed';
    var n = nowIST();
    $$('#hours-table tr').forEach(function (tr) { tr.classList.toggle('today', +tr.dataset.d === n.day); });
  }
  window.SWW_openStatus = openStatus;
  (function buildHours() {
    var tb = $('#hours-table tbody'), order = [1, 2, 3, 4, 5, 6, 0];
    tb.innerHTML = order.map(function (d) { var h = CFG.hours[d]; return '<tr data-d="' + d + '"' + (h ? '' : ' class="closed"') + '><td>' + DAYS[d] + '</td><td>' + (h ? t12(h[0]) + ' – ' + t12(h[1]) : 'Closed') + '</td></tr>'; }).join('');
    paintStatus(); setInterval(paintStatus, 20000);
  })();

  /* ============ contact bits ============ */
  var phone = String(CFG.phone || '').replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');
  if (phone.length === 10) {
    var pretty = '+91 ' + phone.slice(0, 5) + ' ' + phone.slice(5);
    $$('[data-phone-btn]').forEach(function (a) { a.href = 'tel:+91' + phone; a.hidden = false; });
    var li = $('[data-phone-li]'); if (li) { li.hidden = false; var l = $('[data-phone-link]'); l.href = 'tel:+91' + phone; l.textContent = pretty; }
    var wa = $('[data-wa]'); if (wa) { wa.href = 'https://wa.me/91' + phone + '?text=' + encodeURIComponent('Hello Satish Wood Works, I would like to enquire about interiors / furniture.'); wa.hidden = false; }
  }
  $('.map iframe').src = CFG.address.embed;
  $('#dir-btn').href = CFG.address.mapsLink;

  /* ============ header / menu / reveal ============ */
  var header = $('.site-header'), lastY = 0, menu = $('.mobile-menu'), mbtn = $('.menu-btn');
  window.addEventListener('scroll', function () {
    var y = window.scrollY, inHero = y < $('#hero').offsetHeight - innerHeight;
    header.classList.toggle('solid', y > 40);
    header.classList.toggle('hide', !inHero && y > lastY + 4 && y > 700 && menu.hidden);
    if (y < lastY - 4) header.classList.remove('hide');
    lastY = y;
  }, { passive: true });
  mbtn.addEventListener('click', function () { var o = menu.hidden; menu.hidden = !o; mbtn.setAttribute('aria-expanded', o); });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { menu.hidden = true; mbtn.setAttribute('aria-expanded', false); }); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    $$('.reveal').forEach(function (el) { io.observe(el); });
    var navA = $$('.nav a'), navIO = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) navA.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id); }); }); }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(function (sec) { navIO.observe(sec); });
  } else $$('.reveal').forEach(function (el) { el.classList.add('in'); });

  /* ============ Heritage vs Modern slider ============ */
  var PAIRS = [
    { tab: 'Living room', h: 'living-h1', m: 'living-m2', interest: 'Living room' },
    { tab: 'Kitchen', h: 'kitchen-h1', m: 'kitchen-m1', interest: 'Kitchen' },
    { tab: 'Wardrobe', h: 'wardrobe-h3', m: 'wardrobe-m2', interest: 'Wardrobe' },
    { tab: 'Pooja mandir', h: 'pooja-h2', m: 'pooja-m2', interest: 'Pooja mandir' }
  ];
  (function () {
    var cmp = $('#cmp'), imgNew = $('.cmp-new', cmp), imgOld = $('.cmp-old img', cmp), handle = $('.cmp-handle', cmp), tabs = $('#cmp-tabs'), meta = $('#cmp-meta'), cta = $('#cmp-cta'), cur = 0;
    tabs.innerHTML = PAIRS.map(function (p, i) { return '<button role="tab" type="button" data-i="' + i + '">' + p.tab + '</button>'; }).join('');
    function show(i) {
      cur = i; var p = PAIRS[i], h = byId[p.h], m = byId[p.m];
      imgOld.src = full(p.h); imgOld.alt = 'Heritage design: ' + h.title; imgNew.src = full(p.m); imgNew.alt = 'Modern design: ' + m.title;
      meta.innerHTML = '<div><small>Heritage</small>' + esc(h.title) + '</div><div><small>Modern</small>' + esc(m.title) + '</div>';
      $$('button', tabs).forEach(function (b, k) { b.classList.toggle('on', k === i); b.setAttribute('aria-selected', k === i); });
      cta.dataset.interest = p.interest; cta.textContent = 'Enquire about this ' + p.tab.toLowerCase();
      set(50);
    }
    function set(pct) { pct = Math.max(0, Math.min(100, pct)); cmp.style.setProperty('--pos', pct + '%'); handle.setAttribute('aria-valuenow', Math.round(pct)); cmp._pct = pct; }
    var drag = false;
    function move(e) { var r = cmp.getBoundingClientRect(); set(((e.clientX - r.left) / r.width) * 100); }
    cmp.addEventListener('pointerdown', function (e) { drag = true; cmp.setPointerCapture(e.pointerId); move(e); });
    cmp.addEventListener('pointermove', function (e) { if (drag) move(e); });
    cmp.addEventListener('pointerup', function () { drag = false; });
    cmp.addEventListener('pointercancel', function () { drag = false; });
    handle.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') { set(cmp._pct - 4); e.preventDefault(); } if (e.key === 'ArrowRight') { set(cmp._pct + 4); e.preventDefault(); } });
    tabs.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) show(+b.dataset.i); });
    // gentle intro sweep when scrolled into view
    var swept = false;
    new IntersectionObserver(function (es) {
      if (es[0].isIntersecting && !swept) { swept = true; var t0 = performance.now(); (function a(t) { var k = Math.min(1, (t - t0) / 1800); set(50 + Math.sin(k * Math.PI * 2) * 22 * (1 - k)); if (k < 1 && !drag) requestAnimationFrame(a); })(t0); }
    }, { threshold: .5 }).observe(cmp);
    show(0);
  })();

  /* ============ 3D ring ============ */
  (function () {
    var ids = ['living-m2', 'kitchen-m3', 'bed-m2', 'wardrobe-m2', 'sofa-m4', 'showcase-m3', 'tv-m3', 'ceiling-m2', 'pooja-m2', 'door-h2', 'pooja-h8'];
    var ring = $('#ring'), stage = $('#ring-stage'), n = ids.length, step = 360 / n, rot = 0, vel = 0, dragging = false, lastX = 0, moved = 0, vis = false, last = 0, baseScroll = window.scrollY;
    stage.innerHTML = ids.map(function (id, i) { var d = byId[id]; return '<div class="ring-item" data-id="' + id + '" style="--i:' + i + '"><img src="' + thumb(id) + '" alt="' + esc(d.title) + '" loading="lazy" decoding="async" draggable="false"><span>' + esc(d.title) + '</span></div>'; }).join('');
    var items = $$('.ring-item', stage), radius = 400;
    function layout() { var cw = items[0].offsetWidth || 220; radius = (cw / 2) / Math.tan(Math.PI / n) * 1.12 + 10; items.forEach(function (el, i) { el.style.transform = 'rotateY(' + (i * step) + 'deg) translateZ(' + radius + 'px)'; }); }
    function apply() { stage.style.transform = 'translateZ(' + (-radius) + 'px) rotateY(' + rot + 'deg)'; }
    layout(); apply(); window.addEventListener('resize', function () { layout(); apply(); });
    ring.addEventListener('pointerdown', function (e) { dragging = true; moved = 0; lastX = e.clientX; vel = 0; ring.setPointerCapture(e.pointerId); });
    ring.addEventListener('pointermove', function (e) { if (!dragging) return; var dx = e.clientX - lastX; lastX = e.clientX; moved += Math.abs(dx); rot += dx * .28; vel = dx * .28; apply(); });
    function up(e) {
      if (!dragging) return; dragging = false;
      if (moved < 6) { var el = document.elementFromPoint(e.clientX, e.clientY), it = el && el.closest && el.closest('.ring-item'); if (it) openLB(it.dataset.id, CAT); }
    }
    ring.addEventListener('pointerup', up); ring.addEventListener('pointercancel', function () { dragging = false; });
    new IntersectionObserver(function (es) { vis = es[0].isIntersecting; if (vis) { last = 0; requestAnimationFrame(tick); } }).observe(ring);
    var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    function tick(t) {
      if (!vis) return; var dt = last ? Math.min(.05, (t - last) / 1000) : .016; last = t;
      if (!dragging) { rot += vel; vel *= .94; if (!reduced) rot += 5 * dt; if (Math.abs(vel) < .01) vel = 0; }
      apply(); requestAnimationFrame(tick);
    }
  })();

  /* ============ collections + filters + lightbox ============ */
  var grid = $('#grid'), filters = $('#filters'), curFilter = 'all', curList = CAT;
  (function buildFilters() {
    var counts = { all: CAT.length }; CAT.forEach(function (d) { counts[d.cat] = (counts[d.cat] || 0) + 1; });
    var h = '<button type="button" data-f="all" class="on">All<small>' + counts.all + '</small></button>';
    CATS.forEach(function (c) { h += '<button type="button" data-f="' + c[0] + '">' + c[1] + '<small>' + (counts[c[0]] || 0) + '</small></button>'; });
    h += '<button type="button" data-f="heritage">Heritage</button><button type="button" data-f="modern">Modern</button>';
    filters.innerHTML = h;
  })();
  var gridCols = 0;
  function cardHTML(d, i) {
    return '<div class="card" style="animation-delay:' + Math.min(i, 14) * 45 + 'ms"><button class="card-in" type="button" data-id="' + d.id + '" style="aspect-ratio:' + d.ar + '" aria-label="View ' + esc(d.title) + '">' +
      '<img src="' + thumb(d.id) + '" alt="' + esc(d.title) + '" loading="lazy" decoding="async" width="' + Math.round(640 * d.ar) + '" height="640">' +
      '<span class="badge ' + d.style + '">' + d.style + '</span><span class="card-more">+</span>' +
      '<span class="card-ov"><h3>' + esc(d.title) + '</h3><p>' + esc(d.desc) + '</p></span></button></div>';
  }
  function renderGrid() {
    var w = grid.clientWidth || window.innerWidth, n = Math.max(2, Math.min(5, Math.floor(w / (w < 600 ? 160 : 260)))); gridCols = n;
    var cols = [], hts = []; for (var c = 0; c < n; c++) { cols.push([]); hts.push(0); }
    curList.forEach(function (d, i) { var k = hts.indexOf(Math.min.apply(null, hts)); cols[k].push(cardHTML(d, i)); hts[k] += 1 / d.ar + .12; });
    grid.innerHTML = cols.map(function (c) { return '<div class="mcol">' + c.join('') + '</div>'; }).join('');
  }
  var rzT; window.addEventListener('resize', function () { clearTimeout(rzT); rzT = setTimeout(function () { var w = grid.clientWidth, n = Math.max(2, Math.min(5, Math.floor(w / (w < 600 ? 160 : 260)))); if (n !== gridCols) renderGrid(); }, 150); });
  function setFilter(f, scroll) {
    curFilter = f; $$('button', filters).forEach(function (b) { b.classList.toggle('on', b.dataset.f === f); });
    curList = CAT.filter(function (d) { return f === 'all' || d.cat === f || d.style === f; });
    $('#count').textContent = curList.length;
    renderGrid();
    if (scroll) $('#collections').scrollIntoView({ behavior: 'smooth' });
  }
  filters.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) setFilter(b.dataset.f); });
  grid.addEventListener('click', function (e) { var c = e.target.closest('.card-in'); if (c) openLB(c.dataset.id, curList); });
  grid.addEventListener('pointermove', function (e) {
    var c = e.target.closest && e.target.closest('.card-in'); if (!c || e.pointerType === 'touch') return;
    var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    c.style.setProperty('--ry', (x * 8).toFixed(2) + 'deg'); c.style.setProperty('--rx', (-y * 8).toFixed(2) + 'deg');
  });
  grid.addEventListener('pointerout', function (e) { var c = e.target.closest && e.target.closest('.card-in'); if (c) { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); } });
  setFilter('all');
  $$('[data-filter-link]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); setFilter(a.dataset.filterLink, true); }); });

  /* lightbox */
  var lb = $('#lightbox'), lbImg = $('#lb-img'), lbWrap = $('.lb-img', lb), lbList = CAT, lbIdx = 0, lbView = 'a', lbPrevFocus = null;
  function paintLB() {
    var d = lbList[lbIdx]; lbWrap.classList.remove('zoom');
    lbImg.style.opacity = 0; var im = new Image(); im.onload = function () { lbImg.src = im.src; lbImg.style.opacity = 1; }; im.src = full(d.id, lbView);
    lbImg.alt = d.title + ' — ' + ({ a: 'wide view', b: 'angle view', c: 'detail' })[lbView];
    $('#lb-badge').className = 'badge ' + d.style; $('#lb-badge').textContent = d.style;
    $('#lb-title').textContent = d.title; $('#lb-desc').textContent = d.desc;
    $('#lb-views').innerHTML = ['a', 'b', 'c'].map(function (v) { return '<button type="button" data-v="' + v + '" class="' + (v === lbView ? 'on' : '') + '" aria-label="' + ({ a: 'Wide view', b: 'Angle view', c: 'Detail view' })[v] + '"><img src="' + full(d.id, v) + '" alt="" loading="lazy"></button>'; }).join('');
    $('#lb-count').textContent = (lbIdx + 1) + ' / ' + lbList.length;
    $('#lb-cta').dataset.design = d.title; $('#lb-cta').dataset.cat = d.cat;
    // preload neighbours
    [lbIdx + 1, lbIdx - 1].forEach(function (k) { var n = lbList[(k + lbList.length) % lbList.length]; (new Image()).src = full(n.id, 'a'); });
  }
  function openLB(id, list) {
    lbList = list || CAT; lbIdx = Math.max(0, lbList.findIndex(function (d) { return d.id === id; })); lbView = 'a'; lbPrevFocus = document.activeElement;
    lb.hidden = false; document.body.classList.add('lb-open'); paintLB(); $('.lb-x', lb).focus();
  }
  function closeLB() { lb.hidden = true; document.body.classList.remove('lb-open'); if (lbPrevFocus && lbPrevFocus.focus) lbPrevFocus.focus(); }
  function stepLB(k) { lbIdx = (lbIdx + k + lbList.length) % lbList.length; lbView = 'a'; paintLB(); }
  $('.lb-x', lb).addEventListener('click', closeLB);
  $('.lb-prev', lb).addEventListener('click', function () { stepLB(-1); });
  $('.lb-next', lb).addEventListener('click', function () { stepLB(1); });
  $('#lb-views').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) { lbView = b.dataset.v; paintLB(); } });
  lbWrap.addEventListener('click', function (e) { var r = lbImg.getBoundingClientRect(); lbImg.style.setProperty('--ox', ((e.clientX - r.left) / r.width * 100) + '%'); lbImg.style.setProperty('--oy', ((e.clientY - r.top) / r.height * 100) + '%'); lbWrap.classList.toggle('zoom'); });
  lbWrap.addEventListener('pointermove', function (e) { if (!lbWrap.classList.contains('zoom')) return; var r = lbWrap.getBoundingClientRect(); lbImg.style.setProperty('--ox', ((e.clientX - r.left) / r.width * 100) + '%'); lbImg.style.setProperty('--oy', ((e.clientY - r.top) / r.height * 100) + '%'); });
  document.addEventListener('keydown', function (e) { if (lb.hidden) return; if (e.key === 'Escape') closeLB(); if (e.key === 'ArrowRight') stepLB(1); if (e.key === 'ArrowLeft') stepLB(-1); });
  var tx = null; lb.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) { if (tx == null || lbWrap.classList.contains('zoom')) return; var dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 60) stepLB(dx < 0 ? 1 : -1); tx = null; });
  $('#lb-cta').addEventListener('click', function (e) { var b = e.currentTarget; closeLB(); prefill(b.dataset.design, catInterest[b.dataset.cat]); });

  /* ============ reviews ============ */
  (function () {
    var T = CFG.testimonials || [], rows = $('#rv-rows'); if (!T.length) { $('#reviews').hidden = true; return; }
    function card(t) { return '<article class="rv">' + (t.sample && CFG.showSampleBadge ? '<span class="smp">Sample</span>' : '') + '<div class="stars" aria-label="' + t.stars + ' out of 5 stars">' + '★'.repeat(t.stars || 5) + '</div><p>“' + esc(t.text) + '”</p><footer><b>' + esc(t.name) + '</b><span>' + esc(t.place || '') + '</span></footer></article>'; }
    var half = Math.ceil(T.length / 2), a = T.slice(0, half), b = T.slice(half).length ? T.slice(half) : T;
    function row(list, cls) { var h = list.map(card).join(''); return '<div class="rv-row ' + cls + '">' + h + h + '</div>'; }
    rows.innerHTML = row(a, '') + row(b, 'rev');
  })();

  /* ============ enquiry form ============ */
  var form = $('#enq-form'), err = $('#form-err'), grp = $('.enquire-grid'), thanks = $('#thanks'), design = $('#f-design'), liked = $('#liked');
  function prefill(title, interest) {
    if (title) { design.value = title; $('#liked-name').textContent = title; liked.hidden = false; }
    if (interest) { var cb = $$('input[name=interests]', form).filter(function (c) { return c.value === interest; })[0]; if (cb) cb.checked = true; }
    resetSent(); $('#enquire').scrollIntoView({ behavior: 'smooth' });
    setTimeout(function () { var n = $('input[name=name]', form); if (n && !n.value) n.focus({ preventScroll: true }); }, 700);
  }
  $('#liked-x').addEventListener('click', function () { design.value = ''; liked.hidden = true; });
  $$('[data-enquire]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); prefill(null, a.dataset.interest || null); if (menu) menu.hidden = true; }); });

  function cleanPhone(v) { var d = String(v).replace(/[^\d]/g, '').replace(/^(91|0)(?=\d{10}$)/, ''); return d; }
  function collect() {
    var fd = new FormData(form), o = {};
    ['name', 'phone', 'email', 'area', 'propertyType', 'style', 'timeline', 'callTime', 'details', 'design', 'website'].forEach(function (k) { o[k] = (fd.get(k) || '').toString().trim(); });
    o.interests = fd.getAll('interests'); return o;
  }
  function mark(el, bad) { el.classList.toggle('bad', !!bad); }
  function validate(o) {
    var msgs = [];
    var nameEl = $('input[name=name]', form), phEl = $('input[name=phone]', form);
    var okName = o.name.length >= 2, okPh = /^[6-9]\d{9}$/.test(cleanPhone(o.phone)), okInt = o.interests.length > 0, okC = $('input[name=consent]', form).checked;
    mark(nameEl, !okName); mark(phEl, !okPh); $('#interests').closest('.grp').classList.toggle('bad', !okInt);
    if (!okName) msgs.push('your name'); if (!okPh) msgs.push('a valid 10-digit mobile number'); if (!okInt) msgs.push('what you would like to build'); if (!okC) msgs.push('your consent to be contacted');
    return msgs;
  }
  $$('input', form).forEach(function (i) { i.addEventListener('input', function () { i.classList.remove('bad'); err.hidden = true; }); });
  $('#interests').addEventListener('change', function () { $('#interests').closest('.grp').classList.remove('bad'); });

  var QKEY = 'sww_queue_v1';
  function queue(get, set) { try { if (set) localStorage.setItem(QKEY, JSON.stringify(set)); else return JSON.parse(localStorage.getItem(QKEY) || '[]'); } catch (e) { return []; } }
  function post(p) {
    return fetch('/api/enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) { return { status: r.status, body: j }; });
    });
  }
  function sendEmail(p) {
    var to = String(CFG.email || '').trim(); if (!to) return Promise.resolve(false);
    var b = { _subject: 'New enquiry - ' + p.name + (p.interests && p.interests.length ? ' (' + p.interests.join(', ') + ')' : ''), _template: 'table', _captcha: 'false', _honey: '' };
    function add(k, v) { if (v) b[k] = v; }
    add('Reference', p.clientRef); add('Name', p.name); add('Mobile', '+91 ' + p.phone); add('Area / location', p.area); add('Property', p.propertyType);
    add('Looking for', (p.interests || []).join(', ')); add('Style', p.style); add('Timeline', p.timeline); add('Best time to call', p.callTime);
    add('Design liked', p.design); add('Details', p.details); add('Received', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST');
    if (p.email) b.email = p.email;
    return fetch('https://formsubmit.co/ajax/' + encodeURIComponent(to), { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(b) })
      .then(function (r) { return r.json(); }).then(function (j) { return !!j && (j.success === true || j.success === 'true'); }).catch(function () { return false; });
  }
  /* deliver = e-mail to the shop + (when running start-server.bat) the Excel file. Success if either worked. */
  function deliver(p) {
    var srv = location.protocol === 'file:' ? Promise.resolve({ ok: false }) : post(p).then(function (r) {
      return { ok: !!(r.body && r.body.ok), ref: r.body && r.body.ref, invalid: r.status === 422 || r.status === 429, error: r.body && r.body.error };
    }).catch(function () { return { ok: false }; });
    return Promise.all([srv, sendEmail(p)]).then(function (a) {
      if (a[0].invalid && !a[1]) return { invalid: true, error: a[0].error };
      return { ok: a[0].ok || a[1], ref: a[0].ref || p.clientRef };
    });
  }
  function flush() {
    var q = queue(); if (!q.length) return;
    var left = []; var chain = Promise.resolve();
    q.forEach(function (p) { chain = chain.then(function () { return deliver(p).then(function (r) { if (!r.ok && !r.invalid) left.push(p); }); }).catch(function () { left.push(p); }); });
    chain.then(function () { queue(null, left); });
  }
  window.addEventListener('online', flush); flush();

  function downloadXlsx(rec) {
    var bytes = XlsxLite.build([SWW_SCHEMA.sheet([rec])]);
    var blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'Satish-Wood-Works-enquiry.xlsx'; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  var lastRec = null;
  var ownerPhone = String(CFG.phone || '').replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');
  var WA_MODE = ownerPhone.length === 10;
  function waText(o) {
    var L = ['*New enquiry - Satish Wood Works website*', ''];
    function add(k, v) { if (v) L.push('*' + k + ':* ' + v); }
    add('Name', o.name); add('Mobile', '+91 ' + cleanPhone(o.phone)); add('Email', o.email); add('Area / location', o.area);
    add('Property', o.propertyType); add('Looking for', o.interests.join(', ')); add('Style', o.style); add('Timeline', o.timeline);
    add('Best time to call', o.callTime); add('Design liked', o.design);
    if (o.details) { L.push(''); L.push('*Details:*'); L.push(o.details); }
    return L.join('\n');
  }
  function waUrl(o) { return 'https://wa.me/91' + ownerPhone + '?text=' + encodeURIComponent(waText(o)); }
  form.addEventListener('submit', function (e) {
    e.preventDefault(); err.hidden = true;
    var o = collect(), bad = validate(o);
    if (bad.length) { err.textContent = 'Please check ' + bad.join(', ') + '.'; err.hidden = false; var f = $('.bad', form); if (f) f.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
    var btn = $('#f-submit'); btn.disabled = true; $('span', btn).textContent = 'Sending…';
    var digits = cleanPhone(o.phone), payload = Object.assign({}, o, { phone: digits });
    var waLink = WA_MODE ? waUrl(o) : '';
    var done = function (ref, offline) {
      lastRec = { ref: ref, receivedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST', name: o.name, phone: '+91 ' + digits.slice(0, 5) + ' ' + digits.slice(5), email: o.email, area: o.area, propertyType: o.propertyType, interests: o.interests.join(', '), style: o.style, timeline: o.timeline, callTime: o.callTime, details: o.details, design: o.design, status: 'New' };
      $('#thanks-name').textContent = o.name ? ', ' + o.name.split(' ')[0] : '';
      $('#thanks-ref').textContent = ref; $('#thanks-phone').textContent = lastRec.phone;
      $('#thanks-note').textContent = offline ? 'We couldn’t send it just now. Your enquiry is saved on this device and will be sent automatically as soon as you are back online.' : (openStatus().state === 'closed' ? 'The showroom is closed right now — we’ll get back to you when we open.' : 'Our team will call you shortly.');
      var waBtn = $('#thanks-wa');
      if (WA_MODE && !offline) { waBtn.href = waLink; waBtn.hidden = false; } else { waBtn.hidden = true; }
      $('#thanks-xlsx').hidden = !offline;
      grp.classList.add('sent'); thanks.hidden = false; thanks.scrollIntoView({ block: 'center', behavior: 'smooth' });
      form.reset(); design.value = ''; liked.hidden = true; btn.disabled = false; $('span', btn).textContent = 'Send Enquiry';
    };
    payload.clientRef = 'SWW-' + Date.now().toString(36).toUpperCase().slice(-6);
    if (o.website) return done(payload.clientRef, false); /* honeypot: bots get a fake success */
    deliver(payload).then(function (r) {
      if (r.ok) return done(r.ref, false);
      if (r.invalid) { err.textContent = r.error || 'Please check the form and try again.'; err.hidden = false; btn.disabled = false; $('span', btn).textContent = 'Send Enquiry'; return; }
      var q = queue(); q.push(payload); queue(null, q); done('PENDING', true);
    }).catch(function () { var q = queue(); q.push(payload); queue(null, q); done('PENDING', true); });
  });
  $('#thanks-xlsx').addEventListener('click', function () { if (lastRec) downloadXlsx(lastRec); });
  function resetSent() { grp.classList.remove('sent'); thanks.hidden = true; }
  $('#thanks-again').addEventListener('click', function () { resetSent(); form.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
})();
