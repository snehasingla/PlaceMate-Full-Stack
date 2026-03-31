import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { CheckCircle2, Rocket, Target, Sparkles } from "lucide-react";

export default function WelcomeModal() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only show if the user just registered (we use a simple localStorage flag for this demo)
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (user && !hasSeenWelcome) {
      setIsOpen(true);
      // Fire confetti
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        }));
        confetti(Object.assign({}, defaults, { particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        }));
      }, 250);
    }
  }, [user]);

  const handleComplete = () => {
    localStorage.setItem("hasSeenWelcome", "true");
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-900 border border-indigo-100 dark:border-indigo-900/50"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 mb-6">
              <Sparkles className="h-8 w-8" />
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
              Welcome to PlaceMate, {user?.name?.split(" ")[0]}!
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
              Your intelligent companion for surviving placement season. Build your streak, crush DSA, and lock down that target role.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                <Target className="h-5 w-5 text-purple-500" />
                Set your target role and tracking goals
              </div>
              <div className="flex items-center gap-4 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                <Rocket className="h-5 w-5 text-indigo-500" />
                Access curated Must-Do DSA sheets
              </div>
              <div className="flex items-center gap-4 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                Monitor application deadlines easily
              </div>
            </div>

            <button
              onClick={handleComplete}
              className="w-full rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Start My Journey
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
