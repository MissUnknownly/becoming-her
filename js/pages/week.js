/* Meine Wochenplanung */

FORMS.weekAct = {
  title: 'Aktivität', addTitle: 'Aktivität zur Woche hinzufügen', editTitle: 'Aktivität bearbeiten',
  fields: [
    { name: 'title', label: 'Aktivität', required: true, placeholder: 'z. B. Neues Café ausprobieren' },
    { name: 'wd', label: 'Wochentag', type: 'select', options: WD.map((w, i) => ({ value: i, label: w })), half: true },
    { name: 'repeat', label: 'Wiederholung', type: 'select', options: [{ value: 'weekly', label: 'Jede Woche' }, { value: 'once', label: 'Nur in dieser Woche' }], half: true }
  ],
  defaults: d => ({ wd: Number(d.wd ?? 0), repeat: 'weekly' }),
  toForm: it => ({ ...it, repeat: it.week ? 'once' : 'weekly' }),
  prepare: (v, item) => {
    const ws = item?.week || App.ui.weekStart;
    return { title: v.title, wd: Number(v.wd), week: v.repeat === 'once' ? ws : null };
  }
};

Pages.woche = {
  title: () => 'Wochenplan',
  render() {
    const ws = App.ui.weekStart, today = D.key();
    const checks = S.weekChecks.week?.[ws] || {};
    const acts = S.week.activities.filter(a => !a.week || a.week === ws);
    const doneN = acts.filter(a => checks[a.id]).length;
    const strength = S.health.workouts.filter(w => w.type === 'Krafttraining' && D.weekStart(w.date) === ws).length;
    return `
    ${pageHead('Meine Wochenplanung', 'Deine Woche', esc(D.weekLabel(ws)),
      `<div class="date-nav">
        ${iconBtn('chevL', 'data-action="week-shift" data-n="-7"', 'Vorherige Woche')}
        <button class="btn ${ws === D.weekStart(today) ? 'soft' : 'ghost'} sm" data-action="week-shift" data-n="0">Diese Woche</button>
        ${iconBtn('chevR', 'data-action="week-shift" data-n="7"', 'Nächste Woche')}
      </div>`)}
    <div class="grid g3">
      <div class="card tint-sage"><div class="stat"><strong>${doneN}<span class="muted" style="font-size:20px"> / ${acts.length}</span></strong><span>Aktivitäten diese Woche erledigt</span></div><div class="mt-s">${progressBar(pct(doneN, acts.length))}</div></div>
      <div class="card tint-rose"><div class="stat"><strong>${strength}<span class="muted" style="font-size:20px"> / 3</span></strong><span>Krafttrainings eingetragen</span></div><div class="dots mt-s">${[0, 1, 2].map(i => `<i class="${i < strength ? 'on' : ''}"></i>`).join('')}</div></div>
      <div class="card tint-sand"><p class="eyebrow">Tipp</p><p>Tippe auf den Schwerpunkt eines Tages, um ihn zu ändern. Aktivitäten kannst du abhaken, bearbeiten oder nur für diese Woche planen.</p></div>
    </div>
    <div class="week-grid mt">
      ${WD.map((name, wd) => {
        const k = D.add(ws, wd);
        const list = acts.filter(a => a.wd === wd);
        return `<div class="card day-card ${k === today ? 'today' : ''}">
          <div class="day-card-head"><h3>${name}</h3><span class="muted small">${D.short(k)}</span></div>
          <button class="day-focus" data-action="week-focus" data-wd="${wd}" title="Schwerpunkt bearbeiten">${esc(S.week.focus[wd] || 'Schwerpunkt festlegen …')}</button>
          <div class="check-list">${list.map(a => checkRow(a.title, !!checks[a.id], `data-action="wcheck-toggle" data-list="week" data-week="${ws}" data-id="${a.id}"`,
            editDel('week.activities', 'weekAct', a.id), a.week ? 'nur diese Woche' : '')).join('') || '<p class="muted small">Noch frei.</p>'}</div>
          <div class="btn-row mt-s">
            ${addBtn('Hinzufügen', `data-action="crud-add" data-path="week.activities" data-form="weekAct" data-wd="${wd}"`, 'ghost')}
            <a class="btn ghost sm" href="#/plan" data-action="week-open-day" data-date="${k}">Tagesplan</a>
          </div>
        </div>`;
      }).join('')}
    </div>`;
  },
  actions: {
    'week-shift'(d) { App.ui.weekStart = d.n === '0' ? D.weekStart(D.key()) : D.add(App.ui.weekStart, Number(d.n)); App.render(); },
    'week-open-day'(d) { App.ui.planDate = d.date; location.hash = '#/plan'; },
    'week-focus'(d) {
      const wd = Number(d.wd);
      openForm({
        title: `Schwerpunkt am ${WD[wd]}`, fields: [{ name: 'focus', label: 'Schwerpunkt', placeholder: 'z. B. Krafttraining · Lesen' }],
        values: { focus: S.week.focus[wd] || '' },
        onSubmit(v) { commit(s => { s.week.focus[wd] = v.focus; }); }
      });
    }
  }
};
