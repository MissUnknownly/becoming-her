/* BECOMING HER – Kern: Hilfsfunktionen, Speicherung, Domänenlogik, UI-Bausteine */

/* ---------- Hilfsfunktionen ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const nl2br = s => esc(s).replace(/\n/g, '<br>');
const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
const fmtNum = n => (Math.round(n * 10) / 10).toLocaleString('de-DE');
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

const D = {
  key(d = new Date()) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },
  parse(k) { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); },
  num(k) { const [y, m, d] = k.split('-').map(Number); return Math.round(Date.UTC(y, m - 1, d) / 864e5); },
  add(k, n) { const d = D.parse(k); d.setDate(d.getDate() + n); return D.key(d); },
  diff(a, b) { return D.num(b) - D.num(a); },
  wd(k) { return (D.parse(k).getDay() + 6) % 7; }, // 0 = Montag
  weekStart(k) { return D.add(k, -D.wd(k)); },
  monthKey(k) { return k.slice(0, 7); },
  fmt(k, o = { weekday: 'long', day: 'numeric', month: 'long' }) { return D.parse(k).toLocaleDateString('de-DE', o); },
  short(k) { return D.parse(k).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }); },
  long(k) { return D.parse(k).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }); },
  weekLabel(ws) {
    const we = D.add(ws, 6);
    return `${D.parse(ws).toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })} – ${D.parse(we).toLocaleDateString('de-DE', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  },
  nowHM() { const d = new Date(); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; }
};

function getPath(obj, path) { return path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj); }
const isObj = v => v && typeof v === 'object' && !Array.isArray(v);

/* ---------- Speicherung ---------- */
const STORE_KEY = 'becoming-her:data';
let S = null;
let storageOk = true;

const Store = {
  load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      S = raw ? Store.migrate(JSON.parse(raw)) : createDefaultState();
      if (!raw) Store.save();
    } catch (e) {
      console.error(e);
      storageOk = false;
      S = createDefaultState();
    }
  },
  migrate(data) {
    const def = createDefaultState();
    const merge = (t, d) => {
      for (const k in d) {
        if (t[k] === undefined) t[k] = d[k];
        else if (isObj(d[k]) && isObj(t[k]) && Object.keys(d[k]).length) merge(t[k], d[k]);
      }
    };
    merge(data, def);
    return data;
  },
  save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(S));
      return true;
    } catch (e) {
      storageOk = false;
      toast('Speichern nicht möglich – der Browser-Speicher ist blockiert oder voll.');
      return false;
    }
  },
  replace(data) { S = Store.migrate(data); Store.save(); },
  reset() { S = createDefaultState(); Store.save(); }
};

function commit(fn, opts = {}) {
  fn(S);
  snapshot();
  Store.save();
  if (opts.render !== false) App.render();
}

/* Rendert später neu – aber nur, wenn gerade kein Eingabefeld aktiv ist (Fokus bleibt erhalten) */
function softRender(delay = 300) {
  clearTimeout(softRender._t);
  softRender._t = setTimeout(() => {
    if (Modal.isOpen() || document.activeElement?.matches('input,textarea,select')) return;
    App.render();
  }, delay);
}

/* ---------- Domänenlogik: Tag ---------- */
const EMPTY_DAY = { done: {}, extra: [], hidden: [], overrides: {}, goals: [], note: '' };
function dayR(k) { return S.days[k] || EMPTY_DAY; }
function day(k) {
  if (!S.days[k]) S.days[k] = { done: {}, extra: [], hidden: [], overrides: {}, goals: [{ text: '', done: false }, { text: '', done: false }, { text: '', done: false }], note: '' };
  const d = S.days[k];
  d.done ||= {}; d.extra ||= []; d.hidden ||= []; d.overrides ||= {}; d.goals ||= [];
  while (d.goals.length < 3) d.goals.push({ text: '', done: false });
  return d;
}

function planFor(k) {
  const wd = D.wd(k), d = dayR(k);
  const items = S.schedule
    .filter(i => i.days.includes(wd) && !(d.hidden || []).includes(i.id))
    .map(i => ({ ...i, baseTime: i.time, time: d.overrides?.[i.id]?.time || i.time, recurring: true, moved: !!d.overrides?.[i.id] }));
  (d.extra || []).forEach(i => items.push({ ...i, recurring: false }));
  return items.sort((a, b) => a.time.localeCompare(b.time));
}

