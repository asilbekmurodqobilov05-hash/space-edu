// Script to generate uz.json and ru.json from existing translations.ts
// Run: node src/locales/generate_locales.cjs

const fs = require('fs');
const path = require('path');

// Read the existing translations file
const tsContent = fs.readFileSync(path.join(__dirname, '..', 'i18n', 'translations.ts'), 'utf8');

// Extract the object using a simple approach - eval the TS as JS
// Remove export and type annotations
let jsContent = tsContent
  .replace('export const translations = ', 'const translations = ')
  .replace(/export type.*$/m, '');

// Evaluate to get the object
const translations = eval(`(() => { ${jsContent}; return translations; })()`);

// New alumni sections for UZB
const uzAlumni = {
  auth: {
    login: "Kirish",
    signup: "Ro'yxatdan o'tish",
    forgotPassword: "Parolni unutdingizmi?",
    email: "Elektron pochta manzili",
    password: "Parol",
    confirmPassword: "Parolni tasdiqlang",
    rememberMe: "Meni eslab qoling",
    orContinueWith: "Yoki davom eting",
    noAccount: "Hisobingiz yo'qmi?",
    haveAccount: "Hisobingiz bormi?",
    resetPassword: "Parolni tiklash",
    backToLogin: "Kirishga qaytish",
    loginSuccess: "Muvaffaqiyatli kirildi",
    signupSuccess: "Hisob muvaffaqiyatli yaratildi",
    logOut: "Chiqish",
    welcomeBack: "Qaytganingiz bilan",
    createAccount: "Hisobingizni yarating",
    enterCredentials: "Bitiruvchilar portaliga kirish uchun ma'lumotlaringizni kiriting",
    joinCommunity: "Bugun bitiruvchilar hamjamiyatiga qo'shiling"
  },
  profile: {
    editProfile: "Profilni tahrirlash",
    graduationYear: "Bitirgan yili",
    faculty: "Fakultet",
    contactInfo: "Aloqa ma'lumotlari",
    fullName: "To'liq ism",
    bio: "Biografiya",
    phone: "Telefon raqami",
    address: "Manzil",
    degree: "Daraja",
    major: "Mutaxassislik",
    currentPosition: "Joriy lavozim",
    company: "Tashkilot / Kompaniya",
    linkedIn: "LinkedIn profili",
    saveChanges: "O'zgarishlarni saqlash",
    cancelEdit: "Bekor qilish",
    profileUpdated: "Profil muvaffaqiyatli yangilandi",
    uploadPhoto: "Rasm yuklash",
    memberSince: "A'zo bo'lgan sana",
    personalInfo: "Shaxsiy ma'lumotlar",
    academicInfo: "Akademik ma'lumotlar",
    professionalInfo: "Kasbiy ma'lumotlar",
    socialLinks: "Ijtimoiy tarmoqlar",
    changePassword: "Parolni o'zgartirish",
    deleteAccount: "Hisobni o'chirish",
    accountSettings: "Hisob sozlamalari"
  },
  members: {
    title: "Bitiruvchilar katalogi",
    subtitle: "Turli fakultet va avlod bitiruvchilari bilan bog'laning.",
    searchPlaceholder: "Bitiruvchilarni ism, fakultet yoki yil bo'yicha qidiring...",
    filterByYear: "Bitirgan yili bo'yicha filtrlash",
    filterByFaculty: "Fakultet bo'yicha filtrlash",
    filterByDegree: "Daraja bo'yicha filtrlash",
    sortBy: "Saralash",
    sortName: "Ism (A–Z)",
    sortYear: "Bitirgan yili",
    sortRecent: "Yaqinda qo'shilgan",
    noResults: "Mezonlaringizga mos bitiruvchi topilmadi",
    clearFilters: "Filtrlarni tozalash",
    totalMembers: "Jami a'zolar",
    viewProfile: "Profilni ko'rish",
    sendMessage: "Xabar yuborish",
    connect: "Bog'lanish",
    allFaculties: "Barcha fakultetlar",
    allYears: "Barcha yillar",
    allDegrees: "Barcha darajalar",
    bachelor: "Bakalavr",
    master: "Magistr",
    doctorate: "Doktorantura / PhD",
    showMore: "Ko'proq ko'rsatish",
    showLess: "Kamroq ko'rsatish",
    connectedStatus: "Bog'langan",
    pendingStatus: "Kutilmoqda"
  },
  events: {
    title: "Tadbirlar",
    upcomingEvents: "Kelgusi tadbirlar",
    pastEvents: "O'tgan tadbirlar",
    registerEvent: "Ro'yxatdan o'tish",
    eventDetails: "Tadbir tafsilotlari",
    date: "Sana",
    time: "Vaqt",
    location: "Manzil",
    organizer: "Tashkilotchi",
    attendees: "Ishtirokchilar",
    online: "Onlayn",
    inPerson: "Yuzma-yuz",
    freeEntry: "Bepul kirish",
    registered: "Ro'yxatdan o'tilgan",
    spotsLeft: "joy qoldi",
    eventFull: "Tadbir to'ldi",
    cancelRegistration: "Ro'yxatdan chiqish",
    shareEvent: "Tadbirni ulashish",
    addToCalendar: "Taqvimga qo'shish"
  },
  about: {
    aboutUs: "Biz haqimizda",
    ourMission: "Bizning vazifamiz",
    ourTeam: "Bizning jamoamiz",
    contactUs: "Biz bilan bog'lanish",
    faq: "Ko'p beriladigan savollar",
    missionStatement: "Bitiruvchilarni birlashtirish, kelajakni qurish. Biz kasbiy o'sish, bilim almashish va umrbod hamjamiyatni rivojlantirish uchun bitiruvchilarni birlashtiramiz.",
    foundedIn: "Tashkil etilgan yil",
    joinNetwork: "Tarmoqqa qo'shiling",
    privacyPolicy: "Maxfiylik siyosati",
    termsOfService: "Foydalanish shartlari"
  },
  common: {
    loading: "Yuklanmoqda...",
    error: "Xatolik yuz berdi",
    retry: "Qayta urinish",
    save: "Saqlash",
    cancel: "Bekor qilish",
    delete: "O'chirish",
    edit: "Tahrirlash",
    back: "Orqaga",
    next: "Keyingi",
    previous: "Oldingi",
    submit: "Yuborish",
    confirm: "Tasdiqlash",
    yes: "Ha",
    no: "Yo'q",
    search: "Qidirish",
    noData: "Ma'lumot mavjud emas",
    seeAll: "Barchasini ko'rish",
    readMore: "Batafsil o'qish",
    share: "Ulashish",
    download: "Yuklab olish"
  }
};

