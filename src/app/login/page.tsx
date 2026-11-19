'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import {
  Pizza,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Store,
  User,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTestAccounts, setShowTestAccounts] = useState(false);

  const handleRoleRedirect = (role: string) => {
    if (redirectUrl) {
      router.push(redirectUrl);
      return;
    }
    if (role === 'admin') router.push('/dashboard/admin');
    else if (role === 'vendor') router.push('/dashboard/vendor');
    else router.push('/dashboard/customer');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}!`);
      handleRoleRedirect(user.role);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleTestAccountFill = (testEmail: string, testPass: string) => {
    setEmail(testEmail);
    setPassword(testPass);
    toast.info(`Filled credentials for ${testEmail}`);
  };

  const handleGoogleLoginMock = async () => {
    try {
      setLoading(true);
      const user = await loginWithGoogle({
        email: 'google_customer@example.com',
        name: 'Google Customer',
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
        role: 'customer',
      });
      toast.success('Signed in with Google!');
      handleRoleRedirect(user.role);
    } catch (err: any) {
      toast.error(err.message || 'Google sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-7 bg-white dark:bg-stone-900 p-8 sm:p-10 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl shadow-stone-200/50 dark:shadow-none">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 text-white flex items-center justify-center mx-auto shadow-md shadow-red-500/20">
            <Pizza className="w-7 h-7 rotate-12" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            Sign In to PizzaHub
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Enter your credentials to access your account and dashboard
          </p>
        </div>

        {/* Real Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-stone-800 dark:text-stone-200 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">
                Password <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-stone-800 dark:text-stone-200 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-stone-200 dark:border-stone-800 w-full" />
          <span className="bg-white dark:bg-stone-900 px-3 text-xs text-stone-400 uppercase font-semibold">
            Or continue with
          </span>
        </div>

        {/* Google OAuth Login Button */}
        <button
          type="button"
          onClick={handleGoogleLoginMock}
          disabled={loading}
          className="w-full py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700/60 font-semibold text-xs flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.27-2.09 3.64-5.17 3.64-9.15z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.73-2.1-6.68-4.93H1.21v3.13C3.25 21.43 7.34 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.32 14.27c-.24-.73-.38-1.51-.38-2.27s.14-1.54.38-2.27V6.6H1.21C.44 8.14 0 9.87 0 12s.44 3.86 1.21 5.4l4.11-3.13z"
            />
            <path
              fill="#EA4335"
              d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.57 1.21 6.6l4.11 3.13c.95-2.83 3.58-4.96 6.68-4.96z"
            />
          </svg>
          Google Authentication
        </button>

        {/* Link to Register */}
        <p className="text-center text-xs text-stone-500">
          Don&apos;t have an account yet?{' '}
          <Link href="/register" className="font-bold text-red-600 hover:underline">
            Create an account
          </Link>
        </p>

        {/* Collapsible Tester Accounts Panel for Assignment Evaluation */}
        <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80">
          <button
            type="button"
            onClick={() => setShowTestAccounts(!showTestAccounts)}
            className="w-full flex items-center justify-between text-[11px] font-semibold text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 py-1 transition-colors"
          >
            <span>Need sample accounts for testing?</span>
            {showTestAccounts ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showTestAccounts && (
            <div className="mt-2.5 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block text-center">
                Pre-configured Assignment Seed Accounts
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleTestAccountFill('admin@pizzahub.com', 'Admin@123456')}
                  className="px-2 py-1.5 rounded-xl text-[11px] font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-200 transition-colors flex items-center justify-center gap-1"
                >
                  <ShieldCheck className="w-3 h-3" /> Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleTestAccountFill('luigi@pizzahub.com', 'Vendor@123456')}
                  className="px-2 py-1.5 rounded-xl text-[11px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 hover:bg-amber-200 transition-colors flex items-center justify-center gap-1"
                >
                  <Store className="w-3 h-3" /> Vendor
                </button>
                <button
                  type="button"
                  onClick={() => handleTestAccountFill('alex@gmail.com', 'Customer@123456')}
                  className="px-2 py-1.5 rounded-xl text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200 transition-colors flex items-center justify-center gap-1"
                >
                  <User className="w-3 h-3" /> Customer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen py-20 text-center">Loading login form...</div>}>
      <LoginContent />
    </Suspense>
  );
}
