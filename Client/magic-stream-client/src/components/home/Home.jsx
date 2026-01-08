import {useState, useEffect, useMemo, useRef} from 'react';
import axiosClient from '../../api/axiosConfig'
import Movies from '../movies/Movies';
import Spinner from '../spinner/Spinner';
import SearchAndSort from '../search/SearchAndSort';

const Home =({updateMovieReview}) => {
    const [allMovies, setAllMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState();
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    
    // Search and filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('title-asc');
    const [selectedGenres, setSelectedGenres] = useState([]);
    const debounceTimerRef = useRef(null);

    // Handle when a movie is removed from watchlist
    const handleMovieRemoved = (removedMovieId) => {
        setAllMovies(prevMovies => prevMovies.filter(movie => movie.imdb_id !== removedMovieId));
    };

    // Debounce search query - update debouncedSearchQuery after user stops typing
    useEffect(() => {
        // Clear existing timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Set new timer to update debounced value after 500ms
        debounceTimerRef.current = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);

        // Cleanup timer on unmount or when searchQuery changes
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [searchQuery]);

    // Fetch movies with pagination and watchlist status
    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            setMessage("");
            try {
                // First, fetch the movies with search and filter parameters
                const [moviesResponse, watchlistResponse] = await Promise.all([
                    axiosClient.get('/movies', { 
                        params: { 
                            page, 
                            limit: 20,
                            search: debouncedSearchQuery,
                            genres: selectedGenres.join(','),
                            sort: sortBy
                        } 
                    }),
                    // Fetch user's watchlist to mark movies
                    axiosClient.get('/watchlist').catch(() => ({ data: [] }))
                ]);
                
                if (Array.isArray(moviesResponse.data)) {
                    // Get watchlist movie IDs for quick lookup
                    const watchlistIds = new Set(
                        Array.isArray(watchlistResponse.data) 
                            ? watchlistResponse.data.map(movie => movie.imdb_id)
                            : []
                    );
                    
                    // Mark movies that are in the watchlist
                    const moviesWithWatchlistFlag = moviesResponse.data.map(movie => ({
                        ...movie,
                        is_in_watchlist: watchlistIds.has(movie.imdb_id),
                        watchlisted: watchlistIds.has(movie.imdb_id)
                    }));
                    
                    // If it's the first page, replace the movies, otherwise append
                    setAllMovies(prev => page === 1 
                        ? moviesWithWatchlistFlag 
                        : [...prev, ...moviesWithWatchlistFlag]);
                    
                    if (moviesResponse.data.length === 0) {
                        setHasMore(false);
                        if (page === 1) {
                            setMessage('There are currently no movies available');
                        }
                    } else {
                        setHasMore(true);
                    }
                } else {
                    console.warn('Unexpected /movies response format:', response.data);
                    if (page === 1) {
                        setAllMovies([]);
                        setMessage('Unexpected response from server');
                    }
                    setHasMore(false);
                }
            }catch(error){
                console.error('Error fetching movies:', error)
                if (page === 1) {
                    setMessage("Error fetching movies")
                }
                setHasMore(false);
            }finally{
                setLoading(false)
            }
        }
        fetchMovies();
    }, [page, debouncedSearchQuery, sortBy, selectedGenres]);

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

    // Handle filter and sort changes by resetting to page 1
    useEffect(() => {
        setPage(1);
        setAllMovies([]);
        setHasMore(true);
    }, [debouncedSearchQuery, selectedGenres, sortBy]);

    // Filter and sort movies (server-side, just return as is)
    const filteredAndSortedMovies = useMemo(() => {
        // Server is handling filtering and sorting, so just return movies as is
        return allMovies;
    }, [allMovies]);

    // Update message based on filtered results
    useEffect(() => {
        if (!loading) {
            if (filteredAndSortedMovies.length === 0) {
                if (debouncedSearchQuery || selectedGenres.length > 0) {
                    setMessage('No movies match your search criteria');
                } else {
                    setMessage('There are currently no movies available');
                }
            } else {
                setMessage('');
            }
        }
    }, [filteredAndSortedMovies.length, debouncedSearchQuery, selectedGenres.length, loading]);

    const handleScroll = () => {
        // Allow infinite scroll for all cases including search
        if (!hasMore || loading) return;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        const fullHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        if (scrollTop + windowHeight + 50 >= fullHeight) {
            setPage(prevPage => prevPage + 1);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore, loading]);

    return (
        <>
            {loading && page === 1 ? (
                <Spinner/>
            ) : (
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
                    {loading && page > 1 && <Spinner />}
                </>
            )}
        </>

    );

};

export default Home;



