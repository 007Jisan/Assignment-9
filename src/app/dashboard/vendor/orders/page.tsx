'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { api } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';
import { OrderTimeline } from '@/components/OrderTimeline';
import { toast } from 'sonner';
import {
  ShoppingBag,
  Check,
  X,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  Calendar,
  MessageSquare,
  Eye,
} from 'lucide-react';

export default function VendorCustomerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/vendor/orders');
      if (res.data?.success) {
        setOrders(res.data.data);
      }
    } catch (err: any) {
      toast.error('Failed to load customer orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOrderAction = async (orderId: string, action: 'accept' | 'reject') => {
    try {
      setActionLoadingId(orderId);
      const res = await api.put(`/vendor/orders/${orderId}/status`, { action });

      if (res.data?.success) {
        toast.success(`Order successfully ${action === 'accept' ? 'accepted' : 'rejected'}!`);
        fetchOrders();
        if (selectedOrder?._id === orderId) {
          setSelectedOrder(res.data.data);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update order status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'all') return true;
    return o.status === statusFilter;
  });

  return (
    <DashboardLayout allowedRole="vendor">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
              Incoming Customer Orders
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">
              Review and confirm food orders submitted by hungry customers.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {['all', 'pending', 'accepted', 'rejected', 'cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-stone-400">Loading orders...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 text-stone-400 uppercase text-[10px] font-bold">
                    <th className="py-3.5 px-4">Item Ordered</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Delivery Details</th>
                    <th className="py-3.5 px-4">Instructions</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {filteredOrders.map((order) => {
                    const isPending = order.status === 'pending';
                    const isActionLoading = actionLoadingId === order._id;

                    return (
                      <tr key={order._id} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40">
                        {/* Pizza Item */}
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
                              <p className="text-[11px] font-bold text-red-600">
                                {formatPrice(order.itemId?.price || 0)}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Customer Info */}
                        <td className="py-4 px-4">
                          <p className="font-semibold text-stone-900 dark:text-stone-100">
                            {order.customerId?.name || 'Customer'}
                          </p>
                          <p className="text-[10px] text-stone-400">
                            {order.customerId?.email}
                          </p>
                        </td>

                        {/* Delivery Info */}
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 font-bold text-stone-800 dark:text-stone-200">
                              <Calendar className="w-3 h-3 text-red-500" />
                              {order.deliveryDate}
                            </span>
                            <p className="text-[11px] text-stone-400 line-clamp-1 max-w-[180px]">
                              {order.deliveryAddress}
                            </p>
                          </div>
                        </td>

                        {/* Special Instructions */}
                        <td className="py-4 px-4 text-stone-500 max-w-[160px] truncate">
                          {order.message ? (
                            <span className="italic">"{order.message}"</span>
                          ) : (
                            <span className="text-stone-400">None</span>
                          )}
                        </td>

                        {/* Status Badge */}
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

                        {/* Actions (Accept/Reject if pending) */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              title="View Order Timeline"
                              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {isPending ? (
                              <>
                                <button
                                  onClick={() => handleOrderAction(order._id, 'accept')}
                                  disabled={isActionLoading}
                                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1"
                                >
                                  <Check className="w-3 h-3" /> Accept
                                </button>
                                <button
                                  onClick={() => handleOrderAction(order._id, 'reject')}
                                  disabled={isActionLoading}
                                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center gap-1"
                                >
                                  <X className="w-3 h-3" /> Reject
                                </button>
                              </>
                            ) : (
                              <span className="text-[10px] text-stone-400 font-semibold px-2">
                                Locked
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
              No customer orders in this category
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Check back when customers place new orders or select "All" above.
            </p>
          </div>
        )}

        {/* ORDER DETAILS & TIMELINE MODAL */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                <div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    Order Timeline & Fulfillment
                  </h3>
                  <p className="text-xs text-stone-400">Order ID: {selectedOrder._id}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Order Info */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/60 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-400">Pizza:</span>
                  <span className="font-bold text-stone-900 dark:text-stone-100">
                    {selectedOrder.itemId?.itemName} ({formatPrice(selectedOrder.itemId?.price || 0)})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Customer:</span>
                  <span className="font-bold">{selectedOrder.customerId?.name} ({selectedOrder.customerId?.email})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Delivery Date:</span>
                  <span className="font-bold">{selectedOrder.deliveryDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Address:</span>
                  <span className="font-bold text-right max-w-[250px]">{selectedOrder.deliveryAddress}</span>
                </div>
                {selectedOrder.message && (
                  <div className="flex justify-between">
                    <span className="text-stone-400">Special Notes:</span>
                    <span className="italic text-right max-w-[250px]">"{selectedOrder.message}"</span>
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div className="pt-2">
                <OrderTimeline
                  status={selectedOrder.status}
                  timeline={selectedOrder.statusTimeline}
                  createdAt={selectedOrder.createdAt}
                />
              </div>

              <div className="pt-2 flex justify-end">
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
      </div>
    </DashboardLayout>
  );
}