/* ---------- Domänenlogik: Gewohnheiten ---------- */
const habitDone = (h, k) => !!S.habitLog[k]?.[h.id];
function habitWeekCount(h, k) {
  const ws = D.weekStart(k); let c = 0;
  for (let i = 0; i < 7; i++) if (habitDone(h, D.add(ws, i))) c++;
  return c;
}
function habitDue(h, k) {
  if (h.archived) return false;
  const f = h.freq || { type: 'daily' };
  if (f.type === 'days') return (f.days || []).includes(D.wd(k));
  return true; // daily & weekly erscheinen täglich in der Checkliste
}
function habitCounts(h, k) { // zählt die Gewohnheit heute zum Tagesfortschritt?
  if (!habitDue(h, k)) return false;
  if (h.freq?.type === 'weekly' && !habitDone(h, k) && habitWeekCount(h, k) >= (h.freq.times || 1)) return false;
  return true;
}
function freqLabel(h) {
  const f = h.freq || { type: 'daily' };
  if (f.type === 'days') return (f.days || []).length === 7 ? 'Täglich' : (f.days || []).map(d => WDS[d]).join(' · ') || 'Keine Tage';
  if (f.type === 'weekly') return `${f.times || 1}× pro Woche`;
  return 'Täglich';
}
const activeHabits = () => S.habits.filter(h => !h.archived);

function dayProgress(k) {
  const d = dayR(k);
  let total = 0, done = 0;
  planFor(k).forEach(i => {
    const isDone = !!d.done?.[i.id];
    if (i.priority === 'optional') { if (isDone) { done++; total++; } }
    else { total++; if (isDone) done++; }
  });
  (d.goals || []).forEach(g => { if (g.text && g.text.trim()) { total++; if (g.done) done++; } });
  S.habits.forEach(h => { if (habitCounts(h, k)) { total++; if (habitDone(h, k)) done++; } });
  return { done, total, pct: pct(done, total) };
}

function snapshot() {
  const today = D.key();
  const keys = new Set([today, App.ui.planDate, App.ui.habitDate]);
  keys.forEach(k => {
    if (!k || k > today) return;
    if (k === today || S.days[k] || S.habitLog[k]) S.history[k] = dayProgress(k);
  });
}

function weekAvg(ws) {
  const vals = [];
  for (let i = 0; i < 7; i++) { const h = S.history[D.add(ws, i)]; if (h && h.total) vals.push(h.pct); }
  return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
}

function kindMessage(p, hour = new Date().getHours()) {
  if (p.total && p.done === p.total) return KIND_MESSAGES.all;
  if (p.pct >= 75) return KIND_MESSAGES.great;
  if (p.pct >= 45) return KIND_MESSAGES.half;
  if (p.pct > 0) return hour >= 19 && p.pct < 30 ? KIND_MESSAGES.calmEvening : KIND_MESSAGES.some;
  return hour >= 13 ? KIND_MESSAGES.rest : KIND_MESSAGES.start;
}

function greeting(hour = new Date().getHours()) {
  if (hour >= 5 && hour < 11) return { hello: 'Good morning', text: 'Ein neuer Tag, eine neue Möglichkeit, dir selbst näherzukommen.' };
  if (hour >= 11 && hour < 17) return { hello: 'Good afternoon', text: 'Schön, dass du da bist. Was tut dir heute noch gut?' };
  if (hour >= 17 && hour < 22) return { hello: 'Good evening', text: 'Der Tag darf langsam leiser werden. Sei stolz auf das, was war.' };
  return { hello: 'Good night', text: 'Zeit, zur Ruhe zu kommen. Morgen ist ein neuer Anfang.' };
}

