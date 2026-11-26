/* Wochenreflexion */

const REFL_QS = [
  ['achieved', 'Was habe ich diese Woche erreicht?'],
  ['proud', 'Worauf bin ich stolz?'],
  ['hard', 'Was ist mir schwergefallen?'],
  ['joy', 'Was hat mir Freude bereitet?'],
  ['new', 'Was habe ich Neues ausprobiert?'],
  ['improve', 'Was möchte ich nächste Woche verbessern?']
];

Pages.reflexion = {
  title: () => 'Wochenreflexion',
  render() {
    const today = D.key();
    const ws = App.ui.reflWeek || D.weekStart(today);
    const entry = S.reflections.find(r => r.weekKey === ws);
    const ans = entry?.answers || {};
    const isSunday = D.wd(today) === 6;
    const past = [...S.reflections].sort((a, b) => b.weekKey.localeCompare(a.weekKey));
    const wAvg = weekAvg(ws);
    const strength = S.health.workouts.filter(w => w.type === 'Krafttraining' && D.weekStart(w.date) === ws).length;
    const ch = S.social.challenges.filter(c => c.done && c.doneDate && D.weekStart(c.doneDate) === ws).length;
    return `
    ${pageHead('Jeden Sonntag', 'Wochenreflexion', 'Ein ruhiger Moment, um zurückzuschauen – ohne zu bewerten. Deine Antworten werden mit Datum gespeichert.',
      `<div class="date-nav">${iconBtn('chevL', 'data-action="refl-week" data-n="-7"', 'Vorherige Woche')}<button class="btn ghost sm" data-action="refl-week" data-n="0">Diese Woche</button>${ws < D.weekStart(today) ? iconBtn('chevR', 'data-action="refl-week" data-n="7"', 'Nächste Woche') : ''}</div>`)}
    ${isSunday && ws === D.weekStart(today) && !entry ? `<div class="banner">${icon('sparkle')}<p>Heute ist Sonntag – der perfekte Tag, um durchzuatmen und auf deine Woche zu schauen.</p></div>` : ''}
    <div class="grid g3">
      <div class="card span2">
        <div class="card-head"><div><p class="eyebrow">${esc(D.weekLabel(ws))}</p><h3>${entry ? 'Deine Reflexion' : 'Wie war deine Woche?'}</h3></div>${entry ? `<span class="badge sage">gespeichert am ${esc(D.short(entry.date))}</span>` : ''}</div>
        <form data-submit="refl-save" class="form-grid">
          ${REFL_QS.map(([id, q]) => `<label class="field"><span class="field-label">${q}</span><textarea name="${id}" rows="2">${esc(ans[id] || '')}</textarea></label>`).join('')}
          <div class="field"><div class="btn-row"><button class="btn primary">${entry ? 'Reflexion aktualisieren' : 'Reflexion speichern'}</button>${entry ? `<button type="button" class="btn ghost danger" data-action="crud-del" data-path="reflections" data-id="${entry.id}">${icon('trash')}<span>Löschen</span></button>` : ''}</div></div>
        </form>
      </div>
      <div class="stack">
        <div class="card tint-sage"><p class="eyebrow">Deine Woche in Zahlen</p>
          <dl class="kv mt-s"><dt>Ø Tagesfortschritt</dt><dd>${wAvg}%</dd><dt>Gewohnheiten</dt><dd>${habitChecksBetween(ws, D.add(ws, 6))} erledigt</dd><dt>Krafttrainings</dt><dd>${strength}</dd><dt>Mut-Momente</dt><dd>${ch}</dd></dl>
          <p class="muted small mt">Zahlen sind nur ein Teil der Geschichte. Wie du dich gefühlt hast, zählt genauso.</p></div>
        <div class="card tint-rose"><p class="eyebrow">Für nächste Woche</p><p>Nach dem Speichern kannst du direkt deine kommende Woche planen.</p><a class="btn ghost sm mt" href="#/woche" data-action="refl-next-week">Nächste Woche planen</a></div>
      </div>
    </div>
    <h2 class="section-title">Meine bisherigen Reflexionen</h2>
    ${past.length ? past.map(r => `<details class="entry"><summary><div><h4>${esc(D.weekLabel(r.weekKey))}</h4><span class="muted small">geschrieben am ${esc(D.long(r.date))}</span></div>${icon('chevR', 'chev')}</summary>
      <dl class="qa">${REFL_QS.filter(([id]) => r.answers[id]).map(([id, q]) => `<dt>${q}</dt><dd>${esc(r.answers[id])}</dd>`).join('')}</dl>
      <div class="btn-row mt"><button class="btn ghost sm" data-action="refl-open" data-week="${r.weekKey}">${icon('pen')}<span>Bearbeiten</span></button></div></details>`).join('') : `<div class="card">${emptyState('Deine erste Wochenreflexion wird hier gespeichert – so kannst du später sehen, wie du gewachsen bist.', 'journal')}</div>`}`;
  },
  actions: {
    'refl-week'(d) { const t = D.weekStart(D.key()); let w = d.n === '0' ? t : D.add(App.ui.reflWeek || t, Number(d.n)); if (w > t) w = t; App.ui.reflWeek = w; App.render(); },
    'refl-open'(d) { App.ui.reflWeek = d.week; App.render(); window.scrollTo({ top: 0, behavior: 'smooth' }); },
    'refl-next-week'() { App.ui.weekStart = D.add(D.weekStart(D.key()), 7); location.hash = '#/woche'; }
  },
  submits: {
    'refl-save'(v) {
      const ws = App.ui.reflWeek || D.weekStart(D.key());
      const answers = Object.fromEntries(REFL_QS.map(([id]) => [id, (v[id] || '').trim()]));
      if (!Object.values(answers).some(Boolean)) return toast('Beantworte mindestens eine Frage.');
      commit(s => {
        const e = s.reflections.find(r => r.weekKey === ws);
        if (e) Object.assign(e, { answers, updated: D.key() }); else s.reflections.push({ id: uid(), weekKey: ws, date: D.key(), answers });
      });
      toast('Reflexion gespeichert – danke, dass du dir Zeit für dich nimmst ✓');
    }
  }
};
