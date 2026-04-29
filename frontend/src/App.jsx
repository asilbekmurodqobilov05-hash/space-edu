import { AnimatePresence } from "motion/react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navigation from "@/components/layout/Navigation";
import ParticleBackground from "@/components/layout/ParticleBackground";
import PageTransition from "@/components/layout/PageTransition";
import AskCosmos from "@/features/ai/AskCosmos";
import GlobalLanguageBar from "@/components/layout/GlobalLanguageBar";

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
import ProfileView from "@/views/profile/ProfileView";
import HistoryView from "@/views/misc/HistoryView";
import MarketView from "@/views/misc/MarketView";
import UzSpaceView from "@/views/misc/UzSpaceView";
import SpaceRunView from "@/views/game/SpaceRunView";

const GAME_PATH = "/space-game";

export default function App() {
  const location = useLocation();
  const isGame = location.pathname === GAME_PATH;

  return (
    <div className="relative min-h-screen text-white font-sans">
      {location.pathname !== "/" && !isGame && <ParticleBackground />}
      {!isGame && <Navigation />}

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
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
            <Route path="/profile"             element={<PageTransition><ProfileView /></PageTransition>} />
            <Route path="/history"             element={<PageTransition><HistoryView /></PageTransition>} />
            <Route path="/market"              element={<PageTransition><MarketView /></PageTransition>} />
            <Route path="/uzb"                 element={<PageTransition><UzSpaceView /></PageTransition>} />
            <Route path="/space-game"          element={<SpaceRunView />} />
          </Routes>
        </AnimatePresence>
      </main>

      {!isGame && <AskCosmos />}
      <GlobalLanguageBar />
    </div>
  );
}
