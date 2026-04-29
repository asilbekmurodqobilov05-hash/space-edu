import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  BadgeCheck,
  Coins,
  Flame,
  Globe2,
  Medal,
  Orbit,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  UserCircle2,
} from "lucide-react";

const profile = {
  fullName: "Amina Karimova",
  title: "Level 5: Galactic Explorer",
  bio: "Men kosmos, robototexnika va matematika fanlarini yaxshi ko'raman. Har kuni yangi mission bajarib, Space Edu bo'yicha o'sib boryapman.",
  avatar:
    "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=500&q=80",
  xpCurrent: 1450,
  xpNextLevel: 1800,
  coins: 12840,
  globalRank: 27,
  percentile: "Top 3%",
  streakDays: 18,
  leaderboardPosition: 7,
};

const missionsSeed = [
  { id: 1, title: "Watch 1 Space Video", progress: 100, reward: 80 },
  { id: 2, title: "Pass Math Quiz (80%+)", progress: 70, reward: 120 },
  { id: 3, title: "Complete 1 Physics Lesson", progress: 100, reward: 150 },
  { id: 4, title: "Daily Challenge Mission", progress: 45, reward: 90 },
];

const inventoryItems = [
  { id: 1, name: "Titanium Spacesuit", icon: ShieldCheck, rarity: "Epic" },
  { id: 2, name: "Neon Rocket Thrusters", icon: Rocket, rarity: "Legendary" },
  { id: 3, name: "Mars Base Kit", icon: Orbit, rarity: "Rare" },
  { id: 4, name: "Starlight Scanner", icon: Sparkles, rarity: "Epic" },
];

const completedCourses = [
  { id: 1, name: "Moon Mission Basics", planet: "Luna" },
  { id: 2, name: "Math Gravity Masters", planet: "Mars" },
  { id: 3, name: "Solar System Explorer", planet: "Jupiter" },
  { id: 4, name: "Robotics for Cadets", planet: "Saturn" },
];

const badges = [
  { id: 1, name: "First Flight", hint: "Completed your first lesson", icon: Rocket },
  { id: 2, name: "Math Genius", hint: "Scored 95%+ in 5 quizzes", icon: Medal },
  { id: 3, name: "Streak Hero", hint: "7-day learning streak achieved", icon: Flame },
  { id: 4, name: "Galaxy Star", hint: "Reached Top 10 leaderboard", icon: Star },
];

function rarityStyle(rarity) {
  if (rarity === "Legendary") return "text-orange-300 border-orange-400/40 bg-orange-500/10";
  if (rarity === "Epic") return "text-fuchsia-300 border-fuchsia-400/40 bg-fuchsia-500/10";
  return "text-cyan-300 border-cyan-400/40 bg-cyan-500/10";
}

