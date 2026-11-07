export const jobs = [
  { id: 'j1', title: 'React Developer (mid/senior)', company: 'Kodlab Studio', logo: '💻', posterId: 'u14', placeId: 'b7', neighborhood: 'Dorćol', type: 'Full-time', remote: 'Hybrid', salaryMin: 2500, salaryMax: 3500, languages: ['en'], niceToHave: ['sr'], posted: '2d', applicants: 34, tags: ['it'],
    description: 'Build web apps for EU clients in a team of 9. React, TypeScript, a bit of Node. We sponsor the single permit and help with relocation paperwork.', perks: ['Work permit support', 'Private health insurance', '25 days off', 'Serbian lessons'] },
  { id: 'j2', title: 'Barista', company: 'Zrno Coffee Lab', logo: '☕', placeId: 'b8', neighborhood: 'Dorćol', type: 'Part-time', remote: 'On-site', salaryMin: 600, salaryMax: 700, languages: ['en', 'sr'], niceToHave: [], posted: '1d', applicants: 12, tags: ['coffee'],
    description: '20–25 hours/week, morning shifts. We train you on espresso and filter. Basic Serbian needed for regulars, English for everyone else.', perks: ['Free coffee 😄', 'Flexible shifts', 'Tips shared'] },
  { id: 'j3', title: 'Customer Support (Russian + English)', company: 'TravelNest', logo: '🧭', neighborhood: 'Remote', type: 'Full-time', remote: 'Remote', salaryMin: 1300, salaryMax: 1600, languages: ['ru', 'en'], niceToHave: ['uk'], posted: '3d', applicants: 58, tags: ['business'],
    description: 'Help travellers via chat and email. Shifts 8:00–16:00 or 14:00–22:00 CET. Contract via Serbian DOO, fully remote within Serbia.', perks: ['Remote', 'Equipment provided', 'Paid training'] },
  { id: 'j4', title: 'Tandoor Cook', company: 'Masala Sava', logo: '🍛', posterId: 'u16', placeId: 'b6', neighborhood: 'Novi Beograd', type: 'Full-time', remote: 'On-site', salaryMin: 900, salaryMax: 1100, languages: ['hi', 'en'], niceToHave: ['sr'], posted: '5d', applicants: 7, tags: ['food'],
    description: 'Experience with tandoor, naan and kebabs required. 5 days/week, staff meals included. Visa support available.', perks: ['Staff meals', 'Visa support', 'Tips'] },
  { id: 'j5', title: 'Kindergarten Teacher (English)', company: 'Little Explorers', logo: '🧸', placeId: 'b14', neighborhood: 'Senjak', type: 'Full-time', remote: 'On-site', salaryMin: 1000, salaryMax: 1200, languages: ['en'], niceToHave: ['sr', 'ru'], posted: '1w', applicants: 19, tags: ['family'],
    description: 'Lead a group of 10 kids aged 3–5. Native or C1 English, early-childhood education background preferred.', perks: ['Health insurance', 'Free place for your child', 'Summer break'] },
  { id: 'j6', title: 'Sales Assistant (Chinese + Serbian)', company: 'Golden Dragon Market', logo: '🐉', posterId: 'u4', placeId: 'b3', neighborhood: 'Novi Beograd', type: 'Part-time', remote: 'On-site', salaryMin: 650, salaryMax: 750, languages: ['zh', 'sr'], niceToHave: ['en'], posted: '4d', applicants: 5, tags: ['business'],
    description: 'Help customers, manage stock and the cash desk. Weekends required.', perks: ['Employee discount', 'Flexible weekdays'] },
  { id: 'j7', title: 'Social Media Intern (Turkish)', company: 'Simit & Sava', logo: '🥯', posterId: 'u2', placeId: 'b2', neighborhood: 'Remote', type: 'Part-time', remote: 'Remote', salaryMin: 400, salaryMax: 500, languages: ['tr', 'en'], niceToHave: [], posted: '6d', applicants: 22, tags: ['art', 'business'],
    description: 'Shoot reels in the bakery twice a week and run our Instagram & Kompas page.', perks: ['Unlimited simit', 'Portfolio work'] },
]

export const housing = [
  { id: 'h1', title: 'Bright 1-bedroom near Dorćol Platz', neighborhood: 'Dorćol', address: 'Cara Uroša', lat: 44.8243, lng: 20.4618, price: 650, rooms: 2, area: 48, floor: '3/5', furnished: true, pets: true, available: 'Dec 1', photos: ['apt1', 'kitchen', 'bedroom'], ownerId: 'u10', ownerLanguages: ['sr', 'en', 'ru'],
    features: ['Air conditioning', 'Washing machine', 'Balcony', 'Fiber internet'], description: 'Renovated in 2025, quiet courtyard side, 2 min to the Danube promenade. Owner registers your white card the same day.' },
  { id: 'h2', title: 'Cozy studio by Hram Svetog Save', neighborhood: 'Vračar', address: 'Makenzijeva', lat: 44.7985, lng: 20.4721, price: 480, rooms: 1, area: 30, floor: '2/4', furnished: true, pets: false, available: 'Now', photos: ['aptYellow', 'living2'], ownerId: null, ownerName: 'Nikola (agent)', ownerAvatar: 'pv60', ownerLanguages: ['sr', 'en', 'ru'],
    features: ['Heating included', 'Elevator', 'Washing machine'], description: 'Perfect for one person. Bills ~€60/month in winter. 6-month minimum.' },
  { id: 'h3', title: 'Family 2-bedroom in Blok 23', neighborhood: 'Novi Beograd', address: 'Blok 23, Jurija Gagarina', lat: 44.8053, lng: 20.4052, price: 850, rooms: 3, area: 78, floor: '6/12', furnished: true, pets: true, available: 'Nov 20', photos: ['living1', 'kitchen2', 'living3'], ownerId: null, ownerName: 'Jelena', ownerAvatar: 'pv32', ownerLanguages: ['sr', 'en'],
    features: ['Garage spot', 'Playground', 'Near school', 'Two balconies'], description: 'Spacious apartment near the river and two international kindergartens. Parking spot included.' },
  { id: 'h4', title: 'Room in a shared flat — Savamala', neighborhood: 'Savamala', address: 'Karađorđeva', lat: 44.8108, lng: 20.4520, price: 320, rooms: 1, area: 14, floor: '4/4', furnished: true, pets: false, available: 'Nov 15', photos: ['living2', 'bedroom'], ownerId: 'u20', ownerLanguages: ['it', 'en', 'fr'],
    features: ['Bills included', 'Rooftop access', '2 flatmates'], description: 'Looking for a friendly flatmate! We’re an architect (me) and a German developer. River view from the kitchen 🏞️' },
  { id: 'h5', title: 'House with garden in old Zemun', neighborhood: 'Zemun', address: 'Gardoš area', lat: 44.8478, lng: 20.4098, price: 1200, rooms: 4, area: 120, floor: 'House', furnished: false, pets: true, available: 'Jan 1', photos: ['house', 'living3', 'kitchen'], ownerId: null, ownerName: 'Milan', ownerAvatar: 'pv15', ownerLanguages: ['sr', 'de'],
    features: ['Garden', 'Fireplace', 'Two bathrooms', 'Parking'], description: 'Quiet street under Gardoš tower, 5 min walk to the Danube quay. Ideal for a family with kids or pets.' },
]

export const jobById = Object.fromEntries(jobs.map((j) => [j.id, j]))
export const housingById = Object.fromEntries(housing.map((h) => [h.id, h]))