// New alumni sections for RUS
const ruAlumni = {
  auth: {
    login: "Войти",
    signup: "Регистрация",
    forgotPassword: "Забыли пароль?",
    email: "Электронная почта",
    password: "Пароль",
    confirmPassword: "Подтвердите пароль",
    rememberMe: "Запомнить меня",
    orContinueWith: "Или продолжить с",
    noAccount: "Нет аккаунта?",
    haveAccount: "Уже есть аккаунт?",
    resetPassword: "Сбросить пароль",
    backToLogin: "Вернуться к входу",
    loginSuccess: "Успешный вход",
    signupSuccess: "Аккаунт успешно создан",
    logOut: "Выйти",
    welcomeBack: "С возвращением",
    createAccount: "Создайте аккаунт",
    enterCredentials: "Введите данные для входа в портал выпускников",
    joinCommunity: "Присоединяйтесь к сообществу выпускников сегодня"
  },
  profile: {
    editProfile: "Редактировать профиль",
    graduationYear: "Год выпуска",
    faculty: "Факультет",
    contactInfo: "Контактная информация",
    fullName: "Полное имя",
    bio: "Биография",
    phone: "Номер телефона",
    address: "Адрес",
    degree: "Степень",
    major: "Специальность",
    currentPosition: "Текущая должность",
    company: "Организация / Компания",
    linkedIn: "Профиль LinkedIn",
    saveChanges: "Сохранить изменения",
    cancelEdit: "Отмена",
    profileUpdated: "Профиль успешно обновлён",
    uploadPhoto: "Загрузить фото",
    memberSince: "Участник с",
    personalInfo: "Личная информация",
    academicInfo: "Академическая информация",
    professionalInfo: "Профессиональная информация",
    socialLinks: "Социальные сети",
    changePassword: "Изменить пароль",
    deleteAccount: "Удалить аккаунт",
    accountSettings: "Настройки аккаунта"
  },
  members: {
    title: "Каталог выпускников",
    subtitle: "Общайтесь с выпускниками разных факультетов и поколений.",
    searchPlaceholder: "Поиск выпускников по имени, факультету или году...",
    filterByYear: "Фильтр по году выпуска",
    filterByFaculty: "Фильтр по факультету",
    filterByDegree: "Фильтр по степени",
    sortBy: "Сортировка",
    sortName: "Имя (А–Я)",
    sortYear: "Год выпуска",
    sortRecent: "Недавно присоединившиеся",
    noResults: "Выпускники по вашим критериям не найдены",
    clearFilters: "Сбросить фильтры",
    totalMembers: "Всего участников",
    viewProfile: "Просмотреть профиль",
    sendMessage: "Отправить сообщение",
    connect: "Связаться",
    allFaculties: "Все факультеты",
    allYears: "Все годы",
    allDegrees: "Все степени",
    bachelor: "Бакалавр",
    master: "Магистр",
    doctorate: "Докторантура / PhD",
    showMore: "Показать ещё",
    showLess: "Показать меньше",
    connectedStatus: "Связаны",
    pendingStatus: "Ожидание"
  },
  events: {
    title: "Мероприятия",
    upcomingEvents: "Предстоящие мероприятия",
    pastEvents: "Прошедшие мероприятия",
    registerEvent: "Зарегистрироваться",
    eventDetails: "Детали мероприятия",
    date: "Дата",
    time: "Время",
    location: "Место",
    organizer: "Организатор",
    attendees: "Участники",
    online: "Онлайн",
    inPerson: "Очно",
    freeEntry: "Бесплатный вход",
    registered: "Зарегистрирован",
    spotsLeft: "мест осталось",
    eventFull: "Мест нет",
    cancelRegistration: "Отменить регистрацию",
    shareEvent: "Поделиться мероприятием",
    addToCalendar: "Добавить в календарь"
  },
  about: {
    aboutUs: "О нас",
    ourMission: "Наша миссия",
    ourTeam: "Наша команда",
    contactUs: "Связаться с нами",
    faq: "Часто задаваемые вопросы",
    missionStatement: "Объединяя выпускников, строя будущее. Мы объединяем выпускников для профессионального роста, обмена знаниями и создания сообщества на всю жизнь.",
    foundedIn: "Основано в",
    joinNetwork: "Присоединиться к сети",
    privacyPolicy: "Политика конфиденциальности",
    termsOfService: "Условия использования"
  },
  common: {
    loading: "Загрузка...",
    error: "Произошла ошибка",
    retry: "Повторить",
    save: "Сохранить",
    cancel: "Отмена",
    delete: "Удалить",
    edit: "Редактировать",
    back: "Назад",
    next: "Далее",
    previous: "Назад",
    submit: "Отправить",
    confirm: "Подтвердить",
    yes: "Да",
    no: "Нет",
    search: "Поиск",
    noData: "Данные отсутствуют",
    seeAll: "Смотреть все",
    readMore: "Читать далее",
    share: "Поделиться",
    download: "Скачать"
  }
};

