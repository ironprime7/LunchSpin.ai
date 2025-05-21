"use client"

import { useState } from "react"
import { Utensils, ChefHat, RotateCw, Sparkles, Lightbulb } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import InputForm from "../components/InputForm";
import CookForm from "../components/CookForm"
import SuggestionCard from "../components/SuggestionCard"
import SpinnerWheel from "../components/SpinnerWheel"
import LoadingIndicator from "../components/LoadingIndicator"
import ModeToggle from "../components/ModeToggle"

export interface Suggestion {
  id: string
  name?: string
  commentary: string
  mapsQuery?: string
  recipeName?: string
  ingredientsNeeded?: string[]
  basicSteps?: string
}

export type AppMode = "eatOut" | "cookHome"

export default function HomePage() {
  const [mode, setMode] = useState<AppMode>("eatOut")
  const [location, setLocation] = useState<string>("Delhi")
  const [preferences, setPreferences] = useState<string>("spicy, cheap, veg")
  const [ingredients, setIngredients] = useState<string>("")

  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [spunSuggestion, setSpunSuggestion] = useState<Suggestion | null>(null)
  const [showSpinnerWheel, setShowSpinnerWheel] = useState<boolean>(false)

  const fetchSuggestions = async () => {
    setIsLoading(true)
    setError(null)
    setSuggestions([])
    setSpunSuggestion(null)
    setShowSpinnerWheel(false)

    let prompt = ""
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let responseSchema: Record<string, any> = {}

    if (mode === "eatOut") {
      prompt = `I'm in ${location}. I'm looking for food that is ${preferences}. Give me 3 diverse and interesting restaurant or dish suggestions. For each suggestion, provide a name, some fun and quirky commentary (2-3 sentences), and a concise Google Maps search query to find places serving it.`
      responseSchema = {
        type: "ARRAY",
        maxItems: 3,
        items: {
          type: "OBJECT",
          properties: {
            name: {
              type: "STRING",
              description:
                "Name of the dish or cuisine type (e.g., 'Spicy Paneer Tikka Masala', 'Authentic Chole Bhature')",
            },
            commentary: {
              type: "STRING",
              description:
                "Fun, brief, and quirky commentary about the suggestion (e.g., 'Get ready for a flavor explosion that'll dance on your taste buds!')",
            },
            mapsQuery: {
              type: "STRING",
              description:
                "A specific Google Maps search query (e.g., 'best spicy paneer tikka masala near Connaught Place, Delhi', 'top rated chole bhature Chandni Chowk')",
            },
          },
          required: ["name", "commentary", "mapsQuery"],
        },
      }
    } else {
      // cookHome mode
      prompt = `I have these ingredients at home: ${ingredients}. Suggest 3 simple and creative recipes I can make. For each recipe, provide a recipeName, fun commentary (2-3 sentences), a list of key ingredients (you can include common pantry staples if needed beyond what I listed), and very brief basic cooking steps.`
      responseSchema = {
        type: "ARRAY",
        maxItems: 3,
        items: {
          type: "OBJECT",
          properties: {
            recipeName: {
              type: "STRING",
              description: "Catchy name of the recipe (e.g., 'Quick Garlic Herb Pasta', 'Spicy Chickpea Stir-fry')",
            },
            commentary: {
              type: "STRING",
              description:
                "Fun and encouraging commentary about the recipe (e.g., 'Whip up this delight in minutes and impress yourself!')",
            },
            ingredientsNeeded: {
              type: "ARRAY",
              items: { type: "STRING" },
              description: "List of key ingredients needed for the recipe.",
            },
            basicSteps: {
              type: "STRING",
              description:
                "A brief summary of the cooking steps (e.g., 'Sauté veggies, add sauce, simmer with protein. Serve hot.')",
            },
          },
          required: ["recipeName", "commentary", "ingredientsNeeded", "basicSteps"],
        },
      }
    }

    const chatHistory = [{ role: "user", parts: [{ text: prompt }] }]
    const payload = {
      contents: chatHistory,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      },
    }
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Gemini API Error:", errorData)
        throw new Error(errorData.error?.message || `API request failed with status ${response.status}`)
      }

      const result = await response.json()

      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0
      ) {
        const rawJsonString = result.candidates[0].content.parts[0].text
        const parsedSuggestions = JSON.parse(rawJsonString)

        if (Array.isArray(parsedSuggestions)) {
          setSuggestions(parsedSuggestions.map((s, index) => ({ ...s, id: `${mode}-${index}-${Date.now()}` })))
        } else {
          throw new Error("Unexpected response format from API.")
        }
      } else {
        console.error("Unexpected API response structure:", result)
        throw new Error("Failed to get valid suggestions from the AI. The response might be empty or malformed.")
      }
    } catch (err: unknown) {
      console.error("Error fetching suggestions:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSpinFinish = (selectedSuggestion: Suggestion) => {
    setSpunSuggestion(selectedSuggestion)
  }

  const handleShareSuggestion = (suggestion: Suggestion) => {
    let shareText = ""
    if (mode === "eatOut") {
      shareText = `LunchSpin.ai suggested I eat: ${suggestion.name}! ${suggestion.commentary}`
      if (suggestion.mapsQuery) {
        const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(suggestion.mapsQuery)}`
        shareText += ` Find it here: ${mapsLink}`
      }
    } else {
      shareText = `LunchSpin.ai suggested I cook: ${suggestion.recipeName}! ${suggestion.commentary}. Ingredients: ${suggestion.ingredientsNeeded?.join(", ")}.`
    }

    if (navigator.share) {
      navigator
        .share({
          title: `LunchSpin.ai Suggestion: ${suggestion.name || suggestion.recipeName}`,
          text: shareText,
          url: window.location.href,
        })
        .catch(console.error)
    } else if (navigator.clipboard) {
      navigator.clipboard
        .writeText(shareText)
        .then(() => {
          alert("Suggestion copied to clipboard!")
        })
        .catch(console.error)
    } else {
      alert("Sharing not supported on this browser. Try copying the text manually.")
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 font-sans">
      <motion.main
        className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-2xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.header
          className="text-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Utensils className="w-10 h-10 text-orange-500" />
            <h1 className="text-4xl font-bold text-gray-800">
              LunchSpin<span className="text-orange-500">.ai</span>
            </h1>
          </motion.div>
          <p className="text-gray-600 mt-2 text-lg">{"Can't decide? Let the AI help you spin your next meal!"}</p>
        </motion.header>

        <ModeToggle currentMode={mode} onModeChange={setMode} />

        {mode === "eatOut" ? (
          <InputForm
            location={location}
            setLocation={setLocation}
            preferences={preferences}
            setPreferences={setPreferences}
            onSubmit={fetchSuggestions}
            isLoading={isLoading}
          />
        ) : (
          <CookForm
            ingredients={ingredients}
            setIngredients={setIngredients}
            onSubmit={fetchSuggestions}
            isLoading={isLoading}
          />
        )}

        <AnimatePresence>{isLoading && <LoadingIndicator />}</AnimatePresence>

        {error && (
          <motion.div
            className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <h3 className="font-semibold text-lg mb-1">Oops! Something went wrong.</h3>
            <p>{error}</p>
            <motion.button
              onClick={fetchSuggestions}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Again
            </motion.button>
          </motion.div>
        )}

        {!isLoading && !error && suggestions.length > 0 && (
          <motion.div className="mt-8" variants={containerVariants} initial="hidden" animate="visible">
            <motion.h2
              className="text-2xl font-semibold text-gray-700 mb-4 text-center flex items-center justify-center"
              variants={itemVariants}
            >
              <Sparkles className="w-6 h-6 text-yellow-500 mr-2" />
              Here are your tasty suggestions!
              <Sparkles className="w-6 h-6 text-yellow-500 ml-2" />
            </motion.h2>
            <motion.div className="grid grid-cols-1 gap-6" variants={containerVariants}>
              {suggestions.map((suggestion) => (
                <motion.div key={suggestion.id} variants={itemVariants}>
                  <SuggestionCard
                    suggestion={suggestion}
                    mode={mode}
                    isHighlighted={spunSuggestion?.id === suggestion.id}
                    onShare={() => handleShareSuggestion(suggestion)}
                  />
                </motion.div>
              ))}
            </motion.div>

            {suggestions.length > 1 && (
              <motion.div className="mt-8 text-center" variants={itemVariants}>
                <motion.button
                  onClick={() => setShowSpinnerWheel(true)}
                  disabled={isLoading}
                  className="px-8 py-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-all duration-150 ease-in-out flex items-center justify-center mx-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 3,
                      ease: "linear",
                    }}
                  >
                    <RotateCw className="w-6 h-6 mr-2" />
                  </motion.div>
                  Feeling Indecisive? Spin the Wheel!
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}

        <AnimatePresence>
          {showSpinnerWheel && suggestions.length > 0 && (
            <SpinnerWheel
              suggestions={suggestions}
              onSpinFinish={handleSpinFinish}
              onClose={() => setShowSpinnerWheel(false)}
            />
          )}
        </AnimatePresence>

        {!isLoading && !error && suggestions.length === 0 && mode === "eatOut" && !preferences && (
          <motion.div
            className="mt-6 p-6 bg-blue-50 border-l-4 border-blue-400 text-blue-700 rounded-r-lg shadow-md"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center">
              <Lightbulb className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <h3 className="font-semibold text-lg">Ready for some delicious ideas?</h3>
                <p className="text-sm">{`Tell us where you are and what you're craving above, then hit "Find My Lunch!"`}</p>
              </div>
            </div>
          </motion.div>
        )}

        {!isLoading && !error && suggestions.length === 0 && mode === "cookHome" && !ingredients && (
          <motion.div
            className="mt-6 p-6 bg-green-50 border-l-4 border-green-400 text-green-700 rounded-r-lg shadow-md"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center">
              <ChefHat className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <h3 className="font-semibold text-lg">{"What's cooking?"}</h3>
                <p className="text-sm">{"List your ingredients above and let's find a recipe for you!"}</p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.main>

      <motion.footer
        className="text-center mt-8 text-white text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p>
          &copy; {new Date().getFullYear()} LunchSpin.ai - Made with{" "}
          <span className="text-red-400">&hearts;</span>{" "}
          by <a
          target="_blank"
          href="https://ayushi-links.vercel.app"
          >Ayushi</a>
        </p>
      </motion.footer>
    </div>
  )
}
