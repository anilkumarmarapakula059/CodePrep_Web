'use client';

import { useState, useEffect } from 'react';
import Link from 'next/navigation';
import { usePathname, useRouter } from 'next/navigation';
import {
  Code2,
  BookOpen,
  Building2,
  Clock,
  TrendingUp,
  Search,
  Flame,
  Zap,
  User,
  Shield,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Bookmark,
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import SearchModal from './SearchModal';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setCurrentUser(null);
    router.push('/login');
  };

  // 1-Click Fast Switch for Demo Evaluation
  const handleQuickLogin = async (email: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'Password123!' }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        setIsProfileMenuOpen(false);
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const navLinks = [
    { href: '/problems', label: 'Problems', icon: Code2 },
    { href: '/learn', label: 'Learn', icon: BookOpen },
    { href: '/companies', label: 'Companies', icon: Building2 },
    { href: '/mock-interview', label: 'Mock Interview', icon: Clock },
    { href: '/progress', label: 'Progress', icon: TrendingUp },
  ];

  if (currentUser?.role === 'ADMIN') {
    navLinks.push({ href: '/admin', label: 'Admin', icon: Shield });
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <a href="/" className="flex items-center space-x-2 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                  <span className="font-mono text-lg">CP</span>
                </div>
                <div>
                  <span className="text-xl font-bold tracking-tight text-white flex items-center">
                    Code<span className="text-emerald-400">Prep</span>
                  </span>
                  <span className="hidden sm:inline-block text-[10px] uppercase font-semibold tracking-wider text-slate-400 -mt-1">
                    MNC Interview Platform
                  </span>
                </div>
              </a>

              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center space-x-1 ml-8">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname.startsWith(link.href);
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </a>
                  );
                })}
              </nav>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Search Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-colors"
              >
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span>Search problems...</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700">
                  Ctrl K
                </kbd>
              </button>

              <ThemeToggle />

              {/* Authenticated stats and user pill */}
              {currentUser ? (
                <div className="relative flex items-center space-x-2">
                  {/* Streak & XP Badges */}
                  <div className="hidden lg:flex items-center space-x-2">
                    <div
                      title="Current Daily Streak"
                      className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold"
                    >
                      <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{currentUser.profile?.streak || 1}d</span>
                    </div>
                    <div
                      title="Total Experience Points"
                      className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold"
                    >
                      <Zap className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                      <span>{currentUser.profile?.xp || 0} XP</span>
                    </div>
                  </div>

                  {/* Profile Dropdown Toggle */}
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/70 text-slate-200 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                      {currentUser.profile?.fullName?.[0] || 'U'}
                    </div>
                    <span className="hidden sm:inline-block text-xs font-medium max-w-[100px] truncate">
                      {currentUser.profile?.fullName || 'User'}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 top-12 w-64 rounded-xl bg-slate-900 border border-slate-700/80 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                      <div className="px-3 py-2 border-b border-slate-800 mb-1">
                        <p className="text-sm font-semibold text-white">
                          {currentUser.profile?.fullName}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                        <div className="mt-1 flex items-center space-x-2">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase font-semibold">
                            {currentUser.role}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            Level {currentUser.profile?.level || 1}
                          </span>
                        </div>
                      </div>

                      <a
                        href="/dashboard"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <span>My Dashboard</span>
                      </a>

                      <a
                        href="/profile"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <User className="w-4 h-4 text-sky-400" />
                        <span>View Profile & Settings</span>
                      </a>

                      <a
                        href="/bookmarks"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <Bookmark className="w-4 h-4 text-amber-400" />
                        <span>My Saved Problems</span>
                      </a>

                      {/* Demo Quick Switching */}
                      <div className="border-t border-slate-800 my-1 pt-1">
                        <div className="px-3 py-1 text-[10px] font-semibold uppercase text-slate-400">
                          Switch Demo Role
                        </div>
                        <button
                          onClick={() => handleQuickLogin('student@codeprep.dev')}
                          className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-emerald-400 flex items-center justify-between"
                        >
                          <span>Student (Narendra)</span>
                          <span className="text-[10px] text-slate-400">Placement</span>
                        </button>
                        <button
                          onClick={() => handleQuickLogin('pro@codeprep.dev')}
                          className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-emerald-400 flex items-center justify-between"
                        >
                          <span>Professional (Vikram)</span>
                          <span className="text-[10px] text-slate-400">Job Switch</span>
                        </button>
                        <button
                          onClick={() => handleQuickLogin('admin@codeprep.dev')}
                          className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-emerald-400 flex items-center justify-between"
                        >
                          <span>Admin Panel</span>
                          <span className="text-[10px] text-slate-400">Full Access</span>
                        </button>
                      </div>

                      <div className="border-t border-slate-800 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <a
                    href="/login"
                    className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-colors"
                  >
                    Log In
                  </a>
                  <a
                    href="/register"
                    className="px-3.5 py-1.5 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-sm"
                  >
                    Sign Up
                  </a>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              >
                {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileNavOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-2">
            <button
              onClick={() => {
                setIsMobileNavOpen(false);
                setIsSearchOpen(true);
              }}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-300"
            >
              <Search className="w-4 h-4 text-emerald-400" />
              <span>Search catalog...</span>
            </button>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileNavOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </a>
              );
            })}
          </div>
        )}
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
