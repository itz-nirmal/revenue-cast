"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  TrendingUp,
  Brain,
  DollarSign,
  Users,
  Building,
  MapPin,
  Calculator,
  Loader2,
  CheckCircle,
  AlertCircle,
  Save,
} from "lucide-react";

interface PredictionData {
  marketing_spend: number;
  rd_spend: number;
  admin_costs: number;
  num_employees: number;
  region: string;
}

interface PredictionResult {
  predicted_revenue: number;
  input_data: PredictionData;
  model_performance: {
    r2_score: number;
    mae: number;
  };
  timestamp: string;
  status: string;
}

export default function Predict() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState<PredictionData>({
    marketing_spend: 0,
    rd_spend: 0,
    admin_costs: 0,
    num_employees: 0,
    region: "North America",
  });

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [companyName, setCompanyName] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "region" ? value : parseFloat(value) || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get prediction");
      }

      const result: PredictionResult = await response.json();
      setPrediction(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to get prediction. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const savePrediction = async () => {
    if (!session?.user || !prediction || !companyName.trim()) {
      setError("Please provide a company name and ensure you're signed in");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: companyName.trim(),
          input_data: prediction.input_data,
          predicted_revenue: prediction.predicted_revenue,
          model_performance: prediction.model_performance,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save prediction");
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save prediction. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">
                RevenueCast
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                About
              </Link>
              <Link href="/predict" className="text-blue-600 font-semibold">
                Predict
              </Link>
              <Link
                href="/auth/signin"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Revenue <span className="text-blue-600">Prediction</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enter your company details below to get an AI-powered revenue
            prediction based on our advanced machine learning model.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Prediction Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <Calculator className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">
                Company Information
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building className="inline h-4 w-4 mr-1" />
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Tech Startup Inc."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="inline h-4 w-4 mr-1" />
                  Marketing Spend ($)
                </label>
                <input
                  type="number"
                  name="marketing_spend"
                  value={formData.marketing_spend || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 150000"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Brain className="inline h-4 w-4 mr-1" />
                  R&D Spend ($)
                </label>
                <input
                  type="number"
                  name="rd_spend"
                  value={formData.rd_spend || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 120000"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building className="inline h-4 w-4 mr-1" />
                  Administrative Costs ($)
                </label>
                <input
                  type="number"
                  name="admin_costs"
                  value={formData.admin_costs || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 50000"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="inline h-4 w-4 mr-1" />
                  Number of Employees
                </label>
                <input
                  type="number"
                  name="num_employees"
                  value={formData.num_employees || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 300"
                  required
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Region
                </label>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  title="Select your company's region"
                >
                  <option value="North America">North America</option>
                  <option value="Europe">Europe</option>
                  <option value="Asia">Asia</option>
                </select>
              </div>

              {error && (
                <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-red-700">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Predicting Revenue...
                  </>
                ) : (
                  <>
                    <Calculator className="h-5 w-5 mr-2" />
                    Predict Revenue
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Panel */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">
                Prediction Results
              </h2>
            </div>

            {!prediction && !loading && (
              <div className="text-center py-12">
                <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Fill out the form and click "Predict Revenue" to see your
                  results here.
                </p>
              </div>
            )}

            {loading && (
              <div className="text-center py-12">
                <Loader2 className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-spin" />
                <p className="text-gray-600">
                  Our AI model is analyzing your data...
                </p>
              </div>
            )}

            {prediction && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                    <span className="text-green-800 font-semibold">
                      Prediction Complete
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {formatCurrency(prediction.predicted_revenue)}
                  </div>
                  <p className="text-gray-600">Predicted Annual Revenue</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Model Accuracy</div>
                    <div className="text-xl font-bold text-blue-600">
                      {(prediction.model_performance.r2_score * 100).toFixed(1)}
                      %
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Avg. Error</div>
                    <div className="text-xl font-bold text-purple-600">
                      {formatCurrency(prediction.model_performance.mae)}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Input Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Marketing Spend:</span>
                      <span className="font-medium">
                        {formatCurrency(prediction.input_data.marketing_spend)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">R&D Spend:</span>
                      <span className="font-medium">
                        {formatCurrency(prediction.input_data.rd_spend)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Admin Costs:</span>
                      <span className="font-medium">
                        {formatCurrency(prediction.input_data.admin_costs)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Employees:</span>
                      <span className="font-medium">
                        {prediction.input_data.num_employees.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Region:</span>
                      <span className="font-medium">
                        {prediction.input_data.region}
                      </span>
                    </div>
                  </div>
                </div>

                {session?.user ? (
                  <button
                    type="button"
                    onClick={savePrediction}
                    disabled={saving || !companyName.trim() || saveSuccess}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        Saving...
                      </>
                    ) : saveSuccess ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Saved!
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Prediction
                      </>
                    )}
                  </button>
                ) : (
                  <Link
                    href="/auth/signin"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center block"
                  >
                    Sign in to Save
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
