// Raouf Tchakondo — interactions (sans dépendance)
(function () {
  'use strict';

  var doc = document.documentElement;
  var lang = doc.lang === 'en' ? 'en' : 'fr';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lite = doc.classList.contains('lite');
  var calm = reduced || lite;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    sget: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    sset: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} },
  };

  // ---------- thème ----------
  var themeBtn = $('[data-theme-toggle]');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = doc.dataset.theme === 'light' ? 'dark' : 'light';
      doc.dataset.theme = next;
      store.set('rt-theme', next);
      var meta = $('meta[name="theme-color"]');
      if (meta) meta.content = next === 'light' ? '#f2ede4' : '#0d0c0b';
    });
  }

  // ---------- menu plein écran ----------
  var menu = $('#menu');
  var openBtn = $('[data-menu-open]');
  var closeBtn = $('[data-menu-close]');
  function openMenu() {
    menu.hidden = false;
    openBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () { menu.classList.add('open'); });
    closeBtn.focus();
  }
  function closeMenu() {
    menu.classList.remove('open');
    openBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    setTimeout(function () { menu.hidden = true; }, calm ? 0 : 300);
    openBtn.focus();
  }
  if (menu && openBtn) {
    openBtn.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);
    menu.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
      if (e.key === 'Tab') {
        var f = $$('a, button', menu);
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  // ---------- ouverture : le point devient cercle (accueil, une fois par session) ----------
  var intro = $('.intro');
  if (intro && !calm && !store.sget('rt-intro')) {
    store.sset('rt-intro', '1');
    intro.classList.add('run');
    var end = function () { intro.remove(); };
    intro.addEventListener('animationend', function (e) { if (e.animationName === 'intro-out') end(); });
    intro.addEventListener('click', end);
    document.addEventListener('keydown', end, { once: true });
  } else if (intro) {
    intro.remove();
  }

  // ---------- apparitions ----------
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !calm) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // ---------- la ligne qui danse ----------
  // Un trait relie les sections et dessine une figure à chaque étape, comme une trajectoire au sol.
  var trace = $('.trace');
  if (trace && !calm) {
    var path = trace.querySelector('path');
    var len = 0;
    var figures = ['circle', 'triangle', 'losange', 'square'];
    var build = function () {
      var H = document.body.scrollHeight;
      var W = document.documentElement.clientWidth;
      trace.setAttribute('height', H);
      trace.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      var gx = Math.max(8, Math.min(W * 0.03, 36));
      var marks = $$('[data-trace]');
      var d = 'M' + gx + ' 0';
      var side = 0;
      marks.forEach(function (el, i) {
        var r = el.getBoundingClientRect();
        var y = r.top + window.scrollY + Math.min(80, r.height * 0.2);
        var x = side ? W - gx : gx;
        var s = Math.min(22, W * 0.04);
        d += ' L' + x + ' ' + y;
        // Figures dessinées en relatif et refermées sur leur point de départ (sans « z », qui ramènerait au début du tracé)
        switch (figures[i % figures.length]) {
          case 'circle':
            d += ' a' + s + ' ' + s + ' 0 1 1 ' + 2 * s + ' 0 a' + s + ' ' + s + ' 0 1 1 ' + -2 * s + ' 0';
            break;
          case 'triangle':
            d += ' l' + s + ' ' + s * 1.6 + ' l' + -2 * s + ' 0 l' + s + ' ' + -s * 1.6;
            break;
          case 'losange':
            d += ' l' + s + ' ' + s + ' l' + -s + ' ' + s + ' l' + -s + ' ' + -s + ' l' + s + ' ' + -s;
            break;
          default:
            var a = s * 1.4;
            d += ' l' + a + ' 0 l0 ' + a + ' l' + -a + ' 0 l0 ' + -a;
        }
        // Le trait change de côté une fois sur deux, en diagonale sous la section
        if (i % 2 === 1) side = 1 - side;
      });
      d += ' L' + gx + ' ' + H;
      path.setAttribute('d', d);
      len = path.getTotalLength();
      path.style.strokeDasharray = len;
      draw();
    };
    var draw = function () {
      var H = document.body.scrollHeight - window.innerHeight;
      var p = H > 0 ? Math.min(1, (window.scrollY + window.innerHeight * 0.1) / H) : 1;
      path.style.strokeDashoffset = len * (1 - p);
    };
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(function () { draw(); ticking = false; }); }
    }, { passive: true });
    var rt;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(build, 200); });
    window.addEventListener('load', build);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);
    build();
  }

  // ---------- carte des tournées ----------
  $$('[data-map]').forEach(function (map) {
    var range = $('[data-map-year]', map);
    var out = $('[data-map-out]', map);
    var tours = $('[data-map-tours]', map);
    var cities = $$('.city', map);
    var update = function () {
      var y = +range.value;
      out.textContent = y;
      cities.forEach(function (c) {
        var cy = c.getAttribute('data-year');
        var on = cy ? +cy <= y : tours.checked;
        c.classList.toggle('on', on);
      });
    };
    range.addEventListener('input', update);
    tours.addEventListener('change', update);
    update();
    // Les villes s'allument par année quand la carte entre à l'écran
    if (!calm && 'IntersectionObserver' in window) {
      var played = false;
      var mo = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting && !played) {
          played = true;
          mo.disconnect();
          var y = 1998;
          range.value = y; update();
          var timer = setInterval(function () {
            y += 1; range.value = y; update();
            if (y >= 2026) clearInterval(timer);
          }, 90);
          range.addEventListener('pointerdown', function () { clearInterval(timer); }, { once: true });
        }
      }, { threshold: 0.4 });
      mo.observe(map);
    }
  });

  // ---------- filtres des créations ----------
  var list = $('[data-filterable]');
  if (list) {
    var state = { format: '', year: '' };
    $$('[data-filter]').forEach(function (b) {
      b.addEventListener('click', function () {
        var key = b.getAttribute('data-filter');
        state[key] = b.getAttribute('data-value');
        $$('[data-filter="' + key + '"]').forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
        $$('.card', list).forEach(function (c) {
          var ok = (!state.format || c.getAttribute('data-format') === state.format) && (!state.year || c.getAttribute('data-year') === state.year);
          c.hidden = !ok;
        });
      });
    });
  }

  // ---------- le langage : onglets des danses sources ----------
  $$('[data-sources]').forEach(function (box) {
    var tabs = $$('[role="tab"]', box);
    var select = function (tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        panel.hidden = !on;
        if (on && !calm) {
          // relance le tracé de la figure
          var fig = $('.src-figure .draw', panel);
          if (fig) { var clone = fig.cloneNode(true); fig.parentNode.replaceChild(clone, fig); }
        }
      });
    };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        var n = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (n) { e.preventDefault(); var nt = tabs[(i + n + tabs.length) % tabs.length]; select(nt); nt.focus(); }
      });
    });
  });

  // ---------- agenda : filtre par pays ----------
  var cf = $('[data-country-filter]');
  if (cf) {
    cf.addEventListener('change', function () {
      $$('[data-agenda] .ag-item').forEach(function (li) {
        li.hidden = cf.value && li.getAttribute('data-country') !== cf.value;
      });
    });
  }

  // ---------- ajout au calendrier (.ics) ----------
  $$('[data-ics]').forEach(function (b) {
    b.addEventListener('click', function () {
      var e = JSON.parse(b.getAttribute('data-ics'));
      var d = function (s) { return s.replace(/-/g, ''); };
      var endD = new Date(e.end + 'T00:00:00Z');
      endD.setUTCDate(endD.getUTCDate() + 1);
      var end = endD.toISOString().slice(0, 10);
      var esc = function (s) { return String(s).replace(/([,;\\])/g, '\\$1'); };
      var ics = [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Raouf Tchakondo//Agenda//' + lang.toUpperCase(),
        'BEGIN:VEVENT',
        'UID:' + e.id + '@raouftchakondo.com',
        'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z',
        'DTSTART;VALUE=DATE:' + d(e.start),
        'DTEND;VALUE=DATE:' + d(end),
        'SUMMARY:' + esc(e.title),
        'LOCATION:' + esc(e.location),
        'END:VEVENT', 'END:VCALENDAR',
      ].join('\r\n');
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
      a.download = e.id + '.ics';
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 0);
    });
  });

  // ---------- inscription aux stages : total ----------
  $$('[data-stageform]').forEach(function (f) {
    var sel = $('[data-session]', f);
    var qty = $('[data-qty]', f);
    var total = $('[data-total]', f);
    var upd = function () {
      var o = sel.options[sel.selectedIndex];
      if (!o) { total.textContent = '—'; return; }
      var left = +o.getAttribute('data-left');
      qty.max = Math.max(1, Math.min(10, left));
      if (+qty.value > +qty.max) qty.value = qty.max;
      var n = +o.getAttribute('data-price') * Math.max(1, +qty.value || 1);
      try {
        total.textContent = new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', { style: 'currency', currency: o.getAttribute('data-currency'), maximumFractionDigits: 0 }).format(n);
      } catch (e) { total.textContent = n; }
    };
    sel.addEventListener('change', upd);
    qty.addEventListener('input', upd);
    upd();
  });

  // ---------- pré-remplissage du formulaire de booking (?type=…&piece=…) ----------
  try {
    var q = new URLSearchParams(location.search);
    ['type', 'piece'].forEach(function (k) {
      var v = q.get(k);
      var el = v && $('[data-key="' + k + '"]');
      if (el && $('option[value="' + v.replace(/[^a-z0-9-]/gi, '') + '"]', el)) el.value = v;
    });
  } catch (e) {}

  // ---------- formulaires : envoi par e-mail en préproduction ----------
  // Au lancement : remplacer par l'API (Turnstile + notification e-mail / WhatsApp, Brevo, FedaPay / Stripe).
  $$('[data-mailform]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!f.reportValidity()) return;
      var lines = [];
      $$('input, select, textarea', f).forEach(function (el) {
        if (!el.name || ((el.type === 'radio' || el.type === 'checkbox') && !el.checked)) return;
        var v = el.tagName === 'SELECT' ? el.options[el.selectedIndex].text : el.value;
        if (v) lines.push(el.name + ' : ' + v);
      });
      var total = $('[data-total]', f);
      if (total) lines.push('Total : ' + total.textContent);
      var subject = f.getAttribute('data-subject') + ' — ' + (lang === 'fr' ? 'site web' : 'website');
      location.href = 'mailto:' + f.getAttribute('data-to') + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
      var st = $('.form-status', f);
      if (st) st.textContent = st.getAttribute('data-sent');
    });
  });

  // ---------- copier les bios ----------
  $$('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var src = $(b.getAttribute('data-copy'));
      var txt = src.innerText.trim();
      var label = b.textContent;
      var done = function () {
        b.textContent = lang === 'fr' ? 'Copié' : 'Copied';
        setTimeout(function () { b.textContent = label; }, 1800);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done, function () {});
      else {
        var r = document.createRange(); r.selectNodeContents(src);
        var s = getSelection(); s.removeAllRanges(); s.addRange(r);
        try { document.execCommand('copy'); done(); } catch (e) {}
      }
    });
  });
})();
