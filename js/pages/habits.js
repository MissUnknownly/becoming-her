/* Habit Tracker */

FORMS.habit = {
  title: 'Gewohnheit', addTitle: 'Neue Gewohnheit', editTitle: 'Gewohnheit bearbeiten',
  fields: [
    { name: 'name', label: 'Gewohnheit', required: true, placeholder: 'z. B. 10 Minuten dehnen' },
    { name: 'category', label: 'Kategorie', type: 'select', options: HABIT_CATS.map(c => ({ value: c.id, label: c.name })) },
    { name: 'ftype', label: 'Häufigkeit', type: 'select', options: [{ value: 'daily', label: 'Täglich' }, { value: 'days', label: 'An bestimmten Wochentagen' }, { value: 'weekly', label: 'X-mal pro Woche (flexibel)' }] },
    { name: 'days', label: 'Wochentage', type: 'days', showIf: { field: 'ftype', in: ['days'] } },
    { name: 'times', label: 'Wie oft pro Woche?', type: 'number', min: 1, max: 7, showIf: { field: 'ftype', in: ['weekly'] } }
  ],
  defaults: d => ({ category: d.cat || 'mindset', ftype: 'daily', days: [0, 2, 4], times: 3 }),
  toForm: h => ({ ...h, ftype: h.freq?.type || 'daily', days: h.freq?.days || [0, 2, 4], times: h.freq?.times || 3 }),
  prepare: (v, item) => {
    const freq = v.ftype === 'days' ? { type: 'days', days: v.days.length ? v.days : [D.wd(D.key())] }
      : v.ftype === 'weekly' ? { type: 'weekly', times: clamp(Math.round(v.times || 1), 1, 7) } : { type: 'daily' };
    return { name: v.name, category: v.category, freq, ...(item ? {} : { archived: false, created: D.key() }) };
  },
  added: 'Neue Gewohnheit angelegt ✓'
};

/* Statistik einer Gewohnheit über n Tage (bis heute) */
function habitStats(h, days = 30) {
  const today = D.key();
  if (h.freq?.type === 'weekly') {
    const weeks = Math.ceil(days / 7); let got = 0, need = 0;
    for (let w = 0; w < weeks; w++) {
      const ws = D.add(D.weekStart(today), -7 * w);
      if (D.add(ws, 6) < (h.created || S.createdAt)) continue;
      need += h.freq.times; got += Math.min(habitWeekCount(h, ws), h.freq.times);
    }
    return { done: got, due: need, rate: pct(got, need) };
  }
  let done = 0, due = 0;
  for (let i = 0; i < days; i++) {
    const k = D.add(today, -i);
    if (k < (h.created || S.createdAt)) break;
    if (habitDue(h, k)) { due++; if (habitDone(h, k)) done++; }
  }
  return { done, due, rate: pct(done, due) };
}
function totalCheckins(h) { let c = 0; for (const k in S.habitLog) if (S.habitLog[k][h.id]) c++; return c; }

