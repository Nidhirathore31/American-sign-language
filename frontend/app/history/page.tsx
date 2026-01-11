"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { testAPI, getAuthToken, TestResult } from "@/utils/api";

export default function History() {
  const router = useRouter();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
      return;
    }

    testAPI
      .getHistory()
      .then((results) => {
        setTestResults(results);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching test history:", error);
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Test History
          </h1>
          <Link
            href="/test"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Take New Test
          </Link>
        </div>

        {testResults.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              No Test History
            </h2>
            <p className="text-gray-600 mb-8">
              You haven't taken any tests yet. Take a test to see your history here.
            </p>
            <Link
              href="/test"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Take Test
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {testResults.map((result) => (
              <div
                key={result.id}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-6">
                    <div>
                      <div
                        className={`text-3xl font-bold ${
                          result.percentage >= 80
                            ? "text-green-600"
                            : result.percentage >= 50
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {result.score}/{result.total}
                      </div>
                      <div className="text-sm text-gray-500">Score</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">
                        {Math.round(result.percentage)}%
                      </div>
                      <div className="text-sm text-gray-500">Percentage</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">
                        {new Date(result.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(result.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setSelectedResult(
                        selectedResult?.id === result.id ? null : result
                      )
                    }
                    className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    {selectedResult?.id === result.id
                      ? "Hide Details"
                      : "View Details"}
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Progress
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {result.results.filter((r) => r.correct).length} correct
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        result.percentage >= 80
                          ? "bg-green-500"
                          : result.percentage >= 50
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${result.percentage}%` }}
                    />
                  </div>
                </div>

                {/* Detailed Results */}
                {selectedResult?.id === result.id && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Detailed Results
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-green-700 mb-2">
                          Correct Signs (
                          {result.results.filter((r) => r.correct).length})
                        </h4>
                        <ul className="space-y-1">
                          {result.results
                            .filter((r) => r.correct)
                            .map((r, index) => (
                              <li
                                key={index}
                                className="text-green-700 flex items-center"
                              >
                                <span className="mr-2">✓</span>
                                {r.signName}
                              </li>
                            ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-700 mb-2">
                          Incorrect Signs (
                          {result.results.filter((r) => !r.correct).length})
                        </h4>
                        <ul className="space-y-1">
                          {result.results
                            .filter((r) => !r.correct)
                            .map((r, index) => (
                              <li
                                key={index}
                                className="text-red-700 flex items-center"
                              >
                                <span className="mr-2">✗</span>
                                {r.signName}
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Statistics Summary */}
        {testResults.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Overall Statistics
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {testResults.length}
                </div>
                <div className="text-gray-600 mt-2">Total Tests</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {Math.round(
                    (testResults.reduce((sum, r) => sum + r.percentage, 0) /
                      testResults.length) *
                      10
                  ) / 10}
                  %
                </div>
                <div className="text-gray-600 mt-2">Average Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">
                  {Math.max(...testResults.map((r) => r.score))}
                </div>
                <div className="text-gray-600 mt-2">Best Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {new Date(
                    Math.max(
                      ...testResults.map((r) =>
                        new Date(r.createdAt).getTime()
                      )
                    )
                  ).toLocaleDateString()}
                </div>
                <div className="text-gray-600 mt-2">Last Test</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
