import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { useUserStore } from '@/store/useUserStore';

const LANGS = [
  { code: 'UZB', label: "O'zbekcha", flag: '🇺🇿' },
  { code: 'ENG', label: 'English',   flag: '🇬🇧' },
  { code: 'RUS', label: 'Русский',   flag: '🇷🇺' },
];

export default function SectionPageHeader({ title, color = '#00e5ff', backPath = '/learn' }) {
  const navigate = useNavigate();
  const [langOpen, setLangOpen] = useState(false);
  const language = useUserStore((s) => s.language);
  const setLanguage = useUserStore((s) => s.setLanguage);
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const currentLang = LANGS.find((l) => l.code === language) || LANGS[1];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'sticky',
        top: '76px',
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        background: 'rgba(3,2,8,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Go Back */}
      <button
        onClick={() => navigate(backPath)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 20px',
          borderRadius: '14px',
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.05)',
          color: 'rgba(255,255,255,0.7)',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.25s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
          e.currentTarget.style.color = '#fff';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
          e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
        }}
      >
        <ArrowLeft style={{ width: '18px', height: '18px' }} />
        Orqaga
      </button>

      {/* Center title */}
      <h1
        style={{
          fontSize: '22px',
          fontWeight: 800,
          color: color,
          margin: 0,
          textShadow: `0 0 30px ${color}44`,
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </h1>

      {/* Empty div to balance flex layout and keep title centered */}
      <div style={{ width: '100px' }}></div>
    </motion.header>
  );
}
