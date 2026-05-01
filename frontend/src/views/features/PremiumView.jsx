import React from 'react';
import { motion } from 'motion/react';
import { Crown, CheckCircle2, Sparkles, Rocket, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';

export default function PremiumView() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleGetPlan = () => {
    navigate('/login');
  };

  const promoFeatures = [
    t('premium', 'promoFeature1'),
    t('premium', 'promoFeature2'),
    t('premium', 'promoFeature3'),
    t('premium', 'promoFeature4'),
    t('premium', 'promoFeature5'),
    t('premium', 'promoFeature6')
  ];

  const plans = [
    {
      name: t('premium', 'basic'),
      price: '$5',
      icon: <Sparkles className="w-8 h-8 text-violet-400" />,
      color: 'from-violet-500 to-purple-600',
      shadow: 'shadow-[0_0_30px_rgba(139,92,246,0.15)]',
      border: 'border-violet-500/30',
      features: [
        t('premium', 'basicFeat1'),
        t('premium', 'basicFeat2'),
        t('premium', 'basicFeat3'),
        t('premium', 'basicFeat4'),
        t('premium', 'basicFeat5')
      ]
    },
    {
      name: t('premium', 'plus'),
      price: '$15',
      icon: <Rocket className="w-10 h-10 text-fuchsia-400" />,
      color: 'from-fuchsia-500 to-pink-600',
      shadow: 'shadow-[0_0_40px_rgba(217,70,239,0.3)]',
      border: 'border-fuchsia-500/50',
      scale: 'scale-105', // Highlight middle plan
      badge: t('premium', 'mostPopular'),
      features: [
        t('premium', 'plusFeat1'),
        t('premium', 'plusFeat2'),
        t('premium', 'plusFeat3'),
        t('premium', 'plusFeat4')
      ]
    },
    {
      name: t('premium', 'pro'),
      price: '$30',
      icon: <Crown className="w-8 h-8 text-amber-400" />,
      color: 'from-amber-500 to-orange-600',
      shadow: 'shadow-[0_0_30px_rgba(245,158,11,0.15)]',
      border: 'border-amber-500/30',
      features: [
        t('premium', 'proFeat1'),
        t('premium', 'proFeat2'),
        t('premium', 'proFeat3'),
        t('premium', 'proFeat4'),
        t('premium', 'proFeat5')
      ]
    }
  ];

  const scrollToPlans = () => {
    document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center">
      
      {/* Promotional Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-gradient-to-br from-violet-900/40 via-black/60 to-purple-900/20 rounded-3xl border border-violet-500/30 p-8 md:p-12 mb-20 shadow-2xl backdrop-blur-md"
      >
        <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start justify-between">
          
          {/* Left: Promo Text & Actions */}
          <div className="flex-1 text-center lg:text-left">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-violet-200 to-fuchsia-300 leading-tight"
            >
              {t('premium', 'heroTitle')}
            </motion.h1>
            
            <p className="text-xl text-violet-200/90 font-medium mb-8">
              {t('premium', 'heroSubtitle')}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-6">
              <button 
                onClick={handleGetPlan}
                className="px-8 py-4 bg-white text-black hover:bg-gray-200 font-bold rounded-full text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:scale-105"
              >
                {t('premium', 'tryFreeBtn')}
              </button>
              <button 
                onClick={scrollToPlans}
                className="px-6 py-4 text-white hover:text-violet-300 font-medium rounded-full border border-transparent hover:border-white/20 transition-all bg-white/5 hover:bg-white/10"
              >
                {t('premium', 'viewPlansBtn')}
              </button>
            </div>

            <p className="text-xs text-gray-500 max-w-md mx-auto lg:mx-0">
              {t('premium', 'termsText')}
            </p>
          </div>

          {/* Right: Feature List */}
          <div className="flex-1 w-full max-w-md lg:max-w-none bg-black/40 rounded-2xl p-8 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-400" />
              {t('premium', 'whyPremium')}
            </h3>
            <div className="space-y-4">
              {promoFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-fuchsia-400 shrink-0" />
                  <span className="text-gray-200 font-medium text-lg">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col items-center sm:items-start">
               <div className="text-sm text-gray-400 mb-2">{t('premium', 'acceptedPayments')}</div>
               <div className="flex items-center gap-3 text-white/70">
                 <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-md border border-white/10 text-sm font-bold tracking-wider">VISA</div>
                 <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-md border border-white/10 text-sm font-bold tracking-wider">MasterCard</div>
                 <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-md border border-white/10 text-sm font-bold tracking-wider italic">PayPal</div>
               </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Plans Section Header */}
      <div id="plans-section" className="text-center mb-16 max-w-3xl">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-extrabold mb-6 text-white"
        >
          {t('premium', 'plansTitle')}
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-400 leading-relaxed"
        >
          {t('premium', 'plansDesc')}
        </motion.p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 w-full items-center">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + (index * 0.1) }}
            className={`relative flex flex-col h-full bg-black/60 backdrop-blur-xl rounded-3xl border ${plan.border} ${plan.shadow} p-8 ${plan.scale || ''}`}
          >
            {/* Optional Badge */}
            {plan.badge && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                {plan.badge}
              </div>
            )}

            <div className="flex flex-col items-center text-center mb-8">
              <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/10`}>
                {plan.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">
                  {plan.price}
                </span>
                <span className="text-gray-400 font-medium">{t('premium', 'perMonth')}</span>
              </div>
            </div>

            <div className="flex-grow space-y-4 mb-8">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleGetPlan}
              className={`w-full py-4 rounded-xl font-bold text-white text-lg tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r ${plan.color} shadow-lg`}
            >
              {t('premium', 'getPlanBtn')}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
