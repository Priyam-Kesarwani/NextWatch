import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Movies from '../movies/Movies';
import Spinner from '../spinner/Spinner';
import SearchAndSort from '../search/SearchAndSort';
import axiosClient from '../../api/axiosConfig';

const Watchlist = () => {
    const [allMovies, setAllMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    
    // Search and filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('title-asc');
    const [selectedGenres, setSelectedGenres] = useState([]);

    // Handle when a movie is removed from watchlist
    const handleMovieRemoved = (removedMovieId) => {
        setAllMovies(prevMovies => prevMovies.filter(movie => movie.imdb_id !== removedMovieId));
    };

    // Navigate to review page
    const updateMovieReview = (imdb_id) => {
        navigate(`/review/${imdb_id}`);
    };

    // Fetch watchlist movies
    useEffect(() => {
        let isMounted = true;
        
        const fetchWatchlist = async () => {
            setLoading(true);
            setMessage("");

            try {
                const response = await axiosPrivate.get('/watchlist');
                if (isMounted) {
                    const movies = response.data || [];
                    // Mark all movies as in watchlist
                    const moviesWithWatchlistFlag = movies.map(movie => ({
                        ...movie,
                        is_in_watchlist: true,
                        watchlisted: true
                    }));
                    setAllMovies(moviesWithWatchlistFlag);
                    if (movies.length === 0) {
                        setMessage('Your watchlist is empty. Add movies to your watchlist to see them here!');
                    }
                }
            } catch (error) {
                console.error("Error fetching watchlist:", error);
                if (isMounted) {
                    if (error.response?.status === 401) {
                        setMessage('Authentication failed. Please try logging in again.');
                    } else {
                        setMessage('Failed to load watchlist. Please try again later.');
                    }
                    setAllMovies([]);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };
        
        fetchWatchlist();
        
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
                    setMessage('No watchlist movies match your search criteria');
                } else if (allMovies.length === 0) {
                    setMessage('Your watchlist is empty. Add movies to your watchlist to see them here!');
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
            ) : (
                <>
                    <div className="container mx-auto px-4 pt-8 pb-4">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                            My Watchlist
                        </h1>
                        <p className="text-gray-400">
                            {allMovies.length} {allMovies.length === 1 ? 'movie' : 'movies'} saved
                        </p>
                    </div>
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
    );
};

export default Watchlist;
