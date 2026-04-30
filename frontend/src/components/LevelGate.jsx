import { Lock } from 'lucide-react';
import { useGamificationStore } from '@/store/useGamificationStore';

export default function LevelGate({ requiredLevel, children, label = '' }) {
  const level = useGamificationStore((s) => s.level);

  if (level >= requiredLevel) return children;

  return (
    <div className="relative select-none">
      <div className="pointer-events-none opacity-30 blur-[2px]">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-slate-950/70 backdrop-blur-sm border border-white/10">
        <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center border border-white/10">
          <Lock className="w-6 h-6 text-white/50" />
        </div>
        <div className="text-center px-4">
          <p className="text-white font-bold text-sm">{label || 'Locked'}</p>
          <p className="text-white/40 text-xs mt-1">
            Reach <span className="text-yellow-400 font-bold">Level {requiredLevel}</span> to unlock
          </p>
          <p className="text-white/25 text-xs">Your level: {level}</p>
        </div>
      </div>
    </div>
  );
}
