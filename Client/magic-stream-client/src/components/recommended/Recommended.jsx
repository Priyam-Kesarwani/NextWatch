import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {useEffect, useState, useMemo} from 'react';
import { useNavigate } from 'react-router-dom';
import Movies from '../movies/Movies';
import Spinner from '../spinner/Spinner';
import SearchAndSort from '../search/SearchAndSort';
import axiosClient from '../../api/axiosConfig';

const Recommended = () => {
    const [allMovies, setAllMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    
    // Search and filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('rating-desc'); // Default to best rated for recommendations
    const [selectedGenres, setSelectedGenres] = useState([]);

    // Handle when a movie is removed from watchlist
    const handleMovieRemoved = (removedMovieId) => {
        setAllMovies(prevMovies => prevMovies.filter(movie => movie.imdb_id !== removedMovieId));
    };

    // Navigate to review page
    const updateMovieReview = (imdb_id) => {
        navigate(`/review/${imdb_id}`);
    };

    // Fetch recommended movies with watchlist status
    useEffect(() => {
        let isMounted = true;
        const maxRetries = 2;
        
        const fetchRecommendedMovies = async (attempt = 0) => {
            if (!isMounted) return;
            
            setLoading(true);
            setMessage("");

            try {
                // Add a small delay to ensure cookies are ready after navigation
                // Longer delay on retries
                await new Promise(resolve => setTimeout(resolve, 50 + (attempt * 200)));
                
                // Fetch recommended movies and watchlist in parallel
                const [recommendedResponse, watchlistResponse] = await Promise.all([
                    axiosPrivate.get('/recommendedmovies'),
                    // Fetch user's watchlist to mark movies
                    axiosPrivate.get('/watchlist').catch(() => ({ data: [] }))
                ]);
                
                if (isMounted) {
                    const recommendedMovies = recommendedResponse.data || [];
                    
                    // Get watchlist movie IDs for quick lookup
                    const watchlistIds = new Set(
                        Array.isArray(watchlistResponse.data) 
                            ? watchlistResponse.data.map(movie => movie.imdb_id)
                            : []
                    );
                    
                    // Mark movies that are in the watchlist
                    const moviesWithWatchlistFlag = recommendedMovies.map(movie => ({
                        ...movie,
                        is_in_watchlist: watchlistIds.has(movie.imdb_id),
                        watchlisted: watchlistIds.has(movie.imdb_id)
                    }));
                    
                    setAllMovies(moviesWithWatchlistFlag);
                    
                    if (moviesWithWatchlistFlag.length === 0) {
                        setMessage('No recommended movies available');
                    }
                }
            } catch (error){
                console.error("Error fetching recommended movies:", error);
                if (isMounted) {
                    // Retry on network errors (not 401/403 which are auth errors)
                    const isNetworkError = error.code === 'ERR_NETWORK' || !error.response;
                    const isAuthError = error.response?.status === 401 || error.response?.status === 403;
                    
                    if (isNetworkError && attempt < maxRetries && !isAuthError) {
                        console.log(`Retrying fetch (attempt ${attempt + 1}/${maxRetries})...`);
                        // Wait before retry
                        await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
                        return fetchRecommendedMovies(attempt + 1);
                    }
                    
                    if (error.response?.status === 401) {
                        setMessage('Authentication failed. Please try logging in again.');
                    } else if (error.response?.status === 403) {
                        setMessage('Access denied. You may not have permission to view recommended movies.');
                    } else if (isNetworkError) {
                        setMessage('Network error. Please check your connection and try again.');
                    } else {
                        setMessage('Failed to load recommended movies. Please try again later.');
                    }
                    setAllMovies([]);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }
        fetchRecommendedMovies(0);
        
        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch genres
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axiosClient.get('/genres');
                if (Array.isArray(response.data)) {
                    setGenres(response.data);
                }
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };
        fetchGenres();
    }, []);

    // Filter and sort movies
    const filteredAndSortedMovies = useMemo(() => {
        let filtered = [...allMovies];

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(movie =>
                movie.title?.toLowerCase().includes(query)
            );
        }

        // Apply genre filter
        if (selectedGenres.length > 0) {
            filtered = filtered.filter(movie =>
                movie.genre?.some(g => selectedGenres.includes(g.genre_id))
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'title-asc':
                    return (a.title || '').localeCompare(b.title || '');
                case 'title-desc':
                    return (b.title || '').localeCompare(a.title || '');
                case 'rating-asc':
                    // High to Low (1=Excellent first, then 2, 3, 4, 5=Terrible)
                    return (a.ranking?.ranking_value || 999) - (b.ranking?.ranking_value || 0);
                case 'rating-desc':
                    // Low to High (5=Terrible first, then 4, 3, 2, 1=Excellent)
                    return (b.ranking?.ranking_value || 0) - (a.ranking?.ranking_value || 999);
                default:
                    return 0;
            }
        });

        return filtered;
    }, [allMovies, searchQuery, sortBy, selectedGenres]);

    // Update message based on filtered results
    useEffect(() => {
        if (!loading) {
            if (filteredAndSortedMovies.length === 0) {
                if (searchQuery || selectedGenres.length > 0) {
                    setMessage('No recommended movies match your search criteria');
                } else if (allMovies.length === 0) {
                    setMessage('No recommended movies available');
                }
            } else {
                setMessage('');
            }
        }
    }, [filteredAndSortedMovies.length, searchQuery, selectedGenres.length, allMovies.length, loading]);

    return (
        <>
            {loading ? (
                <Spinner/>
            ) :(
                <>
                    <SearchAndSort
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                        genres={genres}
                        selectedGenres={selectedGenres}
                        onGenreFilterChange={setSelectedGenres}
                    />
                    <Movies 
                        movies={filteredAndSortedMovies}
                        updateMovieReview={updateMovieReview}
                        onMovieRemoved={handleMovieRemoved}
                        message={message}
                    />
                </>
            )}
        </>
    )

}
export default Recommended