/* ---------- Icons ---------- */
const ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20h14V9.5"/><path d="M10 20v-5h4v5"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8 12.3 2.8 2.8L16.3 9.5"/>',
  grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="2"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="2"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="2"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="2"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  path: '<path d="M5 20c0-6 14-4 14-10 0-3-3-5-7-5"/><circle cx="12" cy="5" r="1.6"/><circle cx="5" cy="20" r="1.6"/>',
  pen: '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/>',
  journal: '<path d="M6 3h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6Z"/><path d="M6 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2M10 8h5M10 12h5"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  move: '<path d="M12 3v18M3 12h18M8 7l4-4 4 4M8 17l4 4 4-4"/>',
  chevL: '<path d="m15 18-6-6 6-6"/>',
  chevR: '<path d="m9 18 6-6-6-6"/>',
  more: '<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
  sparkle: '<path d="M12 3c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7Z"/><path d="M19 15.5c.2 1.4.9 2.1 2.3 2.3-1.4.2-2.1.9-2.3 2.3-.2-1.4-.9-2.1-2.3-2.3 1.4-.2 2.1-.9 2.3-2.3Z"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z"/>',
  flower: '<circle cx="12" cy="10" r="2.5"/><path d="M12 7.5C12 4 14.5 3 14.5 3S17 5 14.4 8.3M14.4 11.4c3.4.9 4.6 3.3 4.6 3.3s-2.6 1.6-5.6-.7M9.6 11.4C6.2 12.3 5 14.7 5 14.7s2.6 1.6 5.6-.7M9.6 8.3C7 5 9.5 3 9.5 3S12 4 12 7.5M12 12.5V21"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5Z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>',
  palette: '<path d="M12 3a9 9 0 0 0 0 18c1.4 0 2-1 2-2 0-1.4-1.2-1.6-1.2-3 0-1 .8-1.8 1.8-1.8H17a4 4 0 0 0 4-4C21 6.4 17 3 12 3Z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
  bell: '<path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15Z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
  download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  upload: '<path d="M12 20V9M7 14l5-5 5 5M5 4h14"/>',
  refresh: '<path d="M20 11a8 8 0 0 0-14.8-3.5M4 4v4h4M4 13a8 8 0 0 0 14.8 3.5M20 20v-4h-4"/>',
  leaf: '<path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15"/><path d="M5 19 13 11"/>',
  moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5Z"/>',
  drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/>',
  play: '<path d="M7 4.5v15l12-7.5Z"/>',
  star: '<path d="m12 3 2.7 5.6 6.1.8-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.8Z"/>',
  cat: '<path d="M5 20V9l-1-5 4.5 3h7L20 4l-1 5v11"/><path d="M5 20h14M9.5 13h.01M14.5 13h.01M11 16h2"/>',
  cart: '<circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/><path d="M3 4h2l2.4 11h11L21 7H6.2"/>',
  note: '<path d="M5 4h14v11l-5 5H5Z"/><path d="M14 20v-5h5"/>',
  undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>',
  wind: '<path d="M3 8h11a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h7"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>'
};
const icon = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;

/* ---------- UI-Bausteine ---------- */
function checkBtn(on, attrs, label = '') {
  return `<button type="button" class="check ${on ? 'on' : ''}" ${attrs} aria-pressed="${on}" aria-label="${esc(label || (on ? 'Als offen markieren' : 'Als erledigt markieren'))}">${icon('check')}</button>`;
}
function checkRow(text, on, attrs, extra = '', sub = '') {
  return `<div class="check-row ${on ? 'done' : ''}">${checkBtn(on, attrs, text)}<div class="cr-body" ${attrs.replace('data-action', 'data-action')} role="button" tabindex="-1"><span class="cr-text">${esc(text)}</span>${sub ? `<span class="cr-sub">${sub}</span>` : ''}</div>${extra}</div>`;
}
function progressBar(p, cls = '') { return `<div class="progress ${cls}" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100"><span style="width:${clamp(p, 0, 100)}%"></span></div>`; }
function ring(p, size = 132, inner = '') {
  const r = (size - 14) / 2, c = 2 * Math.PI * r, off = c * (1 - clamp(p, 0, 100) / 100);
  return `<div class="ring" style="width:${size}px;height:${size}px"><svg viewBox="0 0 ${size} ${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="ring-bg"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="ring-fg" stroke-dasharray="${c}" stroke-dashoffset="${off}"/></svg><div class="ring-inner">${inner || `<strong>${p}%</strong>`}</div></div>`;
}
function emptyState(text, ic = 'leaf') { return `<div class="empty">${icon(ic)}<p>${text}</p></div>`; }
function pageHead(eyebrow, title, sub = '', right = '') {
  return `<header class="page-head"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1>${sub ? `<p class="lead">${sub}</p>` : ''}</div>${right ? `<div class="page-head-right">${right}</div>` : ''}</header>`;
}
function tabs(group, list, active) {
  return `<div class="tabs" role="tablist">${list.map(t => `<button class="tab ${t.id === active ? 'active' : ''}" role="tab" aria-selected="${t.id === active}" data-action="tab" data-group="${group}" data-tab="${t.id}">${t.label}</button>`).join('')}</div>`;
}
function stars(n) { n = n || 0; return n ? `<span class="stars" aria-label="${n} von 5">${'★'.repeat(n)}<span class="dim">${'★'.repeat(5 - n)}</span></span>` : ''; }
function iconBtn(ic, attrs, label) { return `<button type="button" class="icon-btn" ${attrs} aria-label="${esc(label)}" title="${esc(label)}">${icon(ic)}</button>`; }
function editDel(path, form, id) {
  return `<div class="row-actions">${iconBtn('pen', `data-action="crud-edit" data-path="${path}" data-form="${form}" data-id="${id}"`, 'Bearbeiten')}${iconBtn('trash', `data-action="crud-del" data-path="${path}" data-id="${id}"`, 'Löschen')}</div>`;
}
function addBtn(label, attrs, cls = 'soft') { return `<button type="button" class="btn ${cls} sm" ${attrs}>${icon('plus')}<span>${label}</span></button>`; }

