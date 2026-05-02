import { AnimatePresence, motion } from 'motion/react';
import { Landmark, PlayCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

const ORIGINAL_ERA_DATA = [
  {
    id: 'era-1',
    title: "Ancient Astronomy",
    period: "3000 BC - 100 BC",
    summary:
      "Egyptian, Babylonian, American, and Greek scholars laid the foundation for calendars, eclipse calculations, and early cosmic ideas.",
    details:
      "3000-2000 BC | Ancient Egypt: Stars were observed, and the first 365-day calendar was created. Time and distance measurement developed with sundials (obelisks).\n\n1000-500 BC | Babylonian civilization: Planetary maps were drawn, and 12 zodiac signs were formed. Predicting lunar and solar eclipses was established.\n\n500-200 BC | Ancient American peoples: Maya and Inca ancestors accurately calculated the movements of the Sun and Venus and built stone observatories.\n\n300-100 BC | Ancient Greece: The Earth's circumference was calculated almost accurately, and the early forms of the heliocentric idea emerged.",
    media: [
      { type: 'image', src: '/history-step1/ancient-obelisk.png', alt: 'Ancient Egyptian obelisk and measurement scene' },
      { type: 'image', src: '/history-step1/misr-olchovlari.png', alt: 'Ancient Egyptian measurements' },
      { type: 'image', src: '/history-step1/bobil-ink-rasadxona.png', alt: 'Babylonian and Inca observatory illustration' },
      { type: 'image', src: '/history-step1/yunon-geosentrik.png', alt: 'Ancient Greek geocentric model illustration' },
    ],
  },
  {
    id: 'era-2',
    title: "Scientific Revolution and the Telescope",
    period: "XVI - XVIII centuries",
    summary:
      "Scholars from Copernicus to Newton laid the foundation for modern astronomy through the telescope and laws of physics.",
    details:
      "1500s | Nicolaus Copernicus: Developed a revolutionary heliocentric system where the Sun, not the Earth, is at the center of the universe.\n\n1608 | Hans Lippershey: A Dutch master invented the first historical telescope that brought distant objects closer.\n\n1609 | Galileo Galilei: The first scientist to point a telescope at the universe. He discovered lunar craters and 4 satellites of Jupiter, confirming Copernicus's ideas.\n\n1611 | Johannes Kepler: Discovered the basic laws of planetary motion and created a much more accurate astronomical telescope for observing the universe.\n\n1687 | Isaac Newton: Physically proved why planets move in a certain orbit through the law of universal gravitation.",
    media: [
      { type: 'image', src: '/history-step1/hans-lipperhey.png', alt: 'Portrait of Hans Lipperhey' },
      { type: 'image', src: '/history-step1/telescope-1608.png', alt: 'The first telescope from 1608' },
      { type: 'image', src: '/history-step1/moon-sketches-bw.png', alt: 'Historical drawing of lunar phases and craters' },
      { type: 'image', src: '/history-step1/galileo-notes-moon.png', alt: 'Galileo\'s lunar observation page' },
      { type: 'video', title: 'Scientific revolution explainer' },
    ],
  },
  {
    id: 'era-3',
    title: "Space Race and First Steps",
    period: "1950-1960s",
    summary:
      "In the period from Sputnik to Apollo 11, humanity went into space and took the first step on the Moon.",
    details:
      "1957 | \"Sputnik-1\" and Laika: The first artificial satellite in human history was launched into orbit. Soon after, a dog named Laika became the first living creature to fly into space on the \"Sputnik-2\" ship.\n\n1959 | \"Luna-2\": Became the first spacecraft in history to reach the surface of another celestial body (the Moon).\n\nApril 12, 1961 | Yuri Gagarin: The first person to fly into space on the \"Vostok-1\" ship. This was a huge historical step for all of humanity.\n\n1963 and 1965 | New records: Valentina Tereshkova became the first woman in space. Alexei Leonov became the first person in history to go outside the ship - into open space (12 minutes).\n\nJuly 20, 1969 | \"Apollo-11\": Neil Armstrong and Buzz Aldrin set foot on the lunar surface for the first time. Armstrong said his famous historical phrase \"That's one small step for man, one giant leap for mankind.\"",
    media: [
      { type: 'image', src: '/history-step1/sputnik-1.png', alt: 'Sputnik-1 satellite' },
      { type: 'image', src: '/history-step1/laika-dog.png', alt: 'Laika, one of the first dogs to fly into space' },
      { type: 'image', src: '/history-step1/gagarin-flight.png', alt: 'Footage from Yuri Gagarin\'s flight' },
      { type: 'image', src: '/history-step1/luna-spacecraft.png', alt: 'Soviet lunar spacecraft illustration' },
      { type: 'image', src: '/history-step1/valentina-tereshkova.png', alt: 'Portrait of Valentina Tereshkova' },
      { type: 'video', title: 'Moon landing footage' },
    ],
  },
  {
    id: 'era-4',
    title: "Conquering the Planets",
    period: "1970-1990s",
    summary:
      "From landings on Venus and Mars to major leaps like Voyager, Shuttle, Mir, and Hubble, this period saw significant advancements.",
    details:
      "1970-1971 | Red and Hot Planets: \"Venera-7\" was the first spacecraft to land on the surface of Venus, surviving its extreme heat and pressure. A year later, \"Mars-3\" successfully landed on the red planet's surface.\n\n1973-1976 | First clear images: \"Pioneer-10\" was the first mission to take close-up photos of Jupiter. \"Viking-1\" sent the first clear and color landscapes from the surface of Mars to Earth.\n\n1977 | \"Voyager\" mission: \"Voyager-1\" and \"Voyager-2\" were launched to explore the frontiers of space. They are currently humanity's most distant objects outside the solar system.\n\n1981-1986 | New technologies and \"Mir\": The reusable \"Space Shuttle\" made its first flight. The first permanent modular station, \"Mir\", was launched for long-term research in space.\n\n1990-1997 | Deep Space and Saturn: The \"Hubble\" telescope was launched into orbit, fundamentally changing humanity's perception of space. In 1997, the complex \"Cassini-Huygens\" mission was sent to study Saturn and its moons (especially Titan).",
    media: [
      { type: 'image', src: '/history-step1/apollo11-moonwalk.png', alt: 'Astronaut on the lunar surface from the Apollo mission' },
      { type: 'image', src: '/history-step1/venus-lander-model.png', alt: 'Historical module of the Venera spacecraft' },
      { type: 'image', src: '/history-step1/voyager-artwork.png', alt: 'Voyager spacecraft in space (illustration)' },
      { type: 'image', src: '/history-step1/venera-lander.png', alt: 'Venera lander on the surface' },
      { type: 'image', src: '/history-step1/mars-rover-lab.png', alt: 'Mars mission spacecraft in the lab' },
      { type: 'image', src: '/history-step1/shuttle-launch.png', alt: 'Space Shuttle launch' },
      { type: 'image', src: '/history-step1/iss-orbit.png', alt: 'International Space Station in orbit' },
      { type: 'image', src: '/history-step1/hubble-space.png', alt: 'Hubble telescope in orbit' },
      { type: 'image', src: '/history-step1/ariane-launch.png', alt: 'Ariane rocket launch' },
    ],
  },
  {
    id: 'era-5',
    title: "International Cooperation and Commercial Space",
    period: "2000-2020s",
    summary:
      "ISS, private rockets, Mars and Pluto missions, and the first image of a black hole took this era to a new level.",
    details:
      "2000 | International Space Station (ISS): Permanent human living and working in space began. The ISS received its first crew and became the largest symbol of international peace and scientific cooperation.\n\n2008 | Era of Private Space: Elon Musk's \"SpaceX\" successfully launched the \"Falcon 1\" rocket, the first private spacecraft in history to reach orbit, starting the era of commercial flights.\n\n2012-2015 | From Mars to Pluto: The \"Curiosity\" rover landed on Mars and began searching for signs of ancient life. In 2014, for the first time in history, a spacecraft landed on a comet (67P). In 2015, the \"New Horizons\" spacecraft sent the first clear images of the dwarf planet Pluto to Earth.\n\n2019 | The Universe's Greatest Secret: As a result of international cooperation, the first actual photo of a black hole (in the center of the M87 galaxy) was taken. This once again proved Einstein's theory of relativity.",
    media: [
      { type: 'image', src: '/history-step1/spacex-falcon1-rocket.png', alt: 'Falcon 1 rocket' },
      { type: 'image', title: 'ISS Station' },
      { type: 'video', title: 'SpaceX Falcon landing' },
    ],
  },
  {
    id: 'era-6',
    title: "New Horizons and the Future",
    period: "2021-2026",
    summary:
      "With James Webb, DART, Chandrayaan-3 and Starship tests, humanity is actively entering the Moon and Mars era.",
    details:
      "2021-2022 | James Webb and DART mission: The most powerful \"James Webb\" infrared telescope in history was launched to study the universe's oldest galaxies. Through the \"DART\" mission, humanity for the first time struck an asteroid and changed its direction (a test for Earth defense).\n\n2023-2024 | South Pole of the Moon and \"Starship\": India's \"Chandrayaan-3\" successfully landed on the Moon's south pole for the first time. Meanwhile, SpaceX began active testing of the world's largest and most powerful \"Starship\" rocket, designed to take humans to Mars.\n\n2025 | \"Artemis\" and Steps to a Clean Orbit: As part of the \"Artemis II\" mission, astronauts orbited the Moon again after a half-century break. Also, the first practical projects for cleaning dangerous space debris from orbit were tested.\n\n2026 (Present Time) | Moon Base and Mars Samples: Humanity is preparing to set foot on the lunar surface again (\"Artemis III\") and build a permanent base there. Work on bringing soil samples from Mars to Earth (Mars Sample Return) and searching for distant exoplanets (\"Nancy Grace Roman\" telescope) is proceeding at a fast pace.",
    media: [
      { type: 'image', title: 'James Webb mirrors' },
      { type: 'image', title: 'Starship rocket' },
      { type: 'video', title: 'Mars colony concept' },
    ],
  },
];

function EraCard({ era, onOpen }) {
  const { t, i18n } = useTranslation();
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
          {t('history', 'viewMore')}
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
  const { t, i18n } = useTranslation();
  if (item.type === 'image' && item.src) {
    return (
      <button
        type="button"
        onClick={() => onImageOpen({ src: item.src, alt: item.alt || item.title || t('history', 'historicalImage') })}
        className="group h-56 w-full overflow-hidden rounded-2xl border border-white/15 bg-black/20 p-1 shadow-[0_0_20px_rgba(56,189,248,0.2)] transition hover:border-cyan-300/50 md:h-64"
      >
        <img
          src={item.src}
          alt={item.alt || item.title || t('history', 'historicalImage')}
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
          <p className="font-[800] text-white/90">{item.title || t('history', 'videoBlock')}</p>
          <p className="text-sm text-white/50">{t('history', 'videoPlaceholder')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-52 w-full rounded-2xl border border-cyan-300/20 bg-white/5 p-5 flex items-center justify-center text-center text-white/60">
      {item.title || t('history', 'imagePlaceholder')}
    </div>
  );
}

export default function HistoryView() {
  const { t, language } = useTranslation();
  const [activeEra, setActiveEra] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [eras, setEras] = useState(ORIGINAL_ERA_DATA);

  useEffect(() => {
    const translateText = async (text, target) => {
      if (!text || target === 'ENG') return text;
      const langMap = { 'UZB': 'uz', 'RUS': 'ru' };
      const targetLang = langMap[target] || 'en';
      try {
        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURI(text)}`);
        const data = await res.json();
        return data[0].map(x => x[0]).join('');
      } catch { return text; }
    };

    const translateEras = async () => {
      if (language === 'ENG') {
        setEras(ORIGINAL_ERA_DATA);
        return;
      }

      const translated = await Promise.all(ORIGINAL_ERA_DATA.map(async (era) => ({
        ...era,
        title: await translateText(era.title, language),
        period: await translateText(era.period, language),
        summary: await translateText(era.summary, language),
        details: await translateText(era.details, language),
        media: await Promise.all(era.media.map(async (m) => ({
          ...m,
          title: m.title ? await translateText(m.title, language) : m.title,
          alt: m.alt ? await translateText(m.alt, language) : m.alt
        })))
      })));
      setEras(translated);
    };

    translateEras();
  }, [language]);

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
            {t('history', 'title')} <span className="text-glow-purple text-violet">{t('history', 'titleHighlight')}</span>
          </motion.h1>
          <p className="mx-auto max-w-3xl text-lg text-white/40">
            {t('history', 'subtitle')}
          </p>
        </div>

        <div className="relative space-y-6 md:space-y-8">
          <div className="absolute top-0 bottom-0 left-2 w-1 rounded-full bg-gradient-to-b from-neon-blue/20 via-violet/60 to-neon-blue/20 shadow-[0_0_20px_rgba(56,189,248,0.45)] md:left-1/2 md:-translate-x-1/2" />
          {eras.map((era, index) => (
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
              <span>{t('history', 'backBtn')}</span>
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
