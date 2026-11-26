/* BECOMING HER – App: Routing, Navigation, Ereignisse, Erinnerungen */

const NAV = [
  { group: 'Mein Tag' },
  { id: 'dashboard', label: 'Heute', icon: 'sun' },
  { id: 'plan', label: 'Tagesplan', icon: 'clock' },
  { id: 'woche', label: 'Wochenplan', icon: 'calendar' },
  { id: 'habits', label: 'Habit Tracker', icon: 'checkCircle' },
  { group: 'Lebensbereiche' },
  ...AREAS.map(a => ({ id: 'bereiche/' + a.id, label: a.name, num: a.num })),
  { group: 'Mein Weg' },
  { id: 'entwicklung', label: 'Entwicklungsplan', icon: 'path' },
  { id: 'fortschritte', label: 'Fortschritte', icon: 'chart' },
  { id: 'reflexion', label: 'Wochenreflexion', icon: 'journal' },
  { id: 'einstellungen', label: 'Einstellungen', icon: 'settings' }
];
const BOTTOM = [
  { id: 'dashboard', label: 'Heute', icon: 'sun' },
  { id: 'plan', label: 'Plan', icon: 'clock' },
  { id: 'habits', label: 'Habits', icon: 'checkCircle' },
  { id: 'bereiche', label: 'Bereiche', icon: 'grid' },
  { id: 'more', label: 'Mehr', icon: 'menu' }
];

const App = {
  ui: {
    planDate: D.key(), planFilter: 'all', tplDay: null,
    weekStart: D.weekStart(D.key()),
    habitDate: D.key(), habitWeek: D.weekStart(D.key()), habitMonth: D.key().slice(0, 7), habitFilter: 'all',
    quoteShift: 0, tabs: {}, timers: [], reflWeek: null, groundStep: 0, randomIdea: null
  },
  current: null,
  lastRoute: null,
  today: D.key(),

  route() {
    const h = decodeURIComponent(location.hash.replace(/^#\/?/, '')) || 'dashboard';
    const [name, sub] = h.split('/');
    return { name, sub, full: h };
  },

  render() {
    App.ui.timers.forEach(t => clearInterval(t)); App.ui.timers = [];
    const r = App.route();
    const page = Pages[r.name] || Pages.dashboard;
    App.current = page;
    const main = $('#main');
    const same = App.lastRoute === r.full;
    const y = window.scrollY;
    main.innerHTML = page.render(r.sub);
    page.mount && page.mount(r.sub);
    App.updateNav(r);
    document.title = (page.title ? page.title(r.sub) + ' · ' : '') + 'Becoming Her';
    if (same) window.scrollTo(0, y); else { window.scrollTo(0, 0); }
    App.lastRoute = r.full;
  },

  renderNav() {
    $('#sidebar').innerHTML = `
      <a class="brand" href="#/dashboard"><div class="brand-name">BECOMING HER</div><div class="brand-sub">Your personal life system</div></a>
      ${NAV.map(n => n.group ? `<div class="nav-label">${n.group}</div>` :
        `<a class="nav-link" href="#/${n.id}" data-nav="${n.id}">${n.num ? `<span class="num">${n.num}</span>` : icon(n.icon)}<span>${esc(n.label)}</span></a>`).join('')}
      <div class="side-foot">Become the woman you want to be.<br>One day at a time.</div>`;
    $('#bottom-nav').innerHTML = BOTTOM.map(b => b.id === 'more'
      ? `<button class="bn-item" data-action="drawer-open" data-nav="more">${icon(b.icon)}<span>${b.label}</span></button>`
      : `<a class="bn-item" href="#/${b.id}" data-nav="${b.id}">${icon(b.icon)}<span>${b.label}</span></a>`).join('');
    $('#topbar-settings').innerHTML = icon('settings');
    $('#drawer').innerHTML = `<div class="drawer-bg" data-action="drawer-close"></div>
      <div class="drawer-panel"><div class="drawer-handle"></div>
      ${NAV.map(n => n.group ? `<div class="nav-label">${n.group}</div>` :
        `<a class="nav-link" href="#/${n.id}" data-nav="${n.id}">${n.num ? `<span class="num">${n.num}</span>` : icon(n.icon)}<span>${esc(n.label)}</span></a>`).join('')}
      </div>`;
  },

  updateNav(r) {
    const key = r.sub && r.name === 'bereiche' ? 'bereiche/' + r.sub : r.name;
    $$('[data-nav]').forEach(el => {
      const n = el.dataset.nav;
      let on = n === key;
      if (el.classList.contains('bn-item')) {
        on = n === r.name || (n === 'more' && !BOTTOM.some(b => b.id === r.name));
      }
      el.classList.toggle('active', on);
    });
  },

  openDrawer() { $('#drawer').classList.add('open'); $('#drawer').setAttribute('aria-hidden', 'false'); },
  closeDrawer() { $('#drawer').classList.remove('open'); $('#drawer').setAttribute('aria-hidden', 'true'); }
};

GlobalActions['drawer-open'] = () => App.openDrawer();
GlobalActions['drawer-close'] = () => App.closeDrawer();

/* ---------- Ereignis-Delegation ---------- */
function findHandler(type, name) {
  const page = App.current || {};
  const map = { action: [page.actions, GlobalActions], submit: [page.submits, GlobalSubmits], change: [page.changes, GlobalChanges] }[type];
  for (const m of map) if (m && m[name]) return m[name];
  return null;
}
document.addEventListener('click', e => {
  if (e.target.closest('#drawer a')) App.closeDrawer();
  if (e.target.closest('#modal-root')) return;
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const fn = findHandler('action', el.dataset.action);
  if (fn) { e.preventDefault(); fn({ ...el.dataset }, el, e); }
});
document.addEventListener('submit', e => {
  const form = e.target.closest('form[data-submit]');
  if (!form || form.closest('#modal-root')) return;
  e.preventDefault();
  const fn = findHandler('submit', form.dataset.submit);
  if (fn) fn(Object.fromEntries(new FormData(form).entries()), form);
});
document.addEventListener('change', e => {
  const el = e.target.closest('[data-change]');
  if (!el || el.closest('#modal-root')) return;
  const fn = findHandler('change', el.dataset.change);
  if (fn) fn({ ...el.dataset }, el);
});
document.addEventListener('keydown', e => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role=button][data-action]')) { e.preventDefault(); e.target.click(); }
});
window.addEventListener('hashchange', () => { App.closeDrawer(); if (Modal.isOpen()) Modal.close(); App.render(); });

