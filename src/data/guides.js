// Settling-in checklist. Each step links to guides, specialists and places on the map.
export const goals = [
  {
    id: 'documents', title: 'Documents & residence permit', emoji: '🛂', color: '#6C47FF',
    steps: [
      { id: 'd1', title: 'Register your address (white card)', hint: 'Within 24h of arrival — landlord or you at the police station', guides: ['g1'], specialists: ['s10'], places: ['o1'] },
      { id: 'd2', title: 'Get a medical certificate', hint: 'Needed for some residence grounds', guides: [], specialists: ['s7'], places: [] },
      { id: 'd3', title: 'Translate & apostille your documents', hint: 'Diplomas, birth/marriage certificates', guides: ['g6'], specialists: ['s3'], places: [] },
      { id: 'd4', title: 'Apply for temporary residence', hint: 'Online via the eUprava portal or at Savska 35', guides: ['g2'], specialists: ['s2'], places: ['o1'] },
      { id: 'd5', title: 'Collect your residence card', hint: 'Usually 2–4 weeks after approval', guides: ['g2'], specialists: [], places: ['o1'] },
    ],
  },
  {
    id: 'housing', title: 'Housing', emoji: '🏠', color: '#F59E0B',
    steps: [
      { id: 'ho1', title: 'Choose a neighborhood', hint: 'Vračar, Dorćol, Novi Beograd, Zemun…', guides: ['g3'], specialists: [], places: [] },
      { id: 'ho2', title: 'Find a long-term rental', hint: 'Avoid paying before viewing', guides: ['g3'], specialists: ['s10'], places: [] },
      { id: 'ho3', title: 'Sign a contract (and check it)', hint: 'Ask for an English version', guides: ['g3'], specialists: ['s2', 's10'], places: [] },
      { id: 'ho4', title: 'Set up utilities & internet', hint: 'Infostan, EPS, internet provider', guides: [], specialists: [], places: ['o5'] },
    ],
  },
  {
    id: 'banking', title: 'Banking', emoji: '🏦', color: '#14B8A6',
    steps: [
      { id: 'ba1', title: 'Open a bank account', hint: 'Passport + white card', guides: ['g4'], specialists: [], places: ['o2'] },
      { id: 'ba2', title: 'Get a debit card & mobile banking', hint: 'Ask for the English app', guides: ['g4'], specialists: [], places: ['o2'] },
      { id: 'ba3', title: 'Register for tax ID (if self-employed)', hint: 'PIB for preduzetnik', guides: ['g4'], specialists: ['s6'], places: ['o4'] },
    ],
  },
  {
    id: 'sim', title: 'SIM & internet', emoji: '📶', color: '#3B82F6',
    steps: [
      { id: 'si1', title: 'Buy a prepaid SIM', hint: 'Just your passport', guides: [], specialists: [], places: ['o5'] },
      { id: 'si2', title: 'Set up home internet', hint: 'Contract needs residence', guides: [], specialists: [], places: ['o5'] },
    ],
  },
  {
    id: 'health', title: 'Healthcare', emoji: '🩺', color: '#EF4444',
    steps: [
      { id: 'he1', title: 'Find an English-speaking GP', hint: 'Private clinics are fast and affordable', guides: ['g5'], specialists: ['s7'], places: [] },
      { id: 'he2', title: 'Find a dentist', hint: '', guides: ['g5'], specialists: [], places: ['b4'] },
      { id: 'he3', title: 'Register for state health insurance', hint: 'After employment or residence', guides: ['g5'], specialists: [], places: ['o6'] },
    ],
  },
  {
    id: 'kids', title: 'Kids & schools', emoji: '🎒', color: '#EC4899',
    steps: [
      { id: 'k1', title: 'Find a pediatrician', hint: '', guides: ['g5'], specialists: ['s1'], places: [] },
      { id: 'k2', title: 'Choose a kindergarten or school', hint: 'Public, private or international', guides: ['g6'], specialists: [], places: ['b14'] },
      { id: 'k3', title: 'Translate school records', hint: 'Sworn translation + apostille', guides: ['g6'], specialists: ['s3'], places: [] },
    ],
  },
  {
    id: 'transport', title: 'Transport', emoji: '🚋', color: '#22C55E',
    steps: [
      { id: 't1', title: 'Get a BusPlus card or use the app', hint: 'Public transport is free in Belgrade since 2025', guides: ['g7'], specialists: [], places: [] },
      { id: 't2', title: 'Install a taxi app', hint: 'CarGo, Yandex Go, Pink Taxi', guides: ['g7'], specialists: [], places: [] },
      { id: 't3', title: 'Exchange your driving licence', hint: 'Within 6 months of residence', guides: ['g7'], specialists: ['s2'], places: [] },
    ],
  },
]

