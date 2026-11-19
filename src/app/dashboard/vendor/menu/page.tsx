'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import {
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  X,
  Power,
  UtensilsCrossed,
} from 'lucide-react';

export default function VendorMenuItemsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit modal
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [submittingEdit, setSubmittingEdit] = useState(false);

  // Delete modal
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchVendorItems = async () => {
    try {
      setLoading(true);
      const res = await api.get('/vendor/menu-items');
      if (res.data?.success) {
        setItems(res.data.data);
      }
    } catch (err: any) {
      toast.error('Failed to load your menu items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorItems();
  }, []);

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setEditName(item.itemName);
    setEditPrice(item.price.toString());
    setEditCategory(item.category);
    setEditDescription(item.description);
    setEditLocation(item.location);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      setSubmittingEdit(true);
      const res = await api.put(`/vendor/menu-items/${editingItem._id}`, {
        itemName: editName,
        price: Number(editPrice),
        category: editCategory,
        description: editDescription,
        location: editLocation,
      });

      if (res.data?.success) {
        toast.success('Pizza menu item updated successfully!');
        setEditingItem(null);
        fetchVendorItems();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update item.');
    } finally {
      setSubmittingEdit(false);
    }
  };

  const handleToggleAvailability = async (item: any) => {
    const newStatus = item.status === 'inactive' ? 'approved' : 'inactive';
    try {
      const res = await api.put(`/vendor/menu-items/${item._id}`, {
        status: newStatus,
      });
      if (res.data?.success) {
        toast.success(`Item set to ${newStatus === 'inactive' ? 'Inactive' : 'Active'}.`);
        fetchVendorItems();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update availability.');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      const res = await api.delete(`/vendor/menu-items/${deletingId}`);
      if (res.data?.success) {
        toast.success('Menu item deleted successfully.');
        setDeletingId(null);
        fetchVendorItems();
      }
    } catch (err: any) {
      toast.error('Failed to delete menu item.');
    }
  };

  return (
    <DashboardLayout allowedRole="vendor">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
              My Pizzeria Menu
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">
              Manage your wood-fired recipes, approval statuses, and active availability.
            </p>
          </div>

          <Link
            href="/dashboard/vendor/add-item"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/20 transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" /> Add New Item
          </Link>
        </div>

        {/* Table or Cards */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-stone-400">Loading your menu...</p>
          </div>
        ) : items.length > 0 ? (
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 text-stone-400 uppercase text-[10px] font-bold">
                    <th className="py-3.5 px-4">Item Details</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Approval Status</th>
                    <th className="py-3.5 px-4">Live State</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {items.map((item) => (
                    <tr key={item._id} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40">
                      {/* Image & Name */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.images?.[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200'}
                            alt={item.itemName}
                            className="w-12 h-12 rounded-xl object-cover shrink-0"
                          />
                          <div>
                            <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                              {item.itemName}
                            </h4>
                            <p className="text-[11px] text-stone-400 line-clamp-1 max-w-xs">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-medium text-stone-600 dark:text-stone-300">
                        {item.category}
                      </td>

                      <td className="py-4 px-4 font-bold text-red-600">
                        {formatPrice(item.price)}
                      </td>

                      {/* Approval Status */}
                      <td className="py-4 px-4">
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

                      {/* Toggle Active / Inactive */}
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleAvailability(item)}
                          disabled={item.status === 'pending' || item.status === 'rejected'}
                          title="Toggle Active / Inactive Availability"
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                            item.status === 'inactive'
                              ? 'bg-stone-200 dark:bg-stone-800 text-stone-600'
                              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600'
                          } disabled:opacity-40 disabled:cursor-not-allowed`}
                        >
                          <Power className="w-3 h-3" />
                          {item.status === 'inactive' ? 'Hidden (Inactive)' : 'Active'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/menu/${item._id}`}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
                            title="Preview item"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                            title="Edit details"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingId(item._id)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                            title="Delete item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800">
            <UtensilsCrossed className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">
              No pizzas published yet
            </h3>
            <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
              Add your signature recipes to start receiving customer orders!
            </p>
            <Link
              href="/dashboard/vendor/add-item"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-red-600 text-white"
            >
              <PlusCircle className="w-4 h-4" /> Add My First Pizza
            </Link>
          </div>
        )}

        {/* EDIT MODAL */}
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  Edit Pizza Menu Item
                </h3>
                <button
                  onClick={() => setEditingItem(null)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-xl text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-none text-stone-800 dark:text-stone-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                      Price ($ USD)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      required
                      className="w-full px-3.5 py-2 rounded-xl text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-none text-stone-800 dark:text-stone-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                      Category
                    </label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-none text-stone-800 dark:text-stone-200"
                    >
                      <option value="Classic Pizzas">Classic Pizzas</option>
                      <option value="Vegetarian Pizzas">Vegetarian Pizzas</option>
                      <option value="Meat Lovers">Meat Lovers</option>
                      <option value="Specialty / Gourmet Pizzas">Specialty / Gourmet Pizzas</option>
                      <option value="Sides & Appetizers">Sides & Appetizers</option>
                      <option value="Beverages & Desserts">Beverages & Desserts</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-xl text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-none text-stone-800 dark:text-stone-200"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                    Description & Ingredients
                  </label>
                  <textarea
                    rows={2}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-xl text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-none text-stone-800 dark:text-stone-200"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold border border-stone-200 dark:border-stone-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingEdit}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700"
                  >
                    {submittingEdit ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION DIALOG */}
        {deletingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  Delete Pizza Item?
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  This action is permanent and will remove this pizza from the menu.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setDeletingId(null)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-stone-200 dark:border-stone-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
