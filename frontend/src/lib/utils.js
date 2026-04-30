export function calculateLevel(xp) {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function formatNumber(n) {
  return n.toLocaleString();
}

export function getFieldByLang(obj, fieldBase, language) {
  if (!obj) return '';
  const suffixMap = {
    'ENG': '_en',
    'RUS': '_ru',
    'UZB': '_uz'
  };
  const suffix = suffixMap[language] || '_en';
  return obj[`${fieldBase}${suffix}`] || obj[`${fieldBase}_en`] || '';
}
