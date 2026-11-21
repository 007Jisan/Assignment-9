'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import { MapPin, Star, Sparkles, Heart, ArrowRight } from 'lucide-react';

export interface PizzaItem {
  _id: string;
  itemName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: string;
  rating?: number;
  reviewCount?: number;
  vendorId?: {
    _id: string;
    name: string;
    image?: string;
    businessName?: string;
    subscriptionPlan?: 'free' | 'premium';
  };
}

interface PizzaCardProps {
  item: PizzaItem;
  isFavorited?: boolean;
  onFavoriteToggle?: (id: string, state: boolean) => void;
}

export function PizzaCard({ item, isFavorited = false, onFavoriteToggle }: PizzaCardProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [favorited, setFavorited] = useState(isFavorited);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    setFavorited(isFavorited);
  }, [isFavorited]);

  const isPremiumVendor = item.vendorId?.subscriptionPlan === 'premium';
  const displayImage = item.images?.[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800';

  const handleCardClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      toast.info('Please sign in to view pizza details and place orders.');
      router.push(`/login?redirect=/menu/${item._id}`);
    }
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info('Please sign in to save items to your wishlist.');
      router.push(`/login?redirect=/menu/${item._id}`);
      return;
    }

    if (user?.role !== 'customer') {
      toast.error('Only customer accounts can maintain a wishlist.');
      return;
    }

    try {
      setFavLoading(true);
      const res = await api.post('/favorites/toggle', { itemId: item._id });
      if (res.data.success) {
        setFavorited(res.data.isFavorited);
        if (onFavoriteToggle) {
          onFavoriteToggle(item._id, res.data.isFavorited);
        }
        toast.success(res.data.message);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update favorite.');
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <div className="group flex flex-col h-full bg-white dark:bg-stone-900 rounded-2xl overflow-hidden border border-stone-200/90 dark:border-stone-800 shadow-xs hover:shadow-xl hover:border-red-500/40 dark:hover:border-red-500/40 transition-all duration-300 transform hover:-translate-y-1">
      {/* Top Image Container with aspect ratio */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
        <img
          src={displayImage}
          alt={item.itemName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category Pill */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-950/70 text-white backdrop-blur-md shadow-xs">
          {item.category}
        </span>

        {/* Premium Vendor Badge */}
        {isPremiumVendor && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md">
            <Sparkles className="w-3 h-3" />
            Premium
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={toggleFavorite}
          disabled={favLoading}
          aria-label="Save to favorites"
          className={`absolute bottom-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
            favorited
              ? 'bg-rose-500 text-white'
              : 'bg-white/80 dark:bg-stone-900/80 text-stone-700 dark:text-stone-300 hover:text-rose-500 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Rating and Price Row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
              {item.rating ? Number(item.rating).toFixed(1) : '5.0'}
            </span>
            <span className="text-[11px] text-stone-500 dark:text-stone-400">
              ({item.reviewCount || 0})
            </span>
          </div>

          <div className="text-lg font-black text-red-600 dark:text-red-500">
            {formatPrice(item.price)}
          </div>
        </div>

        {/* Item Title */}
        <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-1">
          {item.itemName}
        </h3>

        {/* Description */}
        <p className="mt-1.5 text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
          {item.description}
        </p>

        {/* Vendor and Location Row */}
        <div className="mt-auto pt-4 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {item.vendorId?.image ? (
              <img
                src={item.vendorId.image}
                alt={item.vendorId.name}
                className="w-6 h-6 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                {item.vendorId?.name?.slice(0, 1) || 'P'}
              </div>
            )}
            <span className="text-xs font-medium text-stone-700 dark:text-stone-300 truncate">
              {item.vendorId?.businessName || item.vendorId?.name || 'Local Pizzeria'}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-stone-500 dark:text-stone-400 shrink-0">
            <MapPin className="w-3 h-3 text-red-500" />
            <span className="truncate max-w-[90px]">{item.location}</span>
          </div>
        </div>

        {/* View Details CTA Button */}
        <Link
          href={`/menu/${item._id}`}
          onClick={handleCardClick}
          className="mt-4 w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-all duration-200"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
