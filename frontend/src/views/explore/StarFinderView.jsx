import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, MapPin, Search, Navigation as NavIcon, Star, Info, Eye, ChevronRight, ChevronLeft, Telescope, Orbit } from 'lucide-react';

const stars = [
  { 
    id: 'polaris', 
    name: 'Polaris (North Star)', 
    constellation: 'Ursa Minor', 
    description: 'Always points North in the Northern Hemisphere.',
    bestVisible: 'Visible year-round in the Northern Hemisphere.',
    relatedInfo: 'Polaris is a multiple star system, consisting of three stars, and lies nearly in a direct line with the axis of the Earth\'s rotation. It is roughly 323 to 433 light-years away from Earth and is a yellow supergiant.',
    images: [
      '/images/stars/polaris.png',
      '/images/stars/polaris_2.png',
      '/images/stars/polaris_3.png'
    ],
    spectralType: 'F7 Ib',
    distance: '~433 ly'
  },
  { 
    id: 'sirius', 
    name: 'Sirius', 
    constellation: 'Canis Major', 
    description: 'The brightest star in the night sky.',
    bestVisible: 'Late November to late March (Northern Hemisphere winter).',
    relatedInfo: 'It is a binary star system consisting of a main-sequence star and a faint white dwarf companion. It is incredibly bright due to its proximity to Earth (8.6 light-years). Ancient Egyptians used its heliacal rising to predict the flooding of the Nile.',
    images: [
      '/images/stars/sirius.png',
      '/images/stars/sirius_2.png',
      '/images/stars/sirius_3.png'
    ],
    spectralType: 'A0mA1 Va, DA2',
    distance: '8.6 ly'
  },
  { 
    id: 'betelgeuse', 
    name: 'Betelgeuse', 
    constellation: 'Orion', 
    description: 'A red supergiant star in the Orion constellation.',
    bestVisible: 'January to March (winter months in the Northern Hemisphere).',
    relatedInfo: 'Betelgeuse is expected to end its life in a spectacular supernova explosion within the next 100,000 years. If it were placed at the center of our solar system, its surface would extend past the asteroid belt, possibly engulfing the orbit of Jupiter.',
    images: [
      '/images/stars/betelgeuse.png',
      '/images/stars/betelgeuse_2.png',
      '/images/stars/betelgeuse_3.png'
    ],
    spectralType: 'M1-M2 Ia-ab',
    distance: '~548 ly'
  },
  { 
    id: 'vega', 
    name: 'Vega', 
    constellation: 'Lyra', 
    description: 'The fifth-brightest star in the night sky.',
    bestVisible: 'Summer months in the Northern Hemisphere (part of the Summer Triangle).',
    relatedInfo: 'Vega was the Northern pole star around 12,000 BCE and will be so again around the year 13,727. It was the first star other than the Sun to be photographed and the first to have its spectrum recorded.',
    images: [
      '/images/stars/vega.png',
      '/images/stars/vega_2.png',
      '/images/stars/vega_3.png'
    ],
    spectralType: 'A0 Va',
    distance: '25 ly'
  },
  { 
    id: 'rigel', 
    name: 'Rigel', 
    constellation: 'Orion', 
    description: 'A blue supergiant, the brightest star in Orion.',
    bestVisible: 'December to March.',
    relatedInfo: 'Rigel is extraordinarily luminous, shining about 120,000 times brighter than our Sun, though it is located over 860 light-years away. It is actually a star system with at least four components.',
    images: [
      '/images/stars/rigel.png',
      '/images/stars/rigel_2.png',
      '/images/stars/rigel_3.png'
    ],
    spectralType: 'B8 Ia',
    distance: '~860 ly'
  }
];

const locations = [
  { id: 'tashkent', name: 'Tashkent, Uzbekistan', lat: 41.2995, lon: 69.2401 },
  { id: 'newyork', name: 'New York, USA', lat: 40.7128, lon: -74.0060 },
  { id: 'london', name: 'London, UK', lat: 51.5074, lon: -0.1278 },
  { id: 'tokyo', name: 'Tokyo, Japan', lat: 35.6762, lon: 139.6503 },
  { id: 'sydney', name: 'Sydney, Australia', lat: -33.8688, lon: 151.2093 }
];

