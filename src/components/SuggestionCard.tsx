"use client"

import type React from "react"
import { MapPin, ExternalLink, Utensils, ListChecks, ChefHat, Share2 } from "lucide-react"
import { motion } from "framer-motion"

interface Suggestion {
  id: string
  name?: string
  commentary: string
  mapsQuery?: string
  recipeName?: string
  ingredientsNeeded?: string[]
  basicSteps?: string
}

interface SuggestionCardProps {
  suggestion: Suggestion
  mode: "eatOut" | "cookHome"
  isHighlighted?: boolean
  onShare: () => void
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion, mode, isHighlighted, onShare }) => {
  const googleMapsUrl = suggestion.mapsQuery
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(suggestion.mapsQuery)}`
    : "#"

  return (
    <motion.div
      className={`bg-white p-6 rounded-xl shadow-lg transition-all duration-300 ease-in-out
        ${isHighlighted ? "ring-4 ring-offset-2 ring-yellow-400 shadow-2xl" : ""}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {mode === "eatOut" ? (
        <>
          <div className="flex items-center mb-3">
            <Utensils className="w-7 h-7 text-orange-500 mr-3 flex-shrink-0" />
            <h3 className="text-xl font-semibold text-gray-800 leading-tight">{suggestion.name}</h3>
          </div>
          <p className="text-gray-600 mb-4 text-sm leading-relaxed">{suggestion.commentary}</p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-3">
            <motion.a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-colors w-full sm:w-auto"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <MapPin className="w-4 h-4 mr-2" />
              View on Maps
              <ExternalLink className="w-4 h-4 ml-2 opacity-75" />
            </motion.a>
            <motion.button
              onClick={onShare}
              title="Share this suggestion"
              className="flex items-center justify-center px-4 py-2 bg-teal-500 text-white text-sm font-medium rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75 transition-colors w-full sm:w-auto"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </motion.button>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center mb-3">
            <ChefHat className="w-7 h-7 text-green-600 mr-3 flex-shrink-0" />
            <h3 className="text-xl font-semibold text-gray-800 leading-tight">{suggestion.recipeName}</h3>
          </div>
          <p className="text-gray-600 mb-4 text-sm leading-relaxed">{suggestion.commentary}</p>
          {suggestion.ingredientsNeeded && suggestion.ingredientsNeeded.length > 0 && (
            <div className="mb-3">
              <h4 className="text-xs font-semibold text-gray-700 mb-1 flex items-center">
                <ListChecks className="w-4 h-4 mr-1 text-green-500" /> Key Ingredients:
              </h4>
              <ul className="list-disc list-inside text-xs text-gray-600 space-y-0.5">
                {suggestion.ingredientsNeeded.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </div>
          )}
          {suggestion.basicSteps && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-gray-700 mb-1">Basic Steps:</h4>
              <p className="text-xs text-gray-600 leading-snug">{suggestion.basicSteps}</p>
            </div>
          )}
          <motion.button
            onClick={onShare}
            title="Share this recipe"
            className="flex items-center justify-center w-full px-4 py-2 bg-teal-500 text-white text-sm font-medium rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75 transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Recipe
          </motion.button>
        </>
      )}
    </motion.div>
  )
}

export default SuggestionCard