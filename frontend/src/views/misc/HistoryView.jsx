import { AnimatePresence, motion } from 'motion/react';
import { Landmark, PlayCircle, X } from 'lucide-react';
import { useState } from 'react';

const ERA_DATA = [
  {
    id: 'era-1',
    title: "Qadimgi davr astronomiyasi",
    period: "Mil. avv. 3000 - 100",
    summary:
      "Misr, Bobil, Amerika va Yunon olimlari taqvim, tutilish hisobi va ilk kosmik g'oyalar uchun poydevor qo'yishgan.",
    details:
      "Mil. avv. 3000-2000 | Qadimgi Misr: yulduzlar kuzatilib, ilk 365 kunlik taqvim yaratildi. Quyosh soatlari (obelisklar) bilan vaqt va masofa o'lchash rivojlandi.\n\nMil. avv. 1000-500 | Bobil sivilizatsiyasi: sayyoralar xaritasi tuzildi, 12 ta zodiak burji shakllandi. Oy va Quyosh tutilishlarini oldindan aytish yo'lga qo'yildi.\n\nMil. avv. 500-200 | Qadimgi Amerika xalqlari: Mayya va Ink ajdodlari Quyosh hamda Venera harakatini aniq hisoblab, tosh rasadxonalar qurdilar.\n\nMil. avv. 300-100 | Qadimgi Yunoniston: Yer aylanasi deyarli aniq hisoblandi va geliosentrik g'oyaning dastlabki shakllari paydo bo'ldi.",
    media: [
      { type: 'image', src: '/history-step1/ancient-obelisk.png', alt: 'Qadimgi Misrdagi obelisk va o‘lchov sahnasi' },
      { type: 'image', src: '/history-step1/misr-olchovlari.png', alt: 'Qadimgi Misr o‘lchovlari' },
      { type: 'image', src: '/history-step1/bobil-ink-rasadxona.png', alt: 'Bobil va Ink rasadxona tasviri' },
      { type: 'image', src: '/history-step1/yunon-geosentrik.png', alt: 'Qadimgi Yunoniston geosentrik model tasviri' },
    ],
  },
  {
    id: 'era-2',
    title: "Ilmiy inqilob va Teleskop",
    period: "XVI - XVIII asrlar",
    summary:
      "Kopernikdan Nyutongacha bo'lgan olimlar teleskop va fizika qonunlari orqali zamonaviy astronomiyaga asos soldilar.",
    details:
      "1500-yillar | Nikolay Kopernik: Koinotning markazida Yer emas, Quyosh turadi degan inqilobiy geliosentrik tizimni ishlab chiqdi.\n\n1608-yil | Hans Lippershey: Gollandiyalik usta uzoqdagi jismlarni yaqinlashtirib ko'rsatuvchi tarixiy birinchi teleskopni ixtiro qildi.\n\n1609-yil | Galileo Galiley: Teleskopni koinotga qaratgan ilk olim. U Oy kraterlari va Yupiterning 4 ta yo'ldoshini kashf etib, Kopernik g'oyalarini tasdiqladi.\n\n1611-yil | Iogann Kepler: Sayyoralar harakatining asosiy qonunlarini kashf etdi va koinotni kuzatish uchun ancha aniq bo'lgan astronomik teleskopni yaratdi.\n\nXVIII asr | Isaak Nyuton: Butun olam tortishish qonuni orqali sayyoralar nima uchun ma'lum bir orbitada harakatlanishini fizik jihatdan isbotlab berdi.",
    media: [
      { type: 'image', src: '/history-step1/hans-lipperhey.png', alt: 'Hans Lipperhey portreti' },
      { type: 'image', src: '/history-step1/telescope-1608.png', alt: '1608-yildagi ilk teleskop ko‘rinishi' },
      { type: 'image', src: '/history-step1/moon-sketches-bw.png', alt: 'Oy fazalari va kraterlarining tarixiy chizmasi' },
      { type: 'image', src: '/history-step1/galileo-notes-moon.png', alt: 'Galileyning Oy kuzatuvlari sahifasi' },
      { type: 'video', title: 'Scientific revolution explainer' },
    ],
  },
  {
    id: 'era-3',
    title: "Koinot poygasi va Ilk qadamlar",
    period: "1950-1960 yillar",
    summary:
      "Sputnikdan Apollon-11gacha bo'lgan davrda insoniyat koinotga chiqib, Oyga ilk qadamni qo'ydi.",
    details:
      "1957-yil | \"Sputnik-1\" va Layka: Insoniyat tarixidagi ilk sun'iy yo'ldosh orbitaga chiqarildi. Ko'p o'tmay, \"Sputnik-2\" kemasida Layka ismli it koinotga uchgan birinchi tirik mavjudotga aylandi.\n\n1959-yil | \"Luna-2\": Boshqa osmon jismi (Oy) yuzasiga yetib borgan tarixdagi birinchi kosmik apparat bo'ldi.\n\n1961-yil 12-aprel | Yuriy Gagarin: \"Vostok-1\" kemasida koinotga uchgan ilk inson. Bu butun insoniyat uchun ulkan tarixiy qadam edi.\n\n1963 va 1965-yillar | Yangi rekordlar: Valentina Tereshkova koinotga chiqqan ilk ayolga aylandi. Aleksey Leonov esa tarixda birinchi marta kema bortidan tashqariga - ochiq koinotga chiqdi (12 daqiqa).\n\n1969-yil 20-iyul | \"Apollon-11\": Neil Armstrong va Buzz Aldrin Oy yuzasiga ilk bor qadam qo'yishdi. Armstrong o'zining mashhur \"Bu inson uchun kichik bir qadam, insoniyat uchun ulkan sakrash\" degan tarixiy iborasini aytdi.",
    media: [
      { type: 'image', src: '/history-step1/sputnik-1.png', alt: 'Sputnik-1 sun’iy yo‘ldoshi' },
      { type: 'image', src: '/history-step1/laika-dog.png', alt: 'Laika kosmosga uchirilgan ilk itlardan biri' },
      { type: 'image', src: '/history-step1/gagarin-flight.png', alt: 'Yuriy Gagarin parvozidan lavha' },
      { type: 'image', src: '/history-step1/luna-spacecraft.png', alt: 'Sovet Oy apparati tasviri' },
      { type: 'image', src: '/history-step1/valentina-tereshkova.png', alt: 'Valentina Tereshkova portreti' },
      { type: 'video', title: 'Moon landing footage' },
    ],
  },
  {
    id: 'era-4',
    title: "Sayyoralarni zabt etish",
    period: "XX asr oxiri",
    summary:
      "\"Voyager\" va zondlar quyosh tizimining chekkalariga yetib bordi, Xabbl teleskopi chuqur koinotni ko'rsatdi.",
    details:
      "Insoniyat koinotga shaxsan borish o'rniga aqlli robotlarni yubora boshladi. \"Venera\" va \"Mars\" seriyasidagi apparatlar qo'shni sayyoralar yuzasiga qadam qo'ydi. 1977-yilda uchirilgan \"Voyager\" apparatlari insoniyat salomi yozilgan \"Oltin plastinka\" bilan quyosh tizimidan chiqib ketdi. 1990-yilda uchirilgan Xabbl (Hubble) teleskopi esa milliardlab yorug'lik yili uzoqlikdagi galaktikalarning betakror suratlarini olib, astronomiyada yangi sahifa ochdi.",
    media: [
      { type: 'image', src: '/history-step1/apollo11-moonwalk.png', alt: 'Apollo missiyasidan Oy yuzasida astronavt' },
      { type: 'image', src: '/history-step1/venus-lander-model.png', alt: 'Venera apparatining tarixiy moduli' },
      { type: 'image', src: '/history-step1/voyager-artwork.png', alt: 'Voyager apparati kosmosda (illyustratsiya)' },
      { type: 'image', src: '/history-step1/venera-lander.png', alt: 'Venera qo‘nish apparati yuzada' },
      { type: 'image', src: '/history-step1/mars-rover-lab.png', alt: 'Mars missiyasi apparati laboratoriyada' },
      { type: 'image', src: '/history-step1/shuttle-launch.png', alt: 'Space Shuttle uchirilishi' },
      { type: 'image', src: '/history-step1/iss-orbit.png', alt: 'Xalqaro kosmik stansiya orbitada' },
      { type: 'image', src: '/history-step1/hubble-space.png', alt: 'Hubble teleskopi orbitada' },
      { type: 'image', src: '/history-step1/ariane-launch.png', alt: 'Ariane raketasi uchirilishi' },
    ],
  },
  {
    id: 'era-5',
    title: "Xalqaro hamkorlik va Tijorat koinoti",
    period: "XXI asr",
    summary:
      "Xalqaro koinot stansiyasi (XKS) ishga tushdi, SpaceX raketalarni qayta ishlatish inqilobini qildi.",
    details:
      "Davlatlar o'rtasidagi raqobat o'rnini hamkorlik egalladi. Yerdan 400 km balandlikda Xalqaro Koinot Stansiyasi yig'ilib, unda doimiy ravishda olimlar yashay boshladi. Ilk bor kometaga apparat qo'ndirildi va Qora tuynukning surati olindi. Eng muhimi, Elon Muskning \"SpaceX\" kompaniyasi raketalarni Yerga qaytarib qo'ndirish texnologiyasini yaratib, koinotga parvozlar narxini o'n barobarga arzonlashtirdi.",
    media: [
      { type: 'image', title: 'XKS stansiyasi' },
      { type: 'video', title: 'SpaceX Falcon landing' },
    ],
  },
  {
    id: 'era-6',
    title: "Yangi ufqlar va Kelajak",
    period: "2020-yillar va undan keyin",
    summary:
      "Jeyms Uebb teleskopi koinot yaralishini o'rganmoqda, insoniyat Oyga qaytishga va Marsni egallashga tayyorlanmoqda.",
    details:
      "Tarixdagi eng kuchli \"James Webb\" teleskopi koinotning ilk yulduzlarini suratga olmoqda. Hozirda insoniyat yana Oyga qaytish uchun \"Artemis\" dasturini amalga oshirmoqda: maqsad u yerda doimiy baza qurish. Shuningdek, tarixdagi eng ulkan raketa \"Starship\" sinovdan o'tkazilmoqda. Uning asosiy vazifasi - insonlarni Marsga olib borish va u yerda mustaqil insoniyat koloniyasini barpo etishdir.",
    media: [
      { type: 'image', title: 'James Webb oynalari' },
      { type: 'image', title: 'Starship raketasi' },
      { type: 'video', title: 'Mars colony concept' },
    ],
  },
];

