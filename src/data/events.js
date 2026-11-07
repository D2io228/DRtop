// Dates are ISO strings in local Belgrade time. "Today" in the prototype is 2026-11-07.
export const events = [
  {
    id: 'e1', title: 'SR–EN Language Exchange', category: 'language', date: '2026-11-11T19:00', durationH: 2, placeId: 'b8', venue: 'Zrno Coffee Lab', neighborhood: 'Dorćol',
    lat: 44.8199, lng: 20.4598, cover: 'friendsGroup', languages: ['sr', 'en'], hostId: 'u10', joined: 64, capacity: 80, price: 0, tags: ['language', 'coffee'],
    description: 'Half the evening in Serbian, half in English. Tables by level (beginner → fluent), conversation cards provided. First coffee is on us!',
    attendees: ['u7', 'u24', 'u9', 'u17', 'u12', 'u20', 'u1'],
  },
  {
    id: 'e2', title: 'Newcomers Welcome Meetup', category: 'meetup', date: '2026-11-14T17:00', durationH: 3, placeId: 'b7', venue: 'Hive Coworking Dorćol — rooftop', neighborhood: 'Dorćol',
    lat: 44.8236, lng: 20.4648, cover: 'friendsSunset', languages: ['en', 'ru', 'sr'], hostId: 'u6', joined: 124, capacity: 150, price: 0, tags: ['language', 'nomad', 'culture'],
    description: 'Just moved? Meet people who’ve been through it. Short talks on residence permits, banking and SIM cards, then drinks on the rooftop. Bring questions!',
    attendees: ['u7', 'u24', 'u11', 'u12', 'u20', 'u17', 'u9', 'u5', 'u14'],
  },
  {
    id: 'e3', title: 'Persian Music Night', category: 'culture', date: '2026-11-13T21:00', durationH: 3, placeId: 'b9', venue: 'Persepolis Kitchen', neighborhood: 'Palilula',
    lat: 44.8137, lng: 20.4752, cover: 'concert', languages: ['fa', 'en'], hostId: 'u8', joined: 58, capacity: 70, price: 10, tags: ['music', 'culture', 'food'],
    description: 'Live setar and tombak, traditional songs and a special saffron menu. Ticket includes a drink and dessert.',
    attendees: ['u8', 'u24', 'u5', 'u20'],
  },
  {
    id: 'e4', title: 'Sunday Football at Ada', category: 'sports', date: '2026-11-08T11:00', durationH: 2, venue: 'Ada Ciganlija — Field 3', neighborhood: 'Čukarica',
    lat: 44.7876, lng: 20.4120, cover: 'running', languages: ['en', 'pt', 'sr'], hostId: 'u12', joined: 22, capacity: 24, price: 0, tags: ['sports', 'outdoors'],
    description: 'Friendly 7-a-side, all levels, mixed teams. Bring a light and a dark shirt. Beers after at the lake 🍻',
    attendees: ['u12', 'u9', 'u6', 'u10'],
  },
  {
    id: 'e5', title: 'Residence Permit 101 — Q&A with a lawyer', category: 'lecture', date: '2026-11-17T18:30', durationH: 1.5, placeId: 'b7', venue: 'Hive Coworking Dorćol', neighborhood: 'Dorćol',
    lat: 44.8236, lng: 20.4648, cover: 'lecture', languages: ['en', 'ru'], hostId: 'u18', joined: 96, capacity: 120, price: 0, tags: ['business'],
    description: 'Everything about temporary residence in 2026: work, entrepreneur, family and real-estate grounds. Live Russian interpretation. Free, registration required.',
    attendees: ['u9', 'u11', 'u24', 'u7', 'u12'],
  },
  {
    id: 'e6', title: 'Savamala Rooftop: Techno & Sunset', category: 'party', date: '2026-11-21T22:00', durationH: 6, venue: 'Rooftop at Karađorđeva 61', neighborhood: 'Savamala',
    lat: 44.8102, lng: 20.4498, cover: 'party', languages: ['en'], hostId: 'u12', joined: 210, capacity: 300, price: 15, tags: ['nightlife', 'music'],
    description: 'International crowd, two DJs from Berlin and Belgrade, view over the Sava. Early birds €10 until Wednesday.',
    attendees: ['u12', 'u20', 'u9', 'u17'],
  },
  {
    id: 'e7', title: 'Kids’ Art Workshop (UA/RU)', category: 'culture', date: '2026-11-14T11:00', durationH: 2, venue: 'Zemun Cultural Centre', neighborhood: 'Zemun',
    lat: 44.8440, lng: 20.4090, cover: 'design', languages: ['uk', 'ru'], hostId: 'u15', joined: 18, capacity: 25, price: 5, tags: ['family', 'art'],
    description: 'Painting and clay for kids 4–10. Parents’ coffee corner while the little ones create. All materials included.',
    attendees: ['u15', 'u11', 'u3'],
  },
  {
    id: 'e8', title: 'Women in Tech Belgrade', category: 'meetup', date: '2026-11-19T19:00', durationH: 2.5, placeId: 'b7', venue: 'Hive Coworking Dorćol', neighborhood: 'Dorćol',
    lat: 44.8236, lng: 20.4648, cover: 'presentation', languages: ['en'], hostId: 'u5', joined: 74, capacity: 90, price: 0, tags: ['it', 'business'],
    description: 'Two lightning talks (“Getting a Serbian work permit as a dev” and “Freelancing as a paušal entrepreneur”), then networking with pizza.',
    attendees: ['u5', 'u20', 'u7', 'u24'],
  },
  {
    id: 'e9', title: 'Sketch Walk: Dorćol Facades', category: 'culture', date: '2026-11-12T16:00', durationH: 2, venue: 'Meet at Kapetan Mišino zdanje', neighborhood: 'Stari Grad',
    lat: 44.8190, lng: 20.4566, cover: 'city', languages: ['ru', 'en'], hostId: 'u1', joined: 15, capacity: 20, price: 0, tags: ['art', 'outdoors', 'culture'],
    description: 'Рисуем старые фасады Дорчола. Bring a sketchbook — all levels welcome, we finish with tea at Samovar & Co.',
    attendees: ['u1', 'u17', 'u24', 'u20'],
  },
  {
    id: 'e10', title: 'Turkish Breakfast Club', category: 'meetup', date: '2026-11-15T10:00', durationH: 2, placeId: 'b2', venue: 'Simit & Sava', neighborhood: 'Zemun',
    lat: 44.8455, lng: 20.4108, cover: 'foodSpread', languages: ['tr', 'en'], hostId: 'u2', joined: 32, capacity: 40, price: 12, tags: ['food', 'language'],
    description: 'Long-table Turkish breakfast, practise Turkish or just eat simit. Herkes davetli!',
    attendees: ['u2', 'u17', 'u6'],
  },
]
