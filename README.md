# BECOMING HER – Your personal life system

*Become the woman you want to be. One day at a time.*

## Starten
- **Am einfachsten:** `index.html` doppelklicken – läuft direkt im Browser, offline, ohne Installation.
- **Alternativ (lokaler Server):** `python serve.py` → öffnet http://localhost:5173

Auf dem Smartphone: Ordner auf das Handy kopieren bzw. über einen beliebigen statischen Hoster (z. B. GitHub Pages, Netlify – kostenlos) bereitstellen und im Browser „Zum Startbildschirm hinzufügen“.

## Daten
- Alles wird im `localStorage` deines Browsers gespeichert (Schlüssel `becoming-her:data`) – nichts verlässt dein Gerät.
- Daten gelten pro Browser und Adresse: `file://…/index.html` und `http://localhost:5173` haben getrennte Speicher.
- **Einstellungen → Export als JSON** regelmäßig nutzen (Sicherung / Gerätewechsel), **Import** stellt sie wieder her.
- Erinnerungen (Browser-Benachrichtigungen) funktionieren nur, solange die Seite geöffnet ist.

## Struktur
```
index.html            Grundgerüst
css/style.css         Designsystem (Farben, Typografie, Komponenten, Responsiv)
js/data.js            Startdaten, Texte, Gedanken, Herausforderungen
js/core.js            Speicherung, Datumslogik, Fortschritt, UI-Bausteine, Formulare
js/app.js             Routing, Navigation, Ereignisse, Erinnerungen
js/pages/*.js         Dashboard, Tagesplan, Woche, Habits, 7 Bereiche, Entwicklung,
                      Fortschritte, Wochenreflexion, Einstellungen
```

## Erweitern
- Neue Seite: `Pages.meineSeite = { render(){…}, actions:{…} }` in einer neuen Datei, in `index.html` einbinden, in `NAV` (app.js) eintragen.
- Neue Listen mit Hinzufügen/Bearbeiten/Löschen: Formular in `FORMS` definieren und Buttons mit `data-action="crud-add" data-path="…" data-form="…"` verwenden.
- Neue Datenfelder in `createDefaultState()` (data.js) ergänzen – bestehende Daten werden beim Laden automatisch ergänzt.