/* Balkendiagramm (CSS-basiert) */
function barChart(data, { height = 150, max, suffix = '', emptyText } = {}) {
  if (!data.some(d => d.value > 0)) return `<div class="chart-empty">${icon('leaf')}<span>${emptyText || 'Noch keine Daten – das füllt sich ganz von selbst, Tag für Tag.'}</span></div>`;
  const m = max || Math.max(...data.map(d => d.value), 1);
  return `<div class="bars" style="--h:${height}px">${data.map(d => `
    <div class="bar-col" title="${esc(d.title || d.label)}: ${fmtNum(d.value)}${suffix}">
      <div class="bar-val">${d.value ? fmtNum(d.value) + suffix : ''}</div>
      <div class="bar-track"><div class="bar ${d.cls || ''}" style="height:${d.value ? Math.max((d.value / m) * 100, 4) : 0}%"></div></div>
      <div class="bar-label ${d.hl ? 'hl' : ''}">${esc(d.label)}</div>
    </div>`).join('')}</div>`;
}
function hbar(label, value, max, right = '') {
  return `<div class="hbar"><div class="hbar-top"><span>${esc(label)}</span><span class="muted">${right}</span></div>${progressBar(pct(value, max))}</div>`;
}

/* ---------- Toast ---------- */
function toast(msg) {
  const root = $('#toast-root'); if (!root) return;
  const el = document.createElement('div');
  el.className = 'toast'; el.textContent = msg;
  root.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 400); }, 2600);
}

/* ---------- Modal & Formulare ---------- */
const Modal = {
  open(html, { onMount, wide } = {}) {
    const root = $('#modal-root');
    root.innerHTML = `<div class="modal-backdrop" data-backdrop><div class="modal ${wide ? 'wide' : ''}" role="dialog" aria-modal="true">${html}</div></div>`;
    root.classList.add('open');
    document.body.classList.add('no-scroll');
    const m = root.querySelector('.modal');
    m.querySelectorAll('[data-modal-close]').forEach(b => b.addEventListener('click', () => Modal.close()));
    onMount && onMount(m);
    if (window.matchMedia('(pointer:fine)').matches) {
      const f = m.querySelector('input:not([type=checkbox]):not([type=file]),textarea,select');
      f && setTimeout(() => f.focus(), 60);
    }
  },
  close() {
    const root = $('#modal-root');
    root.classList.remove('open'); root.innerHTML = '';
    document.body.classList.remove('no-scroll');
    if (Modal._resolve) { const r = Modal._resolve; Modal._resolve = null; r(null); }
  },
  isOpen() { return $('#modal-root').classList.contains('open'); }
};
document.addEventListener('mousedown', e => { if (e.target.matches && e.target.matches('[data-backdrop]')) Modal._downOnBackdrop = true; else Modal._downOnBackdrop = false; });
document.addEventListener('click', e => { if (e.target.matches && e.target.matches('[data-backdrop]') && Modal._downOnBackdrop !== false) Modal.close(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && Modal.isOpen()) Modal.close(); });

function optList(options) { return options.map(o => (typeof o === 'object' ? o : { value: o, label: o })); }

