/* BECOMING HER – Startdaten, Texte & Konstanten
   Alles hier ist Beispiel-/Startinhalt und kann in der App bearbeitet werden. */

const WD = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
const WDS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];

const QUOTES = [
  'Become the woman you want to be. One day at a time.',
  'Kleine Schritte, jeden Tag, ergeben irgendwann einen ganz neuen Weg.',
  'Du musst nicht alles auf einmal ändern. Nur das Nächste.',
  'Disziplin ist eine Form von Selbstliebe.',
  'Du darfst gleichzeitig ein Meisterwerk und ein Werk in Arbeit sein.',
  'Ruhe ist keine Belohnung. Ruhe ist ein Teil des Weges.',
  'Die Frau, die du werden willst, entsteht in gewöhnlichen Momenten.',
  'Fortschritt ist leise. Vertrau ihm trotzdem.',
  'Du bist nicht zu spät. Du bist genau rechtzeitig für deinen Weg.',
  'Was du heute für dich tust, ist ein Geschenk an dein zukünftiges Ich.',
  'Mut bedeutet nicht, keine Angst zu haben – sondern freundlich mit ihr loszugehen.',
  'Deine eigene Gesellschaft darf ein Ort sein, an dem du gerne bist.',
  'Gewohnheiten sind Versprechen, die du dir selbst gibst.',
  'Ein guter Tag beginnt mit einer kleinen, liebevollen Entscheidung.',
  'Du wächst auch an den Tagen, an denen du nichts davon merkst.',
  'Sei geduldig mit dir. Blumen blühen auch nicht über Nacht.',
  'Konsequenz schlägt Perfektion. Immer.',
  'Gedanken sind Besucher. Du musst ihnen keinen Tee anbieten.',
  'Dein Tempo ist das richtige Tempo.',
  'Heute reicht es, ein bisschen besser für dich zu sorgen als gestern.',
  'Selbstvertrauen wächst durch Erfahrungen, nicht durch Warten.',
  'Du darfst Raum einnehmen.',
  'Struktur gibt dir Freiheit, nicht Grenzen.',
  'Nicht jeder Tag muss produktiv sein. Auch Pausen gehören zu deinem Wachstum.',
  'Du musst nicht auf Motivation warten. Fang mit einer kleinen Sache an.',
  'Stärke entsteht Wiederholung für Wiederholung – im Körper und im Kopf.',
  'Neugier ist der schönste Grund, etwas Neues auszuprobieren.',
  'Du bist die Konstante in deinem Leben. Behandle dich gut.',
  'Atme. Du hast schon so viel geschafft, was du dir nicht zugetraut hast.',
  'Wer du wirst, entscheidest du mit jedem kleinen Ja zu dir selbst.'
];

const DAILY_CHALLENGES = [
  'Trink ein Glas Wasser, bevor du zum Handy greifst.',
  'Geh 10 Minuten nach draußen und schau bewusst in den Himmel.',
  'Schreib drei Dinge auf, für die du heute dankbar bist.',
  'Mach jemandem ein ehrliches Kompliment.',
  'Räum für 10 Minuten eine kleine Ecke auf.',
  'Lies 10 Seiten in deinem aktuellen Buch.',
  'Probier ein neues Gewürz oder eine neue Zutat aus.',
  'Leg das Handy für eine Stunde in einen anderen Raum.',
  'Mach 5 Minuten Dehnübungen.',
  'Schreib dir selbst einen freundlichen Satz auf einen Zettel.',
  'Lerne fünf neue Vokabeln.',
  'Hör ein Lied bewusst und ohne Nebenbei-Beschäftigung.',
  'Spiel 10 Minuten intensiv mit deinen Katzen.',
  'Geh einen Weg, den du noch nie gegangen bist.',
  'Stell jemandem eine Frage, die du sonst nicht stellen würdest.',
  'Gönn dir eine extra lange Pflege-Routine am Abend.',
  'Schreib eine Sache auf, die du an dir magst.',
  'Plane eine kleine Unternehmung nur für dich.',
  'Mach drei tiefe, langsame Atemzüge, bevor du etwas Neues beginnst.',
  'Erledige die Aufgabe, die du am längsten vor dir herschiebst – nur 5 Minuten.',
  'Bereite dir ein Frühstück zu, das du liebevoll anrichtest.',
  'Mach ein Foto von etwas Schönem in deinem Alltag.',
  'Sitz 5 Minuten einfach still und beobachte deine Gedanken.',
  'Schreib einer Person, an die du gerade denkst.',
  'Trag heute etwas, in dem du dich besonders wohlfühlst.'
];

