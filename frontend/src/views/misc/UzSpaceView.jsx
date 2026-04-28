import { motion } from "motion/react";
import { Flag, Target, Rocket } from "lucide-react";

import { useTranslation } from "@/hooks/useTranslation";

export default function UzSpaceView() {
  const { t } = useTranslation();
  const historicalFigures = [
    {
      name: t('uzSpace', 'ulughBeg'),
      role: t('uzSpace', 'ulughBegRole'),
      period: "1394 – 1449",
      contribution: t('uzSpace', 'ulughBegDesc'),
      history: t('uzSpace', 'ulughBegHistory'),
      pointsKey: "ulughBegPoints",
      image: "https://picsum.photos/seed/ulughbeg/400/400",
    },
    {
      name: t('uzSpace', 'farghani'),
      role: t('uzSpace', 'farghaniRole'),
      period: "798 – 861",
      contribution: t('uzSpace', 'farghaniDesc'),
      history: t('uzSpace', 'farghaniHistory'),
      pointsKey: "farghaniPoints",
      image: "https://picsum.photos/seed/farghani/400/400",
    },
  ];

  const timelineEvents = [
    {
      year: "1424",
      title: t('uzSpace', 'obsTitle'),
      description: t('uzSpace', 'obsDesc'),
    },
    {
      year: "2019",
      title: t('uzSpace', 'agencyTitle'),
      description: t('uzSpace', 'agencyDesc'),
    },
    {
      year: "2024",
      title: t('uzSpace', 'hubTitle'),
      description: t('uzSpace', 'hubDesc'),
    },
    {
      year: "2030",
      title: t('uzSpace', 'lunarTitle'),
      description: t('uzSpace', 'lunarDesc'),
    },
    {
      year: "2035",
      title: t('uzSpace', 'astronautTitle'),
      description: t('uzSpace', 'astronautDesc'),
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-20 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-blue/10 rounded-full blur-[100px] pointer-events-none" />
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-24 h-24 mx-auto bg-gradient-to-br from-[#00e5ff] via-white to-[#b537f2] rounded-3xl p-1 mb-8 shadow-[0_0_40px_rgba(0,229,255,0.4)] rotate-12"
        >
          <div className="w-full h-full bg-[#04080f] rounded-[22px] flex items-center justify-center">
            <Flag className="w-10 h-10 text-white" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[clamp(36px,5vw,64px)] font-[800] tracking-[-0.03em] mb-6"
        >
          {t('uzSpace', 'title')} <span className="text-glow-blue text-neon-blue">{t('uzSpace', 'titleHighlight')}</span> {t('uzSpace', 'legacy')}
        </motion.h1>
        <p className="text-white/60 max-w-3xl mx-auto text-xl leading-relaxed">
          {t('uzSpace', 'subtitle')}
        </p>
      </div>

      {/* Historical Figures Section */}
      <div className="mb-32">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-grow bg-gradient-to-r from-transparent to-white/10" />
          <h2 className="text-3xl font-[800] tracking-tight text-white uppercase px-4">{t('uzSpace', 'pioneers')}</h2>
          <div className="h-px flex-grow bg-gradient-to-l from-transparent to-white/10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {historicalFigures.map((figure, idx) => {
            const milestones = t("uzSpace", figure.pointsKey)
              .split("|")
              .map((s) => s.trim())
              .filter(Boolean);
            return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 rounded-[32px] p-8 flex flex-col lg:flex-row gap-8 hover:bg-white/10 transition-all group"
            >
              <div className="w-full lg:w-48 h-48 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                <img src={figure.image} alt={figure.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" referrerPolicy="no-referrer" />
              </div>
              <div className="space-y-4 min-w-0 flex-1">
                <div>
                  <span className="text-neon-blue font-bold tracking-widest text-xs uppercase">{figure.period}</span>
                  <h3 className="text-2xl font-[800] text-white mt-1">{figure.name}</h3>
                  <p className="text-neon-purple font-medium">{figure.role}</p>
                </div>
                <p className="text-white/60 leading-relaxed">{figure.contribution}</p>
                <blockquote className="text-white/80 text-sm leading-relaxed border-l-2 border-neon-blue/50 pl-4 py-3 bg-white/[0.03] rounded-r-lg space-y-3">
                  {figure.history.split("\n\n").map((para, i) => (
                    <p key={i} className="first:mt-0">{para}</p>
                  ))}
                </blockquote>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-neon-blue/90 mb-2">
                    {t("uzSpace", "milestonesLabel")}
                  </p>
                  <ul className="list-disc list-inside text-sm text-white/70 space-y-1.5 marker:text-neon-blue">
                    {milestones.map((line) => (
                      <li key={line} className="leading-snug pl-0.5">
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
            );
          })}
        </div>
      </div>

      {/* Vision Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-sm font-bold">
            <Target className="w-4 h-4" /> STRATEGIC VISION 2035
          </div>
          <h2 className="text-[clamp(32px,4vw,48px)] font-[800] tracking-tight leading-tight">
            Building a Nation of <span className="text-neon-purple">Explorers</span>
          </h2>
          <p className="text-white/60 text-lg leading-relaxed">
            Uzbekistan is investing heavily in STEM education and aerospace
            engineering. Our ultimate goal? To see the flag of Uzbekistan on the
            International Space Station and eventually, on the lunar surface.
          </p>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <h4 className="text-3xl font-[800] text-white mb-1">1st</h4>
              <p className="text-sm text-white/40 uppercase tracking-widest font-bold">National Astronaut</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <h4 className="text-3xl font-[800] text-white mb-1">10k+</h4>
              <p className="text-sm text-white/40 uppercase tracking-widest font-bold">STEM Graduates</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative aspect-square rounded-[40px] overflow-hidden border border-white/10 group"
        >
          <img
            src="https://picsum.photos/seed/uzspace/800/800"
            alt="Future of Uzbek Space"
            className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#04080f] via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 w-full p-10">
            <div className="w-16 h-16 rounded-2xl bg-neon-blue flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,229,255,0.4)]">
              <Rocket className="w-8 h-8 text-[#04080f]" />
            </div>
            <h3 className="text-3xl font-[800] text-white mb-4">The Next Frontier</h3>
            <p className="text-white/70 text-lg">
              Empowering the youth of Uzbekistan to reach beyond the atmosphere.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Timeline Section */}
      <div className="mb-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-[800] tracking-tight mb-4">Roadmap to the Stars</h2>
          <p className="text-white/50 text-lg">The journey from ancient Samarkand to the future of humanity.</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-neon-blue via-neon-purple to-transparent -translate-x-1/2 opacity-30" />

          <div className="space-y-16">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`relative flex flex-col md:flex-row items-start md:items-center ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
              >
                <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-[#04080f] border-2 border-neon-blue -translate-x-1/2 z-10 box-glow-blue" />

                <div className={`ml-16 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pl-16" : "md:pr-16 text-left md:text-right"}`}>
                  <div className="bg-white/5 border border-white/10 p-8 rounded-[24px] hover:border-white/20 transition-all">
                    <span className="text-neon-purple font-[800] text-2xl mb-2 block tracking-tight">
                      {event.year}
                    </span>
                    <h3 className="text-xl font-[700] text-white mb-3">
                      {event.title}
                    </h3>
                    <p className="text-white/50 leading-relaxed">{event.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
