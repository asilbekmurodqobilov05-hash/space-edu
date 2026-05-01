import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import SectionPageHeader from '@/components/layout/SectionPageHeader';
import { astronomyTopicsData } from '@/data/astronomyTopicsData';
import { interviewsTopicsData } from '@/data/interviewsTopicsData';
import { creativityTopicsData } from '@/data/creativityTopicsData';
import { physicsTopicsData } from '@/data/physicsTopicsData';
import { Play, Info, CheckCircle2, Trophy, Coins, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useLikesStore } from '@/store/useLikesStore';
import { useLearningStore } from '@/store/useLearningStore';
import confetti from 'canvas-confetti';

export default function UniversalLessonView() {
  const { subject, topicId, subIdx, lessonIdx, partIdx } = useParams();
  const navigate = useNavigate();
  const addRewards = useGamificationStore(s => s.addRewards);
  const completeLessonLocal = useLearningStore(s => s.completeLesson);
  const { likeLesson, unlikeLesson, isLiked } = useLikesStore();
  
  const [completed, setCompleted] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [toast, setToast] = useState(null);

  const lessonUniqueId = `${subject}-${topicId}-${subIdx || ''}-${lessonIdx || ''}-${partIdx || ''}`;
  const liked = isLiked(lessonUniqueId);

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
    const pIdx = subIdx !== undefined ? subIdx : lessonIdx;
    
    if (topic.sections) {
      const allItems = topic.sections.flatMap(s => s.lessons);
      parentItem = allItems[parseInt(pIdx)];
    } else {
      parentItem = topic.lessons[parseInt(pIdx)];
    }

    if (parentItem && parentItem.subLessons) {
      const sIdx = partIdx !== undefined ? partIdx : (subIdx !== undefined ? lessonIdx : 0);
      lesson = parentItem.subLessons[parseInt(sIdx)];
    } else if (parentItem) {
      lesson = parentItem;
    }
  }

  // Determine video URL
  let finalVideoUrl = "";
  if (lesson && typeof lesson === 'object' && lesson.videoUrl) {
    // If lesson has a direct videoUrl, use it. Ensure it's embeddable.
    let url = lesson.videoUrl;
    if (url.includes('youtube.com/watch?v=')) {
      url = url.replace('watch?v=', 'embed/');
    }
    finalVideoUrl = `${url}${url.includes('?') ? '&' : '?'}autoplay=1&mute=0&rel=0`;
  } else {
    // Pool fallback
    const videoPool = [
      "libKVRa01L8", "2HoTK_Gqi2Q", "0KBjnN7kUKo", "HCDVN7DCzYE", "XycHvvnc2X4",
      "epZdZaEQhS0", "m4NXbFOiOGk", "D85gxYG9qhM", "921VbEMAwwY", "XJSKezIdHJY"
    ];
    const vidId = videoPool[(parseInt(lessonIdx || 0) + parseInt(partIdx || 0) + parseInt(subIdx || 0)) % videoPool.length];
    finalVideoUrl = `https://www.youtube.com/embed/${vidId}?autoplay=1&mute=0&rel=0`;
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
  const displayTitle = partIdx ? `${lessonName} - ${parseInt(partIdx) + 1}-qism` : lessonName;

  const handleComplete = () => {
    if (completed) return;
    setCompleted(true);
    addRewards(25, 25);
    completeLessonLocal(lessonUniqueId, topicId, 100, 25, {
      title: displayTitle,
      subject: subject
    });
    setShowRewardModal(true);
    
    setToast({ msg: "Progress saved locally!", type: 'success' });
    setTimeout(() => setToast(null), 3000);

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: [color, '#ffffff', '#ffd700']
    });
  };

  const handleToggleLike = () => {
    if (liked) {
      unlikeLesson(lessonUniqueId);
    } else {
      likeLesson({
        id: lessonUniqueId,
        title: displayTitle,
        subject: subject,
        url: window.location.pathname
      });
    }
  };

  return (
    <div className="pt-24 pb-20" style={{ minHeight: '100vh', background: 'transparent' }}>
      <SectionPageHeader title={displayTitle} color={color} backPath={backPath} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        {/* PROMINENT VIDEO PLAYER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16/9',
            borderRadius: '32px',
            overflow: 'hidden',
            background: '#000',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: `0 30px 90px rgba(0,0,0,0.6), 0 0 50px ${color}15`,
            marginBottom: '48px'
          }}
        >
          <iframe
            width="100%"
            height="100%"
            src={finalVideoUrl}
            title={lessonName}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </motion.div>

        {/* INFO SECTION BELOW VIDEO */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 350px', 
          gap: '40px',
          alignItems: 'start'
        }}>
          {/* Main Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span style={{ padding: '6px 14px', borderRadius: '10px', background: `${color}20`, color: color, fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Video Dars
                </span>
                {completed && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4ade80', fontSize: '14px', fontWeight: 600 }}>
                    <CheckCircle2 size={18} /> Yakunlandi
                  </span>
                )}
              </div>
              <h1 style={{ fontSize: '42px', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: '20px' }}>
                {displayTitle}
              </h1>
              <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: '800px' }}>
                Ushbu darsda siz {lessonName.toLowerCase()} mavzusini chuqur o'rganasiz. 
                Videoda keltirilgan vizualizatsiyalar va tushuntirishlar sizga murakkab tushunchalarni oson o'zlashtirishga yordam beradi.
                Dars yakunida siz koinot sirlariga bir qadam yaqinlashasiz.
              </p>
            </div>

            <div style={{ 
              background: 'rgba(255,255,255,0.03)', 
              borderRadius: '24px', 
              padding: '32px',
              border: '1px solid rgba(255,255,255,0.06)'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Info size={20} color={color} /> Mavzu tafsilotlari
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: 'rgba(255,255,255,0.5)', fontSize: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span>Kategoriya</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{subject.charAt(0).toUpperCase() + subject.slice(1)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span>Davomiyligi</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>~15 daqiqa</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Mukofot</span>
                  <span style={{ color: '#fbbf24', fontWeight: 700 }}>25 XP + 25 Coins</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            style={{ position: 'sticky', top: '100px' }}
          >
            <button
              onClick={handleComplete}
              disabled={completed}
              style={{
                width: '100%',
                padding: '24px',
                borderRadius: '20px',
                background: completed ? 'rgba(255,255,255,0.05)' : color,
                border: 'none',
                color: completed ? 'rgba(255,255,255,0.3)' : '#000',
                fontSize: '18px',
                fontWeight: 800,
                cursor: completed ? 'default' : 'pointer',
                transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                boxShadow: completed ? 'none' : `0 10px 30px ${color}40`,
                transform: completed ? 'none' : 'scale(1)',
              }}
              onMouseEnter={(e) => !completed && (e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)')}
              onMouseLeave={(e) => !completed && (e.currentTarget.style.transform = 'translateY(0) scale(1)')}
            >
              {completed ? <CheckCircle2 /> : <Play />}
              {completed ? 'Yakunlandi' : 'Darsni tugatish'}
            </button>

            <button
              onClick={handleToggleLike}
              style={{
                width: '100%',
                padding: '20px',
                marginTop: '16px',
                borderRadius: '20px',
                background: liked ? 'rgba(244, 63, 94, 0.1)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${liked ? 'rgba(244, 63, 94, 0.3)' : 'rgba(255,255,255,0.1)'}`,
                color: liked ? '#f43f5e' : '#fff',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
              }}
              onMouseEnter={(e) => {
                if (!liked) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!liked) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                }
              }}
            >
              <Heart 
                fill={liked ? '#f43f5e' : 'none'} 
                color={liked ? '#f43f5e' : 'currentColor'} 
              />
              {liked ? 'Yoqtirildi (Liked)' : 'Yoqtirish (Like)'}
            </button>

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
                Darsni to'liq ko'rib bo'lgach tugmani bosing va mukofotlarga ega bo'ling!
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* REWARD MODAL */}
      <AnimatePresence>
        {showRewardModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(10px)',
              zIndex: 1000,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setShowRewardModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              style={{
                background: '#12141a',
                borderRadius: '40px',
                padding: '48px',
                width: '100%',
                maxWidth: '450px',
                textAlign: 'center',
                border: `2px solid ${color}`,
                boxShadow: `0 0 60px ${color}30`
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ 
                width: '100px', height: '100px', borderRadius: '50%', background: `${color}20`, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px'
              }}>
                <Trophy size={50} color={color} />
              </div>
              <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#fff', marginBottom: '12px' }}>Ajoyib natija!</h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '17px', marginBottom: '40px' }}>
                Siz darsni muvaffaqiyatli yakunladingiz va quyidagi mukofotlarga ega bo'ldingiz:
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '40px' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '24px', flex: 1, border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ color: '#00e5ff', fontSize: '24px', fontWeight: 900, marginBottom: '4px' }}>+25</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', textTransform: 'uppercase', fontWeight: 700 }}>XP</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '24px', flex: 1, border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ color: '#fbbf24', fontSize: '24px', fontWeight: 900, marginBottom: '4px' }}>+25</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', textTransform: 'uppercase', fontWeight: 700 }}>Coins</div>
                </div>
              </div>

              <button
                onClick={() => setShowRewardModal(false)}
                style={{
                  width: '100%', padding: '18px', borderRadius: '18px', background: color, border: 'none',
                  color: '#000', fontWeight: 800, fontSize: '16px', cursor: 'pointer'
                }}
              >
                Tushunarli
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simple Toast */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl bg-space-900 border border-white/10 shadow-2xl backdrop-blur-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <div className={`w-2 h-2 rounded-full ${toast.type === 'success' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
          <p className="text-sm font-medium text-white">{toast.msg}</p>
        </div>
      )}
    </div>
  );
}