const KIND_MESSAGES = {
  start: 'Du musst nicht auf Motivation warten. Fang mit einer kleinen Sache an.',
  rest: 'Nicht jeder Tag muss produktiv sein. Auch Pausen gehören zu deinem Wachstum.',
  calmEvening: 'Heute war vielleicht ein ruhigerer Tag – und das ist völlig in Ordnung.',
  some: 'Jeder kleine Schritt zählt. Du bist auf dem Weg.',
  half: 'Schöner Fortschritt – Schritt für Schritt.',
  great: 'Du warst heute so gut zu dir. Genieß dieses Gefühl.',
  all: 'Alles erledigt. Sei stolz auf dich – und gönn dir jetzt Ruhe.'
};

const AREAS = [
  { id: 'mindset', num: '01', name: 'Mindset', de: 'Innere Ruhe & Selbstvertrauen', icon: 'sparkle' },
  { id: 'health', num: '02', name: 'Health & Fitness', de: 'Kraft, Bewegung & Erholung', icon: 'heart' },
  { id: 'selfcare', num: '03', name: 'Selfcare', de: 'Pflege & Wohlgefühl', icon: 'flower' },
  { id: 'knowledge', num: '04', name: 'Knowledge', de: 'Lesen, Sprachen & Lernen', icon: 'book' },
  { id: 'hobbies', num: '05', name: 'Hobbies & Creativity', de: 'Kochen, Spielen & Kreativsein', icon: 'palette' },
  { id: 'social', num: '06', name: 'Independence & Social Life', de: 'Mut, Unabhängigkeit & Begegnungen', icon: 'compass' },
  { id: 'home', num: '07', name: 'Lifestyle & Home', de: 'Zuhause, Ordnung & Organisation', icon: 'home' }
];

const HABIT_CATS = [
  { id: 'mindset', name: 'Mindset' },
  { id: 'health', name: 'Health & Fitness' },
  { id: 'selfcare', name: 'Selfcare' },
  { id: 'lifestyle', name: 'Lifestyle' }
];

const CHALLENGE_LEVELS = [
  { level: 1, name: 'Sanfter Start', text: 'Kleine Dinge alleine, ganz in deinem Tempo.' },
  { level: 2, name: 'Kleine Schritte', text: 'Kurze Begegnungen mit anderen Menschen.' },
  { level: 3, name: 'Raus in die Welt', text: 'Neue Orte und Erlebnisse – alleine.' },
  { level: 4, name: 'Ins Gespräch kommen', text: 'Gespräche beginnen und halten.' },
  { level: 5, name: 'Mutig wachsen', text: 'Neue Kontakte und echte Selbstständigkeit.' }
];

const CONVERSATION_STARTERS = [
  'Entschuldigung, kannst du mir etwas empfehlen? Ich bin zum ersten Mal hier.',
  'Das sieht toll aus – woher hast du das?',
  'Weißt du, ob es hier in der Nähe ein gutes Café gibt?',
  'Was liest du gerade? Das Cover sieht spannend aus.',
  'Wie bist du zu diesem Hobby gekommen?',
  'Was hat dir an der Veranstaltung bisher am besten gefallen?',
  'Hast du einen Tipp, worauf ich als Anfängerin achten sollte?',
  'Ich mag deine Jacke/Tasche – die Farbe ist wunderschön.'
];

const SOCIAL_TIPS = [
  'Neugier statt Perfektion: Eine ehrliche Frage ist der beste Gesprächsbeginn.',
  'Pausen im Gespräch sind normal – du musst sie nicht sofort füllen.',
  'Die meisten Menschen freuen sich, wenn man sie freundlich anspricht.',
  'Nervosität fühlt sich von innen viel größer an, als sie von außen aussieht.',
  'Ein Gespräch darf kurz sein. Auch 30 Sekunden zählen.',
  'Nach jeder Herausforderung: Würdige, dass du es versucht hast – egal wie es lief.'
];

