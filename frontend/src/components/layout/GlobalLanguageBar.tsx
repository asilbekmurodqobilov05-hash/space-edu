import { useLocation } from "react-router-dom";
import { useUserStore, type Language } from "@/store/useUserStore";

const ORDER: { code: Language; label: string; short: string; flag: string }[] = [
  { code: "UZB", label: "O'zbekcha", short: "O'Z", flag: "🇺🇿" },
  { code: "ENG", label: "English", short: "EN", flag: "🇬🇧" },
  { code: "RUS", label: "Русский", short: "RU", flag: "🇷🇺" },
];

/**
 * Fixed language switcher — visible on every route (including Space Run) so Uzbek is always one tap away.
 * Displays flag emojis alongside language labels for visual identification.
 */
export default function GlobalLanguageBar() {
  const { pathname } = useLocation();
  const language = useUserStore((s) => s.language);
  const setLanguage = useUserStore((s) => s.setLanguage);
  const bottomOffset =
    pathname === "/space-game"
      ? "max(4.75rem, calc(env(safe-area-inset-bottom) + 3.25rem))"
      : "max(0.75rem, env(safe-area-inset-bottom))";

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-[60] flex justify-center px-3 pointer-events-none"
      style={{ bottom: bottomOffset }}
      role="toolbar"
      aria-label="Site language"
    >
      <div className="pointer-events-auto flex items-center gap-0.5 rounded-full border border-cyan-500/25 bg-[#070c1a]/92 backdrop-blur-xl p-1 shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.06)]">
        {ORDER.map(({ code, label, short, flag }) => {
          const active = language === code;
          return (
            <button
              key={code}
              type="button"
              onClick={() => setLanguage(code)}
              title={label}
              aria-pressed={active}
              className={`relative min-h-[2.75rem] min-w-[2.75rem] sm:min-w-[4.5rem] rounded-full px-2.5 sm:px-3 text-xs sm:text-sm font-bold font-display transition-colors duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/70 ${
                active
                  ? "bg-gradient-to-b from-cyan-500/35 to-emerald-600/25 text-white ring-1 ring-cyan-400/40 shadow-[0_0_16px_rgba(34,211,238,0.2)]"
                  : "text-white/55 hover:text-white hover:bg-white/10"
              }`}
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
