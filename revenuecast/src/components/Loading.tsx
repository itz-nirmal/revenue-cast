import { TrendingUp, Loader2 } from "lucide-react";

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export default function Loading({ message = "Loading...", fullScreen = false }: LoadingProps) {
  const containerClass = fullScreen 
    ? "min-h-screen bg-gray-50 flex items-center justify-center"
    : "flex items-center justify-center py-12";

  return (
    <div className={containerClass}>
      <div className="text-center">
        <div className="relative">
          <TrendingUp className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <Loader2 className="h-6 w-6 text-blue-600 animate-spin absolute top-5 right-5" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">RevenueCast</h3>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}