const MEAL_IDEAS = [
  'Overnight Oats mit Joghurt, Beeren & Nüssen',
  'Rührei mit Spinat auf Vollkornbrot',
  'Linsen-Curry mit Reis',
  'Ofengemüse mit Feta & Kichererbsen',
  'Hähnchen- oder Tofu-Bowl mit Gemüse',
  'Skyr mit Banane & Erdnussmus als Snack',
  'Vollkornpasta mit Tomaten-Bohnen-Soße',
  'Wraps mit Hummus, Gemüse & Hähnchen/Falafel'
];

const MILESTONES = [
  { id: 'habit1', icon: 'check', text: 'Erste Gewohnheit abgehakt', test: m => m.habitChecks >= 1 },
  { id: 'habit50', icon: 'check', text: '50 Gewohnheiten erledigt', test: m => m.habitChecks >= 50 },
  { id: 'habit200', icon: 'check', text: '200 Gewohnheiten erledigt', test: m => m.habitChecks >= 200 },
  { id: 'work1', icon: 'heart', text: 'Erstes Training eingetragen', test: m => m.strength >= 1 },
  { id: 'work12', icon: 'heart', text: '12 Krafttrainings – ein guter Monat Kraft', test: m => m.strength >= 12 },
  { id: 'work36', icon: 'heart', text: '36 Krafttrainings', test: m => m.strength >= 36 },
  { id: 'book1', icon: 'book', text: 'Erstes Buch beendet', test: m => m.books >= 1 },
  { id: 'book5', icon: 'book', text: 'Fünf Bücher gelesen', test: m => m.books >= 5 },
  { id: 'lang60', icon: 'book', text: 'Eine Stunde Sprachen gelernt', test: m => m.langMin >= 60 },
  { id: 'lang600', icon: 'book', text: '10 Stunden Sprachen gelernt', test: m => m.langMin >= 600 },
  { id: 'ch1', icon: 'compass', text: 'Erste soziale Herausforderung gemeistert', test: m => m.challenges >= 1 },
  { id: 'ch5', icon: 'compass', text: 'Fünf mutige Momente', test: m => m.challenges >= 5 },
  { id: 'ch15', icon: 'compass', text: '15 mutige Momente', test: m => m.challenges >= 15 },
  { id: 'refl1', icon: 'sparkle', text: 'Erste Wochenreflexion', test: m => m.reflections >= 1 },
  { id: 'refl4', icon: 'sparkle', text: 'Vier Wochen reflektiert', test: m => m.reflections >= 4 },
  { id: 'jour10', icon: 'sparkle', text: '10 Journal-Einträge', test: m => m.journal >= 10 },
  { id: 'rec1', icon: 'palette', text: 'Erstes neues Rezept ausprobiert', test: m => m.recipes >= 1 },
  { id: 'rec5', icon: 'palette', text: 'Fünf neue Rezepte ausprobiert', test: m => m.recipes >= 5 },
  { id: 'idea3', icon: 'palette', text: 'Drei neue Hobbys ausprobiert', test: m => m.ideas >= 3 }
];

