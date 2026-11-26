/* Die sieben Lebensbereiche */

/* ---------- Formulare ---------- */
FORMS.goal = {
  title: 'Persönliches Ziel', fields: [
    { name: 'text', label: 'Ziel', required: true },
    { name: 'area', label: 'Lebensbereich', type: 'select', options: ['Mindset', 'Health & Fitness', 'Selfcare', 'Knowledge', 'Hobbies', 'Independence', 'Lifestyle & Home'] }
  ], defaults: { area: 'Mindset', done: false }, extra: () => ({ done: false })
};
FORMS.reframe = { title: 'Positives Selbstgespräch', fields: [{ name: 'from', label: 'Statt …', required: true, placeholder: 'Ich bin nicht gut genug.' }, { name: 'to', label: '… sage ich mir', required: true, placeholder: 'Ich lerne jeden Tag dazu.' }] };
FORMS.note = {
  title: 'Notiz', fields: [{ name: 'text', label: 'Notiz', type: 'textarea', rows: 5, required: true }],
  extra: () => ({ date: D.key(), created: Date.now() })
};
FORMS.knote = {
  title: 'Lernnotiz', fields: [{ name: 'title', label: 'Titel / Thema', required: true }, { name: 'text', label: 'Notiz', type: 'textarea', rows: 6 }],
  extra: () => ({ date: D.key() })
};
const WORKOUT_TYPES = ['Krafttraining', 'Spaziergang', 'Yoga / Mobility', 'Cardio', 'Sonstiges'];
FORMS.workout = {
  title: 'Training', addTitle: 'Training eintragen', editTitle: 'Training bearbeiten', wide: true,
  fields: [
    { name: 'date', label: 'Datum', type: 'date', half: true, required: true },
    { name: 'type', label: 'Art', type: 'select', options: WORKOUT_TYPES, half: true },
    { name: 'title', label: 'Titel', placeholder: 'z. B. Ganzkörper A' },
    { name: 'duration', label: 'Dauer (Minuten)', type: 'number', min: 0, half: true },
    { name: 'feeling', label: 'Wie hast du dich gefühlt?', type: 'select', options: ['', 'Energiegeladen', 'Gut', 'Okay', 'Müde, aber dabei'], half: true },
    { name: 'exText', label: 'Übungen', type: 'textarea', rows: 6, help: 'Eine Übung pro Zeile, z. B. „Kniebeugen 3x10 20kg“ oder „Plank 3x30s“.', showIf: { field: 'type', in: ['Krafttraining', 'Yoga / Mobility', 'Cardio', 'Sonstiges'] } },
    { name: 'note', label: 'Notiz', type: 'textarea', rows: 2 }
  ],
  defaults: d => ({ date: D.key(), type: d.type || 'Krafttraining', title: d.title || '', exText: d.extext || '', duration: d.type === 'Spaziergang' ? 30 : 45 }),
  prepare: v => ({ ...v, exercises: parseExercises(v.type === 'Spaziergang' ? '' : v.exText || '') }),
  added: 'Training gespeichert – stark! ✓'
};
FORMS.template = { title: 'Trainingsvorlage', fields: [{ name: 'title', label: 'Name', required: true }, { name: 'exText', label: 'Übungen (eine pro Zeile)', type: 'textarea', rows: 7 }] };
FORMS.sleep = {
  title: 'Schlaf', addTitle: 'Schlaf eintragen', fields: [
    { name: 'date', label: 'Nacht zum', type: 'date', required: true, help: 'Das Datum des Morgens, an dem du aufgewacht bist.' },
    { name: 'bed', label: 'Eingeschlafen', type: 'time', half: true, required: true },
    { name: 'wake', label: 'Aufgewacht', type: 'time', half: true, required: true },
    { name: 'quality', label: 'Wie erholt fühlst du dich?', type: 'select', options: [{ value: 5, label: 'Sehr erholt' }, { value: 4, label: 'Erholt' }, { value: 3, label: 'Okay' }, { value: 2, label: 'Etwas müde' }, { value: 1, label: 'Müde' }] },
    { name: 'note', label: 'Notiz', type: 'text' }
  ], defaults: () => ({ date: D.key(), bed: '22:45', wake: '07:00', quality: 4 }),
  prepare: v => ({ ...v, quality: Number(v.quality) })
};
FORMS.product = { title: 'Pflegeprodukt', fields: [{ name: 'name', label: 'Produkt', required: true }, { name: 'type', label: 'Bereich', type: 'select', options: ['Gesicht', 'Haare', 'Nägel', 'Körper', 'Sonstiges'] }, { name: 'note', label: 'Anwendung / Notiz' }], defaults: { type: 'Gesicht' } };
FORMS.book = {
  title: 'Buch', addTitle: 'Buch hinzufügen', editTitle: 'Buch bearbeiten', fields: [
    { name: 'title', label: 'Titel', required: true }, { name: 'author', label: 'Autor:in' },
    { name: 'pages', label: 'Seiten gesamt', type: 'number', min: 1, half: true }, { name: 'currentPage', label: 'Aktuelle Seite', type: 'number', min: 0, half: true },
    { name: 'status', label: 'Status', type: 'select', options: [{ value: 'want', label: 'Möchte ich lesen' }, { value: 'reading', label: 'Lese ich gerade' }, { value: 'done', label: 'Gelesen' }], half: true },
    { name: 'rating', label: 'Bewertung', type: 'rating', half: true },
    { name: 'notes', label: 'Gedanken & Zitate', type: 'textarea', rows: 3 }
  ], defaults: { status: 'want', pages: 250, currentPage: 0, rating: 0 },
  prepare: (v, item) => {
    const o = { ...v, pages: Math.max(1, v.pages || 1), currentPage: clamp(v.currentPage || 0, 0, v.pages || 1) };
    if (o.status === 'reading' && !item?.started) o.started = D.key();
    if (o.status === 'done') { o.finished = item?.finished || D.key(); o.currentPage = o.pages; } else o.finished = null;
    return o;
  }
};
FORMS.language = { title: 'Sprache', fields: [{ name: 'name', label: 'Sprache', required: true }, { name: 'level', label: 'Aktuelles Niveau', type: 'select', options: ['A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'], half: true }, { name: 'weeklyGoal', label: 'Wochenziel (Minuten)', type: 'number', min: 0, half: true }, { name: 'goal', label: 'Mein Ziel' }], defaults: { level: 'A1', weeklyGoal: 90 } };
FORMS.recipe = {
  title: 'Rezept', fields: [
    { name: 'name', label: 'Rezept', required: true }, { name: 'category', label: 'Kategorie', type: 'select', options: ['Frühstück', 'Hauptgericht', 'Snack', 'Backen', 'Dessert', 'Getränk'], half: true },
    { name: 'status', label: 'Status', type: 'select', options: [{ value: 'idea', label: 'Möchte ich ausprobieren' }, { value: 'tried', label: 'Ausprobiert' }, { value: 'fav', label: 'Lieblingsrezept' }], half: true },
    { name: 'rating', label: 'Bewertung', type: 'rating' }, { name: 'link', label: 'Link / Quelle', type: 'url', placeholder: 'https://…' }, { name: 'notes', label: 'Zutaten & Notizen', type: 'textarea', rows: 4 }
  ], defaults: { category: 'Hauptgericht', status: 'idea', rating: 0 },
  prepare: (v, item) => ({ ...v, tried: v.status !== 'idea' ? (item?.tried || D.key()) : null })
};
FORMS.game = { title: 'Spiel', fields: [{ name: 'title', label: 'Spiel', required: true }, { name: 'platform', label: 'Plattform', half: true }, { name: 'status', label: 'Status', type: 'select', half: true, options: [{ value: 'wish', label: 'Wunschliste' }, { value: 'playing', label: 'Spiele ich gerade' }, { value: 'done', label: 'Durchgespielt' }] }, { name: 'note', label: 'Notiz', type: 'textarea', rows: 2 }], defaults: { status: 'playing' } };
FORMS.cproject = { title: 'Kreatives Projekt', fields: [{ name: 'title', label: 'Projekt', required: true }, { name: 'status', label: 'Status', type: 'select', half: true, options: [{ value: 'idea', label: 'Idee' }, { value: 'active', label: 'In Arbeit' }, { value: 'done', label: 'Fertig' }] }, { name: 'progress', label: 'Fortschritt (%)', type: 'number', min: 0, max: 100, half: true }, { name: 'note', label: 'Notizen', type: 'textarea', rows: 3 }], defaults: { status: 'idea', progress: 0 }, prepare: v => ({ ...v, progress: clamp(v.progress || 0, 0, 100) }) };
FORMS.idea = { title: 'Idee zum Ausprobieren', fields: [{ name: 'text', label: 'Aktivität / Hobby', required: true }, { name: 'category', label: 'Kategorie', type: 'select', options: ['Kreativ', 'Bewegung', 'Natur', 'Kochen', 'Kultur', 'Entspannung', 'Sonstiges'] }], defaults: { category: 'Kreativ' }, extra: () => ({ done: false }) };
FORMS.challenge = { title: 'Eigene Herausforderung', fields: [{ name: 'text', label: 'Herausforderung', required: true }, { name: 'level', label: 'Stufe', type: 'select', options: CHALLENGE_LEVELS.map(l => ({ value: l.level, label: `${l.level} · ${l.name}` })) }], defaults: { level: 1 }, prepare: v => ({ ...v, level: Number(v.level) }), extra: () => ({ done: false, note: '', feeling: '' }) };
FORMS.shoplist = { title: 'Einkaufsliste', fields: [{ name: 'name', label: 'Name der Liste', required: true, placeholder: 'z. B. Wochenmarkt' }], extra: () => ({ items: [] }) };
FORMS.hproject = { title: 'Persönliches Projekt', fields: [{ name: 'title', label: 'Projekt', required: true }, { name: 'note', label: 'Worum geht es?', type: 'textarea', rows: 2 }], extra: () => ({ steps: [] }) };

