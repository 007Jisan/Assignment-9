'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { api } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Receipt,
  ShieldCheck,
  CreditCard,
  Sparkles,
  Lock,
} from 'lucide-react';

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/transactions')
      .then((res) => {
        if (res.data?.success) {
          setTransactions(res.data.data);
        }
      })
      .catch((err) => {
        toast.error('Failed to load transaction logs.');
      })
      .finally(() => setLoading(false));
  }, []);

  const totalAmount = transactions.reduce((acc, t) => acc + (t.amount || 0), 0);

  return (
    <DashboardLayout allowedRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
              Subscription Transactions
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">
              Verified Stripe checkout logs for vendor premium upgrades. Strictly immutable records.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center gap-3">
            <span className="text-xs text-stone-400 font-bold uppercase">Total Volume:</span>
            <span className="text-base font-black text-emerald-600">
              {formatPrice(totalAmount)}
            </span>
          </div>
        </div>

        {/* Security Notice: Read-Only Audit Log */}
        <div className="p-3.5 rounded-2xl bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 flex items-center gap-3 text-xs text-stone-600 dark:text-stone-300">
          <Lock className="w-4 h-4 text-stone-500 shrink-0" />
          <span>
            <strong>Immutable Financial Ledger:</strong> As required by platform compliance rules, payment transaction entries cannot be edited or tampered with.
          </span>
        </div>

        {/* Transactions Table */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-stone-400">Loading verified transaction records...</p>
          </div>
        ) : transactions.length > 0 ? (
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 text-stone-400 uppercase text-[10px] font-bold">
                    <th className="py-3.5 px-4">Pizzeria Vendor</th>
                    <th className="py-3.5 px-4">Subscription Plan</th>
                    <th className="py-3.5 px-4">Amount Paid</th>
                    <th className="py-3.5 px-4">Payment Method</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Transaction Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {transactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40">
                      {/* Vendor Info */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          {tx.vendorId?.image ? (
                            <img
                              src={tx.vendorId.image}
                              alt="Vendor"
                              className="w-8 h-8 rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0">
                              {tx.vendorId?.name?.slice(0, 1) || 'V'}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-stone-900 dark:text-stone-100">
                              {tx.vendorId?.businessName || tx.vendorId?.name || 'Pizzeria Partner'}
                            </p>
                            <p className="text-[10px] text-stone-400">{tx.vendorId?.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Plan */}
                      <td className="py-4 px-4 font-bold capitalize text-stone-800 dark:text-stone-200">
                        <span className="inline-flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          {tx.plan}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4 font-black text-emerald-600 text-sm">
                        {formatPrice(tx.amount)}
                      </td>

                      {/* Payment Method / Stripe */}
                      <td className="py-4 px-4 text-stone-500">
                        <span className="inline-flex items-center gap-1.5 font-medium">
                          <CreditCard className="w-3.5 h-3.5 text-stone-400" />
                          Stripe Checkout
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                          <ShieldCheck className="w-3 h-3" />
                          {tx.status || 'succeeded'}
                        </span>
                      </td>

                      {/* Transaction Date */}
                      <td className="py-4 px-4 text-stone-400">
                        {formatDate(tx.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800">
            <Receipt className="w-10 h-10 text-stone-300 dark:text-stone-700 mx-auto mb-2" />
            <p className="text-xs text-stone-400">No subscription transactions recorded yet.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
