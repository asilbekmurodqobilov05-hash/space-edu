import { lazy, Suspense } from 'react';
import { AnimatePresence } from 'motion/react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

<<<<<<< HEAD
import Navigation from "@/components/layout/Navigation";
import ParticleBackground from "@/components/layout/ParticleBackground";
import PageTransition from "@/components/layout/PageTransition";
import AskCosmos from "@/features/ai/AskCosmos";


import HomeView from "@/views/home/HomeView";
import LearnView from "@/views/learn/LearnView";
import PhysicsView from "@/views/learn/PhysicsView";
import PhysicsTopicView from "@/views/learn/PhysicsTopicView";
import PhysicsLessonView from "@/views/learn/PhysicsLessonView";
import AstronomyView from "@/views/learn/AstronomyView";
import CreativityView from "@/views/learn/CreativityView";
import InterviewsView from "@/views/learn/InterviewsView";
import ProblemsView from "@/views/learn/ProblemsView";
import UnitView from "@/views/learn/UnitView";
import LessonView from "@/views/learn/LessonView";
import ExploreView from "@/views/explore/ExploreView";
import SolarSystemView from "@/views/explore/SolarSystemView";
import StarFinderView from "@/views/explore/StarFinderView";
import SpaceLabView from "@/views/explore/SpaceLabView";
import DailyChallengeView from "@/views/community/DailyChallengeView";
import LeaderboardView from "@/views/community/LeaderboardView";
import CalendarView from "@/views/community/CalendarView";
import NewsView from "@/views/community/NewsView";
import LiveSpaceView from "@/views/community/LiveSpaceView";
import CareersView from "@/views/profile/CareersView";
import PortfolioView from "@/views/profile/PortfolioView";
import HistoryView from "@/views/misc/HistoryView";
import MarketView from "@/views/misc/MarketView";
import UzSpaceView from "@/views/misc/UzSpaceView";
import SpaceRunView from "@/views/game/SpaceRunView";
import QuizHubView from "@/views/quiz/QuizHubView";
import QuizSessionView from "@/views/quiz/QuizSessionView";
import Footer from "@/components/layout/Footer";
=======
import Navigation from '@/components/layout/Navigation';
import ParticleBackground from '@/components/layout/ParticleBackground';
import PageTransition from '@/components/layout/PageTransition';
import AskCosmos from '@/features/ai/AskCosmos';
import GlobalLanguageBar from '@/components/layout/GlobalLanguageBar';
import ProtectedRoute from '@/components/ProtectedRoute';
import LevelGate from '@/components/LevelGate';

