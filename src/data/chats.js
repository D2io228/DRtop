// 'me' = current user
export const chats = [
  {
    id: 'ch1', type: 'private', kind: 'user', refId: 'u1', unread: 2,
    messages: [
      { id: 1, from: 'u1', text: 'Hi! Saw you’re new in Vračar 👋 Welcome!', time: 'Yesterday' },
      { id: 2, from: 'me', text: 'Hi Anya! Thank you 😊 Still figuring everything out haha', time: 'Yesterday' },
      { id: 3, from: 'u1', text: 'Totally normal. Come to the sketch walk on Thursday — great way to meet people, and we end with tea at Samovar 🫖', time: '09:41' },
      { id: 4, from: 'u1', text: 'Also if you need a translator for documents, Sophie is amazing', time: '09:42' },
    ],
  },
  {
    id: 'ch2', type: 'group', kind: 'community', refId: 'c1', unread: 5,
    messages: [
      { id: 1, from: 'u19', text: 'Доброе утро всем! ☀️ Напоминаю: в субботу йога на Врачаре', time: '08:02' },
      { id: 2, from: 'u9', text: 'Кто знает, где сделать фото на боравак рядом с Савской?', time: '08:15' },
      { id: 3, from: 'u1', text: 'Через дорогу фотостудия, 5 евро за 4 фото', time: '08:17' },
      { id: 4, from: 'u11', text: 'Подскажите хорошего педиатра, говорящего по-русски или по-английски 🙏', time: '09:30' },
      { id: 5, from: 'u21', text: 'Dr. Hannah Schmidt в Сеньяке — английский, очень довольны', time: '09:34' },
    ],
  },
  {
    id: 'ch3', type: 'group', kind: 'event', refId: 'e2', unread: 0,
    messages: [
      { id: 1, from: 'u6', text: 'Welcome everyone to the Newcomers Meetup chat! 🎉 Rooftop opens at 17:00.', time: 'Mon' },
      { id: 2, from: 'u12', text: 'Can I bring a friend who isn’t on Kompas yet?', time: 'Mon' },
      { id: 3, from: 'u6', text: 'Of course! Just have them register at the door.', time: 'Mon' },
      { id: 4, from: 'u24', text: 'Looking forward to it — first event in Belgrade for me 🙌', time: 'Tue' },
    ],
  },
  {
    id: 'ch4', type: 'private', kind: 'business', refId: 'b5', unread: 0,
    messages: [
      { id: 1, from: 'me', text: 'Hi! Do you have a slot for manicure this Saturday?', time: 'Thu' },
      { id: 2, from: 'b5', text: 'Hello! Yes — 11:00 or 15:30 💅 Which works for you?', time: 'Thu' },
      { id: 3, from: 'me', text: '11:00 please!', time: 'Thu' },
      { id: 4, from: 'b5', text: 'Booked ✅ See you Saturday at Studio Lileya, Blok 21. Parking is free in the yard.', time: 'Thu' },
    ],
  },
  {
    id: 'ch5', type: 'group', kind: 'community', refId: 'c6', unread: 1,
    messages: [
      { id: 1, from: 'u12', text: 'Football tomorrow 11:00 at Ada, we need 2 more players ⚽', time: '18:20' },
      { id: 2, from: 'u20', text: 'I can’t play but I’ll come cheer 📣', time: '18:45' },
    ],
  },
]

export const notifications = [
  { id: 'n1', icon: 'heart', userId: 'u10', text: 'liked your reply in “Where to get residence-permit photos?”', time: '5m', read: false, link: '/post/p1' },
  { id: 'n2', icon: 'event', text: 'Sunday Football at Ada starts tomorrow at 11:00', time: '1h', read: false, link: '/event/e4' },
  { id: 'n3', icon: 'follow', userId: 'u1', text: 'started following you', time: '3h', read: false, link: '/u/u1' },
  { id: 'n4', icon: 'guide', text: 'Keep going! Your next settling-in step: open a bank account', time: '1d', read: true, link: '/guides/goal/banking' },
  { id: 'n5', icon: 'comment', userId: 'u6', text: 'replied: “There’s a photo studio across the street…”', time: '1d', read: true, link: '/post/p1' },
  { id: 'n6', icon: 'community', text: 'New in Digital nomads BG: “Month 3 in Belgrade report”', time: '2d', read: true, link: '/post/p14' },
]
