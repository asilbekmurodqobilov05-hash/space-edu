import { useLocation } from "react-router-dom";
import { useUserStore } from "@/store/useUserStore";

const LANGS = [
  { code: "UZB", label: "O'zbekcha", short: "O'Z", flag: "🇺🇿" },
  { code: "ENG", label: "English",   short: "EN",  flag: "🇬🇧" },
  { code: "RUS", label: "Русский",   short: "RU",  flag: "🇷🇺" },
];

// Useful when main navigation is hidden, but we hide it inside Space Run
export default function GlobalLanguageBar() {
  const { pathname } = useLocation();
  const language  = useUserStore((s) => s.language);
  const setLanguage = useUserStore((s) => s.setLanguage);

  // Hide inside the game view (user requested to remove this overlay)
  if (pathname === "/space-game") return null;

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-[60] pointer-events-none"
      style={{ bottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      role="toolbar"
      aria-label="Site language"
    >
      <div
        className="pointer-events-auto flex items-center gap-0.5 rounded-full p-1"
        style={{
          background: 'rgba(3,2,8,0.90)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(139,92,246,0.22)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
        }}
      >
        {LANGS.map(({ code, label, short, flag }) => {
          const active = language === code;
          return (
            <button
              key={code}
              type="button"
              onClick={() => setLanguage(code)}
              title={label}
              aria-pressed={active}
              className="min-h-[2.75rem] min-w-[2.75rem] sm:min-w-[5rem] rounded-full px-3 text-xs sm:text-sm font-bold transition-all duration-200"
              style={active ? {
                background: 'rgba(139,92,246,0.28)',
                color: '#ddd6fe',
                boxShadow: 'inset 0 0 0 1px rgba(167,139,250,0.4), 0 0 14px rgba(139,92,246,0.2)',
              } : {
                color: 'rgba(255,255,255,0.45)',
              }}
            >
              <span className="sm:hidden">{flag} {short}</span>
              <span className="hidden sm:inline">{flag} {label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
