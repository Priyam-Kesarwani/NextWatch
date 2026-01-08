import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSort, faFilter } from '@fortawesome/free-solid-svg-icons';

const SearchAndSort = ({ 
    searchQuery, 
    onSearchChange, 
    sortBy, 
    onSortChange, 
    genres = [], 
    selectedGenres = [], 
    onGenreFilterChange 
}) => {
    const [isGenreFilterOpen, setIsGenreFilterOpen] = useState(false);
    const genreFilterRef = useRef(null);

    // Close genre filter when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (genreFilterRef.current && !genreFilterRef.current.contains(event.target)) {
                setIsGenreFilterOpen(false);
            }
        };

        if (isGenreFilterOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isGenreFilterOpen]);

    const sortOptions = [
        { value: 'title-asc', label: 'Title (A-Z)' },
        { value: 'title-desc', label: 'Title (Z-A)' },
        { value: 'rating-asc', label: 'Rating (High to Low)' },
        { value: 'rating-desc', label: 'Rating (Low to High)' },
    ];

    return (
        <div className="container mx-auto px-4 py-6 space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search movies by title..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-card/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 input-glow glow-card"
                />
            </div>

            {/* Sort and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Sort Dropdown */}
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <FontAwesomeIcon icon={faSort} className="text-gray-400" />
                    </div>
                    <select
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-card/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none cursor-pointer transition-all duration-300 input-glow glow-card"
                    >
                        {sortOptions.map((option) => (
                            <option key={option.value} value={option.value} className="bg-card text-white">
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Genre Filter */}
                {genres.length > 0 && (
                    <div className="relative" ref={genreFilterRef}>
                        <button
                            onClick={() => setIsGenreFilterOpen(!isGenreFilterOpen)}
                            className="w-full sm:w-auto px-6 py-3 bg-card/50 border border-white/10 rounded-xl text-white hover:bg-card/70 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 flex items-center justify-center gap-2 btn-glow input-glow glow-card"
                        >
                            <FontAwesomeIcon icon={faFilter} className="text-gray-400" />
                            <span>Filter by Genre</span>
                            {selectedGenres.length > 0 && (
                                <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                                    {selectedGenres.length}
                                </span>
                            )}
                        </button>

                        {/* Genre Filter Dropdown */}
                        {isGenreFilterOpen && (
                            <div className="absolute z-50 mt-2 w-full sm:w-64 bg-card border border-white/10 rounded-xl shadow-2xl p-4 max-h-64 overflow-y-auto glow-card">
                                <div className="space-y-2">
                                    {genres.map((genre) => (
                                        <label
                                            key={genre.genre_id}
                                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedGenres.includes(genre.genre_id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        onGenreFilterChange([...selectedGenres, genre.genre_id]);
                                                    } else {
                                                        onGenreFilterChange(selectedGenres.filter(id => id !== genre.genre_id));
                                                    }
                                                }}
                                                className="w-4 h-4 text-primary bg-dark border-gray-600 rounded focus:ring-primary focus:ring-2"
                                            />
                                            <span className="text-sm text-gray-300">{genre.genre_name}</span>
                                        </label>
                                    ))}
                                    {selectedGenres.length > 0 && (
                                        <button
                                            onClick={() => {
                                                onGenreFilterChange([]);
                                                setIsGenreFilterOpen(false);
                                            }}
                                            className="w-full mt-2 px-3 py-1.5 text-xs text-primary hover:text-white border border-primary/30 hover:bg-primary/20 rounded-lg transition-colors"
                                        >
                                            Clear Filters
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Active Filters Display */}
            {(searchQuery || selectedGenres.length > 0) && (
                <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="text-gray-400">Active filters:</span>
                    {searchQuery && (
                        <span className="px-3 py-1 bg-primary/20 border border-primary/30 text-primary rounded-full flex items-center gap-2">
                            Search: "{searchQuery}"
                            <button
                                onClick={() => onSearchChange('')}
                                className="hover:text-white transition-colors"
                            >
                                ×
                            </button>
                        </span>
                    )}
                    {selectedGenres.map((genreId) => {
                        const genre = genres.find(g => g.genre_id === genreId);
                        return genre ? (
                            <span
                                key={genreId}
                                className="px-3 py-1 bg-primary/20 border border-primary/30 text-primary rounded-full flex items-center gap-2"
                            >
                                {genre.genre_name}
                                <button
                                    onClick={() => onGenreFilterChange(selectedGenres.filter(id => id !== genreId))}
                                    className="hover:text-white transition-colors"
                                >
                                    ×
                                </button>
                            </span>
                        ) : null;
                    })}
                </div>
            )}
        </div>
    );
};

export default SearchAndSort;
