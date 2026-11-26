/* Einstellungen: Profil, Vision, Erinnerungen, Daten */

Pages.einstellungen = {
  title: () => 'Einstellungen',
  render() {
    const perm = Notify.permission();
    const permText = {
      unsupported: 'Dein Browser unterstützt keine Benachrichtigungen. Alle anderen Funktionen arbeiten ganz normal.',
      denied: 'Benachrichtigungen wurden im Browser blockiert. Du kannst sie in den Website-Einstellungen deines Browsers wieder erlauben.',
      default: 'Der Browser fragt dich nach der Erlaubnis, sobald du Erinnerungen aktivierst.',
      granted: 'Benachrichtigungen sind erlaubt.'
    }[perm];
    const on = S.settings.notifications && perm === 'granted';
    let size = 0; try { size = new Blob([JSON.stringify(S)]).size; } catch (e) {}
    return `
    ${pageHead('Einstellungen', 'Dein persönliches Zuhause', 'Passe Becoming Her an dich an. Alle Daten bleiben ausschließlich auf diesem Gerät, in deinem Browser.')}
    <div class="grid g2">
      <div class="card">
        <div class="card-head"><h3>Profil</h3></div>
        <form data-submit="profile-save" class="form-grid">
          <label class="field"><span class="field-label">Wie dürfen wir dich nennen?</span><input name="name" value="${esc(S.profile.name)}" placeholder="Dein Vorname (optional)"></label>
          <label class="field"><span class="field-label">Start deiner Reise</span><input type="date" name="startDate" value="${esc(S.profile.startDate)}" required><small class="help">Davon hängen die Wochen im Entwicklungsplan ab.</small></label>
          <label class="field"><span class="field-label">Trinkziel (Gläser pro Tag)</span><input type="number" name="waterGoal" min="1" max="20" value="${S.health.waterGoal}"></label>
          <div class="field"><button class="btn primary" style="align-self:flex-start">Speichern</button></div>
        </form>
      </div>

      <div class="card">
        <div class="card-head"><div><p class="eyebrow">Optional</p><h3>Erinnerungen</h3></div>
          <button class="switch ${on ? 'on' : ''}" data-action="notify-toggle" aria-pressed="${on}" aria-label="Erinnerungen ${on ? 'ausschalten' : 'einschalten'}" ${perm === 'unsupported' ? 'disabled' : ''}></button></div>
        <div class="info ${perm === 'denied' || perm === 'unsupported' ? 'rose' : ''}">${icon('bell')}<span>${permText}</span></div>
        <p class="muted small mt">Erinnerungen kommen zu den Uhrzeiten aus deinem Tagesplan und zu Terminen. <strong>Wichtig:</strong> Sie funktionieren nur, solange Becoming Her in einem Browser-Tab geöffnet ist – es gibt bewusst keinen externen Server.</p>
        <div class="form-grid mt">
          <label class="field half"><span class="field-label">Vorlaufzeit</span><select data-change="notify-lead">${[0, 5, 10, 15, 30].map(n => `<option value="${n}" ${Number(S.settings.notifyLead) === n ? 'selected' : ''}>${n ? n + ' Minuten vorher' : 'Pünktlich'}</option>`).join('')}</select></label>
          <label class="field half"><span class="field-label">Optionale Aktivitäten</span><select data-change="notify-optional"><option value="0" ${!S.settings.notifyOptional ? 'selected' : ''}>Nicht erinnern</option><option value="1" ${S.settings.notifyOptional ? 'selected' : ''}>Auch erinnern</option></select></label>
        </div>
        ${on ? `<button class="btn ghost sm mt" data-action="notify-test">${icon('bell')}<span>Test-Benachrichtigung</span></button>` : ''}
      </div>

      <div class="card span2">
        <div class="card-head"><div><p class="eyebrow">Langfristige Ziele</p><h3>Die Frau, die ich werde</h3></div></div>
        <p class="muted small" style="margin-bottom:8px">Diese Sätze erscheinen abwechselnd auf deinem Dashboard als Erinnerung an deine Vision.</p>
        <div class="list">${S.vision.map(v => `<div class="list-item"><span class="ms-ic" style="width:28px;height:28px">${icon('sparkle')}</span><div class="li-body li-title">${esc(v.text)}</div>${editDel('vision', 'text', v.id)}</div>`).join('')}</div>
        ${inlineAdd('Sie … (neuer Satz deiner Vision)', 'data-path="vision"')}
      </div>

      <div class="card">
        <div class="card-head"><div><p class="eyebrow">Sicherung</p><h3>Daten exportieren & importieren</h3></div></div>
        <p class="muted small">Speichere regelmäßig eine Sicherung als JSON-Datei – zum Beispiel, um auf ein anderes Gerät umzuziehen. Aktuelle Größe: ${fmtNum(size / 1024)} KB.</p>
        <div class="btn-row mt">
          <button class="btn primary sm" data-action="data-export">${icon('download')}<span>Export als JSON</span></button>
          <label class="btn soft sm" style="cursor:pointer">${icon('upload')}<span>JSON importieren</span><input type="file" accept="application/json,.json" data-change="data-import" hidden></label>
        </div>
        ${storageOk ? '' : `<div class="info rose mt">${icon('bell')}<span>Der lokale Speicher ist in diesem Browser nicht verfügbar (z. B. privater Modus). Bitte exportiere deine Daten, bevor du den Tab schließt.</span></div>`}
      </div>

      <div class="card">
        <div class="card-head"><div><p class="eyebrow">Neuanfang</p><h3>Alle Daten zurücksetzen</h3></div></div>
        <p class="muted small">Löscht alle Einträge, Fortschritte und Einstellungen auf diesem Gerät und stellt die Beispieldaten wieder her. Das kann nicht rückgängig gemacht werden – exportiere vorher eine Sicherung.</p>
        <button class="btn ghost danger sm mt" data-action="data-reset">${icon('trash')}<span>Alles zurücksetzen …</span></button>
      </div>
    </div>
    <p class="center muted small mt" style="margin-top:36px;font-family:var(--serif);font-size:17px;font-style:italic">BECOMING HER · Become the woman you want to be. One day at a time.</p>`;
  },
  actions: {
    async 'notify-toggle'() {
      if (S.settings.notifications && Notify.permission() === 'granted') { commit(s => { s.settings.notifications = false; }); toast('Erinnerungen ausgeschaltet'); return; }
      if (!Notify.supported()) return toast('Benachrichtigungen werden hier nicht unterstützt.');
      const p = await Notify.request();
      commit(s => { s.settings.notifications = p === 'granted'; });
      toast(p === 'granted' ? 'Erinnerungen aktiviert ✓' : 'Keine Erlaubnis erteilt – Erinnerungen bleiben aus.');
    },
    'notify-test'() { Notify.show('Becoming Her', 'So sehen deine sanften Erinnerungen aus. 🌿'); },
    'data-export'() {
      const blob = new Blob([JSON.stringify({ app: 'becoming-her', exported: new Date().toISOString(), data: S }, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = `becoming-her-${D.key()}.json`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      toast('Sicherung erstellt ✓');
    },
    async 'data-reset'() {
      const ok = await confirmDialog('Alle deine Einträge, Fortschritte, Reflexionen und Einstellungen werden auf diesem Gerät gelöscht. Dieser Schritt kann nicht rückgängig gemacht werden.', { title: 'Wirklich alles zurücksetzen?', ok: 'Weiter', danger: true });
      if (!ok) return;
      openForm({
        title: 'Letzte Sicherheitsabfrage', intro: 'Bitte tippe <strong>ZURÜCKSETZEN</strong> ein, um zu bestätigen.',
        fields: [{ name: 'confirm', label: 'Bestätigung', required: true }], submitLabel: 'Endgültig zurücksetzen',
        onSubmit(v) {
          if (v.confirm.toUpperCase() !== 'ZURÜCKSETZEN') { toast('Die Eingabe stimmt nicht – nichts wurde gelöscht.'); return false; }
          Store.reset(); App.ui.tabs = {}; App.render(); toast('Alles zurückgesetzt. Willkommen zu deinem Neuanfang.');
        }
      });
    }
  },
  submits: {
    'profile-save'(v) {
      if (!v.startDate) return toast('Bitte wähle ein Startdatum.');
      commit(s => { s.profile.name = (v.name || '').trim(); s.profile.startDate = v.startDate; s.health.waterGoal = clamp(Number(v.waterGoal) || 8, 1, 20); });
      toast('Profil gespeichert ✓');
    }
  },
  changes: {
    'notify-lead'(d, el) { commit(s => { s.settings.notifyLead = Number(el.value); }, { render: false }); toast('Gespeichert ✓'); },
    'notify-optional'(d, el) { commit(s => { s.settings.notifyOptional = el.value === '1'; }, { render: false }); toast('Gespeichert ✓'); },
    'data-import'(d, el) {
      const file = el.files?.[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = async () => {
        el.value = '';
        let parsed;
        try { parsed = JSON.parse(reader.result); } catch (e) { return toast('Die Datei ist kein gültiges JSON.'); }
        const data = parsed && parsed.data && parsed.app === 'becoming-her' ? parsed.data : parsed;
        if (!data || typeof data !== 'object' || !Array.isArray(data.habits) || !Array.isArray(data.schedule)) return toast('Diese Datei sieht nicht nach einer Becoming-Her-Sicherung aus.');
        const ok = await confirmDialog(`Die Sicherung „${esc(file.name)}“ ersetzt alle aktuellen Daten auf diesem Gerät.`, { title: 'Daten importieren?', ok: 'Importieren' });
        if (!ok) return;
        Store.replace(data); App.render(); toast('Import erfolgreich ✓');
      };
      reader.onerror = () => toast('Die Datei konnte nicht gelesen werden.');
      reader.readAsText(file);
    }
  }
};
