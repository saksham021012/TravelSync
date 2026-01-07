import React from 'react';
import { Sparkles } from 'lucide-react';
import SuggestionCard from './SuggestionCard';

const SuggestionsSection = ({
  currentSuggestion,
  hasMultipleSuggestions,
  loading,
  onGetSuggestions,
  onNextSuggestion,
  onAddToItinerary
}) => {
  return (
    <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 border border-slate-200 shadow-sm">
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-900 mb-4 md:mb-6">
        Need Ideas for this Day?
      </h2>
      
      {currentSuggestion ? (
        <>
          <SuggestionCard
            suggestion={currentSuggestion}
            onAdd={onAddToItinerary}
          />
          
          {hasMultipleSuggestions && (
            <button
              onClick={onNextSuggestion}
              className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 text-sm font-medium text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 cursor-pointer rounded-md transition-colors duration-200 border border-transparent hover:border-purple-200"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Another Suggestion
            </button>
          )}
        </>
      ) : (
        <div className="text-center py-6 text-slate-500">
          Click "Get AI Suggestions" to see recommendations for this day.
        </div>
      )}
      
      <button
        onClick={onGetSuggestions}
        disabled={loading}
        className="w-full p-4 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-200 flex items-center justify-center gap-2 mt-4 relative overflow-hidden cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
        <Sparkles className="w-4 h-4" />
        {loading ? 'Getting Suggestions...' : 'Get AI Suggestions'}
      </button>
    </div>
  );
};

export default SuggestionsSection;