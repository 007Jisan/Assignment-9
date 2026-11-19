'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import {
  Pizza,
  Menu,
  X,
  User as UserIcon,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  ShoppingBag,
  Sparkles,
  ShieldAlert,
  Heart,
} from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/dashboard/admin';
    if (user.role === 'vendor') return '/dashboard/vendor';
    return '/dashboard/customer';
  };

  const getProfileSettingsLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/dashboard/admin';
    if (user.role === 'vendor') return '/dashboard/vendor/profile';
    return '/dashboard/customer/profile';
  };

  const isLinkActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/90 dark:bg-stone-950/90 border-b border-stone-200/80 dark:border-stone-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
              <Pizza className="w-6 h-6 rotate-12" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                PizzaHub
              </span>
              <span className="text-[10px] font-medium text-stone-500 dark:text-stone-400 -mt-1 tracking-wider uppercase">
                Oven-Fresh Express
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              href="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                isLinkActive('/') && pathname === '/'
                  ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40'
                  : 'text-stone-700 dark:text-stone-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-stone-100/60 dark:hover:bg-stone-900/60'
              }`}
            >
              Home
            </Link>

            <Link
              href="/menu"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                isLinkActive('/menu')
                  ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40'
                  : 'text-stone-700 dark:text-stone-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-stone-100/60 dark:hover:bg-stone-900/60'
              }`}
            >
              Browse Menu
            </Link>

            {/* Role specific quick shortcuts for logged in users */}
            {isAuthenticated && user && (
              <>
                {user.role === 'customer' && (
                  <>
                    <Link
                      href="/dashboard/customer/orders"
                      className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                        isLinkActive('/dashboard/customer/orders')
                          ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40'
                          : 'text-stone-700 dark:text-stone-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-stone-100/60 dark:hover:bg-stone-900/60'
                      }`}
                    >
                      My Orders
                    </Link>
                    <Link
                      href="/dashboard/customer/favorites"
                      className="px-3.5 py-2 rounded-lg text-sm font-semibold text-stone-700 dark:text-stone-300 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1.5"
                    >
                      <Heart className="w-4 h-4 text-rose-500" />
                      Wishlist
                    </Link>
                  </>
                )}

                {user.role === 'vendor' && (
                  <>
                    <Link
                      href="/dashboard/vendor/menu"
                      className="px-3.5 py-2 rounded-lg text-sm font-semibold text-stone-700 dark:text-stone-300 hover:text-red-600 dark:hover:text-red-400"
                    >
                      My Menu Items
                    </Link>
                    <Link
                      href="/dashboard/vendor/orders"
                      className="px-3.5 py-2 rounded-lg text-sm font-semibold text-stone-700 dark:text-stone-300 hover:text-red-600 dark:hover:text-red-400"
                    >
                      Customer Orders
                    </Link>
                  </>
                )}

                {user.role === 'admin' && (
                  <>
                    <Link
                      href="/dashboard/admin/users"
                      className="px-3.5 py-2 rounded-lg text-sm font-semibold text-stone-700 dark:text-stone-300 hover:text-red-600 dark:hover:text-red-400"
                    >
                      Manage Users
                    </Link>
                    <Link
                      href="/dashboard/admin/menu-items"
                      className="px-3.5 py-2 rounded-lg text-sm font-semibold text-stone-700 dark:text-stone-300 hover:text-red-600 dark:hover:text-red-400"
                    >
                      Review Pizzas
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {!isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2.5">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold text-stone-700 dark:text-stone-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 rounded-xl shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              /* User Profile Dropdown */
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                  className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-900 border border-stone-200 dark:border-stone-800 transition-all focus:outline-none"
                >
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-red-500/30"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-500 to-amber-500 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                      {user?.name?.slice(0, 2) || 'PH'}
                    </div>
                  )}
                  <span className="hidden md:block text-sm font-medium text-stone-800 dark:text-stone-200 max-w-[120px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-stone-400" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-stone-100 dark:border-stone-800">
                      <p className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                        {user?.email}
                      </p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            user?.role === 'admin'
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                              : user?.role === 'vendor'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          }`}
                        >
                          {user?.role}
                        </span>
                        {user?.subscriptionPlan === 'premium' && (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs">
                            <Sparkles className="w-2.5 h-2.5" /> Premium
                          </span>
                        )}
                      </div>
                    </div>

                    <Link
                      href={getDashboardLink()}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-red-500" />
                      Dashboard
                    </Link>

                    <Link
                      href={getProfileSettingsLink()}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-stone-400" />
                      Profile Settings
                    </Link>

                    <div className="border-t border-stone-100 dark:border-stone-800 my-1" />

                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-950/95 px-4 pt-3 pb-5 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg font-semibold text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900"
          >
            Home
          </Link>
          <Link
            href="/menu"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg font-semibold text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900"
          >
            Browse Menu
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                href={getDashboardLink()}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full text-left px-3 py-2 rounded-lg font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 font-semibold text-stone-800 dark:text-stone-200"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-red-600 text-white font-semibold shadow-md"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