// New alumni sections for ENG  
const enAlumni = {
  auth: {
    login: "Log In",
    signup: "Sign Up",
    forgotPassword: "Forgot Password",
    email: "Email Address",
    password: "Password",
    confirmPassword: "Confirm Password",
    rememberMe: "Remember Me",
    orContinueWith: "Or continue with",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    resetPassword: "Reset Password",
    backToLogin: "Back to Login",
    loginSuccess: "Successfully logged in",
    signupSuccess: "Account created successfully",
    logOut: "Log Out",
    welcomeBack: "Welcome Back",
    createAccount: "Create Your Account",
    enterCredentials: "Enter your credentials to access your alumni portal",
    joinCommunity: "Join our alumni community today"
  },
  profile: {
    editProfile: "Edit Profile",
    graduationYear: "Graduation Year",
    faculty: "Faculty",
    contactInfo: "Contact Information",
    fullName: "Full Name",
    bio: "Bio",
    phone: "Phone Number",
    address: "Address",
    degree: "Degree",
    major: "Major / Specialization",
    currentPosition: "Current Position",
    company: "Company / Organization",
    linkedIn: "LinkedIn Profile",
    saveChanges: "Save Changes",
    cancelEdit: "Cancel",
    profileUpdated: "Profile updated successfully",
    uploadPhoto: "Upload Photo",
    memberSince: "Member Since",
    personalInfo: "Personal Information",
    academicInfo: "Academic Information",
    professionalInfo: "Professional Information",
    socialLinks: "Social Links",
    changePassword: "Change Password",
    deleteAccount: "Delete Account",
    accountSettings: "Account Settings"
  },
  members: {
    title: "Alumni Directory",
    subtitle: "Connect with fellow graduates from across faculties and generations.",
    searchPlaceholder: "Search alumni by name, faculty, or year...",
    filterByYear: "Filter by Graduation Year",
    filterByFaculty: "Filter by Faculty",
    filterByDegree: "Filter by Degree",
    sortBy: "Sort By",
    sortName: "Name (A–Z)",
    sortYear: "Graduation Year",
    sortRecent: "Recently Joined",
    noResults: "No alumni found matching your criteria",
    clearFilters: "Clear Filters",
    totalMembers: "Total Members",
    viewProfile: "View Profile",
    sendMessage: "Send Message",
    connect: "Connect",
    allFaculties: "All Faculties",
    allYears: "All Years",
    allDegrees: "All Degrees",
    bachelor: "Bachelor's",
    master: "Master's",
    doctorate: "Doctorate / PhD",
    showMore: "Show More",
    showLess: "Show Less",
    connectedStatus: "Connected",
    pendingStatus: "Pending"
  },
  events: {
    title: "Events",
    upcomingEvents: "Upcoming Events",
    pastEvents: "Past Events",
    registerEvent: "Register",
    eventDetails: "Event Details",
    date: "Date",
    time: "Time",
    location: "Location",
    organizer: "Organizer",
    attendees: "Attendees",
    online: "Online",
    inPerson: "In-Person",
    freeEntry: "Free Entry",
    registered: "Registered",
    spotsLeft: "spots left",
    eventFull: "Event Full",
    cancelRegistration: "Cancel Registration",
    shareEvent: "Share Event",
    addToCalendar: "Add to Calendar"
  },
  about: {
    aboutUs: "About Us",
    ourMission: "Our Mission",
    ourTeam: "Our Team",
    contactUs: "Contact Us",
    faq: "Frequently Asked Questions",
    missionStatement: "Connecting alumni, building futures. We unite graduates to foster professional growth, knowledge exchange, and lifelong community.",
    foundedIn: "Founded in",
    joinNetwork: "Join Our Network",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service"
  },
  common: {
    loading: "Loading...",
    error: "An error occurred",
    retry: "Retry",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    back: "Back",
    next: "Next",
    previous: "Previous",
    submit: "Submit",
    confirm: "Confirm",
    yes: "Yes",
    no: "No",
    search: "Search",
    noData: "No data available",
    seeAll: "See All",
    readMore: "Read More",
    share: "Share",
    download: "Download"
  }
};

