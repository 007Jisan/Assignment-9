'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ImageUpload } from '@/components/ImageUpload';
import { toast } from 'sonner';
import {
  Pizza,
  Lock,
  Mail,
  User,
  Store,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Check,
  X,
  KeyRound,
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register, loginWithGoogle } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [image, setImage] = useState('');
  const [role, setRole] = useState<'customer' | 'vendor' | 'admin'>('customer');
  const [businessName, setBusinessName] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [loading, setLoading] = useState(false);

  // Live password validation
  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (!isPasswordValid) {
      toast.error('Password must be at least 6 characters and contain both uppercase and lowercase letters.');
      return;
    }

    if (role === 'vendor' && !businessName.trim()) {
      toast.error('Please provide your Restaurant / Pizzeria Name.');
      return;
    }

    if (role === 'admin' && !adminKey.trim()) {
      toast.error('Please enter the Admin Security Key.');
      return;
    }

    try {
      setLoading(true);
      const user = await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        image: image.trim() || '',
        role,
        businessName: role === 'vendor' ? businessName.trim() : undefined,
        adminKey: role === 'admin' ? adminKey.trim() : undefined,
      });

      toast.success(
        `Registration successful! Welcome to PizzaHub as ${
          user.role === 'admin'
            ? 'Administrator'
            : user.role === 'vendor'
            ? 'Restaurant Partner'
            : 'Foodie'
        }.`
      );

      if (user.role === 'admin') {
        router.push('/dashboard/admin');
      } else if (user.role === 'vendor') {
        router.push('/dashboard/vendor');
      } else {
        router.push('/dashboard/customer');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleMock = async () => {
    try {
      setLoading(true);
      const randomId = Math.random().toString(36).substring(2, 7);
      const user = await loginWithGoogle({
        email: `user_${randomId}@gmail.com`,
        name: name.trim() || 'New Foodie',
        image: image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
        role: role === 'admin' ? 'customer' : role,
      });
      toast.success('Signed in with Google!');
      router.push(user.role === 'vendor' ? '/dashboard/vendor' : '/dashboard/customer');
    } catch (err: any) {
      toast.error(err.message || 'Google sign-up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-7 bg-white dark:bg-stone-900 p-8 sm:p-10 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl shadow-stone-200/50 dark:shadow-none">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 text-white flex items-center justify-center mx-auto shadow-md shadow-red-500/20">
            <Pizza className="w-7 h-7 rotate-12" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            Create Your Account
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Join PizzaHub as a Foodie Customer, Restaurant Partner, or Administrator
          </p>
        </div>

        {/* Role Selector Tabs (Customer, Vendor, Admin) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
            Select Account Role <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-stone-100 dark:bg-stone-800">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                role === 'customer'
                  ? 'bg-white dark:bg-stone-900 text-red-600 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span className="truncate">Customer</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('vendor')}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                role === 'vendor'
                  ? 'bg-white dark:bg-stone-900 text-amber-600 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span className="truncate">Vendor</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                role === 'admin'
                  ? 'bg-white dark:bg-stone-900 text-purple-600 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="truncate">Admin</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Admin Security Passcode Input (Required for Admin Role - clean & secure, no hint) */}
          {role === 'admin' && (
            <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-850/80 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5" />
                Admin Security Key <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Enter administrator authorization key"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white dark:bg-stone-900 border border-purple-200 dark:border-purple-700 outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 text-stone-800 dark:text-stone-200 transition-all font-mono"
                />
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Authorized security passcode is required to create an administrator account.
              </p>
            </div>
          )}
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Mario Rossi"
                required
                autoComplete="name"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-stone-800 dark:text-stone-200 transition-all"
              />
            </div>
          </div>

          {/* Business Name if Vendor */}
          {role === 'vendor' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                Restaurant / Pizzeria Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Store className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Mario's Wood-Fired Pizzeria"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-stone-800 dark:text-stone-200 transition-all"
                />
              </div>
            </div>
          )}

          {/* Email */}
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
                placeholder="mario@example.com"
                required
                autoComplete="email"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-stone-800 dark:text-stone-200 transition-all"
              />
            </div>
          </div>

          {/* Password with Live Validation Checklist */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="new-password"
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

            {/* Validation Checklist */}
            <div className="mt-2.5 p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800 space-y-1 text-[11px]">
              <div className="flex items-center gap-1.5">
                {hasMinLength ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <X className="w-3.5 h-3.5 text-stone-300 dark:text-stone-600 shrink-0" />
                )}
                <span className={hasMinLength ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-stone-400'}>
                  At least 6 characters
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {hasUppercase ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <X className="w-3.5 h-3.5 text-stone-300 dark:text-stone-600 shrink-0" />
                )}
                <span className={hasUppercase ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-stone-400'}>
                  At least one uppercase letter (A-Z)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {hasLowercase ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <X className="w-3.5 h-3.5 text-stone-300 dark:text-stone-600 shrink-0" />
                )}
                <span className={hasLowercase ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-stone-400'}>
                  At least one lowercase letter (a-z)
                </span>
              </div>
            </div>
          </div>

          {/* Profile Image File Upload (optional, can be skipped) */}
          <div>
            <ImageUpload
              value={image}
              onChange={setImage}
              label="Profile Photo (Optional)"
              helperText="Upload your avatar file or leave empty to skip"
              shape="circle"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-md ${
              role === 'admin'
                ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20'
                : role === 'vendor'
                ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20'
                : 'bg-red-600 hover:bg-red-700 shadow-red-500/20'
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>
                  {role === 'admin'
                    ? 'Register Administrator'
                    : role === 'vendor'
                    ? 'Register Restaurant Partner'
                    : 'Complete Registration'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-stone-200 dark:border-stone-800 w-full" />
          <span className="bg-white dark:bg-stone-900 px-3 text-xs text-stone-400 uppercase font-semibold">
            Or sign up with
          </span>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleMock}
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

        <p className="text-center text-xs text-stone-500">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-red-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
