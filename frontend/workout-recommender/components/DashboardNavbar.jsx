'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardNavbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-4xl">
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-full px-8 py-4 shadow-2xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-white hover:text-cyan-400 transition-colors">
            FitRec
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/dashboard"
              className="px-6 py-2 rounded-full transition-all duration-300 bg-white/20 text-white font-semibold"
            >
              Dashboard
            </Link>
            <Link
              href="/"
              className="px-6 py-2 rounded-full transition-all duration-300 text-gray-300 hover:bg-white/10"
            >
              Home
            </Link>
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center gap-3">
            {user && (
              <span className="hidden sm:block text-gray-300 text-sm">
                {user.name}
              </span>
            )}
            <button 
              onClick={handleLogout}
              className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-semibold hover:scale-105 transition-transform duration-300 shadow-lg shadow-red-500/50"
            >
              Logout
            </button>
          </div>

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
