import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Navigation from '@/components/layout/Navigation';
import ParticleBackground from '@/components/layout/ParticleBackground';
import PageTransition from '@/components/layout/PageTransition';
import ProtectedRoute from '@/components/ProtectedRoute';
import Footer from '@/components/layout/Footer';
import CosmicLoader from '@/components/ui/CosmicLoader';
import ChatSystem from '@/features/chat/ChatSystem';

// Eager — first-hit pages, tiny bundles
import LoginView    from '@/views/auth/LoginView';
import RegisterView from '@/views/auth/RegisterView';
import HomeView     from '@/views/home/HomeView';
import NotFoundView from '@/views/misc/NotFoundView';

// Lazy — everything else
const SolarSystemView     = lazy(() => import('@/views/explore/SolarSystemView'));
const StarFinderView      = lazy(() => import('@/views/explore/StarFinderView'));
const SpaceRunView        = lazy(() => import('@/views/game/SpaceRunView'));
const SpaceLabView        = lazy(() => import('@/views/explore/SpaceLabView'));
const LearnView           = lazy(() => import('@/views/learn/LearnView'));
const PhysicsView         = lazy(() => import('@/views/learn/PhysicsView'));
const PhysicsTopicView    = lazy(() => import('@/views/learn/PhysicsTopicView'));
const AstronomyView       = lazy(() => import('@/views/learn/AstronomyView'));
const AstronomyTopicView  = lazy(() => import('@/views/learn/AstronomyTopicView'));
const CreativityView      = lazy(() => import('@/views/learn/CreativityView'));
const CreativityTopicView = lazy(() => import('@/views/learn/CreativityTopicView'));
const SubTopicView        = lazy(() => import('@/views/learn/SubTopicView'));
const InterviewsView      = lazy(() => import('@/views/learn/InterviewsView'));
const InterviewsTopicView = lazy(() => import('@/views/learn/InterviewsTopicView'));
const ProblemsView        = lazy(() => import('@/views/learn/ProblemsView'));
const ProblemDetailView   = lazy(() => import('@/views/learn/ProblemDetailView'));
const UnitView            = lazy(() => import('@/views/learn/UnitView'));
const LessonView          = lazy(() => import('@/views/learn/LessonView'));
const UniversalLessonView = lazy(() => import('@/views/learn/UniversalLessonView'));
const DailyChallengeView  = lazy(() => import('@/views/community/DailyChallengeView'));
const LeaderboardView     = lazy(() => import('@/views/community/LeaderboardView'));
const CalendarView        = lazy(() => import('@/views/community/CalendarView'));
const NewsView            = lazy(() => import('@/views/community/NewsView'));
const LiveSpaceView       = lazy(() => import('@/views/community/LiveSpaceView'));
const PremiumView         = lazy(() => import('@/views/features/PremiumView'));
const PortfolioView       = lazy(() => import('@/views/profile/PortfolioView'));
const ProfileView         = lazy(() => import('@/views/profile/ProfileView'));
const HistoryView         = lazy(() => import('@/views/misc/HistoryView'));
const MarketView          = lazy(() => import('@/views/misc/MarketView'));
const RewardsStoreView    = lazy(() => import('@/views/store/RewardsStoreView'));
const ChatView            = lazy(() => import('@/views/chat/ChatView'));
const QuizHubView         = lazy(() => import('@/views/quiz/QuizHubView'));
const QuizSessionView     = lazy(() => import('@/views/quiz/QuizSessionView'));
const AdminDashboard      = lazy(() => import('@/views/admin/AdminDashboard'));

const GAME_PATH = '/space-game';

function PT({ children }) {
  return <PageTransition>{children}</PageTransition>;
}

