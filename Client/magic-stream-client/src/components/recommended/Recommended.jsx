import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Movies from '../movies/Movies';
import Spinner from '../spinner/Spinner';
import SearchAndSort from '../search/SearchAndSort';
import Pagination from '../pagination/Pagination';
import axiosClient from '../../api/axiosConfig';

const Recommended = () => {
    const [allMovies, setAllMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    
    // Pagination state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);

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
            setMessage('');

            try {
                await new Promise(resolve => setTimeout(resolve, 50 + (attempt * 200)));
                
                const [recommendedResponse, watchlistResponse] = await Promise.all([
                    axiosPrivate.get('/recommendedmovies'),
                    axiosPrivate.get('/watchlist').catch(() => ({ data: [] }))
                ]);
                
                if (isMounted) {
                    const recommendedMovies = recommendedResponse.data || [];
                    
                    const watchlistIds = new Set(
                        Array.isArray(watchlistResponse.data) 
                            ? watchlistResponse.data.map(movie => movie.imdb_id)
                            : []
                    );
                    
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
            } catch (error) {
                console.error('Error fetching recommended movies:', error);
                if (isMounted) {
                    const isNetworkError = error.code === 'ERR_NETWORK' || !error.response;
                    const isAuthError = error.response?.status === 401 || error.response?.status === 403;
                    
                    if (isNetworkError && attempt < maxRetries && !isAuthError) {
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
        };

        fetchRecommendedMovies(0);
        
        return () => {
            isMounted = false;
        };
    }, [axiosPrivate]);

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

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(movie =>
                movie.title?.toLowerCase().includes(query)
            );
        }

        if (selectedGenres.length > 0) {
            filtered = filtered.filter(movie =>
                movie.genre?.some(g => selectedGenres.includes(g.genre_id))
            );
        }

        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'title-asc':
                    return (a.title || '').localeCompare(b.title || '');
                case 'title-desc':
                    return (b.title || '').localeCompare(a.title || '');
                case 'rating-asc':
                    return (a.ranking?.ranking_value || 999) - (b.ranking?.ranking_value || 0);
                case 'rating-desc':
                    return (b.ranking?.ranking_value || 0) - (a.ranking?.ranking_value || 999);
                default:
                    return 0;
            }
        });

        return filtered;
    }, [allMovies, searchQuery, sortBy, selectedGenres]);

    // Reset page to 1 when filters change
    useEffect(() => {
        setPage(1);
    }, [searchQuery, selectedGenres, sortBy, pageSize]);

    // Pagination calculations
    const totalPages = Math.max(1, Math.ceil(filteredAndSortedMovies.length / pageSize));
    const paginatedMovies = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredAndSortedMovies.slice(start, start + pageSize);
    }, [filteredAndSortedMovies, page, pageSize]);

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

    const handlePageChange = (newPage) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        setPage(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen pb-12">
            {loading ? (
                <div className="py-20">
                    <Spinner />
                </div>
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
                        movies={paginatedMovies}
                        updateMovieReview={updateMovieReview}
                        onMovieRemoved={handleMovieRemoved}
                        message={message}
                    />

                    {filteredAndSortedMovies.length > 0 && (
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            totalItems={filteredAndSortedMovies.length}
                            pageSize={pageSize}
                            onPageChange={handlePageChange}
                            onPageSizeChange={handlePageSizeChange}
                            pageSizeOptions={[12, 24, 48]}
                            isLoading={loading}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default Recommended;
