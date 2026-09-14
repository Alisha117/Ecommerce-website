import type { Metadata } from "next";
import "../globals.css";

import { Suspense } from "react";
import { ClerkProvider } from "@clerk/nextjs";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSync from "@/components/CartSync";
import WishlistSync from "@/components/WishlistSync";
import { Toaster } from "react-hot-toast";
import { SanityLive } from "@/sanity/lib/live";

export const metadata: Metadata = {
  title: "Crystal Ecommerce app for shoppers",
  description: "An Ecommerce app for shopping",
};

function HeaderFallback() {
  return (
    <div className="h-16 w-full border-b bg-white animate-pulse" />
  );
}

function PageFallback() {
  return (
    <main className="min-h-[60vh] p-10">
      <div className="container mx-auto space-y-8">
        <div className="h-10 w-48 rounded bg-gray-200 animate-pulse" />

        <div className="h-[300px] w-full rounded-lg bg-gray-200 animate-pulse" />

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <div className="h-[280px] w-full rounded-lg bg-gray-200 animate-pulse" />
              <div className="h-5 w-3/4 rounded bg-gray-200 animate-pulse" />
              <div className="h-5 w-1/2 rounded bg-gray-200 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function FooterFallback() {
  return (
    <div className="h-40 w-full bg-gray-100 animate-pulse" />
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      {/* Cart and wishlist synchronization */}
      <Suspense fallback={null}>
        <CartSync />
        <WishlistSync />
      </Suspense>

      {/* Sanity live updates */}
      <Suspense fallback={null}>
        <SanityLive includeDrafts={false} />
      </Suspense>

      {/* Header */}
      <Suspense fallback={<HeaderFallback />}>
        <Header />
      </Suspense>

      {/* Page content */}
      <Suspense fallback={<PageFallback />}>
        {children}
      </Suspense>

      {/* Footer */}
      <Suspense fallback={<FooterFallback />}>
        <Footer />
      </Suspense>

      {/* Toast notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#000000",
            color: "#ffffff",
          },
        }}
      />
    </ClerkProvider>
  );
}