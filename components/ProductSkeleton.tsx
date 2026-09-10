// components/ProductSkeleton.tsx
export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 flex flex-col animate-pulse">
      {/* Simulation de l'image */}
      <div className="w-full h-52 rounded-xl bg-gray-200 mb-4"></div>
      
      {/* Simulation du titre */}
      <div className="h-5 bg-gray-200 rounded-md w-3/4 mb-2"></div>
      
      {/* Simulation du prix */}
      <div className="h-6 bg-gray-200 rounded-md w-1/3 mb-6"></div>
      
      {/* Simulation des boutons */}
      <div className="mt-auto flex gap-2">
        <div className="flex-1 h-10 bg-gray-200 rounded-xl"></div>
        <div className="flex-1 h-10 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
}