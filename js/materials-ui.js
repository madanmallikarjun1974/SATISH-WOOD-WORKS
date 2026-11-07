/* Renders the "Our materials" section, the job guide, the comparison table and the FAQ from js/materials.js */
(function () {
  'use strict';
  var M = window.SWW_MATERIALS, CFG = window.SWW || {};
  if (!M) return;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var img = function (n) { return 'assets/mat/' + n + '.webp'; };
  function dots(v) { var h = ''; for (var i = 1; i <= 5; i++) h += '<i class="' + (i <= v ? 'on' : '') + '"></i>'; return '<span class="dots" role="img" aria-label="' + v + ' out of 5">' + h + '</span>'; }

  /* ---------- tabs + panel ---------- */
  var tabs = $('#mat-tabs'), panel = $('#mat-panel'), cur = 0;
  if (tabs && panel) {
    tabs.innerHTML = M.categories.map(function (c, i) {
      var th = c.cover ? '<img src="' + img(c.cover) + '" alt="" loading="lazy" width="56" height="56">' : '<span class="mat-chip-ico" aria-hidden="true">✦</span>';
      return '<button type="button" role="tab" id="mt-' + c.id + '" aria-controls="mat-panel" data-i="' + i + '" aria-selected="false">' + th + '<span><b>' + esc(c.name) + '</b><small>' + c.items.length + (c.items.length === 1 ? ' type' : ' types') + '</small></span></button>';
    }).join('');
    var cardHTML = function (c, it) {
      var visual = it.img ? '<img src="' + img(it.img) + '" alt="' + esc(it.name) + ' — texture sample" loading="lazy" width="560" height="360">' : '<span class="mat-chipbox" style="background:linear-gradient(135deg,' + it.chip[0] + ',' + it.chip[1] + ')"></span>';
      var meters = (it.meters || []).map(function (m) { return '<li><span>' + esc(m[0]) + '</span>' + dots(m[1]) + '</li>'; }).join('');
      return '<article class="mat-card">' +
        '<div class="mat-vis">' + visual + (it.look ? '<span class="mat-look">' + esc(it.look) + '</span>' : '') + '</div>' +
        '<div class="mat-body"><h4>' + esc(it.name) + '</h4><p class="mat-sub">' + esc(it.sub) + '</p><p class="mat-what">' + esc(it.what) + '</p>' +
        (meters ? '<ul class="mat-meters">' + meters + '</ul>' : '') +
        '<p class="mat-h">Best for</p><ul class="mat-best">' + it.best.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>' +
        '<p class="mat-note"><b>Good to know:</b> ' + esc(it.note) + '</p>' +
        '<button type="button" class="btn btn-ghost btn-sm mat-ask" data-title="' + esc(it.name) + '" data-interest="' + esc(c.interest) + '">Ask about ' + esc(it.name) + '</button></div></article>';
    };
    var show = function (i, focus) {
      cur = i; var c = M.categories[i];
      Array.prototype.forEach.call(tabs.children, function (b, k) { b.classList.toggle('on', k === i); b.setAttribute('aria-selected', k === i); b.tabIndex = k === i ? 0 : -1; });
      panel.setAttribute('aria-labelledby', 'mt-' + c.id);
      panel.innerHTML = '<div class="mat-intro"><p class="mat-kicker">' + esc(c.short) + '</p><h3>' + esc(c.name) + '</h3><p>' + esc(c.intro) + '</p>' +
        '<p class="mat-h">Typical uses</p><ul class="mat-uses">' + c.uses.map(function (u) { return '<li>' + esc(u) + '</li>'; }).join('') + '</ul>' +
        '<button type="button" class="btn btn-brass mat-ask" data-title="' + esc(c.name) + ' (general)" data-interest="' + esc(c.interest) + '">Get a quote for ' + esc(c.name) + '</button></div>' +
        '<div class="mat-grid n' + c.items.length + '">' + c.items.map(function (it) { return cardHTML(c, it); }).join('') + '</div>';
      panel.classList.remove('swap'); void panel.offsetWidth; panel.classList.add('swap');
      if (focus) tabs.children[i].focus();
    };
    tabs.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) show(+b.dataset.i); });
    tabs.addEventListener('keydown', function (e) {
      var n = M.categories.length, k = null;
      if (e.key === 'ArrowRight') k = (cur + 1) % n; else if (e.key === 'ArrowLeft') k = (cur + n - 1) % n; else if (e.key === 'Home') k = 0; else if (e.key === 'End') k = n - 1;
      if (k != null) { e.preventDefault(); show(k, true); }
    });
    panel.addEventListener('click', function (e) {
      var b = e.target.closest('.mat-ask'); if (!b) return;
      if (window.SWW_prefill) window.SWW_prefill('Material: ' + b.dataset.title, b.dataset.interest);
    });
    show(0);
  }

  /* ---------- job guide ---------- */
  var g = $('#mat-guide');
  if (g) {
    g.innerHTML = M.guide.map(function (r) {
      return '<div class="gd-row"><h4>' + esc(r.use) + '</h4><dl><div><dt>Body / structure</dt><dd>' + esc(r.body) + '</dd></div><div><dt>Surface</dt><dd>' + esc(r.face) + '</dd></div></dl>' +
        '<p class="gd-tip">' + esc(r.tip) + '</p><button type="button" class="gd-ask" data-title="' + esc(r.use) + '" data-interest="' + esc(r.interest) + '">Get a quote →</button></div>';
    }).join('');
    g.addEventListener('click', function (e) { var b = e.target.closest('.gd-ask'); if (b && window.SWW_prefill) window.SWW_prefill(b.dataset.title, b.dataset.interest); });
  }

  /* ---------- comparison table ---------- */
  var ct = $('#mat-compare');
  if (ct) {
    var C = M.compare;
    ct.innerHTML = '<table><caption class="sr">Boards compared at a glance (5 dots = highest)</caption><thead><tr><th scope="col">Material</th>' + C.cols.map(function (c) { return '<th scope="col">' + esc(c) + '</th>'; }).join('') + '<th scope="col">Typical use</th></tr></thead><tbody>' +
      C.rows.map(function (r) { return '<tr><th scope="row">' + esc(r.name) + '</th>' + r.v.map(function (v) { return '<td>' + dots(v) + '</td>'; }).join('') + '<td>' + esc(r.use) + '</td></tr>'; }).join('') + '</tbody></table>';
  }

  /* ---------- FAQ ---------- */
  var fq = $('#faq-list');
  if (fq) {
    var hours = (function () {
      var h = CFG.hours || {}, d, any = null; for (d = 1; d <= 6; d++) if (h[d]) { any = h[d]; break; }
      function t12(s) { var p = s.split(':'), hh = +p[0]; return (hh % 12 || 12) + ':' + p[1] + ' ' + (hh >= 12 ? 'PM' : 'AM'); }
      return any ? 'Monday to Saturday, ' + t12(any[0]) + ' to ' + t12(any[1]) : '';
    })();
    var addr = (CFG.address && CFG.address.full) || '';
    fq.innerHTML = M.faq.map(function (f, i) {
      var a = f.a.replace('{{ADDR}}', addr).replace('{{HOURS}}', hours);
      return '<details' + (i === 0 ? ' open' : '') + '><summary>' + esc(f.q) + '</summary><p>' + esc(a) + '</p></details>';
    }).join('');
  }
})();
