'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import {
  Users,
  Store,
  Pizza,
  Clock,
  Receipt,
  DollarSign,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function AdminDashboardOverview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then((res) => {
        if (res.data?.success) {
          setStats(res.data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const userDistributionData = [
    { name: 'Vendors', value: stats?.totalVendors || 3, color: '#f59e0b' },
    { name: 'Customers', value: stats?.totalCustomers || 12, color: '#10b981' },
    { name: 'Admins', value: 1, color: '#8b5cf6' },
  ];

  const menuStatusData = [
    { name: 'Approved', count: stats?.approvedMenuItems || 11, fill: '#10b981' },
    { name: 'Pending', count: stats?.pendingMenuItems || 1, fill: '#f59e0b' },
    { name: 'Rejected', count: 0, fill: '#ef4444' },
  ];

  return (
    <DashboardLayout allowedRole="admin">
      <div className="space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-stone-900 to-stone-950 text-white p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Platform Control Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Admin Platform Overview
            </h1>
            <p className="text-xs text-stone-400 mt-1 max-w-lg">
              Manage accounts, review pending pizzeria recipes, and monitor Stripe subscription payments.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/dashboard/admin/menu-items"
              className="px-4 py-2.5 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-700 text-white transition-all shadow-md shrink-0 flex items-center gap-1.5"
            >
              <Clock className="w-4 h-4" /> Review Pending Pizzas
            </Link>
          </div>
        </div>

        {/* 6 High-Impact Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Total Registered Users */}
          <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center mb-3">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Total Users
            </span>
            <p className="text-2xl font-black text-stone-900 dark:text-stone-100 mt-1">
              {loading ? '...' : stats?.totalUsers || 0}
            </p>
          </div>

          {/* Total Vendors */}
          <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mb-3">
              <Store className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Vendors
            </span>
            <p className="text-2xl font-black text-amber-600 mt-1">
              {loading ? '...' : stats?.totalVendors || 0}
            </p>
          </div>

          {/* Total Customers */}
          <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mb-3">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Customers
            </span>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {loading ? '...' : stats?.totalCustomers || 0}
            </p>
          </div>

          {/* Total Menu Items */}
          <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 flex items-center justify-center mb-3">
              <Pizza className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Total Pizzas
            </span>
            <p className="text-2xl font-black text-stone-900 dark:text-stone-100 mt-1">
              {loading ? '...' : stats?.totalMenuItems || 0}
            </p>
          </div>

          {/* Pending Menu Items */}
          <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center mb-3">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Pending Review
            </span>
            <p className="text-2xl font-black text-orange-600 mt-1">
              {loading ? '...' : stats?.pendingMenuItems || 0}
            </p>
          </div>

          {/* Total Revenue */}
          <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mb-3">
              <DollarSign className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              Stripe Revenue
            </span>
            <p className="text-xl font-black text-emerald-600 mt-1">
              {loading ? '...' : formatPrice(stats?.totalRevenue || 0)}
            </p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Menu Items by Status */}
          <div className="lg:col-span-6 bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Pizza className="w-4 h-4 text-red-600" />
              Menu Submissions & Review Pipeline
            </h3>
            <p className="text-xs text-stone-400 mt-0.5 mb-6">
              Distribution of live vs pending review pizzas
            </p>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={menuStatusData}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} />
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
                  <Bar dataKey="count" fill="#dc2626" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Role Distribution */}
          <div className="lg:col-span-6 bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                Platform Registered User Base
              </h3>
              <p className="text-xs text-stone-400 mt-0.5 mb-4">
                Ratio of vendors to customers
              </p>

              <div className="h-48 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userDistributionData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      innerRadius={45}
                      paddingAngle={5}
                    >
                      {userDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-center gap-6 text-xs mt-2">
                {userDistributionData.map((item) => (
                  <div key={item.name} className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-stone-600 dark:text-stone-300 font-medium">
                      {item.name}: <strong>{item.value}</strong>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/dashboard/admin/users"
              className="mt-6 w-full py-2.5 rounded-xl font-bold text-xs bg-stone-100 dark:bg-stone-800 hover:bg-purple-600 hover:text-white transition-all text-center flex items-center justify-center gap-1.5"
            >
              Manage Registered Users
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
