/* Instant Quote Estimator — bilingual (English / Kannada), multi-item quote, PDF, WhatsApp, lead e-mail.
   Prices live in js/rates.js. Shop phone / e-mail live in js/config.js. */
(function () {
  'use strict';
  var R = window.SWW_RATES, CFG = window.SWW || {};
  var root = document.getElementById('est-root');
  if (!R || !root) return;

  /* ---------------- text (English / Kannada) ---------------- */
  var T = {
    en: {
      eyebrow: 'Instant price estimator', h2a: 'Get your quote', h2b: 'in 30 seconds.', sub: 'Pick what you need, enter the size and material — your approximate quote appears instantly. Download it as a PDF or send it to us on WhatsApp.',
      sample: 'Sample rates — the shop sets its own final rates', s1: 'What do you need?', s2: 'Size', s3: 'Material / finish', s4: 'Extras (optional)',
      unit: 'Unit', ft: 'Feet', m: 'Metres', qty: 'Quantity', thisItem: 'This item', area: 'Area', sqft: 'sq ft', approx: 'Approx.',
      enterSize: 'Enter the size to see the price', add: 'Add to my quote', myQuote: 'My quote', clear: 'Clear all',
      empty: 'Nothing added yet. Choose an item on the left and press “Add to my quote”.', remove: 'Remove',
      gstTick: 'Include GST', subtotal: 'Subtotal', gst: 'GST', total: 'Approximate total', range: 'Estimated range',
      name: 'Your name', phone: 'Mobile number', pdf: 'Download PDF quote', wa: 'Send quote on WhatsApp', share: 'Share PDF', visit: 'Book a free site visit',
      disc: 'This is an approximate estimate based on standard rates. The final price is confirmed after a site visit and exact measurements. Valid for 7 days.',
      errCust: 'Please enter your name and a valid 10-digit mobile number.', errItems: 'Add at least one item to your quote first.', errDims: 'Enter a size between 0.5 and 200.',
      okPdf: 'Your PDF is ready ✓ — our team will also call you.', okWa: 'WhatsApp is opening — press Send to deliver the quote to us.', okVisit: 'Done — your details are filled in the enquiry form below.',
      each: 'each', perSqft: '/sq ft', flat: 'flat', ext: 'Extras',
      q_title: 'QUOTATION', q_no: 'Quote no.', q_date: 'Date', q_valid: 'Valid till', q_for: 'Prepared for', q_item: 'Item', q_size: 'Size', q_area: 'Area (sq ft)', q_rate: 'Rate/sq ft', q_amt: 'Amount',
      q_sub: 'Subtotal', q_gst: 'GST', q_total: 'Approximate total', q_range: 'Estimated range', q_terms: 'Terms', q_page: 'Page',
      q_t: ['1. Approximate estimate based on standard rates and the sizes entered.', '2. Final price is confirmed after a site visit and exact measurements.', '3. Price may vary with design, hardware brand and site conditions.', '4. This quote is valid for 7 days from the date above.'],
      q_sampleNote: 'SAMPLE RATES — for demonstration only', wa_intro: 'New quote request from the website estimator', wa_hi: 'Hello Satish Wood Works, I would like to proceed with this estimate:'
    },
    kn: {
      eyebrow: 'ತ್ವರಿತ ಬೆಲೆ ಅಂದಾಜು', h2a: 'ನಿಮ್ಮ ಅಂದಾಜು ಪಟ್ಟಿ', h2b: '30 ಸೆಕೆಂಡ್‌ಗಳಲ್ಲಿ.', sub: 'ಬೇಕಾದ ಕೆಲಸ ಆರಿಸಿ, ಗಾತ್ರ ಮತ್ತು ವಸ್ತು ಆಯ್ಕೆ ಮಾಡಿ — ಅಂದಾಜು ಬೆಲೆ ತಕ್ಷಣ ಕಾಣುತ್ತದೆ. PDF ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ ಅಥವಾ ವಾಟ್ಸ್‌ಆ್ಯಪ್‌ನಲ್ಲಿ ನಮಗೆ ಕಳುಹಿಸಿ.',
      sample: 'ಮಾದರಿ ದರಗಳು — ಅಂಗಡಿ ತನ್ನ ಅಂತಿಮ ದರ ನಿಗದಿಪಡಿಸುತ್ತದೆ', s1: 'ನಿಮಗೆ ಏನು ಬೇಕು?', s2: 'ಗಾತ್ರ', s3: 'ವಸ್ತು / ಫಿನಿಶ್', s4: 'ಹೆಚ್ಚುವರಿ (ಬೇಕಿದ್ದರೆ)',
      unit: 'ಅಳತೆ', ft: 'ಅಡಿ', m: 'ಮೀಟರ್', qty: 'ಸಂಖ್ಯೆ', thisItem: 'ಈ ಐಟಂ', area: 'ವಿಸ್ತೀರ್ಣ', sqft: 'ಚ.ಅ.', approx: 'ಅಂದಾಜು',
      enterSize: 'ಬೆಲೆ ನೋಡಲು ಗಾತ್ರ ನಮೂದಿಸಿ', add: 'ನನ್ನ ಪಟ್ಟಿಗೆ ಸೇರಿಸಿ', myQuote: 'ನನ್ನ ಅಂದಾಜು ಪಟ್ಟಿ', clear: 'ಎಲ್ಲಾ ಅಳಿಸಿ',
      empty: 'ಇನ್ನೂ ಏನೂ ಸೇರಿಸಿಲ್ಲ. ಎಡಭಾಗದಲ್ಲಿ ಐಟಂ ಆರಿಸಿ, “ನನ್ನ ಪಟ್ಟಿಗೆ ಸೇರಿಸಿ” ಒತ್ತಿ.', remove: 'ತೆಗೆಯಿರಿ',
      gstTick: 'ಜಿಎಸ್‌ಟಿ ಸೇರಿಸಿ', subtotal: 'ಉಪಮೊತ್ತ', gst: 'ಜಿಎಸ್‌ಟಿ', total: 'ಅಂದಾಜು ಒಟ್ಟು ಮೊತ್ತ', range: 'ಅಂದಾಜು ಶ್ರೇಣಿ',
      name: 'ನಿಮ್ಮ ಹೆಸರು', phone: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ', pdf: 'PDF ಅಂದಾಜು ಪಟ್ಟಿ ಡೌನ್‌ಲೋಡ್', wa: 'ವಾಟ್ಸ್‌ಆ್ಯಪ್‌ನಲ್ಲಿ ಕಳುಹಿಸಿ', share: 'PDF ಹಂಚಿಕೊಳ್ಳಿ', visit: 'ಉಚಿತ ಸೈಟ್ ಭೇಟಿ ಕಾಯ್ದಿರಿಸಿ',
      disc: 'ಇದು ಸಾಮಾನ್ಯ ದರಗಳ ಆಧಾರದ ಮೇಲಿನ ಅಂದಾಜು ಮಾತ್ರ. ಸೈಟ್ ಭೇಟಿ ಮತ್ತು ನಿಖರ ಅಳತೆಯ ನಂತರ ಅಂತಿಮ ಬೆಲೆ ದೃಢಪಡಿಸಲಾಗುತ್ತದೆ. 7 ದಿನಗಳವರೆಗೆ ಮಾನ್ಯ.',
      errCust: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹೆಸರು ಮತ್ತು 10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ.', errItems: 'ಮೊದಲು ಕನಿಷ್ಠ ಒಂದು ಐಟಂ ಸೇರಿಸಿ.', errDims: '0.5 ರಿಂದ 200 ರ ನಡುವೆ ಗಾತ್ರ ನಮೂದಿಸಿ.',
      okPdf: 'ನಿಮ್ಮ PDF ಸಿದ್ಧ ✓ — ನಮ್ಮ ತಂಡ ನಿಮಗೆ ಕರೆ ಮಾಡುತ್ತದೆ.', okWa: 'ವಾಟ್ಸ್‌ಆ್ಯಪ್ ತೆರೆಯುತ್ತಿದೆ — ಪಟ್ಟಿ ನಮಗೆ ತಲುಪಲು Send ಒತ್ತಿ.', okVisit: 'ಆಯಿತು — ನಿಮ್ಮ ವಿವರಗಳನ್ನು ಕೆಳಗಿನ ವಿಚಾರಣೆ ಫಾರ್ಮ್‌ನಲ್ಲಿ ತುಂಬಲಾಗಿದೆ.',
      each: 'ಪ್ರತಿ', perSqft: '/ಚ.ಅ.', flat: 'ನಿಗದಿತ', ext: 'ಹೆಚ್ಚುವರಿ',
      q_title: 'ಅಂದಾಜು ಪಟ್ಟಿ', q_no: 'ಪಟ್ಟಿ ಸಂಖ್ಯೆ', q_date: 'ದಿನಾಂಕ', q_valid: 'ಮಾನ್ಯತೆ ದಿನಾಂಕ', q_for: 'ಗ್ರಾಹಕರು', q_item: 'ಐಟಂ', q_size: 'ಗಾತ್ರ', q_area: 'ವಿಸ್ತೀರ್ಣ (ಚ.ಅ.)', q_rate: 'ದರ/ಚ.ಅ.', q_amt: 'ಮೊತ್ತ',
      q_sub: 'ಉಪಮೊತ್ತ', q_gst: 'ಜಿಎಸ್‌ಟಿ', q_total: 'ಅಂದಾಜು ಒಟ್ಟು ಮೊತ್ತ', q_range: 'ಅಂದಾಜು ಶ್ರೇಣಿ', q_terms: 'ಷರತ್ತುಗಳು', q_page: 'ಪುಟ',
      q_t: ['1. ಇದು ಸಾಮಾನ್ಯ ದರಗಳು ಮತ್ತು ನಮೂದಿಸಿದ ಅಳತೆಯ ಆಧಾರದ ಅಂದಾಜು ಮಾತ್ರ.', '2. ಸೈಟ್ ಭೇಟಿ ಮತ್ತು ನಿಖರ ಅಳತೆಯ ನಂತರ ಅಂತಿಮ ಬೆಲೆ ದೃಢಪಡಿಸಲಾಗುತ್ತದೆ.', '3. ವಿನ್ಯಾಸ, ಹಾರ್ಡ್‌ವೇರ್ ಬ್ರ್ಯಾಂಡ್ ಮತ್ತು ಸ್ಥಳದ ಸ್ಥಿತಿಗೆ ಅನುಗುಣವಾಗಿ ಬೆಲೆ ಬದಲಾಗಬಹುದು.', '4. ಈ ಪಟ್ಟಿ ಮೇಲಿನ ದಿನಾಂಕದಿಂದ 7 ದಿನಗಳವರೆಗೆ ಮಾನ್ಯ.'],
      q_sampleNote: 'ಮಾದರಿ ದರಗಳು — ಪ್ರದರ್ಶನಕ್ಕೆ ಮಾತ್ರ', wa_intro: 'ವೆಬ್‌ಸೈಟ್ ಅಂದಾಜು ಸಾಧನದಿಂದ ಹೊಸ ಪಟ್ಟಿ ವಿನಂತಿ', wa_hi: 'ನಮಸ್ಕಾರ ಸತೀಶ್ ವುಡ್ ವರ್ಕ್ಸ್, ಈ ಅಂದಾಜಿನೊಂದಿಗೆ ಮುಂದುವರಿಯಲು ಬಯಸುತ್ತೇನೆ:'
    }
  };

  /* ---------------- state ---------------- */
  var LS = 'sww_est_v1';
  var st = { lang: 'en', cat: R.categories[0].id, mat: null, unit: 'ft', d1: '', d2: '', qty: 1, add: {}, items: [], gst: false, name: '', phone: '', qno: null };
  try { var sv = JSON.parse(localStorage.getItem(LS) || 'null'); if (sv) { st.lang = sv.lang === 'kn' ? 'kn' : 'en'; st.items = Array.isArray(sv.items) ? sv.items : []; st.gst = !!sv.gst; st.qno = sv.qno || null; st.name = sv.name || ''; st.phone = sv.phone || ''; } } catch (e) {}
  function save() { try { localStorage.setItem(LS, JSON.stringify({ lang: st.lang, items: st.items, gst: st.gst, qno: st.qno, name: st.name, phone: st.phone })); } catch (e) {} }

  function t(k) { var v = T[st.lang][k]; return v === undefined ? T.en[k] : v; }
  function L(o) { return o ? (o[st.lang] || o.en || '') : ''; }
  function cat(id) { for (var i = 0; i < R.categories.length; i++) if (R.categories[i].id === (id || st.cat)) return R.categories[i]; return R.categories[0]; }
  function inr(n) { return '₹' + Math.round(n).toLocaleString('en-IN'); }
  function r2(n) { return Math.round(n * 100) / 100; }
  function num(x) { return Math.round(x * 100) / 100; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function $(s, c) { return (c || root).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || root).querySelectorAll(s)); }

  /* ---------------- pricing ---------------- */
  function price(it) {
    var c = cat(it.cat), m = null, i;
    for (i = 0; i < c.materials.length; i++) if (c.materials[i].id === it.mat) m = c.materials[i];
    if (!m) m = c.materials[0];
    var area = it.d1 * it.d2, areaT = area * it.qty, base = areaT * m.rate, ex = 0, exList = [];
    (it.add || []).forEach(function (id) {
      c.addons.forEach(function (a) { if (a.id === id) { var v = a.type === 'flat' ? a.rate * it.qty : a.rate * areaT; ex += v; exList.push(a); } });
    });
    return { area: area, areaT: areaT, rate: m.rate, mat: m, base: base, extras: ex, exList: exList, amount: Math.round((base + ex) / 10) * 10 };
  }
  function dimsFromForm() {
    var k = st.unit === 'm' ? 3.28084 : 1, a = parseFloat(String(st.d1).replace(',', '.')), b = parseFloat(String(st.d2).replace(',', '.'));
    var lo = 0.5, hi = 200, aa = a * k, bb = b * k;
    var ok = isFinite(aa) && isFinite(bb) && a > 0 && b > 0 && aa >= lo * 0.99 && bb >= lo * 0.99 && aa <= hi && bb <= hi;
    return { a: r2(aa), b: r2(bb), ok: ok };
  }
  function curItem() {
    var d = dimsFromForm(); if (!d.ok) return null;
    var q = Math.max(1, Math.min(99, parseInt(st.qty, 10) || 1));
    return { cat: st.cat, mat: st.mat, d1: d.a, d2: d.b, qty: q, add: Object.keys(st.add).filter(function (k) { return st.add[k]; }) };
  }
  function totals() {
    var sub = 0; st.items.forEach(function (it) { sub += price(it).amount; });
    var gst = st.gst ? Math.round(sub * R.gstPercent / 100) : 0, total = sub + gst, p = (R.rangePercent || 10) / 100;
    return { sub: sub, gst: gst, total: total, lo: Math.round(total * (1 - p) / 500) * 500, hi: Math.round(total * (1 + p) / 500) * 500 };
  }
  function sizeText(it) { return num(it.d1) + ' × ' + num(it.d2) + ' ' + (st.lang === 'kn' ? 'ಅಡಿ' : 'ft') + (it.qty > 1 ? '  ×' + it.qty : ''); }
  function itemName(it) { var p = price(it); return L(cat(it.cat).name) + ' — ' + L(p.mat.name); }
  function extrasText(it) { var p = price(it); return p.exList.map(function (a) { return L(a.name); }).join(', '); }

  /* ---------------- build UI once ---------------- */
  root.innerHTML =
    '<div class="est-top"><div class="est-lang" role="group" aria-label="Language"><button type="button" data-lang="en">English</button><button type="button" data-lang="kn">ಕನ್ನಡ</button></div>' +
    '<span class="est-sample" id="est-sample" hidden></span></div>' +
    '<div class="est-grid">' +
    '<div class="est-card est-build">' +
    '<h3 class="est-h"><b>1</b><span data-i="s1"></span></h3><div class="pills est-cats" id="est-cats"></div>' +
    '<h3 class="est-h"><b>2</b><span data-i="s2"></span></h3>' +
    '<div class="pills est-units"><label><input type="radio" name="est-unit" value="ft" checked><span data-i="ft"></span></label><label><input type="radio" name="est-unit" value="m"><span data-i="m"></span></label></div>' +
    '<div class="fld-row est-dims"><label class="fld"><span id="est-l1"></span><input id="est-d1" inputmode="decimal" autocomplete="off" maxlength="7"></label>' +
    '<label class="fld"><span id="est-l2"></span><input id="est-d2" inputmode="decimal" autocomplete="off" maxlength="7"></label>' +
    '<label class="fld"><span data-i="qty"></span><input id="est-qty" type="number" min="1" max="99" value="1" inputmode="numeric"></label></div>' +
    '<h3 class="est-h"><b>3</b><span data-i="s3"></span></h3><div class="pills est-mats" id="est-mats"></div>' +
    '<h3 class="est-h"><b>4</b><span data-i="s4"></span></h3><div class="pills est-adds" id="est-adds"></div>' +
    '<div class="est-live" id="est-live" aria-live="polite"></div>' +
    '<p class="form-err" id="est-derr" hidden></p>' +
    '<button type="button" class="btn btn-brass btn-lg" id="est-add"><span data-i="add"></span></button>' +
    '</div>' +
    '<div class="est-card est-quote">' +
    '<div class="est-qhead"><h3 class="est-qt" data-i="myQuote"></h3><button type="button" class="est-clear" id="est-clear" data-i="clear" hidden></button></div>' +
    '<div class="est-list" id="est-list"></div>' +
    '<label class="consent est-gst" id="est-gstrow" hidden><input type="checkbox" id="est-gst"><span><span data-i="gstTick"></span> (<span id="est-gstp"></span>%)</span></label>' +
    '<div class="est-totals" id="est-totals" hidden></div>' +
    '<div class="fld-row est-cust"><label class="fld"><span data-i="name"></span><input id="est-name" autocomplete="name" maxlength="80"></label>' +
    '<label class="fld"><span data-i="phone"></span><input id="est-phone" inputmode="tel" autocomplete="tel" maxlength="16" placeholder="98450 12345"></label></div>' +
    '<p class="form-err" id="est-err" hidden></p><p class="est-ok" id="est-ok" hidden></p>' +
    '<div class="est-actions"><button type="button" class="btn btn-brass" id="est-pdf"><span data-i="pdf"></span></button>' +
    '<button type="button" class="btn est-wabtn" id="est-wa" hidden><span data-i="wa"></span></button>' +
    '<button type="button" class="btn btn-ghost" id="est-share" hidden><span data-i="share"></span></button>' +
    '<button type="button" class="btn btn-ghost" id="est-visit"><span data-i="visit"></span></button></div>' +
    '<p class="est-note" data-i="disc"></p>' +
    '</div></div>';

  var ownerPhone = String(CFG.phone || '').replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');
  if (ownerPhone.length === 10) $('#est-wa').hidden = false;
  var canShareFiles = false;
  try { canShareFiles = !!(navigator.canShare && navigator.canShare({ files: [new File(['x'], 'x.pdf', { type: 'application/pdf' })] })); } catch (e) {}
  if (canShareFiles) $('#est-share').hidden = false;
  $('#est-gstp').textContent = R.gstPercent;
  $('#est-name').value = st.name; $('#est-phone').value = st.phone; $('#est-gst').checked = st.gst;

  /* ---------------- render parts ---------------- */
  function applyLang() {
    root.lang = st.lang === 'kn' ? 'kn' : 'en'; root.classList.toggle('is-kn', st.lang === 'kn');
    $$('[data-i]').forEach(function (n) { n.textContent = t(n.getAttribute('data-i')); });
    $$('.est-lang button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-lang') === st.lang); b.setAttribute('aria-pressed', b.getAttribute('data-lang') === st.lang); });
    var sm = $('#est-sample'); sm.hidden = !R.sample; sm.textContent = t('sample');
    var set = function (id, key) { var el = document.getElementById(id); if (el) { var tx = T[st.lang][key]; if (tx) el.textContent = tx; } };
    set('est-h2a', 'h2a'); set('est-h2b', 'h2b'); set('est-sub', 'sub'); set('est-eyebrow', 'eyebrow');
    renderCats(); renderMats(); renderAdds(); renderDimLabels(); renderLive(); renderList(); renderTotals();
    try { document.documentElement.setAttribute('data-est-lang', st.lang); } catch (e) {}
  }
  function renderCats() {
    $('#est-cats').innerHTML = R.categories.map(function (c) {
      return '<label><input type="radio" name="est-cat" value="' + c.id + '"' + (c.id === st.cat ? ' checked' : '') + '><span>' + esc(L(c.name)) + '</span></label>';
    }).join('');
  }
  function renderMats() {
    var c = cat(); if (!st.mat || !c.materials.some(function (m) { return m.id === st.mat; })) st.mat = c.materials[0].id;
    $('#est-mats').innerHTML = c.materials.map(function (m) {
      return '<label><input type="radio" name="est-mat" value="' + m.id + '"' + (m.id === st.mat ? ' checked' : '') + '><span>' + esc(L(m.name)) + ' <i>' + inr(m.rate) + t('perSqft') + '</i></span></label>';
    }).join('');
  }
  function renderAdds() {
    var c = cat();
    $('#est-adds').innerHTML = c.addons.map(function (a) {
      var lab = a.type === 'flat' ? '+' + inr(a.rate) : '+' + inr(a.rate) + t('perSqft');
      return '<label><input type="checkbox" name="est-add" value="' + a.id + '"' + (st.add[a.id] ? ' checked' : '') + '><span>' + esc(L(a.name)) + ' <i>' + lab + '</i></span></label>';
    }).join('');
  }
  function renderDimLabels() {
    var c = cat(), u = st.unit === 'm' ? (st.lang === 'kn' ? 'ಮೀ' : 'm') : (st.lang === 'kn' ? 'ಅಡಿ' : 'ft');
    $('#est-l1').textContent = L(c.d1) + ' (' + u + ')'; $('#est-l2').textContent = L(c.d2) + ' (' + u + ')';
  }
  function setDefaults() {
    var c = cat(), k = st.unit === 'm' ? 1 / 3.28084 : 1;
    $('#est-d1').value = st.d1 = String(num(c.d1.def * k)); $('#est-d2').value = st.d2 = String(num(c.d2.def * k));
    st.add = {}; st.mat = null;
  }
  function renderLive() {
    var box = $('#est-live'), it = curItem();
    if (!it) { box.innerHTML = '<span class="est-dim">' + esc(t('enterSize')) + '</span>'; return; }
    var p = price(it);
    box.innerHTML = '<div><small>' + esc(t('thisItem')) + ' • ' + esc(t('area')) + ' ' + num(p.areaT) + ' ' + esc(t('sqft')) + '</small><b>' + esc(t('approx')) + ' ' + inr(p.amount) + '</b></div>';
  }
  function renderList() {
    var el = $('#est-list');
    $('#est-clear').hidden = !st.items.length; $('#est-totals').hidden = !st.items.length; $('#est-gstrow').hidden = !st.items.length;
    if (!st.items.length) { el.innerHTML = '<p class="est-empty">' + esc(t('empty')) + '</p>'; return; }
    el.innerHTML = st.items.map(function (it, i) {
      var p = price(it), ex = extrasText(it);
      return '<div class="est-row"><div class="est-row-main"><b>' + esc(itemName(it)) + '</b><small>' + esc(sizeText(it)) + ' • ' + num(p.areaT) + ' ' + esc(t('sqft')) + ' @ ' + inr(p.rate) + '</small>' +
        (ex ? '<small class="est-ex">+ ' + esc(ex) + '</small>' : '') + '</div><div class="est-row-amt">' + inr(p.amount) + '<button type="button" class="est-x" data-rm="' + i + '" aria-label="' + esc(t('remove')) + '">×</button></div></div>';
    }).join('');
  }
  function renderTotals() {
    var box = $('#est-totals'); if (!st.items.length) return;
    var tt = totals();
    box.innerHTML = '<div><span>' + esc(t('subtotal')) + '</span><b>' + inr(tt.sub) + '</b></div>' +
      (st.gst ? '<div><span>' + esc(t('gst')) + ' (' + R.gstPercent + '%)</span><b>' + inr(tt.gst) + '</b></div>' : '') +
      '<div class="est-grand"><span>' + esc(t('total')) + '</span><b>' + inr(tt.total) + '</b></div>' +
      '<div class="est-rng"><span>' + esc(t('range')) + '</span><b>' + inr(tt.lo) + ' – ' + inr(tt.hi) + '</b></div>';
  }

  /* ---------------- events ---------------- */
  function msg(id, text) { var e = document.getElementById(id); e.textContent = text || ''; e.hidden = !text; }
  function clearMsgs() { msg('est-err', ''); msg('est-ok', ''); msg('est-derr', ''); }
  root.addEventListener('click', function (e) {
    var b = e.target.closest('[data-lang]'); if (b) { st.lang = b.getAttribute('data-lang'); save(); applyLang(); clearMsgs(); return; }
    var rm = e.target.closest('[data-rm]'); if (rm) { st.items.splice(parseInt(rm.getAttribute('data-rm'), 10), 1); if (!st.items.length) st.qno = null; save(); renderList(); renderTotals(); return; }
  });
  root.addEventListener('change', function (e) {
    var n = e.target;
    if (n.name === 'est-cat') { st.cat = n.value; setDefaults(); renderMats(); renderAdds(); renderDimLabels(); renderLive(); msg('est-derr', ''); }
    else if (n.name === 'est-mat') { st.mat = n.value; renderLive(); }
    else if (n.name === 'est-add') { st.add[n.value] = n.checked; renderLive(); }
    else if (n.name === 'est-unit') {
      var d = dimsFromForm(), fromFt = st.unit === 'ft'; st.unit = n.value;
      if (d.ok) { var k = st.unit === 'm' ? 1 / 3.28084 : 1; $('#est-d1').value = st.d1 = String(num(d.a * k)); $('#est-d2').value = st.d2 = String(num(d.b * k)); }
      renderDimLabels(); renderLive();
    } else if (n.id === 'est-gst') { st.gst = n.checked; save(); renderTotals(); }
  });
  root.addEventListener('input', function (e) {
    var n = e.target;
    if (n.id === 'est-d1') { st.d1 = n.value; renderLive(); msg('est-derr', ''); }
    else if (n.id === 'est-d2') { st.d2 = n.value; renderLive(); msg('est-derr', ''); }
    else if (n.id === 'est-qty') { st.qty = n.value; renderLive(); }
    else if (n.id === 'est-name') { st.name = n.value; save(); n.classList.remove('bad'); msg('est-err', ''); }
    else if (n.id === 'est-phone') { st.phone = n.value; save(); n.classList.remove('bad'); msg('est-err', ''); }
  });
  $('#est-add').addEventListener('click', function () {
    clearMsgs(); var it = curItem();
    if (!it) { msg('est-derr', t('errDims')); return; }
    st.items.push(it); if (!st.qno) st.qno = newQno(); save(); renderList(); renderTotals();
    var q = $('.est-quote'); if (window.matchMedia('(max-width:920px)').matches) q.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  $('#est-clear').addEventListener('click', function () { st.items = []; st.qno = null; save(); renderList(); renderTotals(); clearMsgs(); });

  /* ---------------- quote data ---------------- */
  function newQno() { var d = new Date(), p = function (n) { return (n < 10 ? '0' : '') + n; }; return 'SWQ-' + String(d.getFullYear()).slice(2) + p(d.getMonth() + 1) + p(d.getDate()) + '-' + Math.random().toString(36).slice(2, 5).toUpperCase(); }
  function fmtDate(d) { var p = function (n) { return (n < 10 ? '0' : '') + n; }; return p(d.getDate()) + '/' + p(d.getMonth() + 1) + '/' + d.getFullYear(); }
  function cleanPhone(v) { return String(v).replace(/[^\d]/g, '').replace(/^(91|0)(?=\d{10}$)/, ''); }
  function customer() {
    var name = st.name.trim(), ph = cleanPhone(st.phone), ok = name.length >= 2 && /^[6-9]\d{9}$/.test(ph);
    $('#est-name').classList.toggle('bad', name.length < 2); $('#est-phone').classList.toggle('bad', !/^[6-9]\d{9}$/.test(ph));
    return ok ? { name: name, phone: ph } : null;
  }
  function gate() {
    clearMsgs();
    if (!st.items.length) { msg('est-err', t('errItems')); return null; }
    var c = customer(); if (!c) { msg('est-err', t('errCust')); (name_ok() ? $('#est-phone') : $('#est-name')).focus(); return null; }
    if (!st.qno) st.qno = newQno(); save();
    var now = new Date(), valid = new Date(now.getTime() + (R.validDays || 7) * 86400000), tt = totals();
    return { no: st.qno, date: fmtDate(now), valid: fmtDate(valid), cust: c, tt: tt, lang: st.lang };
  }
  function name_ok() { return st.name.trim().length >= 2; }
  function plainLines() {
    return st.items.map(function (it, i) { var p = price(it), ex = extrasText(it); return (i + 1) + '. ' + itemName(it) + ' | ' + sizeText(it) + ' | ' + num(p.areaT) + ' ' + t('sqft') + ' | ' + inr(p.amount) + (ex ? ' | + ' + ex : ''); });
  }

  /* ---------------- lead e-mail (FormSubmit) ---------------- */
  var sentSig = {};
  function sendLead(q, channel) {
    var to = String(CFG.email || '').trim(); if (!to) return;
    var sig = channel + '|' + q.no + '|' + q.tt.total + '|' + q.cust.phone; if (sentSig[sig]) return; sentSig[sig] = 1;
    var b = { _subject: 'Quote request - ' + q.cust.name + ' (' + inr(q.tt.total) + ')', _template: 'table', _captcha: 'false', _honey: '',
      'Source': 'Price Estimator (' + channel + ')', 'Quote no.': q.no, 'Name': q.cust.name, 'Mobile': '+91 ' + q.cust.phone,
      'Items': plainLines().join('\n'), 'Subtotal': inr(q.tt.sub), 'GST': st.gst ? inr(q.tt.gst) + ' (' + R.gstPercent + '%)' : 'not included',
      'Approx. total': inr(q.tt.total), 'Range': inr(q.tt.lo) + ' - ' + inr(q.tt.hi), 'Customer language': q.lang === 'kn' ? 'Kannada' : 'English' };
    if (R.sample) b['Note'] = 'SAMPLE RATES were active';
    try { fetch('https://formsubmit.co/ajax/' + encodeURIComponent(to), { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(b) }).catch(function () {}); } catch (e) {}
  }

  /* ---------------- PDF (canvas pages -> JPEG -> minimal PDF) ---------------- */
  var KN_FONT = '"Noto Sans Kannada","Nirmala UI","Kannada Sangam MN","Kannada MN",Tunga,"Noto Sans",sans-serif';
  var EN_FONT = 'Manrope,"Segoe UI",Roboto,Arial,sans-serif';
  var SERIF = '"Cormorant Garamond",Georgia,serif';
  function ff() { return st.lang === 'kn' ? KN_FONT : EN_FONT; }
  function fitText(ctx, s, maxW) { if (ctx.measureText(s).width <= maxW) return s; while (s.length > 1 && ctx.measureText(s + '…').width > maxW) s = s.slice(0, -1); return s + '…'; }
  function wrap(ctx, s, maxW, font, maxLines) {
    ctx.font = font; var words = s.split(' '), lines = [], cur = '';
    for (var i = 0; i < words.length; i++) {
      var tryS = cur ? cur + ' ' + words[i] : words[i];
      if (ctx.measureText(tryS).width <= maxW || !cur) cur = tryS; else { lines.push(cur); cur = words[i]; }
    }
    if (cur) lines.push(cur);
    if (lines.length > maxLines) { var rest = lines.slice(maxLines - 1).join(' '); lines = lines.slice(0, maxLines - 1); lines.push(fitText(ctx, rest, maxW)); }
    return lines;
  }
  function drawPage(q, rows, pi, pc, last) {
    var W = 1240, H = 1754, M = 80, c = document.createElement('canvas'); c.width = W; c.height = H; var x = c.getContext('2d');
    x.fillStyle = '#ffffff'; x.fillRect(0, 0, W, H);
    // header
    x.fillStyle = '#1a110b'; x.fillRect(0, 0, W, 210); x.fillStyle = '#d9a24a'; x.fillRect(0, 210, W, 8);
    x.fillStyle = '#f2c577'; x.font = '700 62px ' + SERIF; x.textBaseline = 'alphabetic'; x.fillText('Satish Wood Works', M, 100);
    x.fillStyle = '#d9cbb3'; x.font = '400 24px ' + EN_FONT;
    x.fillText('#456 / #52, 1st Cross, Narayanaswamy Layout, Abbigere, Bengaluru 560090', M, 146);
    var contact = [ownerPhone.length === 10 ? '+91 ' + ownerPhone.slice(0, 5) + ' ' + ownerPhone.slice(5) : '', CFG.email || ''].filter(Boolean).join('   |   ');
    if (contact) x.fillText(contact, M, 182);
    x.textAlign = 'right'; x.fillStyle = '#f2c577'; x.font = '700 44px ' + ff(); x.fillText(t('q_title'), W - M, 100); x.textAlign = 'left';
    // meta
    var y = 290; x.fillStyle = '#6e5a44'; x.font = '600 22px ' + ff();
    x.fillText(t('q_no'), M, y); x.fillText(t('q_date'), M + 330, y); x.fillText(t('q_valid'), M + 560, y); x.fillText(t('q_for'), M + 800, y);
    x.fillStyle = '#2a1a0f'; x.font = '700 28px ' + EN_FONT; x.fillText(q.no, M, y + 40); x.fillText(q.date, M + 330, y + 40); x.fillText(q.valid, M + 560, y + 40);
    x.font = '700 28px ' + ff(); x.fillText(fitText(x, q.cust.name, 330), M + 800, y + 40); x.font = '500 24px ' + EN_FONT; x.fillStyle = '#6e5a44'; x.fillText('+91 ' + q.cust.phone.slice(0, 5) + ' ' + q.cust.phone.slice(5), M + 800, y + 76);
    // table head
    var cols = { n: M, item: M + 50, size: 610, areaR: 850, rateR: 990, amt: W - M }, ty = 410;
    x.fillStyle = '#2a1a0f'; x.fillRect(M - 10, ty - 36, W - 2 * M + 20, 56); x.fillStyle = '#f2c577'; x.font = '700 21px ' + ff();
    x.fillText('#', cols.n, ty); x.fillText(t('q_item'), cols.item, ty); x.fillText(t('q_size'), cols.size, ty);
    x.textAlign = 'right'; x.fillText(t('q_area'), cols.areaR, ty); x.fillText(t('q_rate'), cols.rateR, ty); x.fillText(t('q_amt'), cols.amt, ty); x.textAlign = 'left';
    // rows (name wraps to 2 lines, extras on a 3rd)
    var ry = ty + 56, RH = 112, nameW = cols.size - cols.item - 24;
    rows.forEach(function (r, i) {
      if (i % 2 === 0) { x.fillStyle = '#faf5ec'; x.fillRect(M - 10, ry - 12, W - 2 * M + 20, RH - 4); }
      var it = r.it, p = price(it), idx = r.idx + 1, lines = wrap(x, itemName(it), nameW, '700 25px ' + ff(), 2);
      x.fillStyle = '#2a1a0f'; x.font = '700 24px ' + EN_FONT; x.fillText(String(idx), cols.n, ry + 24);
      x.font = '700 25px ' + ff(); lines.forEach(function (ln, k) { x.fillText(ln, cols.item, ry + 24 + k * 32); });
      var ex = extrasText(it); x.font = '400 20px ' + ff(); x.fillStyle = '#6e5a44';
      if (ex) x.fillText(fitText(x, '+ ' + ex, nameW), cols.item, ry + 24 + lines.length * 32 + 4);
      x.fillStyle = '#2a1a0f'; x.font = '500 23px ' + ff(); x.fillText(fitText(x, sizeText(it), 215), cols.size, ry + 24);
      x.textAlign = 'right'; x.font = '500 23px ' + EN_FONT; x.fillText(String(num(p.areaT)), cols.areaR, ry + 24); x.fillText(inr(p.rate), cols.rateR, ry + 24);
      x.font = '700 25px ' + EN_FONT; x.fillText(inr(p.amount), cols.amt, ry + 24); x.textAlign = 'left'; ry += RH;
    });
    x.strokeStyle = '#d9a24a'; x.lineWidth = 2; x.beginPath(); x.moveTo(M - 10, ry); x.lineTo(W - M + 10, ry); x.stroke();
    if (last) {
      var tt = q.tt, by = ry + 56; x.textAlign = 'right';
      var line = function (lab, val, big) { x.fillStyle = big ? '#2a1a0f' : '#6e5a44'; x.font = (big ? '700 30px ' : '600 25px ') + ff(); x.fillText(lab, W - M - 280, by); x.font = (big ? '700 36px ' : '700 27px ') + EN_FONT; x.fillStyle = big ? '#b9822f' : '#2a1a0f'; x.fillText(val, W - M, by); by += big ? 62 : 46; };
      line(t('q_sub'), inr(tt.sub)); if (st.gst) line(t('q_gst') + ' (' + R.gstPercent + '%)', inr(tt.gst));
      x.fillStyle = '#d9a24a'; x.fillRect(W - M - 520, by - 34, 520, 3); by += 8; line(t('q_total'), inr(tt.total), true);
      x.fillStyle = '#6e5a44'; x.font = '600 23px ' + ff(); x.fillText(t('q_range') + ':  ' + inr(tt.lo) + ' – ' + inr(tt.hi), W - M, by); x.textAlign = 'left';
      var ty2 = by + 70; x.fillStyle = '#2a1a0f'; x.font = '700 24px ' + ff(); x.fillText(t('q_terms'), M, ty2); x.fillStyle = '#6e5a44'; x.font = '400 22px ' + ff();
      T[st.lang].q_t.forEach(function (s, i) { x.fillText(fitText(x, s, W - 2 * M), M, ty2 + 40 + i * 36); });
    }
    // footer
    x.fillStyle = '#d9a24a'; x.fillRect(M, H - 110, W - 2 * M, 2); x.fillStyle = '#6e5a44'; x.font = '400 20px ' + ff();
    x.fillText('Satish Wood Works • Abbigere, Bengaluru • ' + (R.sample ? t('q_sampleNote') : 'www'), M, H - 66);
    x.textAlign = 'right'; x.fillText(t('q_page') + ' ' + (pi + 1) + ' / ' + pc, W - M, H - 66); x.textAlign = 'left';
    return c;
  }
  function paginate(items) {
    var rows = items.map(function (it, i) { return { it: it, idx: i }; }), pages = [];
    while (rows.length > 6) pages.push(rows.splice(0, 10));
    pages.push(rows); return pages;
  }
  function b64ToBytes(b) { var s = atob(b), a = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) a[i] = s.charCodeAt(i); return a; }
  function makePdf(jpgs) {
    var enc = new TextEncoder(), parts = [], off = 0, offs = [];
    function push(u) { parts.push(u); off += u.length; }
    function str(s) { push(enc.encode(s)); }
    function obj(n, body) { offs[n] = off; str(n + ' 0 obj\n' + body + '\nendobj\n'); }
    str('%PDF-1.4\n'); push(new Uint8Array([37, 226, 227, 207, 211, 10]));
    var n = jpgs.length, kids = [];
    for (var i = 0; i < n; i++) kids.push((3 + i * 3) + ' 0 R');
    obj(1, '<< /Type /Catalog /Pages 2 0 R >>'); obj(2, '<< /Type /Pages /Kids [' + kids.join(' ') + '] /Count ' + n + ' >>');
    for (var j = 0; j < n; j++) {
      var P = 3 + j * 3, I = P + 1, C = P + 2, im = jpgs[j], cs = 'q 595.28 0 0 841.89 0 0 cm /Im0 Do Q';
      obj(P, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im0 ' + I + ' 0 R >> >> /Contents ' + C + ' 0 R >>');
      offs[I] = off; str(I + ' 0 obj\n<< /Type /XObject /Subtype /Image /Width ' + im.w + ' /Height ' + im.h + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + im.bytes.length + ' >>\nstream\n'); push(im.bytes); str('\nendstream\nendobj\n');
      obj(C, '<< /Length ' + cs.length + ' >>\nstream\n' + cs + '\nendstream');
    }
    var xo = off, total = 3 + n * 3; str('xref\n0 ' + total + '\n0000000000 65535 f \n');
    for (var k = 1; k < total; k++) str(('0000000000' + offs[k]).slice(-10) + ' 00000 n \n');
    str('trailer\n<< /Size ' + total + ' /Root 1 0 R >>\nstartxref\n' + xo + '\n%%EOF');
    var out = new Uint8Array(off), p = 0; parts.forEach(function (u) { out.set(u, p); p += u.length; }); return out;
  }
  function loadFonts() {
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    var jobs = ['700 24px "Cormorant Garamond"', '400 24px Manrope', '700 24px Manrope'];
    if (st.lang === 'kn') jobs.push('400 24px "Noto Sans Kannada"', '700 24px "Noto Sans Kannada"');
    var sample = st.lang === 'kn' ? 'ಕನ್ನಡ' : 'Aa';
    return Promise.race([Promise.all(jobs.map(function (j) { return document.fonts.load(j, sample).catch(function () {}); })), new Promise(function (r) { setTimeout(r, 2500); })]);
  }
  function buildPdf(q) {
    return loadFonts().then(function () {
      var pages = paginate(st.items), jpgs = pages.map(function (rows, i) {
        var c = drawPage(q, rows, i, pages.length, i === pages.length - 1), d = c.toDataURL('image/jpeg', 0.92);
        return { bytes: b64ToBytes(d.split(',')[1]), w: c.width, h: c.height };
      });
      return new Blob([makePdf(jpgs)], { type: 'application/pdf' });
    });
  }
  function fileName(q) { return 'Satish-Wood-Works-Quote-' + q.no + '.pdf'; }
  function download(blob, name) { var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 800); }
  function busy(btn, on) { btn.disabled = !!on; btn.style.opacity = on ? '.6' : ''; }

  $('#est-pdf').addEventListener('click', function () {
    var q = gate(); if (!q) return; var b = this; busy(b, true);
    buildPdf(q).then(function (blob) { download(blob, fileName(q)); sendLead(q, 'PDF download'); msg('est-ok', t('okPdf')); }).catch(function () { msg('est-err', 'PDF error — please try again.'); }).then(function () { busy(b, false); });
  });
  $('#est-share').addEventListener('click', function () {
    var q = gate(); if (!q) return; var b = this; busy(b, true);
    buildPdf(q).then(function (blob) {
      var f = new File([blob], fileName(q), { type: 'application/pdf' });
      sendLead(q, 'PDF share');
      return navigator.share({ files: [f], title: 'Quotation', text: t('wa_hi') + ' ' + q.no }).catch(function () {});
    }).catch(function () {}).then(function () { busy(b, false); msg('est-ok', t('okPdf')); });
  });
  function waText(q) {
    var L2 = ['*' + t('wa_intro') + '*', '', '*' + t('q_no') + ':* ' + q.no, '*' + t('name') + ':* ' + q.cust.name, '*' + t('phone') + ':* +91 ' + q.cust.phone, ''];
    st.items.forEach(function (it, i) { var p = price(it), ex = extrasText(it); L2.push((i + 1) + '. ' + itemName(it)); L2.push('   ' + sizeText(it) + ' • ' + num(p.areaT) + ' ' + t('sqft') + ' • ' + inr(p.amount)); if (ex) L2.push('   + ' + ex); });
    L2.push(''); L2.push('*' + t('total') + ':* ' + inr(q.tt.total) + (st.gst ? ' (' + t('gst') + ' ' + R.gstPercent + '%)' : '')); L2.push(t('range') + ': ' + inr(q.tt.lo) + ' – ' + inr(q.tt.hi));
    return L2.join('\n');
  }
  $('#est-wa').addEventListener('click', function () {
    var q = gate(); if (!q || ownerPhone.length !== 10) return;
    sendLead(q, 'WhatsApp'); window.open('https://wa.me/91' + ownerPhone + '?text=' + encodeURIComponent(waText(q)), '_blank', 'noopener'); msg('est-ok', t('okWa'));
  });
  $('#est-visit').addEventListener('click', function () {
    var q = gate(); if (!q) return; sendLead(q, 'Site visit request');
    var f = document.getElementById('enq-form');
    if (f) {
      var set = function (n, v) { var el = f.querySelector('[name=' + n + ']'); if (el) { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); } };
      set('name', q.cust.name); set('phone', q.cust.phone);
      set('details', 'Quote ' + q.no + ' — approx. ' + inr(q.tt.total) + '\n' + plainLines().join('\n'));
      var first = st.items[0] && st.items[0].cat, map = { kitchen: 'kitchen', wardrobe: 'wardrobe', door: 'door', pooja: 'pooja', ceiling: 'ceiling', tv: 'tv', window: 'window' };
      if (first && map[first]) Array.prototype.forEach.call(f.querySelectorAll('input[name=interests]'), function (cb) { if (cb.value.toLowerCase().indexOf(map[first]) > -1) cb.checked = true; });
      var th = document.getElementById('thanks'); if (th && !th.hidden && typeof th.hidden !== 'undefined') { var again = document.getElementById('thanks-again'); if (again) again.click(); }
      document.getElementById('enquire').scrollIntoView({ behavior: 'smooth' });
    }
    msg('est-ok', t('okVisit'));
  });

  /* ---------------- init ---------------- */
  setDefaults(); applyLang();
  window.SWW_EST = { price: price, state: st, makePdfTest: function () { var q = gate(); return q ? buildPdf(q) : null; } };
})();
