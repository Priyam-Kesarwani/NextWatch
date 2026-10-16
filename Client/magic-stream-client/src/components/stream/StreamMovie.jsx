import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import ReactPlayer from 'react-player';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTriangleExclamation, 
    faArrowLeft, 
    faFilm 
} from '@fortawesome/free-solid-svg-icons';

const StreamMovie = () => {
    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Movie details passed from card state (if available)
    const movie = location.state?.movie;
    const rawKey = params.yt_id || movie?.youtube_id;
    const key = (rawKey && rawKey !== 'undefined' && rawKey !== 'null') ? String(rawKey).trim() : '';

    const [error, setError] = useState(false);
    const [isReady, setIsReady] = useState(false);

    const movieTitle = movie?.title || 'This movie';
    const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(movieTitle + ' official trailer')}`;

    // Render helpful fallback if key is empty or video fails to load
    const renderUnavailable = (isFailedLoad = false) => (
        <div className="min-h-[85vh] bg-gradient-to-b from-darker via-card/40 to-darker flex items-center justify-center px-4 py-12">
            <div className="max-w-lg w-full bg-card/80 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md text-center">
                {movie?.poster_path && (
                    <div className="w-32 h-44 mx-auto mb-6 rounded-xl overflow-hidden shadow-xl border border-white/10">
                        <img 
                            src={movie.poster_path} 
                            alt={movieTitle} 
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    </div>
                )}

                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 text-2xl">
                    <FontAwesomeIcon icon={faTriangleExclamation} />
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">
                    {movie ? movieTitle : 'Video Not Available'}
                </h2>

                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                    {isFailedLoad
                        ? 'The video could not be loaded directly. It may have been removed or restricted by YouTube.'
                        : 'A direct trailer stream is not linked for this title yet.'}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                        Go Back
                    </button>

                    <a
                        href={youtubeSearchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white text-sm font-semibold transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <FontAwesomeIcon icon={faFilm} />
                        Search Trailer on YouTube
                    </a>
                </div>
            </div>
        </div>
    );

    // If no valid YouTube ID exists, show friendly fallback
    if (!key) {
        return renderUnavailable(false);
    }

    if (error) {
        return renderUnavailable(true);
    }

    return (
        <div className="w-full min-h-[85vh] bg-black flex flex-col items-center justify-center overflow-hidden">
            <div className="w-full h-[85vh] relative">
                <ReactPlayer 
                    controls={true} 
                    playing={true} 
                    url={`https://www.youtube.com/watch?v=${key}`}
                    width='100%' 
                    height='100%' 
                    onError={() => setError(true)}
                    onReady={() => setIsReady(true)}
                    config={{
                        youtube: {
                            playerVars: { 
                                showinfo: 1,
                                modestbranding: 1
                            }
                        }
                    }}
                />
                {!isReady && !error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <div className="text-white text-sm sm:text-base font-medium flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full bg-primary animate-ping"></span>
                            Loading video...
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StreamMovie;
