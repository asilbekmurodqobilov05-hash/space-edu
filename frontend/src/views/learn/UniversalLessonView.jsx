import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import SectionPageHeader from '@/components/layout/SectionPageHeader';
import { astronomyTopicsData } from '@/data/astronomyTopicsData';
import { interviewsTopicsData } from '@/data/interviewsTopicsData';
import { creativityTopicsData } from '@/data/creativityTopicsData';
import { physicsTopicsData } from '@/data/physicsTopicsData';
import { Play, Info, Share2, Bookmark } from 'lucide-react';

export default function UniversalLessonView() {
  const { subject, topicId, subIdx, lessonIdx } = useParams();
  const navigate = useNavigate();

  // Determine data source
  let dataSource = null;
  let backPath = "/learn";

  if (subject === 'astronomy') { dataSource = astronomyTopicsData; backPath = `/learn/astronomy/${topicId}/sub/${subIdx}`; }
  else if (subject === 'interviews') { dataSource = interviewsTopicsData; backPath = `/learn/interviews/${topicId}/sub/${subIdx}`; }
  else if (subject === 'creativity') { dataSource = creativityTopicsData; backPath = `/learn/creativity/${topicId}/sub/${subIdx}`; }
  else if (subject === 'physics') { dataSource = physicsTopicsData; backPath = `/learn/physics/${topicId}`; }

  const topic = dataSource ? dataSource[topicId] : null;
  
  // Handle nested sections and sub-lessons
  let lesson = null;
  if (topic) {
    let parentItem = null;
    if (topic.sections) {
      const allItems = topic.sections.flatMap(s => s.lessons);
      parentItem = allItems[parseInt(subIdx)];
    } else {
      parentItem = topic.lessons[parseInt(subIdx)];
    }

    if (parentItem && parentItem.subLessons) {
      lesson = parentItem.subLessons[parseInt(lessonIdx)];
    } else if (parentItem) {
      // Fallback for physics or items without subLessons
      lesson = parentItem;
    }
  }

  if (!lesson) {
    return (
      <div className="pt-32 text-center">
        <h1 className="text-2xl text-white/50">Dars topilmadi (Lesson not found)</h1>
        <button onClick={() => navigate(-1)} className="mt-4 text-blue-400">Orqaga qaytish</button>
      </div>
    );
  }

  const lessonName = typeof lesson === 'object' ? lesson.name : lesson;
  const color = topic.color || '#3b82f6';

  // Pool of high-quality space videos to rotate through
  const videoPool = [
    { url: "https://www.youtube.com/embed/libKVRa01L8", title: "Space Exploration" },
    { url: "https://www.youtube.com/embed/2HoTK_Gqi2Q", title: "The Universe" },
    { url: "https://www.youtube.com/embed/0KBjnN7kUKo", title: "Astrobiology" },
    { url: "https://www.youtube.com/embed/HCDVN7DCzYE", title: "Planet Earth" },
    { url: "https://www.youtube.com/embed/XycHvvnc2X4", title: "Jupiter's Moons" },
    { url: "https://www.youtube.com/embed/epZdZaEQhS0", title: "Saturn's Rings" },
    { url: "https://www.youtube.com/embed/m4NXbFOiOGk", title: "Uranus & Neptune" },
    { url: "https://www.youtube.com/embed/D85gxYG9qhM", title: "Life on Mars" },
    { url: "https://www.youtube.com/embed/921VbEMAwwY", title: "Starship Flight" },
    { url: "https://www.youtube.com/embed/XJSKezIdHJY", title: "ISS Tour" },
  ];

  // Pick 3 unique-ish videos based on the lesson index
  const baseIdx = parseInt(lessonIdx) % videoPool.length;
  const videos = [
    {
      id: 1,
      title: `${lessonName}: Kirish va Asoslar`,
      desc: `Ushbu videoda ${lessonName} haqida umumiy ma'lumot va uning koinotdagi o'rni haqida tushunchalar beriladi.`,
      url: videoPool[baseIdx].url
    },
    {
      id: 2,
      title: `${lessonName}: Ilmiy Tadqiqotlar`,
      desc: `${lessonName} bo'yicha olib borilgan eng so'nggi ilmiy izlanishlar va muhim kashfiyotlar tahlili.`,
      url: videoPool[(baseIdx + 1) % videoPool.length].url
    },
    {
      id: 3,
      title: "Kelajakdagi Missiyalar",
      desc: `Insoniyatning ${lessonName} bilan bog'liq kelajakdagi rejalari va yangi texnologiyalar haqida.`,
      url: videoPool[(baseIdx + 2) % videoPool.length].url
    }
  ];

  return (
    <div className="pt-24 pb-20" style={{ minHeight: '100vh', background: 'transparent' }}>
      <SectionPageHeader title={lessonName} color={color} backPath={backPath} />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Main Section: Video Left, Info Right */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)', 
          gap: '48px',
          alignItems: 'start'
        }}>
          
          {/* LEFT SIDE: Main Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '32px',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '24px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div style={{
              aspectRatio: '16/9',
              borderRadius: '20px',
              overflow: 'hidden',
              background: '#000',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <iframe
                width="100%"
                height="100%"
                src={videos[0].url}
                title={videos[0].title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div style={{ marginTop: '24px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
                {videos[0].title}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', lineHeight: 1.7 }}>
                {videos[0].desc} Ushbu dars orqali siz {lessonName} haqidagi eng qiziqarli va muhim ilmiy faktlar bilan tanishasiz. 
                Koinotning sirli olamiga sayohatni hoziroq boshlang.
              </p>
            </div>
          </motion.div>

          {/* RIGHT SIDE: Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
          >
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              borderRadius: '28px',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '32px',
              backdropFilter: 'blur(10px)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
                  <Info style={{ width: '22px', height: '22px' }} />
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#fff' }}>Dars ma'lumotlari</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                <div style={{ padding: '20px', borderRadius: '18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Mavzu</span>
                  <div style={{ color: '#fff', fontSize: '18px', fontWeight: 600, marginTop: '4px' }}>{lessonName}</div>
                </div>
                <div style={{ padding: '20px', borderRadius: '18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Bo'lim</span>
                  <div style={{ color: '#fff', fontSize: '18px', fontWeight: 600, marginTop: '4px' }}>{topic.titleEn}</div>
                </div>
                <div style={{ padding: '20px', borderRadius: '18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>O'rganish vaqti</span>
                  <div style={{ color: '#fff', fontSize: '18px', fontWeight: 600, marginTop: '4px' }}>45 daqiqa</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button style={{ flex: 1, padding: '16px', borderRadius: '16px', background: color, border: 'none', color: '#000', fontWeight: 700, fontSize: '15px', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                  Sertifikat olish
                </button>
                <button style={{ padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer' }}>
                  <Bookmark style={{ width: '20px', height: '20px' }} />
                </button>
              </div>
            </div>

            {/* Secondary Videos (Quick selection) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h4 style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', paddingLeft: '8px' }}>
                Qo'shimcha darslar
              </h4>
              {videos.slice(1).map((vid) => (
                <div key={vid.id} style={{
                  display: 'flex',
                  gap: '16px',
                  padding: '12px',
                  borderRadius: '20px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}>
                  <div style={{ width: '100px', aspectRatio: '16/9', borderRadius: '10px', overflow: 'hidden', background: '#000' }}>
                     <img src={`https://img.youtube.com/vi/${vid.url.split('/').pop()}/0.jpg`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}>{vid.title}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>12:45</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
