'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Pizza,
  LayoutDashboard,
  UtensilsCrossed,
  PlusCircle,
  ShoppingBag,
  CreditCard,
  User,
  Users,
  ShieldCheck,
  Receipt,
  LogOut,
  Menu,
  X,
  Sparkles,
  Heart,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  allowedRole: 'customer' | 'vendor' | 'admin';
}

export function DashboardLayout({ children, allowedRole }: DashboardLayoutProps) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user) {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      // Strict role check: If user attempts to access another role's dashboard
      if (user.role !== allowedRole) {
        if (user.role === 'admin') router.push('/dashboard/admin');
        else if (user.role === 'vendor') router.push('/dashboard/vendor');
        else router.push('/dashboard/customer');
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRole, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-950">
        <div className="w-12 h-12 rounded-full border-4 border-red-600 border-t-transparent animate-spin mb-4" />
        <p className="text-sm font-semibold text-stone-600 dark:text-stone-300">
          Verifying security credentials...
        </p>
      </div>
    );
  }

  // Blocked account protection screen
  if (user?.isBlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 p-6">
        <div className="max-w-md w-full text-center bg-white dark:bg-stone-900 rounded-3xl p-8 border border-red-200 dark:border-red-900 shadow-xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-stone-900 dark:text-stone-100">
            Account Suspended
          </h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            Your account has been blocked by a platform administrator. Access to protected dashboard features and ordering is restricted. Please contact support@pizzahub.com.
          </p>
          <button
            onClick={logout}
            className="w-full py-2.5 rounded-xl font-bold text-xs bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  if (!user || user.role !== allowedRole) {
    return null; // Will redirect via useEffect
  }

  // Navigation Links definition per role
  const getNavLinks = () => {
    if (allowedRole === 'vendor') {
      return [
        { href: '/dashboard/vendor', label: 'Overview', icon: LayoutDashboard },
        { href: '/dashboard/vendor/menu', label: 'My Menu Items', icon: UtensilsCrossed },
        { href: '/dashboard/vendor/add-item', label: 'Add Menu Item', icon: PlusCircle },
        { href: '/dashboard/vendor/orders', label: 'Customer Orders', icon: ShoppingBag },
        { href: '/dashboard/vendor/subscription', label: 'Subscription Plan', icon: CreditCard },
        { href: '/dashboard/vendor/profile', label: 'Profile Settings', icon: User },
      ];
    } else if (allowedRole === 'customer') {
      return [
        { href: '/dashboard/customer', label: 'Overview', icon: LayoutDashboard },
        { href: '/dashboard/customer/orders', label: 'My Orders', icon: ShoppingBag },
        { href: '/dashboard/customer/favorites', label: 'Saved Wishlist', icon: Heart },
        { href: '/dashboard/customer/profile', label: 'Profile Settings', icon: User },
      ];
    } else {
      // Admin
      return [
        { href: '/dashboard/admin', label: 'Overview', icon: LayoutDashboard },
        { href: '/dashboard/admin/users', label: 'Manage Users', icon: Users },
        { href: '/dashboard/admin/menu-items', label: 'Manage Menu Items', icon: UtensilsCrossed },
        { href: '/dashboard/admin/transactions', label: 'Transactions', icon: Receipt },
      ];
    }
  };

  const navLinks = getNavLinks();

  const isLinkActive = (href: string) => {
    if (href === `/dashboard/${allowedRole}`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-stone-50/60 dark:bg-stone-950/60 flex">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5">
          {/* Logo */}
          <div className="flex items-center justify-between pb-6 border-b border-stone-100 dark:border-stone-800">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-red-500/20">
                <Pizza className="w-5 h-5 rotate-12" />
              </div>
              <div>
                <span className="font-extrabold text-base bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent">
                  PizzaHub
                </span>
                <span className="text-[10px] block font-bold text-stone-400 -mt-1 uppercase tracking-wider">
                  {allowedRole} Portal
                </span>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                      : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </div>
                  {active && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile Card at bottom of sidebar */}
        <div className="p-4 border-t border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 space-y-2.5">
          <div className="flex items-center gap-3">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-red-500/30"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-red-500 to-amber-500 text-white font-bold text-xs flex items-center justify-center">
                {user.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                {user.name}
              </p>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-stone-400 capitalize">{user.role}</span>
                {user.subscriptionPlan === 'premium' && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500 text-white">
                    <Sparkles className="w-2 h-2" /> PRO
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              logout();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-900/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header bar with Mobile Toggle */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              <Menu className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              {allowedRole} Workspace
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1"
            >
              <Pizza className="w-3.5 h-3.5" /> Store
            </Link>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                logout();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-900/40 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
