// Level requirements for content sections
// User's gamification level must be >= requiredLevel to access
export const LEVEL_GATES = {
  'space-game':      { requiredLevel: 1,  label: 'Space Run' },
  'daily-challenge': { requiredLevel: 1,  label: 'Daily Challenge' },
  'course-level-2':  { requiredLevel: 1,  label: 'Course Level 2' },
  'course-level-3':  { requiredLevel: 1,  label: 'Course Level 3' },
  'market-premium':  { requiredLevel: 1,  label: 'Premium Items' },
  'portfolio':       { requiredLevel: 1,  label: 'Portfolio' },
};

export const XP_FOR_LEVEL = (level) => Math.pow(level - 1, 2) * 100;
export const LEVEL_FROM_XP = (xp) => Math.floor(Math.sqrt(xp / 100)) + 1;

export function isUnlocked(gateKey, userLevel) {
  const gate = LEVEL_GATES[gateKey];
  if (!gate) return true;
  return userLevel >= gate.requiredLevel;
}
