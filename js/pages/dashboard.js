/* Dashboard – Heute */

FORMS.event = {
  title: 'Termin', addTitle: 'Neuer Termin', editTitle: 'Termin bearbeiten',
  fields: [
    { name: 'title', label: 'Was steht an?', required: true, placeholder: 'z. B. Yoga-Kurs, Tierarzt, Treffen mit …' },
    { name: 'date', label: 'Datum', type: 'date', half: true, required: true },
    { name: 'time', label: 'Uhrzeit', type: 'time', half: true },
    { name: 'note', label: 'Notiz', type: 'textarea', rows: 2 }
  ],
  defaults: d => ({ date: d.date || D.key(), time: '' })
};

function upcomingEvents(from, days = 14) {
  const until = D.add(from, days);
  return S.events.filter(e => e.date >= from && e.date <= until).sort((a, b) => (a.date + (a.time || '99')).localeCompare(b.date + (b.time || '99')));
}

function lookBack() {
  const k = D.key();
  let done = 0, active = 0;
  for (let i = 1; i <= 7; i++) { const h = S.history[D.add(k, -i)]; if (h) { done += h.done; if (h.done) active++; } }
  const proud = [
    ...S.reflections.map(r => r.answers?.proud).filter(Boolean),
    ...S.mindset.journal.map(j => j.answers?.proud).filter(Boolean)
  ];
  const lines = [];
  if (done) lines.push(`In den letzten sieben Tagen hast du <strong>${done}</strong> kleine Dinge für dich erledigt – an ${plural(active, 'Tag', 'Tagen')}.`);
  const challengesDone = S.social.challenges.filter(c => c.done).length;
  if (challengesDone) lines.push(`Du hast schon <strong>${challengesDone}</strong> mutige Herausforderungen gemeistert.`);
  const books = S.knowledge.books.filter(b => b.status === 'done').length;
  if (books) lines.push(`Du hast <strong>${plural(books, 'Buch', 'Bücher')}</strong> zu Ende gelesen.`);
  if (proud.length) lines.push(`Du warst stolz auf: <em>„${esc(proud[D.num(k) % proud.length])}“</em>`);
  return lines;
}

