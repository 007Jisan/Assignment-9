import React from 'react';
import Link from 'next/link';
import { Pizza, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-stone-900 p-8 sm:p-10 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl">
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center mx-auto shadow-md">
            <Pizza className="w-10 h-10 rotate-45" />
          </div>
          <span className="absolute -top-1 -right-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900">
            404
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            Slice Not Found!
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
            Oops! The pizza page you are looking for has been devoured or does not exist on this route.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/20 transition-all flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4" /> Return to Home
          </Link>
          <Link
            href="/menu"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 transition-colors flex items-center justify-center gap-1.5"
          >
            <Pizza className="w-4 h-4" /> Browse Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
