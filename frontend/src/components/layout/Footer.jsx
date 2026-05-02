import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Rocket, Globe, BookOpen, Star, Mail, Map, Shield, Info, ExternalLink, 
  Send, Instagram, Twitter, Youtube 
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const socialLinks = [
    { label: "Telegram", icon: Send, color: "#229ED9", path: "#" },
    { label: "Instagram", icon: Instagram, color: "#E4405F", path: "#" },
    { label: "X (Twitter)", icon: Twitter, color: "#ffffff", path: "#" },
    { label: "YouTube", icon: Youtube, color: "#FF0000", path: "#" },
  ];

  const sections = [
    {
      title: t('footer', 'navigation'),
      links: [
        { label: t('nav', 'home'), path: "/" },
        { label: t('nav', 'learn'), path: "/learn" },
        { label: t('nav', 'news'), path: "/news" },
        { label: t('nav', 'market'), path: "/market" },
        { label: t('footer', 'features'), path: "/learn" },
        { label: t('footer', 'profile'), path: "/portfolio" },
      ]
    },
    {
      title: t('footer', 'explore'),
      links: [
        { label: t('footer', '3dSolarSystem'), path: "/3d-solar-system" },
        { label: t('footer', 'dailyChallenge'), path: "/daily" },
        { label: t('footer', 'leaderboard'), path: "/leaderboard" },
        { label: t('nav', 'starFinder'), path: "/star-finder" },
        { label: t('nav', 'lab'), path: "/lab" },
        { label: t('nav', 'live'), path: "/live" },
        { label: t('nav', 'calendar'), path: "/calendar" },
        { label: t('footer', 'cosmos'), path: "/learn" },
        { label: t('nav', 'history'), path: "/history" },
      ]
    },
    {
      title: t('footer', 'specialPrograms'),
      links: [
        { label: t('nav', 'spaceGame'), path: "/space-game" },
        { label: t('footer', 'quizTest'), path: "/quiz" },
      ]
    }
  ];

  return (
    <footer className="relative bg-[#030208] border-t border-violet-500/20 pt-16 pb-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent opacity-30" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 blur-[120px] rounded-full -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/5 blur-[120px] rounded-full -ml-32 -mb-32" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Section: Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          {/* Site Identity */}
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-transform group-hover:scale-110">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">
                Space <span className="text-violet-400">Edu</span>
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
              {t('footer', 'description')}
            </p>
            <div className="flex items-center gap-4">
              <motion.a whileHover={{ y: -2 }} href="#" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-violet-600/20 hover:text-violet-400 transition-colors">
                <Globe className="w-4 h-4" />
              </motion.a>
              <motion.a whileHover={{ y: -2 }} href="#" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-violet-600/20 hover:text-violet-400 transition-colors">
                <Mail className="w-4 h-4" />
              </motion.a>
            </div>
          </div>

          {/* Dynamic Sections */}
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6 border-l-2 border-violet-500 pl-3">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      to={link.path} 
                      className="text-white/40 hover:text-white hover:translate-x-1 transition-all inline-block text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social Icons Section (Replaced CTA) */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6 border-l-2 border-violet-500 pl-3">
              {t('footer', 'connect')}
            </h3>
            <div className="flex flex-col gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.path}
                  whileHover={{ x: 5, backgroundColor: 'rgba(139,92,246,0.15)' }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-violet-600/20">
                    <social.icon className="w-4 h-4 text-white/60 group-hover:text-violet-400 transition-colors" />
                  </div>
                  <span className="text-sm font-bold text-white/40 group-hover:text-white transition-colors">
                    {social.label}
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
        </div>


        {/* NASA-Style Bottom Section */}
        <div className="pt-12 border-t border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start text-[11px] text-white/30 tracking-wide uppercase font-bold">
            {/* Metadata Info */}
            <div className="space-y-2">
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <p>{t('footer', 'pageLastUpdated')} <span className="text-white/50">{lastUpdated}</span></p>
                <p>{t('footer', 'pageEditor')} <span className="text-white/50">{t('footer', 'operations')}</span></p>
              </div>
              <p>{t('footer', 'responsibleOfficial')} <span className="text-white/50">{t('footer', 'officer')}</span></p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap lg:justify-end gap-x-6 gap-y-2">
              <Link to="#" className="hover:text-violet-400 transition-colors">{t('footer', 'privacyPolicy')}</Link>
              <Link to="#" className="hover:text-violet-400 transition-colors">{t('footer', 'termsOfUse')}</Link>
              <Link to="#" className="hover:text-violet-400 transition-colors">{t('footer', 'sitemap')}</Link>
              <Link to="#" className="hover:text-violet-400 transition-colors">{t('footer', 'contactUs')}</Link>
              <Link to="#" className="hover:text-violet-400 transition-colors">{t('footer', 'accessibility')}</Link>
            </div>
          </div>

          <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 opacity-40">
            <p className="text-[10px] text-white/40">
              © {currentYear} {t('footer', 'allRightsReserved')}
            </p>
            <div className="flex items-center gap-2 text-[10px] text-white/40 italic">
              {t('footer', 'madeWithPassion')} <Star className="w-3 h-3 text-violet-400 fill-violet-400" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