/* ---------- Hilfen ---------- */
function parseExercises(text) {
  return text.split('\n').map(l => l.trim()).filter(Boolean).map(l => {
    const m = l.match(/(\d+)\s*[x×]\s*(\d+)\s*(s|sek|min)?\b/i);
    const w = l.match(/(\d+(?:[.,]\d+)?)\s*kg/i);
    let name = l; if (m) name = name.replace(m[0], ''); if (w) name = name.replace(w[0], '');
    name = name.replace(/[@,;:–\-]+\s*$/g, '').replace(/\s{2,}/g, ' ').trim() || l;
    return { name, sets: m ? +m[1] : null, reps: m ? +m[2] : null, unit: m && m[3] ? 's' : '', weight: w ? parseFloat(w[1].replace(',', '.')) : null };
  });
}
function exLabel(e) { return [e.sets && e.reps ? `${e.sets} × ${e.reps}${e.unit}` : '', e.weight ? `${fmtNum(e.weight)} kg` : ''].filter(Boolean).join(' · '); }
function sleepHours(s) {
  const [bh, bm] = s.bed.split(':').map(Number), [wh, wm] = s.wake.split(':').map(Number);
  let m = wh * 60 + wm - (bh * 60 + bm); if (m <= 0) m += 1440; return m / 60;
}
function list(items, render, empty) { return items.length ? `<div class="list">${items.map(render).join('')}</div>` : emptyState(empty); }
function weekMinutes(langId, ws) { return S.knowledge.langLog.filter(l => (!langId || l.langId === langId) && D.weekStart(l.date) === ws).reduce((a, l) => a + (Number(l.minutes) || 0), 0); }