function EraCard({ era, onOpen }) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.45 }}
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={() => onOpen(era)}
      className="relative h-[260px] w-full max-w-[520px] overflow-hidden rounded-3xl border border-cyan-300/20 bg-white/[0.04] p-6 text-left backdrop-blur-xl transition-shadow duration-300 hover:shadow-[0_0_34px_rgba(56,189,248,0.22)]"
    >
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-neon-blue/[0.09] via-violet/[0.06] to-transparent" />
      <div className="relative flex h-full flex-col">
        <div className="inline-flex w-fit rounded-full border border-neon-blue/40 bg-neon-blue/10 px-3 py-1 text-[11px] font-[800] uppercase tracking-widest text-neon-blue">
          {era.period}
        </div>
        <h2 className="mt-4 text-xl md:text-2xl font-[900] text-white">{era.title}</h2>
        <p className="mt-3 text-white/70 leading-relaxed line-clamp-3">{era.summary}</p>
        <span className="mt-auto inline-flex text-xs font-[800] uppercase tracking-wider text-violet-light/90">
          Batafsil ko'rish
        </span>
      </div>
    </motion.button>
  );
}

function TimelineRow({ era, index, onOpen }) {
  const isLeft = index % 2 === 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.4, delay: 0.04 * (index % 4) }}
      className="relative"
    >
      <div className="md:hidden pl-10">
        <span className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-white/60 bg-neon-blue shadow-[0_0_18px_rgba(56,189,248,0.85)]" />
        <EraCard era={era} onOpen={onOpen} />
      </div>

      <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-8 md:min-h-[280px]">
        <div className="flex justify-end">{isLeft ? <EraCard era={era} onOpen={onOpen} /> : <div className="w-full max-w-[520px]" />}</div>
        <span className="h-4 w-4 rounded-full border border-white/60 bg-neon-blue shadow-[0_0_18px_rgba(56,189,248,0.85)]" />
        <div className="flex justify-start">{!isLeft ? <EraCard era={era} onOpen={onOpen} /> : <div className="w-full max-w-[520px]" />}</div>
      </div>
    </motion.div>
  );
}

