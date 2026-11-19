'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Pizza,
  Heart,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function CustomerDashboardOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
    cancelled: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my-orders')
      .then((res) => {
        if (res.data?.success) {
          setRecentOrders(res.data.data.slice(0, 5));
          if (res.data.stats) {
            setStats(res.data.stats);
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout allowedRole="customer">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 text-white p-6 sm:p-8 rounded-3xl shadow-lg shadow-red-500/10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-100">
              Customer Hub
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
              Welcome Back, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-xs text-red-100 mt-1 max-w-md">
              Track your piping hot pizza orders, browse local artisan kitchens, or order fresh stone-baked pies.
            </p>
          </div>

          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs bg-white text-red-600 hover:bg-stone-100 shadow-md transition-all self-start sm:self-auto shrink-0"
          >
            <Pizza className="w-4 h-4" /> Browse Menu
          </Link>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Total Orders */}
          <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Total Orders
              </span>
              <div className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-stone-900 dark:text-stone-100 mt-3">
              {loading ? '...' : stats.total}
            </p>
            <p className="text-[11px] text-stone-400 mt-1">Lifetime pizzas ordered</p>
          </div>

          {/* Pending Orders */}
          <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Pending
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-amber-600 mt-3">
              {loading ? '...' : stats.pending}
            </p>
            <p className="text-[11px] text-stone-400 mt-1">Awaiting kitchen accept</p>
          </div>

          {/* Accepted Orders */}
          <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Accepted
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-emerald-600 mt-3">
              {loading ? '...' : stats.accepted}
            </p>
            <p className="text-[11px] text-stone-400 mt-1">Confirmed & baking</p>
          </div>

          {/* Rejected / Cancelled Orders */}
          <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Rejected / Cancelled
              </span>
              <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 flex items-center justify-center">
                <XCircle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-red-600 mt-3">
              {loading ? '...' : stats.rejected + stats.cancelled}
            </p>
            <p className="text-[11px] text-stone-400 mt-1">
              {stats.cancelled} cancelled • {stats.rejected} rejected
            </p>
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Recent Orders
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Quick view of your latest pizza requests
              </p>
            </div>
            <Link
              href="/dashboard/customer/orders"
              className="text-xs font-bold text-red-600 hover:underline"
            >
              View all orders ({stats.total})
            </Link>
          </div>

          {recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={order.itemId?.images?.[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200'}
                      alt="Pizza"
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                        {order.itemId?.itemName || 'Artisan Pizza'}
                      </h4>
                      <p className="text-xs text-stone-400">
                        From: {order.vendorId?.businessName || order.vendorId?.name || 'Local Pizzeria'} • Delivery: {order.deliveryDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-between sm:justify-end">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        order.status === 'accepted'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : order.status === 'pending'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                      }`}
                    >
                      {order.status}
                    </span>

                    <Link
                      href="/dashboard/customer/orders"
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-stone-700 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-600 hover:bg-stone-50"
                    >
                      Details & Timeline
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Pizza className="w-10 h-10 text-stone-300 dark:text-stone-700 mx-auto mb-2" />
              <p className="text-xs text-stone-400">You haven't placed any pizza orders yet.</p>
              <Link
                href="/menu"
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:underline"
              >
                Browse Delicious Pizzas <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
