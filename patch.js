const fs = require('fs');

const dict = {
  'Kinematika': 'Кинематика',
  'Dinamika': 'Динамика',
  'Statika': 'Статика',
  'Suyuqlik va gazlar mexanikasi': 'Механика жидкостей и газов',
  "Tebranishlar va to'lqinlar": 'Колебания и волны',
  'Molekulyar fizika': 'Молекулярная физика',
  'Termodinamika': 'Термодинамика',
  'Elektrostatika': 'Электростатика',
  "O'zgarmas tok qonunlari": 'Законы постоянного тока',
  'Turli muhitlarda elektr qonunlari': 'Законы электрического тока в различных средах',
  'Elektromagnit hodisalar': 'Электромагнитные явления',
  "Elektromagnit tebranishlar va to'lqinlar": 'Электромагнитные колебания и волны',
  'Optika': 'Оптика',
  'Atom va yadro fizikasi': 'Атомная и ядерная физика',
  'Quyosh tizimi': 'Солнечная система',
  'Yulduzlar': 'Звезды',
  "Sun'iy yo'ldoshlar va raketalar": 'Искусственные спутники и ракеты',
  'Galaktika va Olam': 'Галактика и Вселенная',
  'Sayyoralar modullari': 'Модули планет',
  "Raketalar va sun'iy yo'ldoshlar": 'Ракеты и искусственные спутники',
  'Professorlar': 'Профессора',
  'Kosmonavtlar': 'Космонавты',
  'Boshqa ishchilar': 'Другие работники'
};

function patchFile(path) {
  let content = fs.readFileSync(path, 'utf8');
  for (const [uz, ru] of Object.entries(dict)) {
    // Regex to find "title: 'UzbekName', titleEn: 'EnglishName',"
    const uzEscaped = uz.replace(/'/g, "\\\\'");
    const regex = new RegExp(`(title:\\s*['"]${uzEscaped}['"],\\s*titleEn:\\s*['"][^'"]*['"],)`, 'g');
    content = content.replace(regex, `$1 titleRu: '${ru}',`);
  }
  fs.writeFileSync(path, content);
  console.log('Patched ' + path);
}

const files = [
 'frontend/src/views/learn/PhysicsView.jsx',
 'frontend/src/views/learn/AstronomyView.jsx',
 'frontend/src/views/learn/CreativityView.jsx',
 'frontend/src/views/learn/InterviewsView.jsx',
 'frontend/src/data/physicsTopicsData.js',
 'frontend/src/data/astronomyTopicsData.js',
 'frontend/src/data/creativityTopicsData.js',
 'frontend/src/data/interviewsTopicsData.js'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    patchFile(f);
  }
});