function MediaItem({ item, onImageOpen }) {
  if (item.type === 'image' && item.src) {
    return (
      <button
        type="button"
        onClick={() => onImageOpen({ src: item.src, alt: item.alt || item.title || 'Tarixiy rasm' })}
        className="group h-56 w-full overflow-hidden rounded-2xl border border-white/15 bg-black/20 p-1 shadow-[0_0_20px_rgba(56,189,248,0.2)] transition hover:border-cyan-300/50 md:h-64"
      >
        <img
          src={item.src}
          alt={item.alt || item.title || 'Tarixiy rasm'}
          className="h-full w-full object-contain transition duration-200 group-hover:scale-[1.01]"
          loading="lazy"
          decoding="async"
        />
      </button>
    );
  }

  if (item.type === 'video') {
    return (
      <div className="h-52 w-full rounded-2xl border border-violet/30 bg-violet/10 p-5 flex items-center gap-3 shadow-[0_0_22px_rgba(139,92,246,0.18)]">
        <PlayCircle className="h-10 w-10 text-violet-light shrink-0" />
        <div>
          <p className="font-[800] text-white/90">{item.title || 'Video blok'}</p>
          <p className="text-sm text-white/50">Video joyi (iframe uchun tayyor placeholder)</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-52 w-full rounded-2xl border border-cyan-300/20 bg-white/5 p-5 flex items-center justify-center text-center text-white/60">
      {item.title || 'Image placeholder'}
    </div>
  );
}

export default function HistoryView() {
  const [activeEra, setActiveEra] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="relative min-h-screen overflow-hidden px-4 pt-32 pb-24">
      <div
        className="fixed top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full blur-[140px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl border border-violet/20 bg-violet/10"
            style={{ boxShadow: '0 0 40px rgba(139,92,246,0.15)' }}
          >
            <Landmark className="h-10 w-10 text-violet" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-[clamp(36px,6vw,56px)] font-[900] tracking-tight text-white"
          >
            Space <span className="text-glow-purple text-violet">History</span>
          </motion.h1>
          <p className="mx-auto max-w-3xl text-lg text-white/40">
            Kartani bosing - to'liq tarixiy ma'lumot, rasm va video bloklari bilan katta oynada ko'rasiz.
          </p>
        </div>

        <div className="relative space-y-6 md:space-y-8">
          <div className="absolute top-0 bottom-0 left-2 w-1 rounded-full bg-gradient-to-b from-neon-blue/20 via-violet/60 to-neon-blue/20 shadow-[0_0_20px_rgba(56,189,248,0.45)] md:left-1/2 md:-translate-x-1/2" />
          {ERA_DATA.map((era, index) => (
            <TimelineRow key={era.id} era={era} index={index} onOpen={setActiveEra} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeEra && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm"
          >
            <button
              type="button"
              onClick={() => {
                setSelectedImage(null);
                setActiveEra(null);
              }}
              className="fixed top-4 left-4 md:top-6 md:left-8 z-10 inline-flex items-center gap-2 rounded-full border border-cyan-300/35 bg-black/50 px-4 py-2 text-sm font-[800] text-cyan-200 hover:bg-black/70"
            >
              <span>⬅ Back to History</span>
            </button>

            <motion.div
              initial={{ y: 30, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="mx-auto mt-20 h-[calc(100vh-6rem)] w-[min(1120px,94vw)] overflow-y-auto rounded-3xl border border-cyan-300/20 bg-[#070b1d]/95 p-6 md:p-8 shadow-[0_0_50px_rgba(56,189,248,0.25)]"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="mb-2 inline-flex rounded-full border border-neon-blue/40 bg-neon-blue/10 px-3 py-1 text-[11px] font-[800] uppercase tracking-widest text-neon-blue">
                    {activeEra.period}
                  </p>
                  <h2 className="text-2xl md:text-4xl font-[900] text-white">{activeEra.title}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(null);
                    setActiveEra(null);
                  }}
                  className="rounded-xl border border-white/15 bg-white/5 p-2 text-white/70 hover:text-white"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="mb-8 whitespace-pre-line text-white/75 leading-relaxed md:text-lg">{activeEra.details}</p>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {activeEra.media.map((item, idx) => (
                  <MediaItem key={`${activeEra.id}-media-${idx}`} item={item} onImageOpen={setSelectedImage} />
                ))}
              </div>
            </motion.div>

            <AnimatePresence>
              {selectedImage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-md p-4 md:p-8"
                  onClick={() => setSelectedImage(null)}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className="absolute right-4 top-4 rounded-xl border border-white/20 bg-black/40 p-2 text-white/80 hover:text-white"
                    aria-label="Close image preview"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <div className="flex h-full w-full items-center justify-center">
                    <img
                      src={selectedImage.src}
                      alt={selectedImage.alt}
                      className="max-h-[95vh] max-w-[98vw] rounded-2xl border border-white/15 bg-black/30 object-contain p-1 shadow-[0_0_30px_rgba(56,189,248,0.25)]"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
