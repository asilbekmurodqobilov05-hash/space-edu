import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, MapPin, Search, Star, Info, Eye, ChevronRight, ChevronLeft, Telescope, Orbit, BookOpen, Bell, Camera, Layers, ChevronDown } from 'lucide-react';
import { stars as originalStars, locations as originalLocations } from '../../data/stars';
import useStarStore from '../../store/useStarStore';
import { useTranslation } from '@/hooks/useTranslation';
import ARCameraView from './ARCameraView';
import StarCollection from './StarCollection';

function CustomSelect({ value, onChange, options, placeholder = 'Select an option...' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-black/40 border ${isOpen ? 'border-neon-purple' : 'border-white/20'} rounded-xl px-4 py-3 text-white focus:outline-none transition-all flex items-center justify-between shadow-inner`}
      >
        <span className="truncate pr-4">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-[100] w-full mt-2 bg-[#0c0518]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl shadow-neon-purple/20 max-h-64 overflow-y-auto"
            style={{
               scrollbarWidth: 'thin',
               scrollbarColor: 'rgba(167, 139, 250, 0.3) transparent'
            }}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm transition-colors ${value === option.value ? 'bg-neon-purple/20 text-neon-purple font-medium border-l-2 border-neon-purple' : 'text-gray-300 hover:bg-white/10 hover:text-white border-l-2 border-transparent'}`}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function StarFinderView() {
  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState('finder'); // 'finder', 'ar', 'collection'
  
  const [stars, setStars] = useState(originalStars);
  const [locations, setLocations] = useState(originalLocations);
  const [selectedLocation, setSelectedLocation] = useState(originalLocations[0].id);
  const [selectedStar, setSelectedStar] = useState(originalStars[0].id);
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showReminderToast, setShowReminderToast] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const { starOfTheDay, initializeDailyStar } = useStarStore();

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

    const translateData = async () => {
      if (language === 'ENG') {
        setStars(originalStars);
        setLocations(originalLocations);
        return;
      }

      // Translate common star data
      const translatedStars = await Promise.all(originalStars.map(async (s) => ({
        ...s,
        name: await translateText(s.name, language),
        constellation: await translateText(s.constellation, language),
        story: await translateText(s.story, language),
        visibilityFactors: await Promise.all(s.visibilityFactors.map(f => translateText(f, language))),
        bestSeason: await translateText(s.bestSeason, language),
      })));
      setStars(translatedStars);

      const translatedLocations = await Promise.all(originalLocations.map(async (l) => ({
        ...l,
        name: await translateText(l.name, language),
      })));
      setLocations(translatedLocations);
    };

    translateData();
  }, [language]);

  useEffect(() => {
    initializeDailyStar(stars.map(s => s.id));
  }, [initializeDailyStar, stars]);

  const handleFindStar = () => {
    setIsCalculating(true);
    setResult(null);
    setCurrentImageIndex(0);

    setTimeout(() => {
      const locIndex = locations.findIndex(l => l.id === selectedLocation);
      const starIndex = stars.findIndex(s => s.id === selectedStar);
      
      const baseAzimuth = ((locIndex + 1) * (starIndex + 1) * 47) % 360;
      const baseAltitude = ((locIndex + 1) + (starIndex + 1) * 13) % 90;

      let direction = t('starFinder', 'north');
      if (baseAzimuth > 45 && baseAzimuth <= 135) direction = t('starFinder', 'east');
      else if (baseAzimuth > 135 && baseAzimuth <= 225) direction = t('starFinder', 'south');
      else if (baseAzimuth > 225 && baseAzimuth <= 315) direction = t('starFinder', 'west');

      setResult({
        azimuth: baseAzimuth,
        altitude: baseAltitude,
        direction
      });
      setIsCalculating(false);
    }, 1000);
  };