function fieldHtml(f, value) {
  const v = value ?? f.default ?? '';
  const show = f.showIf ? `data-showif="${f.showIf.field}" data-showin="${f.showIf.in.join('|')}"` : '';
  const help = f.help ? `<small class="help">${f.help}</small>` : '';
  const req = f.required ? 'required' : '';
  const ph = f.placeholder ? `placeholder="${esc(f.placeholder)}"` : '';
  let input;
  switch (f.type) {
    case 'textarea':
      input = `<textarea name="${f.name}" rows="${f.rows || 3}" ${ph} ${req}>${esc(v)}</textarea>`; break;
    case 'select':
      input = `<select name="${f.name}">${optList(f.options).map(o => `<option value="${esc(o.value)}" ${String(o.value) === String(v) ? 'selected' : ''}>${esc(o.label)}</option>`).join('')}</select>`; break;
    case 'days':
      input = `<div class="day-picks">${WDS.map((d, i) => `<label class="day-pick"><input type="checkbox" name="${f.name}" value="${i}" ${(v || []).includes(i) ? 'checked' : ''}><span>${d}</span></label>`).join('')}</div>`; break;
    case 'rating':
      input = `<select name="${f.name}">${[0, 1, 2, 3, 4, 5].map(n => `<option value="${n}" ${Number(v) === n ? 'selected' : ''}>${n ? '★'.repeat(n) : 'Keine Bewertung'}</option>`).join('')}</select>`; break;
    default:
      input = `<input type="${f.type || 'text'}" name="${f.name}" value="${esc(v)}" ${ph} ${req} ${f.min != null ? `min="${f.min}"` : ''} ${f.max != null ? `max="${f.max}"` : ''} ${f.step ? `step="${f.step}"` : ''} ${f.type === 'number' ? 'inputmode="decimal"' : ''}>`;
  }
  return `<label class="field ${f.half ? 'half' : ''}" ${show}><span class="field-label">${esc(f.label)}</span>${input}${help}</label>`;
}

function readForm(form, fields) {
  const out = {};
  fields.forEach(f => {
    if (f.type === 'days') out[f.name] = $$(`input[name="${f.name}"]:checked`, form).map(i => Number(i.value));
    else {
      const el = form.elements[f.name]; if (!el) return;
      let v = el.value;
      if (f.type === 'number' || f.type === 'rating') v = v === '' ? null : Number(String(v).replace(',', '.'));
      else if (typeof v === 'string' && f.type !== 'textarea') v = v.trim();
      out[f.name] = v;
    }
  });
  return out;
}

function openForm({ title, intro, fields, values = {}, submitLabel = 'Speichern', onSubmit, onDelete, deleteLabel = 'Löschen', wide }) {
  const html = `
    <div class="modal-head"><h3>${esc(title)}</h3><button type="button" class="icon-btn" data-modal-close aria-label="Schließen">${icon('x')}</button></div>
    ${intro ? `<p class="modal-intro">${intro}</p>` : ''}
    <form class="form" novalidate>
      <div class="form-grid">${fields.map(f => fieldHtml(f, values[f.name])).join('')}</div>
      <p class="form-error" hidden></p>
      <div class="modal-actions">
        ${onDelete ? `<button type="button" class="btn ghost danger" data-del>${icon('trash')}<span>${deleteLabel}</span></button>` : ''}
        <span class="spacer"></span>
        <button type="button" class="btn ghost" data-modal-close>Abbrechen</button>
        <button type="submit" class="btn primary">${submitLabel}</button>
      </div>
    </form>`;
  Modal.open(html, {
    wide,
    onMount(m) {
      const form = m.querySelector('form');
      const updateShow = () => {
        $$('[data-showif]', form).forEach(el => {
          const ctrl = form.elements[el.dataset.showif];
          el.hidden = !(ctrl && el.dataset.showin.split('|').includes(ctrl.value));
        });
      };
      form.addEventListener('change', updateShow); updateShow();
      form.addEventListener('submit', e => {
        e.preventDefault();
        const vals = readForm(form, fields);
        const missing = fields.find(f => f.required && !String(vals[f.name] ?? '').trim());
        if (missing) {
          const err = form.querySelector('.form-error'); err.hidden = false; err.textContent = `Bitte fülle „${missing.label}“ aus.`;
          form.elements[missing.name]?.focus(); return;
        }
        const r = onSubmit(vals);
        if (r !== false) Modal.close();
      });
      const del = m.querySelector('[data-del]');
      if (del) del.addEventListener('click', () => {
        if (!del.dataset.armed) { del.dataset.armed = '1'; del.querySelector('span').textContent = 'Wirklich löschen?'; del.classList.add('armed'); return; }
        Modal.close(); onDelete();
      });
    }
  });
}

