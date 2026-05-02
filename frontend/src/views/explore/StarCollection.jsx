import React from 'react';
import { motion } from 'motion/react';
import { Award, Star, Lock, Trophy } from 'lucide-react';
import useStarStore from '../../store/useStarStore';
import { stars } from '../../data/stars';
import { useTranslation } from '../../hooks/useTranslation';

export default function StarCollection() {
  const { collection, points, badges } = useStarStore();
  const { t } = useTranslation();

  return (
    <div className="w-full flex flex-col gap-8">
      
      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-6 rounded-3xl border border-neon-purple/30 flex items-center justify-between bg-gradient-to-r from-black/60 to-neon-purple/10"
        >
          <div>
            <h3 className="text-gray-400 font-medium uppercase tracking-wider text-sm mb-1">{t('ar', 'totalPoints')}</h3>
            <div className="text-4xl font-bold text-white flex items-center gap-3">
              {points}
              <span className="text-neon-purple text-lg font-medium">{t('ar', 'pts')}</span>
            </div>
          </div>
          <div className="w-16 h-16 rounded-full bg-neon-purple/20 flex items-center justify-center border border-neon-purple/50">
            <Trophy className="w-8 h-8 text-neon-purple" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass p-6 rounded-3xl border border-white/10 flex items-center justify-between"
        >
          <div>
            <h3 className="text-gray-400 font-medium uppercase tracking-wider text-sm mb-1">{t('ar', 'badgesEarned')}</h3>
            <div className="text-4xl font-bold text-white flex items-center gap-2">
              {badges.length}
            </div>
            {badges.length > 0 && (
              <div className="flex gap-2 mt-2">
                {badges.map(badge => (
                  <div key={badge} className="px-3 py-1 bg-neon-purple/20 text-neon-purple text-xs rounded-full border border-neon-purple/30 font-medium">
                    {badge === 'daily_finder' ? t('ar', 'dailyMaster') : t('ar', 'starGazer')}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
            <Award className="w-8 h-8 text-white/50" />
          </div>
        </motion.div>
      </div>

      {/* Collection Grid */}
      <div className="glass p-8 rounded-3xl border border-white/10">
        <div className="flex items-center gap-3 mb-8">
          <Star className="w-6 h-6 text-neon-purple" />
          <h2 className="text-2xl font-bold text-white">{t('ar', 'myCollection')}</h2>
          <span className="ml-auto bg-white/10 px-4 py-1 rounded-full text-sm font-medium text-gray-300 border border-white/10">
            {t('ar', 'foundProgress').replace('{count}', collection.length).replace('{total}', stars.length)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {stars.map((star, idx) => {
            const isFound = collection.includes(star.id);
            return (
              <motion.div
                key={star.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`relative rounded-2xl overflow-hidden border transition-all duration-300 ${isFound ? 'border-neon-purple/50 bg-black/60 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'border-white/5 bg-black/40 opacity-70 grayscale'}`}
              >
                <div className="aspect-square w-full relative">
                  <img 
                    src={star.images[0]} 
                    alt={star.name}
                    className="w-full h-full object-cover"
                  />
                  {!isFound && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
                      <div className="w-12 h-12 rounded-full bg-black/80 flex items-center justify-center border border-white/10">
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  )}
                  {isFound && (
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-neon-purple text-black flex items-center justify-center font-bold shadow-lg">
                      <Star className="w-4 h-4 fill-black" />
                    </div>
                  )}
                </div>
                
                <div className="p-5">
                  <h4 className={`font-bold text-lg mb-1 ${isFound ? 'text-white' : 'text-gray-400'}`}>
                    {star.name}
                  </h4>
                  <p className="text-sm text-gray-500 font-medium">
                    {star.constellation}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