// Auth pages — small, load eagerly
import LoginView from '@/views/auth/LoginView';
import RegisterView from '@/views/auth/RegisterView';
import NotFoundView from '@/views/misc/NotFoundView';
>>>>>>> 19217f396fae14b5ff58dd59c373b59f0d366ec2

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
import CreativityView     from '@/views/learn/CreativityView';
import InterviewsView     from '@/views/learn/InterviewsView';
import ProblemsView       from '@/views/learn/ProblemsView';
import UnitView           from '@/views/learn/UnitView';
import LessonView         from '@/views/learn/LessonView';
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
<<<<<<< HEAD
            <Route path="/"                    element={<PageTransition><HomeView /></PageTransition>} />
            <Route path="/learn"               element={<PageTransition><LearnView /></PageTransition>} />
            <Route path="/learn/physics"       element={<PageTransition><PhysicsView /></PageTransition>} />
            <Route path="/learn/physics/:topicId" element={<PageTransition><PhysicsTopicView /></PageTransition>} />
            <Route path="/learn/physics/:topicId/lesson/:lessonIdx" element={<PageTransition><PhysicsLessonView /></PageTransition>} />
            <Route path="/learn/astronomy"     element={<PageTransition><AstronomyView /></PageTransition>} />
            <Route path="/learn/creativity"    element={<PageTransition><CreativityView /></PageTransition>} />
            <Route path="/learn/interviews"    element={<PageTransition><InterviewsView /></PageTransition>} />
            <Route path="/learn/problems"      element={<PageTransition><ProblemsView /></PageTransition>} />
            <Route path="/unit/:unitId"        element={<PageTransition><UnitView /></PageTransition>} />
            <Route path="/lesson/:unitId/:lessonId" element={<PageTransition><LessonView /></PageTransition>} />
            <Route path="/explore"             element={<PageTransition><ExploreView /></PageTransition>} />
            <Route path="/3d-solar-system"     element={<PageTransition><SolarSystemView /></PageTransition>} />
            <Route path="/star-finder"         element={<PageTransition><StarFinderView /></PageTransition>} />
            <Route path="/lab"                 element={<PageTransition><SpaceLabView /></PageTransition>} />
            <Route path="/daily"               element={<PageTransition><DailyChallengeView /></PageTransition>} />
            <Route path="/leaderboard"         element={<PageTransition><LeaderboardView /></PageTransition>} />
            <Route path="/calendar"            element={<PageTransition><CalendarView /></PageTransition>} />
            <Route path="/news"                element={<PageTransition><NewsView /></PageTransition>} />
            <Route path="/live"               element={<PageTransition><LiveSpaceView /></PageTransition>} />
            <Route path="/careers"             element={<PageTransition><CareersView /></PageTransition>} />
            <Route path="/portfolio"           element={<PageTransition><PortfolioView /></PageTransition>} />
            <Route path="/history"             element={<PageTransition><HistoryView /></PageTransition>} />
            <Route path="/market"              element={<PageTransition><MarketView /></PageTransition>} />
            <Route path="/uzb"                 element={<PageTransition><UzSpaceView /></PageTransition>} />
            <Route path="/space-game"          element={<SpaceRunView />} />
            <Route path="/quiz"                element={<PageTransition><QuizHubView /></PageTransition>} />
            <Route path="/quiz/:category"      element={<PageTransition><QuizSessionView /></PageTransition>} />
=======

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

            {/* Learn — public content, progress needs auth */}
            <Route path="/learn"                                  element={<PT><LearnView /></PT>} />
            <Route path="/learn/physics"                          element={<PT><PhysicsView /></PT>} />
            <Route path="/learn/physics/:topicId"                 element={<PT><PhysicsTopicView /></PT>} />
            <Route path="/learn/physics/:topicId/lesson/:lessonIdx" element={<PT><PhysicsLessonView /></PT>} />
            <Route path="/learn/astronomy"                        element={<PT><AstronomyView /></PT>} />
            <Route path="/learn/creativity"                       element={<PT><CreativityView /></PT>} />
            <Route path="/learn/interviews"                       element={<PT><InterviewsView /></PT>} />
            <Route path="/learn/problems"                         element={<PT><ProblemsView /></PT>} />
            <Route path="/unit/:unitId"                           element={<PT><UnitView /></PT>} />
            <Route path="/lesson/:unitId/:lessonId"               element={<PT><LessonView /></PT>} />

            {/* Protected — require login */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile"   element={<PT><ProfileView /></PT>} />
              <Route path="/careers"   element={<PT><CareersView /></PT>} />
              <Route path="/portfolio" element={<PT><PortfolioView /></PT>} />
              <Route path="/market"    element={<PT><MarketView /></PT>} />
              <Route path="/chat"     element={<PT><ChatView /></PT>} />

              {/* Level-gated */}
              <Route path="/daily" element={
                <PT>
                  <LevelGate requiredLevel={2} label="Daily Challenge">
                    <DailyChallengeView />
                  </LevelGate>
                </PT>
              } />
              <Route path="/space-game" element={
                <LevelGate requiredLevel={3} label="Space Run">
                  <Lazy><SpaceRunView /></Lazy>
                </LevelGate>
              } />
              <Route path="/lab" element={
                <PT>
                  <LevelGate requiredLevel={2} label="Space Lab">
                    <SpaceLabView />
                  </LevelGate>
                </PT>
              } />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundView />} />
>>>>>>> 19217f396fae14b5ff58dd59c373b59f0d366ec2
          </Routes>
        </AnimatePresence>
      </main>

<<<<<<< HEAD
      {!isGame && <AskCosmos />}
      {!isGame && <Footer />}
=======
      {!isGame && !isAuth && <AskCosmos />}
      <GlobalLanguageBar />
>>>>>>> 19217f396fae14b5ff58dd59c373b59f0d366ec2
    </div>
  );
}
