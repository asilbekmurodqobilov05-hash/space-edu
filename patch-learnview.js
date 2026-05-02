const fs = require('fs');

let content = fs.readFileSync('frontend/src/views/learn/LearnView.jsx', 'utf8');

if (!content.includes('{ t, i18n }') && content.includes('useTranslation()')) {
  content = content.replace('const { t } = useTranslation();', 'const { t, i18n } = useTranslation();');
}

content = content.replace(
  `{section.title}`,
  `{i18n.language === 'en' ? (section.titleEn || section.title) : i18n.language === 'ru' ? (section.titleRu || section.title) : section.title}`
);

content = content.replace(
  `{section.titleEn}`,
  `{i18n.language === 'en' ? section.title : section.titleEn}`
);

fs.writeFileSync('frontend/src/views/learn/LearnView.jsx', content);
console.log('Patched LearnView.jsx');