function createDefaultState() {
  const today = D.key();
  const id = () => uid();
  const S0 = (time, title, priority = 'normal', days = ALL_DAYS, note = '') =>
    ({ id: id(), time, title, priority, days: [...days], note });

  const habit = (name, category, freq = { type: 'daily' }) =>
    ({ id: id(), name, category, freq, archived: false, created: today });

  const items = arr => arr.map(text => ({ id: id(), text }));

  return {
    version: 1,
    createdAt: today,
    profile: { name: '', startDate: today },
    settings: { notifications: false, notifyLead: 5, notifyOptional: false },
    vision: [
      'Sie hat einen strukturierten Alltag.',
      'Sie kann gut mit Menschen interagieren.',
      'Sie genießt ihre eigene Gesellschaft.',
      'Sie hat verschiedene Hobbys und Interessen.',
      'Sie kümmert sich um ihren Körper und ihre Gesundheit.',
      'Sie trainiert regelmäßig und baut Muskeln auf.',
      'Sie nimmt sich Zeit für ihre persönliche Weiterentwicklung.',
      'Sie liest Bücher und lernt Sprachen.',
      'Sie kocht gerne und probiert neue Rezepte aus.',
      'Sie verbringt Zeit in der Natur.',
      'Sie geht regelmäßig alleine nach draußen und unternimmt Dinge.',
      'Sie erledigt Aufgaben, ohne alles aufzuschieben.',
      'Sie verliert sich weniger in ihren Gedanken.',
      'Sie geht gelassen mit Unsicherheiten und Stress um.',
      'Sie hat ein gepflegtes Erscheinungsbild.',
      'Sie hat Freude an ihrem Leben und ihren Hobbys.'
    ].map(text => ({ id: id(), text })),

    schedule: [
      S0('07:00', 'Aufstehen und Katzen versorgen', 'important'),
      S0('07:15', 'Duschen, Skincare und fertig machen'),
      S0('07:45', 'Frühstück', 'important'),
      S0('08:15', 'Journaling und Tagesplanung'),
      S0('09:00', 'Lesen oder Sprachen lernen'),
      S0('10:00', 'Krafttraining', 'important', [0, 2, 4], 'Trainingsplan im Bereich Health & Fitness'),
      S0('10:00', 'Spaziergang oder Natur', 'normal', [1, 3]),
      S0('10:00', 'Unternehmung oder Ausflug', 'optional', [5, 6]),
      S0('12:00', 'Mittagessen', 'important'),
      S0('13:00', 'Haushalt, Kochen und Erledigungen'),
      S0('14:00', 'Persönliche Projekte und Lernen', 'optional'),
      S0('15:30', 'Freizeit, Gaming oder Unternehmungen', 'optional'),
      S0('17:00', 'Abendessen', 'important'),
      S0('18:00', 'Freundin, Katzen und Freizeit', 'optional'),
      S0('19:00', 'Wochenreflexion & nächste Woche vorbereiten', 'normal', [6]),
      S0('20:30', 'Lesen oder entspannte Hobbys', 'optional'),
      S0('20:30', 'Nägel machen', 'optional', [4]),
      S0('21:30', 'Abendroutine und Skincare'),
      S0('22:30', 'Schlafenszeit', 'important')
    ],
    days: {},
    history: {},
    events: [],
    notes: [],
    dailyChallenge: {},

    week: {
      focus: {
        0: 'Krafttraining · Persönliche Weiterentwicklung',
        1: 'Spaziergang · Sprachen lernen · Alleine etwas unternehmen',
        2: 'Krafttraining · Kochen & neue Rezepte',
        3: 'Natur · Lesen · Neue Erfahrungen',
        4: 'Krafttraining · Selfcare & Nägel machen',
        5: 'Freizeit · Ausflüge · Hobbys & Soziales',
        6: 'Erholung · Wochenreflexion · Vorbereitung'
      },
      activities: [
        [0, 'Krafttraining (Ganzkörper A)'], [0, 'Etwas Neues lernen / Weiterbildung'],
        [1, 'Spaziergang'], [1, 'Sprachen lernen (30 Min.)'], [1, 'Alleine etwas unternehmen'],
        [2, 'Krafttraining (Ganzkörper B)'], [2, 'Ein neues Rezept kochen'],
        [3, 'Zeit in der Natur'], [3, 'Lesen'], [3, 'Eine neue Erfahrung machen'],
        [4, 'Krafttraining (Ganzkörper C)'], [4, 'Selfcare-Abend'], [4, 'Nägel machen'],
        [5, 'Ausflug oder Unternehmung'], [5, 'Zeit für ein Hobby'], [5, 'Jemanden treffen'],
        [6, 'Ausruhen & nichts müssen'], [6, 'Wochenreflexion'], [6, 'Kommende Woche planen']
      ].map(([wd, title]) => ({ id: id(), wd, title }))
    },

    habits: [
      habit('Journaling', 'mindset'),
      habit('Lesen', 'mindset'),
      habit('Sprachen lernen', 'mindset'),
      habit('Persönliche Weiterentwicklung', 'mindset', { type: 'weekly', times: 3 }),
      habit('Zeit ohne Handy', 'mindset'),
      habit('Krafttraining', 'health', { type: 'days', days: [0, 2, 4] }),
      habit('Spaziergang', 'health', { type: 'weekly', times: 3 }),
      habit('Ausreichend essen', 'health'),
      habit('Ausreichend trinken', 'health'),
      habit('Regelmäßige Schlafenszeit', 'health'),
      habit('Morgendliche Skincare', 'selfcare'),
      habit('Abendliche Skincare', 'selfcare'),
      habit('Duschen', 'selfcare'),
      habit('Zähneputzen', 'selfcare'),
      habit('Nagelpflege', 'selfcare', { type: 'days', days: [4] }),
      habit('Bett machen', 'lifestyle'),
      habit('Katzen versorgen', 'lifestyle'),
      habit('Haushalt erledigen', 'lifestyle'),
      habit('Zeit draußen verbringen', 'lifestyle'),
      habit('Eine neue Erfahrung machen', 'lifestyle', { type: 'weekly', times: 1 })
    ],
    habitLog: {},
    checks: {},
    weekChecks: {},

    mindset: {
      journal: [],
      affirmations: [
        'Ich darf in meinem eigenen Tempo wachsen.',
        'Ich bin es wert, dass ich gut für mich sorge.',
        'Ich kann schwierige Gefühle aushalten – sie gehen vorbei.',
        'Ich vertraue mir, auch wenn ich unsicher bin.',
        'Meine Gesellschaft ist wertvoll – auch für mich selbst.',
        'Ich muss nicht perfekt sein, um genug zu sein.',
        'Jeder kleine Schritt bringt mich näher zu mir.',
        'Ich darf Raum einnehmen und gesehen werden.'
      ].map(text => ({ id: id(), text })),
      reframes: [
        ['Ich schaffe das nie.', 'Ich lerne das Schritt für Schritt.'],
        ['Alle schauen mich an.', 'Die meisten Menschen sind mit sich selbst beschäftigt.'],
        ['Ich habe heute nichts geschafft.', 'Ich habe heute auf mich gehört – auch das zählt.'],
        ['Ich bin komisch, wenn ich alleine unterwegs bin.', 'Alleine unterwegs zu sein ist mutig und frei.']
      ].map(([from, to]) => ({ id: id(), from, to })),
      strengths: items(['Ich bin liebevoll zu meinen Katzen.', 'Ich bin neugierig und möchte wachsen.', 'Ich gebe nicht auf, auch wenn es langsam geht.']),
      goals: [
        { id: id(), text: 'Drei Mal pro Woche Krafttraining machen', area: 'Health & Fitness', done: false },
        { id: id(), text: 'Alleine in ein Café gehen und es genießen', area: 'Independence', done: false },
        { id: id(), text: '12 Bücher in einem Jahr lesen', area: 'Knowledge', done: false },
        { id: id(), text: 'Eine feste Morgen- und Abendroutine haben', area: 'Selfcare', done: false }
      ],
      worries: []
    },

    health: {
      workouts: [],
      templates: [
        { id: id(), title: 'Ganzkörper A', exText: 'Kniebeugen 3x12\nHip Thrusts 3x12\nLiegestütze (Knie) 3x8\nRudern mit Kurzhanteln 3x10\nPlank 3x30s' },
        { id: id(), title: 'Ganzkörper B', exText: 'Ausfallschritte 3x10\nRumänisches Kreuzheben 3x10\nSchulterdrücken 3x10\nGlute Bridges 3x15\nDead Bug 3x10' },
        { id: id(), title: 'Ganzkörper C', exText: 'Goblet Squats 3x10\nStep-ups 3x10\nFloor Press 3x10\nBand-Rudern 3x12\nSeitstütz 3x20s' }
      ],
      sleep: [],
      meals: items(['Frühstück', 'Mittagessen', 'Abendessen', 'Ein Snack', 'Obst oder Gemüse', 'Eine Proteinquelle']),
      water: {},
      waterGoal: 8
    },

    selfcare: {
      morning: items(['Gesicht reinigen', 'Feuchtigkeitspflege', 'Sonnenschutz (LSF)', 'Zähne putzen', 'Haare machen', 'Outfit anziehen']),
      evening: items(['Make-up entfernen', 'Gesicht reinigen', 'Serum & Nachtpflege', 'Zähne putzen', 'Kleidung für morgen bereitlegen', 'Handy weglegen']),
      weekly: [
        [0, 'Haare waschen & pflegen'], [1, 'Körperpeeling'], [2, 'Gesichtsmaske'],
        [3, 'Haare waschen & Haarkur'], [4, 'Nägel machen'], [5, 'Langes Bad oder Wellness-Dusche'],
        [6, 'Augenbrauen & Hände pflegen']
      ].map(([wd, text]) => ({ id: id(), wd, text })),
      outfits: {},
      products: [
        { id: id(), name: 'Sanftes Reinigungsgel', type: 'Gesicht', note: 'Morgens & abends' },
        { id: id(), name: 'Feuchtigkeitscreme', type: 'Gesicht', note: '' },
        { id: id(), name: 'Sonnencreme LSF 50', type: 'Gesicht', note: 'Auch im Winter' },
        { id: id(), name: 'Haarkur', type: 'Haare', note: '1–2× pro Woche' },
        { id: id(), name: 'Nagelöl', type: 'Nägel', note: 'Abends einmassieren' },
        { id: id(), name: 'Bodylotion', type: 'Körper', note: 'Nach dem Duschen' }
      ]
    },

    knowledge: {
      books: [
        { id: id(), title: 'Atomic Habits', author: 'James Clear', pages: 320, currentPage: 0, status: 'reading', rating: 0, notes: '', started: today, finished: null },
        { id: id(), title: 'Ikigai', author: 'Héctor García & Francesc Miralles', pages: 208, currentPage: 0, status: 'want', rating: 0, notes: '', started: null, finished: null },
        { id: id(), title: 'Der kleine Prinz', author: 'Antoine de Saint-Exupéry', pages: 112, currentPage: 0, status: 'want', rating: 0, notes: '', started: null, finished: null }
      ],
      languages: [
        { id: id(), name: 'Spanisch', level: 'A1', goal: 'Einfache Alltagsgespräche führen (A2)', weeklyGoal: 90 }
      ],
      langLog: [],
      goals: [
        { id: id(), text: 'Jeden Tag 15 Minuten Sprache lernen', done: false },
        { id: id(), text: 'Einen Online-Kurs zu einem Thema abschließen, das mich interessiert', done: false }
      ],
      notes: []
    },

    hobbies: {
      recipes: [
        ['Shakshuka', 'Frühstück'], ['Ofengemüse mit Feta & Kichererbsen', 'Hauptgericht'],
        ['Linsen-Curry mit Kokosmilch', 'Hauptgericht'], ['Protein-Pancakes', 'Frühstück'],
        ['Selbstgemachte Ramen', 'Hauptgericht'], ['Bananenbrot', 'Backen']
      ].map(([name, category]) => ({ id: id(), name, category, status: 'idea', rating: 0, link: '', notes: '', tried: null })),
      games: [
        { id: id(), title: 'Stardew Valley', platform: 'PC / Switch', status: 'playing', note: '' }
      ],
      projects: [
        { id: id(), title: 'Fotoalbum von diesem Jahr gestalten', status: 'active', progress: 10, note: '' }
      ],
      ideas: [
        ['Töpferkurs besuchen', 'Kreativ'], ['Yoga im Park', 'Bewegung'], ['Aquarell malen', 'Kreativ'],
        ['Sauerteigbrot backen', 'Kochen'], ['Kräuter auf dem Balkon ziehen', 'Natur'], ['Bouldern ausprobieren', 'Bewegung'],
        ['Ein Museum alleine besuchen', 'Kultur'], ['Tanzkurs (z. B. Salsa)', 'Bewegung'], ['Fotospaziergang durch die Stadt', 'Kreativ'],
        ['Häkeln oder Stricken lernen', 'Kreativ'], ['Picknick alleine im Grünen', 'Natur'], ['1000-Teile-Puzzle', 'Entspannung'],
        ['Kalligrafie / Handlettering', 'Kreativ'], ['Neue Wanderroute erkunden', 'Natur'], ['Kochkurs einer neuen Landesküche', 'Kochen']
      ].map(([text, category]) => ({ id: id(), text, category, done: false, doneDate: null }))
    },

    social: {
      challenges: [
        [1, 'Alleine einen Spaziergang an einem schönen Ort machen'],
        [1, 'Alleine einkaufen gehen und in Ruhe stöbern'],
        [1, 'Im Café etwas zum Mitnehmen bestellen'],
        [1, 'Alleine in die Bibliothek oder Buchhandlung gehen'],
        [1, 'Einer Person bewusst zulächeln und „Hallo“ sagen'],
        [1, 'Eine Stunde alleine draußen auf einer Bank sitzen'],
        [2, 'Jemandem eine Frage stellen (z. B. nach dem Weg)'],
        [2, 'Im Laden nach einer Empfehlung fragen'],
        [2, 'An der Kasse einen kurzen Smalltalk führen'],
        [2, 'Jemandem ein ehrliches Kompliment machen'],
        [2, 'Telefonisch einen Termin vereinbaren'],
        [2, 'Im Restaurant einen Sonderwunsch äußern'],
        [3, 'Alleine einen Kaffee trinken gehen – und bleiben'],
        [3, 'Einen neuen Ort in deiner Stadt besuchen'],
        [3, 'Alleine ins Kino oder in eine Ausstellung gehen'],
        [3, 'Alleine essen gehen'],
        [3, 'Einen Tagesausflug alleine machen'],
        [3, 'Eine neue Aktivität ausprobieren (Kurs, Workshop)'],
        [4, 'Ein Gespräch mit einer unbekannten Person beginnen'],
        [4, 'In einer Gruppe deine Meinung sagen'],
        [4, 'Ein Gespräch länger als fünf Minuten führen'],
        [4, 'Jemanden fragen, was er/sie gerade liest oder macht'],
        [4, 'Bei einem Kurs oder Event jemanden ansprechen'],
        [5, 'Einen Verein, Kurs oder eine Gruppe regelmäßig besuchen'],
        [5, 'Nummern oder Kontakte mit einer neuen Person austauschen'],
        [5, 'Eine neue Bekanntschaft auf einen Kaffee einladen'],
        [5, 'Einen Wochenendtrip alleine planen und machen'],
        [5, 'Eine Entscheidung treffen, ohne andere um Rat zu fragen']
      ].map(([level, text]) => ({ id: id(), level, text, done: false, doneDate: null, note: '', feeling: '' }))
    },

    home: {
      household: [
        [0, 'Wäsche waschen'], [1, 'Staubsaugen'], [2, 'Bad putzen'], [3, 'Küche gründlich reinigen'],
        [4, 'Bettwäsche wechseln (alle 2 Wochen)'], [5, 'Wocheneinkauf'], [6, 'Wohnung aufräumen & Woche vorbereiten'],
        [6, 'Pflanzen gießen']
      ].map(([wd, text]) => ({ id: id(), wd, text })),
      catCare: items(['Futter am Morgen', 'Futter am Abend', 'Frisches Wasser', 'Katzenklo reinigen', 'Spielen & Kuscheln']),
      catNotes: items(['Katzenfutter-Vorrat im Blick behalten', 'Nächsten Tierarzttermin eintragen']),
      reset: items(['Geschirr abwaschen / Spülmaschine', 'Oberflächen freiräumen', '10 Minuten aufräumen', 'Müll rausbringen']),
      shopping: [
        { id: id(), name: 'Wocheneinkauf', items: ['Haferflocken', 'Eier', 'Griechischer Joghurt', 'Spinat', 'Bananen', 'Katzenfutter'].map(text => ({ id: id(), text, done: false })) },
        { id: id(), name: 'Drogerie', items: ['Sonnencreme', 'Wattepads'].map(text => ({ id: id(), text, done: false })) }
      ],
      projects: [
        { id: id(), title: 'Kleiderschrank ausmisten', note: 'Nur behalten, was ich gerne trage.', steps: ['Alles rausnehmen', 'Sortieren: behalten / spenden / weg', 'Nach Kategorien einräumen', 'Spendensack wegbringen'].map(text => ({ id: id(), text, done: false })) }
      ]
    },

    development: {
      current: 1,
      phases: [
        { num: 1, title: 'Fundament', weeksLabel: 'Woche 1 und 2', weeks: 2, items: ['Feste Aufstehzeit', 'Feste Schlafenszeit', 'Morgenroutine', 'Abendroutine', 'Katzenversorgung und Haushalt', 'Tagesplanung', 'Regelmäßige Mahlzeiten'] },
        { num: 2, title: 'Körper und Geist', weeksLabel: 'Woche 3 und 4', weeks: 2, items: ['Krafttraining etablieren', 'Regelmäßig lesen', 'Sprachen lernen', 'Journaling', 'Skincare'] },
        { num: 3, title: 'Selbstständigkeit', weeksLabel: 'Woche 5 bis 8', weeks: 4, items: ['Alleine Unternehmungen machen', 'Regelmäßig nach draußen gehen', 'Neue Rezepte ausprobieren', 'Soziale Herausforderungen angehen'] },
        { num: 4, title: 'Weiterentwicklung', weeksLabel: 'Ab Woche 9', weeks: 0, items: ['Neue Hobbys entdecken', 'Eigene Projekte verfolgen', 'Selbstbewusster kommunizieren', 'Eigene Entscheidungen treffen', 'Gewohnheiten langfristig festigen'] }
      ].map(p => ({ id: id(), ...p, extra: 0, note: '', items: items(p.items).map(i => ({ ...i, done: false })) }))
    },

    reflections: [],
    achievements: []
  };
}