export default function StarFinderView() {
  const [selectedLocation, setSelectedLocation] = useState(locations[0].id);
  const [selectedStar, setSelectedStar] = useState(stars[0].id);
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleFindStar = () => {
    setIsCalculating(true);
    setResult(null);
    setCurrentImageIndex(0);

    // Simulate calculation delay
    setTimeout(() => {
      // Mock calculation based on selection to give varied results
      const locIndex = locations.findIndex(l => l.id === selectedLocation);
      const starIndex = stars.findIndex(s => s.id === selectedStar);
      
      // Generate some pseudo-random but consistent values based on selection
      const baseAzimuth = ((locIndex + 1) * (starIndex + 1) * 47) % 360;
      const baseAltitude = ((locIndex + 1) + (starIndex + 1) * 13) % 90;

      let direction = 'North';
      if (baseAzimuth > 45 && baseAzimuth <= 135) direction = 'East';
      else if (baseAzimuth > 135 && baseAzimuth <= 225) direction = 'South';
      else if (baseAzimuth > 225 && baseAzimuth <= 315) direction = 'West';

      setResult({
        azimuth: baseAzimuth,
        altitude: baseAltitude,
        direction
      });
      setIsCalculating(false);
    }, 1500);
  };

  const activeStar = stars.find(s => s.id === selectedStar);
  const activeLocation = locations.find(l => l.id === selectedLocation);

  const nextImage = () => {
    if (activeStar) {
      setCurrentImageIndex((prev) => (prev + 1) % activeStar.images.length);
    }
  };

  const prevImage = () => {
    if (activeStar) {
      setCurrentImageIndex((prev) => (prev - 1 + activeStar.images.length) % activeStar.images.length);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-16 h-16 rounded-full bg-neon-purple/20 flex items-center justify-center mx-auto mb-4 border border-neon-purple/50"
        >
          <Compass className="w-8 h-8 text-neon-purple" />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          Star <span className="text-glow-purple text-neon-purple">Finder</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400 text-lg max-w-2xl mx-auto"
        >
          Select your location and a star to find out exactly where to look in the night sky.
        </motion.p>
      </div>

      <div className="flex flex-col gap-8">
        {/* Controls - Horizontal Layout */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6 md:p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row gap-6 items-end"
        >
          <div className="w-full md:w-2/5">
            <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Your Location
            </label>
            <div className="relative">
              <select 
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-purple transition-colors appearance-none"
              >
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="w-full md:w-2/5">
            <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
              <Star className="w-4 h-4" /> Target Star
            </label>
            <div className="relative">
              <select 
                value={selectedStar}
                onChange={(e) => {
                  setSelectedStar(e.target.value);
                  setResult(null); // Reset result when changing star
                }}
                className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-purple transition-colors appearance-none"
              >
                {stars.map(star => (
                  <option key={star.id} value={star.id}>{star.name} ({star.constellation})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="w-full md:w-1/5">
            <button
              onClick={handleFindStar}
              disabled={isCalculating}
              className="w-full bg-neon-purple text-black font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-colors disabled:opacity-50 h-[50px]"
            >
              {isCalculating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Search className="w-5 h-5" />
                </motion.div>
              ) : (
                <><Search className="w-5 h-5" /> Calculate</>
              )}
            </button>
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass p-6 md:p-10 rounded-3xl border border-white/10"
            >
              <div className="flex flex-col lg:flex-row gap-10">
                {/* Image Gallery */}
                <div className="w-full lg:w-1/2 flex flex-col gap-4">
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-neon-purple/20 group aspect-[4/3] bg-black/60">
                    <AnimatePresence mode="wait">
                      <motion.img 
                        key={currentImageIndex}
                        src={activeStar?.images[currentImageIndex]} 
                        alt={`${activeStar?.name} view ${currentImageIndex + 1}`} 
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full object-cover" 
                      />
                    </AnimatePresence>
                    
                    <button 
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-neon-purple transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-md border border-white/10"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-neon-purple transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-md border border-white/10"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {activeStar?.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-neon-purple w-6' : 'bg-white/50 hover:bg-white'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Info and Coordinates */}
                <div className="w-full lg:w-1/2 flex flex-col justify-between">
                  <div>
                    <h3 className="text-4xl font-bold text-white mb-2">{activeStar?.name}</h3>
                    <p className="text-neon-purple font-medium text-lg mb-6 flex items-center gap-2">
                      <Star className="w-5 h-5" /> Constellation: {activeStar?.constellation}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-black/40 p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center">
                        <div className="text-gray-400 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                           <Telescope className="w-3 h-3" /> Distance
                        </div>
                        <div className="text-xl font-bold text-white">{activeStar?.distance}</div>
                      </div>
                      <div className="bg-black/40 p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center">
                        <div className="text-gray-400 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Orbit className="w-3 h-3" /> Spectral Type
                        </div>
                        <div className="text-xl font-bold text-white">{activeStar?.spectralType}</div>
                      </div>
                    </div>

                    <div className="space-y-5 mb-8">
                      <div className="flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-full bg-neon-purple/10 flex items-center justify-center shrink-0 border border-neon-purple/20">
                           <Eye className="w-5 h-5 text-neon-purple" />
                        </div>
                        <div>
                          <div className="text-white font-medium mb-1">Best Time to View</div>
                          <p className="text-sm text-gray-300 leading-relaxed">{activeStar?.bestVisible}</p>
                        </div>
                      </div>
                      <div className="flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-full bg-neon-purple/10 flex items-center justify-center shrink-0 border border-neon-purple/20">
                          <Info className="w-5 h-5 text-neon-purple" />
                        </div>
                        <div>
                          <div className="text-white font-medium mb-1">Stellar Facts</div>
                          <p className="text-sm text-gray-300 leading-relaxed">{activeStar?.relatedInfo}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Positioning Info */}
                  <div className="bg-gradient-to-r from-black/40 to-black/60 border border-white/10 p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
                       <MapPin className="w-5 h-5 text-neon-purple" />
                       <span className="text-gray-300 font-medium">Viewing from {activeLocation?.name}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Direction</div>
                        <div className="flex items-end gap-2">
                          <span className="text-4xl font-bold text-neon-purple">{result.direction}</span>
                          <span className="text-gray-500 font-medium mb-1">{result.azimuth}°</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Altitude</div>
                        <div className="flex items-end gap-2">
                          <span className="text-4xl font-bold text-neon-purple">{result.altitude}°</span>
                          <span className="text-gray-500 font-medium mb-1">up</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-400 leading-relaxed">
                      To find <strong className="text-white">{activeStar?.name}</strong>, face <strong className="text-white">{result.direction}</strong> (about {result.azimuth}° on a compass) and look up approximately <strong className="text-white">{result.altitude}°</strong> from the horizon.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
