import Movie from '../movie/Movie'

const Movies = ({ movies, updateMovieReview, onMovieRemoved, message }) => {
    const handleMovieRemoved = (movieId) => {
        if (typeof onMovieRemoved === 'function') {
            onMovieRemoved(movieId);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.isArray(movies) && movies.length > 0
                    ? movies.map((movie) => (
                        <Movie 
                            key={movie._id} 
                            movie={movie} 
                            updateMovieReview={updateMovieReview}
                            onMovieRemoved={handleMovieRemoved}
                        />
                    ))
                    : <h2 className="text-xl text-center text-gray-400 col-span-full">{message}</h2>
                }
            </div>
        </div>
    )
}

export default Movies;