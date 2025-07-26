import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, isAdmin, signOutUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/70 dark:bg-black/70 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo + Tagline */}
        <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-4">
          <Link to="/">
            <span className="text-3xl font-bold font-devanagari text-sky-blue dark:text-teal hover:scale-105 transition-transform cursor-pointer">
              नववितान
            </span>
          </Link>
          <span className="text-sm text-gray-600 dark:text-gray-400 italic">
            शब्दों से सजे विचारों का आकाश
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6 text-base">
          {['Home', 'All Posts', 'About', 'Contact'].map((item, index) => (
            <Link
              key={index}
              to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(/\s/g, '')}`}
              className="text-gray-700 dark:text-gray-300 hover:text-sky-blue dark:hover:text-teal transition-all hover:scale-105"
            >
              {item}
            </Link>
          ))}

          {user && isAdmin ? (
            <>
              <Link
                to="/admin/dashboard"
                className="bg-gradient-to-r from-sky-400 to-blue-500 dark:from-teal-500 dark:to-teal-700 text-white px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition"
              >
                Dashboard
              </Link>
              <button
                onClick={signOutUser}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              to="/admin/login"
              className="bg-gradient-to-r from-sky-400 to-blue-500 dark:from-teal-500 dark:to-teal-700 text-white px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition"
            >
              Admin Login
            </Link>
          )}
        </div>

        {/* Theme + Mobile Menu Icon */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <button
            className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-zinc-700 text-gray-800 dark:text-white transition-all hover:rotate-90"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pb-6 pt-2 animate-slideDown bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-t border-gray-300 dark:border-gray-800 space-y-4 text-sm rounded-b-xl">
          {['Home', 'All Posts', 'About', 'Contact'].map((item, index) => (
            <Link
              key={index}
              to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(/\s/g, '')}`}
              className="block text-gray-800 dark:text-gray-200 hover:text-sky-blue dark:hover:text-teal transition-colors"
            >
              {item}
            </Link>
          ))}

          {user && isAdmin ? (
            <>
              <Link
                to="/admin/dashboard"
                className="block bg-sky-blue dark:bg-teal text-white py-2 px-4 rounded-lg text-center"
              >
                Dashboard
              </Link>
              <button
                onClick={signOutUser}
                className="block text-red-600 hover:underline mt-2"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              to="/admin/login"
              className="block bg-sky-blue dark:bg-teal text-white py-2 px-4 rounded-lg text-center"
            >
              Admin Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
