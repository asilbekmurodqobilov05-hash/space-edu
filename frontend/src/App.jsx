import { lazy, Suspense } from 'react';
import { AnimatePresence } from 'motion/react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Navigation from '@/components/layout/Navigation';
import ParticleBackground from '@/components/layout/ParticleBackground';
import PageTransition from '@/components/layout/PageTransition';
import ChatSystem from '@/features/chat/ChatSystem';
import ProtectedRoute from '@/components/ProtectedRoute';
import LevelGate from '@/components/LevelGate';
import Footer from "@/components/layout/Footer";

// Auth pages — small, load eagerly
import LoginView from '@/views/auth/LoginView';
import RegisterView from '@/views/auth/RegisterView';
import NotFoundView from '@/views/misc/NotFoundView';

// Lazy-load heavy 3D / game views
const SolarSystemView = lazy(() => import('@/views/explore/SolarSystemView'));
const StarFinderView   = lazy(() => import('@/views/explore/StarFinderView'));
const SpaceRunView     = lazy(() => import('@/views/game/SpaceRunView'));

// Regular views
import HomeView           from '@/views/home/HomeView';
import LearnView          from '@/views/learn/LearnView';
import PhysicsView        from '@/views/learn/PhysicsView';
import PhysicsTopicView   from '@/views/learn/PhysicsTopicView';
import PhysicsLessonView  from '@/views/learn/PhysicsLessonView';
import AstronomyView      from '@/views/learn/AstronomyView';
import AstronomyTopicView  from '@/views/learn/AstronomyTopicView';
import CreativityView     from '@/views/learn/CreativityView';
import CreativityTopicView from '@/views/learn/CreativityTopicView';
import SubTopicView        from '@/views/learn/SubTopicView';
import InterviewsView     from '@/views/learn/InterviewsView';
import InterviewsTopicView from '@/views/learn/InterviewsTopicView';
import ProblemsView       from '@/views/learn/ProblemsView';
import ProblemDetailView  from '@/views/learn/ProblemDetailView';
import UnitView           from '@/views/learn/UnitView';
import LessonView         from '@/views/learn/LessonView';
import UniversalLessonView from '@/views/learn/UniversalLessonView';
import ExploreView        from '@/views/explore/ExploreView';
import SpaceLabView       from '@/views/explore/SpaceLabView';
import DailyChallengeView from '@/views/community/DailyChallengeView';
import LeaderboardView    from '@/views/community/LeaderboardView';
import CalendarView       from '@/views/community/CalendarView';
import NewsView           from '@/views/community/NewsView';
import LiveSpaceView      from '@/views/community/LiveSpaceView';
import CareersView        from '@/views/profile/CareersView';
import PortfolioView      from '@/views/profile/PortfolioView';
import ProfileView        from '@/views/profile/ProfileView';
import HistoryView        from '@/views/misc/HistoryView';
import MarketView         from '@/views/misc/MarketView';
import UzSpaceView        from '@/views/misc/UzSpaceView';
import ChatView           from '@/views/chat/ChatView';
import QuizHubView        from "@/views/quiz/QuizHubView";
import QuizSessionView    from "@/views/quiz/QuizSessionView";

const GAME_PATH = '/space-game';

function Lazy({ children }) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white/30 text-sm">Loading…</div>}>
      {children}
    </Suspense>
  );
}

function PT({ children }) {
  return <PageTransition>{children}</PageTransition>;
}

