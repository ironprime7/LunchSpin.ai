"use client"

import type React from "react"
import { Utensils, ChefHat } from "lucide-react"
import { motion } from "framer-motion"

interface ModeToggleProps {
  currentMode: "eatOut" | "cookHome"
  onModeChange: (mode: "eatOut" | "cookHome") => void
}

const ModeToggle: React.FC<ModeToggleProps> = ({ currentMode, onModeChange }) => {
  const baseStyle =
    "flex-1 py-3 px-4 rounded-lg text-sm font-medium focus:outline-none transition-all duration-300 ease-in-out flex items-center justify-center space-x-2 shadow-sm"
  const activeStyle = "bg-orange-500 text-white shadow-lg"
  const inactiveStyle = "bg-gray-200 text-gray-700 hover:bg-gray-300"

  return (
    <div className="flex space-x-2 p-1 bg-gray-100 rounded-xl shadow-inner mb-6">
      <motion.button
        onClick={() => onModeChange("eatOut")}
        className={`${baseStyle} ${currentMode === "eatOut" ? activeStyle : inactiveStyle}`}
        aria-pressed={currentMode === "eatOut"}
        whileHover={{ scale: currentMode !== "eatOut" ? 1.03 : 1 }}
        whileTap={{ scale: 0.97 }}
      >
        <Utensils size={18} />
        <span>Eat Out</span>
      </motion.button>
      <motion.button
        onClick={() => onModeChange("cookHome")}
        className={`${baseStyle} ${currentMode === "cookHome" ? activeStyle : inactiveStyle}`}
        aria-pressed={currentMode === "cookHome"}
        whileHover={{ scale: currentMode !== "cookHome" ? 1.03 : 1 }}
        whileTap={{ scale: 0.97 }}
      >
        <ChefHat size={18} />
        <span>Cook at Home</span>
      </motion.button>
    </div>
  )
}

export default ModeToggle