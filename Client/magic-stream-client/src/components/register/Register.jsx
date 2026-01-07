import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/NextWatchLogo.png';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [favouriteGenres, setFavouriteGenres] = useState([]);
    const [genres, setGenres] = useState([]);

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleGenreChange = (e) => {
        const options = Array.from(e.target.selectedOptions);
        setFavouriteGenres(options.map(opt => ({
            genre_id: Number(opt.value),
            genre_name: opt.label
        })));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const defaultRole ="USER";

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                first_name: firstName,
                last_name: lastName,
                email,
                password,
                role: defaultRole,
                favourite_genres: favouriteGenres
            };
            const response = await axiosClient.post('/register', payload);
            if (response.data.error) {
                setError(response.data.error);
                return;
            }
            // Registration successful, redirect to login
            navigate('/login', { replace: true });
        } catch {
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        const fetchGenres = async () => {
        try {
            const response = await axiosClient.get('/genres');
            setGenres(response.data);
        } catch (error) {
            console.error('Error fetching movie genres:', error);
        }
        };
    
        fetchGenres();
    }, []);


    return (
        <div className="min-h-screen flex items-center justify-center bg-darker px-4 py-8">
            <div className="max-w-md w-full bg-card/50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/10 relative overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute top-0 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 -right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl"></div>

                <div className="text-center mb-8 relative z-10">
                    <img src={logo} alt="Logo" width={60} className="mb-4 mx-auto drop-shadow-lg" />
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Create Account
                    </h2>
                    <p className="text-gray-400 mt-2">Join NextWatch today.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm text-center relative z-10">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                            <input
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChange={e => setFirstName(e.target.value)}
                                required
                                className="w-full bg-dark/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-gray-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={e => setLastName(e.target.value)}
                                required
                                className="w-full bg-dark/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-gray-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <input
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="w-full bg-dark/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-gray-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className="w-full bg-dark/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-gray-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                            className={`w-full bg-dark/50 border ${password !== confirmPassword && confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-700 focus:border-primary focus:ring-primary'} text-white rounded-lg px-4 py-3 focus:ring-1 outline-none transition-all placeholder-gray-500`}
                        />
                        {password !== confirmPassword && confirmPassword && (
                            <p className="text-red-400 text-xs mt-1">Passwords do not match.</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Favorite Genres</label>
                        <select
                            multiple
                            value={favouriteGenres.map(g => String(g.genre_id))}
                            onChange={handleGenreChange}
                            className="w-full bg-dark/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all scrollbar-thin scrollbar-thumb-primary scrollbar-track-dark h-32"
                        >
                            {genres.map(genre => (
                                <option key={genre.genre_id} value={genre.genre_id} label={genre.genre_name} className="py-2 px-2 hover:bg-primary/20 cursor-pointer">
                                    {genre.genre_name}
                                </option>
                            ))}
                        </select>
                        <p className="text-gray-500 text-xs mt-1">
                            Hold Ctrl (Windows) or Cmd (Mac) to select multiple genres.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 rounded-lg hover:opacity-90 transition-all transform hover:-translate-y-0.5 shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center mt-6"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                Registering...
                            </>
                        ) : 'Register'}
                    </button>
                </form>

                <div className="text-center mt-6 relative z-10">
                    <span className="text-gray-400 text-sm">Already have an account? </span>
                    <Link to="/login" className="text-primary hover:text-secondary font-semibold text-sm transition-colors">
                        Login here
                    </Link>
                </div>
            </div>           
        </div>
    )
}
export default Register;