'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [activeLink, setActiveLink] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setIsAuthenticated(true);
      const userData = JSON.parse(user);
      setUserName(userData.name);
    }
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'Features', href: '#features', id: 'features' },
    { name: 'Recommend', href: '#recommend', id: 'recommend' },
    { name: 'About', href: '#about', id: 'about' },
  ];

  return (
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-4xl">
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-full px-8 py-4 shadow-2xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="#home" className="text-xl font-bold text-white">
            FitRec
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setActiveLink(link.id)}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  activeLink === link.id
                    ? 'bg-white/20 text-white font-semibold'
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          {isAuthenticated ? (
            <button 
              onClick={() => router.push('/dashboard')}
              className="hidden sm:block px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-semibold hover:scale-105 transition-transform duration-300 shadow-lg shadow-cyan-500/50"
            >
              Dashboard
            </button>
          ) : (
            <button 
              onClick={() => router.push('/login')}
              className="hidden sm:block px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-semibold hover:scale-105 transition-transform duration-300 shadow-lg shadow-cyan-500/50"
            >
              Login
            </button>
          )}

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
