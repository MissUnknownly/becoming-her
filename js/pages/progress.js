/* Meine Fortschritte – Statistiken */

function metrics() {
  let habitChecks = 0;
  for (const k in S.habitLog) habitChecks += Object.values(S.habitLog[k]).filter(Boolean).length;
  return {
    habitChecks,
    strength: S.health.workouts.filter(w => w.type === 'Krafttraining').length,
    workouts: S.health.workouts.length,
    books: S.knowledge.books.filter(b => b.status === 'done').length,
    langMin: S.knowledge.langLog.reduce((a, l) => a + (Number(l.minutes) || 0), 0),
    challenges: S.social.challenges.filter(c => c.done).length,
    reflections: S.reflections.length,
    journal: S.mindset.journal.length,
    recipes: S.hobbies.recipes.filter(r => r.status !== 'idea').length,
    ideas: S.hobbies.ideas.filter(i => i.done).length
  };
}
function habitChecksBetween(from, to) {
  let c = 0;
  for (const k in S.habitLog) if (k >= from && k <= to) c += Object.values(S.habitLog[k]).filter(Boolean).length;
  return c;
}
function monthAvg(mk) {
  const vals = Object.entries(S.history).filter(([k, h]) => k.startsWith(mk) && h.total).map(([, h]) => h.pct);
  return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
}

FORMS.achievement = { title: 'Persönlicher Erfolg', fields: [{ name: 'text', label: 'Was hast du erreicht?', required: true, placeholder: 'z. B. Zum ersten Mal alleine im Kino' }, { name: 'date', label: 'Datum', type: 'date', required: true }], defaults: () => ({ date: D.key() }) };

