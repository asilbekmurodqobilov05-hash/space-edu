import { useState } from 'react';
import { motion } from 'motion/react';
import { Compass, MapPin, Search, Navigation as NavIcon, Star } from 'lucide-react';

const stars = [
  { id: 'polaris', name: 'Polaris (North Star)', constellation: 'Ursa Minor', description: 'Always points North in the Northern Hemisphere.' },
  { id: 'sirius', name: 'Sirius', constellation: 'Canis Major', description: 'The brightest star in the night sky.' },
  { id: 'betelgeuse', name: 'Betelgeuse', constellation: 'Orion', description: 'A red supergiant star in the Orion constellation.' },
  { id: 'vega', name: 'Vega', constellation: 'Lyra', description: 'The fifth-brightest star in the night sky.' },
  { id: 'rigel', name: 'Rigel', constellation: 'Orion', description: 'A blue supergiant, the brightest star in Orion.' }
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
  const [result, setResult] = useState<{ azimuth: number, altitude: number, direction: string } | null>(null);

  const handleFindStar = () => {
    setIsCalculating(true);
    setResult(null);

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

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-16 h-16 rounded-full bg-neon-blue/20 flex items-center justify-center mx-auto mb-4 border border-neon-blue/50"
        >
          <Compass className="w-8 h-8 text-neon-blue" />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          Star <span className="text-glow-blue text-neon-blue">Finder</span>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Controls */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass p-8 rounded-3xl border border-white/10 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Your Location
            </label>
            <select 
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-space-800 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors appearance-none"
            >
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
              <Star className="w-4 h-4" /> Target Star
            </label>
            <select 
              value={selectedStar}
              onChange={(e) => setSelectedStar(e.target.value)}
              className="w-full bg-space-800 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors appearance-none"
            >
              {stars.map(star => (
                <option key={star.id} value={star.id}>{star.name} ({star.constellation})</option>
              ))}
            </select>
          </div>

          <div className="pt-4">
            <button
              onClick={handleFindStar}
              disabled={isCalculating}
              className="w-full bg-neon-blue text-space-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-colors disabled:opacity-50"
            >
              {isCalculating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Search className="w-5 h-5" />
                </motion.div>
              ) : (
                <><Search className="w-5 h-5" /> Calculate Position</>
              )}
            </button>
          </div>
        </motion.div>

        {/* Results */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass p-8 rounded-3xl border border-white/10 flex flex-col items-center justify-center text-center relative overflow-hidden"
        >
          {result ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Locating {activeStar?.name}</h3>
                <p className="text-gray-400 text-sm">From {activeLocation?.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-space-800/50 p-4 rounded-2xl border border-white/5">
                  <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Compass Direction</div>
                  <div className="text-3xl font-bold text-neon-blue">{result.direction}</div>
                  <div className="text-sm text-gray-500">{result.azimuth}° Azimuth</div>
                </div>
                <div className="bg-space-800/50 p-4 rounded-2xl border border-white/5">
                  <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Look Up</div>
                  <div className="text-3xl font-bold text-neon-purple">{result.altitude}°</div>
                  <div className="text-sm text-gray-500">Altitude</div>
                </div>
              </div>

              <div className="bg-neon-blue/10 border border-neon-blue/30 p-4 rounded-xl text-left flex gap-4 items-start">
                <NavIcon className="w-6 h-6 text-neon-blue shrink-0 mt-1" />
                <p className="text-sm text-white leading-relaxed">
                  To find <strong className="text-neon-blue">{activeStar?.name}</strong>, face <strong className="text-neon-blue">{result.direction}</strong> (about {result.azimuth} degrees on a compass) and look up approximately <strong className="text-neon-purple">{result.altitude} degrees</strong> from the horizon.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="text-gray-500 flex flex-col items-center">
              <Compass className="w-16 h-16 mb-4 opacity-20" />
              <p>Select a location and star to calculate its position.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
