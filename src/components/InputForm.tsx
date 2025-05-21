'use client';

import React from 'react';
import { MapPin, Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface InputFormProps {
  location: string;
  setLocation: (location: string) => void;
  preferences: string;
  setPreferences: (preferences: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({
  location,
  setLocation,
  preferences,
  setPreferences,
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
      className="space-y-6 mt-6 p-6 bg-orange-50 rounded-lg shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <label htmlFor="location" className="text-sm font-medium text-gray-700 mb-1 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-orange-500" />
          Where are you?
        </label>
        <input
          id="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g., Delhi, New York, London..."
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-all duration-200"
          required
        />
      </div>
      
      <div>
        <label htmlFor="preferences" className="text-sm font-medium text-gray-700 mb-1">
          What are you craving? (comma-separated)
        </label>
        <textarea
          id="preferences"
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          rows={2}
          placeholder="e.g., spicy, vegetarian, cheap, quick, healthy..."
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-all duration-200"
          required
        />
        <p className="mt-1 text-xs text-gray-500">Tell us your preferences, dietary restrictions, or mood!</p>
      </div>
      
      <motion.button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 disabled:bg-gray-300 transition-all duration-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Finding options...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <Search className="w-5 h-5 mr-2" />
            <span>Find My Lunch!</span>
          </div>
        )}
      </motion.button>
    </motion.form>
  );
};

export default InputForm;
