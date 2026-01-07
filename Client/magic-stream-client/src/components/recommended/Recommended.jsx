import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {useEffect, useState} from 'react';
import Movies from '../movies/Movies';
import Spinner from '../spinner/Spinner';

const Recommended = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState();
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        let isMounted = true; // Flag to prevent state updates if component unmounts
        
        const fetchRecommendedMovies = async () => {
            setLoading(true);
            setMessage("");

            try{
                const response = await axiosPrivate.get('/recommendedmovies');
                if (isMounted) {
                    setMovies(response.data);
                    if (response.data.length === 0) {
                        setMessage('No recommended movies available');
                    }
                }
            } catch (error){
                console.error("Error fetching recommended movies:", error);
                if (isMounted) {
                    if (error.response?.status === 401) {
                        setMessage('Authentication failed. Please try logging in again.');
                    } else if (error.response?.status === 403) {
                        setMessage('Access denied. You may not have permission to view recommended movies.');
                    } else {
                        setMessage('Failed to load recommended movies. Please try again later.');
                    }
                    setMovies([]);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }

        }
        fetchRecommendedMovies();
        
        // Cleanup function
        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // Empty dependency array - axiosPrivate is stable and doesn't need to be in deps

    return (
        <>
            {loading ? (
                <Spinner/>
            ) :(
                <Movies movies = {movies} message ={message} />
            )}
        </>
    )

}
export default Recommended