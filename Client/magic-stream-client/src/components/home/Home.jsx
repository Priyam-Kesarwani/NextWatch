import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import axiosClient from '../../api/axiosConfig';
import useAuth from '../../hooks/useAuth';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import Movies from '../movies/Movies';
import Spinner from '../spinner/Spinner';
import SearchAndSort from '../search/SearchAndSort';
import Pagination from '../pagination/Pagination';

const Home = ({ updateMovieReview }) => {
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();

    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    
    // Pagination state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [totalPages, setTotalPages] = useState(1);
    const [totalMovies, setTotalMovies] = useState(0);

    // Watchlist state (cached & decoupled from page loads)
    const [watchlistIds, setWatchlistIds] = useState(new Set());

    // Search and filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('title-asc');
    const [selectedGenres, setSelectedGenres] = useState([]);
    const debounceTimerRef = useRef(null);

    // Fetch user's watchlist once when auth state is available
    useEffect(() => {
        let isMounted = true;
        if (!auth?.user_id) {
            setWatchlistIds(new Set());
            return;
        }

        const fetchUserWatchlist = async () => {
            try {
                const response = await axiosPrivate.get('/watchlist');
                if (isMounted && Array.isArray(response.data)) {
                    setWatchlistIds(new Set(response.data.map(m => m.imdb_id)));
                }
            } catch (err) {
                // Non-critical: user can still browse movies even if watchlist fails
                console.warn('Could not load user watchlist:', err);
            }
        };

        fetchUserWatchlist();
        return () => { isMounted = false; };
    }, [auth?.user_id, axiosPrivate]);

    // Handle when a movie is removed from watchlist
    const handleMovieRemoved = (removedMovieId) => {
        setWatchlistIds(prev => {
            const next = new Set(prev);
            next.delete(removedMovieId);
            return next;
        });
    };

    // Debounce search query
    useEffect(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 400);

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [searchQuery]);

    // Reset to page 1 whenever search, filter, sort or page size changes
    useEffect(() => {
        setPage(1);
    }, [debouncedSearchQuery, selectedGenres, sortBy, pageSize]);

    // Fetch movies for current page with filters
    const fetchMovies = useCallback(async () => {
        setLoading(true);
        setMessage('');

        try {
            const response = await axiosClient.get('/movies', {
                params: {
                    page,
                    limit: pageSize,
                    search: debouncedSearchQuery,
                    genres: selectedGenres.join(','),
                    sort: sortBy,
                    paginate: true
                }
            });

            let fetchedMovies = [];
            let total = 0;
            let pages = 1;

            if (Array.isArray(response.data)) {
                fetchedMovies = response.data;
                const headerTotal = Number(response.headers['x-total-count']);
                const headerPages = Number(response.headers['x-total-pages']);
                total = !isNaN(headerTotal) ? headerTotal : fetchedMovies.length;
                pages = !isNaN(headerPages) ? headerPages : Math.max(1, Math.ceil(total / pageSize));
            } else if (response.data && Array.isArray(response.data.movies)) {
                fetchedMovies = response.data.movies;
                total = Number(response.data.total) || fetchedMovies.length;
                pages = Number(response.data.totalPages) || Math.max(1, Math.ceil(total / pageSize));
            }

            setMovies(fetchedMovies);
            setTotalMovies(total);
            setTotalPages(pages);

            if (fetchedMovies.length === 0) {
                if (debouncedSearchQuery || selectedGenres.length > 0) {
                    setMessage('No movies match your search criteria');
                } else {
                    setMessage('There are currently no movies available');
                }
            }
        } catch (error) {
            console.error('Error fetching movies:', error);
            setMovies([]);
            setTotalMovies(0);
            setTotalPages(1);
            setMessage('Failed to load movies. Please check your connection.');
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, debouncedSearchQuery, selectedGenres, sortBy]);

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    // Fetch genres once on mount
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

    // Combine movies with dynamic watchlist status
    const displayedMovies = useMemo(() => {
        return movies.map(movie => ({
            ...movie,
            is_in_watchlist: watchlistIds.has(movie.imdb_id),
            watchlisted: watchlistIds.has(movie.imdb_id)
        }));
    }, [movies, watchlistIds]);

    const handlePageChange = (newPage) => {
        if (newPage === page || loading) return;
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
            {/* Top Heading Banner */}
            <div className="container mx-auto px-4 pt-8 pb-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-2.5">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    21st Century Cinema Collection
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                    Top 500 Movies and Series{' '}
                    <span className="bg-gradient-to-r from-primary via-cyan-400 to-secondary bg-clip-text text-transparent">
                        of the 21st Century
                    </span>
                </h1>
                <p className="text-gray-400 text-xs sm:text-sm mt-1.5 max-w-2xl">
                    Discover, stream trailers, and bookmark the greatest movies and binge-worthy series of the 21st century.
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

            {loading ? (
                <div className="py-20">
                    <Spinner />
                </div>
            ) : (
                <>
                    <Movies
                        movies={displayedMovies}
                        updateMovieReview={updateMovieReview}
                        onMovieRemoved={handleMovieRemoved}
                        message={message}
                    />

                    {displayedMovies.length > 0 && (
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            totalItems={totalMovies}
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

export default Home;
