"""Factual data used by charts and track headers.

Durations, features and sample credits: Wikipedia, «The Life of Pablo»
(track listing, notes, sample credits), cross-checked with Apple Music and
official-lyrics transcriptions. Sample years: first release of the sampled
recording (where a year could not be confirmed it is left as None).

The «Pablo index» (Paul / Picasso / Escobar, 0..3) and the «self <-> others»
values are the essay's interpretation, not measurements, and are labelled so.
"""

TRACKS = [
    # n, title, seconds, feat (voices credited), pablo (P, Pi, E), self_vs_others (-3 need others .. +3 own self)
    dict(n=1, t="Ultralight Beam", sec=320,
         feat=["Chance the Rapper", "Kelly Price", "The-Dream", "Kirk Franklin", "Натали и Самория Грин", "хор"],
         kanye=True, samples=[], pablo=(3, 1, 0), self=-3),
    dict(n=2, t="Father Stretch My Hands Pt. 1", sec=135,
         feat=["Kid Cudi", "Future (тег Metro Boomin)"], kanye=True,
         samples=[("Pastor T. L. Barrett", "Father I Stretch My Hands", 1976)], pablo=(2, 2, 1), self=-1),
    dict(n=3, t="Pt. 2", sec=130,
         feat=["Desiigner (Panda)", "Caroline Shaw"], kanye=True,
         samples=[("Desiigner", "Panda", 2015), ("Pastor T. L. Barrett", "Father I Stretch My Hands", 1976)],
         pablo=(1, 2, 2), self=0),
    dict(n=4, t="Famous", sec=196,
         feat=["Rihanna", "Swizz Beatz"], kanye=True,
         samples=[("Nina Simone", "Do What You Gotta Do", 1968), ("Il Rovescio della Medaglia", "Mi Sono Svegliato E… Ho Chiuso Gli Occhi", 1973), ("Sister Nancy", "Bam Bam", 1982)],
         pablo=(0, 3, 2), self=3),
    dict(n=5, t="Feedback", sec=147, feat=[], kanye=True,
         samples=[("Googoosh", "Talagh", None)], pablo=(0, 2, 2), self=3),
    dict(n=6, t="Low Lights", sec=131, feat=[], kanye=False,
         samples=[("Kings of Tomorrow", "So Alive (Acapella)", None)], pablo=(3, 0, 0), self=-3),
    dict(n=7, t="Highlights", sec=199,
         feat=["Young Thug", "The-Dream", "El DeBarge", "Kelly Price"], kanye=True, samples=[], pablo=(0, 1, 3), self=2),
    dict(n=8, t="Freestyle 4", sec=123, feat=["Desiigner"], kanye=True,
         samples=[("Goldfrapp", "Human", 2000)], pablo=(0, 1, 2), self=3),
    dict(n=9, t="I Love Kanye", sec=44, feat=[], kanye=True, samples=[], pablo=(0, 3, 1), self=1),
    dict(n=10, t="Waves", sec=181, feat=["Chris Brown", "Kid Cudi"], kanye=True,
         samples=[("Fantastic Freaks", "Fantastic Freaks at the Dixie", None)], pablo=(1, 2, 0), self=-1),
    dict(n=11, t="FML", sec=236, feat=["The Weeknd", "Caroline Shaw"], kanye=True,
         samples=[("Section 25", "Hit", 1981)], pablo=(3, 0, 2), self=1),
    dict(n=12, t="Real Friends", sec=251, feat=["Ty Dolla $ign"], kanye=True,
         samples=[("Whodini", "Friends", 1984)], pablo=(2, 0, 2), self=-2),
    dict(n=13, t="Wolves", sec=301, feat=["Vic Mensa", "Sia", "Caroline Shaw"], kanye=True,
         samples=[("Sugar Minott", "Walking Dub", None)], pablo=(3, 2, 1), self=1),
    dict(n=14, t="Frank’s Track", sec=38, feat=["Frank Ocean"], kanye=False, samples=[], pablo=(2, 2, 0), self=-2),
    dict(n=15, t="Siiiiiiiiilver Surffffeeeeer Intermission", sec=56, feat=["Max B", "French Montana"], kanye=False,
         samples=[], pablo=(0, 1, 1), self=-1),
    dict(n=16, t="30 Hours", sec=323, feat=["André 3000"], kanye=True,
         samples=[("Arthur Russell", "Answers Me", 1986), ("Isaac Hayes", "Joy", 1973), ("Nelly", "E.I.", 2000), ("Nelly", "Hot in Herre", 2002)],
         pablo=(0, 3, 1), self=0),
    dict(n=17, t="No More Parties in LA", sec=374, feat=["Kendrick Lamar"], kanye=True,
         samples=[("Junie Morrison", "Suzie Thundertussy", 1976), ("Johnny “Guitar” Watson", "Give Me My Love", 1977), ("Larry Graham", "Stand Up and Shout About Love", 1980), ("Ghostface Killah", "Mighty Healthy", 2000)],
         pablo=(0, 2, 3), self=1),
    dict(n=18, t="Facts (Charlie Heat Version)", sec=200, feat=[], kanye=True,
         samples=[("Father’s Children", "Dirt and Grime", 1973), ("Street Fighter II", "звуковые эффекты", 1991), ("Drake & Future", "Jumpman", 2015)],
         pablo=(0, 0, 3), self=3),
    dict(n=19, t="Fade", sec=193, feat=["Post Malone", "Ty Dolla $ign"], kanye=True,
         samples=[("Rare Earth", "(I Know) I’m Losing You", 1970), ("Mr. Fingers", "Mystery of Love", 1985), ("Hardrive", "Deep Inside", 1993), ("Barbara Tucker", "I Get Lifted", 1994), ("Aaliyah", "Rock the Boat", 2001)],
         pablo=(2, 2, 0), self=-1),
    dict(n=20, t="Saint Pablo", sec=372, feat=["Sampha"], kanye=True,
         samples=[("Jay-Z", "Where I’m From", 1997)], pablo=(3, 2, 2), self=-3),
]

