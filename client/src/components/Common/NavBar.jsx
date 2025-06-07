import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NavBar() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogin = () => navigate('/login');
    const handleSignup = () => navigate('/signup');
    const toggleMenu = () => setMenuOpen(!menuOpen);

    const onClickFeatures = ()=>{
        navigate('/')
    }

    const onClickAbout = ()=>{
        navigate('/')
    }

    return (
        <nav className="sticky top-0 bg-white shadow-md z-50">
            <div className="flex items-center justify-between p-5 md:px-10 relative">
                {/* Logo */}
                <div className="text-[1.8rem] font-bold bg-gradient-to-r from-indigo-400 to-purple-600 bg-clip-text text-transparent cursor-pointer">
                    TravelSync
                </div>

                {/* Center Nav Links */}
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
                    <ul className="flex gap-8 list-none">
                        <li><a onClick={onClickFeatures} className="font-medium hover:text-[#667eea]" href="#features">Features</a></li>
                        <li><a onClick={onClickAbout} className="font-medium hover:text-[#667eea]" href="#about">About</a></li>
                        <li><a onClick={onClickAbout} className="font-medium hover:text-[#667eea]" href="#contact">Contact</a></li>
                    </ul>
                </div>

                {/* Auth Buttons */}
                <div className="hidden md:flex gap-5 items-center">
                    <button
                        onClick={handleLogin}
                        className="text-[#333] font-medium px-5 py-2 rounded-full hover:text-indigo-400 hover:bg-indigo-400/10 transition cursor-pointer"
                    >
                        Login
                    </button>
                    <button
                    onClick={handleSignup}
                        className="bg-gradient-to-r from-indigo-400 to-purple-600 text-white px-5 py-2 rounded-full font-semibold hover:-translate-y-0.5 hover:shadow-lg transition cursor-pointer"
                    >
                        SignUp
                    </button>
                </div>

                {/* Hamburger (mobile only) */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5"
                    aria-label="Toggle menu"
                >
                    <span className={`block h-1 w-full bg-gray-800 rounded transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-3' : ''}`} />
                    <span className={`block h-1 w-full bg-gray-800 rounded transition-opacity duration-300 ${menuOpen ? 'opacity-0' : 'opacity-100'}`} />
                    <span className={`block h-1 w-full bg-gray-800 rounded transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </button>
            </div>

            {/* Dropdown Menu for Mobile */}
            {menuOpen && (
                <div className="md:hidden fixed top-16 right-5 w-[38%] max-w-xs bg-white rounded-lg shadow-lg p-6 flex flex-col gap-6 animate-slideIn z-50">
                    <a href="#features" className="font-medium hover:text-indigo-500 transition">Features</a>
                    <a href="#about" className="font-medium hover:text-indigo-500 transition">About</a>
                    <a href="#contact" className="font-medium hover:text-indigo-500 transition">Contact</a>
                    <button
                        onClick={handleLogin}
                        className="text-indigo-600 font-semibold border border-indigo-600 rounded-full px-4 py-2 hover:bg-indigo-50 transition cursor-pointer"
                    >
                        Login
                    </button>
                    <button
                        onClick={handleSignup}
                        className="bg-gradient-to-r from-indigo-400 to-purple-600 text-white px-4 py-2 rounded-full font-semibold hover:shadow-lg transition cursor-pointer"
                    >
                        SignUp
                    </button>
                </div>
            )}
        </nav>
    );
}

export default NavBar;
