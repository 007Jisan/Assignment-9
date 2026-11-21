'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { PizzaCard, PizzaItem } from '@/components/PizzaCard';
import {
  Search,
  Filter,
  ArrowUpDown,
  MapPin,
  Pizza,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';

import { SAMPLE_PIZZAS } from '@/lib/sampleData';

function MenuContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAuth();

  const [items, setItems] = useState<PizzaItem[]>(SAMPLE_PIZZAS);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(SAMPLE_PIZZAS.length);

  // Filter and Search States initialized from URL params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [location, setLocation] = useState(searchParams.get('location') || 'All');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  const [locationsList, setLocationsList] = useState<string[]>([]);

  // Fetch customer favorites
  useEffect(() => {
    if (isAuthenticated && user?.role === 'customer') {
      api.get('/favorites/ids')
        .then((res) => {
          if (res.data?.success && Array.isArray(res.data.ids)) {
            setFavoriteIds(res.data.ids);
          }
        })
        .catch(() => {});
    } else {
      setFavoriteIds([]);
    }
  }, [isAuthenticated, user]);

  const handleFavoriteToggle = (id: string, isFav: boolean) => {
    setFavoriteIds((prev) => (isFav ? [...prev, id] : prev.filter((favId) => favId !== id)));
  };

  const categories = [
    'All',
    'Classic Pizzas',
    'Vegetarian Pizzas',
    'Meat Lovers',
    'Specialty / Gourmet Pizzas',
    'Sides & Appetizers',
    'Beverages & Desserts',
  ];

  // Fetch unique locations on mount
  useEffect(() => {
    api.get('/menu/locations')
      .then((res) => {
        if (res.data?.data) {
          setLocationsList(res.data.data);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch menu items with current query parameters
  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        setLoading(true);
        const params: any = { page, limit: 12 };
        if (search.trim()) params.search = search.trim();
        if (category !== 'All') params.category = category;
        if (location !== 'All') params.location = location;
        if (sort) params.sort = sort;

        const res = await api.get('/menu', { params });
        if (res.data?.success && res.data.data.length > 0) {
          setItems(res.data.data);
          setTotalCount(res.data.pagination.total);
          setTotalPages(res.data.pagination.totalPages);
        } else if (res.data?.success && res.data.data.length === 0 && (search.trim() || category !== 'All' || location !== 'All')) {
          setItems([]);
          setTotalCount(0);
          setTotalPages(1);
        } else {
          // Local fallback filter
          let filtered = [...SAMPLE_PIZZAS];
          if (search.trim()) {
            filtered = filtered.filter(p => p.itemName.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()));
          }
          if (category !== 'All') {
            filtered = filtered.filter(p => p.category === category);
          }
          if (location !== 'All') {
            filtered = filtered.filter(p => p.location.toLowerCase().includes(location.toLowerCase()));
          }
          if (sort === 'price_asc') filtered.sort((a, b) => a.price - b.price);
          else if (sort === 'price_desc') filtered.sort((a, b) => b.price - a.price);
          else if (sort === 'rating') filtered.sort((a, b) => (b.rating || 5) - (a.rating || 5));

          setItems(filtered);
          setTotalCount(filtered.length);
          setTotalPages(Math.ceil(filtered.length / 12) || 1);
        }
      } catch (err) {
        // Fallback filter on network error
        let filtered = [...SAMPLE_PIZZAS];
        if (search.trim()) {
          filtered = filtered.filter(p => p.itemName.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()));
        }
        if (category !== 'All') {
          filtered = filtered.filter(p => p.category === category);
        }
        if (location !== 'All') {
          filtered = filtered.filter(p => p.location.toLowerCase().includes(location.toLowerCase()));
        }
        if (sort === 'price_asc') filtered.sort((a, b) => a.price - b.price);
        else if (sort === 'price_desc') filtered.sort((a, b) => b.price - a.price);
        else if (sort === 'rating') filtered.sort((a, b) => (b.rating || 5) - (a.rating || 5));

        setItems(filtered);
        setTotalCount(filtered.length);
        setTotalPages(Math.ceil(filtered.length / 12) || 1);
      } finally {
        setLoading(false);
      }
    };

    fetchPizzas();
  }, [search, category, location, sort, page]);

  // Reset filters
  const handleReset = () => {
    setSearch('');
    setCategory('All');
    setLocation('All');
    setSort('newest');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-stone-50/40 dark:bg-stone-950/40 py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
            Artisanal Selection
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-50 tracking-tight mt-1">
            Browse All Pizzas & Sides
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-2">
            Explore stone-baked pies from our verified pizzeria network. Search by ingredients, filter by category or city, and sort by price.
          </p>
        </div>

        {/* Filter & Control Bar */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search pizzas by name or description..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-stone-800 dark:text-stone-200"
              />
            </div>

            {/* Location Filter */}
            <div className="md:col-span-3 relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <select
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-8 py-2.5 rounded-xl text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-stone-800 dark:text-stone-200 cursor-pointer"
              >
                <option value="All">All Locations & Cities</option>
                {locationsList.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Challenge Requirement: Sort by Price Ascending/Descending & Rating */}
            <div className="md:col-span-3 relative">
              <ArrowUpDown className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-8 py-2.5 rounded-xl text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-stone-800 dark:text-stone-200 cursor-pointer"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="price_asc">Sort: Price (Low to High)</option>
                <option value="price_desc">Sort: Price (High to Low)</option>
                <option value="rating">Sort: Top Rated ★</option>
              </select>
            </div>

            {/* Reset Button */}
            <div className="md:col-span-1">
              <button
                onClick={handleReset}
                title="Reset Filters"
                className="w-full py-2.5 flex items-center justify-center rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category Tabs / Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  category === cat
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-stone-500 dark:text-stone-400 font-medium">
          <p>
            Showing <span className="font-bold text-stone-800 dark:text-stone-200">{items.length}</span> of{' '}
            <span className="font-bold text-stone-800 dark:text-stone-200">{totalCount}</span> approved items
          </p>
          {(category !== 'All' || location !== 'All' || search) && (
            <button
              onClick={handleReset}
              className="text-red-600 dark:text-red-400 hover:underline font-semibold"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="h-96 rounded-2xl bg-stone-200 dark:bg-stone-800 animate-pulse"
              />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <PizzaCard
                key={item._id}
                item={item}
                isFavorited={favoriteIds.includes(item._id)}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 px-6 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800">
            <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center mx-auto mb-4">
              <Pizza className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              No matching pizzas found
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto mt-1">
              Try adjusting your search terms, changing the category, or clearing the location filter.
            </p>
            <button
              onClick={handleReset}
              className="mt-5 px-5 py-2.5 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700 transition-colors shadow-md"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-bold px-4 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BrowseMenuPage() {
  return (
    <Suspense fallback={<div className="min-h-screen py-20 text-center">Loading menu...</div>}>
      <MenuContent />
    </Suspense>
  );
}