TOTAL_MIN = 66  # Apple Music / Wikipedia: 1 h 6 min

RELEASE = [
    ("2016-02-11", "Премьера в Madison Square Garden на показе Yeezy Season 3"),
    ("2016-02-14", "Выход на Tidal; ненадолго — продажа за $20"),
    ("2016-03-13", "Обновлённая Famous"),
    ("2016-03-16", "Переработанная Wolves; Frank’s Track — отдельной дорожкой"),
    ("2016-03-30", "Крупное обновление: изменены минимум 12 треков"),
    ("2016-04-01", "Spotify, Apple Music, Google Play"),
    ("2016-04-02", "Поправлено аутро 30 Hours"),
    ("2016-06-14", "Добавлена Saint Pablo с Самфой"),
]

TITLES = [
    ("ноябрь 2013", "So Help Me God"),
    ("2015", "SWISH"),
    ("26.01.2016", "WAVES"),
    ("09.02.2016", "The Life of Pablo"),
]

MOTIFS = ["Бог", "Семья", "Деньги", "Тело", "Одежда", "Публика", "Свет", "Телефон", "Близость"]
# per track: set of motif indices (as discussed in the essay)
MOTIF_MAP = {
    1: {0, 1, 6}, 2: {0, 3, 4, 6}, 3: {0, 1, 2}, 4: {2, 5}, 5: {5},
    6: {0, 6, 8}, 7: {2, 3, 5, 6, 7}, 8: {3, 5}, 9: {5}, 10: {8},
    11: {1, 2, 5, 8}, 12: {0, 1, 2, 4, 7, 8}, 13: {0, 1, 3}, 14: {6},
    15: {5, 7}, 16: {2, 7, 8}, 17: {1, 2, 3}, 18: {2, 5}, 19: {0, 3, 8}, 20: {0, 2, 5},
}

ALBUMS = [
    ("My Beautiful Dark Twisted Fantasy", 2010, 13, 68, "спектакль"),
    ("Yeezus", 2013, 10, 40, "давление"),
    ("The Life of Pablo", 2016, 20, 66, "повседневность"),
]
