// Générateur statique du site Raouf Tchakondo.
// Usage : node raouf-tchakondo/_src/build.mjs
// Produit les pages FR (racine) et EN (/en/) dans raouf-tchakondo/.

import { mkdir, writeFile, readdir, rm, cp } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as C from './content.mjs';

const SRC = dirname(fileURLToPath(import.meta.url));
const OUT = join(SRC, '..');
const LANGS = ['fr', 'en'];
const { config, routes, ui, pages } = C;

// ---------- utilitaires ----------

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const tr = (o, lang) => (o && typeof o === 'object' && lang in o ? o[lang] : o);

// Chemin (depuis la racine du site) d'une rubrique, ex. "en/works/"
function pathOf(lang, route, sub = '') {
  const seg = routes[route][lang];
  const parts = [lang === 'en' ? 'en' : '', seg, sub].filter(Boolean);
  return parts.length ? parts.join('/') + '/' : '';
}

// Contexte de page : produit des liens relatifs (le site fonctionne sous /raouf-tchakondo/ comme à la racine d'un domaine)
function makeCtx(lang, route, sub = '', rootOverride = null) {
  const path = pathOf(lang, route, sub);
  const depth = path ? path.split('/').filter(Boolean).length : 0;
  const root = rootOverride || (depth ? '../'.repeat(depth) : './');
  const altLang = lang === 'fr' ? 'en' : 'fr';
  return {
    lang,
    route,
    path,
    root,
    t: ui[lang],
    p: pages[lang],
    href: (r, s = '', l = lang) => root + pathOf(l, r, s),
    asset: (f) => root + 'assets/' + f,
    altLang,
    altPath: pathOf(altLang, route, sub),
  };
}

const fmtDate = (iso, lang, opts = { day: 'numeric', month: 'long', year: 'numeric' }) =>
  new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', { timeZone: 'UTC', ...opts }).format(new Date(iso + 'T00:00:00Z'));

const fmtRange = (a, b, lang) => {
  if (!b || a === b) return fmtDate(a, lang);
  const da = new Date(a + 'T00:00:00Z');
  const db = new Date(b + 'T00:00:00Z');
  if (da.getUTCMonth() === db.getUTCMonth() && da.getUTCFullYear() === db.getUTCFullYear())
    return `${da.getUTCDate()} – ${fmtDate(b, lang)}`;
  return `${fmtDate(a, lang, { day: 'numeric', month: 'long' })} – ${fmtDate(b, lang)}`;
};

const fmtPrice = (n, cur, lang) =>
  new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', { style: 'currency', currency: cur, maximumFractionDigits: 0 }).format(n);

const todo = (ctx) => `<span class="todo">${esc(ctx.t.todo)}</span>`;

// ---------- formes géométriques (viewBox 0 0 100 100) ----------

const SHAPES = {
  circle: '<circle cx="50" cy="50" r="40"/>',
  triangle: '<path d="M50 10 L90 82 L10 82 Z"/>',
  losange: '<path d="M50 6 L86 50 L50 94 L14 50 Z"/>',
  square: '<path d="M18 18 H82 V82 H18 Z"/>',
  hexagon: '<path d="M50 8 L86 29 V71 L50 92 L14 71 V29 Z"/>',
  eye: '<path d="M6 50 Q50 8 94 50 Q50 92 6 50 Z"/><circle cx="50" cy="50" r="14"/>',
  spiral:
    '<path d="M50 50 m0 -4 a4 4 0 1 1 -4 4 a8 8 0 0 1 8 -8 a12 12 0 0 1 12 12 a16 16 0 0 1 -16 16 a20 20 0 0 1 -20 -20 a24 24 0 0 1 24 -24 a28 28 0 0 1 28 28 a32 32 0 0 1 -32 32"/>',
};

// pathLength=100 : le tracé animé (stroke-dasharray) couvre toute la forme quelle que soit sa taille
const withLength = (s) => s.replace(/<(circle|path)\b/g, '<$1 pathLength="100"');

const shape = (name, cls = '', label = '') =>
  `<svg class="shape ${cls}" viewBox="0 0 100 100" ${label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true"'} fill="none" stroke="currentColor" stroke-width="1.5" vector-effect="non-scaling-stroke">${withLength(SHAPES[name] || SHAPES.circle)}</svg>`;

// Forme pleine (aplats de couleur)
const solid = (name, cls = '') =>
  name === 'spiral'
    ? `<svg class="solid ${cls}" viewBox="0 0 100 100" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round">${SHAPES.spiral}</svg>`
    : `<svg class="solid ${cls}" viewBox="0 0 100 100" aria-hidden="true" fill="currentColor">${(SHAPES[name] || SHAPES.circle).replace(/<circle cx="50" cy="50" r="14"\/>/, '')}</svg>`;

// Composition de formes colorées (en-têtes sans photo)
const composition = () => `<div class="compo" aria-hidden="true">
  <span class="c-sun">${solid('circle')}</span>
  <span class="c-terra">${solid('triangle')}</span>
  <span class="c-indigo">${solid('losange')}</span>
  <span class="c-ring">${shape('circle', 'draw')}</span>
</div>`;

// ---------- photos et vidéos ----------

function photo(ctx, key, { sizes = '100vw', cls = '', eager = false } = {}) {
  const im = C.images[key];
  if (!im) return '';
  const big = im.sizes[im.sizes.length - 1];
  const srcset = im.sizes.map(([w]) => `${ctx.asset(`img/${key}-${w}.webp`)} ${w}w`).join(', ');
  return `<figure class="photo ${cls}"><img src="${ctx.asset(`img/${key}-${big[0]}.webp`)}" srcset="${srcset}" sizes="${sizes}" width="${big[0]}" height="${big[1]}" alt="${esc(
    tr(im.alt, ctx.lang)
  )}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"><figcaption class="credit">© ${esc(im.credit)}</figcaption></figure>`;
}

// Vidéo YouTube « façade » : l'iframe n'est chargée qu'au clic (performance, vie privée)
function video(ctx, key) {
  const v = C.videos[key];
  const title = tr(v.title, ctx.lang);
  return `<div class="video" data-yt="${v.id}" data-title="${esc(title)}">
    ${photo(ctx, v.poster, { sizes: '(min-width: 900px) 60vw, 100vw' })}
    <button type="button" class="play" aria-label="${esc(ctx.t.play)} : ${esc(title)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></button>
  </div>`;
}

// Emplacement coloré en attendant le tournage dédié (aucune image de banque)
const media = (ctx, { label, shapeName = 'circle', ratio = '16/9', color = 'sun' } = {}) =>
  `<figure class="media c-${color}" style="aspect-ratio:${ratio}">
    <div class="media-ph">${solid(shapeName)}<span>${esc(label || ctx.t.mediaSoon)}</span></div>
  </figure>`;

// ---------- composants ----------

