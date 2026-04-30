import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Home, BookOpen, Newspaper, ShoppingCart,
  ChevronDown, Menu, X, Globe,
  Zap, Trophy, Briefcase, Compass,
  FlaskConical, Activity, Calendar, History,
  Gamepad2, FolderGit2, User, Star, LayoutGrid, Brain,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useUserStore } from "@/store/useUserStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useTranslation } from "@/hooks/useTranslation";
import { getCosmicSilkRoadUrl } from "@/lib/externalAuthUrl";

const LANG_META = {
  ENG: { flag: '🇬🇧', label: 'English' },
  UZB: { flag: '🇺🇿', label: "O'zbekcha" },
  RUS: { flag: '🇷🇺', label: 'Русский' },
};

const MAIN_NAV = (t) => [
  { path: "/",       label: t('nav', 'home'),              icon: Home },
  { path: "/learn",  label: t('nav', 'learn'),             icon: BookOpen },
  { path: "/news",   label: t('nav', 'news')   || 'News',  icon: Newspaper },
  { path: "/market", label: t('nav', 'market') || 'Market',icon: ShoppingCart },
];

const FEATURES = (t) => [
  { path: "/3d-solar-system", label: "3D Solar System",      icon: Globe },
  { path: "/daily",           label: "Daily Challenge",      icon: Zap },
  { path: "/leaderboard",     label: "Leaderboard",          icon: Trophy },
  { path: "/explore",         label: "Explore",              icon: Compass },
  { path: "/star-finder",     label: t('nav','starFinder'),  icon: Star },
  { path: "/lab",             label: t('nav','lab'),         icon: FlaskConical },
  { path: "/live",            label: t('nav','live'),        icon: Activity },
  { path: "/calendar",        label: t('nav','calendar'),    icon: Calendar },
  { path: "/history",         label: t('nav','history'),     icon: History },
  { path: "/space-game",      label: t('nav','spaceGame'),   icon: Gamepad2 },
  { path: "/quiz",            label: "Quiz & TEST",          icon: Brain },
];

const PROFILE_ITEMS = [
  { path: "/portfolio", label: "Portfolio",  icon: FolderGit2 },
  { path: "/profile",   label: "My Profile", icon: User },
];

// ── shared button styles ──────────────────────────────────────────────────────
const btnBase = {
  idle:   { color: 'rgba(255,255,255,0.52)' },
  hover:  { color: 'rgba(255,255,255,0.88)', background: 'rgba(139,92,246,0.10)' },
  active: { color: '#c4b5fd', background: 'rgba(139,92,246,0.20)', boxShadow: 'inset 0 0 0 1px rgba(167,139,250,0.30)' },
};

function btnProps(active) {
  return {
    onMouseEnter: (e) => { if (!active) Object.assign(e.currentTarget.style, btnBase.hover); },
    onMouseLeave: (e) => { if (!active) Object.assign(e.currentTarget.style, { color: btnBase.idle.color, background: 'transparent' }); },
    style: active ? btnBase.active : btnBase.idle,
  };
}

// ── Dropdown ──────────────────────────────────────────────────────────────────
function Dropdown({ label, icon: Icon, children, isActive: forceActive }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const location = useLocation();
  const btn = btnProps(open || forceActive);

  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12.5px] font-medium transition-all duration-200 whitespace-nowrap"
        {...btn}
      >
        <Icon className="w-3.5 h-3.5" strokeWidth={2} />
        {label}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.18 }}>
          <ChevronDown className="w-3 h-3" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.17, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute top-full mt-2 rounded-2xl overflow-hidden z-50"
            style={{
              minWidth: 190,
              background: 'rgba(5, 3, 14, 0.97)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(139,92,246,0.26)',
              boxShadow: '0 16px 48px rgba(0,0,0,0.65), 0 0 0 1px rgba(139,92,246,0.07)',
            }}
          >
            <div className="absolute top-0 left-6 right-6 h-px"
              style={{ background: 'linear-gradient(90deg,transparent,rgba(167,139,250,0.5),transparent)' }} />
            <div className="p-1.5">{children(setOpen)}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Nav link inside dropdown ──────────────────────────────────────────────────
function DropLink({ path, label, icon: Icon, close }) {
  const { pathname } = useLocation();
  const active = pathname === path || (path !== '/' && pathname.startsWith(path));
  return (
    <Link
      to={path}
      onClick={close}
      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150"
      style={active ? { color: '#c4b5fd', background: 'rgba(139,92,246,0.20)' }
        : { color: 'rgba(255,255,255,0.60)' }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.color='#fff'; e.currentTarget.style.background='rgba(139,92,246,0.12)'; } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.color='rgba(255,255,255,0.60)'; e.currentTarget.style.background='transparent'; } }}
    >
      <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.8}
        style={{ color: active ? '#a78bfa' : 'rgba(167,139,250,0.55)' }} />
      {label}
    </Link>
  );
}

