import { Link } from 'react-router-dom';
import { useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay, faStar } from '@fortawesome/free-solid-svg-icons';

// Local watchlist icon badge handles add/remove and UX (overlayed on poster)
import { faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';

const WatchlistButton = ({ movie }) => {
    const axiosPrivate = useAxiosPrivate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [inWatchlist, setInWatchlist] = useState(Boolean(movie?.is_in_watchlist || movie?.watchlisted));

    const addToWatchlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isProcessing) return;
        setIsProcessing(true);
        try {
            await axiosPrivate.post('/watchlist', { imdb_id: movie.imdb_id });
            setInWatchlist(true);
        } catch (err) {
            console.error('Failed to add to watchlist', err);
        } finally {
            setIsProcessing(false);
        }
    };

    const removeFromWatchlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isProcessing) return;
        setIsProcessing(true);
        try {
            await axiosPrivate.delete(`/watchlist/${movie.imdb_id}`);
            setInWatchlist(false);
        } catch (err) {
            console.error('Failed to remove from watchlist', err);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <button
            aria-label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
            onClick={inWatchlist ? removeFromWatchlist : addToWatchlist}
            onMouseDown={(e) => { e.preventDefault(); }}
            className="absolute top-3 right-3 z-20 px-2 py-1 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center gap-2 text-xs"
            disabled={isProcessing}
        >
            <FontAwesomeIcon icon={inWatchlist ? faBookmarkSolid : faBookmarkRegular} className={`text-sm ${inWatchlist ? 'text-yellow-400' : 'text-white'}`} />
            <span className="hidden md:inline">{isProcessing ? 'Saving...' : (inWatchlist ? 'Saved' : 'Save')}</span>
        </button>
    );
};

const Movie = ({ movie, updateMovieReview }) => {
    return (
        <div key={movie._id} className="h-full">
            <Link
                to={`/stream/${movie.youtube_id}`}
                className="block h-full text-decoration-none"
            >
                <div className="group relative h-full bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-2">
                    {/* Image Container */}
                    <div className="relative aspect-[2/3] overflow-hidden">
                        {/* Watchlist badge overlay */}
                        <WatchlistButton movie={movie} />

                        <img 
                            src={movie.poster_path || '/default.png'} 
                            alt={movie.title} 
                            onError={(e) => { e.target.onerror = null; e.target.src = '/default.png'; }}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 backdrop-blur-sm">
                            <FontAwesomeIcon 
                                icon={faCirclePlay} 
                                className="text-5xl text-primary drop-shadow-[0_0_15px_rgba(6,182,212,0.8)] transform scale-50 group-hover:scale-100 transition-transform duration-300" 
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col gap-2">
                        <h5 className="text-lg font-bold text-white truncate" title={movie.title}>
                            {movie.title}
                        </h5>

                        {/* Genres */}
                        {Array.isArray(movie.genre) && movie.genre.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-1">
                                {movie.genre.map((g) => (
                                    <span key={g.genre_id} className="text-xs text-gray-300 bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                                        {g.genre_name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Rating */}
                        {movie?.ranking && (
                            <div className="flex items-center gap-3 mt-2">
                                <div className="inline-flex items-center gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <FontAwesomeIcon
                                            key={i}
                                            icon={faStar}
                                            className={`text-sm ${i < Math.round(movie.ranking.ranking_value) ? 'text-yellow-400' : 'text-gray-600'} mr-0`} />
                                    ))}
                                    <span className="text-sm font-semibold text-white bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded ml-2">
                                        {movie.ranking.ranking_value}/5
                                    </span>
                                </div>
                                {movie.ranking.ranking_name && (
                                    <span className="text-sm text-gray-300 truncate">{String(movie.ranking.ranking_name).trim()}</span>
                                )}
                            </div>
                        )}

                        {/* Watchlist & Review Buttons */}
                        <div className="mt-2 flex flex-col gap-2">
                            <button
                                onClick={e => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (typeof updateMovieReview === 'function') {
                                        updateMovieReview(movie.imdb_id);
                                    } else {
                                        // If parent didn't pass review handler, navigate to /review/:imdb_id
                                        // use location change - safer than Link inside Link
                                        window.location.href = `/review/${movie.imdb_id}`;
                                    }
                                }}
                                className="w-full px-4 py-2 text-sm font-medium text-primary hover:text-white border border-primary/30 hover:bg-primary/20 rounded-lg transition-colors"
                            >
                                Review
                            </button>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}
export default Movie;