export default function App() {
  const location = useLocation();
  const isGame  = location.pathname === GAME_PATH;
  const isAuth  = ['/login', '/register'].includes(location.pathname);
  const isAdmin = location.pathname === '/admin-panel';
  const shouldHideFooter = ['/history', '/live'].includes(location.pathname) || isAdmin;

  return (
    <div className="relative min-h-screen text-white font-sans">
      {!isAuth && !isAdmin && !isGame && <ParticleBackground />}
      {!isGame && !isAuth && !isAdmin && <Navigation />}

      <main className="relative z-10">
        <Suspense fallback={<CosmicLoader />}>
          <Routes>
            {/* Public */}
            <Route path="/"         element={<PT><HomeView /></PT>} />
            <Route path="/login"    element={<LoginView />} />
            <Route path="/register" element={<RegisterView />} />
            <Route path="/leaderboard"  element={<PT><LeaderboardView /></PT>} />
            <Route path="/history"      element={<PT><HistoryView /></PT>} />
            <Route path="/market"       element={<PT><MarketView /></PT>} />
            <Route path="/space-game"   element={<PT><SpaceRunView /></PT>} />
            <Route path="/lab"          element={<PT><SpaceLabView /></PT>} />
            <Route path="/3d-solar-system" element={<PT><SolarSystemView /></PT>} />
            <Route path="/star-finder"  element={<PT><StarFinderView /></PT>} />
            <Route path="/calendar"     element={<PT><CalendarView /></PT>} />
            <Route path="/news"         element={<PT><NewsView /></PT>} />
            <Route path="/live"         element={<PT><LiveSpaceView /></PT>} />
            <Route path="/premium"      element={<PT><PremiumView /></PT>} />
            <Route path="/quiz"         element={<PT><QuizHubView /></PT>} />
            <Route path="/quiz/:category" element={<PT><QuizSessionView /></PT>} />

            {/* Learn */}
            <Route path="/learn"                          element={<PT><LearnView /></PT>} />
            <Route path="/learn/physics"                  element={<PT><PhysicsView /></PT>} />
            <Route path="/learn/physics/:topicId"         element={<PT><PhysicsTopicView /></PT>} />
            <Route path="/learn/astronomy"                element={<PT><AstronomyView /></PT>} />
            <Route path="/learn/astronomy/:topicId"       element={<PT><AstronomyTopicView /></PT>} />
            <Route path="/learn/creativity"               element={<PT><CreativityView /></PT>} />
            <Route path="/learn/creativity/:topicId"      element={<PT><CreativityTopicView /></PT>} />
            <Route path="/learn/interviews"               element={<PT><InterviewsView /></PT>} />
            <Route path="/learn/interviews/:topicId"      element={<PT><InterviewsTopicView /></PT>} />
            <Route path="/learn/:subject/:topicId/sub/:subIdx"                          element={<PT><SubTopicView /></PT>} />
            <Route path="/learn/:subject/:topicId/sub/:subIdx/lesson/:lessonIdx"        element={<PT><UniversalLessonView /></PT>} />
            <Route path="/learn/:subject/:topicId/lesson/:lessonIdx/part/:partIdx"      element={<PT><UniversalLessonView /></PT>} />
            <Route path="/learn/:subject/:topicId/lesson/:lessonIdx"                    element={<PT><UniversalLessonView /></PT>} />
            <Route path="/learn/problems"                 element={<PT><ProblemsView /></PT>} />
            <Route path="/learn/problems/:id"             element={<PT><ProblemDetailView /></PT>} />
            <Route path="/unit/:unitId"                   element={<PT><UnitView /></PT>} />
            <Route path="/lesson/:unitId/:lessonId"       element={<PT><LessonView /></PT>} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/store"     element={<PT><RewardsStoreView /></PT>} />
              <Route path="/profile"   element={<PT><ProfileView /></PT>} />
              <Route path="/portfolio" element={<PT><PortfolioView /></PT>} />
              <Route path="/chat"      element={<PT><ChatView /></PT>} />
              <Route path="/daily"     element={<PT><DailyChallengeView /></PT>} />
            </Route>

            {/* Admin */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin-panel" element={<PT><AdminDashboard /></PT>} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundView />} />
          </Routes>
        </Suspense>
      </main>

      {!isGame && !isAuth && !isAdmin && <ChatSystem />}
      {!isGame && !isAuth && !isAdmin && !shouldHideFooter && <Footer />}
    </div>
  );
}