export default function ProfileView() {
  const [aboutMe, setAboutMe] = useState(profile.bio);
  const [missions, setMissions] = useState(missionsSeed);

  const xpPercent = useMemo(
    () => Math.min(100, Math.round((profile.xpCurrent / profile.xpNextLevel) * 100)),
    [],
  );

  const claimReward = (id) => {
    setMissions((prev) => prev.map((m) => (m.id === id ? { ...m, claimed: true } : m)));
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <section className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-space-900/85 via-[#130a2e]/85 to-[#0b1127]/85 p-5 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.12)]">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="flex flex-col items-center lg:items-start gap-4 w-full lg:w-auto">
            <img
              src={profile.avatar}
              alt="Student avatar"
              className="h-28 w-28 sm:h-36 sm:w-36 rounded-full object-cover border-4 border-cyan-300/60 shadow-[0_0_35px_rgba(34,211,238,0.45)]"
            />
            <span className="px-3 py-1 rounded-full text-xs border border-cyan-300/40 bg-cyan-400/10 text-cyan-200">
              Command Center Active
            </span>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-white">{profile.fullName}</h1>
              <p className="text-cyan-200 mt-1 flex items-center gap-2">
                <Trophy className="w-4 h-4" /> {profile.title}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-300">About Me</p>
              <textarea
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
                rows={3}
                className="w-full rounded-2xl border border-white/15 bg-black/25 px-4 py-3 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
                <span>XP Progress</span>
                <span>{profile.xpCurrent} / {profile.xpNextLevel}</span>
              </div>
              <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPercent}%` }}
                  transition={{ duration: 0.9 }}
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <div className="rounded-2xl border border-yellow-400/25 bg-yellow-500/10 p-4">
          <p className="text-sm text-yellow-200/90">Space Coins</p>
          <p className="mt-1 text-3xl font-bold text-yellow-300 flex items-center gap-2">
            <Coins className="w-7 h-7" /> {profile.coins.toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl border border-cyan-400/25 bg-cyan-500/10 p-4">
          <p className="text-sm text-cyan-200/90">Global Rank</p>
          <p className="mt-1 text-2xl font-bold text-cyan-100">#{profile.globalRank} • {profile.percentile}</p>
        </div>
        <div className="rounded-2xl border border-orange-400/25 bg-orange-500/10 p-4">
          <p className="text-sm text-orange-200/90">Daily Streak</p>
          <p className="mt-1 text-3xl font-bold text-orange-300 flex items-center gap-2">
            <Flame className="w-7 h-7" /> {profile.streakDays} days
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <div className="rounded-3xl border border-white/10 bg-space-900/70 p-5">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-cyan-300" /> Daily Missions (Quests)
          </h2>
          <div className="space-y-4">
            {missions.map((mission) => {
              const done = mission.progress >= 100;
              return (
                <div key={mission.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="text-sm text-gray-200">{mission.title}</p>
                    <span className="text-xs text-cyan-200">{mission.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden mb-3">
                    <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: `${mission.progress}%` }} />
                  </div>
                  <button
                    disabled={!done || mission.claimed}
                    onClick={() => claimReward(mission.id)}
                    className="text-xs px-3 py-1.5 rounded-full border border-cyan-300/40 disabled:opacity-45 disabled:cursor-not-allowed hover:bg-cyan-400/20 transition"
                  >
                    {mission.claimed ? "Reward Claimed" : done ? `Claim ${mission.reward} Coins` : "In Progress"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-space-900/70 p-5">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-fuchsia-300" /> My Planet / Inventory
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {inventoryItems.map((item) => (
              <div key={item.id} className="rounded-2xl border border-white/10 bg-black/25 p-4 hover:-translate-y-0.5 transition">
                <item.icon className="w-7 h-7 text-cyan-300 mb-2" />
                <p className="text-sm font-semibold text-white">{item.name}</p>
                <span className={`inline-flex mt-2 text-xs px-2 py-1 rounded-full border ${rarityStyle(item.rarity)}`}>
                  {item.rarity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <div className="rounded-3xl border border-white/10 bg-space-900/70 p-5">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Orbit className="w-5 h-5 text-emerald-300" /> Mission Logs (Completed Courses)
          </h2>
          <div className="space-y-3">
            {completedCourses.map((course) => (
              <div key={course.id} className="rounded-2xl border border-emerald-400/25 bg-emerald-500/10 p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-white">{course.name}</p>
                  <p className="text-xs text-emerald-200 mt-1">Visited planet: {course.planet}</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full border border-emerald-300/50 text-emerald-200 bg-emerald-400/10">
                  100% Completed
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-space-900/70 p-5">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <BadgeCheck className="w-5 h-5 text-yellow-300" /> Achievements & Badges
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                title={badge.hint}
                className="rounded-2xl border border-yellow-300/30 bg-yellow-500/10 p-3 text-center hover:shadow-[0_0_24px_rgba(250,204,21,0.25)] transition"
              >
                <badge.icon className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
                <p className="text-xs font-medium text-yellow-100">{badge.name}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-blue-400/30 bg-blue-500/10 p-3 text-sm text-blue-100 flex items-center gap-2">
            <UserCircle2 className="w-4 h-4" />
            Leaderboard position: #{profile.leaderboardPosition} in Space Edu Galaxy
          </div>
        </div>
      </section>
    </div>
  );
}