function confirmDialog(message, { title = 'Bist du sicher?', ok = 'Ja', cancel = 'Abbrechen', danger = false } = {}) {
  return new Promise(resolve => {
    Modal.open(`<div class="modal-head"><h3>${esc(title)}</h3></div><p class="modal-intro">${message}</p>
      <div class="modal-actions"><span class="spacer"></span><button class="btn ghost" data-c="0">${esc(cancel)}</button><button class="btn ${danger ? 'danger-solid' : 'primary'}" data-c="1">${esc(ok)}</button></div>`, {
      onMount(m) {
        Modal._resolve = v => resolve(!!v);
        m.querySelectorAll('[data-c]').forEach(b => b.addEventListener('click', () => {
          const r = Modal._resolve; Modal._resolve = null; Modal.close(); r(b.dataset.c === '1');
        }));
      }
    });
  });
}

function choiceDialog(title, message, choices) {
  return new Promise(resolve => {
    Modal.open(`<div class="modal-head"><h3>${esc(title)}</h3><button type="button" class="icon-btn" data-modal-close aria-label="Schließen">${icon('x')}</button></div>
      ${message ? `<p class="modal-intro">${message}</p>` : ''}
      <div class="choice-list">${choices.map((c, i) => `<button class="choice ${c.danger ? 'danger' : ''}" data-i="${i}"><strong>${esc(c.label)}</strong>${c.sub ? `<span>${esc(c.sub)}</span>` : ''}</button>`).join('')}</div>`, {
      onMount(m) {
        Modal._resolve = resolve;
        m.querySelectorAll('[data-i]').forEach(b => b.addEventListener('click', () => {
          const r = Modal._resolve; Modal._resolve = null; Modal.close(); r(choices[b.dataset.i].value);
        }));
      }
    });
  });
}

/* ---------- Formular-Registry & generische Aktionen ---------- */
const FORMS = {};
const Pages = {};

const GlobalActions = {
  'crud-add'(d) {
    const def = FORMS[d.form];
    const values = typeof def.defaults === 'function' ? def.defaults(d) : { ...(def.defaults || {}) };
    openForm({
      title: def.addTitle || def.title, intro: def.intro, fields: def.fields, values, submitLabel: 'Hinzufügen', wide: def.wide,
      onSubmit(v) {
        const item = { id: uid(), ...(def.extra ? def.extra(d) : {}), ...(def.prepare ? def.prepare(v, null, d) : v) };
        commit(s => getPath(s, d.path).push(item));
        toast(def.added || 'Hinzugefügt ✓');
      }
    });
  },
  'crud-edit'(d) {
    const def = FORMS[d.form];
    const item = getPath(S, d.path).find(i => i.id === d.id);
    if (!item) return;
    openForm({
      title: def.editTitle || def.title, intro: def.intro, fields: def.fields, wide: def.wide,
      values: def.toForm ? def.toForm(item) : item,
      onSubmit(v) { commit(() => Object.assign(item, def.prepare ? def.prepare(v, item, d) : v)); toast('Gespeichert ✓'); },
      onDelete() { commit(s => { const a = getPath(s, d.path); const i = a.indexOf(item); if (i > -1) a.splice(i, 1); }); toast('Gelöscht'); }
    });
  },
  'crud-del'(d) {
    confirmDialog('Dieser Eintrag wird dauerhaft gelöscht.', { title: 'Eintrag löschen?', ok: 'Löschen', danger: true }).then(ok => {
      if (ok) commit(s => { const a = getPath(s, d.path); const i = a.findIndex(x => x.id === d.id); if (i > -1) a.splice(i, 1); });
    });
  },
  'crud-toggle'(d) {
    commit(s => {
      const it = getPath(s, d.path).find(x => x.id === d.id); if (!it) return;
      const f = d.field || 'done';
      it[f] = !it[f];
      if (f === 'done') it.doneDate = it.done ? D.key() : null;
    });
  },
  'check-toggle'(d) {
    commit(s => { const l = (s.checks[d.list] ||= {}); const dd = (l[d.date] ||= {}); dd[d.id] = !dd[d.id]; });
  },
  'wcheck-toggle'(d) {
    commit(s => { const l = (s.weekChecks[d.list] ||= {}); const w = (l[d.week] ||= {}); w[d.id] = !w[d.id]; });
  },
  'sub-toggle'(d) {
    commit(s => { const p = getPath(s, d.path).find(x => x.id === d.id); const it = p?.[d.sub]?.find(x => x.id === d.sid); if (it) it.done = !it.done; });
  },
  'sub-del'(d) {
    commit(s => { const p = getPath(s, d.path).find(x => x.id === d.id); if (p) p[d.sub] = p[d.sub].filter(x => x.id !== d.sid); });
  },
  'sub-edit'(d) {
    const p = getPath(S, d.path).find(x => x.id === d.id); const it = p?.[d.sub]?.find(x => x.id === d.sid); if (!it) return;
    openForm({
      title: 'Eintrag bearbeiten', fields: [{ name: 'text', label: 'Text', required: true }], values: it,
      onSubmit(v) { commit(() => { it.text = v.text; }); },
      onDelete() { commit(() => { p[d.sub] = p[d.sub].filter(x => x.id !== d.sid); }); }
    });
  },
  'plan-toggle'(d) { commit(() => { const dd = day(d.date); dd.done[d.id] = !dd.done[d.id]; }); },
  'habit-toggle'(d) {
    commit(s => { const l = (s.habitLog[d.date] ||= {}); if (l[d.id]) delete l[d.id]; else l[d.id] = true; });
  },
  'nav'(d) { location.hash = d.to; },
  'tab'(d) { App.ui.tabs[d.group] = d.tab; App.render(); window.scrollTo({ top: Math.min(window.scrollY, 120) }); }
};

