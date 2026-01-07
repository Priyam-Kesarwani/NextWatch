import { useState } from 'react';
import axiosClient from '../../api/axiosConfig';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import logo from '../../assets/NextWatchLogo.png';

const Login = () => {
    
    const { setAuth } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const from = location.state?.from?.pathname || "/";
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);       

        try {
            const response = await axiosClient.post('/login', { email, password });
            console.log(response.data);
            if (response.data.error) {
                setError(response.data.error);
                return;
            }
           // console.log(response.data);
            setAuth(response.data);
            
           // localStorage.setItem('user', JSON.stringify(response.data));
            // Handle successful login (e.g., store token, redirect)
           navigate(from, {replace: true});
           //navigate('/');

        } catch (err) {
            console.error(err);
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    }; 
    return (
        <div className="min-h-screen flex items-center justify-center bg-darker px-4">
            <div className="max-w-md w-full bg-card/50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/10 relative overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute top-0 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 -right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl"></div>

                <div className="text-center mb-8 relative z-10">
                    <img src={logo} alt="Logo" width={60} className="mb-4 mx-auto drop-shadow-lg" />
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Sign In
                    </h2>
                    <p className="text-gray-400 mt-2">Welcome back! Please login to your account.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm text-center relative z-10">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Email address
                        </label>
                        <input
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoFocus
                            className="w-full bg-dark/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-gray-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-dark/50 border border-gray-700 text-white rounded-lg px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-gray-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 rounded-lg hover:opacity-90 transition-all transform hover:-translate-y-0.5 shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                Logging in...
                            </>
                        ) : 'Login'}
                    </button>
                </form>

                <div className="text-center mt-6 relative z-10">
                    <span className="text-gray-400 text-sm">Don't have an account? </span>
                    <Link to="/register" className="text-primary hover:text-secondary font-semibold text-sm transition-colors">
                        Register here
                    </Link>
                </div>
            </div>
        </div>
    )
}
export default Login;