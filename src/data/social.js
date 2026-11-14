export const communities = [
  {
    id: 'c1', name: 'Russians in Belgrade', nativeName: 'Русские в Белграде', emoji: '🪆', avatar: 'friendsGroup', cover: 'city', members: 12480, languages: ['ru'], country: 'ru',
    tags: ['culture', 'family', 'it'], lat: 44.8025, lng: 20.4720, admins: ['u1', 'u19'],
    description: 'Всё о жизни в Белграде: документы, аренда, врачи, дети, встречи. Помогаем друг другу с 2022 года. Правила: без политики и спама.',
    memberSample: ['u1', 'u9', 'u11', 'u19', 'u21', 'u14'],
  },
  {
    id: 'c2', name: 'IT in Serbia', emoji: '💻', avatar: 'laptopCode', cover: 'teamwork', members: 8130, languages: ['en', 'ru', 'sr'], country: null,
    tags: ['it', 'business', 'nomad'], lat: 44.8236, lng: 20.4648, admins: ['u5', 'u14'],
    description: 'Jobs, salaries, taxes for freelancers, meetups and tech news for everyone building software in Serbia.',
    memberSample: ['u5', 'u14', 'u9', 'u21', 'u12', 'u7'],
  },
  {
    id: 'c3', name: 'Parents in Belgrade', emoji: '👶', avatar: 'books', cover: 'friendsSunset', members: 3240, languages: ['en', 'ru', 'uk'], country: null,
    tags: ['family'], lat: 44.7934, lng: 20.4429, admins: ['u11', 'u15'],
    description: 'Kindergartens, schools, pediatricians, playgrounds and weekend ideas for families from everywhere.',
    memberSample: ['u11', 'u15', 'u22', 'u3', 'u21'],
  },
  {
    id: 'c4', name: 'Language exchange SR–EN', emoji: '🗣️', avatar: 'coffee', cover: 'friendsGroup', members: 2710, languages: ['sr', 'en'], country: 'rs',
    tags: ['language', 'coffee', 'culture'], lat: 44.8199, lng: 20.4598, admins: ['u10'],
    description: 'Practise Serbian with locals who want to practise English. Weekly meetups, tandem partners and a word of the day. Hajde da pričamo!',
    memberSample: ['u10', 'u7', 'u24', 'u17', 'u20'],
  },
  {
    id: 'c5', name: 'Turkish community', nativeName: 'Belgrad Türkleri', emoji: '🧿', avatar: 'bread', cover: 'foodSpread', members: 1920, languages: ['tr'], country: 'tr',
    tags: ['food', 'culture', 'business'], lat: 44.8455, lng: 20.4108, admins: ['u2'],
    description: 'Belgrad’da yaşayan Türkler için: iş, ev, resmi işlemler ve buluşmalar. Herkese açık!',
    memberSample: ['u2', 'u17', 'u8'],
  },
  {
    id: 'c6', name: 'Digital nomads BG', emoji: '🧳', avatar: 'laptopDesk', cover: 'coworkLounge', members: 4310, languages: ['en'], country: null,
    tags: ['nomad', 'it', 'nightlife', 'sports'], lat: 44.8120, lng: 20.4520, admins: ['u12'],
    description: 'Coworkings, visas, 90/180 rules, apartments and weekly hangouts. Belgrade is the most underrated nomad city in Europe — prove us wrong.',
    memberSample: ['u12', 'u7', 'u20', 'u5', 'u14'],
  },
  {
    id: 'c7', name: 'Ukrainians in Serbia', nativeName: 'Українці в Сербії', emoji: '🌻', avatar: 'tree', cover: 'friendsSunset', members: 6820, languages: ['uk'], country: 'ua',
    tags: ['volunteering', 'family', 'culture'], lat: 44.8440, lng: 20.4090, admins: ['u15'],
    description: 'Допомога, документи, тимчасовий захист, школи та зустрічі для українців у Сербії.',
    memberSample: ['u15', 'u3'],
  },
]
export const communityById = Object.fromEntries(communities.map((c) => [c.id, c]))