// Default progress depending on how long the person has lived here
export const defaultDoneFor = (role) => {
  if (role === 'settled' || role === 'business' || role === 'specialist')
    return ['d1', 'd2', 'd3', 'd4', 'd5', 'ho1', 'ho2', 'ho3', 'ho4', 'ba1', 'ba2', 'si1', 'si2', 'he1', 't1', 't2']
  return ['d1', 'ho1', 'si1', 't1', 'ba1', 'he1', 't2', 'd3']
}

export const GUIDE_TOPICS = ['Documents', 'Housing', 'Banking', 'Healthcare', 'Kids & schools', 'Transport', 'Local rules', 'Everyday life']

export const guides = [
  {
    id: 'g1', title: 'White card (bela karta): the first thing to do in Serbia', topic: 'Documents', authorId: 'u6', helpful: 1284, readMin: 4, cover: 'officeHall', time: '2w',
    body: [
      'Every foreigner must register their address with the police within 24 hours of arriving. The paper you get is called the “white card” (bela karta) — and you will need it for almost everything: a bank account, a SIM contract, residence permit.',
      '**Who registers you?** Officially your landlord or hotel. Airbnb hosts sometimes forget — ask them politely on day one.',
      '**If your landlord refuses:** go to the local police station of your municipality with your passport and rental contract. It takes 10 minutes and is free.',
      '**Every time you leave Serbia and come back** you need a new registration. Yes, really. Keep copies.',
    ],
    comments: [{ userId: 'u24', text: 'This saved me on day 2, thank you Jonas!', time: '3d' }, { userId: 'u9', text: 'Добавлю: в Нови-Белграде отделение на Булевар Михајла Пупина работает до 20:00.', time: '1w' }],
  },
  {
    id: 'g2', title: 'Temporary residence in 2026: step by step', topic: 'Documents', authorId: 'u18', helpful: 2310, readMin: 8, cover: 'justice', time: '1mo',
    body: [
      'Since 2024 Serbia issues a single permit that combines residence and work. You apply online through the eUprava portal or in person at Savska 35.',
      '**Grounds:** employment, entrepreneurship (preduzetnik), family reunification, studies, owning real estate, or “other justified reasons”.',
      '**Documents:** passport, white card, proof of accommodation, proof of income or employment contract, health insurance, a photo and the fee receipt.',
      '**Timeline:** if your file is complete, expect a decision in 15–30 days. You can stay legally while the application is pending.',
      'Tip: make 2 copies of everything and bring the originals.',
    ],
    comments: [{ userId: 'u12', text: 'Clearest explanation I’ve found anywhere.', time: '2w' }],
  },
  {
    id: 'g3', title: 'Renting in Belgrade without getting scammed', topic: 'Housing', authorId: 'u20', helpful: 876, readMin: 6, cover: 'apt1', time: '3w',
    body: [
      'Prices in late 2026: €450–550 for a studio in Vračar, €600–750 for a 1-bedroom in Dorćol or Savamala, €800+ for a family flat in Novi Beograd.',
      '**Never pay before viewing.** Fake listings with “owner abroad” are the #1 scam.',
      '**Agent fees** are usually 50% of one month’s rent. Many good flats are only listed through agents.',
      '**Ask for**: a written contract (ideally bilingual), white-card registration, and whether bills (Infostan, electricity, heating) are included.',
    ],
    comments: [],
  },
  {
    id: 'g4', title: 'Opening a bank account as a foreigner', topic: 'Banking', authorId: 'u5', helpful: 642, readMin: 3, cover: 'meeting', time: '1mo',
    body: [
      'You can open a non-resident account with just a passport and your white card at most banks. Some branches have English- and Russian-speaking staff.',
      'Once you get residence, switch to a resident account to get better card limits and a local IBAN for salary.',
      'If you’re self-employed, you’ll also need a business account linked to your PIB (tax ID).',
    ],
    comments: [{ userId: 'u14', text: 'Took me 40 minutes at Sava Banka on Terazije.', time: '2w' }],
  },
  {
    id: 'g5', title: 'Healthcare 101: private vs. public, doctors who speak your language', topic: 'Healthcare', authorId: 'u22', helpful: 954, readMin: 5, cover: 'doctor', time: '2w',
    body: [
      'Public healthcare (Dom zdravlja) is available once you’re insured through employment. Most expats also use private clinics — they are fast and affordable (€30–50 per visit).',
      'Pharmacies (apoteka) are everywhere and pharmacists often speak English. Many medicines are sold without prescription.',
      'Emergency number: 194 (ambulance), 112 (general).',
    ],
    comments: [],
  },
  {
    id: 'g6', title: 'Kindergartens & schools: a parent’s map of Belgrade', topic: 'Kids & schools', authorId: 'u11', helpful: 512, readMin: 7, cover: 'books', time: '1w',
    body: [
      'Public kindergartens are cheap (~€30/month) but have waiting lists; private bilingual kindergartens cost €300–500.',
      'International schools are mostly in Dedinje, Senjak and Novi Beograd. Public schools accept foreign kids — the first year includes extra Serbian classes.',
      'You will need translated and apostilled school records.',
    ],
    comments: [{ userId: 'u15', text: 'Дуже корисно, дякую!', time: '5d' }],
  },
  {
    id: 'g7', title: 'Getting around: buses, trams, taxis and bikes', topic: 'Transport', authorId: 'u12', helpful: 433, readMin: 4, cover: 'cycling', time: '5d',
    body: [
      'City public transport in Belgrade is free since January 2025 — just hop on.',
      'Taxis: always use an app or call a dispatch. Never take a taxi from the airport curb without a voucher.',
      'Bikes: the Sava and Danube riverside paths are fantastic. Ada Ciganlija is 20 min from the center.',
    ],
    comments: [],
  },
  {
    id: 'g8', title: 'Unwritten rules of Serbian life', topic: 'Local rules', authorId: 'u10', helpful: 1902, readMin: 5, cover: 'streetCafe', time: '3d',
    body: [
      '**Coffee is a social event**, not a drink. “Idemo na kafu?” means “let’s hang out for two hours”.',
      '**Slava** is a family saint’s day. If you’re invited, bring wine or sweets — and don’t make other plans.',
      '**Quiet hours** in apartment buildings are usually 22:00–06:00 and 14:00–17:00 on weekdays.',
      'Smoking indoors is common in bars. Look for “nepušački” (non-smoking) signs.',
      'And always remember: polako 🐢',
    ],
    comments: [{ userId: 'u7', text: 'The slava thing — learned it the hard way 😅', time: '2d' }],
  },
  {
    id: 'g9', title: 'Recycling, trash and public holidays', topic: 'Everyday life', authorId: 'u19', helpful: 288, readMin: 3, cover: 'tree', time: '2w',
    body: [
      'Yellow bins for plastic and cans, blue for paper. Glass goes to green bell-shaped containers.',
      'Big public holidays: New Year (Jan 1–2), Orthodox Christmas (Jan 7), Statehood Day (Feb 15–16), Easter (Orthodox), Labour Day (May 1–2). Shops may close.',
    ],
    comments: [],
  },
]
export const guideById = Object.fromEntries(guides.map((g) => [g.id, g]))

export const faq = [
  { q: 'Do I need a visa to come to Serbia?', a: 'Citizens of many countries (incl. EU, US, UK, Russia, Turkey, China) can stay up to 90 days without a visa. Check the Ministry of Foreign Affairs list for your passport.' },
  { q: 'How long can I stay without residence?', a: 'Usually 90 days within any 180-day period. To stay longer, apply for temporary residence before your visa-free period ends.' },
  { q: 'Can I work as a freelancer?', a: 'Yes — most freelancers register as an entrepreneur (preduzetnik) with flat-rate “paušal” tax. This can also be a ground for residence.' },
  { q: 'Is Belgrade safe?', a: 'Belgrade is generally very safe, including at night. Watch out for pickpockets in crowded trams and use taxi apps.' },
  { q: 'Do people speak English?', a: 'Most young people do, and many speak Russian too. Learning a few Serbian phrases goes a long way!' },
  { q: 'Which currency is used?', a: 'The Serbian dinar (RSD). Euros are widely used for rent and big purchases, but you pay in dinars in shops.' },
]
