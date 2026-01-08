import { Link } from 'react-router-dom';
import { useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay, faStar } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';

const WatchlistButton = ({ movie }) => {
    const axiosPrivate = useAxiosPrivate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [inWatchlist, setInWatchlist] = useState(
        Boolean(movie?.is_in_watchlist || movie?.watchlisted)
    );

    const addToWatchlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isProcessing) return;
        setIsProcessing(true);
        try {
            await axiosPrivate.post('/watchlist', { imdb_id: movie.imdb_id });
            setInWatchlist(true);
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
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <button
            aria-label={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
            onClick={inWatchlist ? removeFromWatchlist : addToWatchlist}
            onMouseDown={(e) => e.preventDefault()}
            className={`absolute top-3 right-3 z-30 p-2 rounded-full ${
                inWatchlist ? 'bg-yellow-400 text-black' : 'bg-black/70 text-white'
            }`}
            disabled={isProcessing}
        >
            <FontAwesomeIcon
                icon={inWatchlist ? faBookmarkSolid : faBookmarkRegular}
            />
        </button>
    );
};

const Movie = ({ movie, updateMovieReview }) => {
    const hasVideo = movie?.youtube_id && movie.youtube_id.trim() !== '';

    const handleMovieClick = (e) => {
        if (!hasVideo) {
            e.preventDefault();
            e.stopPropagation();
            // Show alert or you could use a toast notification library
            alert('Sorry, this video is not available at the moment.');
            return;
        }
    };

    return (
        <div className="h-full">
            <Link 
                to={hasVideo ? `/stream/${movie.youtube_id}` : '#'} 
                onClick={handleMovieClick}
                className="block h-full"
            >
                <div className="group relative h-full rounded-xl overflow-hidden shadow-lg">

                    {/* Poster (NORMAL FLOW – IMPORTANT) */}
                    <img
                        src={movie.poster_path || '/default.png'}
                        alt={movie.title}
                        onError={(e) => (e.target.src = '/default.png')}
                        className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                    />

                    {/* Bookmark */}
                    <WatchlistButton movie={movie} />

                   {/* Title */}
<div className="absolute top-3 left-3 right-14 z-20">
    <h5
        title={movie.title}
        className="
            text-base sm:text-lg font-bold text-white
            bg-black/70 backdrop-blur-sm
            px-4 py-2
            rounded-2xl
            leading-snug
            line-clamp-2 sm:line-clamp-3
            shadow-lg
        "
    >
        {movie.title}
    </h5>
</div>


                    {/* Hover Play */}
                    {hasVideo && (
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                            <FontAwesomeIcon
                                icon={faCirclePlay}
                                className="text-5xl text-primary"
                            />
                        </div>
                    )}

                    {/* Bottom Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">

                        {/* Genres */}
                        {movie.genre?.length > 0 && (
                            <div className="flex gap-2 mb-2">
                                {movie.genre.slice(0, 2).map((g) => (
                                    <span
                                        key={g.genre_id}
                                        className="text-xs text-white bg-black/70 px-2 py-0.5 rounded-full"
                                    >
                                        {g.genre_name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Rating */}
                        {movie?.ranking && (
                            <div className="flex items-center gap-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <FontAwesomeIcon
                                        key={i}
                                        icon={faStar}
                                        className={`text-sm ${
                                            i < 6 - movie.ranking.ranking_value
                                                ? 'text-yellow-400'
                                                : 'text-gray-600'
                                        }`}
                                    />
                                ))}
                                <span className="text-sm text-gray-300">
                                    {movie.ranking.ranking_name}
                                </span>
                            </div>
                        )}

                        {/* Review */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                updateMovieReview
                                    ? updateMovieReview(movie.imdb_id)
                                    : (window.location.href = `/review/${movie.imdb_id}`);
                            }}
                            className="mt-3 w-full py-2 text-primary border border-primary/30 rounded-lg hover:bg-primary/20 transition"
                        >
                            Review
                        </button>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default Movie;
