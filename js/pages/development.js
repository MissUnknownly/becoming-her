/* Persönlicher Entwicklungsplan */

function phaseTimeline() {
  const start = S.profile.startDate || S.createdAt;
  let offset = 0;
  return S.development.phases.map(p => {
    const len = p.weeks ? p.weeks + (p.extra || 0) : 0;
    const from = D.add(start, offset * 7);
    const to = len ? D.add(start, (offset + len) * 7 - 1) : null;
    const startWeek = offset + 1;
    offset += len;
    return { p, from, to, startWeek, len };
  });
}

Pages.entwicklung = {
  title: () => 'Entwicklungsplan',
  render() {
    const start = S.profile.startDate || S.createdAt, today = D.key();
    const week = Math.max(1, Math.floor(D.diff(start, today) / 7) + 1);
    const tl = phaseTimeline();
    const suggested = (tl.find(t => t.to && today <= t.to) || tl[tl.length - 1]).p.num;
    const cur = S.development.current;
    const all = S.development.phases.flatMap(p => p.items), done = all.filter(i => i.done).length;
    return `
    ${pageHead('Meine persönliche Entwicklung', 'Mein Entwicklungsplan', 'Langsam und nachhaltig. Die Phasen sind <strong>Empfehlungen, keine Deadlines</strong> – verlängere oder passe sie jederzeit an.')}
    <div class="grid g3">
      <div class="card tint-rose"><p class="eyebrow">Dein Weg</p><div class="stat"><strong>Woche ${week}</strong><span>seit ${esc(D.long(start))}</span></div><a class="btn ghost sm mt" href="#/einstellungen">Startdatum ändern</a></div>
      <div class="card tint-sage"><p class="eyebrow">Gefestigt</p><div class="stat"><strong>${done}<span class="muted" style="font-size:20px"> / ${all.length}</span></strong><span>Gewohnheiten fühlen sich etabliert an</span></div><div class="mt-s">${progressBar(pct(done, all.length))}</div></div>
      <div class="card tint-sand"><p class="eyebrow">Gerade</p><p class="vision-line">Phase ${cur}: ${esc(S.development.phases.find(p => p.num === cur)?.title || '')}</p>
        ${suggested !== cur ? `<p class="muted small mt-s">Nach Zeitplan wäre es Phase ${suggested} – aber dein Tempo entscheidet.</p>` : '<p class="muted small mt-s">Du bist genau im Plan. Schön.</p>'}</div>
    </div>
    <div class="stack mt">
      ${tl.map(({ p, from, to, len }) => {
        const dn = p.items.filter(i => i.done).length, isCur = p.num === cur;
        return `<div class="card phase ${isCur ? 'current' : ''}">
          <div class="card-head">
            <div style="display:flex;gap:18px;align-items:center"><span class="phase-num">${p.num}</span><div><p class="eyebrow" style="margin-bottom:2px">${esc(p.weeksLabel)}${p.extra ? ` · +${plural(p.extra, 'Woche', 'Wochen')}` : ''}</p><h3 style="font-size:28px">${esc(p.title)}</h3>
              <p class="muted small">${esc(D.fmt(from, { day: 'numeric', month: 'short' }))}${to ? ' – ' + esc(D.fmt(to, { day: 'numeric', month: 'short' })) : ' · offen, ohne Ende'}</p></div></div>
            <div class="btn-row">${isCur ? '<span class="badge sage">aktuelle Phase</span>' : `<button class="btn ghost sm" data-action="phase-set" data-num="${p.num}">Hier bin ich gerade</button>`}</div>
          </div>
          ${progressBar(pct(dn, p.items.length), 'rose')}<p class="muted small mt-s">${dn} von ${p.items.length} fühlen sich schon etabliert an</p>
          <div class="check-list mt-s">${p.items.map(i => checkRow(i.text, i.done, `data-action="sub-toggle" data-path="development.phases" data-id="${p.id}" data-sub="items" data-sid="${i.id}"`, iconBtn('pen', `data-action="sub-edit" data-path="development.phases" data-id="${p.id}" data-sub="items" data-sid="${i.id}"`, 'Bearbeiten'))).join('')}</div>
          ${inlineAdd('Eigenen Punkt hinzufügen …', `data-path="development.phases" data-id="${p.id}" data-sub="items"`, 'subAdd')}
          <label class="field mt"><span class="field-label">Notizen zu dieser Phase</span><textarea rows="2" data-change="phase-note" data-id="${p.id}" placeholder="Was hilft dir? Was möchtest du anpassen?">${esc(p.note || '')}</textarea></label>
          ${len ? `<div class="btn-row mt"><button class="btn soft sm" data-action="phase-extend" data-id="${p.id}" data-n="1">${icon('plus')}<span>Um eine Woche verlängern</span></button>${p.extra ? `<button class="btn ghost sm" data-action="phase-extend" data-id="${p.id}" data-n="-1">Eine Woche weniger</button>` : ''}</div>` : ''}
        </div>`;
      }).join('')}
    </div>
    <div class="card tint-sage mt"><p class="eyebrow">Erinnerung</p><p class="vision-line">Du musst nicht von heute auf morgen jemand anderes werden. Du wirst Stück für Stück mehr du selbst.</p></div>`;
  },
  actions: {
    'phase-set'(d) { commit(s => { s.development.current = Number(d.num); }); toast('Phase angepasst – dein Tempo zählt.'); },
    'phase-extend'(d) { commit(s => { const p = s.development.phases.find(x => x.id === d.id); if (p) p.extra = Math.max(0, (p.extra || 0) + Number(d.n)); }); }
  },
  changes: {
    'phase-note'(d, el) { commit(s => { const p = s.development.phases.find(x => x.id === d.id); if (p) p.note = el.value; }, { render: false }); toast('Notiz gespeichert ✓'); }
  }
};
