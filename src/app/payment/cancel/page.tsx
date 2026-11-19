import React from 'react';
import Link from 'next/link';
import { XCircle, ArrowLeft } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full text-center bg-white dark:bg-stone-900 rounded-3xl p-8 sm:p-10 border border-stone-200 dark:border-stone-800 shadow-xl space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mx-auto shadow-md">
          <XCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            Checkout Cancelled
          </h1>

          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
            No charges were made to your payment method. You can return to your dashboard or upgrade whenever you are ready.
          </p>
        </div>

        <Link
          href="/dashboard/vendor/subscription"
          className="w-full py-3.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Subscription Plans
        </Link>
      </div>
    </div>
  );
}
