import { useState, useRef, useEffect, type CSSProperties } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Rocket,
  BookOpen,
  Compass,
  FlaskConical,
  Activity,
  Calendar,
  Menu,
  X,
  Globe,
  ChevronDown,
  Briefcase,
  FolderGit2,
  History,
  ShoppingCart,
  Gamepad2
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useUserStore, Language } from "@/store/useUserStore";
import { useTranslation } from "@/hooks/useTranslation";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const location = useLocation();
  const langMenuDesktopRef = useRef<HTMLDivElement>(null);
  const langMenuMobileRef = useRef<HTMLDivElement>(null);
  
  const { language, setLanguage } = useUserStore();
  const { t } = useTranslation();

  const navItems = [
    { path: "/", label: t('nav', 'home'), icon: Rocket },
    { path: "/learn", label: t('nav', 'learn'), icon: BookOpen },
    { path: "/3d-solar-system", label: t('nav', 'galaxyMap'), icon: Compass },
    { path: "/careers", label: t('nav', 'careers'), icon: Briefcase },
    { path: "/portfolio", label: t('nav', 'portfolio'), icon: FolderGit2 },
    { path: "/history", label: t('nav', 'history'), icon: History },
    { path: "/market", label: t('nav', 'market'), icon: ShoppingCart },
    { path: "/star-finder", label: t('nav', 'starFinder'), icon: Compass },
    { path: "/lab", label: t('nav', 'lab'), icon: FlaskConical },
    { path: "/live", label: t('nav', 'live'), icon: Activity },
    { path: "/calendar", label: t('nav', 'calendar'), icon: Calendar },
    { path: "/space-game", label: t('nav', 'spaceGame'), icon: Gamepad2 },
  ];

  const languages: Language[] = ['ENG', 'UZB', 'RUS'];

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const t = event.target as Node;
      const inDesktop = langMenuDesktopRef.current?.contains(t);
      const inMobile = langMenuMobileRef.current?.contains(t);
      if (!inDesktop && !inMobile) setIsLangMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsLangMenuOpen(false);
  }, [location.pathname]);

  const navShellStyle: CSSProperties = {
    backdropFilter: "blur(16px) saturate(1.15)",
    WebkitBackdropFilter: "blur(16px) saturate(1.15)",
    backgroundColor: "rgba(7, 12, 26, 0.9)",
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1px rgba(0,229,255,0.16), 0 10px 40px rgba(0,0,0,0.4)",
    isolation: "isolate",
    transform: "translateZ(0)",
  };

  return (
    <nav
      className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 w-[96%] max-w-7xl z-50 rounded-[1.25rem] sm:rounded-[1.4rem] overflow-hidden transition-[box-shadow,transform] duration-300 ease-out will-change-[transform]"
      style={navShellStyle}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/[0.07]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-cyan-400/55 to-transparent rounded-full" aria-hidden />

      <div className="relative px-3 sm:px-5 lg:px-6 min-h-[3.75rem] sm:min-h-[4.25rem]">
        <div className="flex items-center justify-between min-h-[inherit] py-2 sm:py-2.5">
          <Link
            to="/"
            className="flex-shrink-0 cursor-pointer flex items-center gap-2.5 sm:gap-3 group rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/50"
            onClick={handleNavClick}
          >
            <span className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-cyan-500/15 ring-1 ring-cyan-400/35 group-hover:bg-cyan-500/25 transition-colors duration-200 ease-out">
              <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-neon-blue" strokeWidth={2.25} />
            </span>
            <span className="font-display font-bold text-base sm:text-lg tracking-[0.02em] text-neon-blue truncate max-w-[10rem] sm:max-w-none drop-shadow-[0_0_18px_rgba(0,229,255,0.35)]">
              {t("nav", "brand")}
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden xl:flex items-center min-h-[inherit] flex-1 justify-end min-w-0 pl-2">
            <div
              className="flex items-center gap-0.5 sm:gap-1 h-full mr-3 sm:mr-5 min-w-0 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [-webkit-overflow-scrolling:touch]"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== "/" &&
                    location.pathname.startsWith(item.path));

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative shrink-0 px-2.5 sm:px-3 py-2 sm:py-2.5 min-h-[2.75rem] rounded-xl flex items-center gap-2 text-[13px] sm:text-sm font-semibold font-display transition-colors duration-200 ease-out motion-reduce:transition-none
                      ${isActive ? "text-neon-blue bg-neon-blue/15 ring-1 ring-cyan-400/30" : "text-white/75 hover:text-white hover:bg-white/10"}`}
                  >
                    <Icon className="w-[1.05rem] h-[1.05rem] sm:w-5 sm:h-5 shrink-0 opacity-90" strokeWidth={2.1} />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setLanguage("UZB");
                  setIsLangMenuOpen(false);
                }}
                aria-pressed={language === "UZB"}
                title="O'zbekcha"
                className={`shrink-0 rounded-full px-2.5 sm:px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold font-display transition-colors duration-200 ease-out border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/70 ${
                  language === "UZB"
                    ? "border-emerald-400/45 bg-emerald-500/20 text-white ring-1 ring-emerald-400/35"
                    : "border-white/15 bg-white/[0.07] text-white/80 hover:text-white hover:bg-white/12 hover:border-cyan-400/25"
                }`}
              >
                <span className="sm:hidden">{"O'Z"}</span>
                <span className="hidden sm:inline">{"O'zbekcha"}</span>
              </button>

            {/* Language Switcher */}
            <div className="relative shrink-0" ref={langMenuDesktopRef}>
              <button
                type="button"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-white/[0.07] hover:bg-white/12 border border-white/15 hover:border-cyan-400/30 text-white/85 hover:text-white transition-colors duration-200 ease-out text-xs sm:text-sm font-semibold"
              >
                <Globe className="w-4 h-4 sm:w-[1.05rem] sm:h-[1.05rem]" strokeWidth={2} />
                <span>{language}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
                    className="absolute right-0 mt-2 w-28 rounded-xl bg-[#0a1120]/98 backdrop-blur-md border border-white/12 shadow-xl overflow-hidden z-50"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors
                          ${language === lang ? 'bg-neon-blue/20 text-neon-blue' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                      >
                        {lang}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="xl:hidden flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => {
                setLanguage("UZB");
                setIsLangMenuOpen(false);
              }}
              aria-pressed={language === "UZB"}
              title="O'zbekcha"
              className={`shrink-0 rounded-lg px-2.5 py-2 text-xs font-bold transition-colors duration-200 border ${
                language === "UZB"
                  ? "border-emerald-400/45 bg-emerald-500/20 text-white"
                  : "border-white/12 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              {"O'Z"}
            </button>
            {/* Mobile Language Switcher */}
            <div className="relative shrink-0" ref={langMenuMobileRef}>
              <button
                type="button"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1 px-2.5 py-2 rounded-lg bg-white/5 border border-white/10 text-white/80 text-xs font-medium transition-colors duration-200 hover:bg-white/10"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{language}</span>
              </button>
              
              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute right-0 mt-2 w-24 rounded-lg bg-[#0a1120] border border-white/10 shadow-xl overflow-hidden z-50"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors
                          ${language === lang ? 'bg-neon-blue/20 text-neon-blue' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                      >
                        {lang}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white/60 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/60 rounded-lg p-2 transition-colors duration-200"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
            className="xl:hidden bg-[#04080f]/96 backdrop-blur-md border-t border-cyan-400/15 overflow-hidden rounded-b-[1.25rem]"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== "/" &&
                    location.pathname.startsWith(item.path));

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={handleNavClick}
                    className={`w-full text-left px-3 py-4 rounded-xl text-base font-medium transition-colors duration-200 ease-out flex items-center gap-3
                      ${isActive ? "text-neon-blue bg-neon-blue/10" : "text-white/60 hover:text-white hover:bg-white/5"}`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
