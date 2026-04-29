import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass-nav py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent-blue flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)]">
              <span className="font-bold text-white text-lg">T</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-white">True<span className="text-primary">Rent</span></span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Home</Link>
            <a href="/#features" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Listings</a>
            {isAuthenticated && (
              <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Dashboard</Link>
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-300 font-medium">Hi, {user?.name?.split(' ')[0]}</span>
                <button onClick={handleLogout} className="text-gray-300 hover:text-white text-sm font-medium transition-colors flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Login</Link>
                <Link to="/signup" className="btn-primary text-sm py-2 px-5 inline-block">Explore App</Link>
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
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Home</Link>
          <a href="/#features" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Listings</a>
          
          {isAuthenticated && (
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Dashboard</Link>
          )}
          
          <div className="pt-4 border-t border-dark-700 flex flex-col space-y-3">
            {isAuthenticated ? (
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-gray-300 hover:text-white block w-full text-left px-3 py-2 text-base font-medium flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white block w-full text-left px-3 py-2 text-base font-medium">Login</Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="btn-primary w-full text-center inline-block">Explore App</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
