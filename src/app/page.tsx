'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { PizzaCard, PizzaItem } from '@/components/PizzaCard';
import {
  Pizza,
  Flame,
  Clock,
  ShieldCheck,
  Truck,
  ArrowRight,
  Search,
  Sparkles,
  Award,
  Users,
  UtensilsCrossed,
  HeartHandshake,
  Star,
  Quote,
} from 'lucide-react';

import { SAMPLE_PIZZAS, SAMPLE_CATEGORIES } from '@/lib/sampleData';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [featuredPizzas, setFeaturedPizzas] = useState<PizzaItem[]>(SAMPLE_PIZZAS);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [categories, setCategories] = useState<{ name: string; count: number }[]>(SAMPLE_CATEGORIES);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [featuredRes, catRes] = await Promise.all([
          api.get('/menu/featured').catch(() => null),
          api.get('/menu/categories').catch(() => null),
        ]);

        if (featuredRes?.data?.data && featuredRes.data.data.length > 0) {
          setFeaturedPizzas(featuredRes.data.data);
        }
        if (catRes?.data?.data && catRes.data.data.length > 0) {
          setCategories(catRes.data.data);
        }
      } catch (e) {
        console.error('Home dynamic fetch error:', e);
      }
    };

    fetchHomeData();
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/menu');
    }
  };

  const categoryIcons: Record<string, string> = {
    'Classic Pizzas': '🍕',
    'Vegetarian Pizzas': '🥗',
    'Meat Lovers': '🥩',
    'Specialty / Gourmet Pizzas': '✨',
    'Sides & Appetizers': '🥖',
    'Beverages & Desserts': '🍰',
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO BANNER SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-500/10 via-red-500/5 to-transparent pt-12 pb-20 md:pt-20 md:pb-32">
        {/* Decorative background glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-red-500/20 to-amber-500/20 blur-3xl -z-10 rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & Call-to-action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 text-xs font-bold tracking-wide uppercase shadow-xs">
                <Flame className="w-4 h-4 text-red-600 animate-pulse" />
                <span>Wood-Fired & Stone-Baked Goodness</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-stone-900 dark:text-stone-50 leading-[1.12]">
                Hot & Fresh Pizza{' '}
                <span className="bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 bg-clip-text text-transparent">
                  Delivered to Your Door
                </span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Connect directly with top artisanal pizza kitchens in your city. From crispy Neapolitan classics to gourmet truffle specialties, baked at 800°F and delivered piping hot.
              </p>

              {/* Quick Search & Explore Buttons */}
              <div className="space-y-4 pt-2">
                <form
                  onSubmit={handleHeroSearch}
                  className="flex items-center max-w-md mx-auto lg:mx-0 bg-white dark:bg-stone-900 rounded-2xl p-1.5 border border-stone-200 dark:border-stone-800 shadow-lg shadow-stone-200/50 dark:shadow-none"
                >
                  <div className="pl-3 text-stone-400">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Margherita, Pepperoni, Truffle..."
                    className="w-full px-3 py-2 text-sm bg-transparent border-none outline-none text-stone-800 dark:text-stone-200 placeholder:text-stone-400"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 transition-all shrink-0 shadow-md shadow-red-500/20"
                  >
                    Find Pizza
                  </button>
                </form>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                  <Link
                    href="/menu"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/30 hover:shadow-xl hover:shadow-red-600/40 transition-all transform hover:-translate-y-0.5"
                  >
                    <Pizza className="w-5 h-5" />
                    Explore Pizza Menu
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-stone-800 dark:text-stone-200 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-red-500 hover:text-red-600 transition-all shadow-xs"
                  >
                    Join as Vendor
                  </Link>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-stone-500 dark:text-stone-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-500" /> 30-Min Avg Delivery
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> 100% Certified Kitchens
                </span>
                <span className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-red-500" /> Fresh Oven Guarantee
                </span>
              </div>
            </motion.div>

            {/* Right Column: Hero Graphic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="lg:col-span-5 relative flex items-center justify-center"
            >
              <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-stone-800 rotate-1 hover:rotate-0 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1000"
                  alt="Delicious Hot Stone-Baked Pizza"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Floating badge */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-between">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white uppercase mb-1">
                      Chef Special
                    </span>
                    <h4 className="text-sm font-extrabold text-stone-900 dark:text-stone-100">
                      Truffle Mushroom & Fior di Latte
                    </h4>
                    <p className="text-xs text-red-600 font-bold">$24.50 • Luigi's Pizzeria</p>
                  </div>
                  <Link
                    href="/menu"
                    className="p-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors shadow-md"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS RIBBON */}
      <section className="bg-stone-900 text-white py-6 border-y border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-red-500">15,000+</p>
              <p className="text-xs text-stone-400 font-medium">Pizzas Delivered</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-amber-400">45+</p>
              <p className="text-xs text-stone-400 font-medium">Artisan Pizzerias</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-orange-400">25 Min</p>
              <p className="text-xs text-stone-400 font-medium">Avg Doorstep Delivery</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-emerald-400">4.9 ★</p>
              <p className="text-xs text-stone-400 font-medium">Customer Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC SECTION 1: FEATURED MENU ITEMS */}
      <section className="py-16 md:py-24 bg-stone-50/50 dark:bg-stone-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                Oven-Fresh Recommendations
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-50 tracking-tight mt-1">
                Featured Menu Items
              </h2>
              <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-xl">
                Only verified, approved chef pizzas from our top-rated pizzeria partners.
              </p>
            </div>

            <Link
              href="/menu"
              className="inline-flex items-center gap-2 text-sm font-bold text-red-600 dark:text-red-400 hover:text-red-700 transition-colors"
            >
              View Full Menu ({featuredPizzas.length > 0 ? '50+ Items' : 'All'})
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-96 rounded-2xl bg-stone-200 dark:bg-stone-800 animate-pulse"
                />
              ))}
            </div>
          ) : featuredPizzas.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredPizzas.slice(0, 8).map((pizza) => (
                <PizzaCard
                  key={pizza._id}
                  item={pizza}
                  isFavorited={favoriteIds.includes(pizza._id)}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 p-8 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
              <Pizza className="w-12 h-12 text-stone-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold">No pizzas found</h3>
              <p className="text-sm text-stone-500 mt-1">
                Run the database seed script to load mouth-watering pizzas!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 3. DYNAMIC SECTION 2: PIZZA CATEGORIES */}
      <section className="py-16 md:py-24 bg-white dark:bg-stone-900/60 border-y border-stone-200/80 dark:border-stone-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Hand-Tossed Selections
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-50 tracking-tight mt-1">
              Explore by Category
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-2">
              Whatever your mood demands — from timeless Italian tradition to indulgent sweet dessert pies.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              'Classic Pizzas',
              'Vegetarian Pizzas',
              'Meat Lovers',
              'Specialty / Gourmet Pizzas',
              'Sides & Appetizers',
              'Beverages & Desserts',
            ].map((catName) => {
              const matchedCat = categories.find((c) => c.name === catName);
              const count = matchedCat ? matchedCat.count : 0;
              const icon = categoryIcons[catName] || '🍕';

              return (
                <Link
                  key={catName}
                  href={`/menu?category=${encodeURIComponent(catName)}`}
                  className="group flex flex-col items-center text-center p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/90 dark:border-stone-700/60 hover:border-red-500 hover:bg-white dark:hover:bg-stone-800 shadow-xs hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white dark:bg-stone-700 flex items-center justify-center text-2xl shadow-sm mb-3 group-hover:scale-110 transition-transform">
                    {icon}
                  </div>
                  <h3 className="text-sm font-bold text-stone-800 dark:text-stone-200 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors leading-tight">
                    {catName}
                  </h3>
                  <span className="mt-1 text-[11px] font-semibold text-stone-400">
                    {count > 0 ? `${count} Varieties` : 'Explore'}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. REQUIRED EXTRA SECTION: WHY CHOOSE PIZZAHUB? */}
      <section className="py-16 md:py-24 bg-stone-50/50 dark:bg-stone-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              The PizzaHub Difference
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-50 tracking-tight mt-1">
              Why Choose PizzaHub?
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-2">
              We are not just a delivery platform — we are a bridge connecting true pizza artisans to pizza lovers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center mb-4">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Wood-Fired Stone Ovens
              </h3>
              <p className="mt-2 text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                Pizzas baked at blisteringly high heat in authentic refractory ovens for that signature leopard-spotted crust and crispy chew.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Piping Hot Delivery
              </h3>
              <p className="mt-2 text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                Specialized thermal heat retention bags ensure your pizza arrives at your table steaming hot, with bubbly melted cheese.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Certified Pizzerias Only
              </h3>
              <p className="mt-2 text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                Every vendor is individually vetted and approved by our culinary quality team before their menu items go live.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Real-Time Tracking
              </h3>
              <p className="mt-2 text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                Follow your order timeline from dough stretching to oven baking and doorstep arrival on your customer dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. EXTRA SECTION: HOW PIZZAHUB WORKS */}
      <section className="py-16 md:py-24 bg-white dark:bg-stone-900/60 border-t border-stone-200/80 dark:border-stone-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-50 tracking-tight mt-1">
              How PizzaHub Works
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-2">
              From hungry craving to hot pizza box in four easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-red-600 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-red-500/20 mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Select Your Pizzeria
              </h3>
              <p className="mt-2 text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                Browse hand-crafted menus and sort by price, rating, or pizza style.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-amber-500 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-amber-500/20 mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Customize & Order
              </h3>
              <p className="mt-2 text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                Choose delivery date, specify your address, and leave special instructions.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-orange-600 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-orange-500/20 mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Fresh Stone Baking
              </h3>
              <p className="mt-2 text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                The restaurant accepts your order and fires up the stone oven immediately.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-600 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4">
                4
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Hot Doorstep Delivery
              </h3>
              <p className="mt-2 text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                Enjoy hot, aromatic, oven-crisped pizza with family and friends!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. EXTRA SECTION: TESTIMONIALS */}
      <section className="py-16 md:py-24 bg-stone-50/50 dark:bg-stone-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              Community Love
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-50 tracking-tight mt-1">
              What Pizza Lovers Say
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-2">
              Real reviews from real pizza lovers in the community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed italic">
                "The Neapolitan Margherita from Luigi's is by far the most authentic pizza I have had outside of Italy. The crust has that perfect airy sourdough chew!"
              </p>
              <div className="mt-4 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200"
                  alt="Alex R."
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">Alex Rivera</h4>
                  <p className="text-[10px] text-stone-400">Brooklyn, NY</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed italic">
                "Ordering through PizzaHub is seamless. The order timeline lets me know exactly when the kitchen accepts the order and puts it in the oven. 10/10!"
              </p>
              <div className="mt-4 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200"
                  alt="Sophia C."
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">Sophia Chen</h4>
                  <p className="text-[10px] text-stone-400">Manhattan, NY</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed italic">
                "As a restaurant owner, the vendor dashboard is fantastic. Upgrading to Premium gave our pizzeria the spotlight and increased our orders by 40%!"
              </p>
              <div className="mt-4 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200"
                  alt="Luigi R."
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">Luigi Rossi</h4>
                  <p className="text-[10px] text-stone-400">Head Pizzaiolo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CTA SECTION */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-amber-600 text-white">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to Taste Real Artisanal Pizza?
          </h2>
          <p className="text-base text-red-100 max-w-xl mx-auto leading-relaxed">
            Join thousands of happy food lovers and order from the best pizzerias in your neighborhood today.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/menu"
              className="px-8 py-3.5 rounded-xl font-bold bg-white text-red-600 hover:bg-stone-100 transition-all shadow-lg"
            >
              Order Now
            </Link>
            <Link
              href="/register"
              className="px-8 py-3.5 rounded-xl font-bold bg-red-700/80 hover:bg-red-800 text-white transition-all border border-red-400/40"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
