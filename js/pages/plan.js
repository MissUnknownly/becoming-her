/* Mein Tagesplan */

const PRIO_OPTS = [
  { value: 'normal', label: 'Normal' },
  { value: 'important', label: 'Wichtig' },
  { value: 'optional', label: 'Optional' }
];

function repeatOptions(wd) {
  return [
    { value: 'once', label: 'Nur an diesem Tag' },
    { value: 'weekday', label: `Jeden ${WD[wd]}` },
    { value: 'daily', label: 'Jeden Tag' },
    { value: 'workdays', label: 'Montag bis Freitag' },
    { value: 'weekend', label: 'Am Wochenende' },
    { value: 'custom', label: 'Eigene Auswahl …' }
  ];
}
function repeatDays(rep, wd, custom) {
  return { weekday: [wd], daily: [...ALL_DAYS], workdays: [0, 1, 2, 3, 4], weekend: [5, 6], custom: custom || [] }[rep];
}
function findPlanItem(k, id) {
  const rec = S.schedule.find(i => i.id === id);
  if (rec) return { item: rec, recurring: true };
  const ex = dayR(k).extra.find(i => i.id === id);
  return ex ? { item: ex, recurring: false } : null;
}

function openPlanAdd(k, presetDays) {
  const wd = D.wd(k);
  openForm({
    title: 'Aktivität hinzufügen',
    fields: [
      { name: 'title', label: 'Was möchtest du tun?', required: true, placeholder: 'z. B. Yoga, Freundin anrufen …' },
      { name: 'time', label: 'Uhrzeit', type: 'time', half: true, required: true },
      { name: 'priority', label: 'Markierung', type: 'select', options: PRIO_OPTS, half: true },
      { name: 'repeat', label: 'Wiederholung', type: 'select', options: repeatOptions(wd) },
      { name: 'days', label: 'An diesen Tagen', type: 'days', showIf: { field: 'repeat', in: ['custom'] } },
      { name: 'note', label: 'Notiz', type: 'textarea', rows: 2 }
    ],
    values: { time: presetDays ? '12:00' : nextHalfHour(), priority: 'normal', repeat: presetDays ? 'custom' : 'once', days: presetDays || [wd] },
    submitLabel: 'Hinzufügen',
    onSubmit(v) {
      const base = { id: uid(), title: v.title, time: v.time, priority: v.priority, note: v.note || '' };
      if (v.repeat === 'once') commit(() => day(k).extra.push(base));
      else {
        const days = repeatDays(v.repeat, wd, v.days);
        if (!days.length) { toast('Bitte wähle mindestens einen Tag aus.'); return false; }
        commit(s => s.schedule.push({ ...base, days }));
      }
      toast('Zum Tagesplan hinzugefügt ✓');
    }
  });
}
function nextHalfHour() {
  const d = new Date(); d.setMinutes(d.getMinutes() < 30 ? 30 : 60, 0, 0);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function openPlanEdit(k, id) {
  const f = findPlanItem(k, id); if (!f) return;
  const { item, recurring } = f;
  const fields = [
    { name: 'title', label: 'Aktivität', required: true },
    { name: 'time', label: recurring ? 'Uhrzeit (dauerhaft)' : 'Uhrzeit', type: 'time', half: true, required: true },
    { name: 'priority', label: 'Markierung', type: 'select', options: PRIO_OPTS, half: true },
    ...(recurring ? [{ name: 'days', label: 'Wiederkehrend an', type: 'days', help: 'Gestalte jeden Wochentag individuell.' }] : []),
    { name: 'note', label: 'Notiz', type: 'textarea', rows: 2 }
  ];
  openForm({
    title: recurring ? 'Wiederkehrende Aktivität' : 'Aktivität (nur an diesem Tag)',
    fields, values: item,
    onSubmit(v) {
      if (recurring && !v.days.length) { toast('Wähle mindestens einen Tag – oder lösche die Aktivität.'); return false; }
      commit(() => Object.assign(item, v));
      toast('Gespeichert ✓');
    },
    onDelete: () => deletePlanItem(k, id)
  });
}

async function deletePlanItem(k, id) {
  const f = findPlanItem(k, id); if (!f) return;
  const { item, recurring } = f;
  if (!recurring) {
    if (await confirmDialog(`„${esc(item.title)}“ wird aus diesem Tag entfernt.`, { title: 'Aktivität löschen?', ok: 'Löschen', danger: true }))
      commit(() => { const d = day(k); d.extra = d.extra.filter(i => i.id !== id); });
    return;
  }
  const wd = D.wd(k);
  const choices = [{ label: 'Nur an diesem Tag ausblenden', sub: D.fmt(k), value: 'hide' }];
  if (item.days.length > 1) choices.push({ label: `Nur für ${WD[wd]}e entfernen`, sub: 'An anderen Tagen bleibt sie bestehen', value: 'wd' });
  choices.push({ label: 'Dauerhaft aus dem Plan löschen', sub: 'An allen Tagen', value: 'all', danger: true });
  const c = await choiceDialog('Aktivität entfernen', `„${esc(item.title)}“ ist eine wiederkehrende Aktivität.`, choices);
  if (!c) return;
  commit(s => {
    if (c === 'hide') day(k).hidden.push(id);
    if (c === 'wd') item.days = item.days.filter(x => x !== wd);
    if (c === 'all') s.schedule = s.schedule.filter(i => i.id !== id);
  });
  toast(c === 'hide' ? 'Für heute ausgeblendet' : 'Entfernt');
}

function openPlanMove(k, id) {
  const f = findPlanItem(k, id); if (!f) return;
  const { item, recurring } = f;
  const cur = (recurring && dayR(k).overrides?.[id]?.time) || item.time;
  openForm({
    title: 'Aktivität verschieben',
    intro: recurring ? 'Das Verschieben gilt nur für diesen einen Tag – dein Grundrhythmus bleibt unverändert.' : '',
    fields: [
      { name: 'mode', label: 'Wohin?', type: 'select', options: [{ value: 'time', label: 'Andere Uhrzeit, gleicher Tag' }, { value: 'date', label: 'An einen anderen Tag' }] },
      { name: 'date', label: 'Neuer Tag', type: 'date', showIf: { field: 'mode', in: ['date'] } },
      { name: 'time', label: 'Neue Uhrzeit', type: 'time', required: true }
    ],
    values: { mode: 'time', date: D.add(k, 1), time: cur },
    submitLabel: 'Verschieben',
    onSubmit(v) {
      if (v.mode === 'date' && (!v.date || v.date === k)) {
        if (!v.date) { toast('Bitte wähle einen Tag.'); return false; }
        v.mode = 'time';
      }
      commit(() => {
        const d = day(k);
        if (v.mode === 'time') {
          if (recurring) d.overrides[id] = { time: v.time }; else item.time = v.time;
        } else {
          const copy = { id: uid(), title: item.title, time: v.time, priority: item.priority, note: item.note || '' };
          day(v.date).extra.push(copy);
          if (recurring) d.hidden.push(id); else d.extra = d.extra.filter(i => i.id !== id);
          delete d.done[id];
        }
      });
      toast(v.mode === 'time' ? `Auf ${v.time} Uhr verschoben` : `Auf ${D.fmt(v.date, { weekday: 'short', day: 'numeric', month: 'short' })} verschoben`);
    }
  });
}

function openPlanTime(k, id) {
  const f = findPlanItem(k, id); if (!f) return;
  const { item, recurring } = f;
  const cur = (recurring && dayR(k).overrides?.[id]?.time) || item.time;
  openForm({
    title: 'Uhrzeit ändern', intro: esc(item.title),
    fields: [
      { name: 'time', label: 'Uhrzeit', type: 'time', required: true },
      ...(recurring ? [{ name: 'scope', label: 'Gilt für', type: 'select', options: [{ value: 'day', label: 'Nur diesen Tag' }, { value: 'all', label: 'Dauerhaft (alle passenden Tage)' }] }] : [])
    ],
    values: { time: cur, scope: 'day' },
    onSubmit(v) {
      commit(() => {
        if (!recurring) item.time = v.time;
        else if (v.scope === 'all') { item.time = v.time; delete day(k).overrides[id]; }
        else day(k).overrides[id] = { time: v.time };
      });
    }
  });
}

Pages.plan = {
  title: () => 'Tagesplan',
  render() {
    const k = App.ui.planDate, today = D.key(), wd = D.wd(k);
    const d = dayR(k);
    const plan = planFor(k);
    const events = S.events.filter(e => e.date === k);
    const prog = dayProgress(k);
    const f = App.ui.planFilter;
    const doneN = plan.filter(i => d.done?.[i.id]).length;
    const now = D.nowHM();
    const nowItem = k === today ? [...plan].reverse().find(i => i.time <= now) : null;

    const rows = [
      ...plan.map(i => ({ kind: 'plan', time: i.time, i })),
      ...events.map(e => ({ kind: 'event', time: e.time || '00:00', e }))
    ].sort((a, b) => a.time.localeCompare(b.time))
      .filter(r => r.kind === 'event' || f === 'all' || (f === 'done') === !!d.done?.[r.i.id]);

    const tplDay = App.ui.tplDay ?? wd;
    const tplOn = S.schedule.filter(i => i.days.includes(tplDay)).sort((a, b) => a.time.localeCompare(b.time));
    const tplOff = S.schedule.filter(i => !i.days.includes(tplDay)).sort((a, b) => a.time.localeCompare(b.time));
    const changed = (d.hidden?.length || 0) + Object.keys(d.overrides || {}).length;

    return `
    ${pageHead('Mein Tagesplan', esc(D.fmt(k, { weekday: 'long', day: 'numeric', month: 'long' })),
      `Schwerpunkt: ${esc(S.week.focus[wd] || '–')}`,
      `<div class="date-nav">
        ${iconBtn('chevL', 'data-action="plan-date" data-shift="-1"', 'Vorheriger Tag')}
        <button class="btn ${k === today ? 'soft' : 'ghost'} sm" data-action="plan-date" data-shift="0">Heute</button>
        ${iconBtn('chevR', 'data-action="plan-date" data-shift="1"', 'Nächster Tag')}
        <input type="date" value="${k}" data-change="plan-date-pick" aria-label="Datum wählen">
      </div>`)}

    <div class="info mb">${icon('leaf')}<span>Dein Tagesplan ist ein <strong>flexibler Rahmen</strong>, keine starre Verpflichtung. Verschiebe, streiche oder ergänze, was sich heute richtig anfühlt.</span></div>

    <div class="grid g3 mt">
      <div class="card span2">
        <div class="card-head">
          <div class="chips" role="tablist">
            ${[['all', 'Alle'], ['open', 'Offen'], ['done', `Erledigt (${doneN})`]].map(([id, l]) => `<button class="chip ${f === id ? 'on' : ''}" data-action="plan-filter" data-f="${id}">${l}</button>`).join('')}
          </div>
          <div class="btn-row">
            ${addBtn('Termin', `data-action="crud-add" data-path="events" data-form="event" data-date="${k}"`, 'ghost')}
            ${addBtn('Aktivität', 'data-action="plan-add"', 'primary')}
          </div>
        </div>
        <div class="mb">${progressBar(prog.pct)}<p class="muted small mt-s">${doneN} von ${plan.length} Aktivitäten erledigt · Tagesfortschritt ${prog.pct}%</p></div>
        ${rows.length ? `<div class="timeline">${rows.map(r => r.kind === 'event' ? `
          <div class="tl-item event">
            <span class="tl-time">${r.e.time || '–'}</span>
            <span class="check" style="border-style:dashed" aria-hidden="true">${icon('calendar')}</span>
            <div class="tl-body" data-action="crud-edit" data-path="events" data-form="event" data-id="${r.e.id}"><div class="tl-title"><span>${esc(r.e.title)}</span><span class="badge important">Termin</span></div>${r.e.note ? `<div class="tl-note">${esc(r.e.note)}</div>` : ''}</div>
            <div class="tl-actions">${iconBtn('pen', `data-action="crud-edit" data-path="events" data-form="event" data-id="${r.e.id}"`, 'Termin bearbeiten')}</div>
          </div>` : (() => {
            const i = r.i, on = !!d.done?.[i.id];
            return `
          <div class="tl-item ${on ? 'done' : ''} ${nowItem && nowItem.id === i.id && !on ? 'now' : ''}">
            <button class="tl-time" data-action="plan-time" data-id="${i.id}" title="Uhrzeit ändern">${i.time}</button>
            ${checkBtn(on, `data-action="plan-toggle" data-date="${k}" data-id="${i.id}"`, i.title)}
            <div class="tl-body" data-action="plan-toggle" data-date="${k}" data-id="${i.id}">
              <div class="tl-title"><span>${esc(i.title)}</span>
                ${i.priority === 'important' ? '<span class="badge important">wichtig</span>' : ''}
                ${i.priority === 'optional' ? '<span class="badge optional">optional</span>' : ''}
                ${!i.recurring ? '<span class="badge once">einmalig</span>' : ''}
                ${i.moved ? `<span class="badge">verschoben · sonst ${i.baseTime}</span>` : ''}
              </div>
              ${i.note ? `<div class="tl-note">${esc(i.note)}</div>` : ''}
            </div>
            <div class="tl-actions">
              ${iconBtn('pen', `data-action="plan-edit" data-id="${i.id}"`, 'Bearbeiten')}
              ${iconBtn('move', `data-action="plan-move" data-id="${i.id}"`, 'Verschieben')}
              ${iconBtn('trash', `data-action="plan-del" data-id="${i.id}"`, 'Entfernen')}
            </div>
            <div class="tl-more">${iconBtn('more', `data-action="plan-more" data-id="${i.id}"`, 'Optionen')}</div>
          </div>`;
          })()).join('')}</div>` : emptyState(f === 'done' ? 'Noch nichts abgehakt – und das ist okay.' : f === 'open' ? 'Alles erledigt. Wunderbar!' : 'Für diesen Tag ist nichts geplant.', 'moon')}
        ${changed ? `<button class="btn ghost sm mt" data-action="plan-reset-day">${icon('undo')}<span>Änderungen an diesem Tag zurücksetzen (${changed})</span></button>` : ''}
      </div>

      <div class="stack">
        <div class="card tint-sand">
          <div class="card-head"><div><p class="eyebrow">Notizen</p><h3>Zu diesem Tag</h3></div></div>
          <textarea rows="6" data-change="plan-note" placeholder="Gedanken, Erledigungen, Ideen für den Tag …" aria-label="Tagesnotiz">${esc(d.note || '')}</textarea>
          <p class="muted small mt-s">Wird automatisch gespeichert.</p>
        </div>
        <div class="card">
          <p class="eyebrow">Legende</p>
          <div class="stack" style="gap:8px;font-size:14px">
            <div><span class="badge important">wichtig</span> zählt fest zu deinem Tag</div>
            <div><span class="badge optional">optional</span> schön, aber kein Muss – zählt nur, wenn erledigt</div>
            <div><span class="badge once">einmalig</span> nur an diesem Tag</div>
          </div>
        </div>
      </div>
    </div>

    <h2 class="section-title">Wochentage individuell gestalten</h2>
    <div class="card">
      <p class="muted small" style="margin-bottom:14px">Hier legst du deinen wiederkehrenden Rhythmus fest. Schalte Aktivitäten für einzelne Wochentage an oder aus.</p>
      <div class="day-tabs">${WDS.map((w, i) => `<button class="day-tab ${i === tplDay ? 'active' : ''}" data-action="tpl-day" data-wd="${i}">${w}</button>`).join('')}</div>
      <div class="card-head" style="margin-bottom:6px"><h3>${WD[tplDay]} <span class="muted small">· ${tplOn.length} Aktivitäten</span></h3>${addBtn(`Für ${WD[tplDay]} hinzufügen`, `data-action="tpl-add" data-wd="${tplDay}"`)}</div>
      <div>${tplOn.map(i => tplRow(i, tplDay, true)).join('') || emptyState('An diesem Tag ist noch nichts eingeplant.')}</div>
      ${tplOff.length ? `<details class="mt"><summary class="muted small" style="cursor:pointer">Nicht an diesem Tag (${tplOff.length})</summary>${tplOff.map(i => tplRow(i, tplDay, false)).join('')}</details>` : ''}
    </div>`;
  },
  actions: {
    'plan-date'(d) { App.ui.planDate = d.shift === '0' ? D.key() : D.add(App.ui.planDate, Number(d.shift)); App.render(); },
    'plan-filter'(d) { App.ui.planFilter = d.f; App.render(); },
    'plan-add'() { openPlanAdd(App.ui.planDate); },
    'plan-edit'(d) { openPlanEdit(App.ui.planDate, d.id); },
    'plan-move'(d) { openPlanMove(App.ui.planDate, d.id); },
    'plan-del'(d) { deletePlanItem(App.ui.planDate, d.id); },
    'plan-time'(d) { openPlanTime(App.ui.planDate, d.id); },
    async 'plan-more'(d) {
      const k = App.ui.planDate, f = findPlanItem(k, d.id); if (!f) return;
      const c = await choiceDialog(f.item.title, '', [
        { label: 'Bearbeiten', sub: 'Titel, Markierung, Wochentage, Notiz', value: 'edit' },
        { label: 'Uhrzeit ändern', value: 'time' },
        { label: 'Verschieben', sub: 'Andere Uhrzeit oder anderer Tag', value: 'move' },
        { label: 'Entfernen', value: 'del', danger: true }
      ]);
      if (c === 'edit') openPlanEdit(k, d.id);
      if (c === 'time') openPlanTime(k, d.id);
      if (c === 'move') openPlanMove(k, d.id);
      if (c === 'del') deletePlanItem(k, d.id);
    },
    'plan-reset-day'() { commit(() => { const dd = day(App.ui.planDate); dd.hidden = []; dd.overrides = {}; }); toast('Tag zurückgesetzt'); },
    'tpl-day'(d) { App.ui.tplDay = Number(d.wd); App.render(); },
    'tpl-toggle'(d) {
      commit(s => {
        const it = s.schedule.find(i => i.id === d.id); if (!it) return;
        const wd = Number(d.wd);
        it.days = it.days.includes(wd) ? it.days.filter(x => x !== wd) : [...it.days, wd].sort();
      });
    },
    'tpl-edit'(d) { openPlanEdit(App.ui.planDate, d.id); },
    'tpl-add'(d) { openPlanAdd(App.ui.planDate, [Number(d.wd)]); }
  },
  changes: {
    'plan-date-pick'(d, el) { if (el.value) { App.ui.planDate = el.value; App.render(); } },
    'plan-note'(d, el) { commit(() => { day(App.ui.planDate).note = el.value; }, { render: false }); toast('Notiz gespeichert ✓'); }
  }
};

function tplRow(i, wd, on) {
  return `<div class="tpl-row ${on ? '' : 'off'}">
    <span class="t">${i.time}</span>
    <span class="n">${esc(i.title)} ${i.priority !== 'normal' ? `<span class="badge ${i.priority}">${i.priority === 'important' ? 'wichtig' : 'optional'}</span>` : ''}<br><span class="muted small">${i.days.length === 7 ? 'Jeden Tag' : i.days.map(x => WDS[x]).join(' · ') || 'Kein Tag'}</span></span>
    ${iconBtn('pen', `data-action="tpl-edit" data-id="${i.id}"`, 'Bearbeiten')}
    <button class="switch ${on ? 'on' : ''}" data-action="tpl-toggle" data-id="${i.id}" data-wd="${wd}" aria-pressed="${on}" aria-label="${esc(i.title)} am ${WD[wd]}"></button>
  </div>`;
}