Pages.habits = {
  title: () => 'Habit Tracker',
  render() {
    const tab = App.ui.tabs.habits || 'heute';
    const body = { heute: this.today, woche: this.week, monat: this.month, statistik: this.stats, verwalten: this.manage }[tab].call(this);
    return `
    ${pageHead('Habit Tracker', 'Meine Gewohnheiten', 'Kleine Gewohnheiten, freundlich begleitet. Ohne Druck, ohne Bestrafung – jeder Haken ist ein Geschenk an dich.',
      addBtn('Gewohnheit', 'data-action="crud-add" data-path="habits" data-form="habit"', 'primary'))}
    ${tabs('habits', [{ id: 'heute', label: 'Heute' }, { id: 'woche', label: 'Woche' }, { id: 'monat', label: 'Monat' }, { id: 'statistik', label: 'Statistik' }, { id: 'verwalten', label: 'Verwalten' }], tab)}
    ${body}`;
  },

  today() {
    const k = App.ui.habitDate, today = D.key();
    const due = S.habits.filter(h => habitDue(h, k));
    const done = due.filter(h => habitDone(h, k)).length;
    const others = activeHabits().filter(h => !habitDue(h, k));
    return `
    <div class="card-head">
      <h2 style="font-size:28px">${k === today ? 'Heute' : esc(D.fmt(k))}</h2>
      <div class="date-nav">
        ${iconBtn('chevL', 'data-action="habit-date" data-n="-1"', 'Vorheriger Tag')}
        <button class="btn ${k === today ? 'soft' : 'ghost'} sm" data-action="habit-date" data-n="0">Heute</button>
        ${k < today ? iconBtn('chevR', 'data-action="habit-date" data-n="1"', 'Nächster Tag') : ''}
      </div>
    </div>
    <div class="card tint-sage" style="margin-bottom:20px">
      <div class="progress-card">${ring(pct(done, due.length), 96)}<div><p class="msg">${esc(done === due.length && due.length ? 'Alles geschafft – wie schön!' : done ? 'Jeder Haken zählt. Du bist dabei.' : 'Such dir eine kleine Gewohnheit aus und fang einfach an.')}</p><p class="muted small mt-s">${done} von ${due.length} Gewohnheiten</p></div></div>
    </div>
    <div class="grid g2">
      ${HABIT_CATS.map(c => {
        const list = due.filter(h => h.category === c.id);
        if (!list.length) return '';
        const dn = list.filter(h => habitDone(h, k)).length;
        return `<div class="card"><div class="habit-cat"><h3><span>${c.name}</span><span>${dn}/${list.length}</span></h3></div>
          <div class="check-list">${list.map(h => {
            const sub = h.freq?.type === 'weekly' ? `${habitWeekCount(h, k)} von ${h.freq.times} diese Woche` : freqLabel(h);
            return checkRow(h.name, habitDone(h, k), `data-action="habit-toggle" data-date="${k}" data-id="${h.id}"`, '', sub);
          }).join('')}</div></div>`;
      }).join('')}
    </div>
    ${others.length ? `<p class="muted small mt">Heute nicht geplant: ${others.map(h => esc(h.name)).join(', ')}</p>` : ''}`;
  },

  week() {
    const ws = App.ui.habitWeek, today = D.key();
    const days = ALL_DAYS.map(i => D.add(ws, i));
    const list = activeHabits();
    return `
    <div class="card">
      <div class="card-head"><h3>${esc(D.weekLabel(ws))}</h3>
        <div class="date-nav">${iconBtn('chevL', 'data-action="habit-week" data-n="-7"', 'Vorherige Woche')}<button class="btn ghost sm" data-action="habit-week" data-n="0">Diese Woche</button>${iconBtn('chevR', 'data-action="habit-week" data-n="7"', 'Nächste Woche')}</div>
      </div>
      <div class="table-wrap"><table class="htable">
        <thead><tr><th>Gewohnheit</th>${days.map((k, i) => `<th class="${k === today ? 'today' : ''}">${WDS[i]}<br><span style="font-weight:400">${D.parse(k).getDate()}.</span></th>`).join('')}<th>Woche</th></tr></thead>
        <tbody>${HABIT_CATS.map(c => {
          const hs = list.filter(h => h.category === c.id); if (!hs.length) return '';
          return `<tr><td colspan="9" class="muted small" style="padding-top:12px;letter-spacing:.14em;text-transform:uppercase">${c.name}</td></tr>` + hs.map(h => {
            const count = days.filter(k => habitDone(h, k)).length;
            const goal = h.freq?.type === 'weekly' ? h.freq.times : days.filter(k => habitDue(h, k)).length;
            return `<tr><td title="${esc(h.name)}">${esc(h.name)}</td>${days.map(k => {
              const on = habitDone(h, k), due = habitDue(h, k), fut = k > today;
              return `<td><button class="hcell ${on ? 'on' : ''} ${due ? 'due' : 'off'}" ${fut ? 'disabled style="opacity:.35"' : `data-action="habit-toggle" data-date="${k}" data-id="${h.id}"`} aria-label="${esc(h.name)} am ${esc(D.fmt(k))}">${icon('check')}</button></td>`;
            }).join('')}<td class="muted small nowrap">${count}/${goal}</td></tr>`;
          }).join('');
        }).join('')}</tbody>
      </table></div>
      <p class="muted small mt">Gestrichelte Felder sind an diesem Tag nicht geplant – du kannst sie trotzdem abhaken.</p>
    </div>`;
  },

  month() {
    const mk = App.ui.habitMonth, today = D.key();
    const [y, m] = mk.split('-').map(Number);
    const first = `${mk}-01`;
    const daysIn = new Date(y, m, 0).getDate();
    const pad = D.wd(first);
    const filter = App.ui.habitFilter;
    const list = activeHabits();
    const fh = list.find(h => h.id === filter);
    let sum = 0, cnt = 0;
    const cells = [];
    for (let i = 1; i <= daysIn; i++) {
      const k = `${mk}-${String(i).padStart(2, '0')}`;
      let lvl = 0, title = '';
      if (k <= today) {
        if (fh) { lvl = habitDone(fh, k) ? 4 : 0; title = habitDone(fh, k) ? 'erledigt' : ''; }
        else {
          const due = list.filter(h => habitDue(h, k) && h.freq?.type !== 'weekly').length || 1;
          const done = list.filter(h => habitDone(h, k)).length;
          const r = Math.min(done / due, 1);
          lvl = done ? (r < .25 ? 1 : r < .5 ? 2 : r < .8 ? 3 : 4) : 0;
          title = `${done} erledigt`; if (done) { sum += done; cnt++; }
        }
      }
      cells.push(`<button class="mday l${lvl} ${k === today ? 'today' : ''} ${k > today ? 'future' : ''}" data-action="habit-goto" data-date="${k}" title="${esc(D.fmt(k))}${title ? ': ' + title : ''}">${i}</button>`);
    }
    const monthName = D.parse(first).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
    return `
    <div class="grid g3">
      <div class="card span2">
        <div class="card-head"><h3>${esc(monthName)}</h3>
          <div class="date-nav">${iconBtn('chevL', 'data-action="habit-month" data-n="-1"', 'Vorheriger Monat')}<button class="btn ghost sm" data-action="habit-month" data-n="0">Aktuell</button>${iconBtn('chevR', 'data-action="habit-month" data-n="1"', 'Nächster Monat')}</div>
        </div>
        <select data-change="habit-filter" style="margin-bottom:16px" aria-label="Gewohnheit filtern">
          <option value="all">Alle Gewohnheiten</option>
          ${list.map(h => `<option value="${h.id}" ${h.id === filter ? 'selected' : ''}>${esc(h.name)}</option>`).join('')}
        </select>
        <div class="month">${WDS.map(w => `<div class="mh">${w}</div>`).join('')}${'<div class="mday pad"></div>'.repeat(pad)}${cells.join('')}</div>
        <div class="legend">Weniger <i style="background:var(--cream)"></i><i style="background:#E8EEE5"></i><i style="background:#CFDCCB"></i><i style="background:#A9BEA5"></i><i style="background:var(--sage-deep)"></i> Mehr</div>
        <p class="muted small mt-s">Tippe auf einen Tag, um ihn in der Tagesansicht zu öffnen und nachzutragen.</p>
      </div>
      <div class="card tint-sand">
        <p class="eyebrow">Dieser Monat</p>
        <div class="stat"><strong>${fh ? cells.filter(c => c.includes(' l4 ')).length : sum}</strong><span>${fh ? 'Tage mit „' + esc(fh.name) + '“' : 'erledigte Gewohnheiten'}</span></div>
        ${!fh ? `<div class="stat mt"><strong>${cnt}</strong><span>aktive Tage</span></div>` : ''}
        <p class="mt muted small">Es geht nicht um perfekte Monate, sondern darum, immer wieder zu dir zurückzukommen.</p>
      </div>
    </div>`;
  },

  stats() {
    const list = activeHabits();
    const st = list.map(h => ({ h, ...habitStats(h, 30), total: totalCheckins(h) }));
    const catRates = HABIT_CATS.map(c => {
      const xs = st.filter(x => x.h.category === c.id);
      const done = xs.reduce((a, x) => a + x.done, 0), due = xs.reduce((a, x) => a + x.due, 0);
      return { c, done, due, rate: pct(done, due) };
    });
    const today = D.key();
    const last14 = Array.from({ length: 14 }, (_, i) => {
      const k = D.add(today, i - 13);
      const n = list.filter(h => habitDone(h, k)).length;
      return { label: i % 2 === 1 || i === 13 ? WDS[D.wd(k)] : '', title: D.fmt(k), value: n, hl: k === today };
    });
    const total = st.reduce((a, x) => a + x.total, 0);
    const best = [...st].filter(x => x.due).sort((a, b) => b.rate - a.rate).slice(0, 3);
    return `
    <div class="stat-row" style="margin-bottom:20px">
      <div class="stat-box stat"><strong>${total}</strong><span>Haken insgesamt</span></div>
      <div class="stat-box stat"><strong>${list.length}</strong><span>aktive Gewohnheiten</span></div>
      <div class="stat-box stat"><strong>${S.habits.filter(h => h.archived).length}</strong><span>gefestigt & archiviert</span></div>
      <div class="stat-box stat"><strong>${pct(st.reduce((a, x) => a + x.done, 0), st.reduce((a, x) => a + x.due, 0))}%</strong><span>der letzten 30 Tage</span></div>
    </div>
    <div class="grid g2">
      <div class="card"><div class="card-head"><h3>Letzte 14 Tage</h3></div>${barChart(last14, { height: 140 })}</div>
      <div class="card"><div class="card-head"><h3>Nach Kategorie</h3><span class="muted small">letzte 30 Tage</span></div>
        ${catRates.map(c => hbar(c.c.name, c.done, c.due, `${c.done} von ${c.due}`)).join('')}
      </div>
      <div class="card span2"><div class="card-head"><h3>Jede Gewohnheit</h3><span class="muted small">letzte 30 Tage · seit Beginn</span></div>
        <div class="grid g2" style="gap:4px 28px">${st.map(x => hbar(x.h.name, x.done, x.due, `${x.done}/${x.due} · ${x.total} gesamt`)).join('')}</div>
      </div>
      ${best.length && best[0].rate ? `<div class="card tint-sage span2"><p class="eyebrow">Das läuft schon richtig gut</p><p class="vision-line">${best.filter(b => b.rate).map(b => esc(b.h.name)).join(' · ')}</p><p class="muted small mt-s">Wenn sich eine Gewohnheit ganz natürlich anfühlt, kannst du sie unter „Verwalten“ als gefestigt archivieren.</p></div>` : ''}
    </div>`;
  },

  manage() {
    const archived = S.habits.filter(h => h.archived);
    return `
    <div class="grid g2">
      ${HABIT_CATS.map(c => {
        const list = activeHabits().filter(h => h.category === c.id);
        return `<div class="card"><div class="card-head"><h3>${c.name}</h3>${iconBtn('plus', `data-action="crud-add" data-path="habits" data-form="habit" data-cat="${c.id}"`, 'Gewohnheit hinzufügen')}</div>
          <div class="list">${list.map(h => `<div class="list-item"><div class="li-body"><div class="li-title">${esc(h.name)}</div><div class="li-sub">${freqLabel(h)} · ${totalCheckins(h)}× erledigt</div></div>
            <button class="btn ghost sm" data-action="habit-archive" data-id="${h.id}" title="Als gefestigt archivieren">Archivieren</button>
            ${editDel('habits', 'habit', h.id)}</div>`).join('') || '<p class="muted small">Noch keine Gewohnheiten in dieser Kategorie.</p>'}</div></div>`;
      }).join('')}
    </div>
    <h2 class="section-title">Archiv · gefestigte Gewohnheiten</h2>
    <div class="card">${archived.length ? `<div class="list">${archived.map(h => `<div class="list-item"><div class="li-body"><div class="li-title">${esc(h.name)}</div><div class="li-sub">Archiviert am ${h.archivedAt ? esc(D.long(h.archivedAt)) : '–'} · ${totalCheckins(h)}× erledigt</div></div>
      <button class="btn soft sm" data-action="habit-restore" data-id="${h.id}">Wieder aktivieren</button>${iconBtn('trash', `data-action="crud-del" data-path="habits" data-id="${h.id}"`, 'Endgültig löschen')}</div>`).join('')}</div>`
      : emptyState('Wenn eine Gewohnheit ganz selbstverständlich geworden ist, kannst du sie hier archivieren. Deine bisherigen Einträge bleiben erhalten.', 'star')}</div>`;
  },

  actions: {
    'habit-date'(d) { const t = D.key(); App.ui.habitDate = d.n === '0' ? t : D.add(App.ui.habitDate, Number(d.n)); if (App.ui.habitDate > t) App.ui.habitDate = t; App.render(); },
    'habit-week'(d) { App.ui.habitWeek = d.n === '0' ? D.weekStart(D.key()) : D.add(App.ui.habitWeek, Number(d.n)); App.render(); },
    'habit-month'(d) {
      if (d.n === '0') App.ui.habitMonth = D.key().slice(0, 7);
      else { const [y, m] = App.ui.habitMonth.split('-').map(Number); const dt = new Date(y, m - 1 + Number(d.n), 1); App.ui.habitMonth = D.key(dt).slice(0, 7); }
      App.render();
    },
    'habit-goto'(d) { App.ui.habitDate = d.date; App.ui.tabs.habits = 'heute'; App.render(); },
    'habit-archive'(d) { commit(s => { const h = s.habits.find(x => x.id === d.id); if (h) { h.archived = true; h.archivedAt = D.key(); } }); toast('Gefestigt und archiviert – wie schön!'); },
    'habit-restore'(d) { commit(s => { const h = s.habits.find(x => x.id === d.id); if (h) h.archived = false; }); toast('Wieder aktiv'); }
  },
  changes: {
    'habit-filter'(d, el) { App.ui.habitFilter = el.value; App.render(); }
  }
};