Pages.fortschritte = {
  title: () => 'Fortschritte',
  render() {
    const k = D.key(), ws = D.weekStart(k), m = metrics();
    const daily = Array.from({ length: 14 }, (_, i) => { const d = D.add(k, i - 13); return { label: i % 2 || i === 13 ? D.parse(d).getDate() + '.' : '', title: D.fmt(d), value: S.history[d]?.pct || 0, hl: d === k }; });
    const weekly = Array.from({ length: 8 }, (_, i) => { const w = D.add(ws, (i - 7) * 7); return { label: D.short(w), title: 'Woche ab ' + D.fmt(w), value: weekAvg(w), hl: w === ws }; });
    const months = Array.from({ length: 6 }, (_, i) => { const dt = D.parse(k); dt.setDate(1); dt.setMonth(dt.getMonth() - (5 - i)); const mk = D.key(dt).slice(0, 7); return { label: dt.toLocaleDateString('de-DE', { month: 'short' }), value: monthAvg(mk), hl: i === 5 }; });
    const thisW = habitChecksBetween(ws, D.add(ws, 6)), lastW = habitChecksBetween(D.add(ws, -7), D.add(ws, -1));
    const mk = k.slice(0, 7), dtp = D.parse(k); dtp.setDate(1); dtp.setMonth(dtp.getMonth() - 1); const pmk = D.key(dtp).slice(0, 7);
    const thisM = habitChecksBetween(mk + '-01', mk + '-31'), lastM = habitChecksBetween(pmk + '-01', pmk + '-31');
    const train = Array.from({ length: 8 }, (_, i) => { const w = D.add(ws, (i - 7) * 7); const xs = S.health.workouts.filter(x => D.weekStart(x.date) === w); return { label: D.short(w), value: xs.length, hl: w === ws, cls: '' }; });
    const lang = Array.from({ length: 8 }, (_, i) => { const w = D.add(ws, (i - 7) * 7); return { label: D.short(w), value: weekMinutes(null, w), hl: w === ws, cls: 'rose' }; });
    const cats = HABIT_CATS.map(c => { const hs = activeHabits().filter(h => h.category === c.id); const st = hs.map(h => habitStats(h, 30)); return { name: c.name, done: st.reduce((a, x) => a + x.done, 0), due: st.reduce((a, x) => a + x.due, 0) }; });
    const booksDone = S.knowledge.books.filter(b => b.status === 'done');
    const reading = S.knowledge.books.filter(b => b.status === 'reading');
    const unlocked = MILESTONES.filter(x => x.test(m)), locked = MILESTONES.filter(x => !x.test(m));
    const ach = [...S.achievements].sort((a, b) => b.date.localeCompare(a.date));
    const diff = (a, b, unit) => a > b ? `<span class="badge sage">+${a - b} ${unit}</span>` : a === b && a ? '<span class="badge">gleich viel</span>' : '';

    return `
    ${pageHead('Meine Fortschritte', 'Dein Weg in Zahlen', 'Hier vergleichst du dich nur mit einer Person: deinem früheren Ich.')}
    <div class="stat-row">
      <div class="stat-box stat"><strong>${m.habitChecks}</strong><span>Gewohnheiten erledigt</span></div>
      <div class="stat-box stat"><strong>${m.strength}</strong><span>Krafttrainings</span></div>
      <div class="stat-box stat"><strong>${m.books}</strong><span>Bücher gelesen</span></div>
      <div class="stat-box stat"><strong>${fmtNum(m.langMin / 60)} h</strong><span>Sprachen gelernt</span></div>
      <div class="stat-box stat"><strong>${m.challenges}</strong><span>Mut-Momente</span></div>
    </div>

    <h2 class="section-title">Ich im Vergleich zu meinem früheren Ich</h2>
    <div class="grid g2">
      <div class="card"><div class="card-head"><h3>Diese Woche</h3>${diff(thisW, lastW, 'mehr')}</div><div class="compare"><div><span class="lbl">Letzte Woche</span><strong>${lastW}</strong><span class="muted small">Gewohnheiten</span></div><div style="background:var(--sage-soft)"><span class="lbl">Diese Woche</span><strong>${thisW}</strong><span class="muted small">Gewohnheiten</span></div></div></div>
      <div class="card"><div class="card-head"><h3>Dieser Monat</h3>${diff(thisM, lastM, 'mehr')}</div><div class="compare"><div><span class="lbl">Letzter Monat</span><strong>${lastM}</strong><span class="muted small">Gewohnheiten</span></div><div style="background:var(--rose-soft)"><span class="lbl">Dieser Monat</span><strong>${thisM}</strong><span class="muted small">Gewohnheiten</span></div></div></div>
    </div>
    <p class="muted small mt-s">Weniger als früher? Völlig okay. Jede Phase im Leben hat ihr eigenes Tempo.</p>

    <h2 class="section-title">Tagesfortschritt</h2>
    <div class="grid g3">
      <div class="card span2"><div class="card-head"><h3>Täglich</h3><span class="muted small">letzte 14 Tage · %</span></div>${barChart(daily, { height: 140, max: 100, suffix: '%' })}</div>
      <div class="card"><div class="card-head"><h3>Monatlich</h3><span class="muted small">Ø %</span></div>${barChart(months, { height: 140, max: 100, suffix: '%' })}</div>
      <div class="card span2"><div class="card-head"><h3>Wöchentlich</h3><span class="muted small">Ø pro Woche · %</span></div>${barChart(weekly, { height: 120, max: 100, suffix: '%' })}</div>
      <div class="card"><div class="card-head"><h3>Gewohnheiten</h3><span class="muted small">30 Tage</span></div>${cats.map(c => hbar(c.name, c.done, c.due, `${pct(c.done, c.due)}%`)).join('')}<a class="btn ghost sm" href="#/habits" data-action="goto-habit-stats">Details</a></div>
    </div>

    <h2 class="section-title">Körper, Wissen & Mut</h2>
    <div class="grid g2">
      <div class="card"><div class="card-head"><h3>Trainingstage</h3><span class="muted small">Einheiten pro Woche</span></div>${barChart(train, { height: 110 })}</div>
      <div class="card"><div class="card-head"><h3>Lernfortschritt</h3><span class="muted small">Sprach-Minuten pro Woche</span></div>${barChart(lang, { height: 110 })}</div>
      <div class="card"><div class="card-head"><h3>Gelesene Bücher</h3><span class="muted small">${booksDone.length} beendet</span></div>
        ${reading.map(b => hbar(b.title, b.currentPage, b.pages, `${pct(b.currentPage, b.pages)}%`)).join('')}
        ${booksDone.slice(-5).reverse().map(b => `<div class="list-item"><span class="ms-ic">${icon('book')}</span><div class="li-body"><div class="li-title">${esc(b.title)}</div><div class="li-sub">${b.finished ? esc(D.long(b.finished)) : ''}</div></div>${stars(b.rating)}</div>`).join('') || (!reading.length ? emptyState('Noch kein Buch beendet – das erste kommt bestimmt.', 'book') : '')}</div>
      <div class="card"><div class="card-head"><h3>Absolvierte Herausforderungen</h3></div>
        ${CHALLENGE_LEVELS.map(l => { const xs = S.social.challenges.filter(c => c.level === l.level); return hbar(`${l.level} · ${l.name}`, xs.filter(c => c.done).length, xs.length, `${xs.filter(c => c.done).length}/${xs.length}`); }).join('')}</div>
    </div>

    <h2 class="section-title">Erfolge & Meilensteine</h2>
    <div class="grid g2">
      <div class="card tint-sage"><div class="card-head"><h3>Meilensteine</h3><span class="muted small">${unlocked.length} von ${MILESTONES.length}</span></div>
        ${unlocked.map(x => `<div class="ms"><span class="ms-ic">${icon(x.icon)}</span><span>${esc(x.text)}</span></div>`).join('')}
        ${locked.slice(0, 4).map(x => `<div class="ms locked"><span class="ms-ic">${icon(x.icon)}</span><span>${esc(x.text)} <span class="small">· noch vor dir</span></span></div>`).join('')}</div>
      <div class="card tint-rose"><div class="card-head"><h3>Persönliche Erfolge</h3>${addBtn('Erfolg', 'data-action="crud-add" data-path="achievements" data-form="achievement"')}</div>
        ${ach.length ? `<div class="list">${ach.map(a => `<div class="list-item"><span class="ms-ic">${icon('star')}</span><div class="li-body"><div class="li-title">${esc(a.text)}</div><div class="li-sub">${esc(D.long(a.date))}</div></div>${editDel('achievements', 'achievement', a.id)}</div>`).join('')}</div>` : emptyState('Halte hier fest, worauf du stolz bist – große und kleine Dinge.', 'star')}</div>
    </div>`;
  },
  actions: { 'goto-habit-stats'() { App.ui.tabs.habits = 'statistik'; location.hash = '#/habits'; } }
};
