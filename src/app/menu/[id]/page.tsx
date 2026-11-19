'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import {
  MapPin,
  Star,
  Sparkles,
  Heart,
  Calendar,
  Clock,
  ShieldCheck,
  ShoppingBag,
  ChevronLeft,
  X,
  Send,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export default function MenuItemDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [item, setItem] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Order modal state
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [message, setMessage] = useState('');
  const [submittingOrder, setSubmittingOrder] = useState(false);

  // Review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Fetch item and reviews
  useEffect(() => {
    if (!id) return;

    const fetchDetails = async () => {
      try {
        setLoading(true);
        const [itemRes, reviewRes] = await Promise.all([
          api.get(`/menu/${id}`),
          api.get(`/reviews/item/${id}`).catch(() => ({ data: { data: [] } })),
        ]);

        if (itemRes.data?.success) {
          setItem(itemRes.data.data);
        }
        if (reviewRes.data?.data) {
          setReviews(reviewRes.data.data);
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to load pizza details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  // Set default minimum delivery date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDeliveryDate(today);
  }, []);

  const handleOpenOrderModal = () => {
    if (!isAuthenticated) {
      toast.info('Please sign in to place an order.');
      router.push(`/login?redirect=/menu/${id}`);
      return;
    }

    if (user?.role === 'admin') {
      toast.error('Admin accounts cannot place customer food orders.');
      return;
    }

    if (user?.role === 'vendor') {
      if (item?.vendorId?._id === user._id) {
        toast.error('You cannot order your own restaurant’s menu item.');
        return;
      }
      toast.error('Vendor accounts cannot place orders. Please use a Customer account.');
      return;
    }

    setIsOrderModalOpen(true);
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!deliveryDate || !deliveryAddress.trim()) {
      toast.error('Please specify both delivery date and address.');
      return;
    }

    try {
      setSubmittingOrder(true);
      const res = await api.post('/orders', {
        itemId: item._id,
        deliveryDate,
        deliveryAddress: deliveryAddress.trim(),
        message: message.trim(),
      });

      if (res.data?.success) {
        toast.success('Pizza order submitted successfully!');
        setIsOrderModalOpen(false);
        router.push('/dashboard/customer/orders');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setSubmittingOrder(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) {
      toast.error('Please write a brief comment.');
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await api.post('/reviews', {
        itemId: item._id,
        rating: newRating,
        comment: newComment.trim(),
      });

      if (res.data?.success) {
        toast.success('Thank you for your review!');
        setReviews([res.data.data, ...reviews]);
        setIsReviewModalOpen(false);
        setNewComment('');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-20 flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-red-600 border-t-transparent animate-spin mb-4" />
        <p className="text-sm text-stone-500">Preparing fresh pizza details...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen py-24 text-center px-4">
        <AlertCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Pizza Not Found</h2>
        <p className="text-sm text-stone-500 mt-2">
          This menu item may have been removed or does not exist.
        </p>
        <Link
          href="/menu"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 text-white font-bold"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Menu
        </Link>
      </div>
    );
  }

  const isOwner = user?._id === item.vendorId?._id;
  const isPremiumVendor = item.vendorId?.subscriptionPlan === 'premium';
  const images = item.images && item.images.length > 0 ? item.images : ['https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800'];

  return (
    <div className="min-h-screen bg-stone-50/40 dark:bg-stone-950/40 py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-red-600 dark:hover:text-red-400 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Menu
        </Link>

        {/* Main Product Card */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden p-6 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Gallery */}
            <div className="lg:col-span-6 space-y-4">
              {/* Active Image */}
              <div className="relative aspect-[16/11] rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 shadow-sm">
                <img
                  src={images[activeImageIdx]}
                  alt={item.itemName}
                  className="w-full h-full object-cover"
                />

                {isPremiumVendor && (
                  <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md">
                    <Sparkles className="w-3.5 h-3.5" /> Premium Kitchen
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIdx === idx ? 'border-red-600 scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Details & Order CTA */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
                    {item.category}
                  </span>

                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-bold text-stone-800 dark:text-stone-200">
                      {item.rating ? Number(item.rating).toFixed(1) : '5.0'}
                    </span>
                    <span className="text-xs text-stone-400">
                      ({reviews.length} reviews)
                    </span>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
                  {item.itemName}
                </h1>

                <div className="text-3xl font-black text-red-600 dark:text-red-500">
                  {formatPrice(item.price)}
                </div>

                <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                  <span>Available in: {item.location}</span>
                </div>

                <div className="border-t border-stone-100 dark:border-stone-800 pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                    Ingredients & Description
                  </h4>
                  <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Vendor Bio Box */}
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {item.vendorId?.image ? (
                      <img
                        src={item.vendorId.image}
                        alt="Vendor"
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-500/40"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center">
                        {item.vendorId?.name?.slice(0, 1) || 'V'}
                      </div>
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                        {item.vendorId?.businessName || item.vendorId?.name || 'Local Artisan Pizzeria'}
                        {isPremiumVendor && <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                      </h4>
                      <p className="text-[11px] text-stone-400">
                        Pizzeria Partner • Verified Kitchen
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Action Buttons */}
              <div className="pt-6 border-t border-stone-100 dark:border-stone-800 space-y-3">
                {isOwner ? (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-medium text-center border border-amber-200 dark:border-amber-900">
                    You are the owner of this menu item. You cannot place an order for yourself.
                  </div>
                ) : user?.role === 'admin' ? (
                  <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 text-xs font-medium text-center border border-purple-200 dark:border-purple-900">
                    Logged in as Admin. Customer food ordering is restricted.
                  </div>
                ) : (
                  <button
                    onClick={handleOpenOrderModal}
                    className="w-full py-4 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 shadow-xl shadow-red-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Order Now ({formatPrice(item.price)})
                  </button>
                )}

                {/* Write Review Button */}
                {isAuthenticated && user?.role === 'customer' && (
                  <button
                    onClick={() => setIsReviewModalOpen(true)}
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                    Write a Review
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-12 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 lg:p-10 shadow-sm">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-100 dark:border-stone-800">
            <div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                Customer Reviews & Ratings ({reviews.length})
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Feedback from verified customers who enjoyed this pizza.
              </p>
            </div>

            {isAuthenticated && user?.role === 'customer' && (
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 transition-colors"
              >
                + Add Review
              </button>
            )}
          </div>

          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((rev) => (
                <div
                  key={rev._id}
                  className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {rev.userId?.image ? (
                        <img
                          src={rev.userId.image}
                          alt="Reviewer"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-700 font-bold text-xs flex items-center justify-center text-stone-600 dark:text-stone-300">
                          {rev.userId?.name?.slice(0, 1) || 'C'}
                        </div>
                      )}
                      <div>
                        <h5 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                          {rev.userId?.name || 'Customer'}
                        </h5>
                        <p className="text-[10px] text-stone-400">
                          {formatDate(rev.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-amber-400' : 'text-stone-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <MessageSquare className="w-10 h-10 text-stone-300 dark:text-stone-700 mx-auto mb-2" />
              <p className="text-sm font-semibold text-stone-600 dark:text-stone-400">
                No reviews yet for this pizza.
              </p>
              <p className="text-xs text-stone-400 mt-1">
                Be the first to order and leave a review!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ORDER MODAL */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
              <div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                  Place Pizza Order
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  {item.itemName} • {formatPrice(item.price)}
                </p>
              </div>
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleOrderSubmit} className="space-y-4">
              {/* Delivery Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                  Delivery Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-stone-800 dark:text-stone-200"
                />
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                  Delivery Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Street name, apartment, building, city, zip code..."
                  required
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-stone-800 dark:text-stone-200"
                />
              </div>

              {/* Special Instructions Message */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                  Special Instructions / Message (Optional)
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g., Ring bell twice, extra red pepper flakes, well done crust..."
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-stone-800 dark:text-stone-200"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submittingOrder}
                  className="w-full py-3.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submittingOrder ? 'Placing Order...' : `Confirm Order (${formatPrice(item.price)})`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REVIEW MODAL */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Rate this Pizza
              </h3>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Rating (1 to 5 Stars)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-sm font-bold text-stone-700 dark:text-stone-300 ml-2">
                    {newRating} / 5
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                  Your Review / Tasting Notes
                </label>
                <textarea
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="How was the crust, sauce, and cheese? Would you recommend it?"
                  required
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-none text-stone-800 dark:text-stone-200"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-all shadow-md disabled:opacity-50"
              >
                {submittingReview ? 'Submitting...' : 'Post Review'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