export default function App() {
  const location = useLocation();
  const isGame = location.pathname === GAME_PATH;
  const isAuth = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="relative min-h-screen text-white font-sans">
      {!isAuth && location.pathname !== '/' && !isGame && <ParticleBackground />}
      {!isGame && !isAuth && <Navigation />}

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public */}
            <Route path="/"              element={<PT><HomeView /></PT>} />
            <Route path="/login"         element={<LoginView />} />
            <Route path="/register"      element={<RegisterView />} />
            <Route path="/leaderboard"   element={<PT><LeaderboardView /></PT>} />
            <Route path="/history"       element={<PT><HistoryView /></PT>} />
            <Route path="/uzb"           element={<PT><UzSpaceView /></PT>} />
            <Route path="/explore"       element={<PT><ExploreView /></PT>} />
            <Route path="/3d-solar-system" element={<Lazy><PT><SolarSystemView /></PT></Lazy>} />
            <Route path="/star-finder"   element={<Lazy><PT><StarFinderView /></PT></Lazy>} />
            <Route path="/calendar"      element={<PT><CalendarView /></PT>} />
            <Route path="/news"          element={<PT><NewsView /></PT>} />
            <Route path="/live"          element={<PT><LiveSpaceView /></PT>} />
            <Route path="/quiz"          element={<PT><QuizHubView /></PT>} />
            <Route path="/quiz/:category" element={<PT><QuizSessionView /></PT>} />

            {/* Learn — public content, progress needs auth */}
            <Route path="/learn"                                  element={<PT><LearnView /></PT>} />
            <Route path="/learn/physics"                          element={<PT><PhysicsView /></PT>} />
            <Route path="/learn/physics/:topicId"                 element={<PT><PhysicsTopicView /></PT>} />
            <Route path="/learn/physics/:topicId/lesson/:lessonIdx" element={<PT><PhysicsLessonView /></PT>} />
            <Route path="/learn/astronomy"                        element={<PT><AstronomyView /></PT>} />
            <Route path="/learn/astronomy/:topicId"              element={<PT><AstronomyTopicView /></PT>} />

            <Route path="/learn/creativity"                       element={<PT><CreativityView /></PT>} />
            <Route path="/learn/creativity/:topicId"             element={<PT><CreativityTopicView /></PT>} />

            <Route path="/learn/interviews"                       element={<PT><InterviewsView /></PT>} />
            <Route path="/learn/interviews/:topicId"             element={<PT><InterviewsTopicView /></PT>} />

            {/* Unified Sub-Topic and Lesson routes for Astronomy, Creativity, and Interviews */}
            <Route path="/learn/:subject/:topicId/sub/:subIdx" element={<PT><SubTopicView /></PT>} />
            <Route path="/learn/:subject/:topicId/sub/:subIdx/lesson/:lessonIdx" element={<PT><UniversalLessonView /></PT>} />

            <Route path="/learn/problems"                         element={<PT><ProblemsView /></PT>} />
            <Route path="/learn/problems/:id"                     element={<PT><ProblemDetailView /></PT>} />
            <Route path="/unit/:unitId"                           element={<PT><UnitView /></PT>} />
            <Route path="/lesson/:unitId/:lessonId"               element={<PT><LessonView /></PT>} />

            {/* Protected — require login */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile"   element={<PT><ProfileView /></PT>} />
              <Route path="/careers"   element={<PT><CareersView /></PT>} />
              <Route path="/portfolio" element={<PT><PortfolioView /></PT>} />
              <Route path="/market"    element={<PT><MarketView /></PT>} />
              <Route path="/chat"      element={<PT><ChatView /></PT>} />

              {/* Level-gated */}
              <Route path="/daily" element={
                <PT>
                  <LevelGate requiredLevel={1} label="Daily Challenge">
                    <DailyChallengeView />
                  </LevelGate>
                </PT>
              } />
              <Route path="/space-game" element={
                <LevelGate requiredLevel={1} label="Space Run">
                  <Lazy><SpaceRunView /></Lazy>
                </LevelGate>
              } />
              <Route path="/lab" element={
                <PT>
                  <LevelGate requiredLevel={1} label="Space Lab">
                    <SpaceLabView />
                  </LevelGate>
                </PT>
              } />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundView />} />
          </Routes>
        </AnimatePresence>
      </main>

      {!isGame && !isAuth && <ChatSystem />}
      {!isGame && !isAuth && <Footer />}
    </div>
  );
}