/* ---------- Erinnerungen (Browser-Benachrichtigungen) ---------- */
const Notify = {
  supported: () => 'Notification' in window,
  permission: () => (Notify.supported() ? Notification.permission : 'unsupported'),
  sent: new Set(),
  async request() {
    if (!Notify.supported()) return 'unsupported';
    try { return await Notification.requestPermission(); } catch (e) { return 'denied'; }
  },
  show(title, body) {
    try { new Notification(title, { body, tag: title + body }); } catch (e) { toast(`${title} – ${body}`); }
  },
  tick() {
    const k = D.key();
    // Tageswechsel: Ansicht neu aufbauen, damit „heute“ stimmt
    if (k !== App.today) {
      if (App.ui.planDate === App.today) App.ui.planDate = k;
      if (App.ui.habitDate === App.today) App.ui.habitDate = k;
      App.today = k;
      if (!Modal.isOpen() && !document.activeElement?.matches('input,textarea')) App.render();
    }
    if (!S.settings.notifications || Notify.permission() !== 'granted') return;
    const now = new Date(), lead = Number(S.settings.notifyLead) || 0;
    const target = new Date(now.getTime() + lead * 60000);
    const hm = `${String(target.getHours()).padStart(2, '0')}:${String(target.getMinutes()).padStart(2, '0')}`;
    const d = dayR(k);
    planFor(k).forEach(i => {
      if (i.time !== hm || d.done?.[i.id]) return;
      if (i.priority === 'optional' && !S.settings.notifyOptional) return;
      const key = k + i.id + hm; if (Notify.sent.has(key)) return; Notify.sent.add(key);
      Notify.show(lead ? `In ${lead} Min.: ${i.title}` : i.title, `${i.time} Uhr · Dein Tagesplan – ganz ohne Druck.`);
    });
    S.events.filter(ev => ev.date === k && ev.time === hm).forEach(ev => {
      const key = 'ev' + ev.id + hm; if (Notify.sent.has(key)) return; Notify.sent.add(key);
      Notify.show(`Termin: ${ev.title}`, `${ev.time} Uhr${ev.note ? ' · ' + ev.note : ''}`);
    });
    if (D.wd(k) === 6 && D.nowHM() === '19:00' && !S.reflections.some(r => r.weekKey === D.weekStart(k))) {
      const key = 'refl' + k; if (!Notify.sent.has(key)) { Notify.sent.add(key); Notify.show('Zeit für deine Wochenreflexion', 'Nimm dir ein paar ruhige Minuten für dich.'); }
    }
  }
};

/* ---------- Start ---------- */
Store.load();
App.renderNav();
App.render();
snapshot(); Store.save();
setInterval(Notify.tick, 20000);
Notify.tick();
if (!storageOk) setTimeout(() => toast('Hinweis: Lokaler Speicher ist nicht verfügbar – Änderungen gehen beim Schließen verloren.'), 800);
