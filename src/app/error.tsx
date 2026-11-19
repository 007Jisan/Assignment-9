'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Next.js Client Route Error:', error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-stone-900 p-8 sm:p-10 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center mx-auto shadow-md">
          <AlertCircle className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-stone-900 dark:text-stone-100">
            Something Went Wrong
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
            An unexpected error occurred while loading this section.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/20 transition-all flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 transition-colors flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4" /> Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