// ── Language dropdown ─────────────────────────────────────────────────────────
function LangDropdown() {
  const { language, setLanguage } = useUserStore();
  const cur = LANG_META[language];

  return (
    <Dropdown label={`${cur.flag} ${language}`} icon={Globe}>
      {(close) => Object.entries(LANG_META).map(([code, { flag, label }]) => (
        <button
          key={code}
          type="button"
          onClick={() => { setLanguage(code); close(false); }}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150"
          style={language === code
            ? { color: '#c4b5fd', background: 'rgba(139,92,246,0.20)' }
            : { color: 'rgba(255,255,255,0.60)' }}
          onMouseEnter={e => { if (language !== code) { e.currentTarget.style.color='#fff'; e.currentTarget.style.background='rgba(139,92,246,0.12)'; } }}
          onMouseLeave={e => { if (language !== code) { e.currentTarget.style.color='rgba(255,255,255,0.60)'; e.currentTarget.style.background='transparent'; } }}
        >
          <span className="text-base leading-none">{flag}</span>
          <span>{label}</span>
          {language === code && (
            <span className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: '#a78bfa', boxShadow: '0 0 6px #a78bfa' }} />
          )}
        </button>
      ))}
    </Dropdown>
  );
}

// ── Navigation ────────────────────────────────────────────────────────────────
export default function Navigation() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState(null);
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const { t } = useTranslation();

  const mainNav  = MAIN_NAV(t);
  const features = FEATURES(t);

  const isActive = useCallback((path) =>
    location.pathname === path || (path !== '/' && location.pathname.startsWith(path)),
    [location.pathname]);

  const featuresHasActive = features.some(f => isActive(f.path));
  const profileHasActive  = PROFILE_ITEMS.some(p => isActive(p.path));

  useEffect(() => { setIsMobileOpen(false); setMobileSection(null); }, [location.pathname]);

  useEffect(() => {
    if (!isMobileOpen) return;
    const h = (e) => { if (!e.target.closest('nav')) setIsMobileOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [isMobileOpen]);

  return (
    <nav
      className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 w-[96%] max-w-7xl z-50 rounded-2xl"
      style={{
        background: 'rgba(3,2,8,0.92)',
        backdropFilter: 'blur(22px) saturate(1.2)',
        WebkitBackdropFilter: 'blur(22px) saturate(1.2)',
        border: '1px solid rgba(139,92,246,0.22)',
        boxShadow: '0 0 0 1px rgba(139,92,246,0.06), 0 8px 40px rgba(0,0,0,0.55)',
      }}
    >
      {/* Shimmer line */}
      <div className="pointer-events-none absolute top-0 left-12 right-12 h-px rounded-full"
        style={{ background: 'linear-gradient(90deg,transparent,rgba(167,139,250,0.65),rgba(139,92,246,0.45),transparent)' }}
        aria-hidden />

      {/* ── Desktop — 3-column grid: logo | center | right ── */}
      <div className="hidden xl:grid px-5 h-[62px]"
        style={{ gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: '12px' }}>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden transition-all duration-200"
            style={{ background: 'rgba(139,92,246,0.14)', border: '1px solid rgba(167,139,250,0.32)' }}>
            <img
              src="/astra-logo.png"
              alt="Astra.x logo"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
            />
          </span>
          <span className="font-bold text-lg tracking-tight"
            style={{
              background: 'linear-gradient(135deg,#ddd6fe 0%,#a78bfa 55%,#8b5cf6 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
            Astra.x
          </span>
        </Link>

        {/* Center — all nav items */}
        <div className="flex items-center justify-center gap-0.5">
          {mainNav.map(({ path, label, icon: Icon }) => {
            const active = isActive(path);
            const b = btnProps(active);
            return (
              <Link key={path} to={path}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12.5px] font-medium transition-all duration-200 whitespace-nowrap"
                {...b}>
                <Icon className="w-3.5 h-3.5" strokeWidth={2} />
                {label}
              </Link>
            );
          })}

          <Dropdown label="Features" icon={LayoutGrid} isActive={featuresHasActive}>
            {(close) => features.map((f) => <DropLink key={f.path} {...f} close={() => close(false)} />)}
          </Dropdown>

          {isAuthenticated && (
            <Link
              to="/profile"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12.5px] font-medium transition-all duration-200 whitespace-nowrap"
              {...btnProps(isActive('/profile'))}
            >
              <User className="w-3.5 h-3.5" strokeWidth={2} />
              My Profile
            </Link>
          )}

          <LangDropdown />
        </div>

        {/* Right — login only for guests */}
        <div className="flex items-center flex-shrink-0">
          {!isAuthenticated && (
            <a
              href={getCosmicSilkRoadUrl()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-bold transition-all duration-200 whitespace-nowrap bg-violet/20 border border-violet/30 text-violet-pale hover:bg-violet/30 hover:scale-105"
            >
              <User className="w-3.5 h-3.5" strokeWidth={2.5} />
              Log in
            </a>
          )}
        </div>
      </div>

      {/* ── Mobile bar ── */}
      <div className="xl:hidden flex items-center justify-between px-4 h-[62px]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setIsMobileOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-xl overflow-hidden"
            style={{ background: 'rgba(139,92,246,0.14)', border: '1px solid rgba(167,139,250,0.32)' }}>
            <img
              src="/astra-logo.png"
              alt="Astra.x logo"
              className="w-full h-full object-cover"
            />
          </span>
          <span className="font-bold text-base"
            style={{
              background: 'linear-gradient(135deg,#ddd6fe,#a78bfa)', WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
            Astra.x
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {!isAuthenticated && (
            <a
              href={getCosmicSilkRoadUrl()}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-violet/20 border border-violet/30 text-violet-pale"
            >
              Log in
            </a>
          )}
          <button
            type="button"
            className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200"
            style={{ color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.08)' }}
            onClick={() => setIsMobileOpen((v) => !v)}
            aria-expanded={isMobileOpen}
            onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(167,139,250,0.3)'; e.currentTarget.style.color='#c4b5fd'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; e.currentTarget.style.color='rgba(255,255,255,0.55)'; }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isMobileOpen
                ? <motion.span key="x" initial={{rotate:-90,opacity:0}} animate={{rotate:0,opacity:1}} exit={{rotate:90,opacity:0}} transition={{duration:0.16}} className="flex"><X className="w-5 h-5" /></motion.span>
                : <motion.span key="m" initial={{rotate:90,opacity:0}} animate={{rotate:0,opacity:1}} exit={{rotate:-90,opacity:0}} transition={{duration:0.16}} className="flex"><Menu className="w-5 h-5" /></motion.span>
              }
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.24, ease: [0.25,0.1,0.25,1] }}
            className="xl:hidden overflow-hidden"
            style={{ borderTop: '1px solid rgba(139,92,246,0.18)' }}
          >
            <div className="px-3 py-3 space-y-1.5">

              {/* Main nav grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {mainNav.map(({ path, label, icon: Icon }) => (
                  <Link key={path} to={path} onClick={() => setIsMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-3 rounded-xl text-[13px] font-medium transition-all"
                    style={isActive(path)
                      ? { color:'#c4b5fd', background:'rgba(139,92,246,0.18)', border:'1px solid rgba(167,139,250,0.2)' }
                      : { color:'rgba(255,255,255,0.55)', border:'1px solid transparent' }}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
                    <span className="truncate">{label}</span>
                  </Link>
                ))}
              </div>

              {/* Features accordion */}
              {[
                { key: 'features', label: 'Features', icon: LayoutGrid, items: features },
                { key: 'lang',     label: 'Language', icon: Globe,      items: [] },
              ].map(({ key, label, icon: Icon, items }) => (
                <div key={key} className="rounded-xl overflow-hidden"
                  style={{ border: '1px solid rgba(139,92,246,0.15)' }}>
                  <button type="button"
                    onClick={() => setMobileSection(mobileSection === key ? null : key)}
                    className="w-full flex items-center justify-between px-4 py-3 text-[13px] font-medium"
                    style={{ color: mobileSection === key ? '#c4b5fd' : 'rgba(255,255,255,0.65)', background:'rgba(139,92,246,0.06)' }}
                  >
                    <span className="flex items-center gap-2"><Icon className="w-4 h-4" /> {label}</span>
                    <motion.span animate={{ rotate: mobileSection === key ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className="w-4 h-4" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {mobileSection === key && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                        transition={{ duration: 0.22 }} className="overflow-hidden">
                        <div className={`p-2 ${key === 'features' ? 'grid grid-cols-2 sm:grid-cols-3 gap-1' : 'flex flex-col gap-1'}`}>
                          {key === 'lang' ? (
                            <div className="flex flex-col gap-1">
                              {Object.entries(LANG_META).map(([code, { flag, label: lbl }]) => {
                                const { language, setLanguage } = useUserStore();
                                return (
                                  <button
                                    key={code}
                                    onClick={() => { setLanguage(code); setIsMobileOpen(false); }}
                                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[12px] font-medium transition-all"
                                    style={language === code
                                      ? { color:'#c4b5fd', background:'rgba(139,92,246,0.18)' }
                                      : { color:'rgba(255,255,255,0.5)' }}
                                  >
                                    <span className="text-base leading-none">{flag}</span>
                                    <span>{lbl}</span>
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            items.map(({ path, label: lbl, icon: ItemIcon }) => (
                              <Link key={path} to={path} onClick={() => setIsMobileOpen(false)}
                                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[12px] font-medium transition-all"
                                style={isActive(path)
                                  ? { color:'#c4b5fd', background:'rgba(139,92,246,0.18)' }
                                  : { color:'rgba(255,255,255,0.5)' }}
                              >
                                <ItemIcon className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.8} />
                                <span className="truncate">{lbl}</span>
                              </Link>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