export const moments = [
  { id: 'm1', userId: 'u7', placeId: 'b8', photo: 'coffee', caption: 'Morning flat white + Serbian homework ☕📖', views: 2430, type: 'photo', time: '2h' },
  { id: 'm2', userId: 'u2', placeId: 'b2', photo: 'bread', caption: 'First batch of simit just out of the oven 🔥', views: 5120, type: 'video', time: '3h' },
  { id: 'm3', userId: 'u12', placeId: null, photo: 'running', caption: 'Ada Ciganlija sunset run, 18°C in November?!', views: 1870, type: 'video', time: '5h', lat: 44.7876, lng: 20.4120, placeName: 'Ada Ciganlija' },
  { id: 'm4', userId: 'u16', placeId: 'b6', photo: 'curry', caption: 'Bollywood Friday prep — dal makhani simmering since 8am', views: 3310, type: 'photo', time: '6h' },
  { id: 'm5', userId: 'u20', placeId: 'b16', photo: 'neon', caption: 'Savamala at night hits different 🌃', views: 4290, type: 'photo', time: '8h' },
  { id: 'm6', userId: 'u1', placeId: 'b1', photo: 'cafeInterior', caption: 'Новые книги в нашей библиотеке — приходите читать!', views: 980, type: 'photo', time: '1d' },
  { id: 'm7', userId: 'u5', placeId: 'b7', photo: 'teamwork', caption: 'Women in Tech planning session 💜', views: 1540, type: 'photo', time: '1d' },
  { id: 'm8', userId: 'u10', placeId: 'b12', photo: 'bookshelf', caption: 'Book swap this Saturday at Polyglot — bring 1, take 1', views: 760, type: 'photo', time: '2d' },
  { id: 'm9', userId: 'u8', placeId: 'b9', photo: 'concert', caption: 'Sound check for Persian Music Night 🎶', views: 1290, type: 'video', time: '2d' },
]

const ago = (min) => min // minutes ago, rendered by timeAgo()

