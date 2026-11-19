import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'PizzaHub — Artisanal Pizza Ordering & Delivery Platform',
  description:
    'Order fresh, authentic stone-baked pizzas, sides, and drinks from top local pizzerias. Fast oven-to-door delivery.',
  keywords: ['pizza', 'delivery', 'artisan pizza', 'pizzeria', 'order pizza online', 'food delivery'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className="min-h-full flex flex-col bg-[#fffdfa] dark:bg-[#0f0d0c] text-stone-900 dark:text-stone-100 antialiased selection:bg-red-500 selection:text-white">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster position="top-right" richColors closeButton />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
