import { motion } from 'motion/react';
import { useGamificationStore } from '@/store/useGamificationStore';
import { FolderGit2, Calendar, Target, ExternalLink, Plus, BookOpen, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';

export default function PortfolioView() {
  const { portfolio, careerTrack } = useGamificationStore();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          {t('portfolio', 'title')} <span className="text-glow-purple text-neon-purple">{t('portfolio', 'titleHighlight')}</span>
        </motion.h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-8">
          {t('portfolio', 'subtitle')}
        </p>
      </div>

      {/* How it Works Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-6 rounded-2xl text-center border border-white/5"
        >
          <div className="w-12 h-12 bg-neon-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-6 h-6 text-neon-blue" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{t('portfolio', 'step1Title')}</h3>
          <p className="text-sm text-gray-400">{t('portfolio', 'step1Desc')}</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass p-6 rounded-2xl text-center border border-white/5"
        >
          <div className="w-12 h-12 bg-neon-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-6 h-6 text-neon-purple" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{t('portfolio', 'step2Title')}</h3>
          <p className="text-sm text-gray-400">{t('portfolio', 'step2Desc')}</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass p-6 rounded-2xl text-center border border-white/5"
        >
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{t('portfolio', 'step3Title')}</h3>
          <p className="text-sm text-gray-400">{t('portfolio', 'step3Desc')}</p>
        </motion.div>
      </div>

      {portfolio.length === 0 ? (
        <div className="glass p-12 rounded-3xl text-center max-w-2xl mx-auto">
          <div className="w-24 h-24 bg-space-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
            <FolderGit2 className="w-10 h-10 text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">{t('portfolio', 'emptyTitle')}</h2>
          <p className="text-gray-400 mb-8">
            {t('portfolio', 'emptyDesc')}
          </p>
          <Link to="/learn" className="px-8 py-3 bg-neon-blue text-space-900 font-bold rounded-full hover:bg-white transition-colors box-glow-blue inline-flex items-center gap-2">
            <Target className="w-5 h-5" /> {t('portfolio', 'startMission')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {portfolio.map((project, idx) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass p-8 rounded-3xl group hover:border-neon-blue/50 transition-colors relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/5 rounded-full blur-3xl group-hover:bg-neon-blue/10 transition-colors" />
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <h3 className="text-2xl font-bold text-white group-hover:text-neon-blue transition-colors">{project.title}</h3>
                <button className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-gray-400 mb-6 relative z-10 line-clamp-3">
                {project.description}
              </p>
              
              <div className="space-y-4 relative z-10">
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-2">{t('portfolio', 'skillsDemonstrated')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.skillsUsed.map((skill, sIdx) => (
                      <span key={sIdx} className="px-3 py-1 bg-space-800 border border-white/10 rounded-full text-xs text-gray-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/10 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Target className="w-4 h-4" /> {project.careerTrack}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> {new Date(project.dateCompleted).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
