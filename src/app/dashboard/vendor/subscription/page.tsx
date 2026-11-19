'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import {
  Sparkles,
  Check,
  Zap,
  CreditCard,
  ShieldCheck,
  Star,
  Flame,
  ArrowRight,
} from 'lucide-react';

export default function VendorSubscriptionPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const isPremium = user?.subscriptionPlan === 'premium';

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      toast.info('Initializing secure Stripe Checkout session...');

      const res = await api.post('/vendor/create-checkout-session');
      if (res.data?.success && res.data.url) {
        // Redirect vendor to Stripe Checkout
        window.location.href = res.data.url;
      } else {
        toast.error('Unable to create payment session.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to initiate checkout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout allowedRole="vendor">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
            Pizzeria Growth Tiers
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight mt-1">
            Vendor Subscription Plans
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Choose the best plan for your pizzeria kitchen. Upgrade anytime to unlock unlimited menu items.
          </p>
        </div>

        {/* Current Plan Indicator Banner */}
        <div className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-stone-500">Your Current Plan:</span>
            <span className="font-extrabold capitalize text-stone-900 dark:text-stone-100 flex items-center gap-1">
              {user?.subscriptionPlan || 'Free'}
              {isPremium && <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
            </span>
          </div>

          <span
            className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
              isPremium
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                : 'bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
            }`}
          >
            {isPremium ? 'Active Premium' : 'Free Tier'}
          </span>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* FREE PLAN */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                  Free Starter Plan
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                  Basic
                </span>
              </div>

              <div className="mt-4">
                <span className="text-3xl font-black text-stone-900 dark:text-stone-100">$0</span>
                <span className="text-xs text-stone-400 font-medium"> / forever</span>
              </div>
              <p className="text-xs text-stone-500 mt-2">
                Ideal for testing the waters and receiving occasional orders from local foodies.
              </p>

              {/* Feature Checklist */}
              <ul className="mt-6 space-y-3 text-xs text-stone-600 dark:text-stone-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Max 3 active menu items</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Basic vendor dashboard & analytics</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Order management (Accept / Reject)</span>
                </li>
                <li className="flex items-center gap-2.5 text-stone-400 line-through">
                  <span>Featured homepage placement</span>
                </li>
                <li className="flex items-center gap-2.5 text-stone-400 line-through">
                  <span>Official "Premium Vendor" badge</span>
                </li>
              </ul>
            </div>

            <button
              disabled
              className="w-full py-3 rounded-xl font-bold text-xs bg-stone-100 dark:bg-stone-800 text-stone-400 cursor-default"
            >
              {!isPremium ? 'Currently Active' : 'Default Free Plan'}
            </button>
          </div>

          {/* PREMIUM PLAN */}
          <div className="relative bg-gradient-to-b from-stone-900 to-stone-950 text-white rounded-3xl p-6 sm:p-8 border-2 border-amber-500 shadow-xl flex flex-col justify-between space-y-6">
            <span className="absolute -top-3.5 right-6 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md">
              Recommended
            </span>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Premium Pro Plan
                </h3>
              </div>

              <div className="mt-4">
                <span className="text-3xl font-black text-white">$19.99</span>
                <span className="text-xs text-stone-400 font-medium"> / month</span>
              </div>
              <p className="text-xs text-stone-300 mt-2">
                For busy pizzerias that want maximum brand exposure and zero menu restrictions.
              </p>

              {/* Feature Checklist */}
              <ul className="mt-6 space-y-3 text-xs text-stone-200">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-bold">Unlimited active menu items</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-bold">Official "Premium Vendor" gold badge</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-bold">Featured top placement on home page</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Real-time customer order notifications</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Priority 24/7 technical support</span>
                </li>
              </ul>
            </div>

            {isPremium ? (
              <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-center text-xs font-bold text-amber-300">
                ✓ You are subscribed to Premium
              </div>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-xs text-stone-900 bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 hover:opacity-95 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4" />
                {loading ? 'Opening Stripe...' : 'Upgrade to Premium with Stripe'}
              </button>
            )}
          </div>
        </div>

        {/* Security & Webhook Information Note */}
        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>
            Payments are encrypted via <strong>Stripe Checkout</strong>. Premium status is validated server-side through verified Stripe webhook events. No sensitive financial information is stored on our servers.
          </span>
        </div>
      </div>
    </DashboardLayout>
  );
}
