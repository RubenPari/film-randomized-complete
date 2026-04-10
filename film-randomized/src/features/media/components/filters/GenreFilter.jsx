/**
 * Genre filter component.
 * Allows users to select multiple genres to filter media.
 */
import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Component for selecting genres to filter media.
 * Displays all available genres as checkboxes.
 * 
 * @param {Object} props - Component props
 * @param {Array<Object>} props.genres - List of all available genres
 * @param {Array<number>} props.selectedGenres - List of currently selected genre IDs
 * @param {Function} props.handleGenreToggle - Function to toggle genre selection
 * @returns {JSX.Element} Genre filter component
 */
function GenreFilter({ genres, selectedGenres, handleGenreToggle }) {
  const { t } = useTranslation();

  return (
    <div>
      <h2 className="filter-title">{t('filters.genres')}</h2>
      <div className="max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-cyan-600 scrollbar-track-slate-800">
        <div className="grid grid-cols-1 gap-2">
          {genres.map(function(genre) {
            const isSelected = selectedGenres.includes(genre.id);
            return (
              <label
                key={genre.id}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                    : 'bg-slate-700/50 hover:bg-slate-600 text-gray-300 border border-slate-600'
                }`}
              >
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={function() { handleGenreToggle(genre.id); }}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                    isSelected
                      ? 'bg-white border-white'
                      : 'border-gray-400 bg-transparent'
                  }`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="ml-3 text-sm font-medium">{genre.name}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default GenreFilter;
