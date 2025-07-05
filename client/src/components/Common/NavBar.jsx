import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../services/Operations/authApi";

function NavBar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);

    const dropdownRef = useRef(null);
    const mobileMenuContainerRef = useRef(null);

    // Close desktop dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        if (dropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownOpen]);

    // Close mobile menu on outside click
    useEffect(() => {
        const handleClickOutsideMobile = (event) => {
            if (
                mobileMenuContainerRef.current &&
                !mobileMenuContainerRef.current.contains(event.target)
            ) {
                setMenuOpen(false);
            }
        };
        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutsideMobile);
        }
        return () => document.removeEventListener("mousedown", handleClickOutsideMobile);
    }, [menuOpen]);

    // Hide dropdown when token updates
    useEffect(() => {
        setDropdownOpen(false);
    }, [token]);

    const handleLogout = () => dispatch(logout(navigate));
    const handleLogin = () => navigate('/login');
    const handleSignup = () => navigate('/signup');
    const toggleMenu = () => setMenuOpen(!menuOpen);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    const onClickFeatures = () => navigate('/');
    const onClickAbout = () => navigate('/');

    return (
        <nav className="sticky top-0 bg-white shadow-md z-50">
            <div className="flex items-center p-5 md:px-10 relative">
                {/* Logo */}
                <div className="text-[1.8rem] font-bold bg-gradient-to-r from-indigo-400 to-purple-600 bg-clip-text text-transparent cursor-pointer flex items-center">
                    TravelSync
                </div>

                {/* Center Nav Links - Hidden on mobile */}
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
                    <ul className="flex gap-8 list-none">
                        <li><a onClick={onClickFeatures} className="font-medium hover:text-[#667eea]" href="#features">Features</a></li>
                        <li><a onClick={onClickAbout} className="font-medium hover:text-[#667eea]" href="#about">About</a></li>
                        <li><a onClick={onClickAbout} className="font-medium hover:text-[#667eea]" href="#contact">Contact</a></li>
                    </ul>
                </div>

                {/* Desktop Right Side */}
                <div className="hidden md:flex gap-5 items-center ml-auto">
                    {token ? (
                        <div className="relative cursor-pointer" ref={dropdownRef}>
                            <button onClick={toggleDropdown} className="flex items-center gap-2 focus:outline-none">
                                <div className="w-9 h-9 cursor-pointer rounded-full  bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-semibold text-sm">
                                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                                </div>
                                <span className="text-sm cursor-pointer">▼</span>
                            </button>
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-md py-2 z-50">
                                    <button onClick={() => navigate("/my-profile")} className="block w-full text-left cursor-pointer px-4 py-2 text-sm hover:bg-gray-100">
                                        Dashboard
                                    </button>
                                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm cursor-pointer hover:bg-gray-100">
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <button onClick={handleLogin} className="text-[#333] font-medium px-5 py-2 rounded-full hover:text-indigo-400 hover:bg-indigo-400/10 transition cursor-pointer">
                                Login
                            </button>
                            <button onClick={handleSignup} className="bg-gradient-to-r from-indigo-400 to-purple-600 text-white px-5 py-2 rounded-full font-semibold hover:-translate-y-0.5 hover:shadow-lg transition cursor-pointer">
                                SignUp
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile Hamburger */}
                <div className="md:hidden ml-auto flex items-center " ref={mobileMenuContainerRef}>
                    {/* Hamburger */}
                    <button onClick={toggleMenu} className="flex cursor-pointer flex-col justify-center items-center w-10 h-10 gap-1" >
                        <span className={`block h-0.5 w-5 bg-gray-800 rounded transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                        <span className={`block h-0.5 w-5 bg-gray-800 rounded transition-opacity duration-300 ${menuOpen ? 'opacity-0' : 'opacity-100'}`} />
                        <span className={`block h-0.5 w-5 bg-gray-800 rounded transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                    </button>

                    {/* Mobile Menu */}
                    {menuOpen && (
                        <div className="fixed top-28 right-5 w-[38%] max-w-xs bg-white rounded-lg shadow-lg p-6 flex flex-col gap-6 animate-slideIn z-50">
                            <a href="#features" className="font-medium hover:text-indigo-500 transition">Features</a>
                            <a href="#about" className="font-medium hover:text-indigo-500 transition">About</a>
                            <a href="#contact" className="font-medium hover:text-indigo-500 transition">Contact</a>

                            {token ? (
                                <>
                                    <button onClick={() => navigate("/my-profile")} className="text-indigo-600 font-semibold px-4 py-2 text-left cursor-pointer">Dashboard</button>
                                    <button onClick={handleLogout} className="text-red-500 font-semibold px-4 py-2 text-left cursor-pointer">Logout</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={handleLogin} className="text-indigo-600 font-semibold border border-indigo-600 rounded-full px-4 py-2 hover:bg-indigo-50 transition cursor-pointer">Login</button>
                                    <button onClick={handleSignup} className="bg-gradient-to-r from-indigo-400 to-purple-600 text-white px-4 py-2 rounded-full font-semibold hover:shadow-lg transition cursor-pointer">SignUp</button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default NavBar;