/* ---------- Bereichs-Renderer ---------- */
const AREA_VIEWS = {
  mindset: {
    tabs: [{ id: 'journal', label: 'Journal' }, { id: 'ruhe', label: 'Gelassenheit' }, { id: 'selbstwert', label: 'Selbstbewusstsein' }, { id: 'ziele', label: 'Ziele' }, { id: 'notizen', label: 'Notizen' }],
    journal() {
      const k = D.key();
      const entry = S.mindset.journal.find(j => j.date === k) || { answers: {} };
      const qs = [['self', 'Was habe ich heute für mich getan?'], ['proud', 'Worauf bin ich heute stolz?'], ['mind', 'Was hat mich heute beschäftigt?'], ['tomorrow', 'Was möchte ich morgen anders machen?']];
      const past = [...S.mindset.journal].sort((a, b) => b.date.localeCompare(a.date));
      return `<div class="grid g3">
        <div class="card span2">
          <div class="card-head"><div><p class="eyebrow">Journaling · ${esc(D.fmt(k))}</p><h3>Selbstreflexion</h3></div>${entry.id ? '<span class="badge sage">gespeichert</span>' : ''}</div>
          <form data-submit="journal-save" class="form-grid">
            ${qs.map(([id, q]) => `<label class="field"><span class="field-label">${q}</span><textarea name="${id}" rows="2">${esc(entry.answers[id] || '')}</textarea></label>`).join('')}
            <label class="field"><span class="field-label">Wie fühlst du dich?</span><select name="mood">${['', 'Ruhig', 'Glücklich', 'Dankbar', 'Motiviert', 'Müde', 'Unruhig', 'Traurig', 'Gestresst'].map(m => `<option ${entry.mood === m ? 'selected' : ''}>${m}</option>`).join('')}</select></label>
            <label class="field"><span class="field-label">Freie Gedanken</span><textarea name="free" rows="4">${esc(entry.answers.free || '')}</textarea></label>
            <div class="field"><button class="btn primary" style="align-self:flex-start">${entry.id ? 'Eintrag aktualisieren' : 'Eintrag speichern'}</button></div>
          </form>
        </div>
        <div class="card tint-rose"><p class="eyebrow">Impuls</p><p class="vision-line">${esc(['Schreib nicht, um perfekt zu formulieren – schreib, um dich zu hören.', 'Was würdest du einer guten Freundin sagen, die heute deinen Tag hatte?', 'Welcher kleine Moment heute war schön?', 'Was darfst du heute loslassen?'][D.num(k) % 4])}</p>
          <p class="muted small mt">${plural(S.mindset.journal.length, 'Eintrag', 'Einträge')} in deinem Journal.</p></div>
      </div>
      <h2 class="section-title">Frühere Einträge</h2>
      ${past.length ? past.map(j => `<details class="entry"><summary><div><h4>${esc(D.fmt(j.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))}</h4>${j.mood ? `<span class="badge">${esc(j.mood)}</span>` : ''}</div>${icon('chevR', 'chev')}</summary>
        <dl class="qa">${qs.concat([['free', 'Freie Gedanken']]).filter(([id]) => j.answers[id]).map(([id, q]) => `<dt>${q}</dt><dd>${esc(j.answers[id])}</dd>`).join('')}</dl>
        <div class="btn-row mt">${iconBtn('trash', `data-action="crud-del" data-path="mindset.journal" data-id="${j.id}"`, 'Eintrag löschen')}</div></details>`).join('') : `<div class="card">${emptyState('Dein erster Eintrag wartet. Schon zwei Sätze reichen.', 'journal')}</div>`}`;
    },
    ruhe() {
      const steps = ['Atme einmal tief ein und aus. Du bist hier, in diesem Moment.', 'Nenne 5 Dinge, die du sehen kannst.', 'Nenne 4 Dinge, die du fühlen kannst.', 'Nenne 3 Dinge, die du hören kannst.', 'Nenne 2 Dinge, die du riechen kannst.', 'Nenne 1 Sache, die du schmecken kannst.', 'Gut gemacht. Dein Kopf ist jetzt ein kleines bisschen ruhiger.'];
      const g = App.ui.groundStep;
      const open = S.mindset.worries.filter(w => !w.released), released = S.mindset.worries.filter(w => w.released);
      return `<div class="grid g2">
        <div class="card tint-sage"><div class="card-head"><div><p class="eyebrow">Gelassenheit</p><h3>Atemübung 4 · 4 · 6</h3></div></div>
          <div class="breath"><div class="breath-circle" id="breath-circle">Bereit?</div><p class="muted small" id="breath-info">5 ruhige Atemzüge · ca. 70 Sekunden</p>
          <button class="btn sage" data-action="breath-start" id="breath-btn">${icon('play')}<span>Starten</span></button></div></div>
        <div class="card tint-sand"><div class="card-head"><div><p class="eyebrow">Gedankenkarussell stoppen</p><h3>5-4-3-2-1 Übung</h3></div></div>
          <p class="ground-step">${esc(steps[g])}</p>${progressBar(pct(g, steps.length - 1), 'thin')}
          <div class="btn-row mt">${g < steps.length - 1 ? `<button class="btn primary sm" data-action="ground-next">Weiter</button>` : ''}${g > 0 ? `<button class="btn ghost sm" data-action="ground-reset">Von vorn</button>` : ''}</div></div>
      </div>
      <div class="card mt"><div class="card-head"><div><p class="eyebrow">Gedanken parken</p><h3>Was beschäftigt dich gerade?</h3></div></div>
        <p class="muted small">Schreib den Gedanken auf, damit er nicht in deinem Kopf kreisen muss. Dann entscheide: Kann ich daran etwas ändern?</p>
        <form data-submit="worry-add" class="form-grid mt">
          <label class="field"><span class="field-label">Gedanke</span><input name="text" placeholder="z. B. Ich mache mir Sorgen wegen …" required></label>
          <label class="field half"><span class="field-label">Kann ich das beeinflussen?</span><select name="control"><option value="yes">Ja – ich kann etwas tun</option><option value="part">Teilweise</option><option value="no">Nein – ich darf es loslassen</option></select></label>
          <label class="field half"><span class="field-label">Nächster kleiner Schritt (optional)</span><input name="step" placeholder="z. B. Morgen kurz nachfragen"></label>
          <div class="field"><button class="btn primary sm" style="align-self:flex-start">Gedanken parken</button></div>
        </form>
        ${open.length ? `<div class="list mt">${open.map(w => `<div class="list-item"><div class="li-body"><div class="li-title">${esc(w.text)}</div><div class="li-sub">${{ yes: 'Beeinflussbar', part: 'Teilweise beeinflussbar', no: 'Nicht beeinflussbar – darf gehen' }[w.control]}${w.step ? ' · Schritt: ' + esc(w.step) : ''}</div></div>
          <button class="btn soft sm" data-action="crud-toggle" data-path="mindset.worries" data-id="${w.id}" data-field="released">Loslassen</button>${iconBtn('trash', `data-action="crud-del" data-path="mindset.worries" data-id="${w.id}"`, 'Löschen')}</div>`).join('')}</div>` : ''}
        ${released.length ? `<details class="mt"><summary class="muted small" style="cursor:pointer">Losgelassen (${released.length}) – gut gemacht</summary><div class="list">${released.map(w => `<div class="list-item"><div class="li-body"><div class="li-title muted">${esc(w.text)}</div></div>${iconBtn('undo', `data-action="crud-toggle" data-path="mindset.worries" data-id="${w.id}" data-field="released"`, 'Zurückholen')}${iconBtn('trash', `data-action="crud-del" data-path="mindset.worries" data-id="${w.id}"`, 'Löschen')}</div>`).join('')}</div></details>` : ''}
      </div>`;
    },
    selbstwert() {
      const a = S.mindset.affirmations;
      const daily = a.length ? a[(D.num(D.key()) + App.ui.quoteShift) % a.length].text : '';
      return `<div class="grid g2">
        <div class="card tint-rose span2"><div class="card-head"><p class="eyebrow">Mein Satz für heute</p>${iconBtn('refresh', 'data-action="quote-next"', 'Anderer Satz')}</div><p class="vision-line" style="font-size:28px">${esc(daily || 'Füge unten deine eigenen Affirmationen hinzu.')}</p></div>
        <div class="card"><div class="card-head"><h3>Affirmationen</h3></div>
          ${list(a, i => `<div class="list-item"><div class="li-body li-title">${esc(i.text)}</div>${editDel('mindset.affirmations', 'text', i.id)}</div>`, 'Noch keine Affirmationen.')}
          ${inlineAdd('Neue Affirmation …', 'data-path="mindset.affirmations"')}</div>
        <div class="card"><div class="card-head"><h3>Was ich an mir schätze</h3></div>
          ${list(S.mindset.strengths, i => `<div class="list-item"><span class="ms-ic" style="width:28px;height:28px">${icon('heart')}</span><div class="li-body li-title">${esc(i.text)}</div>${editDel('mindset.strengths', 'text', i.id)}</div>`, 'Was magst du an dir?')}
          ${inlineAdd('Eine Stärke, eine Eigenschaft …', 'data-path="mindset.strengths"')}</div>
        <div class="card span2"><div class="card-head"><div><p class="eyebrow">Positive Selbstgespräche</p><h3>Gedanken freundlich umformulieren</h3></div>${addBtn('Neu', 'data-action="crud-add" data-path="mindset.reframes" data-form="reframe"')}</div>
          ${list(S.mindset.reframes, r => `<div class="list-item"><div class="li-body"><div class="li-sub" style="text-decoration:line-through">${esc(r.from)}</div><div class="li-title serif" style="font-size:19px">${esc(r.to)}</div></div>${editDel('mindset.reframes', 'reframe', r.id)}</div>`, 'Noch keine Umformulierungen.')}</div>
      </div>`;
    },
    ziele() {
      const g = S.mindset.goals, open = g.filter(x => !x.done), done = g.filter(x => x.done);
      return `<div class="grid g3"><div class="card span2"><div class="card-head"><div><p class="eyebrow">Langfristig</p><h3>Persönliche Ziele</h3></div>${addBtn('Ziel', 'data-action="crud-add" data-path="mindset.goals" data-form="goal"', 'primary')}</div>
        ${open.length ? `<div class="check-list">${open.map(x => checkRow(x.text, false, `data-action="crud-toggle" data-path="mindset.goals" data-id="${x.id}"`, editDel('mindset.goals', 'goal', x.id), esc(x.area || ''))).join('')}</div>` : emptyState('Alle Ziele erreicht – Zeit für neue Träume.', 'target')}
        ${done.length ? `<p class="eyebrow mt">Erreicht</p><div class="check-list">${done.map(x => checkRow(x.text, true, `data-action="crud-toggle" data-path="mindset.goals" data-id="${x.id}"`, editDel('mindset.goals', 'goal', x.id), x.doneDate ? 'am ' + esc(D.long(x.doneDate)) : '')).join('')}</div>` : ''}
      </div><div class="card tint-sage"><p class="eyebrow">Erinnerung</p><p class="vision-line">Ziele sind Richtungen, keine Prüfungen. Du darfst sie jederzeit anpassen.</p></div></div>`;
    },
    notizen() {
      const n = [...S.notes].sort((a, b) => (b.created || 0) - (a.created || 0));
      return `<div class="card"><div class="card-head"><h3>Meine Notizen</h3>${addBtn('Notiz', 'data-action="crud-add" data-path="notes" data-form="note"', 'primary')}</div>
        ${n.length ? `<div class="notes-list">${n.map(x => `<div class="note-item"><p>${esc(x.text)}<span class="muted">${esc(D.long(x.date))}</span></p>${editDel('notes', 'note', x.id)}</div>`).join('')}</div>` : emptyState('Noch keine Notizen.', 'note')}</div>`;
    }
  },

  health: {
    tabs: [{ id: 'training', label: 'Training' }, { id: 'verlauf', label: 'Übungsverlauf' }, { id: 'bewegung', label: 'Spaziergänge' }, { id: 'schlaf', label: 'Schlaf' }, { id: 'ernaehrung', label: 'Ernährung' }],
    training() {
      const ws = D.weekStart(D.key());
      const strength = S.health.workouts.filter(w => w.type === 'Krafttraining' && D.weekStart(w.date) === ws).length;
      const all = [...S.health.workouts].sort((a, b) => b.date.localeCompare(a.date));
      const weeks = Array.from({ length: 8 }, (_, i) => { const w = D.add(ws, (i - 7) * 7); return { label: D.short(w), value: S.health.workouts.filter(x => x.type === 'Krafttraining' && D.weekStart(x.date) === w).length, hl: w === ws }; });
      return `<div class="grid g3">
        <div class="card tint-sage"><p class="eyebrow">Diese Woche</p><div class="stat"><strong>${strength} <span class="muted" style="font-size:20px">/ 3</span></strong><span>Krafttrainings</span></div>
          <div class="dots mt-s">${[0, 1, 2].map(i => `<i class="${i < strength ? 'on' : ''}"></i>`).join('')}</div>
          <p class="muted small mt">${strength >= 3 ? 'Ziel erreicht – dein Körper sagt danke.' : strength ? 'Schön, dass du drangeblieben bist.' : 'Geplant: Montag, Mittwoch & Freitag. Jede Einheit zählt.'}</p></div>
        <div class="card span2"><div class="card-head"><h3>Krafttrainings pro Woche</h3></div>${barChart(weeks, { height: 110, max: 4 })}</div>
      </div>
      <div class="card mt"><div class="card-head"><div><p class="eyebrow">Trainingsübersicht</p><h3>Meine Trainingspläne</h3></div>${addBtn('Vorlage', 'data-action="crud-add" data-path="health.templates" data-form="template"')}</div>
        <div class="grid g3">${S.health.templates.map(t => `<div class="card flat" style="background:var(--cream)"><div class="card-head" style="margin-bottom:6px"><h3 style="font-size:20px">${esc(t.title)}</h3>${editDel('health.templates', 'template', t.id)}</div>
          <ul class="ex-list">${parseExercises(t.exText || '').map(e => `<li><span>${esc(e.name)}</span><span class="muted">${exLabel(e)}</span></li>`).join('')}</ul>
          <button class="btn sage sm mt" data-action="workout-start" data-id="${t.id}">${icon('play')}<span>Training eintragen</span></button></div>`).join('')}</div>
      </div>
      <div class="card mt"><div class="card-head"><div><p class="eyebrow">Trainingsprotokoll</p><h3>Alle Einheiten</h3></div>${addBtn('Training', 'data-action="crud-add" data-path="health.workouts" data-form="workout"', 'primary')}</div>
        ${all.length ? all.slice(0, 30).map(w => `<details class="entry"><summary><div><h4>${esc(w.title || w.type)}</h4><span class="muted small">${esc(D.fmt(w.date, { weekday: 'short', day: 'numeric', month: 'short' }))} · ${esc(w.type)}${w.duration ? ` · ${w.duration} Min.` : ''}${w.feeling ? ' · ' + esc(w.feeling) : ''}</span></div>${icon('chevR', 'chev')}</summary>
          ${w.exercises?.length ? `<ul class="ex-list mt-s">${w.exercises.map(e => `<li><span>${esc(e.name)}</span><span class="muted">${exLabel(e)}</span></li>`).join('')}</ul>` : ''}${w.note ? `<p class="mt-s muted">${esc(w.note)}</p>` : ''}
          <div class="mt-s">${editDel('health.workouts', 'workout', w.id)}</div></details>`).join('') : emptyState('Noch keine Trainings eingetragen. Starte mit einer Vorlage oben.', 'heart')}
      </div>`;
    },
    verlauf() {
      const map = {};
      [...S.health.workouts].sort((a, b) => a.date.localeCompare(b.date)).forEach(w => (w.exercises || []).forEach(e => {
        const key = e.name.toLowerCase(); (map[key] ||= { name: e.name, sessions: [] }).sessions.push({ date: w.date, ...e });
      }));
      const rows = Object.values(map).sort((a, b) => b.sessions.length - a.sessions.length);
      return `<div class="card"><div class="card-head"><div><p class="eyebrow">Muskelaufbau</p><h3>Übungen & Wiederholungen</h3></div></div>
        ${rows.length ? `<div class="table-wrap"><table class="table"><thead><tr><th>Übung</th><th>Einheiten</th><th>Zuerst</th><th>Zuletzt</th><th>Bestes Gewicht</th></tr></thead><tbody>
        ${rows.map(r => { const f = r.sessions[0], l = r.sessions[r.sessions.length - 1]; const best = Math.max(0, ...r.sessions.map(s => s.weight || 0));
          return `<tr><td>${esc(r.name)}</td><td>${r.sessions.length}</td><td class="muted">${exLabel(f) || '–'}</td><td>${exLabel(l) || '–'}</td><td>${best ? fmtNum(best) + ' kg' : '–'}</td></tr>`; }).join('')}
        </tbody></table></div><p class="muted small mt">Vergleiche dich mit deinem früheren Ich: von der ersten bis zur letzten Einheit.</p>` : emptyState('Sobald du Trainings mit Übungen einträgst, siehst du hier deine Entwicklung.', 'chart')}</div>`;
    },
    bewegung() {
      const ws = D.weekStart(D.key());
      const walks = S.health.workouts.filter(w => w.type === 'Spaziergang').sort((a, b) => b.date.localeCompare(a.date));
      const weekMin = walks.filter(w => D.weekStart(w.date) === ws).reduce((a, w) => a + (w.duration || 0), 0);
      const days = Array.from({ length: 14 }, (_, i) => { const k = D.add(D.key(), i - 13); return { label: i % 2 ? WDS[D.wd(k)] : '', title: D.fmt(k), value: walks.filter(w => w.date === k).reduce((a, w) => a + (w.duration || 0), 0), hl: i === 13 }; });
      return `<div class="grid g3"><div class="card tint-sage"><p class="eyebrow">Diese Woche</p><div class="stat"><strong>${weekMin}</strong><span>Minuten an der frischen Luft</span></div>
        <button class="btn sage sm mt" data-action="crud-add" data-path="health.workouts" data-form="workout" data-type="Spaziergang" data-title="Spaziergang">${icon('plus')}<span>Spaziergang eintragen</span></button></div>
        <div class="card span2"><div class="card-head"><h3>Letzte 14 Tage</h3></div>${barChart(days, { height: 110, suffix: '′' })}</div></div>
        <div class="card mt"><div class="card-head"><h3>Meine Spaziergänge</h3></div>${list(walks.slice(0, 20), w => `<div class="list-item"><span class="ms-ic">${icon('leaf')}</span><div class="li-body"><div class="li-title">${esc(w.title || 'Spaziergang')}${w.duration ? ` · ${w.duration} Min.` : ''}</div><div class="li-sub">${esc(D.fmt(w.date))}${w.note ? ' · ' + esc(w.note) : ''}</div></div>${editDel('health.workouts', 'workout', w.id)}</div>`, 'Noch keine Spaziergänge eingetragen.')}</div>`;
    },
    schlaf() {
      const s = [...S.health.sleep].sort((a, b) => b.date.localeCompare(a.date));
      const last7 = s.filter(x => D.diff(x.date, D.key()) < 7);
      const avg = last7.length ? last7.reduce((a, x) => a + sleepHours(x), 0) / last7.length : 0;
      const chart = Array.from({ length: 14 }, (_, i) => { const k = D.add(D.key(), i - 13); const e = S.health.sleep.find(x => x.date === k); return { label: i % 2 ? WDS[D.wd(k)] : '', title: D.fmt(k), value: e ? Math.round(sleepHours(e) * 10) / 10 : 0, hl: i === 13 }; });
      return `<div class="grid g3"><div class="card tint-sage"><p class="eyebrow">Letzte 7 Nächte</p><div class="stat"><strong>${avg ? fmtNum(avg) + ' h' : '–'}</strong><span>durchschnittlich</span></div>
        <p class="muted small mt">Deine Wunsch-Schlafenszeit: 22:30. Ein ruhiger Abend hilft mehr als jeder Wecker.</p>
        <button class="btn sage sm mt" data-action="crud-add" data-path="health.sleep" data-form="sleep">${icon('moon')}<span>Nacht eintragen</span></button></div>
        <div class="card span2"><div class="card-head"><h3>Schlafübersicht</h3><span class="muted small">Stunden</span></div>${barChart(chart, { height: 120, max: 10 })}</div></div>
        <div class="card mt"><div class="card-head"><h3>Einträge</h3></div>${list(s.slice(0, 30), x => `<div class="list-item"><span class="ms-ic">${icon('moon')}</span><div class="li-body"><div class="li-title">${fmtNum(sleepHours(x))} Stunden · ${x.bed} – ${x.wake}</div><div class="li-sub">${esc(D.fmt(x.date))} · ${['', 'Müde', 'Etwas müde', 'Okay', 'Erholt', 'Sehr erholt'][x.quality] || ''}${x.note ? ' · ' + esc(x.note) : ''}</div></div>${editDel('health.sleep', 'sleep', x.id)}</div>`, 'Noch keine Nächte eingetragen.')}</div>`;
    },
    ernaehrung() {
      const k = D.key(), w = S.health.water[k] || 0, goal = S.health.waterGoal || 8;
      const c = checklistCount('meals', 'health.meals', k);
      return `<div class="info">${icon('leaf')}<span>Hier geht es um <strong>Fürsorge, nicht um Kontrolle</strong>: regelmäßig, bunt und satt essen. Keine Kalorien, keine Verbote – dein Körper braucht Energie, um stark zu werden.</span></div>
      <div class="grid g3 mt">
        <div class="card"><div class="card-head"><div><p class="eyebrow">Heute</p><h3>Gut genährt</h3></div><span class="muted small">${c.done}/${c.total}</span></div>
          ${dailyChecklist('meals', 'health.meals', k)}${inlineAdd('Eigener Punkt …', 'data-path="health.meals"')}</div>
        <div class="card tint-sage"><div class="card-head"><div><p class="eyebrow">Trinken</p><h3>${w} von ${goal} Gläsern</h3></div></div>
          <div class="water">${Array.from({ length: Math.max(goal, w) }, (_, i) => `<button class="glass ${i < w ? 'on' : ''}" data-action="water-set" data-n="${i + 1 === w ? i : i + 1}" aria-label="${i + 1} Gläser"></button>`).join('')}</div>
          <div class="btn-row mt">${iconBtn('plus', 'data-action="water-set" data-n="' + (w + 1) + '"', 'Ein Glas mehr')}<span class="muted small">Tippe auf ein Glas, um es zu füllen.</span></div></div>
        <div class="card tint-sand"><p class="eyebrow">Ideen für ausgewogene Mahlzeiten</p><ul class="ex-list">${MEAL_IDEAS.map(m => `<li>${esc(m)}</li>`).join('')}</ul>
          <a class="btn ghost sm mt" href="#/bereiche/hobbies">Zu meinen Rezepten</a></div>
      </div>`;
    }
  },

  selfcare: {
    tabs: [{ id: 'routinen', label: 'Routinen' }, { id: 'woche', label: 'Selfcare-Woche' }, { id: 'outfits', label: 'Outfits' }, { id: 'pflege', label: 'Pflege & Produkte' }],
    routinen() {
      const k = D.key();
      const m = checklistCount('morning', 'selfcare.morning', k), e = checklistCount('evening', 'selfcare.evening', k);
      return `<div class="grid g2">
        <div class="card tint-rose"><div class="card-head"><div><p class="eyebrow">Morgens · Skincare & fertig machen</p><h3>Morgenroutine</h3></div><span class="muted small">${m.done}/${m.total}</span></div>
          ${progressBar(pct(m.done, m.total), 'rose')}<div class="mt-s">${dailyChecklist('morning', 'selfcare.morning', k)}</div>${inlineAdd('Schritt hinzufügen …', 'data-path="selfcare.morning"')}</div>
        <div class="card tint-sage"><div class="card-head"><div><p class="eyebrow">Abends · Zur Ruhe kommen</p><h3>Abendroutine</h3></div><span class="muted small">${e.done}/${e.total}</span></div>
          ${progressBar(pct(e.done, e.total))}<div class="mt-s">${dailyChecklist('evening', 'selfcare.evening', k)}</div>${inlineAdd('Schritt hinzufügen …', 'data-path="selfcare.evening"')}</div>
      </div><p class="muted small mt">Die Routinen setzen sich jeden Tag automatisch zurück. Was du heute abhakst, siehst du auch auf dem Dashboard.</p>`;
    },
    woche() {
      const ws = D.weekStart(D.key()), ch = S.weekChecks.selfcare?.[ws] || {};
      return `<div class="card"><div class="card-head"><div><p class="eyebrow">${esc(D.weekLabel(ws))}</p><h3>Wöchentlicher Selfcare-Plan</h3></div></div>
        <div class="grid g3">${WD.map((n, wd) => { const items = S.selfcare.weekly.filter(x => x.wd === wd); return `<div class="card flat ${wd === D.wd(D.key()) ? 'day-card today' : ''}" style="background:var(--cream)"><h3 style="font-size:20px">${n}</h3>
          <div class="check-list">${items.map(x => checkRow(x.text, !!ch[x.id], `data-action="wcheck-toggle" data-list="selfcare" data-week="${ws}" data-id="${x.id}"`, editDel('selfcare.weekly', 'textWd', x.id))).join('') || '<p class="muted small">Ein freier Tag.</p>'}</div>
          ${inlineAdd('Hinzufügen …', `data-path="selfcare.weekly" data-wd="${wd}"`)}</div>`; }).join('')}</div></div>`;
    },
    outfits() {
      const ws = D.weekStart(D.key()), o = S.selfcare.outfits[ws] || {};
      return `<div class="card"><div class="card-head"><div><p class="eyebrow">${esc(D.weekLabel(ws))}</p><h3>Outfitplanung</h3></div></div>
        <p class="muted small" style="margin-bottom:14px">Plane deine Outfits für die Woche – das spart morgens Zeit und gibt dir ein gutes Gefühl. Wird beim Verlassen des Feldes gespeichert.</p>
        <div class="grid g2">${WD.map((n, wd) => `<label class="field"><span class="field-label">${n} · ${esc(S.week.focus[wd] || '')}</span><input value="${esc(o[wd] || '')}" placeholder="z. B. Beige Strickpulli, Jeans, weiße Sneaker" data-change="outfit-set" data-wd="${wd}" data-week="${ws}"></label>`).join('')}</div></div>`;
    },
    pflege() {
      const p = S.selfcare.products;
      return `<div class="grid g3"><div class="card span2"><div class="card-head"><div><p class="eyebrow">Skincare · Haare · Nägel · Körper</p><h3>Meine Pflegeprodukte</h3></div>${addBtn('Produkt', 'data-action="crud-add" data-path="selfcare.products" data-form="product"')}</div>
        ${['Gesicht', 'Haare', 'Nägel', 'Körper', 'Sonstiges'].map(t => { const xs = p.filter(x => x.type === t); return xs.length ? `<p class="eyebrow mt">${t}</p>${list(xs, x => `<div class="list-item"><div class="li-body"><div class="li-title">${esc(x.name)}</div>${x.note ? `<div class="li-sub">${esc(x.note)}</div>` : ''}</div>${editDel('selfcare.products', 'product', x.id)}</div>`, '')}` : ''; }).join('') || emptyState('Noch keine Produkte.')}</div>
        <div class="card tint-rose"><p class="eyebrow">Pflege-Rhythmus</p><dl class="kv"><dt>Täglich</dt><dd>Duschen, Zähneputzen, Morgen- & Abend-Skincare</dd><dt>2× / Woche</dt><dd>Haarpflege & Haarkur</dd><dt>Wöchentlich</dt><dd>Nägel (Freitag), Peeling, Gesichtsmaske</dd></dl>
          <a class="btn ghost sm mt" href="#/habits">Zum Habit Tracker</a></div></div>`;
    }
  },

  knowledge: {
    tabs: [{ id: 'lesen', label: 'Lesetracker' }, { id: 'archiv', label: 'Gelesen' }, { id: 'sprachen', label: 'Sprachen' }, { id: 'ziele', label: 'Lernziele' }, { id: 'notizen', label: 'Notizen' }],
    lesen() {
      const b = S.knowledge.books, reading = b.filter(x => x.status === 'reading'), want = b.filter(x => x.status === 'want');
      const year = D.key().slice(0, 4), doneYear = b.filter(x => x.status === 'done' && (x.finished || '').startsWith(year)).length;
      const book = (x, i) => `<div class="book"><div class="book-spine ${['', 's2', 's3'][i % 3]}">${esc(x.title[0] || '•')}</div><div class="book-body">
        <div class="book-title">${esc(x.title)}</div><div class="muted small">${esc(x.author || '')}</div>
        ${x.status === 'reading' ? `<div class="mt-s">${progressBar(pct(x.currentPage, x.pages), 'rose')}</div><div class="muted small mt-s">Seite ${x.currentPage} von ${x.pages} · ${pct(x.currentPage, x.pages)}%</div>
          <div class="btn-row mt-s"><button class="btn soft sm" data-action="book-progress" data-id="${x.id}">Seite eintragen</button><button class="btn ghost sm" data-action="book-finish" data-id="${x.id}">Fertig gelesen</button></div>`
        : `<div class="btn-row mt-s"><button class="btn soft sm" data-action="book-start" data-id="${x.id}">Jetzt lesen</button></div>`}
        </div>${editDel('knowledge.books', 'book', x.id)}</div>`;
      return `<div class="grid g3">
        <div class="card span2"><div class="card-head"><div><p class="eyebrow">Lese ich gerade</p><h3>Lesefortschritt</h3></div>${addBtn('Buch', 'data-action="crud-add" data-path="knowledge.books" data-form="book"', 'primary')}</div>
          ${reading.length ? reading.map(book).join('') : emptyState('Gerade kein Buch in Arbeit. Such dir eins aus deiner Liste aus.', 'book')}</div>
        <div class="card tint-rose"><p class="eyebrow">${year}</p><div class="stat"><strong>${doneYear}</strong><span>Bücher gelesen</span></div>
          <div class="stat mt"><strong>${want.length}</strong><span>auf deiner Leseliste</span></div></div>
      </div>
      <div class="card mt"><div class="card-head"><h3>Meine Bücherliste</h3></div>${want.length ? want.map(book).join('') : emptyState('Deine Leseliste ist leer – welche Bücher reizen dich?')}</div>`;
    },
    archiv() {
      const done = S.knowledge.books.filter(x => x.status === 'done').sort((a, b) => (b.finished || '').localeCompare(a.finished || ''));
      return `<div class="card"><div class="card-head"><div><p class="eyebrow">Archiv</p><h3>Gelesene Bücher</h3></div><span class="muted small">${plural(done.length, 'Buch', 'Bücher')}</span></div>
        ${done.length ? done.map((x, i) => `<div class="book"><div class="book-spine ${['s2', 's3', ''][i % 3]}">${esc(x.title[0] || '•')}</div><div class="book-body"><div class="book-title">${esc(x.title)}</div><div class="muted small">${esc(x.author || '')} · ${x.pages} Seiten${x.finished ? ' · beendet am ' + esc(D.long(x.finished)) : ''}</div>${stars(x.rating)}${x.notes ? `<p class="mt-s small">${nl2br(x.notes)}</p>` : ''}</div>${editDel('knowledge.books', 'book', x.id)}</div>`).join('') : emptyState('Hier sammeln sich die Bücher, die du beendet hast.', 'book')}</div>`;
    },
    sprachen() {
      const ws = D.weekStart(D.key()), langs = S.knowledge.languages;
      const log = [...S.knowledge.langLog].sort((a, b) => b.date.localeCompare(a.date));
      const chart = Array.from({ length: 8 }, (_, i) => { const w = D.add(ws, (i - 7) * 7); return { label: D.short(w), value: weekMinutes(null, w), hl: w === ws }; });
      return `<div class="grid g2">${langs.map(l => { const m = weekMinutes(l.id, ws), tot = S.knowledge.langLog.filter(x => x.langId === l.id).reduce((a, x) => a + (Number(x.minutes) || 0), 0);
        return `<div class="card tint-sage"><div class="card-head"><div><p class="eyebrow">Niveau ${esc(l.level || '')}</p><h3>${esc(l.name)}</h3></div>${editDel('knowledge.languages', 'language', l.id)}</div>
          ${l.goal ? `<p class="muted small">Ziel: ${esc(l.goal)}</p>` : ''}
          <div class="mt">${hbar('Diese Woche', m, l.weeklyGoal || 60, `${m} von ${l.weeklyGoal || 60} Min.`)}</div>
          <p class="muted small">Insgesamt ${fmtNum(tot / 60)} Stunden gelernt</p>
          <button class="btn sage sm mt" data-action="lang-log" data-id="${l.id}">${icon('plus')}<span>Lerneinheit eintragen</span></button></div>`; }).join('')}
        <div class="card" style="display:flex;flex-direction:column;justify-content:center;align-items:flex-start;gap:10px"><p class="muted">Möchtest du eine weitere Sprache lernen?</p>${addBtn('Sprache hinzufügen', 'data-action="crud-add" data-path="knowledge.languages" data-form="language"')}</div></div>
        <div class="grid g2 mt"><div class="card"><div class="card-head"><h3>Minuten pro Woche</h3></div>${barChart(chart, { height: 110 })}</div>
        <div class="card"><div class="card-head"><h3>Lernprotokoll</h3></div>${list(log.slice(0, 12), x => `<div class="list-item"><div class="li-body"><div class="li-title">${esc(langs.find(l => l.id === x.langId)?.name || 'Sprache')} · ${x.minutes} Min.</div><div class="li-sub">${esc(D.fmt(x.date))}${x.note ? ' · ' + esc(x.note) : ''}</div></div>${iconBtn('trash', `data-action="crud-del" data-path="knowledge.langLog" data-id="${x.id}"`, 'Löschen')}</div>`, 'Noch keine Lerneinheiten.')}</div></div>`;
    },
    ziele() {
      const g = S.knowledge.goals;
      return `<div class="card"><div class="card-head"><h3>Lernziele</h3></div>
        <div class="check-list">${g.map(x => checkRow(x.text, x.done, `data-action="crud-toggle" data-path="knowledge.goals" data-id="${x.id}"`, editDel('knowledge.goals', 'text', x.id), x.done && x.doneDate ? 'erreicht am ' + esc(D.long(x.doneDate)) : '')).join('') || emptyState('Was möchtest du lernen?')}</div>
        ${inlineAdd('Neues Lernziel …', 'data-path="knowledge.goals" data-done="1"')}</div>`;
    },
    notizen() {
      const n = [...S.knowledge.notes].sort((a, b) => b.date.localeCompare(a.date));
      return `<div class="card"><div class="card-head"><h3>Lernnotizen</h3>${addBtn('Notiz', 'data-action="crud-add" data-path="knowledge.notes" data-form="knote"', 'primary')}</div>
        ${n.length ? n.map(x => `<details class="entry"><summary><div><h4>${esc(x.title)}</h4><span class="muted small">${esc(D.long(x.date))}</span></div>${icon('chevR', 'chev')}</summary><p class="mt-s" style="white-space:pre-wrap">${esc(x.text || '')}</p><div class="mt-s">${editDel('knowledge.notes', 'knote', x.id)}</div></details>`).join('') : emptyState('Halte fest, was du lernst – aus Büchern, Kursen oder Gesprächen.', 'note')}</div>`;
    }
  },

  hobbies: {
    tabs: [{ id: 'kochen', label: 'Kochen & Rezepte' }, { id: 'ideen', label: 'Neues ausprobieren' }, { id: 'kreativ', label: 'Kreative Projekte' }, { id: 'gaming', label: 'Gaming' }],
    kochen() {
      const r = S.hobbies.recipes, ideas = r.filter(x => x.status === 'idea'), tried = r.filter(x => x.status !== 'idea');
      const row = x => `<div class="list-item"><div class="li-body"><div class="li-title">${esc(x.name)} ${x.status === 'fav' ? '<span class="badge important">Liebling</span>' : ''}</div><div class="li-sub">${esc(x.category || '')}${x.tried ? ' · ausprobiert am ' + esc(D.long(x.tried)) : ''} ${stars(x.rating)}</div>${x.link ? `<a class="small" href="${esc(x.link)}" target="_blank" rel="noopener">Rezept öffnen</a>` : ''}</div>
        ${x.status === 'idea' ? `<button class="btn soft sm" data-action="recipe-tried" data-id="${x.id}">Ausprobiert</button>` : ''}${editDel('hobbies.recipes', 'recipe', x.id)}</div>`;
      return `<div class="grid g2"><div class="card"><div class="card-head"><div><p class="eyebrow">Möchte ich kochen</p><h3>Neue Rezepte</h3></div>${addBtn('Rezept', 'data-action="crud-add" data-path="hobbies.recipes" data-form="recipe"', 'primary')}</div>${list(ideas, row, 'Alle Ideen ausprobiert! Zeit für neue Rezepte.')}</div>
        <div class="card tint-sand"><div class="card-head"><div><p class="eyebrow">Mein Kochbuch</p><h3>Ausprobiert (${tried.length})</h3></div></div>${list(tried, row, 'Hier landen Rezepte, die du gekocht hast.')}</div></div>`;
    },
    ideen() {
      const i = S.hobbies.ideas, open = i.filter(x => !x.done), done = i.filter(x => x.done);
      const pick = open.find(x => x.id === App.ui.randomIdea);
      return `<div class="grid g3"><div class="card tint-rose"><p class="eyebrow">Zufallsidee</p><p class="vision-line">${pick ? esc(pick.text) : 'Lass dich überraschen – was könntest du als Nächstes ausprobieren?'}</p>
        <button class="btn primary sm mt" data-action="idea-random" ${open.length ? '' : 'disabled'}>${icon('sparkle')}<span>Idee ziehen</span></button></div>
        <div class="card span2"><div class="card-head"><div><p class="eyebrow">Ideenliste</p><h3>Hobbys & Aktivitäten zum Ausprobieren</h3></div>${addBtn('Idee', 'data-action="crud-add" data-path="hobbies.ideas" data-form="idea"')}</div>
          <div class="check-list">${open.map(x => checkRow(x.text, false, `data-action="crud-toggle" data-path="hobbies.ideas" data-id="${x.id}"`, editDel('hobbies.ideas', 'idea', x.id), esc(x.category))).join('') || emptyState('Alle Ideen ausprobiert – wie mutig!')}</div>
          ${done.length ? `<p class="eyebrow mt">Schon ausprobiert (${done.length})</p><div class="check-list">${done.map(x => checkRow(x.text, true, `data-action="crud-toggle" data-path="hobbies.ideas" data-id="${x.id}"`, editDel('hobbies.ideas', 'idea', x.id), x.doneDate ? esc(D.long(x.doneDate)) : '')).join('')}</div>` : ''}</div></div>`;
    },
    kreativ() {
      const p = S.hobbies.projects;
      return `<div class="card"><div class="card-head"><div><p class="eyebrow">Persönliche Interessen</p><h3>Kreative Projekte</h3></div>${addBtn('Projekt', 'data-action="crud-add" data-path="hobbies.projects" data-form="cproject"', 'primary')}</div>
        ${p.length ? `<div class="grid g2">${p.map(x => `<div class="card flat" style="background:var(--cream)"><div class="card-head" style="margin-bottom:8px"><div><span class="badge ${x.status === 'done' ? 'sage' : ''}">${{ idea: 'Idee', active: 'In Arbeit', done: 'Fertig' }[x.status]}</span><h3 style="font-size:21px;margin-top:6px">${esc(x.title)}</h3></div>${editDel('hobbies.projects', 'cproject', x.id)}</div>
          ${progressBar(x.progress || 0, 'rose')}<div class="btn-row mt-s"><span class="muted small">${x.progress || 0}%</span><span class="spacer"></span>${iconBtn('plus', `data-action="cp-step" data-id="${x.id}" data-n="10"`, '+10 %')}</div>${x.note ? `<p class="small mt-s">${nl2br(x.note)}</p>` : ''}</div>`).join('')}</div>` : emptyState('Noch keine Projekte – was möchtest du erschaffen?', 'palette')}</div>`;
    },
    gaming() {
      const g = S.hobbies.games, lbl = { wish: 'Wunschliste', playing: 'Spiele ich gerade', done: 'Durchgespielt' };
      return `<div class="card"><div class="card-head"><h3>Meine Spiele</h3>${addBtn('Spiel', 'data-action="crud-add" data-path="hobbies.games" data-form="game"', 'primary')}</div>
        ${['playing', 'wish', 'done'].map(st => { const xs = g.filter(x => x.status === st); return xs.length ? `<p class="eyebrow mt">${lbl[st]}</p>${list(xs, x => `<div class="list-item"><div class="li-body"><div class="li-title">${esc(x.title)}</div><div class="li-sub">${esc(x.platform || '')}${x.note ? ' · ' + esc(x.note) : ''}</div></div>${editDel('hobbies.games', 'game', x.id)}</div>`, '')}` : ''; }).join('') || emptyState('Noch keine Spiele eingetragen.')}
        <p class="muted small mt">Gaming ist Freizeit und Erholung – ganz ohne schlechtes Gewissen.</p></div>`;
    }
  },

  social: {
    tabs: [{ id: 'challenges', label: 'Herausforderungen' }, { id: 'mut', label: 'Mut-Momente' }, { id: 'impulse', label: 'Gesprächsimpulse' }],
    challenges() {
      const ch = S.social.challenges;
      const rec = (CHALLENGE_LEVELS.find(l => ch.filter(c => c.level === l.level && c.done).length < Math.min(3, ch.filter(c => c.level === l.level).length)) || CHALLENGE_LEVELS[4]).level;
      const total = ch.filter(c => c.done).length;
      return `<div class="grid g3" style="margin-bottom:20px"><div class="card tint-rose span2"><p class="eyebrow">Independence & Social Life</p><p class="vision-line">Mut wächst in kleinen Schritten. Die Herausforderungen werden langsam schwieriger – du bestimmst das Tempo.</p>
        <p class="muted small mt">Empfohlen für dich gerade: <strong>Stufe ${rec}</strong>. Du kannst jederzeit jede Stufe ausprobieren.</p></div>
        <div class="card tint-sage"><div class="stat"><strong>${total}<span class="muted" style="font-size:20px"> / ${ch.length}</span></strong><span>Herausforderungen gemeistert</span></div><div class="mt-s">${progressBar(pct(total, ch.length))}</div>
          ${addBtn('Eigene Herausforderung', 'data-action="crud-add" data-path="social.challenges" data-form="challenge"', 'ghost')}</div></div>
        ${CHALLENGE_LEVELS.map(l => { const xs = ch.filter(c => c.level === l.level), dn = xs.filter(c => c.done).length;
          return `<details class="card level ${l.level === rec ? 'rec' : ''}" ${l.level === rec ? 'open' : ''} style="margin-bottom:14px"><summary><span class="level-num">${l.level}</span><div style="flex:1"><h3 style="font-size:22px">${l.name}</h3><span class="muted small">${l.text} · ${dn}/${xs.length}</span></div>${l.level === rec ? '<span class="badge sage">empfohlen</span>' : ''}</summary>
          <div class="check-list mt">${xs.map(c => `<div class="check-row ${c.done ? 'done' : ''}">${checkBtn(c.done, `data-action="${c.done ? 'ch-undo' : 'ch-done'}" data-id="${c.id}"`, c.text)}<div class="cr-body" data-action="${c.done ? 'ch-undo' : 'ch-done'}" data-id="${c.id}"><span class="cr-text">${esc(c.text)}</span>${c.done ? `<span class="cr-sub">Geschafft am ${esc(D.long(c.doneDate))}${c.feeling ? ' · ' + esc(c.feeling) : ''}</span>` : ''}</div>${editDel('social.challenges', 'challenge', c.id)}</div>`).join('')}</div></details>`; }).join('')}`;
    },
    mut() {
      const done = S.social.challenges.filter(c => c.done).sort((a, b) => (b.doneDate || '').localeCompare(a.doneDate || ''));
      return `<div class="card"><div class="card-head"><div><p class="eyebrow">Mein Mut-Tagebuch</p><h3>Mut-Momente</h3></div></div>
        ${done.length ? done.map(c => `<div class="entry"><div class="card-head" style="margin-bottom:4px"><h4>${esc(c.text)}</h4><span class="badge">Stufe ${c.level}</span></div><p class="muted small">${esc(D.long(c.doneDate))}${c.feeling ? ' · ' + esc(c.feeling) : ''}</p>${c.note ? `<p class="mt-s">${nl2br(c.note)}</p>` : ''}</div>`).join('') : emptyState('Jede gemeisterte Herausforderung wird hier zu einer Erinnerung daran, wie mutig du bist.', 'compass')}</div>`;
    },
    impulse() {
      return `<div class="grid g2"><div class="card tint-sage"><div class="card-head"><div><p class="eyebrow">Zum Ausprobieren</p><h3>Gesprächseinstiege</h3></div></div><ul class="ex-list">${CONVERSATION_STARTERS.map(s => `<li>„${esc(s)}“</li>`).join('')}</ul></div>
        <div class="card tint-rose"><div class="card-head"><div><p class="eyebrow">Zum Erinnern</p><h3>Selbstbewusst in Gesprächen</h3></div></div><ul class="ex-list">${SOCIAL_TIPS.map(s => `<li>${esc(s)}</li>`).join('')}</ul></div></div>`;
    }
  },

  home: {
    tabs: [{ id: 'haushalt', label: 'Haushaltsplan' }, { id: 'katzen', label: 'Katzen' }, { id: 'einkauf', label: 'Einkaufslisten' }, { id: 'projekte', label: 'Projekte' }],
    haushalt() {
      const k = D.key(), ws = D.weekStart(k), ch = S.weekChecks.household?.[ws] || {};
      const all = S.home.household, dn = all.filter(x => ch[x.id]).length;
      const r = checklistCount('reset', 'home.reset', k);
      return `<div class="grid g3"><div class="card span2"><div class="card-head"><div><p class="eyebrow">${esc(D.weekLabel(ws))}</p><h3>Haushaltsplan</h3></div><span class="muted small">${dn}/${all.length}</span></div>
        ${progressBar(pct(dn, all.length))}
        ${WD.map((n, wd) => { const xs = all.filter(x => x.wd === wd); return `<p class="eyebrow mt" style="${wd === D.wd(k) ? 'color:var(--sage-deep)' : ''}">${n}${wd === D.wd(k) ? ' · heute' : ''}</p><div class="check-list">${xs.map(x => checkRow(x.text, !!ch[x.id], `data-action="wcheck-toggle" data-list="household" data-week="${ws}" data-id="${x.id}"`, editDel('home.household', 'textWd', x.id))).join('') || '<p class="muted small">Frei.</p>'}</div>`; }).join('')}
        <div class="mt">${addBtn('Aufgabe', 'data-action="crud-add" data-path="home.household" data-form="textWd"')}</div></div>
        <div class="stack"><div class="card tint-sand"><div class="card-head"><div><p class="eyebrow">Ordnung · täglich</p><h3>Kleiner Reset</h3></div><span class="muted small">${r.done}/${r.total}</span></div>
          ${dailyChecklist('reset', 'home.reset', k)}${inlineAdd('Punkt hinzufügen …', 'data-path="home.reset"')}</div>
          <div class="card"><p class="eyebrow">Organisation</p><p>Deine Wochenplanung mit allen Schwerpunkten findest du im Wochenplan.</p><a class="btn ghost sm mt" href="#/woche">Zum Wochenplan</a></div></div></div>`;
    },
    katzen() {
      const k = D.key(), c = checklistCount('cats', 'home.catCare', k);
      return `<div class="grid g2"><div class="card tint-rose"><div class="card-head"><div><p class="eyebrow">Heute</p><h3>Katzenversorgung</h3></div><span class="muted small">${c.done}/${c.total}</span></div>
        ${progressBar(pct(c.done, c.total), 'rose')}<div class="mt-s">${dailyChecklist('cats', 'home.catCare', k)}</div>${inlineAdd('Punkt hinzufügen …', 'data-path="home.catCare"')}</div>
        <div class="card"><div class="card-head"><div><p class="eyebrow">Merken</p><h3>Rund um die Katzen</h3></div></div>
        <div class="check-list">${S.home.catNotes.map(x => checkRow(x.text, !!x.done, `data-action="crud-toggle" data-path="home.catNotes" data-id="${x.id}"`, editDel('home.catNotes', 'text', x.id))).join('') || emptyState('Tierarzttermine, Futter, Spielzeug …', 'cat')}</div>
        ${inlineAdd('Notiz oder Erledigung …', 'data-path="home.catNotes" data-done="1"')}</div></div>`;
    },
    einkauf() {
      return `<div class="card-head"><h2 style="font-size:28px">Einkaufslisten</h2>${addBtn('Neue Liste', 'data-action="crud-add" data-path="home.shopping" data-form="shoplist"', 'primary')}</div>
        ${S.home.shopping.length ? `<div class="grid g2">${S.home.shopping.map(l => { const open = l.items.filter(i => !i.done), done = l.items.filter(i => i.done);
          return `<div class="card"><div class="card-head"><div><h3>${esc(l.name)}</h3><span class="muted small">${open.length} offen</span></div>${editDel('home.shopping', 'shoplist', l.id)}</div>
          <div class="check-list">${[...open, ...done].map(i => checkRow(i.text, i.done, `data-action="sub-toggle" data-path="home.shopping" data-id="${l.id}" data-sub="items" data-sid="${i.id}"`, iconBtn('x', `data-action="sub-del" data-path="home.shopping" data-id="${l.id}" data-sub="items" data-sid="${i.id}"`, 'Entfernen'))).join('') || '<p class="muted small">Die Liste ist leer.</p>'}</div>
          ${inlineAdd('Artikel hinzufügen …', `data-path="home.shopping" data-id="${l.id}" data-sub="items"`, 'subAdd')}
          ${done.length ? `<button class="btn ghost sm mt" data-action="shop-clear" data-id="${l.id}">Erledigte entfernen (${done.length})</button>` : ''}</div>`; }).join('')}</div>` : `<div class="card">${emptyState('Noch keine Einkaufsliste.', 'cart')}</div>`}`;
    },
    projekte() {
      const p = S.home.projects;
      return `<div class="card-head"><h2 style="font-size:28px">Persönliche Projekte</h2>${addBtn('Projekt', 'data-action="crud-add" data-path="home.projects" data-form="hproject"', 'primary')}</div>
        ${p.length ? `<div class="grid g2">${p.map(x => { const dn = x.steps.filter(s => s.done).length;
          return `<div class="card"><div class="card-head"><div><h3>${esc(x.title)}</h3>${x.note ? `<p class="card-sub">${esc(x.note)}</p>` : ''}</div>${editDel('home.projects', 'hproject', x.id)}</div>
          ${progressBar(pct(dn, x.steps.length))}<p class="muted small mt-s">${dn} von ${x.steps.length} Schritten</p>
          <div class="check-list">${x.steps.map(s => checkRow(s.text, s.done, `data-action="sub-toggle" data-path="home.projects" data-id="${x.id}" data-sub="steps" data-sid="${s.id}"`, iconBtn('pen', `data-action="sub-edit" data-path="home.projects" data-id="${x.id}" data-sub="steps" data-sid="${s.id}"`, 'Bearbeiten'))).join('')}</div>
          ${inlineAdd('Nächster Schritt …', `data-path="home.projects" data-id="${x.id}" data-sub="steps"`, 'subAdd')}</div>`; }).join('')}</div>` : `<div class="card">${emptyState('Noch keine Projekte.')}</div>`}`;
    }
  }
};