function agendaItem(ctx, e, { compact = false } = {}) {
  const title = e[ctx.lang];
  const country = ctx.lang === 'en' && e.countryEn ? e.countryEn : e.country;
  const isStage = e.type === 'stage';
  const piece = e.piece && C.creations.find((c) => c.slug === e.piece);
  const link = isStage ? ctx.href('transmission') + '#inscription' : piece ? ctx.href('creations', piece.slug) : null;
  const d = new Date(e.date + 'T00:00:00Z');
  return `<li class="ag-item" data-country="${esc(country)}">
    <time datetime="${e.date}"><b>${d.getUTCDate()}</b><span>${esc(fmtDate(e.date, ctx.lang, { month: 'short', year: 'numeric' }))}</span></time>
    <div class="ag-body">
      <p class="ag-title">${link ? `<a href="${link}">${esc(title)}</a>` : esc(title)}${e.demo ? ` <span class="badge">${esc(ctx.t.example)}</span>` : ''}</p>
      <p class="ag-meta">${esc(fmtRange(e.date, e.end, ctx.lang))} · ${esc(e.city)}, ${esc(country)}${e.venue ? ` · ${esc(e.venue)}` : ''}${
        !compact && isStage && e.left != null ? ` · <span class="seats" data-left="${e.left}">${esc(ctx.t.places(e.left))}</span>` : ''
      }</p>
    </div>
    ${
      compact
        ? ''
        : `<button type="button" class="btn-link ics" data-ics='${esc(
            JSON.stringify({ id: e.id, title, start: e.date, end: e.end || e.date, location: `${e.venue ? e.venue + ', ' : ''}${e.city}, ${country}` })
          )}'>${esc(ctx.t.addCal)}</button>`
    }
  </li>`;
}

function agendaList(ctx, items, opts = {}) {
  if (!items.length) return `<p class="muted">${esc(ctx.t.noDates)}</p>`;
  return `<ol class="agenda">${items.map((e) => agendaItem(ctx, e, opts)).join('')}</ol>`;
}

const upcoming = () => [...C.agenda].sort((a, b) => a.date.localeCompare(b.date));

function creationCard(ctx, c) {
  const fmt = c.format ? ctx.t.formats[c.format] : null;
  const visual = c.image
    ? photo(ctx, c.image, { sizes: '(min-width: 900px) 30vw, 100vw', cls: 'card-photo' })
    : `<div class="card-shape c-${c.color}">${solid(c.shape)}</div>`;
  return `<li class="card reveal" data-format="${c.format || ''}" data-year="${c.year || ''}">
    <a href="${ctx.href('creations', c.slug)}">
      ${visual}
      <div class="card-body">
        <p class="card-meta">${c.year ? esc(c.year) : todo(ctx)}${fmt ? ` · ${esc(fmt)}` : ''}</p>
        <h3>${esc(c.title)}</h3>
      </div>
    </a>
  </li>`;
}

function marquee(ctx) {
  const glyphs = ['circle', 'triangle', 'losange', 'square'];
  const row = ctx.t.marquee.map((w, i) => `<span>${esc(w)}</span>${solid(glyphs[i % 4], 'mq-glyph')}`).join('');
  return `<div class="marquee" aria-hidden="true"><div class="marquee-track"><div>${row}</div><div>${row}</div></div></div>`;
}

function mapSvg(ctx) {
  // Projection équirectangulaire, lon -20→10, lat 2→54
  const W = 420, H = 560, lon0 = -20, lon1 = 10, lat0 = 2, lat1 = 54;
  const x = (lon) => ((lon - lon0) / (lon1 - lon0)) * W;
  const y = (lat) => H - ((lat - lat0) / (lat1 - lat0)) * H;
  const home = C.places.find((p) => p.kind === 'base');
  const hx = x(home.lon), hy = y(home.lat);
  let grid = '';
  for (let lo = -20; lo <= 10; lo += 10) grid += `<line x1="${x(lo)}" y1="0" x2="${x(lo)}" y2="${H}"/>`;
  for (let la = 10; la <= 50; la += 10) grid += `<line x1="0" y1="${y(la)}" x2="${W}" y2="${y(la)}"/>`;
  const pts = C.places
    .map((p) => {
      const px = x(p.lon), py = y(p.lat);
      const name = ctx.lang === 'en' && p.nameEn ? p.nameEn : p.name;
      const arc =
        p === home
          ? ''
          : `<path class="arc" d="M${hx.toFixed(1)} ${hy.toFixed(1)} Q${((hx + px) / 2 + (py - hy) * 0.25).toFixed(1)} ${((hy + py) / 2).toFixed(1)} ${px.toFixed(1)} ${py.toFixed(1)}"/>`;
      const anchor = p.label === 'left' || px > W - 90 ? 'end' : 'start';
      const dx = anchor === 'end' ? -10 : 10;
      const dy = p.label === 'below' ? 18 : p.label === 'above' ? -10 : 4;
      return `<g class="city ${p.kind}" data-year="${p.year ?? ''}">${arc}<circle class="halo" cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="9"/><circle class="dot" cx="${px.toFixed(
        1
      )}" cy="${py.toFixed(1)}" r="4.5"/><text x="${(px + dx).toFixed(1)}" y="${(py + dy).toFixed(1)}" text-anchor="${anchor}">${esc(name)}${p.year ? ` · ${p.year}` : ''}</text></g>`;
    })
    .join('');
  const labels =
    ctx.lang === 'fr'
      ? { eu: 'EUROPE', af: 'AFRIQUE DE L’OUEST', tours: 'Lieux sans date (à confirmer)', year: 'Année', legend: 'Carte des formations et tournées de Raouf Tchakondo' }
      : { eu: 'EUROPE', af: 'WEST AFRICA', tours: 'Places without a date (to be confirmed)', year: 'Year', legend: 'Map of Raouf Tchakondo’s training and tours' };
  const hasUndated = C.places.some((p) => p.year == null);
  return `<div class="map" data-map>
    <svg viewBox="-10 -10 ${W + 20} ${H + 20}" role="img" aria-label="${esc(labels.legend)}">
      <g class="grid">${grid}</g>
      <text class="zone" x="${x(-2)}" y="${y(47)}">${labels.eu}</text>
      <text class="zone" x="${x(-19)}" y="${y(19)}">${labels.af}</text>
      ${pts}
    </svg>
    <div class="map-ctrl">
      <label for="map-year-${ctx.lang}">${labels.year} <output data-map-out>2026</output></label>
      <input id="map-year-${ctx.lang}" type="range" min="1998" max="2026" step="1" value="2026" data-map-year>
      ${hasUndated ? `<label class="check"><input type="checkbox" checked data-map-tours> ${esc(labels.tours)}</label>` : ''}
    </div>
  </div>`;
}

function field(label, input, { req = false, hint = '' } = {}) {
  return `<label class="field"><span>${esc(label)}${req ? ' <abbr title="obligatoire">*</abbr>' : ''}</span>${input}${hint ? `<small>${esc(hint)}</small>` : ''}</label>`;
}

