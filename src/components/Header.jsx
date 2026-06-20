import React, { useState, useEffect, useRef } from "react";
import { FaUserCircle, FaChevronDown, FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [role, setRole] = useState(localStorage.getItem("role"));

    const navigate = useNavigate();
    const profileRef = useRef(null);

    const isLoggedIn = !!token;
    const isAdmin = role === "admin";

    useEffect(() => {
        const syncAuth = () => {
            setToken(localStorage.getItem("token"));
            setRole(localStorage.getItem("role"));
        };
        window.addEventListener("storage", syncAuth);
        return () => window.removeEventListener("storage", syncAuth);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        navigate("/auth");
        setIsProfileOpen(false);
        setIsMenuOpen(false);
    };

    const handleNavigation = (path) => {
        navigate(path);
        setIsMenuOpen(false);
        setIsProfileOpen(false);
    };

    return (
        <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/80 border-b border-gray-900">
            <div className="w-full px-4 sm:px-6 lg:px-12 py-4">
                <div className="flex items-center justify-between h-16">

                    <Link to="/" className="flex-shrink-0 hover:opacity-80 transition" onClick={() => setIsMenuOpen(false)}>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide whitespace-nowrap">
                            SORT<span className="text-fuchsia-500">MY</span>SCENE
                        </h1>
                    </Link>

                    <div className="hidden md:flex items-center justify-end flex-1 ml-16">
                        <nav className="flex items-center gap-2">
                            <Link to="/" className="px-4 py-2 text-fuchsia-500 font-medium hover:text-fuchsia-400 transition duration-200 rounded-lg">
                                Home
                            </Link>
                            <Link to="/events" className="px-4 py-2 text-gray-300 font-medium hover:text-white hover:bg-zinc-900/50 transition duration-200 rounded-lg">
                                Events
                            </Link>
                            {isAdmin && (
                                <Link to="/admin" className="px-4 py-2 text-gray-300 font-medium hover:text-white hover:bg-zinc-900/50 transition duration-200 rounded-lg">
                                    Admin
                                </Link>
                            )}
                        </nav>

                        <div className="w-px h-8 bg-zinc-700 mx-4"></div>

                        {isLoggedIn ? (
                            <div className="relative" ref={profileRef}>
                                <button onClick={() => setIsProfileOpen(!isProfileOpen)}className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-zinc-900/50 rounded-lg transition duration-200">
                                    <FaUserCircle className="text-gray-200" size={32} />
                                    <FaChevronDown className={`text-gray-300 transition duration-300 ${isProfileOpen ? "rotate-180" : ""}`}size={12}/>
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl py-2">
                                        <button onClick={() => handleNavigation("/bookings")}className="w-full text-left px-4 py-2.5 text-gray-300 hover:text-white hover:bg-zinc-800 transition">
                                            My Bookings
                                        </button>
                                        <hr className="border-zinc-700 my-2" />
                                        <button onClick={handleLogout}className="w-full text-left px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-zinc-800 transition">
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/auth" className="px-5 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold rounded-xl transition">
                                Login
                            </Link>
                        )}
                    </div>

                    <div className="md:hidden flex items-center gap-3">
                        {isLoggedIn && (
                            <button onClick={() => { setIsProfileOpen(!isProfileOpen); setIsMenuOpen(false); }}className="hover:opacity-80 transition">
                                <FaUserCircle className="text-gray-200" size={28} />
                            </button>
                        )}
                        <button onClick={() => { setIsMenuOpen(!isMenuOpen); setIsProfileOpen(false); }}className="text-gray-300 hover:text-white transition">
                            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 border-t border-gray-900">
                        <div className="flex flex-col gap-2 pt-4">
                            <Link to="/" onClick={() => handleNavigation("/")} className="text-fuchsia-500 font-medium hover:text-fuchsia-400 hover:bg-zinc-900/50 transition py-2 px-4 rounded-lg">
                                Home
                            </Link>
                            <Link to="/events" onClick={() => handleNavigation("/events")} className="text-gray-300 font-medium hover:text-white hover:bg-zinc-900/50 transition py-2 px-4 rounded-lg">
                                Events
                            </Link>
                            {isAdmin && (
                                <Link to="/admin" onClick={() => handleNavigation("/admin")} className="text-gray-300 font-medium hover:text-white hover:bg-zinc-900/50 transition py-2 px-4 rounded-lg">
                                    Admin
                                </Link>
                            )}
                            <hr className="border-gray-900 my-2" />
                            {isLoggedIn ? (
                                <>
                                    <button onClick={() => handleNavigation("/bookings")}className="text-left text-gray-300 hover:text-white hover:bg-zinc-900/50 transition py-2 px-4 rounded-lg">
                                        My Bookings
                                    </button>
                                    <button onClick={handleLogout}className="text-left text-red-400 hover:text-red-300 hover:bg-zinc-900/50 transition py-2 px-4 rounded-lg">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link to="/auth" onClick={() => handleNavigation("/auth")} className="text-fuchsia-500 font-medium hover:text-fuchsia-400 hover:bg-zinc-900/50 transition py-2 px-4 rounded-lg">
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                )}

                {isLoggedIn && isProfileOpen && (
                    <div className="md:hidden mt-4 bg-zinc-900 border border-zinc-700 rounded-xl p-3 space-y-2">
                        <button onClick={() => handleNavigation("/bookings")}className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-zinc-800 rounded transition">
                            My Bookings
                        </button>
                        <hr className="border-zinc-700" />
                        <button onClick={handleLogout}className="w-full text-left px-3 py-2 text-red-400 hover:text-red-300 hover:bg-zinc-800 rounded transition">
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;