Pages.dashboard = {
  title: () => 'Heute',
  render() {
    const k = D.key(), hour = new Date().getHours(), wd = D.wd(k);
    const g = greeting(hour);
    const name = S.profile.name ? `, <em>${esc(S.profile.name)}</em>` : '';
    const prog = dayProgress(k);
    const d = dayR(k);
    const goals = (d.goals && d.goals.length ? d.goals : [{}, {}, {}]).slice(0, 3);
    let qi = ((D.num(k) + App.ui.quoteShift) % QUOTES.length + QUOTES.length) % QUOTES.length;
    if (QUOTES[qi] === kindMessage(prog, hour)) qi = (qi + 1) % QUOTES.length;
    const quote = QUOTES[qi];
    const challenge = DAILY_CHALLENGES[D.num(k) % DAILY_CHALLENGES.length];
    const chDone = !!S.dailyChallenge[k];
    const vision = S.vision.length ? S.vision[(D.num(k) + App.ui.quoteShift) % S.vision.length].text : '';
    const now = D.nowHM();
    const plan = planFor(k);
    const upcoming = plan.filter(i => !d.done?.[i.id] && i.time >= now.slice(0, 2) + ':00').slice(0, 4);
    const doneCount = plan.filter(i => d.done?.[i.id]).length;
    const events = upcomingEvents(k, 14).slice(0, 4);
    const weekActs = S.week.activities.filter(a => a.wd === wd && (!a.week || a.week === D.weekStart(k)));
    const wkChecks = S.weekChecks.week?.[D.weekStart(k)] || {};
    const habits = S.habits.filter(h => habitDue(h, k));
    const hDone = habits.filter(h => habitDone(h, k)).length;
    const morning = checklistCount('morning', 'selfcare.morning', k);
    const evening = checklistCount('evening', 'selfcare.evening', k);
    const cats = checklistCount('cats', 'home.catCare', k);
    const reflectionDue = wd === 6 && !S.reflections.some(r => r.weekKey === D.weekStart(k));
    const look = lookBack();
    const notes = [...S.notes].sort((a, b) => b.created - a.created).slice(0, 4);

    return `
    <section class="hero">
      <div>
        <p class="hero-date">${esc(D.fmt(k, { weekday: 'long' }))} · ${esc(D.long(k))}</p>
        <h1>${g.hello}${name}!</h1>
        <p class="lead">${g.text}</p>
      </div>
    </section>

    ${reflectionDue ? `<div class="banner">${icon('journal')}<p><strong>Es ist Sonntag.</strong> Nimm dir ein paar ruhige Minuten für deine Wochenreflexion – und schau, wie weit du schon gekommen bist.</p><a class="btn primary sm" href="#/reflexion">Jetzt reflektieren</a></div>` : ''}

    <div class="grid g3 top-row">
      <div class="card quote-card tint-rose span2">
        <div class="card-head"><p class="eyebrow">Gedanke des Tages</p>${iconBtn('refresh', 'data-action="quote-next"', 'Neuer Gedanke')}</div>
        <blockquote>${esc(quote)}</blockquote>
      </div>
      <div class="card tint-sage">
        <p class="eyebrow">Tagesfortschritt</p>
        <div class="progress-card">
          ${ring(prog.pct, 116)}
          <div><p class="msg">${esc(kindMessage(prog, hour))}</p><p class="muted small mt-s">${prog.done} von ${prog.total} erledigt</p></div>
        </div>
      </div>
    </div>

    <div class="grid g3 mt">
      <div class="card">
        <div class="card-head"><div><p class="eyebrow">Fokus</p><h3>Meine drei Tagesziele</h3></div></div>
        ${goals.map((gl, i) => `
          <div class="goal-row ${gl.done ? 'done' : ''}">
            <span class="goal-num">${i + 1}</span>
            <input class="inline-input" value="${esc(gl.text || '')}" placeholder="${['Was ist heute am wichtigsten?', 'Was tut dir heute gut?', 'Ein kleiner Schritt nach vorn'][i]}" data-change="goal-text" data-i="${i}" aria-label="Tagesziel ${i + 1}">
            ${checkBtn(!!gl.done, `data-action="goal-toggle" data-i="${i}"`, 'Ziel erledigt')}
          </div>`).join('')}
        <p class="muted small mt">Ziele werden beim Verlassen des Feldes gespeichert.</p>
      </div>

      <div class="card">
        <div class="card-head"><div><p class="eyebrow">Als Nächstes</p><h3>Dein Tag</h3></div><a class="btn ghost sm" href="#/plan">Tagesplan</a></div>
        ${upcoming.length ? `<div class="upnext">${upcoming.map((i, n) => `
          <div class="upnext-item ${n === 0 ? 'first' : ''}">
            <span class="upnext-time">${i.time}</span>
            <span class="upnext-title">${esc(i.title)} ${i.priority === 'important' ? '<span class="badge important">wichtig</span>' : ''}</span>
            ${checkBtn(false, `data-action="plan-toggle" data-date="${k}" data-id="${i.id}"`, i.title)}
          </div>`).join('')}</div>` : emptyState(plan.length ? 'Für heute ist nichts mehr offen. Genieß den Rest deines Tages.' : 'Heute ist nichts geplant – ein freier Tag nur für dich.', 'moon')}
        <p class="muted small mt">${doneCount} von ${plan.length} Punkten im Tagesplan erledigt</p>
      </div>

      <div class="card">
        <div class="card-head"><div><p class="eyebrow">Termine & Aktivitäten</p><h3>Demnächst</h3></div>${iconBtn('plus', `data-action="crud-add" data-path="events" data-form="event" data-date="${k}"`, 'Termin hinzufügen')}</div>
        ${events.length ? `<div class="list">${events.map(e => `
          <div class="list-item"><div class="li-body"><div class="li-title">${esc(e.title)}</div><div class="li-sub">${e.date === k ? 'Heute' : e.date === D.add(k, 1) ? 'Morgen' : esc(D.fmt(e.date, { weekday: 'short', day: 'numeric', month: 'short' }))}${e.time ? ' · ' + e.time + ' Uhr' : ''}</div></div>${editDel('events', 'event', e.id)}</div>`).join('')}</div>` : `<p class="muted small">Keine Termine in den nächsten zwei Wochen.</p>`}
        ${weekActs.length ? `<p class="eyebrow mt">Heute im Wochenplan</p><div class="check-list">${weekActs.map(a => checkRow(a.title, !!wkChecks[a.id], `data-action="wcheck-toggle" data-list="week" data-week="${D.weekStart(k)}" data-id="${a.id}"`)).join('')}</div>` : ''}
      </div>
    </div>

    <div class="grid g3 mt">
      <div class="card span2">
        <div class="card-head"><div><p class="eyebrow">Heute</p><h3>Meine Gewohnheiten</h3></div><a class="btn ghost sm" href="#/habits">Alle ansehen</a></div>
        <div class="chips">${habits.map(h => {
          const on = habitDone(h, k);
          const extra = h.freq?.type === 'weekly' ? ` <span class="muted">${habitWeekCount(h, k)}/${h.freq.times}</span>` : '';
          return `<button class="chip ${on ? 'on' : ''}" data-action="habit-toggle" data-date="${k}" data-id="${h.id}" aria-pressed="${on}">${on ? icon('check') : ''}${esc(h.name)}${extra}</button>`;
        }).join('')}</div>
        <div class="mt">${progressBar(pct(hDone, habits.length))}</div>
        <p class="muted small mt-s">${hDone} von ${habits.length} Gewohnheiten heute – jede einzelne zählt.</p>
      </div>
      <div class="card tint-sand">
        <p class="eyebrow">Kleine Herausforderung</p>
        <p class="vision-line">${esc(challenge)}</p>
        <button class="btn ${chDone ? 'sage' : 'soft'} sm mt" data-action="challenge-toggle">${icon('check')}<span>${chDone ? 'Geschafft – wunderbar!' : 'Hab ich gemacht'}</span></button>
      </div>
    </div>

    <div class="grid g3 mt">
      <div class="card">
        <div class="card-head"><div><p class="eyebrow">Routinen</p><h3>Heute</h3></div></div>
        ${[['Morgenroutine', 'morning', 'selfcare.morning', morning, 'bereiche/selfcare'], ['Abendroutine', 'evening', 'selfcare.evening', evening, 'bereiche/selfcare'], ['Katzen', 'cats', 'home.catCare', cats, 'bereiche/home']].map(([label, list, path, c, link]) => `
          <details class="routine-mini" ${(list === 'morning' && hour < 12 && c.done < c.total) || (list === 'evening' && hour >= 20 && c.done < c.total) ? 'open' : ''}>
            <summary style="list-style:none;cursor:pointer"><h4><span>${label}</span><span>${c.done}/${c.total}</span></h4>${progressBar(pct(c.done, c.total), 'thin')}</summary>
            <div class="mt-s">${dailyChecklist(list, path, k, { editable: false })}</div>
          </details><div style="height:14px"></div>`).join('')}
        <a class="btn ghost sm" href="#/bereiche/selfcare">Routinen bearbeiten</a>
      </div>

      <div class="card">
        <div class="card-head"><div><p class="eyebrow">Notizen</p><h3>Für mich</h3></div></div>
        <form data-submit="note-add" class="stack" style="gap:8px">
          <textarea name="text" rows="3" placeholder="Ein Gedanke, eine Idee, etwas Schönes von heute …" aria-label="Neue Notiz"></textarea>
          <button class="btn primary sm" style="align-self:flex-start">${icon('plus')}<span>Notiz speichern</span></button>
        </form>
        <div class="notes-list">${notes.map(n => `
          <div class="note-item"><p>${esc(n.text)}<span class="muted">${esc(D.fmt(n.date, { day: 'numeric', month: 'short' }))}</span></p>${iconBtn('trash', `data-action="crud-del" data-path="notes" data-id="${n.id}"`, 'Notiz löschen')}</div>`).join('')}</div>
        ${S.notes.length > 4 ? `<a class="btn ghost sm mt" href="#/bereiche/mindset" data-action="nav-notes">Alle ${S.notes.length} Notizen</a>` : ''}
      </div>

      <div class="card tint-sage">
        <p class="eyebrow">Die Frau, die du wirst</p>
        ${vision ? `<p class="vision-line">${esc(vision)}</p>` : `<p class="muted">Füge in den Einstellungen deine Vision hinzu.</p>`}
        ${look.length ? `<p class="eyebrow mt">Positiver Rückblick</p>${look.map(l => `<p class="mt-s">${l}</p>`).join('')}` : `<p class="muted small mt">Dein Rückblick füllt sich, sobald du die ersten Tage mit Becoming Her verbracht hast.</p>`}
        <a class="btn ghost sm mt" href="#/entwicklung">Mein Entwicklungsplan</a>
      </div>
    </div>`;
  },
  actions: {
    'quote-next'() { App.ui.quoteShift++; App.render(); },
    'goal-toggle'(d) {
      const k = D.key();
      const input = $(`[data-change="goal-text"][data-i="${d.i}"]`);
      commit(() => { const g = day(k).goals[d.i]; if (input) g.text = input.value.trim(); g.done = !g.done; });
    },
    'challenge-toggle'() { commit(s => { const k = D.key(); if (s.dailyChallenge[k]) delete s.dailyChallenge[k]; else s.dailyChallenge[k] = true; }); },
    'nav-notes'() { App.ui.tabs.mindset = 'notizen'; location.hash = '#/bereiche/mindset'; }
  },
  changes: {
    'goal-text'(d, el) {
      commit(() => { day(D.key()).goals[d.i].text = el.value.trim(); }, { render: false });
      softRender();
    }
  },
  submits: {
    'note-add'(v) {
      const text = (v.text || '').trim(); if (!text) return toast('Schreib zuerst etwas in deine Notiz.');
      commit(s => s.notes.push({ id: uid(), text, date: D.key(), created: Date.now() }));
      toast('Notiz gespeichert ✓');
    }
  }
};
