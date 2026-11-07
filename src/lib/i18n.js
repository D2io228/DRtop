const dict = {
  en: {},
  ru: {
    Explore: 'Карта', Community: 'Сообщество', Events: 'События', Services: 'Сервисы', Connect: 'Люди', Guides: 'Гайды', Profile: 'Профиль',
    'Search places, people, events…': 'Поиск мест, людей, событий…', 'Your settling-in progress': 'Ваш прогресс адаптации',
    'Moments around you': 'Моменты рядом', 'For you': 'Для вас', Following: 'Подписки', 'My communities': 'Мои сообщества', Questions: 'Вопросы',
    Join: 'Вступить', Joined: 'Вы участник', Message: 'Написать', Book: 'Записаться', Follow: 'Подписаться', 'Say hi': 'Привет 👋',
    Apply: 'Откликнуться', Save: 'Сохранить', Saved: 'Сохранено', Notifications: 'Уведомления', Filters: 'Фильтры', 'Show results': 'Показать',
    'Places & Businesses': 'Места и бизнес', Specialists: 'Специалисты', Jobs: 'Вакансии', Housing: 'Жильё', People: 'Люди', Chats: 'Чаты',
    All: 'Все', Groups: 'Группы', Private: 'Личные', 'Create event': 'Создать событие', List: 'Список', Calendar: 'Календарь',
    'Ask the community': 'Спросить сообщество', 'Settling-in checklist': 'Чек-лист адаптации', 'Communities': 'Сообщества',
    'people joined': 'участников', 'What’s new?': 'Что нового?', Post: 'Опубликовать', 'Open': 'Открыто', 'Closed': 'Закрыто',
    'Directions': 'Маршрут', 'Call': 'Позвонить', 'Reviews': 'Отзывы', 'Languages': 'Языки', 'Interests': 'Интересы',
  },
  sr: {
    Explore: 'Mapa', Community: 'Zajednica', Events: 'Događaji', Services: 'Usluge', Connect: 'Ljudi', Guides: 'Vodiči', Profile: 'Profil',
    'Search places, people, events…': 'Pretraži mesta, ljude, događaje…', 'Your settling-in progress': 'Vaš napredak u snalaženju',
    'Moments around you': 'Trenuci oko vas', 'For you': 'Za vas', Following: 'Praćeni', 'My communities': 'Moje zajednice', Questions: 'Pitanja',
    Join: 'Pridruži se', Joined: 'Pridruženi', Message: 'Poruka', Book: 'Zakaži', Follow: 'Prati', 'Say hi': 'Zdravo 👋',
    Apply: 'Prijavi se', Save: 'Sačuvaj', Saved: 'Sačuvano', Notifications: 'Obaveštenja', Filters: 'Filteri', 'Show results': 'Prikaži',
    'Places & Businesses': 'Mesta i firme', Specialists: 'Stručnjaci', Jobs: 'Poslovi', Housing: 'Stanovi', People: 'Ljudi', Chats: 'Četovi',
    All: 'Sve', Groups: 'Grupe', Private: 'Privatno', 'Create event': 'Napravi događaj', List: 'Lista', Calendar: 'Kalendar',
    'Ask the community': 'Pitaj zajednicu', 'Settling-in checklist': 'Lista za snalaženje', 'Communities': 'Zajednice',
    'people joined': 'pridruženih', 'What’s new?': 'Šta ima novo?', Post: 'Objavi', 'Open': 'Otvoreno', 'Closed': 'Zatvoreno',
    'Directions': 'Putanja', 'Call': 'Pozovi', 'Reviews': 'Recenzije', 'Languages': 'Jezici', 'Interests': 'Interesovanja',
  },
}

export const translate = (lang, key) => dict[lang]?.[key] ?? key
