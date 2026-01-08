import { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';
import Movie from '../movie/Movie'
import Spinner from '../spinner/Spinner';

const Review = () => {

    const [movie, setMovie] = useState({});
    const [loading, setLoading] = useState(false);
    const revText = useRef();
    const { imdb_id } = useParams();
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        let isMounted = true;
        
        const fetchMovie = async () => {
            setLoading(true);
            try {
                // Fetch movie and watchlist in parallel
                const [movieResponse, watchlistResponse] = await Promise.all([
                    axiosPrivate.get(`/movie/${imdb_id}`),
                    // Fetch user's watchlist to mark movies
                    axiosPrivate.get('/watchlist').catch(() => ({ data: [] }))
                ]);
                
                if (isMounted) {
                    const movieData = movieResponse.data;
                    
                    // Get watchlist movie IDs for quick lookup
                    const watchlistIds = new Set(
                        Array.isArray(watchlistResponse.data) 
                            ? watchlistResponse.data.map(movie => movie.imdb_id)
                            : []
                    );
                    
                    // Mark movie if it's in the watchlist
                    const movieWithWatchlistFlag = {
                        ...movieData,
                        is_in_watchlist: watchlistIds.has(movieData.imdb_id),
                        watchlisted: watchlistIds.has(movieData.imdb_id)
                    };
                    
                    setMovie(movieWithWatchlistFlag);
                    console.log(movieWithWatchlistFlag);
                }
            } catch (error) {
                console.error('Error fetching movie:', error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchMovie();
        
        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imdb_id]); // Only re-fetch when imdb_id changes, axiosPrivate is stable

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        try {

            const response = await axiosPrivate.patch(`/updatereview/${imdb_id}`, { admin_review: revText.current.value });
            console.log(response.data);

            setMovie(() => ({
                ...movie,
                admin_review: response.data?.admin_review ?? movie.admin_review,
                ranking: {
                    ranking_name: response.data?.ranking_name ?? movie.ranking?.ranking_name
                }
            }));

        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 401) {
                console.error('Unauthorized access - redirecting to login');
                localStorage.removeItem('user');
                // setAuth(null);
            } else {
                console.error('Error updating review:', err);
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading ? (
                <Spinner />
            ) : (
                <div className="container mx-auto px-4 py-8">
                    <h2 className="text-3xl font-bold text-center mb-8 text-white">Admin Review</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        {/* Movie Card Section */}
                        <div className="flex justify-center">
                            <div className="w-full max-w-sm transform transition-all hover:scale-[1.02]">
                                <Movie movie={movie} />
                            </div>
                        </div>

                        {/* Review Form Section */}
                        <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/5 h-full flex flex-col">
                            {auth && auth.role === "ADMIN" ? (
                                <form onSubmit={handleSubmit} className="flex flex-col h-full gap-4">
                                    <div className="flex-1">
                                        <label className="block text-lg font-medium text-primary mb-3">
                                            Write Review
                                        </label>
                                        <textarea
                                            ref={revText}
                                            required
                                            rows={12}
                                            defaultValue={movie?.admin_review}
                                            placeholder="Write your professional review here..."
                                            className="w-full h-full min-h-[300px] bg-dark/50 border border-gray-700 text-white rounded-xl p-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-gray-500 resize-none text-base leading-relaxed"
                                        />
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <button 
                                            type="submit"
                                            className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-lg hover:shadow-lg hover:shadow-primary/25 transition-all transform hover:-translate-y-0.5"
                                        >
                                            Submit Review
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="flex flex-col h-full">
                                    <h3 className="text-xl font-bold text-primary mb-4">Review</h3>
                                    <div className="bg-dark/30 rounded-xl p-6 border border-white/5 flex-1 text-gray-300 leading-relaxed text-lg">
                                        {movie.admin_review || "No review available yet."}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Review;