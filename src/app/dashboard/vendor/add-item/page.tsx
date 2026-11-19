'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { uploadToImgBB } from '@/lib/imgbb';
import { toast } from 'sonner';
import {
  UploadCloud,
  Pizza,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';

export default function AddMenuItemPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('Classic Pizzas');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Check current items count to warn if Free tier limit reached
  const [activeCount, setActiveCount] = useState(0);
  const [checkingLimit, setCheckingLimit] = useState(true);

  useEffect(() => {
    api.get('/vendor/menu-items')
      .then((res) => {
        if (res.data?.success) {
          const count = res.data.data.filter(
            (i: any) => i.status === 'approved' || i.status === 'pending'
          ).length;
          setActiveCount(count);
        }
      })
      .catch(() => {})
      .finally(() => setCheckingLimit(false));
  }, []);

  const isFreePlan = user?.subscriptionPlan === 'free';
  const isLimitReached = isFreePlan && activeCount >= 3;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLimitReached) {
      toast.error('Free plan allows maximum 3 active items. Please upgrade to Premium!');
      return;
    }

    if (!itemName || !category || !description || !price || !location) {
      toast.error('Please fill in all required text fields.');
      return;
    }

    if (!imageFile && !imagePreview) {
      toast.error('An item image file is required (uploaded via ImgBB).');
      return;
    }

    try {
      setLoading(true);

      // Upload file to ImgBB
      let imageUrl = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800';
      if (imageFile) {
        toast.info('Uploading photo to ImgBB...');
        imageUrl = await uploadToImgBB(imageFile);
      }

      // Submit to backend
      const res = await api.post('/menu', {
        itemName,
        category,
        description,
        price: Number(price),
        location,
        images: [imageUrl],
      });

      if (res.data?.success) {
        toast.success('Pizza submitted! Pending admin approval before going live.');
        router.push('/dashboard/vendor/menu');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit pizza.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout allowedRole="vendor">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            Add New Menu Item
          </h1>
          <p className="text-xs text-stone-400 mt-0.5">
            Create a new artisanal pizza, side dish, or beverage. Submissions are reviewed by our platform administrators.
          </p>
        </div>

        {/* Free Plan Quota Warning Banner */}
        {isLimitReached ? (
          <div className="p-6 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-800 dark:text-amber-200">
                  Free Tier Quota Reached (3 of 3 Active Items)
                </h3>
                <p className="text-xs text-amber-700/80 dark:text-amber-300/80 mt-0.5">
                  Your Free plan allows up to 3 active menu items. Upgrade to Premium for unlimited publishing and featured homepage placement.
                </p>
              </div>
            </div>

            <Link
              href="/dashboard/vendor/subscription"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 transition-colors shadow-md shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" /> Upgrade to Premium
            </Link>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 flex items-center justify-between text-xs">
            <span className="text-stone-600 dark:text-stone-300">
              Active items: <strong className="text-stone-900 dark:text-stone-100">{activeCount}</strong> /{' '}
              {isFreePlan ? '3 (Free Tier)' : 'Unlimited (Premium)'}
            </span>
            {isFreePlan && (
              <Link
                href="/dashboard/vendor/subscription"
                className="text-red-600 dark:text-red-400 font-bold hover:underline"
              >
                Upgrade to Premium →
              </Link>
            )}
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Item Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                Item Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Smoky Chipotle Pulled Pork Pie"
                required
                disabled={isLimitReached}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-stone-800 dark:text-stone-200 disabled:opacity-50"
              />
            </div>

            {/* Category & Price Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={isLimitReached}
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-stone-800 dark:text-stone-200 disabled:opacity-50"
                >
                  <option value="Classic Pizzas">Classic Pizzas</option>
                  <option value="Vegetarian Pizzas">Vegetarian Pizzas</option>
                  <option value="Meat Lovers">Meat Lovers</option>
                  <option value="Specialty / Gourmet Pizzas">Specialty / Gourmet Pizzas</option>
                  <option value="Sides & Appetizers">Sides & Appetizers</option>
                  <option value="Beverages & Desserts">Beverages & Desserts</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                  Price ($ USD) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="18.99"
                  required
                  disabled={isLimitReached}
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-stone-800 dark:text-stone-200 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Location (Area / City) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                Location (Kitchen Area / City) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Brooklyn Heights, NY or Downtown Chicago"
                required
                disabled={isLimitReached}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-stone-800 dark:text-stone-200 disabled:opacity-50"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                Description & Fresh Ingredients <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="List crust preparation, cheese blends, tomato variety, and fresh herbs..."
                required
                disabled={isLimitReached}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-stone-800 dark:text-stone-200 disabled:opacity-50"
              />
            </div>

            {/* Image File Upload with ImgBB */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                Item Image (Uploaded via ImgBB) <span className="text-red-500">*</span>
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <label className="w-full sm:w-1/2 flex flex-col items-center justify-center p-6 border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-2xl cursor-pointer hover:border-red-500 transition-colors bg-stone-50/50 dark:bg-stone-800/30">
                  <UploadCloud className="w-8 h-8 text-stone-400 mb-2" />
                  <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    Choose Pizza Image File
                  </span>
                  <span className="text-[10px] text-stone-400 mt-0.5">PNG, JPG, WEBP up to 5MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isLimitReached}
                    className="hidden"
                  />
                </label>

                {imagePreview && (
                  <div className="w-full sm:w-1/2 aspect-video rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 relative">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-white">
                      Selected File
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || isLimitReached}
                className="w-full py-3.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-all shadow-md shadow-red-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Uploading & Submitting...' : 'Submit Pizza for Admin Approval'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
