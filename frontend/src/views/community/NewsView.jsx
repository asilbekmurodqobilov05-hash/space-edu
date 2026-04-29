import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ExternalLink, Calendar, RefreshCw } from "lucide-react";
import { newsData, factsData } from "@/data/mockData";

export default function NewsView() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [dailyFact, setDailyFact] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    "All",
    ...Array.from(new Set(newsData.map((item) => item.category))),
  ];

  const filteredNews =
    activeCategory === "All"
      ? newsData
      : newsData.filter((item) => item.category === activeCategory);

  const generateNewFact = () => {
    const randomFact = factsData[Math.floor(Math.random() * factsData.length)];
    setDailyFact(randomFact);
  };

  useEffect(() => {
    generateNewFact();
    // Simulate data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-5xl font-[900] mb-4 text-white"
          >
            Space <span className="text-glow-purple text-violet">News</span>
          </motion.h1>
          <p className="text-gray-400 max-w-2xl text-lg">
            Stay updated with the latest discoveries, launches, and
            breakthroughs in space exploration.
          </p>
        </div>

        {/* Daily Fact */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass p-4 rounded-xl max-w-sm border-l-4 border-l-neon-purple relative group"
        >
          <div className="flex justify-between items-center mb-1">
            <p className="text-[10px] text-violet-light font-[800] uppercase tracking-[0.2em]">
              Daily Fact
            </p>
            <button
              onClick={generateNewFact}
              className="text-white/20 hover:text-violet-light transition-colors"
              title="Generate new fact"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-gray-200">{dailyFact}</p>
        </motion.div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-6 py-2.5 rounded-full text-xs font-[800] uppercase tracking-widest transition-all ${
              activeCategory === category
                ? "bg-violet text-white box-glow-purple"
                : "glass text-white/40 hover:text-white hover:bg-white/10"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="glass rounded-2xl overflow-hidden flex flex-col h-[400px] animate-pulse"
            >
              <div className="h-48 bg-white/5" />
              <div className="p-6 flex flex-col flex-grow">
                <div className="h-4 bg-white/5 rounded w-1/4 mb-4" />
                <div className="h-6 bg-white/5 rounded w-3/4 mb-4" />
                <div className="h-4 bg-white/5 rounded w-full mb-2" />
                <div className="h-4 bg-white/5 rounded w-full mb-2" />
                <div className="h-4 bg-white/5 rounded w-2/3 mt-auto" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredNews.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="glass rounded-2xl overflow-hidden group flex flex-col h-full"
              >
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-space-900/20 group-hover:bg-transparent transition-colors z-10" />
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-[800] text-violet-light border border-violet/30 uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                    <Calendar className="w-3 h-3" />
                    {item.date}
                  </div>
                  <h3 className="text-xl font-[800] mb-3 group-hover:text-violet transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-6 flex-grow">
                    {item.summary}
                  </p>

                  <button className="flex items-center gap-2 text-xs font-[800] text-white/60 hover:text-violet transition-all mt-auto uppercase tracking-wider">
                    Read Full Story <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
