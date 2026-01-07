import { useNavigate, NavLink, Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth';
import logo from '../../assets/NextWatchLogo.png';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Header = ({ handleLogout }) => {
    const navigate = useNavigate();
    const { auth } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className="sticky top-0 z-50 bg-darker/90 backdrop-blur-md border-b border-white/10 shadow-lg">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Brand */}
                    <Link to="/" className="flex items-center gap-2 text-decoration-none group">
                        <img
                            alt="NextWatch Logo"
                            src={logo}
                            className="w-8 h-8 transition-transform group-hover:scale-110"
                        />
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            NextWatch
                        </span>
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden text-gray-300 hover:text-white focus:outline-none"
                        onClick={toggleMenu}
                    >
                        <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className="text-xl" />
                    </button>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8">
                        <div className="flex gap-6">
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `text-sm font-medium transition-colors hover:text-primary ${
                                        isActive ? 'text-primary' : 'text-gray-300'
                                    }`
                                }
                            >
                                Home
                            </NavLink>
                            <NavLink
                                to="/recommended"
                                className={({ isActive }) =>
                                    `text-sm font-medium transition-colors hover:text-primary ${
                                        isActive ? 'text-primary' : 'text-gray-300'
                                    }`
                                }
                            >
                                Recommended
                            </NavLink>
                        </div>

                        <div className="flex items-center gap-4">
                            {auth ? (
                                <>
                                    <span className="text-sm text-gray-300">
                                        Hello, <strong className="text-white">{auth.first_name}</strong>
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-1.5 text-sm font-medium text-white border border-white/20 rounded-full hover:bg-white/10 transition-all"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => navigate("/login")}
                                        className="px-4 py-1.5 text-sm font-medium text-primary hover:text-white transition-colors"
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => navigate("/register")}
                                        className="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary rounded-full hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all transform hover:-translate-y-0.5"
                                    >
                                        Register
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden mt-4 pb-4 border-t border-white/10 pt-4 animate-fadeIn">
                        <div className="flex flex-col gap-4">
                            <NavLink
                                to="/"
                                onClick={() => setIsMenuOpen(false)}
                                className={({ isActive }) =>
                                    `block text-base font-medium ${
                                        isActive ? 'text-primary' : 'text-gray-300'
                                    }`
                                }
                            >
                                Home
                            </NavLink>
                            <NavLink
                                to="/recommended"
                                onClick={() => setIsMenuOpen(false)}
                                className={({ isActive }) =>
                                    `block text-base font-medium ${
                                        isActive ? 'text-primary' : 'text-gray-300'
                                    }`
                                }
                            >
                                Recommended
                            </NavLink>
                            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                                {auth ? (
                                    <>
                                        <span className="text-sm text-gray-300">
                                            Hello, <strong className="text-white">{auth.first_name}</strong>
                                        </span>
                                        <button
                                            onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                                            className="w-full px-4 py-2 text-sm font-medium text-center text-white border border-white/20 rounded-lg hover:bg-white/10"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => { navigate("/login"); setIsMenuOpen(false); }}
                                            className="w-full px-4 py-2 text-sm font-medium text-center text-white/80 hover:text-white bg-white/5 rounded-lg"
                                        >
                                            Login
                                        </button>
                                        <button
                                            onClick={() => { navigate("/register"); setIsMenuOpen(false); }}
                                            className="w-full px-4 py-2 text-sm font-medium text-center text-white bg-gradient-to-r from-primary to-secondary rounded-lg"
                                        >
                                            Register
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
export default Header;