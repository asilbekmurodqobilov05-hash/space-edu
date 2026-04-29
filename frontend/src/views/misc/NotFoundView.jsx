import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function NotFoundView() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="text-8xl mb-8"
        >
          👨‍🚀
        </motion.div>
        <h1 className="text-[120px] font-black leading-none text-white/10 mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-3">Lost in Space</h2>
        <p className="text-white/40 mb-8 max-w-sm mx-auto">
          This sector of the universe doesn't exist. Navigation systems suggest returning to base.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-colors"
        >
          Return to Earth
        </button>
      </motion.div>
    </div>
  );
}