/* ---------- Seite ---------- */
Pages.bereiche = {
  title: sub => (AREAS.find(a => a.id === sub)?.name || 'Lebensbereiche'),
  render(sub) {
    const area = AREAS.find(a => a.id === sub);
    if (!area) return this.overview();
    const v = AREA_VIEWS[area.id];
    const tab = v.tabs.some(t => t.id === App.ui.tabs[area.id]) ? App.ui.tabs[area.id] : v.tabs[0].id;
    return `${pageHead(`${area.num} · Lebensbereich`, esc(area.name), esc(area.de))}
      ${tabs(area.id, v.tabs, tab)}
      ${v[tab]()}`;
  },
  overview() {
    const k = D.key();
    const info = {
      mindset: `${plural(S.mindset.journal.length, 'Journal-Eintrag', 'Journal-Einträge')}`,
      health: `${S.health.workouts.filter(w => w.type === 'Krafttraining' && D.weekStart(w.date) === D.weekStart(k)).length} / 3 Krafttrainings diese Woche`,
      selfcare: (() => { const m = checklistCount('morning', 'selfcare.morning', k), e = checklistCount('evening', 'selfcare.evening', k); return `Routinen heute: ${m.done + e.done} / ${m.total + e.total}`; })(),
      knowledge: `${S.knowledge.books.filter(b => b.status === 'reading').length} Buch/Bücher in Arbeit`,
      hobbies: `${S.hobbies.ideas.filter(i => !i.done).length} Ideen zum Ausprobieren`,
      social: `${S.social.challenges.filter(c => c.done).length} von ${S.social.challenges.length} Herausforderungen`,
      home: (() => { const c = checklistCount('cats', 'home.catCare', k); return `Katzen heute: ${c.done} / ${c.total}`; })()
    };
    return `${pageHead('Lebensbereiche', 'Meine sieben Lebensbereiche', 'Jeder Bereich ist ein Teil der Frau, die du wirst. Du musst nicht überall gleichzeitig wachsen.')}
      <div class="grid g3">${AREAS.map(a => `<a class="card area-card ${['tint-rose', 'tint-sage', 'tint-sand'][Number(a.num) % 3]}" href="#/bereiche/${a.id}">
        <div class="card-head" style="margin:0"><span class="area-num">${a.num}</span>${icon(a.icon)}</div>
        <h3>${esc(a.name)}</h3><p class="muted">${esc(a.de)}</p><p class="small mt-s">${info[a.id]}</p></a>`).join('')}</div>`;
  },
  mount() {},
  actions: {
    'quote-next'() { App.ui.quoteShift++; App.render(); },
    'ground-next'() { App.ui.groundStep++; App.render(); },
    'ground-reset'() { App.ui.groundStep = 0; App.render(); },
    'breath-start'() {
      const c = $('#breath-circle'), info = $('#breath-info'), btn = $('#breath-btn');
      if (!c) return;
      App.ui.timers.forEach(t => clearInterval(t)); App.ui.timers = [];
      btn.disabled = true;
      const phases = [['in', 'Einatmen', 4], ['hold', 'Halten', 4], ['out', 'Ausatmen', 6]];
      let round = 0, p = 0, left = phases[0][2];
      const apply = () => { c.className = 'breath-circle ' + phases[p][0]; c.textContent = phases[p][1]; info.textContent = `Atemzug ${round + 1} von 5 · ${left}`; };
      apply();
      const t = setInterval(() => {
        left--;
        if (left <= 0) {
          p++;
          if (p >= phases.length) { p = 0; round++; }
          if (round >= 5) { clearInterval(t); c.className = 'breath-circle'; c.textContent = 'Schön.'; info.textContent = 'Spür kurz nach, wie es dir jetzt geht.'; btn.disabled = false; return; }
          left = phases[p][2];
        }
        apply();
      }, 1000);
      App.ui.timers.push(t);
    },
    'workout-start'(d) {
      const t = S.health.templates.find(x => x.id === d.id); if (!t) return;
      GlobalActions['crud-add']({ path: 'health.workouts', form: 'workout', type: 'Krafttraining', title: t.title, extext: t.exText });
    },
    'water-set'(d) { commit(s => { s.health.water[D.key()] = Math.max(0, Number(d.n)); }); },
    'book-progress'(d) {
      const b = S.knowledge.books.find(x => x.id === d.id); if (!b) return;
      openForm({
        title: 'Lesefortschritt', intro: esc(b.title), fields: [{ name: 'currentPage', label: `Aktuelle Seite (von ${b.pages})`, type: 'number', min: 0, max: b.pages, required: true }], values: b,
        onSubmit(v) {
          const p = clamp(v.currentPage || 0, 0, b.pages);
          commit(() => { b.currentPage = p; if (p >= b.pages) { b.status = 'done'; b.finished = D.key(); } });
          toast(p >= b.pages ? 'Buch beendet – herzlichen Glückwunsch! 📖' : 'Fortschritt gespeichert ✓');
        }
      });
    },
    'book-finish'(d) { commit(s => { const b = s.knowledge.books.find(x => x.id === d.id); if (b) { b.status = 'done'; b.finished = D.key(); b.currentPage = b.pages; } }); toast('Ins Archiv gelegt – wunderbar! 📖'); },
    'book-start'(d) { commit(s => { const b = s.knowledge.books.find(x => x.id === d.id); if (b) { b.status = 'reading'; b.started = D.key(); } }); },
    'lang-log'(d) {
      openForm({
        title: 'Lerneinheit eintragen', fields: [{ name: 'date', label: 'Datum', type: 'date', half: true, required: true }, { name: 'minutes', label: 'Minuten', type: 'number', min: 1, half: true, required: true }, { name: 'note', label: 'Was hast du gelernt?', placeholder: 'z. B. Vokabeln Essen & Trinken' }],
        values: { date: D.key(), minutes: 20 },
        onSubmit(v) { commit(s => s.knowledge.langLog.push({ id: uid(), langId: d.id, date: v.date, minutes: Math.max(1, v.minutes || 0), note: v.note })); toast('Lerneinheit gespeichert ✓'); }
      });
    },
    'recipe-tried'(d) {
      const r = S.hobbies.recipes.find(x => x.id === d.id); if (!r) return;
      openForm({
        title: 'Wie war es?', intro: esc(r.name), fields: [{ name: 'rating', label: 'Bewertung', type: 'rating' }, { name: 'fav', label: 'Lieblingsrezept?', type: 'select', options: [{ value: 'tried', label: 'Nein, einfach ausprobiert' }, { value: 'fav', label: 'Ja, ein neues Lieblingsrezept!' }] }, { name: 'notes', label: 'Notizen', type: 'textarea', rows: 3 }],
        values: { rating: 4, fav: 'tried', notes: r.notes },
        onSubmit(v) { commit(() => Object.assign(r, { status: v.fav, rating: v.rating, notes: v.notes, tried: D.key() })); toast('Ins Kochbuch aufgenommen ✓'); }
      });
    },
    'idea-random'() {
      const open = S.hobbies.ideas.filter(x => !x.done); if (!open.length) return;
      let n; do { n = open[Math.floor(Math.random() * open.length)]; } while (open.length > 1 && n.id === App.ui.randomIdea);
      App.ui.randomIdea = n.id; App.render();
    },
    'cp-step'(d) { commit(s => { const p = s.hobbies.projects.find(x => x.id === d.id); if (p) { p.progress = clamp((p.progress || 0) + Number(d.n), 0, 100); if (p.progress >= 100) p.status = 'done'; else if (p.status === 'idea') p.status = 'active'; } }); },
    'ch-done'(d) {
      const c = S.social.challenges.find(x => x.id === d.id); if (!c) return;
      openForm({
        title: 'Geschafft! Wie war es?', intro: `<strong>${esc(c.text)}</strong><br>Egal wie es lief: Du hast es versucht. Das zählt.`,
        fields: [{ name: 'doneDate', label: 'Wann?', type: 'date', required: true }, { name: 'feeling', label: 'Wie hat es sich angefühlt?', type: 'select', options: ['Leichter als gedacht', 'Aufregend, aber gut', 'Schwer – aber ich habe es gemacht', 'Ich bin stolz auf mich'] }, { name: 'note', label: 'Was nimmst du mit?', type: 'textarea', rows: 3 }],
        values: { doneDate: D.key() }, submitLabel: 'Als geschafft speichern',
        onSubmit(v) { commit(() => Object.assign(c, v, { done: true })); toast('Mutig! Ein neuer Mut-Moment ✓'); }
      });
    },
    'ch-undo'(d) {
      confirmDialog('Die Herausforderung wird wieder als offen markiert. Deine Notiz bleibt erhalten.', { title: 'Wieder öffnen?', ok: 'Wieder öffnen' }).then(ok => {
        if (ok) commit(s => { const c = s.social.challenges.find(x => x.id === d.id); if (c) { c.done = false; c.doneDate = null; } });
      });
    },
    'shop-clear'(d) { commit(s => { const l = s.home.shopping.find(x => x.id === d.id); if (l) l.items = l.items.filter(i => !i.done); }); }
  },
  submits: {
    'journal-save'(v) {
      const k = D.key();
      const answers = { self: v.self, proud: v.proud, mind: v.mind, tomorrow: v.tomorrow, free: v.free };
      if (!Object.values(answers).some(x => (x || '').trim())) return toast('Schreib zuerst ein paar Gedanken auf.');
      commit(s => {
        const e = s.mindset.journal.find(j => j.date === k);
        if (e) Object.assign(e, { answers, mood: v.mood }); else s.mindset.journal.push({ id: uid(), date: k, answers, mood: v.mood });
      });
      toast('Journal gespeichert ✓');
    },
    'worry-add'(v) {
      if (!(v.text || '').trim()) return;
      commit(s => s.mindset.worries.push({ id: uid(), text: v.text.trim(), control: v.control, step: (v.step || '').trim(), date: D.key(), released: false }));
      toast(v.control === 'no' ? 'Geparkt. Du darfst es jetzt loslassen.' : 'Geparkt. Ein Schritt nach dem anderen.');
    }
  },
  changes: {
    'outfit-set'(d, el) { commit(s => { (s.selfcare.outfits[d.week] ||= {})[d.wd] = el.value; }, { render: false }); toast('Outfit gespeichert ✓'); }
  }
};