// Add new nav keys to existing translations
const navExtras = {
  ENG: { members: "Members", news: "News", events: "Events", about: "About Us" },
  UZB: { members: "A'zolar", news: "Yangiliklar", events: "Tadbirlar", about: "Biz haqimizda" },
  RUS: { members: "Участники", news: "Новости", events: "Мероприятия", about: "О нас" }
};

// Build final objects
const en = { ...translations.ENG, ...enAlumni };
en.nav = { ...en.nav, ...navExtras.ENG };

const uz = { ...translations.UZB, ...uzAlumni };
uz.nav = { ...uz.nav, ...navExtras.UZB };

const ru = { ...translations.RUS, ...ruAlumni };
ru.nav = { ...ru.nav, ...navExtras.RUS };

// Write JSON files
const localesDir = __dirname;

// Overwrite en.json (already created but may be incomplete)
fs.writeFileSync(path.join(localesDir, 'en.json'), JSON.stringify(en, null, 2), 'utf8');
fs.writeFileSync(path.join(localesDir, 'uz.json'), JSON.stringify(uz, null, 2), 'utf8');
fs.writeFileSync(path.join(localesDir, 'ru.json'), JSON.stringify(ru, null, 2), 'utf8');

console.log('✅ Generated en.json (' + Object.keys(en).length + ' sections)');
console.log('✅ Generated uz.json (' + Object.keys(uz).length + ' sections)');
console.log('✅ Generated ru.json (' + Object.keys(ru).length + ' sections)');
console.log('Sections:', Object.keys(en).join(', '));