export const posts = [
  { id: 'p1', authorId: 'u7', type: 'question', lang: 'en', text: 'Okay Belgrade, honest question: where do you get your residence-permit photos done near Savska? The booth inside was broken today 😩', photos: [], placeId: 'o1', communityId: 'c6', likes: 34, reposts: 2, time: ago(25),
    comments: [{ userId: 'u6', text: 'There’s a photo studio across the street, 2 min walk, €5 for 4 photos.', time: 12 }, { userId: 'u10', text: 'Also the one on Nemanjina next to the post office!', time: 8 }] },
  { id: 'p2', authorId: 'u9', type: 'post', lang: 'ru', text: 'Ребят, наконец-то получил боравак! 🎉 Подавал 3 сентября, карточку забрал вчера. Всем, кто ждёт — держитесь, оно того стоит. Спасибо Тому за помощь с документами.', photos: [], placeId: 'o1', communityId: 'c1', likes: 212, reposts: 8, time: ago(48),
    comments: [{ userId: 'u1', text: 'Поздравляю!! 🥳', time: 40 }, { userId: 'u18', text: 'Congrats Dmitry, well deserved!', time: 30 }] },
  { id: 'p3', authorId: 'u2', type: 'recommendation', lang: 'en', text: 'New in the bakery: pistachio simit 🥯💚 Only weekends, only until we run out (usually ~11am). Show this post for a free çay.', photos: ['bread', 'foodSpread'], placeId: 'b2', communityId: 'c5', likes: 389, reposts: 41, time: ago(90), comments: [] },
  { id: 'p4', authorId: 'u5', type: 'recommendation', lang: 'en', text: 'PSA for anyone looking for real Indian groceries: Golden Dragon Market in Blok 70 now stocks curry leaves, paneer AND proper basmati. I may have cried a little.', photos: ['grocery'], placeId: 'b3', communityId: 'c2', likes: 156, reposts: 22, time: ago(140),
    comments: [{ userId: 'u16', text: 'Haha I can confirm, we buy our backup paneer there 😄', time: 120 }] },
  { id: 'p5', authorId: 'u17', type: 'post', lang: 'tr', text: 'Pamuk ile Kalemegdan’da sabah yürüyüşü 🐶🍂 Belgrad’ın sonbaharı inanılmaz.', photos: ['tree'], placeId: null, communityId: 'c5', likes: 97, reposts: 1, time: ago(200), comments: [] },
  { id: 'p6', authorId: 'u11', type: 'question', lang: 'ru', text: 'Мамы, подскажите русскоязычный или англоязычный детский сад в Новом Белграде? Ребёнку 4 года. Бюджет до 400€.', photos: [], placeId: null, communityId: 'c3', likes: 41, reposts: 3, time: ago(260),
    comments: [{ userId: 'u15', text: 'Little Explorers в Сеньяке — очень довольны, но чуть дороже.', time: 230 }, { userId: 'u3', text: 'Напишу в личку пару вариантов 💛', time: 210 }] },
  { id: 'p7', authorId: 'u6', type: 'guide', lang: 'en', text: '🧾 My 8-year cheat sheet for the white card (bela karta): 1) your landlord must register you within 24h of arrival, 2) if they refuse — go yourself to the local police station with the contract, 3) keep the paper, you’ll need it for EVERYTHING (bank, SIM contract, residence). Full guide in Guides →', photos: [], placeId: null, communityId: null, likes: 534, reposts: 120, time: ago(320), comments: [{ userId: 'u24', text: 'Saving this, thank you!', time: 300 }], guideId: 'g1' },
  { id: 'p8', authorId: 'u3', type: 'post', lang: 'uk', text: 'Наша студія відкрила другий кабінет! Тепер можна записатися і на вихідні 💅✨ Діти — у дитячому куточку, мами — на манікюрі.', photos: ['hairdresser', 'hair'], placeId: 'b5', communityId: 'c7', likes: 143, reposts: 5, time: ago(380), comments: [] },
  { id: 'p9', authorId: 'u10', type: 'post', lang: 'sr', text: 'Reč dana: „polako“ 🐢 — slowly, take it easy. The most Serbian word there is. Use it when someone rushes you at the šalter 😄', photos: [], placeId: null, communityId: 'c4', likes: 621, reposts: 88, time: ago(420), comments: [{ userId: 'u7', text: 'Polako is my new life motto', time: 400 }, { userId: 'u24', text: 'هر روز یاد می‌گیرم 🙏 polako!', time: 390 }] },
  { id: 'p10', authorId: 'u14', type: 'post', lang: 'en', text: 'We’re hiring a mid/senior React dev in Belgrade (hybrid, Dorćol). English is enough, Serbian is a bonus. We help with the work permit. Details in Services → Jobs 👇', photos: ['laptopCode'], placeId: 'b7', communityId: 'c2', likes: 88, reposts: 31, time: ago(500), comments: [], jobId: 'j1' },
  { id: 'p11', authorId: 'u4', type: 'post', lang: 'zh', text: '本周五和周二有新鲜豆腐 🥢 欢迎大家来新贝尔格莱德70街区！We also have mooncakes back in stock.', photos: ['dumplings'], placeId: 'b3', communityId: null, likes: 64, reposts: 4, time: ago(620), comments: [] },
  { id: 'p12', authorId: 'u24', type: 'question', lang: 'en', text: 'Just arrived from Berlin 👋 Looking for a shared art studio or any space with good light. Vračar or Dorćol ideally. Any painters here?', photos: [], placeId: null, communityId: null, likes: 52, reposts: 6, time: ago(700),
    comments: [{ userId: 'u1', text: 'Hi Sara! Join our sketch walk on Thursday, lots of artists come 🎨', time: 650 }] },
  { id: 'p13', authorId: 'u19', type: 'post', lang: 'ru', text: 'Йога по субботам переезжает в зал на Врачаре на зиму 🧘‍♀️ Первое занятие бесплатно, коврики есть. Пишите в личку!', photos: ['yoga'], placeId: null, communityId: 'c1', likes: 118, reposts: 9, time: ago(820), comments: [] },
  { id: 'p14', authorId: 'u12', type: 'post', lang: 'en', text: 'Month 3 in Belgrade report: rent €600 for a 1BR in Savamala, coworking €140, food is cheap, people are warm, nightlife is world-class. Only complaint: cigarette smoke indoors. 9/10 would nomad again.', photos: ['city'], placeId: null, communityId: 'c6', likes: 742, reposts: 133, time: ago(980),
    comments: [{ userId: 'u20', text: 'Agree on everything incl. the smoke 😅', time: 900 }] },
  { id: 'p15', authorId: 'u8', type: 'post', lang: 'fa', text: 'شب موسیقی ایرانی جمعه ۱۳ نوامبر 🎶 جای خالی کم است! Persian Music Night — Friday the 13th, see you there.', photos: ['concert'], placeId: 'b9', communityId: null, likes: 76, reposts: 12, time: ago(1100), comments: [], eventId: 'e3' },
  { id: 'p16', authorId: 'u22', type: 'recommendation', lang: 'en', text: 'Flu season reminder for parents 🤧 You can get the flu vaccine at the Dom zdravlja in your municipality without a referral. Bring the kids’ vaccination booklet (even a foreign one).', photos: [], placeId: null, communityId: 'c3', likes: 203, reposts: 47, time: ago(1300), comments: [] },
  { id: 'p17', authorId: 'u20', type: 'post', lang: 'it', text: 'Genex Tower al tramonto. Il brutalismo di Belgrado è poesia 🏢✨', photos: ['city'], placeId: null, communityId: null, likes: 310, reposts: 19, time: ago(1500), comments: [] },
  { id: 'p18', authorId: 'u15', type: 'post', lang: 'uk', text: 'Збираємо теплі речі та іграшки для дітей у Земуні до 20 листопада 💙💛 Пункт збору — Zemun Cultural Centre, щодня 10:00–18:00.', photos: [], placeId: null, communityId: 'c7', likes: 260, reposts: 70, time: ago(1700), comments: [] },
  { id: 'p19', authorId: 'u16', type: 'post', lang: 'en', text: 'Diwali dinner was a success — 140 guests from 22 countries 🪔 Thank you Belgrade!', photos: ['dinnerGroup', 'curry'], placeId: 'b6', communityId: null, likes: 488, reposts: 25, time: ago(2400), comments: [] },
  { id: 'p20', authorId: 'u21', type: 'question', lang: 'ru', text: 'Кто-нибудь переводил школьные документы ребёнка для сербской школы? Нужен апостиль или достаточно присяжного перевода?', photos: [], placeId: null, communityId: 'c3', likes: 29, reposts: 1, time: ago(2900),
    comments: [{ userId: 'u13', text: 'Usually sworn translation + apostille on the original. I can help with the translation part.', time: 2800 }] },
  { id: 'p21', authorId: 'u1', type: 'recommendation', lang: 'en', text: 'Hidden gem: the little park behind Hram Svetog Save is the quietest place in Vračar to read on a sunny afternoon 🌳📖', photos: ['tree'], placeId: null, communityId: null, likes: 167, reposts: 10, time: ago(3300), comments: [] },
  { id: 'p22', authorId: 'u18', type: 'guide', lang: 'en', text: 'Quick update on 2026 rules: single permit (residence + work) is now issued in one application. Processing ~15 days if documents are complete. I’ll explain everything at the Q&A on Nov 17.', photos: [], placeId: 'o1', communityId: 'c2', likes: 401, reposts: 156, time: ago(3800), comments: [], eventId: 'e5' },
  { id: 'p23', authorId: 'u6', type: 'post', lang: 'de', text: 'Stammtisch heute Abend in der Hafen Bierhalle, ab 19 Uhr. Neue Gesichter willkommen! 🍺', photos: ['bar'], placeId: 'b10', communityId: null, likes: 45, reposts: 2, time: ago(4300), comments: [] },
]

