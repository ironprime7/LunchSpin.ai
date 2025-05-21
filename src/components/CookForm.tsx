'use client';

import React from 'react';
import { ChefHat, Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface CookFormProps {
  ingredients: string;
  setIngredients: (ingredients: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const CookForm: React.FC<CookFormProps> = ({
  ingredients,
  setIngredients,
  onSubmit,
  isLoading,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-6 mt-6 p-6 bg-green-50 rounded-lg shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <label htmlFor="ingredients" className="text-sm font-medium text-gray-700 mb-1 flex items-center">
          <ChefHat className="w-5 h-5 mr-2 text-green-600" />
          What ingredients do you have? (comma-separated)
        </label>
        <textarea
          id="ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          rows={3}
          placeholder="e.g., chicken, pasta, tomatoes, onion, garlic, cheese..."
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200"
          required
        />
        <p className="mt-1 text-xs text-gray-500">List your main ingredients. The AI can suggest recipes!</p>
      </div>
      <motion.button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-300 transition-all duration-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Cooking up recipes...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <Search className="w-5 h-5 mr-2" />
            <span>Suggest Recipes!</span>
          </div>
        )}
      </motion.button>
    </motion.form>
  );
};

export default CookForm;
