import React from 'react';
import { Pizza } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 space-y-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-red-200 dark:border-red-950/60 border-t-red-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-red-600">
          <Pizza className="w-6 h-6 rotate-12" />
        </div>
      </div>
      <p className="text-xs font-bold uppercase tracking-wider text-stone-400 animate-pulse">
        Firing up the stone oven...
      </p>
    </div>
  );
}
