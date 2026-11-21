# 🍕 PizzaHub — Artisanal Pizza Ordering & Delivery Platform (Frontend Client)

> A modern, role-based food discovery and pizza ordering web application built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS**, and **Framer Motion**.

---

## 🔗 Project Links
- **Live Website**: [https://pizzahub-app.vercel.app](https://pizzahub-app.vercel.app) *(Deploy URL)*
- **Client GitHub Repository**: [https://github.com/your-username/pizzahub-client](https://github.com/your-username/pizzahub-client)
- **Server GitHub Repository**: [https://github.com/your-username/pizzahub-server](https://github.com/your-username/pizzahub-server)

---

## ✨ Key Features

### 1. 🌐 Public Browsing & Discovery
- **Hero & Pizza Showcase**: Dynamic hero with animated CTA, high-resolution pizza photography, and category quick-filters.
- **Browse Menu**: Multi-criteria search by pizza name or keywords, category filter pills, city/area location filtering, and price ascending/descending sorting.
- **Detailed Item Modal / Route (`/menu/[id]`)**: Full picture gallery, ingredients, vendor restaurant badge, live reviews with star ratings, and instant order placement.

### 2. 🔐 Authentication & Role Protection
- **Multi-Role Registration (`/register`)**: Register as **Customer (Foodie)**, **Vendor (Pizzeria)**, or **Admin (Administrator)** with server-side authorization passcode (`pizza-admin-2026`).
- **Live Password Validation**: Requires $\ge 6$ characters with at least one uppercase and one lowercase letter, featuring interactive live checkmarks.
- **JWT Authentication & Hydration**: Instant session hydration via cookies and localStorage, preventing redirects on page reload.
- **Route Guarding**: Role-based redirection preventing customers, vendors, and admins from accessing unauthorized dashboard routes.

### 3. 📊 Role-Based Dashboards
- **Customer Dashboard**:
  - Overview metrics of pending, accepted, and rejected orders.
  - Interactive **Order Status Timeline** (Pending $\rightarrow$ Accepted $\rightarrow$ Baking $\rightarrow$ Delivered).
  - Customer **Wishlist / Favorites** management.
  - Ability to cancel pending orders before kitchen acceptance.
- **Vendor (Restaurant) Dashboard**:
  - Live kitchen statistics, order queue, and revenue tracking.
  - Menu item management (Add, Edit, Delete, Toggle Availability).
  - **ImgBB Photo Upload**: Direct file upload to ImgBB CDN.
  - Order fulfillment: Accept or Reject incoming orders.
  - **Stripe Subscription**: Free plan (max 3 items) vs Premium upgrade ($19.99/mo) with verified badge and unlimited items.
- **Admin Dashboard**:
  - System-wide user directory with search, role filters, and Account Suspend/Block toggle.
  - Menu item moderation: Review pending pizza submissions, approve, reject, or remove items.
  - Immutable platform transaction logs with Stripe payment details.

### 4. 🌟 Challenge & Optional Features Implemented
- **Advanced Search & Sorting**: Full-text keyword search and bidirectional price sorting (`price_asc`, `price_desc`, `rating`, `newest`).
- **Dark / Light Mode Switcher**: Real-time theme toggle powered by `next-themes`.
- **Live Order Status Timeline**: Step-by-step graphical progress tracker on orders.
- **Customer Wishlist / Favorites**: Save favorite pizzas for 1-click re-ordering.
- **Reviews & Ratings**: Submit 1-5 star reviews with verified purchase ratings.

---

## 🛠️ Technology Stack & Dependencies

| Category | Packages & Technologies Used |
|---|---|
| **Core Framework** | `next` (v16.4.6), `react` (v19.3.0), `react-dom`, `typescript` (v5) |
| **Styling & Icons** | `tailwindcss` (v4), `@tailwindcss/postcss`, `lucide-react`, `next-themes`, `clsx`, `tailwind-merge` |
| **Animations** | `framer-motion` (v14.14.0), `canvas-confetti` |
| **Data Fetching & State** | `axios`, `sonner` (Toast notifications), React Context API |
| **Data Visualization** | `recharts` (Analytics charts) |

---

## 🔑 Environment Variables

Create a `.env.local` file in the root of the `client` directory:

```env
# API URL of the backend server
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# ImgBB API Key for menu image uploads
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key_here
```

---

## 💻 How to Run Locally

### Prerequisites
- Node.js version 20 or higher
- npm or pnpm

### Steps
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/pizzahub-client.git
   cd pizzahub-client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env.local
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

Open [http://localhost:3000](http://localhost:3000) to view PizzaHub in your browser.

---

## 👥 Default Test Accounts
- **Admin**: `admin@pizzahub.com` / `Admin@123456`
- **Vendor (Premium)**: `luigi@pizzahub.com` / `Vendor@123456`
- **Vendor (Free)**: `marco@pizzahub.com` / `Vendor@123456`
- **Customer**: `alex@gmail.com` / `Customer@123456`
- **Admin Registration Passcode**: `pizza-admin-2026`
