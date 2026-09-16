import { Suspense } from "react";
import Container from "@/components/Container";
import HomeBanner from "@/components/HomeBanner";
import ProductGrid from "@/components/ProductGrid";

function BannerFallback() {
  return (
    <div className="w-full h-[300px] rounded-lg bg-gray-200 animate-pulse" />
  );
}

function ProductGridFallback() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="space-y-3">
          <div className="w-full h-[280px] rounded-lg bg-gray-200 animate-pulse" />
          <div className="h-5 w-3/4 rounded bg-gray-200 animate-pulse" />
          <div className="h-5 w-1/2 rounded bg-gray-200 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
 <div>
      <Container className="py-10">

        {/* Home Banner */}
        <Suspense fallback={<BannerFallback />}>
          <HomeBanner />
        </Suspense>

        {/* Products */}
        <Suspense fallback={<ProductGridFallback />}>
          <ProductGrid />
        </Suspense>

      </Container>
    </div>
  );
}