'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Users,
  Search,
  Filter,
  ShieldAlert,
  ShieldCheck,
  Store,
  User,
  Sparkles,
  Lock,
  Unlock,
} from 'lucide-react';

export default function AdminManageUsersPage() {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [toggleLoadingId, setToggleLoadingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params: any = { limit: 50 };
      if (search.trim()) params.search = search.trim();
      if (roleFilter !== 'all') params.role = roleFilter;

      const res = await api.get('/admin/users', { params });
      if (res.data?.success) {
        setUsers(res.data.data);
      }
    } catch (err: any) {
      toast.error('Failed to load platform users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter]);

  const handleToggleBlock = async (user: any) => {
    if (user._id === currentAdmin?._id) {
      toast.error('You cannot block your own admin account.');
      return;
    }

    try {
      setToggleLoadingId(user._id);
      const res = await api.put(`/admin/users/${user._id}/block`);
      if (res.data?.success) {
        toast.success(res.data.message);
        setUsers((prev) =>
          prev.map((u) => (u._id === user._id ? { ...u, isBlocked: !u.isBlocked } : u))
        );
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to toggle user block status.');
    } finally {
      setToggleLoadingId(null);
    }
  };

  return (
    <DashboardLayout allowedRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            Manage Registered Users
          </h1>
          <p className="text-xs text-stone-400 mt-0.5">
            Audit user accounts, filter by role, and manage platform access permissions.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or restaurant..."
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-none text-stone-800 dark:text-stone-200"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-none text-stone-800 dark:text-stone-200 cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="vendor">Vendors Only</option>
              <option value="customer">Customers Only</option>
              <option value="admin">Administrators Only</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-stone-400">Loading user registry...</p>
          </div>
        ) : users.length > 0 ? (
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 text-stone-400 uppercase text-[10px] font-bold">
                    <th className="py-3.5 px-4">User</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Subscription</th>
                    <th className="py-3.5 px-4">Joined Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Access Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {users.map((u) => {
                    const isSelf = u._id === currentAdmin?._id;
                    const isBlocking = toggleLoadingId === u._id;

                    return (
                      <tr key={u._id} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40">
                        {/* Avatar & User Details */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            {u.image ? (
                              <img
                                src={u.image}
                                alt={u.name}
                                className="w-9 h-9 rounded-full object-cover shrink-0"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-600 font-bold text-xs flex items-center justify-center shrink-0">
                                {u.name.slice(0, 1)}
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-stone-900 dark:text-stone-100">
                                {u.name} {isSelf && <span className="text-[10px] text-purple-600 font-normal">(You)</span>}
                              </p>
                              <p className="text-[11px] text-stone-400">{u.email}</p>
                              {u.businessName && (
                                <p className="text-[10px] text-amber-600 font-medium">
                                  {u.businessName}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              u.role === 'admin'
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                                : u.role === 'vendor'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>

                        {/* Subscription */}
                        <td className="py-3.5 px-4 font-semibold capitalize text-stone-700 dark:text-stone-300">
                          {u.subscriptionPlan === 'premium' ? (
                            <span className="inline-flex items-center gap-1 text-amber-600 font-bold">
                              <Sparkles className="w-3 h-3" /> Premium
                            </span>
                          ) : (
                            u.subscriptionPlan || 'Free'
                          )}
                        </td>

                        {/* Joined Date */}
                        <td className="py-3.5 px-4 text-stone-400">
                          {formatDate(u.createdAt)}
                        </td>

                        {/* Status (Active / Blocked) */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              u.isBlocked
                                ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            }`}
                          >
                            {u.isBlocked ? 'Blocked' : 'Active'}
                          </span>
                        </td>

                        {/* Block / Unblock Action */}
                        <td className="py-3.5 px-4 text-right">
                          {isSelf ? (
                            <span className="text-[10px] text-stone-400 font-medium">
                              Protected
                            </span>
                          ) : (
                            <button
                              onClick={() => handleToggleBlock(u)}
                              disabled={isBlocking}
                              className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-colors inline-flex items-center gap-1 ${
                                u.isBlocked
                                  ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/40'
                                  : 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/40'
                              } disabled:opacity-50`}
                            >
                              {u.isBlocked ? (
                                <>
                                  <Unlock className="w-3 h-3" /> Unblock
                                </>
                              ) : (
                                <>
                                  <Lock className="w-3 h-3" /> Block User
                                </>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800">
            <Users className="w-10 h-10 text-stone-300 dark:text-stone-700 mx-auto mb-2" />
            <p className="text-xs text-stone-400">No users found matching your filters.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
