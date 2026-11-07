/* ============================================================
   Entry form — first-time visitors fill this once, then the website opens.
   English / Kannada. Sends a 'registration' lead through SWW_LEADS.
   ============================================================ */
(function () {
  'use strict';
  var CFG = window.SWW || {}, L = window.SWW_LEADS;
  var gate = document.getElementById('gate'); if (!gate || !L) return;
  var $ = function (s, r) { return (r || gate).querySelector(s); };
  var form = $('#gate-form'), err = $('#gate-err'), root = document.documentElement;

  var T = {
    en: {
      title: 'Welcome to Satish Interior World', sub: 'Tell us a little about you to step into the showroom — interiors, furniture and every wood material.',
      name: 'Your name *', phone: 'Mobile number *', email: 'Email <i>(optional)</i>', area: 'Area / city <i>(optional)</i>', interest: 'What are you looking for? <i>(optional)</i>',
      consent: 'I agree to be contacted by Satish Interior World about my enquiry. *', go: 'Enter the showroom', fine: 'Your details are used only to contact you about your enquiry.', artline: 'Interiors · Furniture · Wood materials',
      eName: 'your name', ePhone: 'a valid 10-digit mobile number', eConsent: 'your consent to be contacted', pre: 'Please enter ', call: 'Prefer to talk? Call ',
      opts: ['Modular kitchen', 'Wardrobes', 'Doors & windows', 'Furniture', 'Full home interiors', 'Plywood / wood / boards', 'Just browsing'],
      ph: { name: 'Full name', area: 'e.g. Yeshwanthpur' }
    },
    kn: {
      title: 'ಸತೀಶ್ ಇಂಟೀರಿಯರ್ ವರ್ಲ್ಡ್‌ಗೆ ಸ್ವಾಗತ', sub: 'ಶೋರೂಂ ನೋಡಲು ನಿಮ್ಮ ಸಣ್ಣ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ — ಇಂಟೀರಿಯರ್, ಪೀಠೋಪಕರಣ ಮತ್ತು ಎಲ್ಲಾ ಮರದ ಸಾಮಗ್ರಿಗಳು.',
      name: 'ನಿಮ್ಮ ಹೆಸರು *', phone: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ *', email: 'ಇಮೇಲ್ <i>(ಐಚ್ಛಿಕ)</i>', area: 'ಪ್ರದೇಶ / ನಗರ <i>(ಐಚ್ಛಿಕ)</i>', interest: 'ನಿಮಗೆ ಏನು ಬೇಕು? <i>(ಐಚ್ಛಿಕ)</i>',
      consent: 'ನನ್ನ ವಿಚಾರಣೆಗಾಗಿ ಸತೀಶ್ ಇಂಟೀರಿಯರ್ ವರ್ಲ್ಡ್ ನನ್ನನ್ನು ಸಂಪರ್ಕಿಸಲು ನಾನು ಒಪ್ಪುತ್ತೇನೆ. *', go: 'ಶೋರೂಂ ಪ್ರವೇಶಿಸಿ', fine: 'ನಿಮ್ಮ ವಿವರಗಳನ್ನು ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಲು ಮಾತ್ರ ಬಳಸಲಾಗುತ್ತದೆ.', artline: 'ಇಂಟೀರಿಯರ್ · ಪೀಠೋಪಕರಣ · ಮರದ ಸಾಮಗ್ರಿ',
      eName: 'ನಿಮ್ಮ ಹೆಸರು', ePhone: 'ಸರಿಯಾದ 10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ', eConsent: 'ಸಂಪರ್ಕಿಸಲು ನಿಮ್ಮ ಒಪ್ಪಿಗೆ', pre: 'ದಯವಿಟ್ಟು ನಮೂದಿಸಿ: ', call: 'ಮಾತನಾಡಲು ಇಷ್ಟವೇ? ಕರೆ ಮಾಡಿ ',
      opts: ['ಮಾಡ್ಯುಲರ್ ಕಿಚನ್', 'ವಾರ್ಡ್‌ರೋಬ್', 'ಬಾಗಿಲು ಮತ್ತು ಕಿಟಕಿ', 'ಪೀಠೋಪಕರಣ', 'ಪೂರ್ಣ ಮನೆ ಇಂಟೀರಿಯರ್', 'ಪ್ಲೈವುಡ್ / ಮರ / ಬೋರ್ಡ್', 'ಕೇವಲ ನೋಡುತ್ತಿದ್ದೇನೆ'],
      ph: { name: 'ಪೂರ್ಣ ಹೆಸರು', area: 'ಉದಾ. ಯಶವಂತಪುರ' }
    }
  };
  var EN_OPTS = T.en.opts, lang = 'en';
  try { lang = localStorage.getItem('sww_lang') === 'kn' ? 'kn' : 'en'; } catch (e) {}

  function paint() {
    var d = T[lang]; gate.lang = lang === 'kn' ? 'kn' : 'en'; gate.classList.toggle('is-kn', lang === 'kn');
    Array.prototype.forEach.call(gate.querySelectorAll('[data-g]'), function (el) { var k = el.getAttribute('data-g'); if (d[k] != null) el.innerHTML = d[k]; });
    var keep = (form.querySelector('input[name=ginterest]:checked') || {}).value;
    $('#g-interest').innerHTML = d.opts.map(function (o, i) { return '<label><input type="radio" name="ginterest" value="' + EN_OPTS[i] + '"' + (keep === EN_OPTS[i] ? ' checked' : '') + '><span>' + o + '</span></label>'; }).join('');
    $('input[name=gname]').placeholder = d.ph.name; $('input[name=garea]').placeholder = d.ph.area;
    Array.prototype.forEach.call(gate.querySelectorAll('.gate-lang button'), function (b) { b.classList.toggle('on', b.dataset.l === lang); });
    var ph = String(CFG.phone || '').replace(/\D/g, '');
    var a = $('[data-phone-btn]'); if (a && ph.length === 10) { a.href = 'tel:+91' + ph; a.textContent = d.call + '+91 ' + ph.slice(0, 5) + ' ' + ph.slice(5); a.hidden = false; }
  }
  $('.gate-lang').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; lang = b.dataset.l; try { localStorage.setItem('sww_lang', lang); } catch (er) {} paint(); });

  /* ---------- show / hide ---------- */
  var others = [];
  function lock() {
    root.classList.add('gate-on'); gate.hidden = false;
    others = Array.prototype.slice.call(document.body.children).filter(function (n) { return n !== gate && n.tagName !== 'SCRIPT' && !n.hasAttribute('data-keep-live'); });
    others.forEach(function (n) { n.setAttribute('inert', ''); n.setAttribute('aria-hidden', 'true'); });
    setTimeout(function () { var f = $('input[name=gname]'); if (f) f.focus({ preventScroll: true }); }, 60);
  }
  function unlock() {
    root.classList.remove('gate-on'); gate.classList.add('leaving');
    others.forEach(function (n) { n.removeAttribute('inert'); n.removeAttribute('aria-hidden'); });
    setTimeout(function () { gate.hidden = true; gate.classList.remove('leaving'); }, 520);
    window.scrollTo(0, 0);
  }

  function mark(el, bad) { if (el) el.classList.toggle('bad', !!bad); }
  function validate() {
    var d = T[lang], n = $('input[name=gname]'), p = $('input[name=gphone]'), c = $('input[name=gconsent]'), miss = [];
    var okN = n.value.trim().length >= 2, okP = /^[6-9]\d{9}$/.test(L.digits(p.value)), okC = c.checked;
    mark(n, !okN); mark(p, !okP);
    if (!okN) miss.push(d.eName); if (!okP) miss.push(d.ePhone); if (!okC) miss.push(d.eConsent);
    return miss;
  }
  Array.prototype.forEach.call(form.querySelectorAll('input'), function (i) { i.addEventListener('input', function () { i.classList.remove('bad'); err.hidden = true; }); });

  form.addEventListener('submit', function (e) {
    e.preventDefault(); err.hidden = true;
    var miss = validate();
    if (miss.length) { err.textContent = T[lang].pre + miss.join(', ') + '.'; err.hidden = false; var f = form.querySelector('.bad'); if (f && f.focus) f.focus(); return; }
    var d = {
      name: $('input[name=gname]').value.trim(), phone: L.digits($('input[name=gphone]').value), email: $('input[name=gemail]').value.trim(),
      area: $('input[name=garea]').value.trim(), interest: (form.querySelector('input[name=ginterest]:checked') || {}).value || '', lang: lang
    };
    if ($('input[name=gwebsite]').value) { /* honeypot: bots get in, nothing is sent */ unlock(); return; }
    var p = L.setProfile({ name: d.name, phone: d.phone, email: d.email, area: d.area, interest: d.interest, lang: lang });
    L.send('registration', { name: d.name, phone: d.phone, email: d.email, area: d.area, interest: d.interest, lang: lang, vid: p.vid });
    try { window.dispatchEvent(new CustomEvent('sww:registered', { detail: p })); } catch (er) {}
    unlock();
    toast(lang === 'kn' ? 'ಸ್ವಾಗತ, ' + d.name.split(' ')[0] + '!' : 'Welcome, ' + d.name.split(' ')[0] + '!');
  });

  function toast(msg) {
    var t = document.createElement('div'); t.className = 'welcome-toast'; t.setAttribute('role', 'status'); t.textContent = msg; document.body.appendChild(t);
    setTimeout(function () { t.classList.add('out'); }, 2600); setTimeout(function () { t.remove(); }, 3200);
  }

  paint();
  if (!L.profile()) lock(); else { gate.hidden = true; root.classList.remove('gate-on'); }

  /* ---------- preview ribbon (only when previewMode is on in config.js) ---------- */
  if (CFG.previewMode && CFG.previewBadge !== false) {
    var r = document.createElement('div'); r.className = 'pv-ribbon'; r.setAttribute('data-keep-live', '');
    r.innerHTML = '<b>PREVIEW</b><span>Nothing is sent to e-mail</span><button type="button">Reset entry form</button>';
    r.querySelector('button').addEventListener('click', function () { L.clearProfile(); try { localStorage.removeItem('sww_est_v1'); } catch (e) {} location.reload(); });
    document.body.appendChild(r);
  }
})();
