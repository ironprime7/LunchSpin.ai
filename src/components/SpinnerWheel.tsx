"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Suggestion {
  id: string;
  name?: string;
  recipeName?: string;
  commentary: string;
  mapsQuery?: string;
  ingredientsNeeded?: string[];
  basicSteps?: string;
}

interface SpinnerWheelProps {
  suggestions: Suggestion[];
  onSpinFinish: (selectedSuggestion: Suggestion) => void;
  onClose: () => void;
}

const SpinnerWheel: React.FC<SpinnerWheelProps> = ({ suggestions, onSpinFinish, onClose }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const itemHeight = 60;
  const containerHeight = 192; // Tailwind's h-48 = 192px
  const centeredOffset = containerHeight / 2 - itemHeight / 2;

  useEffect(() => {
    if (isSpinning) {
      setShowResult(false);
      const spinInterval = 50;
      let currentTime = 0;
      const spinDuration = 3000;

      const intervalId = setInterval(() => {
        currentTime += spinInterval;
        setSelectedIndex((prev) => (prev + 1) % suggestions.length);
        if (currentTime >= spinDuration) {
          clearInterval(intervalId);
          setIsSpinning(false);
          const finalIndex = Math.floor(Math.random() * suggestions.length);
          setSelectedIndex(finalIndex);
          onSpinFinish(suggestions[finalIndex]);
          setShowResult(true);
        }
      }, spinInterval);

      return () => clearInterval(intervalId);
    }
  }, [isSpinning, suggestions, onSpinFinish]);

  const startSpin = () => {
    if (suggestions.length > 0) {
      setIsSpinning(true);
    }
  };

  if (suggestions.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md text-center relative"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 25 }}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          >
            <X size={22} />
          </button>

          <h2 className="text-2xl font-bold text-slate-800 mb-2">Spin the Wheel!</h2>
          <p className="text-sm text-slate-500 mb-6">Let fate decide your next delicious meal.</p>

          {/* Spinner Box */}
          <div className="relative h-48 w-full max-w-sm mx-auto overflow-hidden bg-orange-50 rounded-2xl shadow-inner border border-orange-200">
            <div
              className="transition-transform duration-100 ease-linear"
              style={{
                transform: `translateY(${-selectedIndex * itemHeight + centeredOffset}px)`,
              }}
            >
              {[...suggestions, ...suggestions].map((suggestion, index) => (
                <div
                  key={`${suggestion.id}-${index}`}
                  className={`flex items-center justify-center h-[60px] text-base md:text-lg font-medium px-4 transition-all duration-300 ${
                    !isSpinning && showResult && index % suggestions.length === selectedIndex
                      ? "text-orange-600 scale-105 font-semibold"
                      : "text-slate-700"
                  }`}
                >
                  {suggestion.name || suggestion.recipeName}
                </div>
              ))}
            </div>

           {/* Highlight Glow */}
<div className="absolute top-1/2 left-0 right-0 h-[60px] -translate-y-1/2 pointer-events-none flex items-center justify-center z-10">
  <div
    className="w-[90%] h-full rounded-lg bg-white/10"
    style={{
      boxShadow: "0 0 10px 2px rgba(255, 115, 0, 0.3), 0 0 20px 5px rgba(255, 115, 0, 0.2)",
      transition: "box-shadow 0.3s ease-in-out"
    }}
  />
</div>

          </div>

          {/* Result Display */}
          <AnimatePresence>
            {!isSpinning && showResult && suggestions[selectedIndex] && (
              <motion.div
                className="mt-6 p-5 bg-yellow-50 border border-yellow-300 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-lg md:text-xl font-semibold text-yellow-800">
                {" It's"}{" "}
                  <span className="text-orange-600">
                    {suggestions[selectedIndex].name || suggestions[selectedIndex].recipeName}!
                  </span>
                </h3>
                <p className="text-sm text-yellow-700 mt-1">{suggestions[selectedIndex].commentary}</p>
                <motion.button
                  onClick={onClose}
                  className="mt-4 px-6 py-2 bg-gradient-to-br from-orange-500 to-orange-400 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-500 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                 {"Awesome! Let's Go!"}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {!showResult && (
            <motion.button
              onClick={startSpin}
              disabled={isSpinning}
              className="mt-8 px-8 py-3 bg-orange-500 text-white font-semibold rounded-xl shadow-md hover:bg-orange-600 transition-all duration-150 ease-in-out disabled:bg-gray-400"
              whileHover={{ scale: isSpinning ? 1 : 1.05 }}
              whileTap={{ scale: isSpinning ? 1 : 0.95 }}
            >
              {isSpinning ? "Spinning..." : "SPIN!"}
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SpinnerWheel;
