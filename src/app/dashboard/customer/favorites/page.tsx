'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { api } from '@/lib/api';
import { PizzaCard, PizzaItem } from '@/components/PizzaCard';
import { toast } from 'sonner';
import { Heart, Pizza, ArrowRight } from 'lucide-react';

export default function CustomerFavoritesPage() {
  const [favorites, setFavorites] = useState<PizzaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const res = await api.get('/favorites');
      if (res.data?.success && Array.isArray(res.data.data)) {
        setFavorites(res.data.data);
      } else {
        setFavorites([]);
      }
    } catch (err: any) {
      console.error('Failed to load favorites:', err);
      toast.error('Could not load wishlist items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleFavoriteToggle = (id: string, isFavorited: boolean) => {
    if (!isFavorited) {
      setFavorites((prev) => prev.filter((item) => item._id !== id));
    }
  };

  return (
    <DashboardLayout allowedRole="customer">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            My Saved Pizzas Wishlist
          </h1>
          <p className="text-xs text-stone-400 mt-0.5">
            Your personal collection of favorite pizzas and desserts for quick reordering.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-stone-400">Loading your favorites...</p>
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((pizza) => (
              <PizzaCard
                key={pizza._id}
                item={pizza}
                isFavorited={true}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800">
            <Heart className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">
              Your wishlist is empty
            </h3>
            <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
              Save your favorite pizzas by clicking the heart icon on any pizza card in the menu!
            </p>
            <Link
              href="/menu"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-red-600 text-white"
            >
              <Pizza className="w-4 h-4" /> Explore Menu
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