// Mock auto-translations for non-English posts
export const translations = {
  p2: 'Guys, I finally got my residence permit! 🎉 Applied on Sept 3, picked up the card yesterday. To everyone still waiting — hang in there, it’s worth it. Thanks to Tom for helping with the documents.',
  p5: 'Morning walk with Pamuk in Kalemegdan 🐶🍂 Belgrade’s autumn is incredible.',
  p6: 'Moms, can you recommend a Russian- or English-speaking kindergarten in Novi Beograd? My child is 4. Budget up to €400.',
  p8: 'Our studio opened a second room! Now you can book on weekends too 💅✨ Kids in the kids’ corner, moms at the manicure.',
  p9: 'Word of the day: “polako” 🐢 — slowly, take it easy. The most Serbian word there is. Use it when someone rushes you at the counter 😄',
  p11: 'Fresh tofu this Friday and Tuesday 🥢 Welcome to Blok 70 in Novi Beograd! We also have mooncakes back in stock.',
  p13: 'Saturday yoga is moving to a studio in Vračar for the winter 🧘‍♀️ First class is free, mats provided. DM me!',
  p15: 'Persian music night on Friday, November 13 🎶 Few spots left!',
  p17: 'Genex Tower at sunset. Belgrade’s brutalism is poetry 🏢✨',
  p18: 'We’re collecting warm clothes and toys for kids in Zemun until November 20 💙💛 Drop-off point — Zemun Cultural Centre, daily 10:00–18:00.',
  p20: 'Has anyone translated their child’s school documents for a Serbian school? Do you need an apostille, or is a sworn translation enough?',
  p23: 'Stammtisch tonight at Hafen Bierhalle, from 7pm. New faces welcome! 🍺',
}
