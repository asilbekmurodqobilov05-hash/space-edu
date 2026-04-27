import { motion } from 'motion/react';
import { FaLandmark, FaCirclePlay } from "react-icons/fa6";
import { useTranslation } from "@/hooks/useTranslation";

const historyEvents = [
  {
    id: 'sputnik',
    year: '1957',
    title: 'Sputnik 1',
    description: 'The Soviet Union launched the Earth\'s first artificial satellite, Sputnik 1. It marked the start of the space age and the U.S.-U.S.S.R space race.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Sputnik_asm.jpg/800px-Sputnik_asm.jpg',
    videoUrl: 'https://www.youtube.com/embed/K1jIvXzEwH0'
  },
  {
    id: 'apollo11',
    year: '1969',
    title: 'Apollo 11 Moon Landing',
    description: 'American astronauts Neil Armstrong and Buzz Aldrin became the first humans to walk on the moon. "That\'s one small step for man, one giant leap for mankind."',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Buzz_salutes_the_U.S._Flag.jpg/800px-Buzz_salutes_the_U.S._Flag.jpg',
    videoUrl: 'https://www.youtube.com/embed/cb1EWXqO1eA'
  },
  {
    id: 'hubble',
    year: '1990',
    title: 'Hubble Space Telescope',
    description: 'The Hubble Space Telescope was launched into low Earth orbit. It remains in operation and has provided some of the most detailed images of deep space.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/STS31_Hubble_Deploy.jpg/800px-STS31_Hubble_Deploy.jpg',
    videoUrl: 'https://www.youtube.com/embed/_-jwA1m0T-Y'
  },
  {
    id: 'iss',
    year: '1998',
    title: 'International Space Station',
    description: 'The first component of the ISS was launched. It is a multinational collaborative project involving five participating space agencies.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/International_Space_Station_after_undocking_of_STS-132.jpg/800px-International_Space_Station_after_undocking_of_STS-132.jpg',
    videoUrl: 'https://www.youtube.com/embed/XBPjVzSoepo'
  },
  {
    id: 'jwst',
    year: '2021',
    title: 'James Webb Space Telescope',
    description: 'The largest optical telescope in space. Its high infrared resolution and sensitivity allow it to view objects too old, distant, or faint for the Hubble.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/JWST_in_Cleanroom.jpg/800px-JWST_in_Cleanroom.jpg',
    videoUrl: 'https://www.youtube.com/embed/tnmBqE2E208'
  }
];

export default function HistoryView() {
  const { t } = useTranslation();
  const uzbekistanSpaceEvents = [
    {
      id: "farghani",
      year: "c. 833",
      title: t("uzSpace", "farghani"),
      description:
        "From the Ferghana region, al-Farg‘oniy wrote influential astronomy manuals that shaped scientific education from Baghdad to Europe.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Al-Farghani_Monument%2C_Fergana.jpg/800px-Al-Farghani_Monument%2C_Fergana.jpg",
      videoUrl: "https://www.youtube.com/watch?v=QnN3nLho9nY",
    },
    {
      id: "ulughbeg-observatory",
      year: "1424",
      title: t("uzSpace", "obsTitle"),
      description:
        "Samarkand became home to one of the medieval world’s most advanced observatories under Mirzo Ulug‘bek.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Ulugh_Beg_Observatory%2C_Samarkand%2C_Uzbekistan.jpg/800px-Ulugh_Beg_Observatory%2C_Samarkand%2C_Uzbekistan.jpg",
      videoUrl: "https://www.youtube.com/watch?v=U5mMLN8fM0Y",
    },
    {
      id: "zij-sultani",
      year: "1437",
      title: "Zij-i Sultani Star Catalogue",
      description:
        "Ulug‘bek and his team compiled high-precision observations, including a catalogue of 1,018 stars used for centuries.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Ulugh_Beg%27s_Zij.jpg/800px-Ulugh_Beg%27s_Zij.jpg",
      videoUrl: "https://www.youtube.com/watch?v=pvI4lGO2i6Y",
    },
    {
      id: "uzbekkosmos",
      year: "2019",
      title: t("uzSpace", "agencyTitle"),
      description: t("uzSpace", "agencyDesc"),
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Tashkent_city_uzbekistan.jpg/800px-Tashkent_city_uzbekistan.jpg",
      videoUrl: "https://www.youtube.com/watch?v=lnn3Qv2fM7M",
    },
    {
      id: "student-hub",
      year: "2024",
      title: t("uzSpace", "hubTitle"),
      description: t("uzSpace", "hubDesc"),
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Turin_Polytechnic_University_in_Tashkent.jpg/800px-Turin_Polytechnic_University_in_Tashkent.jpg",
      videoUrl: "https://www.youtube.com/watch?v=6g6J7f6ql7w",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-16 h-16 rounded-full bg-neon-purple/20 flex items-center justify-center mx-auto mb-4 border border-neon-purple/50"
        >
          <FaLandmark className="w-8 h-8 text-neon-purple" />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          Space <span className="text-glow-purple text-neon-purple">History</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400 text-lg max-w-2xl mx-auto"
        >
          Explore the monumental milestones of human space exploration.
        </motion.p>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Uzbekistan &amp; Space History
        </h2>
        <p className="text-gray-400 text-lg max-w-3xl">
          Key milestones connecting Uzbekistan's scientific legacy to modern space development.
        </p>
      </div>

      <div className="space-y-16 mb-20">
        {uzbekistanSpaceEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}
          >
            <div className="w-full md:w-1/2 relative group rounded-2xl overflow-hidden glass border border-cyan-400/20">
              <div className="aspect-video relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <a
                    href={event.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 text-white hover:text-neon-blue transition-colors"
                  >
                    <FaCirclePlay className="w-16 h-16" />
                    <span className="font-bold tracking-wider uppercase text-sm">Watch Video</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 space-y-4">
              <div className="inline-block px-4 py-1 rounded-full bg-neon-blue/20 text-neon-blue font-bold text-sm border border-neon-blue/30">
                {event.year}
              </div>
              <h3 className="text-3xl font-bold text-white">{event.title}</h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                {event.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Global Space History
        </h2>
        <p className="text-gray-400 text-lg max-w-3xl">
          Explore the monumental milestones of human space exploration.
        </p>
      </div>

      <div className="space-y-16">
        {historyEvents.map((event, index) => (
          <motion.div 
            key={event.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}
          >
            {/* Image & Video Side */}
            <div className="w-full md:w-1/2 relative group rounded-2xl overflow-hidden glass border border-white/10">
              <div className="aspect-video relative">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <a 
                    href={event.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 text-white hover:text-neon-purple transition-colors"
                  >
                    <FaCirclePlay className="w-16 h-16" />
                    <span className="font-bold tracking-wider uppercase text-sm">Watch Video</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="w-full md:w-1/2 space-y-4">
              <div className="inline-block px-4 py-1 rounded-full bg-neon-purple/20 text-neon-purple font-bold text-sm border border-neon-purple/30">
                {event.year}
              </div>
              <h2 className="text-3xl font-bold text-white">{event.title}</h2>
              <p className="text-gray-400 leading-relaxed text-lg">
                {event.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
