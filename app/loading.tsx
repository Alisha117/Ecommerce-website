export default function Loading() {
  return (
    <div className="p-10">
      <div className="container mx-auto py-10 space-y-10">
        
        {/* Banner skeleton */}
        <div className="w-full h-[300px] rounded-lg bg-gray-200 animate-pulse" />

        {/* Product skeletons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <div className="w-full h-[280px] rounded-lg bg-gray-200 animate-pulse" />
              <div className="h-5 w-3/4 rounded bg-gray-200 animate-pulse" />
              <div className="h-5 w-1/2 rounded bg-gray-200 animate-pulse" />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}