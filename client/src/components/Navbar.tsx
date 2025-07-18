import React from 'react';
import { Link } from 'wouter';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <span className="text-2xl font-bold font-devanagari text-sky-blue dark:text-teal cursor-pointer">
                प्रेरणा
              </span>
            </Link>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Daily Hindi Motivation
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-sky-blue dark:hover:text-teal transition-colors">
              Home
            </Link>
            <Link href="/posts" className="text-gray-700 dark:text-gray-300 hover:text-sky-blue dark:hover:text-teal transition-colors">
              All Posts
            </Link>
            <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-sky-blue dark:hover:text-teal transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-sky-blue dark:hover:text-teal transition-colors">
              Contact
            </Link>
            {user && isAdmin ? (
              <div className="flex items-center space-x-4">
                <Link href="/admin/dashboard" className="bg-sky-blue dark:bg-teal text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                  Dashboard
                </Link>
                <button
                  onClick={signOut}
                  className="text-gray-700 dark:text-gray-300 hover:text-sky-blue dark:hover:text-teal transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link href="/admin/login" className="bg-sky-blue dark:bg-teal text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                Admin Login
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            <button
              className="md:hidden p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-4 mt-4">
              <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-sky-blue dark:hover:text-teal transition-colors">
                Home
              </Link>
              <Link href="/posts" className="text-gray-700 dark:text-gray-300 hover:text-sky-blue dark:hover:text-teal transition-colors">
                All Posts
              </Link>
              <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-sky-blue dark:hover:text-teal transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-sky-blue dark:hover:text-teal transition-colors">
                Contact
              </Link>
              {user && isAdmin ? (
                <div className="flex flex-col space-y-2">
                  <Link href="/admin/dashboard" className="bg-sky-blue dark:bg-teal text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-center">
                    Dashboard
                  </Link>
                  <button
                    onClick={signOut}
                    className="text-gray-700 dark:text-gray-300 hover:text-sky-blue dark:hover:text-teal transition-colors text-left"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link href="/admin/login" className="bg-sky-blue dark:bg-teal text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-center">
                  Admin Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