// --- Main View ---

  const handleRemindMe = () => {
    setShowReminderToast(true);
    setTimeout(() => setShowReminderToast(false), 3000);
  };

  const activeStarData = stars.find(s => s.id === selectedStar);
  const activeLocationData = locations.find(l => l.id === selectedLocation);
  const dailyStarData = stars.find(s => s.id === starOfTheDay);

  const nextImage = () => {
    if (activeStarData) {
      setCurrentImageIndex((prev) => (prev + 1) % activeStarData.images.length);
    }
  };

  const prevImage = () => {
    if (activeStarData) {
      setCurrentImageIndex((prev) => (prev - 1 + activeStarData.images.length) % activeStarData.images.length);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showReminderToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[210] bg-green-500/90 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-2xl backdrop-blur-md"
          >
            <Bell className="w-5 h-5" /> {t('starFinder', 'reminderSet')} {activeStarData?.recommendedTime}!
          </motion.div>
        )}
      </AnimatePresence>

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
          {t('starFinder', 'title')} <span className="text-glow-purple text-neon-purple">{t('starFinder', 'titleHighlight')}</span>
        </motion.h1>

        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowInstructions(true)}
          className="px-6 py-2 bg-white/5 hover:bg-neon-purple/20 hover:text-neon-purple text-white/70 hover:border-neon-purple/50 rounded-full transition-all flex items-center gap-2 mx-auto border border-white/10 text-sm font-medium backdrop-blur-sm"
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4" /> {t('starFinder', 'howToUse')}
          </div>
        </motion.button>
      </div>

      {/* Tutorial / Instructions Modal-like Area */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setShowInstructions(false)}
          >
            <motion.div 
              onClick={(e) => e.stopPropagation()}
              className="max-w-2xl w-full bg-[#0c0518] border border-neon-purple/30 p-8 rounded-3xl shadow-2xl shadow-neon-purple/20 relative"
            >
              <button 
                onClick={() => setShowInstructions(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
              >
                <ChevronDown className="w-6 h-6 rotate-180" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-neon-purple/20 rounded-lg">
                  <Info className="w-6 h-6 text-neon-purple" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {activeTab === 'ar' ? t('starFinder', 'arInstructionsTitle') : t('starFinder', 'instructionsTitle')}
                </h3>
              </div>
              
              <div className="space-y-6">
                {activeTab === 'ar' ? (
                  <ul className="text-gray-300 space-y-4">
                    <li className="flex gap-3"><span className="text-neon-purple font-bold">01.</span> <span><strong>{language === 'UZB' ? "Kameraga ruxsat bering:" : language === 'RUS' ? "Разрешить камеру:" : "Allow Camera:"}</strong> {language === 'UZB' ? "Jonli tasvirni ko'rish uchun kamera ruxsatnomalarini berganingizga ishonch hosil qiling." : language === 'RUS' ? "Убедитесь, что вы предоставили разрешения камере для просмотра прямой трансляции." : "Ensure you have granted camera permissions to see the live feed."}</span></li>
                    <li className="flex gap-3"><span className="text-neon-purple font-bold">02.</span> <span><strong>{language === 'UZB' ? "Kompasni kalibrlash:" : language === 'RUS' ? "Калибровка компаса:" : "Calibrate Compass:"}</strong> {language === 'UZB' ? "Agar mobil telefonda bo'lsangiz, kalibrlash uchun telefoningizni 8 raqami harakati bilan harakatlantiring." : language === 'RUS' ? "Если вы на мобильном телефоне, переместите телефон в движении восьмерки для калибровки." : "If on mobile, move your phone in a figure-8 motion to calibrate."}</span></li>
                    <li className="flex gap-3"><span className="text-neon-purple font-bold">03.</span> <span><strong>{language === 'UZB' ? "O'qni kuzatib boring:" : language === 'RUS' ? "Следуйте за стрелкой:" : "Follow the Arrow:"}</strong> {language === 'UZB' ? "Markazdagi porlayotgan binafsha rangli o'q nishon yulduzingizga qarab aylanadi. Tanangizni o'qga mos ravishda burang." : language === 'RUS' ? "Светящаяся фиолетовая стрелка в центре будет вращаться, указывая на вашу целевую звезду. Поверните тело так, чтобы оно соответствовало стрелке." : "The glowing purple arrow in the center will rotate to point towards your target star. Turn your body to match the arrow."}</span></li>
                  </ul>
                ) : (
                  <ul className="text-gray-300 space-y-4">
                    <li className="flex gap-3"><span className="text-neon-purple font-bold">01.</span> <span><strong>{language === 'UZB' ? "Joylashuv va yulduzni tanlang:" : language === 'RUS' ? "Выберите место и звезду:" : "Select Location & Star:"}</strong> {language === 'UZB' ? "Joriy shahringizni va topmoqchi bo'lgan yulduzni tanlang, so'ngra Hisoblash tugmasini bosing." : language === 'RUS' ? "Выберите ваш город и звезду, которую хотите найти, затем нажмите Рассчитать." : "Choose your current city and the star you wish to find, then click Calculate."}</span></li>
                    <li className="flex gap-3"><span className="text-neon-purple font-bold">02.</span> <span><strong>{language === 'UZB' ? "Tafsilotlarni ko'rib chiqing:" : language === 'RUS' ? "Просмотрите детали:" : "Review Details:"}</strong> {language === 'UZB' ? "Ko'rinish ballini, eng yaxshi ko'rish vaqtlarini tekshiring va uning tarixini bilish uchun Yulduz hikoyasini o'qing." : language === 'RUS' ? "Проверьте оценку видимости, лучшее время для просмотра и прочитайте звездную историю, чтобы узнать об ее истории." : "Check the visibility score, best viewing times, and read the Star Story to learn about its history."}</span></li>
                  </ul>
                )}
              </div>

              <button 
                onClick={() => setShowInstructions(false)}
                className="mt-8 w-full py-3 bg-neon-purple text-black font-bold rounded-xl hover:bg-white transition-colors shadow-lg shadow-neon-purple/20"
              >
                {t('starFinder', 'gotIt')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Daily Star Banner */}
      {dailyStarData && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-1 rounded-3xl bg-gradient-to-r from-neon-purple via-fuchsia-500 to-blue-500"
        >
          <div className="bg-black/90 backdrop-blur-xl rounded-[23px] p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-neon-purple/20 flex items-center justify-center border border-neon-purple/50 shrink-0">
               <Star className="w-7 h-7 text-neon-purple fill-neon-purple" />
              </div>
              <div>
                <h3 className="text-neon-purple font-bold text-sm uppercase tracking-wider mb-1">{t('starFinder', 'dailyBonus')}</h3>
                <h2 className="text-2xl font-bold text-white">{dailyStarData.name}</h2>
              </div>
            </div>
            <button 
              onClick={() => {
                setSelectedStar(dailyStarData.id);
                setActiveTab('finder');
                handleFindStar();
              }}
              className="px-6 py-2 bg-neon-purple hover:bg-white text-black font-bold rounded-full transition-colors whitespace-nowrap"
            >
              {t('starFinder', 'findNow')}
            </button>
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="glass p-1 rounded-2xl inline-flex">
          {[
            { id: 'finder', label: t('starFinder', 'tabFinder'), icon: Search },
            { id: 'ar', label: t('starFinder', 'tabAr'), icon: Camera },
            { id: 'collection', label: t('starFinder', 'tabCollection'), icon: Layers }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${activeTab === tab.id ? 'bg-neon-purple text-black shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-8">
        
        {activeTab === 'collection' && <StarCollection />}

        {(activeTab === 'finder' || activeTab === 'ar') && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6 md:p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row gap-6 items-end relative z-30"
          >
            <div className="w-full md:w-2/5">
              <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {t('starFinder', 'yourLocation')}
              </label>
              <div className="relative z-50">
                <CustomSelect 
                  value={selectedLocation}
                  onChange={(val) => setSelectedLocation(val)}
                  options={locations.map(loc => ({ value: loc.id, label: loc.name }))}
                />
              </div>
            </div>

            <div className="w-full md:w-2/5">
              <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                <Star className="w-4 h-4" /> {t('starFinder', 'targetStar')}
              </label>
              <div className="relative z-40">
                <CustomSelect 
                  value={selectedStar}
                  onChange={(val) => {
                    setSelectedStar(val);
                    setResult(null);
                  }}
                  options={stars.map(star => ({ value: star.id, label: `${star.name} (${star.constellation})` }))}
                />
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
                  <><Search className="w-5 h-5" /> {t('starFinder', 'calculate')}</>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Content based on Active Tab & Results */}
        <AnimatePresence mode="wait">
          {result && activeTab === 'ar' && (
            <motion.div key="ar-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ARCameraView 
                targetStar={activeStarData} 
                targetAzimuth={result.azimuth} 
                targetAltitude={result.altitude} 
              />
            </motion.div>
          )}

          {result && activeTab === 'finder' && (
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
                        src={activeStarData?.images[currentImageIndex]} 
                        alt={`${activeStarData?.name} view ${currentImageIndex + 1}`} 
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
                  </div>

                  {/* Star Story */}
                  <div className="bg-gradient-to-br from-neon-purple/10 to-transparent p-6 rounded-2xl border border-neon-purple/20">
                    <div className="flex items-center gap-3 mb-3">
                      <BookOpen className="w-5 h-5 text-neon-purple" />
                      <h4 className="text-white font-bold">{t('starFinder', 'storyTitle')}</h4>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed italic">
                      "{activeStarData?.story}"
                    </p>
                  </div>
                </div>

                {/* Info and Coordinates */}
                <div className="w-full lg:w-1/2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-4xl font-bold text-white">{activeStarData?.name}</h3>
                      <button 
                        onClick={handleRemindMe}
                        className="bg-white/10 hover:bg-neon-purple hover:text-black text-white px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 border border-white/20"
                      >
                        <Bell className="w-4 h-4" /> {t('starFinder', 'remindMe')}
                      </button>
                    </div>
                    
                    <p className="text-neon-purple font-medium text-lg mb-6 flex items-center gap-2">
                      <Star className="w-5 h-5" /> {t('starFinder', 'constellation')}: {activeStarData?.constellation}
                    </p>
                    
                    {/* Visibility Metrics */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-black/40 p-4 rounded-2xl border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                          <Eye className="w-12 h-12" />
                        </div>
                        <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">{t('starFinder', 'visibilityToday')}</div>
                        <div className="flex items-end gap-2">
                          <span className="text-3xl font-bold text-white">{activeStarData?.visibilityScore}</span>
                          <span className="text-gray-500 font-medium mb-1">/ 10</span>
                        </div>
                      </div>
                      
                      <div className="bg-black/40 p-4 rounded-2xl border border-white/5 flex flex-col justify-center">
                        <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">{t('starFinder', 'bestTime')}</div>
                        <div className="text-lg font-bold text-white leading-tight">{activeStarData?.recommendedTime}</div>
                      </div>
                    </div>

                    {/* Factors List */}
                    <div className="mb-6">
                      <div className="text-gray-400 text-xs uppercase tracking-wider mb-3">{t('starFinder', 'visibilityFactors')}</div>
                      <div className="space-y-2">
                        {activeStarData?.visibilityFactors.map((factor, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-neon-purple"></div>
                            {factor}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Positioning Info */}
                   <div className="bg-gradient-to-r from-black/40 to-black/60 border border-white/10 p-6 rounded-2xl mt-4">
                    <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
                       <MapPin className="w-5 h-5 text-neon-purple" />
                       <span className="text-gray-300 font-medium">{t('starFinder', 'viewingFrom')} {activeLocationData?.name}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">{t('starFinder', 'direction')}</div>
                        <div className="flex items-end gap-2">
                          <span className="text-4xl font-bold text-neon-purple">{result.direction}</span>
                          <span className="text-gray-500 font-medium mb-1">{result.azimuth}°</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">{t('starFinder', 'altitude')}</div>
                        <div className="flex items-end gap-2">
                          <span className="text-4xl font-bold text-neon-purple">{result.altitude}°</span>
                          <span className="text-gray-500 font-medium mb-1">{t('starFinder', 'up')}</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => setActiveTab('ar')}
                      className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl border border-white/10 transition-colors flex justify-center items-center gap-2 mt-4"
                    >
                      <Camera className="w-5 h-5" /> {t('starFinder', 'openAr')}
                    </button>

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
