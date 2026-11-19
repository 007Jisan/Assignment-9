'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { api } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';
import { OrderTimeline } from '@/components/OrderTimeline';
import { toast } from 'sonner';
import {
  ShoppingBag,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  X,
  AlertTriangle,
  ArrowRight,
  Pizza,
} from 'lucide-react';

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders/my-orders');
      if (res.data?.success) {
        setOrders(res.data.data);
      }
    } catch (err: any) {
      toast.error('Failed to load your orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async () => {
    if (!cancellingId) return;

    try {
      setCancelLoading(true);
      const res = await api.put(`/orders/${cancellingId}/cancel`);
      if (res.data?.success) {
        toast.success('Order cancelled successfully.');
        setCancellingId(null);
        fetchOrders();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to cancel order.');
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <DashboardLayout allowedRole="customer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
              My Pizza Orders
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">
              Live status tracking, order history, and cancellation management.
            </p>
          </div>

          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/20 transition-all self-start sm:self-auto"
          >
            <Pizza className="w-4 h-4" /> Order Another Pizza
          </Link>
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-stone-400">Loading your orders...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 text-stone-400 uppercase text-[10px] font-bold">
                    <th className="py-3.5 px-4">Item & Pizzeria</th>
                    <th className="py-3.5 px-4">Delivery Date</th>
                    <th className="py-3.5 px-4">Address</th>
                    <th className="py-3.5 px-4">Order Status</th>
                    <th className="py-3.5 px-4">Ordered On</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {orders.map((order) => {
                    const isPending = order.status === 'pending';

                    return (
                      <tr key={order._id} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40">
                        {/* Pizza Item & Vendor */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={order.itemId?.images?.[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200'}
                              alt="Pizza"
                              className="w-11 h-11 rounded-xl object-cover shrink-0"
                            />
                            <div>
                              <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs">
                                {order.itemId?.itemName || 'Artisan Pizza'}
                              </h4>
                              <p className="text-[11px] text-stone-400">
                                {order.vendorId?.businessName || order.vendorId?.name || 'Pizzeria Partner'}
                              </p>
                              <p className="text-[11px] font-bold text-red-600">
                                {formatPrice(order.itemId?.price || 0)}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Delivery Date */}
                        <td className="py-4 px-4 font-semibold text-stone-800 dark:text-stone-200">
                          {order.deliveryDate}
                        </td>

                        {/* Delivery Address */}
                        <td className="py-4 px-4 text-stone-500 max-w-[180px] truncate">
                          {order.deliveryAddress}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              order.status === 'accepted'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : order.status === 'pending'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                : order.status === 'rejected'
                                ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                                : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
                            }`}
                          >
                            {order.status === 'accepted' && <CheckCircle2 className="w-3 h-3" />}
                            {order.status === 'pending' && <Clock className="w-3 h-3" />}
                            {order.status === 'rejected' && <XCircle className="w-3 h-3" />}
                            {order.status}
                          </span>
                        </td>

                        {/* Request Date */}
                        <td className="py-4 px-4 text-stone-400 text-[11px]">
                          {formatDate(order.createdAt)}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 transition-colors flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" /> Details
                            </button>

                            {isPending ? (
                              <button
                                onClick={() => setCancellingId(order._id)}
                                className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900 transition-colors"
                              >
                                Cancel Order
                              </button>
                            ) : (
                              <span className="text-[10px] text-stone-400 px-1">
                                Fixed
                              </span>
                            )}
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
            <ShoppingBag className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">
              No orders placed yet
            </h3>
            <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
              Ready for a freshly baked pizza? Head over to our menu to browse artisanal pizzas.
            </p>
            <Link
              href="/menu"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-red-600 text-white"
            >
              <Pizza className="w-4 h-4" /> Order a Pizza
            </Link>
          </div>
        )}

        {/* ORDER DETAILS & TIMELINE MODAL */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                <div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    Live Pizza Order Tracking
                  </h3>
                  <p className="text-xs text-stone-400">Order #{selectedOrder._id?.slice(-8)}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Summary Card */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/60 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-400">Pizza:</span>
                  <span className="font-bold text-stone-900 dark:text-stone-100">
                    {selectedOrder.itemId?.itemName} ({formatPrice(selectedOrder.itemId?.price || 0)})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Pizzeria:</span>
                  <span className="font-bold">
                    {selectedOrder.vendorId?.businessName || selectedOrder.vendorId?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Delivery Date:</span>
                  <span className="font-bold">{selectedOrder.deliveryDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Delivery Address:</span>
                  <span className="font-bold text-right max-w-[250px]">{selectedOrder.deliveryAddress}</span>
                </div>
                {selectedOrder.message && (
                  <div className="flex justify-between">
                    <span className="text-stone-400">Notes:</span>
                    <span className="italic text-right max-w-[250px]">"{selectedOrder.message}"</span>
                  </div>
                )}
              </div>

              {/* Status Timeline */}
              <div className="pt-2">
                <OrderTimeline
                  status={selectedOrder.status}
                  timeline={selectedOrder.statusTimeline}
                  createdAt={selectedOrder.createdAt}
                />
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CANCEL ORDER CONFIRMATION MODAL */}
        {cancellingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  Cancel Pizza Order?
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Are you sure you want to cancel this pending pizza order? This action cannot be reversed.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setCancellingId(null)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelLoading}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {cancelLoading ? 'Cancelling...' : 'Yes, Cancel'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
