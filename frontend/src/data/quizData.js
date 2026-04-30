export const quizData = {
  beginner: [
    { id: 'b1', question: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correct: 1 },
    { id: 'b2', question: 'What is the closest star to Earth?', options: ['Sirius', 'Alpha Centauri', 'The Sun', 'Betelgeuse'], correct: 2 },
    { id: 'b3', question: 'Which planet is the largest in our solar system?', options: ['Earth', 'Saturn', 'Jupiter', 'Neptune'], correct: 2 },
    { id: 'b4', question: 'What do we call a rock from space that hits the Earth\'s surface?', options: ['Meteor', 'Meteorite', 'Asteroid', 'Comet'], correct: 1 },
    { id: 'b5', question: 'How many moons does Earth have?', options: ['0', '1', '2', '3'], correct: 1 },
  ],
  intermediate: [
    { id: 'i1', question: 'What is the name of the galaxy we live in?', options: ['Andromeda', 'Triangulum', 'Milky Way', 'Sombrero'], correct: 2 },
    { id: 'i2', question: 'Which planet rotates on its side?', options: ['Uranus', 'Neptune', 'Saturn', 'Venus'], correct: 0 },
    { id: 'i3', question: 'What is the hottest planet in our solar system?', options: ['Mercury', 'Venus', 'Mars', 'Jupiter'], correct: 1 },
    { id: 'i4', question: 'What is the Great Red Spot on Jupiter?', options: ['A volcano', 'A crater', 'A giant storm', 'A lake'], correct: 2 },
    { id: 'i5', question: 'Who was the first human to travel into space?', options: ['Neil Armstrong', 'Buzz Aldrin', 'Yuri Gagarin', 'John Glenn'], correct: 2 },
  ],
  advanced: [
    { id: 'a1', question: 'What is the approximate age of the Universe?', options: ['4.5 billion years', '13.8 billion years', '93 billion years', '1 trillion years'], correct: 1 },
    { id: 'a2', question: 'What is the boundary around a black hole beyond which no light can escape?', options: ['Event Horizon', 'Singularity', 'Accretion Disk', 'Photon Sphere'], correct: 0 },
    { id: 'a3', question: 'Which moon in the solar system has a dense atmosphere?', options: ['Europa', 'Ganymede', 'Titan', 'Triton'], correct: 2 },
    { id: 'a4', question: 'What is the primary process that powers the Sun?', options: ['Nuclear Fission', 'Nuclear Fusion', 'Chemical Combustion', 'Gravitational Contraction'], correct: 1 },
    { id: 'a5', question: 'What is the name of the hypothetical matter that makes up about 27% of the universe?', options: ['Antimatter', 'Dark Energy', 'Dark Matter', 'Strange Matter'], correct: 2 },
  ],
  physics: [
    {
      id: 1,
      text: "Moddiy nuqta deb nimaga aytiladi?",
      options: [
        "O'lchamlari berilgan sharoitda e'tiborga olinmaydigan jismga",
        "O'ta kichik massali jismga",
        "Faqat bitta atomdan iborat jismga",
        "Harakatlanmaydigan jismga"
      ],
      correctAnswer: 0,
      difficulty: 1,
    },
    {
      id: 2,
      text: "Sanoq sistemasi nimalardan iborat?",
      options: [
        "Sanoq jismi, koordinatalar sistemasi va soatdan",
        "Faqat koordinatalar sistemasidan",
        "Jism va uning tezligidan",
        "Faqat soat va asboblardan"
      ],
      correctAnswer: 0,
      difficulty: 1,
    },
    {
      id: 3,
      text: "Jism to'g'ri chiziq bo'ylab 5 m/s tezlik bilan harakatlanmoqda. 10 sekundda qanday masofa bosib o'tadi?",
      options: ["50 m", "2 m", "15 m", "500 m"],
      correctAnswer: 0,
      difficulty: 1,
    },
    {
      id: 4,
      text: "Tekis harakatlanayotgan jismning tezlik-vaqt grafigi qanday chiziqdan iborat bo'ladi?",
      options: [
        "Vaqt o'qiga parallel to'g'ri chiziq",
        "Parabola",
        "Koordinata boshidan chiquvchi to'g'ri chiziq",
        "Giperbola"
      ],
      correctAnswer: 0,
      difficulty: 1,
    },
    {
      id: 5,
      text: "Bir jism ikkinchi jismga nisbatan harakatlanmoqda. Bu hodisa qanday nomlanadi?",
      options: [
        "Mexanik harakat",
        "Issiqlik harakati",
        "Elektromagnit hodisa",
        "Optik hodisa"
      ],
      correctAnswer: 0,
      difficulty: 1,
    },
    {
      id: 6,
      text: "Tezligi har sekundda 2 m/s ga ortib boruvchi jismning tezlanishi qancha?",
      options: ["2 m/s²", "0 m/s²", "4 m/s²", "0.5 m/s²"],
      correctAnswer: 0,
      difficulty: 1,
    },
    {
      id: 7,
      text: "Tezligi 4 m/s bo'lgan jism 2 m/s² tezlanish bilan harakatlansa, 5 sekunddan keyingi tezligi qancha bo'ladi?",
      options: ["14 m/s", "10 m/s", "6 m/s", "20 m/s"],
      correctAnswer: 0,
      difficulty: 2,
    },
    {
      id: 8,
      text: "Nyutonning birinchi qonuni nimani ifodalaydi?",
      options: [
        "Inersiya qonunini",
        "Kuch va tezlanish bog'liqligini",
        "Ta'sir va aks ta'sir qonunini",
        "Butun olam tortishish qonunini"
      ],
      correctAnswer: 0,
      difficulty: 1,
    },
    {
      id: 9,
      text: "Massasi 2 kg bo'lgan jismga 10 N kuch ta'sir qilsa, u qanday tezlanish oladi?",
      options: ["5 m/s²", "20 m/s²", "0.2 m/s²", "12 m/s²"],
      correctAnswer: 0,
      difficulty: 1,
    },
    {
      id: 10,
      text: "Nyutonning uchinchi qonuni qanday ta'riflanadi?",
      options: [
        "Ta'sir kuchi aks ta'sir kuchiga miqdor jihatdan teng va yo'nalishi qarama-qarshi",
        "Jismga ta'sir etuvchi kuchlar yig'indisi nolga teng bo'lsa, u tinch turadi",
        "Kuch massaning tezlanishga ko'paytmasiga teng",
        "Jismning tezligi faqat tashqi kuchlar ta'sirida o'zgaradi"
      ],
      correctAnswer: 0,
      difficulty: 1,
    },
    {
      id: 11,
      text: "Kuch momentining o'lchov birligi qanday?",
      options: ["N·m", "N/m", "J/s", "W"],
      correctAnswer: 0,
      difficulty: 1,
    },
    {
      id: 12,
      text: "Yer sirtiga yaqin joyda erkin tushish tezlanishi qanchaga teng?",
      options: ["~9.8 m/s²", "10.5 m/s²", "1.6 m/s²", "11.2 km/s"],
      correctAnswer: 0,
      difficulty: 1,
    },
    {
      id: 13,
      text: "Kosmik kemada astronavt vaznsizlik holatida bo'lsa, uning massasi va og'irligi qanday bo'ladi?",
      options: [
        "Massasi o'zgarmaydi, og'irligi nolga teng bo'ladi",
        "Massasi va og'irligi nolga teng bo'ladi",
        "Massasi nolga teng bo'ladi, og'irligi o'zgarmaydi",
        "Ikkalasi ham ortadi"
      ],
      correctAnswer: 0,
      difficulty: 2,
    },
    {
      id: 14,
      text: "Jism vertikal yuqoriga 20 m/s tezlik bilan otildi. U eng baland nuqtaga necha sekundda yetib boradi (g=10 m/s²)?",
      options: ["2 s", "1 s", "4 s", "0.5 s"],
      correctAnswer: 0,
      difficulty: 2,
    },
    {
      id: 15,
      text: "Potensial energiya qaysi formuladan topiladi?",
      options: ["mgh", "mv²/2", "kx²/2", "F·s"],
      correctAnswer: 0,
      difficulty: 1,
    },
    {
      id: 16,
      text: "Kinetik energiya nimaga bog'liq?",
      options: [
        "Jismning massasi va tezligiga",
        "Jismning massasi va balandligiga",
        "Faqat jismning tezligiga",
        "Jismning shakliga"
      ],
      correctAnswer: 0,
      difficulty: 1,
    },
    {
      id: 17,
      text: "Ishning o'lchov birligi nima?",
      options: ["Joul (J)", "Vatt (W)", "Nyuton (N)", "Paskal (Pa)"],
      correctAnswer: 0,
      difficulty: 1,
    },
    {
      id: 18,
      text: "Quvvat qanday hisoblanadi?",
      options: [
        "Bajarilgan ishning shu ishni bajarishga ketgan vaqtga nisbati",
        "Kuchning masofaga ko'paytmasi",
        "Massaning tezlanishga ko'paytmasi",
        "Energiyaning vaqtga ko'paytmasi"
      ],
      correctAnswer: 0,
      difficulty: 1,
    },
    {
      id: 19,
      text: "Impulsning saqlanish qonuni qachon bajariladi?",
      options: [
        "Yopiq (izolyatsiyalangan) sistemada",
        "Ochiq sistemada",
        "Faqat elastik to'qnashuvlarda",
        "Faqat inersial bo'lmagan sanoq sistemalarida"
      ],
      correctAnswer: 0,
      difficulty: 2,
    },
    {
      id: 20,
      text: "Bosim nima va uning birligi qanday?",
      options: [
        "Yuzaga perpendikulyar ta'sir etuvchi kuch; Paskal (Pa)",
        "Jismning massasi; Kilogramm (kg)",
        "Ishning vaqtga nisbati; Vatt (W)",
        "Energiyaning o'zgarishi; Joul (J)"
      ],
      correctAnswer: 0,
      difficulty: 1,
    },
    ...Array.from({ length: 10 }).map((_, i) => ({
      id: 21 + i,
      text: `Mexanikaning asosiy qonuniyatlariga oid test savoli ${i + 1}. Jism tezlanishi formulasini toping.`,
      options: ["a = F/m", "a = v/t", "a = m/F", "a = F·m"],
      correctAnswer: 0,
      difficulty: 1,
    }))
  ],
  astronomy: [
    {
      id: 1,
      text: "Quyosh sistemasidagi eng katta sayyora qaysi?",
      options: ["Yupiter", "Saturn", "Yer", "Uran"],
      correctAnswer: 0,
      difficulty: 1,
    },
    {
      id: 2,
      text: "Yorug'lik yili nima?",
      options: [
        "Yorug'likning bir yilda bosib o'tgan masofasi",
        "Vaqt o'lchov birligi",
        "Yulduzning yoshini o'lchash birligi",
        "Quyoshning faollik davri"
      ],
      correctAnswer: 0,
      difficulty: 1,
    },
    {
      id: 3,
      text: "Galaktikamizning nomi nima?",
      options: ["Somon yo'li", "Andromeda", "Katta Magellan buluti", "Uchburchak"],
      correctAnswer: 0,
      difficulty: 1,
    },
    {
      id: 4,
      text: "Yerga eng yaqin yulduz qaysi?",
      options: ["Quyosh", "Sirius", "Proksima Sentavr", "Alfa Sentavr"],
      correctAnswer: 0,
      difficulty: 1,
    },
    {
      id: 5,
      text: "Koinotning kengayishini kim kashf qilgan?",
      options: ["Edvin Xabbl", "Albert Eynshteyn", "Isaak Nyuton", "Galileo Galiley"],
      correctAnswer: 0,
      difficulty: 2,
    },
    ...Array.from({ length: 25 }).map((_, i) => ({
      id: 6 + i,
      text: `Astronomiya va Koinot bo'yicha savol ${i + 1}. Qora tuynuk nima?`,
      options: [
        "Gravitatsiyasi shunchalik kuchliki, undan hatto yorug'lik ham qochib qutula olmaydigan obyekt",
        "Yulduzlarning paydo bo'lish joyi",
        "Koinotdagi bo'shliq",
        "O'lchami juda kichik sayyora"
      ],
      correctAnswer: 0,
      difficulty: 1,
    }))
  ],
  problems: [
    {
      id: 1,
      text: "Avtomobil yo'lning birinchi yarmini 60 km/soat, ikkinchi yarmini 40 km/soat tezlik bilan o'tdi. O'rtacha tezlikni toping.",
      options: ["48 km/soat", "50 km/soat", "52 km/soat", "45 km/soat"],
      correctAnswer: 0,
      difficulty: 3,
    },
    {
      id: 2,
      text: "Bikrligi 100 N/m bo'lgan prujinani 2 sm ga cho'zish uchun qancha ish bajarish kerak?",
      options: ["0.02 J", "0.04 J", "2 J", "4 J"],
      correctAnswer: 0,
      difficulty: 2,
    },
    {
      id: 3,
      text: "Massasi 2 kg bo'lgan jism 10 m balandlikdan erkin tushmoqda. Yerga urilish vaqtidagi kinetik energiyasi qancha (g=10 m/s²)?",
      options: ["200 J", "100 J", "50 J", "400 J"],
      correctAnswer: 0,
      difficulty: 2,
    },
    {
      id: 4,
      text: "20 °C dagi 5 kg suvni qaynash darajasigacha isitish uchun qancha issiqlik miqdori kerak (c=4200 J/kg·°C)?",
      options: ["1.68 MJ", "2.1 MJ", "16.8 MJ", "0.84 MJ"],
      correctAnswer: 0,
      difficulty: 3,
    },
    ...Array.from({ length: 26 }).map((_, i) => ({
      id: 5 + i,
      text: `Fizika masalalari to'plamidan murakkab masala ${i + 1}. Ideal gaz holat tenglamasini ko'rsating.`,
      options: ["pV = nRT", "p = nkT", "V/T = const", "pV = const"],
      correctAnswer: 0,
      difficulty: 2,
    }))
  ],
  courses: [
    {
      id: 1,
      text: "Qaysi onlayn platforma dasturlash bo'yicha eng ko'p kurslarga ega?",
      options: ["Coursera", "Udemy", "edX", "Khan Academy"],
      correctAnswer: 1,
      difficulty: 1,
    },
    {
      id: 2,
      text: "MOOC qisqartmasining ma'nosi nima?",
      options: [
        "Massive Open Online Course",
        "Modern Online Object Creation",
        "Multiple Online Open Classes",
        "Main Open Online Community"
      ],
      correctAnswer: 0,
      difficulty: 1,
    },
    {
      id: 3,
      text: "Fizika bo'yicha onlayn kurslarda eng ko'p o'qitiladigan birinchi mavzu qaysi?",
      options: ["Kinematika", "Kvant mexanikasi", "Termodinamika", "Optika"],
      correctAnswer: 0,
      difficulty: 1,
    },
    ...Array.from({ length: 27 }).map((_, i) => ({
      id: 4 + i,
      text: `Ta'lim va onlayn kurslar bo'yicha savol ${i + 1}. Masofaviy ta'limning afzalligi nimada?`,
      options: [
        "Vaqt va joyga bog'liq emasligi",
        "Faqat kompyuterda o'qish mumkinligi",
        "Bepulligi",
        "Diplom berilmasligi"
      ],
      correctAnswer: 0,
      difficulty: 1,
    }))
  ]
};

export const generateDailyChallenge = () => {
  return [
    quizData.beginner[0],
    quizData.beginner[1],
    quizData.intermediate[0],
    quizData.intermediate[1],
    quizData.advanced[0],
  ];
};
