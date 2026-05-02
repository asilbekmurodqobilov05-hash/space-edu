const fs = require('fs');

const filesToPatch = [
  'frontend/src/views/learn/PhysicsTopicView.jsx',
  'frontend/src/views/learn/AstronomyTopicView.jsx',
  'frontend/src/views/learn/CreativityTopicView.jsx',
  'frontend/src/views/learn/InterviewsTopicView.jsx',
];

filesToPatch.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Find the export default function and add const { i18n } = useTranslation();
    if (!content.includes('const { i18n } = useTranslation();') && content.includes('function ') && content.includes('useTranslation')) {
      const functionName = file.split('/').pop().replace('.jsx', '');
      const regex = new RegExp(`export default function ${functionName}\\(\\) {`);
      content = content.replace(regex, `export default function ${functionName}() {\n  const { i18n } = useTranslation();`);
      fs.writeFileSync(file, content);
      console.log('Fixed i18n missing in ' + file);
    }
  }
});
