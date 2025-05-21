"use client"

import type React from "react"
import { Utensils } from "lucide-react"
import { motion } from "framer-motion"

const LoadingIndicator: React.FC = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center space-y-3 my-10 p-6 bg-white/50 rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        animate={{
          y: [0, -15, 0],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 1.5,
          ease: "easeInOut",
        }}
      >
        <Utensils className="w-12 h-12 text-orange-500" />
      </motion.div>

      <p className="text-orange-600 font-semibold text-lg">Stirring up some great ideas...</p>

      <div className="w-48 h-2 bg-orange-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-orange-500"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 1.5,
            ease: "easeInOut",
          }}
        />
      </div>
    </motion.div>
  )
}

export default LoadingIndicator
