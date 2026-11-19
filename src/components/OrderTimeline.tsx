import React from 'react';
import { formatDate } from '@/lib/utils';
import { CheckCircle2, Clock, Flame, Truck, PackageCheck, XCircle } from 'lucide-react';

interface TimelineProps {
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  timeline?: Array<{
    status: string;
    timestamp: string | Date;
    note?: string;
  }>;
  createdAt: string | Date;
}

export function OrderTimeline({ status, timeline, createdAt }: TimelineProps) {
  if (status === 'rejected' || status === 'cancelled') {
    return (
      <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50">
        <div className="flex items-center gap-3">
          <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-red-700 dark:text-red-300 capitalize">
              Order {status}
            </h4>
            <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-0.5">
              {status === 'rejected'
                ? 'The pizzeria was unable to fulfill this order at this time.'
                : 'This order was cancelled by the customer.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    {
      id: 'pending',
      title: 'Order Placed',
      description: 'Submitted to kitchen',
      icon: Clock,
      isDone: true,
      isActive: status === 'pending',
    },
    {
      id: 'accepted',
      title: 'Confirmed',
      description: 'Kitchen accepted order',
      icon: CheckCircle2,
      isDone: status === 'accepted',
      isActive: status === 'accepted',
    },
    {
      id: 'baking',
      title: 'Stone Oven Baking',
      description: 'Crisping to perfection',
      icon: Flame,
      isDone: false,
      isActive: false,
    },
    {
      id: 'delivery',
      title: 'Out for Delivery',
      description: 'Driver on route',
      icon: Truck,
      isDone: false,
      isActive: false,
    },
    {
      id: 'delivered',
      title: 'Delivered',
      description: 'Enjoy hot & fresh',
      icon: PackageCheck,
      isDone: false,
      isActive: false,
    },
  ];

  return (
    <div className="py-2">
      <div className="relative flex items-center justify-between">
        {/* Background track line */}
        <div className="absolute left-6 right-6 top-5 -translate-y-1/2 h-1 bg-stone-200 dark:bg-stone-800 -z-0" />

        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center text-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  step.isDone
                    ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-400 border border-stone-200 dark:border-stone-700'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <span
                className={`mt-2 text-xs font-bold ${
                  step.isDone
                    ? 'text-stone-900 dark:text-stone-100'
                    : 'text-stone-400 dark:text-stone-500'
                }`}
              >
                {step.title}
              </span>
              <span className="hidden sm:block text-[10px] text-stone-400 max-w-[85px] leading-tight">
                {step.description}
              </span>
            </div>
          );
        })}
      </div>

      {timeline && timeline.length > 0 && (
        <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800/80 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Activity Log</p>
          <div className="space-y-1.5">
            {timeline.map((entry, i) => (
              <div key={i} className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
                <span className="font-medium text-stone-800 dark:text-stone-200">{entry.note || entry.status}</span>
                <span className="text-[11px] text-stone-400">{formatDate(entry.timestamp)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
