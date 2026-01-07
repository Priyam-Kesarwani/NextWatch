import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons';

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
                        <img 
                            src={movie.poster_path} 
                            alt={movie.title} 
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

                        {/* Review Button */}
                        {updateMovieReview && (
                            <button
                                onClick={e => {
                                    e.preventDefault();
                                    updateMovieReview(movie.imdb_id);
                                }}
                                className="mt-2 w-full px-4 py-2 text-sm font-medium text-primary hover:text-white border border-primary/30 hover:bg-primary/20 rounded-lg transition-colors"
                            >
                                Review
                            </button>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    )
}
export default Movie;