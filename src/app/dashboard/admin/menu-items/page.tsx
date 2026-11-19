'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Pizza,
  Search,
  Check,
  X,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  MapPin,
  Sparkles,
} from 'lucide-react';

export default function AdminManageMenuItemsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params: any = { limit: 50 };
      if (search.trim()) params.search = search.trim();
      if (statusFilter !== 'all') params.status = statusFilter;

      const res = await api.get('/admin/menu-items', { params });
      if (res.data?.success) {
        setItems(res.data.data);
      }
    } catch (err: any) {
      toast.error('Failed to load menu items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [search, statusFilter]);

  const handleStatusChange = async (itemId: string, status: string) => {
    try {
      setActionLoadingId(itemId);
      const res = await api.put(`/admin/menu-items/${itemId}/status`, { status });
      if (res.data?.success) {
        toast.success(`Pizza status updated to "${status}".`);
        fetchItems();
      }
    } catch (err: any) {
      toast.error('Failed to update status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      const res = await api.delete(`/admin/menu-items/${deletingId}`);
      if (res.data?.success) {
        toast.success('Inappropriate menu item deleted permanently.');
        setDeletingId(null);
        fetchItems();
      }
    } catch (err: any) {
      toast.error('Failed to delete item.');
    }
  };

  return (
    <DashboardLayout allowedRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            Manage Pizza Menu Items
          </h1>
          <p className="text-xs text-stone-400 mt-0.5">
            Review submitted recipes, approve or reject items, and remove inappropriate content.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by pizza name, category, or city..."
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-none text-stone-800 dark:text-stone-200"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-none text-stone-800 dark:text-stone-200 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending Review Only</option>
              <option value="approved">Approved & Live</option>
              <option value="rejected">Rejected Items</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Menu Items Table */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-stone-400">Loading menu submissions...</p>
          </div>
        ) : items.length > 0 ? (
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 text-stone-400 uppercase text-[10px] font-bold">
                    <th className="py-3.5 px-4">Pizza Details</th>
                    <th className="py-3.5 px-4">Vendor / Kitchen</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Review Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {items.map((item) => {
                    const isProcessing = actionLoadingId === item._id;

                    return (
                      <tr key={item._id} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40">
                        {/* Pizza Item */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.images?.[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200'}
                              alt="Pizza"
                              className="w-12 h-12 rounded-xl object-cover shrink-0"
                            />
                            <div>
                              <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs">
                                {item.itemName}
                              </h4>
                              <p className="text-[10px] text-stone-400 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 text-red-500" />
                                {item.location}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Vendor */}
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1">
                            {item.vendorId?.businessName || item.vendorId?.name || 'Vendor'}
                            {item.vendorId?.subscriptionPlan === 'premium' && (
                              <Sparkles className="w-3 h-3 text-amber-500" />
                            )}
                          </p>
                          <p className="text-[10px] text-stone-400">{item.vendorId?.email}</p>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4 font-medium text-stone-600 dark:text-stone-300">
                          {item.category}
                        </td>

                        {/* Price */}
                        <td className="py-3.5 px-4 font-bold text-red-600">
                          {formatPrice(item.price)}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              item.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : item.status === 'pending'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                : item.status === 'rejected'
                                ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                                : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
                            }`}
                          >
                            {item.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                            {item.status === 'pending' && <Clock className="w-3 h-3" />}
                            {item.status === 'rejected' && <XCircle className="w-3 h-3" />}
                            {item.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              href={`/menu/${item._id}`}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
                              title="View page"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>

                            {/* Approve */}
                            {item.status !== 'approved' && (
                              <button
                                onClick={() => handleStatusChange(item._id, 'approved')}
                                disabled={isProcessing}
                                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" /> Approve
                              </button>
                            )}

                            {/* Reject */}
                            {item.status !== 'rejected' && (
                              <button
                                onClick={() => handleStatusChange(item._id, 'rejected')}
                                disabled={isProcessing}
                                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-600 hover:bg-amber-700 text-white transition-colors flex items-center gap-1"
                              >
                                <X className="w-3 h-3" /> Reject
                              </button>
                            )}

                            {/* Delete Inappropriate */}
                            <button
                              onClick={() => setDeletingId(item._id)}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                              title="Delete permanently"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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
            <Pizza className="w-10 h-10 text-stone-300 dark:text-stone-700 mx-auto mb-2" />
            <p className="text-xs text-stone-400">No menu items found.</p>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {deletingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  Delete Menu Item?
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Are you sure you want to delete this menu item permanently from the platform?
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setDeletingId(null)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold border border-stone-200 dark:border-stone-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
