import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; 

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <Link to="/" className="navbar-link">Home</Link>
                </div>
                <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
                    {token ? (
                        <>
                            <Link to="/add-story" className="navbar-link">Add Story</Link>
                            <Link to="/bookmark" className="navbar-link">Bookmarks</Link>
                            <button onClick={handleLogout} className="navbar-button">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="navbar-link">Login</Link>
                            <Link to="/register" className="navbar-link">Register</Link>
                        </>
                    )}
                </div>
                <div className="navbar-toggle" onClick={toggleMenu}>
                    <span className="navbar-toggle-icon">&#9776;</span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
