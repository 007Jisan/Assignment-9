'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { api } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';
import {
  UtensilsCrossed,
  Clock,
  CheckCircle2,
  CreditCard,
  PlusCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export default function VendorDashboardOverview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/vendor/stats')
      .then((res) => {
        if (res.data?.success) {
          setStats(res.data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Sample analytics data for visual charts
  const chartData = [
    { day: 'Mon', orders: 4, revenue: 84 },
    { day: 'Tue', orders: 6, revenue: 126 },
    { day: 'Wed', orders: 8, revenue: 172 },
    { day: 'Thu', orders: 5, revenue: 110 },
    { day: 'Fri', orders: 12, revenue: 260 },
    { day: 'Sat', orders: 16, revenue: 350 },
    { day: 'Sun', orders: 14, revenue: 295 },
  ];

  return (
    <DashboardLayout allowedRole="vendor">
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-stone-900 to-stone-800 text-white p-6 sm:p-8 rounded-3xl shadow-md">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-amber-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Pizzeria Kitchen Hub
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {stats?.businessName || "Vendor Dashboard"}
            </h1>
            <p className="text-xs text-stone-300 mt-1 max-w-lg">
              Manage incoming customer orders, update wood-fired recipes, and monitor daily revenue.
            </p>
          </div>

          <Link
            href="/dashboard/vendor/add-item"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/20 transition-all self-start sm:self-auto shrink-0"
          >
            <PlusCircle className="w-4 h-4" /> Add New Pizza
          </Link>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Menu Items */}
          <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Total Pizzas
              </span>
              <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 flex items-center justify-center">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-stone-900 dark:text-stone-100 mt-3">
              {loading ? '...' : stats?.totalItems || 0}
            </p>
            <p className="text-[11px] text-stone-400 mt-1">
              Active on menu: <span className="font-bold text-stone-700 dark:text-stone-300">{stats?.activeItems || 0}</span>
            </p>
          </div>

          {/* Pending Orders */}
          <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Pending Orders
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-amber-600 mt-3">
              {loading ? '...' : stats?.pendingOrders || 0}
            </p>
            <Link
              href="/dashboard/vendor/orders"
              className="text-[11px] text-red-600 font-semibold hover:underline mt-1 inline-block"
            >
              Review pending orders →
            </Link>
          </div>

          {/* Accepted Orders */}
          <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Accepted Orders
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-emerald-600 mt-3">
              {loading ? '...' : stats?.acceptedOrders || 0}
            </p>
            <p className="text-[11px] text-stone-400 mt-1">
              Revenue: <span className="font-bold text-stone-800 dark:text-stone-200">{formatPrice(stats?.totalRevenue || 0)}</span>
            </p>
          </div>

          {/* Subscription Plan */}
          <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Current Plan
              </span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xl font-black capitalize text-stone-900 dark:text-stone-100">
                {stats?.subscriptionPlan || 'Free'}
              </span>
              {stats?.subscriptionPlan === 'premium' ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white uppercase">
                  Active Pro
                </span>
              ) : (
                <Link
                  href="/dashboard/vendor/subscription"
                  className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white hover:bg-red-700"
                >
                  Upgrade
                </Link>
              )}
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              {stats?.subscriptionPlan === 'premium' ? 'Unlimited items & badge' : 'Max 3 active items'}
            </p>
          </div>
        </div>

        {/* Charts & Analytics Visuals */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Order Activity Weekly Bar Chart */}
          <div className="lg:col-span-8 bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-red-600" />
                  Weekly Kitchen Order Volume
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Orders fulfilled over the past 7 days
                </p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="day" stroke="#888888" fontSize={12} />
                  <YAxis stroke="#888888" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1c1917',
                      borderRadius: '12px',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="orders" fill="#dc2626" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Menu Overview */}
          <div className="lg:col-span-4 bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Pizzeria Status
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Current operations check
              </p>

              <div className="mt-5 space-y-3">
                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/60 flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-600 dark:text-stone-300">Kitchen Status</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Open & Baking
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/60 flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-600 dark:text-stone-300">Order Acceptance</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">Manual Confirmation</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/60 flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-600 dark:text-stone-300">Published Pizzas</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">
                    {stats?.totalItems || 0} items
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/dashboard/vendor/menu"
              className="mt-6 w-full py-2.5 rounded-xl font-bold text-xs bg-stone-100 dark:bg-stone-800 hover:bg-red-600 hover:text-white transition-all text-center flex items-center justify-center gap-1.5"
            >
              Manage Menu Items
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Recent Customer Orders
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Incoming orders awaiting fulfillment
              </p>
            </div>
            <Link
              href="/dashboard/vendor/orders"
              className="text-xs font-bold text-red-600 hover:underline"
            >
              View all orders
            </Link>
          </div>

          {stats?.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-100 dark:border-stone-800 text-stone-400 uppercase text-[10px] font-bold">
                    <th className="pb-3">Item</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Delivery Date</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {stats.recentOrders.map((order: any) => (
                    <tr key={order._id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                      <td className="py-3 font-semibold text-stone-800 dark:text-stone-200">
                        {order.itemId?.itemName || 'Pizza'}
                      </td>
                      <td className="py-3 text-stone-500">
                        {order.customerId?.name || 'Customer'}
                      </td>
                      <td className="py-3 text-stone-500">{order.deliveryDate}</td>
                      <td className="py-3">
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-stone-400 py-6 text-center">
              No recent customer orders yet.
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