function bookingForm(ctx, preset = '') {
  const f = ctx.p.contact;
  const opts = (o) => Object.entries(o).map(([k, v]) => `<option value="${k}"${k === preset ? ' selected' : ''}>${esc(v)}</option>`).join('');
  const pieces = `<option value="">${esc(f.pieceNone)}</option>` + C.creations.map((c) => `<option value="${c.slug}">${esc(c.title)}</option>`).join('');
  return `<form class="form" data-mailform data-to="${esc(config.email)}" data-subject="Booking">
    <div class="grid-2">
      ${field(f.type, `<select name="${esc(f.type)}" data-key="type" required>${opts(f.types)}</select>`, { req: true })}
      ${field(f.piece, `<select name="${esc(f.piece)}" data-key="piece">${pieces}</select>`)}
      ${field(f.name, `<input name="${esc(f.name)}" autocomplete="name" required>`, { req: true })}
      ${field(f.org, `<input name="${esc(f.org)}" autocomplete="organization">`)}
      ${field(f.email, `<input type="email" name="${esc(f.email)}" autocomplete="email" required>`, { req: true })}
      ${field(f.phone, `<input type="tel" name="${esc(f.phone)}" autocomplete="tel">`)}
      ${field(f.dates, `<input name="${esc(f.dates)}">`)}
      ${field(f.place, `<input name="${esc(f.place)}">`)}
      ${field(f.budget, `<select name="${esc(f.budget)}">${f.budgets.map((b) => `<option>${esc(b)}</option>`).join('')}</select>`)}
    </div>
    ${field(f.message, `<textarea name="${esc(f.message)}" rows="5" required></textarea>`, { req: true })}
    <button class="btn" type="submit">${esc(ctx.t.send)}</button>
    <p class="form-status" role="status" aria-live="polite" data-sent="${esc(ctx.t.formSent)} ${esc(config.email)}"></p>
  </form>`;
}

// ---------- données structurées ----------