const GlobalSubmits = {
  subAdd(v, form) {
    const d = form.dataset; const text = (v.text || '').trim(); if (!text) return;
    commit(s => { const p = getPath(s, d.path).find(x => x.id === d.id); if (p) (p[d.sub] ||= []).push({ id: uid(), text, done: false }); });
  },
  listAdd(v, form) { // fügt {id,text} zu einer einfachen Liste hinzu
    const d = form.dataset; const text = (v.text || '').trim(); if (!text) return;
    commit(s => getPath(s, d.path).push({ id: uid(), text, ...(d.wd != null ? { wd: Number(d.wd) } : {}), ...(d.done ? { done: false } : {}) }));
  }
};
const GlobalChanges = {};

/* Einfaches Eintrags-Formular für Listen mit {text} */
FORMS.text = { title: 'Eintrag', fields: [{ name: 'text', label: 'Text', required: true }] };
FORMS.textWd = {
  title: 'Eintrag', fields: [{ name: 'text', label: 'Text', required: true }, { name: 'wd', label: 'Wochentag', type: 'select', options: WD.map((w, i) => ({ value: i, label: w })) }],
  prepare: v => ({ ...v, wd: Number(v.wd) }), defaults: d => ({ wd: d.wd != null ? Number(d.wd) : D.wd(D.key()) })
};

function inlineAdd(placeholder, attrs, submit = 'listAdd') {
  return `<form class="inline-add" data-submit="${submit}" ${attrs}><input name="text" placeholder="${esc(placeholder)}" autocomplete="off" aria-label="${esc(placeholder)}"><button class="icon-btn solid" aria-label="Hinzufügen">${icon('plus')}</button></form>`;
}

/* Tägliche Checkliste (z. B. Morgenroutine) */
function dailyChecklist(list, path, k, { form = 'text', editable = true } = {}) {
  const items = getPath(S, path) || [];
  const st = S.checks[list]?.[k] || {};
  if (!items.length) return emptyState('Noch keine Schritte – füge deinen ersten hinzu.');
  return `<div class="check-list">${items.map(i => {
    const on = !!st[i.id];
    const attrs = `data-action="check-toggle" data-list="${list}" data-date="${k}" data-id="${i.id}"`;
    return checkRow(i.text, on, attrs, editable ? editDel(path, form, i.id) : '');
  }).join('')}</div>`;
}
function checklistCount(list, path, k) {
  const items = getPath(S, path) || []; const st = S.checks[list]?.[k] || {};
  return { done: items.filter(i => st[i.id]).length, total: items.length };
}
