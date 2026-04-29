import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut, Layout } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass-nav py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent-blue flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)]">
              <span className="font-bold text-white text-lg">T</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-white">True<span className="text-primary">Rent</span></span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Home</a>
            <a href="#features" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Listings</a>
            <a href="#dashboard" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Dashboard</a>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-300 hover:text-white text-sm font-medium transition-colors flex items-center gap-2">
                  <Layout className="w-4 h-4" /> Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-red-400 text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Login</Link>
                <button className="btn-primary text-sm py-2 px-5">Explore App</button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-nav absolute top-full left-0 w-full border-t border-dark-700 p-4 flex flex-col space-y-4">
          <a href="#home" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Home</a>
          <a href="#features" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Listings</a>
          <a href="#dashboard" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Dashboard</a>
          <div className="pt-4 border-t border-dark-700 flex flex-col space-y-3">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium">Dashboard</Link>
                <button 
                  onClick={handleLogout}
                  className="text-left text-gray-300 hover:text-red-400 block px-3 py-2 text-base font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white block w-full text-left px-3 py-2 text-base font-medium">Login</Link>
                <button className="btn-primary w-full text-center">Explore App</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
