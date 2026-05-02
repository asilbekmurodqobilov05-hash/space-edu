const fs = require('fs');

const renderReplacements = [
  {
    file: 'frontend/src/views/learn/PhysicsView.jsx',
    replace: [
      {
        find: `{topic.title}`,
        replace: `{i18n.language === 'en' ? (topic.titleEn || topic.title) : i18n.language === 'ru' ? (topic.titleRu || topic.title) : topic.title}`
      },
      {
        find: `{topic.titleEn}`,
        replace: `{i18n.language === 'en' ? topic.title : topic.titleEn}`
      }
    ]
  },
  {
    file: 'frontend/src/views/learn/AstronomyView.jsx',
    replace: [
      {
        find: `{topic.title}`,
        replace: `{i18n.language === 'en' ? (topic.titleEn || topic.title) : i18n.language === 'ru' ? (topic.titleRu || topic.title) : topic.title}`
      },
      {
        find: `{topic.titleEn}`,
        replace: `{i18n.language === 'en' ? topic.title : topic.titleEn}`
      }
    ]
  },
  {
    file: 'frontend/src/views/learn/CreativityView.jsx',
    replace: [
      {
        find: `{topic.title}`,
        replace: `{i18n.language === 'en' ? (topic.titleEn || topic.title) : i18n.language === 'ru' ? (topic.titleRu || topic.title) : topic.title}`
      },
      {
        find: `{topic.titleEn}`,
        replace: `{i18n.language === 'en' ? topic.title : topic.titleEn}`
      }
    ]
  },
  {
    file: 'frontend/src/views/learn/InterviewsView.jsx',
    replace: [
      {
        find: `{topic.title}`,
        replace: `{i18n.language === 'en' ? (topic.titleEn || topic.title) : i18n.language === 'ru' ? (topic.titleRu || topic.title) : topic.title}`
      },
      {
        find: `{topic.titleEn}`,
        replace: `{i18n.language === 'en' ? topic.title : topic.titleEn}`
      }
    ]
  },
  {
    file: 'frontend/src/views/learn/PhysicsTopicView.jsx',
    replace: [
      {
        find: `title={topic.title}`,
        replace: `title={i18n.language === 'en' ? (topic.titleEn || topic.title) : i18n.language === 'ru' ? (topic.titleRu || topic.title) : topic.title}`
      }
    ]
  },
  {
    file: 'frontend/src/views/learn/AstronomyTopicView.jsx',
    replace: [
      {
        find: `title={topic.title}`,
        replace: `title={i18n.language === 'en' ? (topic.titleEn || topic.title) : i18n.language === 'ru' ? (topic.titleRu || topic.title) : topic.title}`
      }
    ]
  },
  {
    file: 'frontend/src/views/learn/CreativityTopicView.jsx',
    replace: [
      {
        find: `title={topic.titleEn}`,
        replace: `title={i18n.language === 'en' ? (topic.titleEn || topic.title) : i18n.language === 'ru' ? (topic.titleRu || topic.title) : topic.title}`
      }
    ]
  },
  {
    file: 'frontend/src/views/learn/InterviewsTopicView.jsx',
    replace: [
      {
        find: `title={topic.title}`,
        replace: `title={i18n.language === 'en' ? (topic.titleEn || topic.title) : i18n.language === 'ru' ? (topic.titleRu || topic.title) : topic.title}`
      }
    ]
  }
];

renderReplacements.forEach(({ file, replace }) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Add i18n to useTranslation if missing in views that need it
    if (!content.includes('{ t, i18n }') && content.includes('useTranslation()')) {
      content = content.replace('const { t } = useTranslation();', 'const { t, i18n } = useTranslation();');
    }

    replace.forEach(({ find, replace }) => {
      content = content.split(find).join(replace);
    });

    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
});
