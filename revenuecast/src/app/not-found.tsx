import Link from "next/link";
import { TrendingUp, Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <TrendingUp className="h-12 w-12 text-blue-600" />
          <span className="text-3xl font-bold text-gray-900">RevenueCast</span>
        </div>

        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-blue-600 mb-4">404</div>
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Page Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              Sorry, we couldn't find the page you're looking for. The page might have been moved, 
              deleted, or you might have entered the wrong URL.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
          >
            <Home className="h-5 w-5 mr-2" />
            Go to Homepage
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors inline-flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-gray-600 mb-4">Looking for something specific?</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Link
              href="/predict"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Revenue Predictions
            </Link>
            <Link
              href="/about"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              About RevenueCast
            </Link>
            <Link
              href="/auth/signin"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 text-sm text-gray-500">
          <p>
            Need help? Contact our support team at{" "}
            <a href="mailto:support@revenuecast.com" className="text-blue-600 hover:text-blue-800">
              support@revenuecast.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
