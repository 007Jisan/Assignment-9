'use client';

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { CheckCircle2, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const isSimulated = searchParams.get('simulated');
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    // Launch celebratory confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    // If simulated demo payment, activate on server
    if (isSimulated || sessionId?.startsWith('demo_session_')) {
      if (user?._id) {
        api.post('/webhook/simulate-success', { vendorId: user._id })
          .then(() => refreshUser())
          .catch(() => {});
      }
    } else if (sessionId) {
      // Real Stripe session: verify with Stripe API via backend
      api.get(`/webhook/verify-session?sessionId=${sessionId}`)
        .then(() => refreshUser())
        .catch(() => refreshUser());
    } else {
      refreshUser();
    }
  }, [sessionId, isSimulated, user]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full text-center bg-white dark:bg-stone-900 rounded-3xl p-8 sm:p-10 border border-stone-200 dark:border-stone-800 shadow-xl space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs">
            <Sparkles className="w-3.5 h-3.5" /> Premium Vendor Activated
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            Subscription Payment Successful!
          </h1>

          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
            Congratulations! Your pizzeria has been upgraded to Premium. You can now publish unlimited menu items and enjoy featured placement on the homepage.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-300 space-y-1.5 text-left">
          <div className="flex justify-between">
            <span className="text-stone-400">Plan:</span>
            <span className="font-bold">PizzaHub Premium Vendor</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400">Billing:</span>
            <span className="font-bold">$19.99 / Month</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400">Payment Status:</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Succeeded
            </span>
          </div>
        </div>

        <Link
          href="/dashboard/vendor"
          className="w-full py-3.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2"
        >
          Go to Vendor Dashboard
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen py-20 text-center">Verifying payment...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