function jsonLd(obj) {
  return `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;
}

const personLd = (lang) => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Raouf Tchakondo',
  jobTitle: lang === 'fr' ? 'Danseur, chorégraphe et pédagogue' : 'Dancer, choreographer and teacher',
  birthPlace: { '@type': 'Place', name: 'Lomé, Togo' },
  nationality: [{ '@type': 'Country', name: 'Togo' }, { '@type': 'Country', name: 'France' }],
  url: config.siteUrl + '/' + (lang === 'en' ? 'en/' : ''),
  image: config.siteUrl + '/assets/img/sable-1280.webp',
  description: C.bio[lang].short,
  alumniOf: [{ '@type': 'EducationalOrganization', name: 'École des Sables' }, { '@type': 'Organization', name: 'Centre national de la danse' }],
  memberOf: { '@type': 'DanceGroup', name: 'Aské Danse' },
});

const danceGroupLd = (lang) => ({
  '@context': 'https://schema.org',
  '@type': 'DanceGroup',
  name: 'Aské Danse',
  foundingDate: '2005',
  foundingLocation: { '@type': 'Place', name: 'Lomé, Togo' },
  founder: { '@type': 'Person', name: 'Raouf Tchakondo' },
  url: config.siteUrl + '/' + pathOf(lang, 'aske'),
});

const eventLd = (lang) =>
  C.agenda
    .filter((e) => !e.demo)
    .map((e) => ({
      '@context': 'https://schema.org',
      '@type': e.type === 'stage' ? 'EducationEvent' : 'DanceEvent',
      name: e[lang],
      startDate: e.date,
      endDate: e.end || e.date,
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: { '@type': 'Place', name: e.venue || e.city, address: `${e.city}, ${e.country}` },
      performer: { '@type': 'Person', name: 'Raouf Tchakondo' },
      organizer: { '@type': 'DanceGroup', name: 'Aské Danse', url: config.siteUrl },
    }));

const videoLd = (lang) =>
  Object.values(C.videos).map((v) => ({
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: tr(v.title, lang),
    description: tr(v.title, lang),
    thumbnailUrl: `https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${v.id}`,
    uploadDate: '2015-01-01',
  }));

// ---------- gabarit ----------

const ICONS = {
  moon: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/></svg>',
  wa: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1.1 2.7.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>',
};

const navShape = { bio: 'circle', creations: 'triangle', langage: 'spiral', aske: 'hexagon', transmission: 'losange', collaborations: 'square', presse: 'eye' };

function layout(ctx, { title, description, body, ld = [], bodyClass = '' }) {
  const { t, lang } = ctx;
  const fullTitle = ctx.route === 'home' ? title : `${title} — Raouf Tchakondo`;
  const canonical = `${config.siteUrl}/${ctx.path}`;
  const altUrl = `${config.siteUrl}/${ctx.altPath}`;
  const frUrl = lang === 'fr' ? canonical : altUrl;
  const enUrl = lang === 'en' ? canonical : altUrl;
  const next3 = upcoming().slice(0, 3);
  const navItems = C.nav
    .map((r) => `<li><a href="${ctx.href(r)}"${r === ctx.route ? ' aria-current="page"' : ''}><span class="n">${solid(navShape[r])}</span>${esc(t.pages[r])}</a></li>`)
    .join('');
  const wa = config.whatsapp
    ? `<a class="wa" href="https://wa.me/${config.whatsapp}" target="_blank" rel="noopener" aria-label="${esc(t.whatsapp)}">${ICONS.wa}</a>`
    : `<a class="wa" href="${ctx.href('contact')}" aria-label="${esc(t.whatsapp)}">${ICONS.wa}</a>`;

  return `<!doctype html>
<html lang="${lang}" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="fr" href="${frUrl}">
<link rel="alternate" hreflang="en" href="${enUrl}">
<link rel="alternate" hreflang="x-default" href="${frUrl}">
<meta name="theme-color" content="#f7ecdc">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Raouf Tchakondo">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${config.siteUrl}/assets/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="${lang === 'fr' ? 'fr_FR' : 'en_GB'}">
<meta property="og:locale:alternate" content="${lang === 'fr' ? 'en_GB' : 'fr_FR'}">
<meta name="twitter:card" content="summary_large_image">
${config.preview ? '<meta name="robots" content="noindex">' : ''}
<link rel="icon" href="${ctx.asset('favicon.svg')}" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@112..125,500..900&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&display=swap">
<link rel="stylesheet" href="${ctx.asset('style.css')}">
<script>(function(){var d=document.documentElement;try{var s=localStorage.getItem('rt-theme');if(s)d.dataset.theme=s;}catch(e){}var c=navigator.connection;if(c&&(c.saveData||/(^|-)(2g|3g)$/.test(c.effectiveType||'')))d.classList.add('lite');d.classList.add('js');})();</script>
${ld.map(jsonLd).join('\n')}
</head>
<body class="${bodyClass}">
<a class="skip" href="#main">${esc(t.skip)}</a>
${config.preview ? `<div class="preview-bar" role="note">${esc(t.preview)}</div>` : ''}
<header class="top">
  <a class="brand" href="${ctx.href('home')}" aria-label="Raouf Tchakondo — ${esc(t.home)}"><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="18" fill="var(--sun)"/><path d="M20 5 L34 29 H6 Z" fill="var(--terracotta)"/></svg><span>Raouf Tchakondo</span></a>
  <div class="top-actions">
    <a class="lang" href="${ctx.root}${ctx.altPath}" hreflang="${ctx.altLang}" lang="${ctx.altLang}">${ctx.altLang.toUpperCase()}<span class="sr"> — ${esc(t.otherLang)}</span></a>
    <button type="button" class="icon-btn" data-theme-toggle aria-label="${esc(t.theme)}">${ICONS.moon}</button>
    <button type="button" class="menu-btn" aria-expanded="false" aria-controls="menu" data-menu-open>${esc(t.menu)}</button>
  </div>
</header>
<nav id="menu" class="menu" aria-label="${esc(t.menu)}" hidden>
  <div class="menu-inner">
    <button type="button" class="menu-close" data-menu-close>${esc(t.close)}</button>
    <ol class="menu-list">${navItems}</ol>
    <div class="menu-foot">
      <a href="${ctx.href('contact')}">${esc(t.pages.contact)}</a>
      <a href="mailto:${config.email}">${config.email}</a>
      <a href="${ctx.root}${ctx.altPath}" hreflang="${ctx.altLang}" lang="${ctx.altLang}">${esc(t.otherLang)}</a>
    </div>
  </div>
</nav>
<svg class="trace" aria-hidden="true"><path/></svg>
<main id="main" tabindex="-1">
${body}
</main>
<div class="kente" aria-hidden="true"></div>
<footer class="foot">
  <div class="foot-grid">
    <section>
      <h2 class="eyebrow">${esc(t.nextDates)}</h2>
      ${agendaList(ctx, next3, { compact: true })}
      <a class="arrow" href="${ctx.href('transmission')}#agenda">${esc(t.allDates)}</a>
    </section>
    <section>
      <h2 class="eyebrow">${esc(t.newsletter)}</h2>
      <p>${esc(t.newsletterText)}</p>
      <form class="news" data-mailform data-to="${esc(config.email)}" data-subject="Newsletter">
        <label class="sr" for="nl-${lang}">${esc(t.email)}</label>
        <div class="news-row"><input id="nl-${lang}" type="email" name="E-mail" placeholder="${esc(t.email)}" autocomplete="email" required><button class="btn" type="submit">${esc(t.subscribe)}</button></div>
        <fieldset class="news-aud"><legend>${esc(t.audience)}</legend>
          <label class="check"><input type="radio" name="Segment" value="pro" checked> ${esc(t.audiencePro)}</label>
          <label class="check"><input type="radio" name="Segment" value="eleve"> ${esc(t.audienceStudent)}</label>
        </fieldset>
        <p class="form-status" role="status" aria-live="polite" data-sent="${esc(t.formSent)} ${esc(config.email)}"></p>
      </form>
    </section>
    <section>
      <h2 class="eyebrow">${esc(t.booking)}</h2>
      <p><a href="mailto:${config.email}">${config.email}</a></p>
      <p><a class="arrow" href="${ctx.href('contact')}">${esc(t.pages.contact)}</a></p>
      <h2 class="eyebrow">${esc(t.follow)}</h2>
      <ul class="social">${config.social.map((s) => `<li><a href="${s.url}" rel="noopener" target="_blank">${esc(s.name)}</a></li>`).join('')}</ul>
      <p><a href="${ctx.root}${ctx.altPath}" hreflang="${ctx.altLang}" lang="${ctx.altLang}">${esc(ctx.lang === 'fr' ? 'FR · EN' : 'EN · FR')} — ${esc(t.otherLang)}</a></p>
    </section>
  </div>
  <p class="legal">© ${new Date().getFullYear()} Raouf Tchakondo · Aské Danse. ${esc(t.rights)}</p>
</footer>
${wa}
<script src="${ctx.asset('main.js')}" defer></script>
</body>
</html>
`;
}

// En-tête de rubrique : bande colorée + photo dans une forme géométrique (ou composition de formes)
const MASKS = { circle: 'mask-circle', losange: 'mask-losange', triangle: 'mask-circle', square: 'mask-arch', hexagon: 'mask-hexagon', eye: 'mask-circle', spiral: 'mask-circle' };

function pageHead(ctx, title, lead, { shapeName = 'circle', image = null, color = 'sun', extra = '' } = {}) {
  const visual = image
    ? `<div class="ph-visual">
        <span class="ph-disc"></span>
        ${photo(ctx, image, { sizes: '(min-width: 900px) 40vw, 90vw', cls: `ph-photo ${MASKS[shapeName] || 'mask-circle'}`, eager: true })}
        <span class="ph-glyph">${shape(shapeName, 'draw')}</span>
      </div>`
    : `<div class="ph-visual">${composition()}</div>`;
  return `
<header class="page-head band-${color}" data-trace>
  <div class="ph-inner">
    <div class="ph-text">
      <p class="eyebrow">Raouf Tchakondo</p>
      <h1>${esc(title)}</h1>
      ${lead ? `<p class="lead">${esc(lead)}</p>` : ''}
      ${extra}
    </div>
    ${visual}
  </div>
</header>`;
}

// ---------- pages ----------

function home(ctx) {
  const p = ctx.p.home;
  const featured = C.creations.filter((c) => c.featured);
  const body = `
<div class="intro" aria-hidden="true"><i></i></div>
<section class="hero" data-trace>
  <div class="hero-text">
    <p class="eyebrow">${esc(ctx.t.role)} · Lomé</p>
    <h1 class="display">Raouf <span>Tchakondo</span></h1>
    <p class="signature">${ctx.t.signature.map(esc).join('<br>')}</p>
    <div class="cta">
      <a class="btn" href="${ctx.href('creations')}">${esc(p.ctaWorks)}</a>
      <a class="btn ghost" href="${ctx.href('contact')}?type=tournee">${esc(p.ctaBook)}</a>
    </div>
  </div>
  <div class="hero-visual">
    <span class="hv-sun"></span>
    <span class="hv-ring">${shape('circle', 'draw')}</span>
    ${photo(ctx, 'sable-carre', { cls: 'hv-portrait mask-circle', eager: true, sizes: '(min-width: 900px) 34vw, 72vw' })}
    ${photo(ctx, 'plage-lome', { cls: 'hv-beach mask-losange', sizes: '(min-width: 900px) 22vw, 46vw' })}
    <span class="hv-tri">${solid('triangle')}</span>
  </div>
</section>
${marquee(ctx)}

<section class="section proofs" data-trace aria-labelledby="proofs-h">
  <h2 id="proofs-h" class="eyebrow">${esc(p.proofTitle)}</h2>
  <ul class="proof-list">${C.proofs[ctx.lang]
    .map((x, i) => `<li class="reveal c-${['terracotta', 'indigo', 'sun', 'ochre'][i % 4]}" style="--i:${i}"><strong>${esc(x.k)}</strong><span>${esc(x.v)}</span></li>`)
    .join('')}</ul>
</section>

<section class="quote-band" data-trace>
  <figure>
    <blockquote><p>« ${esc(C.quote[ctx.lang])} »</p></blockquote>
    <figcaption>— ${esc(p.quoteSrc)}</figcaption>
  </figure>
  <span class="qb-shapes" aria-hidden="true">${solid('circle')}${solid('triangle')}${solid('losange')}${solid('square')}</span>
</section>

<section class="section" data-trace aria-labelledby="gal-h">
  <div class="section-head"><h2 id="gal-h" class="h2">${esc(p.galleryTitle)}</h2><p class="lead">${esc(p.galleryText)}</p></div>
  <div class="mosaic">
    ${[
      ['loose-control', 1], ['atelier', 0],
      ['tente', 0], ['joie', 1],
      ['isis-antigone', 1], ['plage-lome', 0],
    ]
      .map(([k, wide]) => photo(ctx, k, { cls: `${wide ? 'm-wide' : 'm-narrow'} reveal`, sizes: wide ? '(min-width: 760px) 60vw, 100vw' : '(min-width: 760px) 30vw, 100vw' }))
      .join('')}
  </div>
</section>

<section class="section" data-trace aria-labelledby="feat-h">
  <div class="section-head"><h2 id="feat-h" class="h2">${esc(p.featured)}</h2><a class="arrow" href="${ctx.href('creations')}">${esc(ctx.t.seeAll)}</a></div>
  <ul class="cards">${featured.map((c) => creationCard(ctx, c)).join('')}</ul>
</section>

<section class="section split video-sec" data-trace aria-labelledby="vid-h">
  <div>
    <h2 id="vid-h" class="h2">${esc(p.videoTitle)}</h2>
    <p class="lead">${esc(p.videoText)}</p>
    <a class="arrow" href="${ctx.href('transmission')}">${esc(ctx.t.pages.transmission)}</a>
  </div>
  ${video(ctx, 'djola')}
</section>

<section class="light-band" data-trace>
  <div class="lb-inner">
    <p class="eyebrow">${esc(p.lightKicker)}</p>
    <h2 class="h2">${esc(p.lightTitle)}</h2>
    <p class="lead">${esc(p.lightText)}</p>
    <a class="btn light" href="${ctx.href('aske')}">${esc(p.lightCta)}</a>
  </div>
  <span class="lb-rays" aria-hidden="true"></span>
</section>

<section class="section split" data-trace aria-labelledby="map-h">
  <div>
    <h2 id="map-h" class="h2">${esc(p.mapTitle)}</h2>
    <p class="lead">${esc(p.mapText)}</p>
    <a class="arrow" href="${ctx.href('bio')}#parcours">${esc(p.mapLink)}</a>
  </div>
  ${mapSvg(ctx)}
</section>

<section class="section" data-trace aria-labelledby="paths-h">
  <h2 id="paths-h" class="h2">${esc(p.pathsTitle)}</h2>
  <ul class="paths">${p.paths
    .map(
      (x, i) =>
        `<li class="reveal"><a href="${ctx.href(x.to)}"><span class="p-glyph c-${['terracotta', 'indigo', 'sun', 'ochre', 'terracotta'][i]}">${solid(
          ['circle', 'triangle', 'losange', 'square', 'hexagon'][i]
        )}</span><strong>${esc(x.who)}</strong><span>${esc(x.what)}</span></a></li>`
    )
    .join('')}</ul>
</section>

<section class="section" data-trace aria-labelledby="dates-h">
  <div class="section-head"><h2 id="dates-h" class="h2">${esc(ctx.t.nextDates)}</h2><a class="arrow" href="${ctx.href('transmission')}#agenda">${esc(ctx.t.allDates)}</a></div>
  ${agendaList(ctx, upcoming().slice(0, 3))}
</section>

<section class="section" data-trace aria-labelledby="places-h">
  <h2 id="places-h" class="eyebrow">${esc(p.placesTitle)}</h2>
  <ul class="logos"><li>École des Sables</li><li>Centre national de la danse</li><li>Nyanga Zam</li><li>Aské Danse</li></ul>
  <p class="muted small">${esc(p.placesNote)}</p>
</section>`;
  return layout(ctx, { title: p.title, description: p.description, body, ld: [personLd(ctx.lang), ...videoLd(ctx.lang), ...eventLd(ctx.lang)], bodyClass: 'home' });
}

function bioPage(ctx) {
  const p = ctx.p.bio;
  const b = C.bio[ctx.lang];
  const body = `
${pageHead(ctx, p.title, p.lead, { image: 'portrait', shapeName: 'circle', color: 'sun' })}
<section class="section split" data-trace>
  ${photo(ctx, 'atelier', { sizes: '(min-width: 860px) 50vw, 100vw', cls: 'tilt' })}
  <div>
    <h2 class="eyebrow">${esc(p.shortTitle)}</h2>
    <p class="big-serif">${esc(b.short)}</p>
  </div>
</section>

<section class="section" data-trace aria-labelledby="tl-h">
  <h2 id="tl-h" class="h2">${esc(p.timelineTitle)}</h2>
  <ol class="timeline" tabindex="0" aria-label="${esc(p.timelineTitle)}">${C.timeline
    .map(
      (e, i) =>
        `<li class="reveal c-${e.color}" style="--i:${i % 4}"><span class="tl-year">${e.year}</span><span class="tl-place">${esc(
          ctx.lang === 'en' && e.placeEn ? e.placeEn : e.place
        )}</span><p>${esc(e[ctx.lang])}</p></li>`
    )
    .join('')}</ol>
</section>

<section class="section" data-trace aria-labelledby="lin-h">
  <h2 id="lin-h" class="h2">${esc(p.lineageTitle)}</h2>
  <p class="lead">${esc(p.lineageText)}</p>
  <ol class="lineage">${C.lineage
    .map((n, i) => `<li class="reveal" style="--i:${i}"><span class="c-${['sun', 'ochre', 'indigo', 'terracotta'][i]}">${solid(['circle', 'triangle', 'losange', 'hexagon'][i])}</span>${esc(n)}</li>`)
    .join('')}<li class="reveal self" style="--i:4"><span class="c-terracotta">${solid('spiral')}${shape('spiral')}</span>Raouf Tchakondo</li></ol>
</section>

<section class="section prose" id="parcours" data-trace>
  <h2 class="h2">${esc(p.longTitle)}</h2>
  ${b.long.map((x) => `<p>${esc(x)}</p>`).join('')}
</section>

<section class="section split" data-trace aria-labelledby="map2-h">
  <div>
    <h2 id="map2-h" class="h2">${esc(ctx.p.home.mapTitle)}</h2>
    <p class="lead">${esc(ctx.p.home.mapText)}</p>
    ${photo(ctx, 'plage-lome', { sizes: '(min-width: 860px) 45vw, 100vw' })}
  </div>
  ${mapSvg(ctx)}
</section>`;
  return layout(ctx, { title: p.title, description: p.description, body, ld: [personLd(ctx.lang)] });
}

function creationsPage(ctx) {
  const p = ctx.p.creations;
  const formats = [...new Set(C.creations.map((c) => c.format).filter(Boolean))];
  const years = [...new Set(C.creations.map((c) => c.year).filter(Boolean))].sort();
  const btn = (key, val, label, pressed = false) =>
    `<button type="button" data-filter="${key}" data-value="${val}" aria-pressed="${pressed}">${esc(label)}</button>`;
  const body = `
${pageHead(ctx, p.title, p.lead, { image: 'isis-antigone', shapeName: 'square', color: 'terracotta' })}
<section class="section" data-trace>
  <div class="filters" role="group" aria-label="${esc(ctx.t.filterFormat)}">
    <span class="eyebrow">${esc(ctx.t.filterFormat)}</span>
    ${btn('format', '', ctx.t.filterAll, true)}
    ${formats.map((f) => btn('format', f, ctx.t.formats[f])).join('')}
  </div>
  ${
    years.length
      ? `<div class="filters" role="group" aria-label="${esc(ctx.t.filterYear)}"><span class="eyebrow">${esc(ctx.t.filterYear)}</span>${btn('year', '', ctx.t.filterAll, true)}${years
          .map((y) => btn('year', y, y))
          .join('')}</div>`
      : ''
  }
  <ul class="cards" data-filterable>${C.creations.map((c) => creationCard(ctx, c)).join('')}</ul>
</section>`;
  return layout(ctx, { title: p.title, description: p.description, body });
}

function creationPage(ctx, c) {
  const t = ctx.t;
  const syn = tr(c.synopsis, ctx.lang);
  const cast = tr(c.cast, ctx.lang);
  const tours = tr(c.tours, ctx.lang);
  const dates = upcoming().filter((e) => e.piece === c.slug);
  const facts = `<dl class="facts">
    <div><dt>${esc(t.year)}</dt><dd>${c.year ? esc(c.year) : todo(ctx)}</dd></div>
    <div><dt>${esc(t.format)}</dt><dd>${c.format ? esc(t.formats[c.format]) : todo(ctx)}</dd></div>
    <div><dt>${esc(t.duration)}</dt><dd>${c.duration ? esc(c.duration) : todo(ctx)}</dd></div>
    ${tours ? `<div><dt>${esc(t.tours)}</dt><dd>${esc(tours)}</dd></div>` : ''}
  </dl>
  <a class="btn" href="${ctx.href('contact')}?type=tournee&piece=${c.slug}">${esc(t.program)}</a>`;
  const head = c.image
    ? pageHead(ctx, c.title, null, { image: c.image, shapeName: c.shape, color: c.color, extra: facts })
    : `<header class="page-head band-${c.color}" data-trace><div class="ph-inner">
        <div class="ph-text"><p class="eyebrow"><a href="${ctx.href('creations')}">← ${esc(t.back)}</a></p><h1>${esc(c.title)}</h1>${facts}</div>
        <div class="ph-visual piece-glyph">${solid(c.shape)}${shape(c.shape, 'draw')}</div>
      </div></header>`;
  const body = `
${head}
<section class="section split" data-trace>
  <div class="prose">
    <h2 class="h2">${esc(t.synopsis)}</h2><p class="big-serif">${syn ? esc(syn) : todo(ctx)}</p>
    <h2 class="eyebrow">${esc(t.cast)}</h2><p>${cast ? esc(cast) : todo(ctx)}</p>
  </div>
  <div>
    ${media(ctx, { shapeName: c.shape, label: `${t.teaser} — ${t.videoSoon}`, color: c.color === 'sun' ? 'terracotta' : 'sun' })}
    <h2 class="eyebrow gap">${esc(t.techSheet)}</h2>
    <p class="muted">${esc(t.techSheetSoon)}</p>
    <h2 class="eyebrow gap">${esc(t.tourDates)}</h2>
    ${agendaList(ctx, dates)}
  </div>
</section>
<section class="section" data-trace>
  <div class="section-head"><h2 class="h2">${esc(t.pages.creations)}</h2><a class="arrow" href="${ctx.href('creations')}">${esc(t.seeAll)}</a></div>
  <ul class="cards">${C.creations.filter((o) => o !== c).slice(0, 3).map((o) => creationCard(ctx, o)).join('')}</ul>
</section>`;
  return layout(ctx, { title: c.title, description: `${c.title} — ${syn || ctx.p.creations.description}`, body });
}

function langagePage(ctx) {
  const p = ctx.p.langage;
  const body = `
${pageHead(ctx, p.title, p.lead, { color: 'sun' })}
<section class="quote-band" data-trace>
  <figure>
    <blockquote><p>« ${esc(C.quote[ctx.lang])} »</p></blockquote>
    <figcaption>— ${esc(ctx.p.home.quoteSrc)}</figcaption>
  </figure>
  <span class="qb-shapes" aria-hidden="true">${solid('circle')}${solid('triangle')}${solid('losange')}${solid('square')}</span>
</section>
<section class="section split" data-trace>
  <div class="prose">${p.intro.map((x) => `<p class="big-serif">${esc(x)}</p>`).join('')}</div>
  ${photo(ctx, 'sable', { sizes: '(min-width: 860px) 50vw, 100vw', cls: 'tilt' })}
</section>
<section class="section" data-trace aria-labelledby="src-h">
  <h2 id="src-h" class="h2">${esc(p.moduleTitle)}</h2>
  <p class="muted">${esc(p.moduleHint)}</p>
  <div class="sources" data-sources>
    <div class="src-tabs" role="tablist" aria-label="${esc(p.moduleTitle)}">
      ${C.sources
        .map(
          (s, i) =>
            `<button type="button" role="tab" id="tab-${s.id}" aria-controls="panel-${s.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${solid(s.shape)}<span>${esc(
              ctx.lang === 'en' && s.nameEn ? s.nameEn : s.name
            )}</span></button>`
        )
        .join('')}
    </div>
    ${C.sources
      .map(
        (s, i) => `<div class="src-panel" role="tabpanel" id="panel-${s.id}" aria-labelledby="tab-${s.id}"${i === 0 ? '' : ' hidden'}>
        <div class="src-figure c-${['terracotta', 'sun', 'indigo', 'ochre', 'terracotta'][i % 5]}">${shape(s.shape, 'draw')}</div>
        <div>
          <p class="eyebrow">${esc(s[ctx.lang].origin)}</p>
          <h3 class="h3">${esc(ctx.lang === 'en' && s.nameEn ? s.nameEn : s.name)}</h3>
          <p class="big-serif">${esc(s[ctx.lang].text)}</p>
        </div>
      </div>`
      )
      .join('')}
  </div>
</section>
<section class="section split video-sec" data-trace>
  <div><h2 class="h2">${esc(p.videoTitle)}</h2><p class="lead">${esc(ctx.p.home.videoText)}</p></div>
  ${video(ctx, 'djola')}
</section>`;
  return layout(ctx, { title: p.title, description: p.description, body, ld: videoLd(ctx.lang) });
}

function askePage(ctx) {
  const p = ctx.p.aske;
  const body = `
${pageHead(ctx, p.title, p.lead, { image: 'releve', shapeName: 'hexagon', color: 'ochre' })}
<section class="light-band" data-trace>
  <div class="lb-inner">
    <p class="eyebrow">Aské</p>
    <h2 class="h2">${esc(ctx.p.home.lightTitle)}</h2>
  </div>
  <span class="lb-rays" aria-hidden="true"></span>
</section>
<section class="section split" data-trace>
  <div class="prose">${p.history.map((x) => `<p class="big-serif">${esc(x)}</p>`).join('')}</div>
  ${photo(ctx, 'plage-lome', { sizes: '(min-width: 860px) 50vw, 100vw', cls: 'tilt' })}
</section>
<section class="section" data-trace aria-labelledby="rel-h">
  <h2 id="rel-h" class="h2">${esc(p.relTitle)}</h2>
  <div class="split">
    ${photo(ctx, 'releve', { sizes: '(min-width: 860px) 45vw, 100vw' })}
    <ul class="paths">${p.rel
      .map(
        (r, i) =>
          `<li class="reveal"><div><span class="p-glyph c-${['sun', 'terracotta'][i]}">${solid(['circle', 'triangle'][i])}</span><strong>${esc(r.name)}</strong><span>${esc(r.text)}</span></div></li>`
      )
      .join('')}</ul>
  </div>
</section>
<section class="section" data-trace aria-labelledby="dan-h">
  <h2 id="dan-h" class="h2">${esc(p.dancersTitle)}</h2>
  <p class="muted">${esc(p.dancersNote)}</p>
  <ul class="portraits">${['circle', 'triangle', 'losange', 'square']
    .map((s, i) => `<li class="reveal">${media(ctx, { ratio: '3/4', shapeName: s, label: ctx.t.videoSoon, color: ['terracotta', 'sun', 'indigo', 'ochre'][i] })}</li>`)
    .join('')}</ul>
</section>
<section class="section" data-trace aria-labelledby="rep-h">
  <div class="section-head"><h2 id="rep-h" class="h2">${esc(p.repTitle)}</h2><a class="arrow" href="${ctx.href('creations')}">${esc(ctx.t.seeAll)}</a></div>
  <ul class="cards">${C.creations.filter((c) => c.format !== 'theatre').map((c) => creationCard(ctx, c)).join('')}</ul>
</section>
<section class="section callout c-terracotta" data-trace>
  <h2 class="h2">${esc(p.recruitTitle)}</h2>
  <p class="lead">${esc(p.recruitText)}</p>
  <a class="btn light" href="mailto:${config.email}?subject=${encodeURIComponent('Candidature Aské Danse')}">${esc(p.recruitCta)}</a>
</section>`;
  return layout(ctx, { title: p.title, description: p.description, body, ld: [danceGroupLd(ctx.lang)] });
}

function transmissionPage(ctx) {
  const p = ctx.p.transmission;
  const stages = upcoming().filter((e) => e.type === 'stage');
  const countries = [...new Set(upcoming().map((e) => (ctx.lang === 'en' && e.countryEn ? e.countryEn : e.country)))];
  const sessions = stages
    .map(
      (e) =>
        `<option value="${e.id}" data-price="${e.price}" data-currency="${e.currency}" data-left="${e.left}"${e.left === 0 ? ' disabled' : ''}>${esc(e[ctx.lang])} — ${esc(e.city)}, ${esc(
          fmtRange(e.date, e.end, ctx.lang)
        )} — ${esc(fmtPrice(e.price, e.currency, ctx.lang))}${e.demo ? ` (${esc(ctx.t.example)})` : ''}</option>`
    )
    .join('');
  const body = `
${pageHead(ctx, p.title, p.lead, { image: 'tente', shapeName: 'square', color: 'terracotta' })}
<section class="section" data-trace>
  <ul class="offers">${p.offers
    .map((o, i) => `<li class="reveal c-${['terracotta', 'indigo', 'ochre'][i]}" style="--i:${i}">${solid(['losange', 'circle', 'square'][i])}<h2 class="h3">${esc(o.t)}</h2><p>${esc(o.d)}</p></li>`)
    .join('')}</ul>
</section>
<section class="section pedagogy" data-trace aria-labelledby="peda-h">
  <div class="split">
    ${photo(ctx, 'loose-control', { sizes: '(min-width: 860px) 50vw, 100vw', cls: 'tilt' })}
    <div>
      <p class="eyebrow">${esc(p.pedaKicker)}</p>
      <h2 id="peda-h" class="h2 peda-quote">« ${esc(p.pedaQuote)} »</h2>
      ${p.pedaText.map((x) => `<p class="big-serif">${esc(x)}</p>`).join('')}
    </div>
  </div>
  <h3 class="eyebrow gap">${esc(p.pedaBasicsTitle)}</h3>
  <ol class="basics">${p.pedaBasics
    .map((b, i) => `<li class="reveal c-${['sun', 'terracotta', 'indigo', 'ochre'][i]}" style="--i:${i}">${solid(['square', 'triangle', 'losange', 'circle'][i])}<span>${esc(b)}</span></li>`)
    .join('')}</ol>
  <p class="lead">${esc(p.pedaFor)}</p>
</section>
<section class="section split video-sec" data-trace>
  ${photo(ctx, 'joie', { sizes: '(min-width: 860px) 50vw, 100vw' })}
  ${video(ctx, 'djola')}
</section>
<section class="section" id="agenda" data-trace aria-labelledby="ag-h">
  <div class="section-head">
    <h2 id="ag-h" class="h2">${esc(p.agendaTitle)}</h2>
    <label class="field inline"><span>${esc(ctx.t.country)}</span><select data-country-filter><option value="">${esc(ctx.t.allCountries)}</option>${countries
      .map((c) => `<option>${esc(c)}</option>`)
      .join('')}</select></label>
  </div>
  <div data-agenda>${agendaList(ctx, upcoming())}</div>
</section>
<section class="section form-sec" id="inscription" data-trace aria-labelledby="ins-h">
  <h2 id="ins-h" class="h2">${esc(p.formTitle)}</h2>
  <form class="form" data-mailform data-stageform data-to="${esc(config.email)}" data-subject="Inscription stage">
    <div class="grid-2">
      ${field(p.session, `<select name="${esc(p.session)}" required data-session>${sessions}</select>`, { req: true })}
      ${field(p.qty, `<input type="number" name="${esc(p.qty)}" min="1" max="10" value="1" required data-qty>`, { req: true })}
      ${field(p.name, `<input name="${esc(p.name)}" autocomplete="name" required>`, { req: true })}
      ${field('E-mail', `<input type="email" name="E-mail" autocomplete="email" required>`, { req: true })}
      ${field(p.phone, `<input type="tel" name="${esc(p.phone)}" autocomplete="tel" required>`, { req: true })}
      ${field(p.level, `<select name="${esc(p.level)}">${p.levels.map((l) => `<option>${esc(l)}</option>`).join('')}</select>`)}
    </div>
    <fieldset class="pay">
      <legend>${esc(p.pay)}</legend>
      <label class="pay-opt"><input type="radio" name="${esc(p.pay)}" value="T-Money" checked><span>${esc(p.payMomo)}<b>T-Money</b></span></label>
      <label class="pay-opt"><input type="radio" name="${esc(p.pay)}" value="Flooz"><span>${esc(p.payMomo)}<b>Flooz</b></span></label>
      <label class="pay-opt"><input type="radio" name="${esc(p.pay)}" value="Moov Money"><span>${esc(p.payMomo)}<b>Moov Money</b></span></label>
      <label class="pay-opt"><input type="radio" name="${esc(p.pay)}" value="Carte"><span>${esc(p.payCard)}<b>Visa · Mastercard</b></span></label>
    </fieldset>
    <p class="total">${esc(p.total)} : <output data-total>—</output></p>
    <button class="btn" type="submit">${esc(p.submit)}</button>
    <p class="muted small">${esc(p.demoPay)}</p>
    <p class="form-status" role="status" aria-live="polite" data-sent="${esc(ctx.t.formSent)} ${esc(config.email)}"></p>
  </form>
</section>
<section class="section callout c-indigo" data-trace>
  <h2 class="h2">${esc(p.schoolTitle)}</h2>
  <p class="lead">${esc(p.schoolText)}</p>
  <a class="btn light" href="${ctx.href('contact')}?type=atelier">${esc(ctx.t.pages.contact)}</a>
</section>`;
  return layout(ctx, { title: p.title, description: p.description, body, ld: [...videoLd(ctx.lang), ...eventLd(ctx.lang)] });
}

function collaborationsPage(ctx) {
  const p = ctx.p.collaborations;
  const cases = p.cases
    .map(
      (c) => `<li class="case reveal">
      ${c.image ? photo(ctx, c.image, { sizes: '(min-width: 860px) 45vw, 100vw' }) : `<div class="case-visual c-${c.color}">${solid('circle')}<b>200</b></div>`}
      <p class="eyebrow">${esc(c.k)}</p>
      <h3 class="h3">${c.to ? `<a href="${ctx.href('creations', c.to)}">${esc(c.t)}</a>` : esc(c.t)}</h3>
      <p>${esc(c.d)}</p>
    </li>`
    )
    .join('');
  const body = `
${pageHead(ctx, p.title, p.lead, { image: 'isis-antigone', shapeName: 'square', color: 'indigo' })}
<section class="section" data-trace>
  <ul class="offers four">${p.fields
    .map((o, i) => `<li class="reveal c-${['terracotta', 'sun', 'indigo', 'ochre'][i]}" style="--i:${i}">${solid(['square', 'circle', 'triangle', 'losange'][i])}<h2 class="h3">${esc(o.t)}</h2><p>${esc(o.d)}</p></li>`)
    .join('')}</ul>
</section>
<section class="section" data-trace>
  <h2 class="h2">${esc(p.casesTitle)}</h2>
  <ul class="cases">${cases}</ul>
</section>
<section class="section form-sec" id="brief" data-trace aria-labelledby="brief-h">
  <h2 id="brief-h" class="h2">${esc(p.briefTitle)}</h2>
  ${bookingForm(ctx, 'collaboration')}
</section>`;
  return layout(ctx, { title: p.title, description: p.description, body });
}

function pressePage(ctx) {
  const p = ctx.p.presse;
  const b = C.bio[ctx.lang];
  const credits = Object.entries(C.images)
    .filter(([, im]) => !im.hidden)
    .map(([k, im]) => `<li>${im.url ? `<a href="${im.url}" rel="noopener" target="_blank">${esc(tr(im.alt, ctx.lang))}</a>` : esc(tr(im.alt, ctx.lang))} — © ${esc(im.credit)}</li>`)
    .join('');
  const body = `
${pageHead(ctx, p.title, p.lead, { image: 'cours', shapeName: 'eye', color: 'terracotta' })}
<section class="section split" data-trace>
  <div>
    <h2 class="h2">${esc(p.kitTitle)}</h2>
    <ul class="ticks">${p.kitItems.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
    <a class="btn" href="mailto:${config.pressEmail}?subject=${encodeURIComponent(ctx.lang === 'fr' ? 'Demande de kit presse' : 'Press kit request')}">${esc(p.kitCta)}</a>
    <p class="muted small">${esc(p.kitSoon)}</p>
  </div>
  ${photo(ctx, 'portrait', { sizes: '(min-width: 860px) 40vw, 100vw', cls: 'tilt' })}
</section>
<section class="section" data-trace>
  <div class="bio-box">
    <div class="section-head"><h2 class="h3">${esc(p.bioShort)}</h2><button type="button" class="btn-link" data-copy="#bio-short">${esc(ctx.t.copy)}</button></div>
    <p id="bio-short">${esc(b.short)}</p>
  </div>
  <div class="bio-box">
    <div class="section-head"><h2 class="h3">${esc(p.bioLong)}</h2><button type="button" class="btn-link" data-copy="#bio-long">${esc(ctx.t.copy)}</button></div>
    <div id="bio-long">${b.long.map((x) => `<p>${esc(x)}</p>`).join('')}</div>
  </div>
</section>
<section class="section" data-trace aria-labelledby="art-h">
  <h2 id="art-h" class="h2">${esc(p.articlesTitle)}</h2>
  <ul class="press-list">${p.articles
    .map((a) => `<li><strong>${esc(a.src)}</strong><a href="${a.url}" rel="noopener" target="_blank">${esc(a.t)}</a><span>${a.y ? esc(a.y) : ''}</span></li>`)
    .join('')}</ul>
</section>
<section class="section" data-trace aria-labelledby="ph-h">
  <h2 id="ph-h" class="h2">${esc(p.photosTitle)}</h2>
  <div class="press-photos">${['sable', 'loose-control', 'atelier', 'joie', 'tente', 'portrait', 'plage-lome', 'cours']
    .map((k) => photo(ctx, k, { sizes: '(min-width: 860px) 25vw, 50vw' }))
    .join('')}</div>
</section>
<section class="section" data-trace aria-labelledby="cr-h">
  <h2 id="cr-h" class="h3">${esc(p.creditsTitle)}</h2>
  <p class="muted">${esc(ctx.t.photosHd)}</p>
  <ul class="credits-list">${credits}</ul>
</section>
<section class="section callout c-sun" data-trace>
  <h2 class="h2">${esc(p.contactTitle)}</h2>
  <p class="lead"><a href="mailto:${config.pressEmail}">${config.pressEmail}</a></p>
</section>`;
  return layout(ctx, { title: p.title, description: p.description, body });
}

function contactPage(ctx) {
  const p = ctx.p.contact;
  const body = `
${pageHead(ctx, p.title, p.lead, { image: 'plage-lome', shapeName: 'circle', color: 'terracotta' })}
<section class="section form-sec" data-trace>
  ${bookingForm(ctx)}
</section>`;
  return layout(ctx, { title: p.title, description: p.description, body });
}

function notFound(ctx) {
  const body = `${pageHead(ctx, '404', ctx.lang === 'fr' ? 'Cette page n’existe pas.' : 'This page does not exist.', { color: 'sun' })}
<section class="section"><a class="btn" href="${ctx.href('home')}">${esc(ctx.t.home)}</a></section>`;
  return layout(ctx, { title: '404', description: '404', body });
}

// ---------- écriture ----------

async function write(rel, html) {
  const file = join(OUT, rel);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
}

async function clean() {
  // Supprime l'ancienne sortie générée (tout sauf _src)
  for (const e of await readdir(OUT)) if (e !== '_src') await rm(join(OUT, e), { recursive: true, force: true });
}

async function main() {
  await clean();
  const urls = [];
  for (const lang of LANGS) {
    const gen = [
      ['home', '', home],
      ['bio', '', bioPage],
      ['creations', '', creationsPage],
      ['langage', '', langagePage],
      ['aske', '', askePage],
      ['transmission', '', transmissionPage],
      ['collaborations', '', collaborationsPage],
      ['presse', '', pressePage],
      ['contact', '', contactPage],
      ...C.creations.map((c) => ['creations', c.slug, (ctx) => creationPage(ctx, c)]),
    ];
    for (const [route, sub, fn] of gen) {
      const ctx = makeCtx(lang, route, sub);
      await write(ctx.path + 'index.html', fn(ctx));
      urls.push({ loc: ctx.path, alt: ctx.altPath, lang });
    }
  }
  // 404 (GitHub Pages ne le sert qu'à la racine du domaine ; conservé pour le futur domaine dédié)
  await write('404.html', notFound(makeCtx('fr', 'home', '', '/')));

  await cp(join(SRC, 'assets'), join(OUT, 'assets'), { recursive: true });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map(
    (u) => `  <url><loc>${config.siteUrl}/${u.loc}</loc><xhtml:link rel="alternate" hreflang="${u.lang}" href="${config.siteUrl}/${u.loc}"/><xhtml:link rel="alternate" hreflang="${
      u.lang === 'fr' ? 'en' : 'fr'
    }" href="${config.siteUrl}/${u.alt}"/></url>`
  )
  .join('\n')}
</urlset>
`;
  await writeFile(join(OUT, 'sitemap.xml'), sitemap);
  await writeFile(join(OUT, 'robots.txt'), `User-agent: *\n${config.preview ? 'Disallow: /\n' : 'Allow: /\n'}Sitemap: ${config.siteUrl}/sitemap.xml\n`);
  console.log(`${urls.length} pages générées dans ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
