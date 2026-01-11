"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { testAPI, getAuthToken, TestResult } from "@/utils/api";

export default function Result() {
  const router = useRouter();
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
      return;
    }

    // Get the latest test result
    testAPI
      .getHistory()
      .then((results) => {
        if (results && results.length > 0) {
          setTestResult(results[0]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching test result:", error);
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!testResult) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              No Test Results Found
            </h1>
            <p className="text-gray-600 mb-8">
              You haven't taken any tests yet. Take a test to see your results here.
            </p>
            <Link
              href="/test"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Take Test
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const correctCount = testResult.results.filter((r) => r.correct).length;
  const incorrectCount = testResult.results.filter((r) => !r.correct).length;
  const correctSigns = testResult.results.filter((r) => r.correct);
  const incorrectSigns = testResult.results.filter((r) => !r.correct);

  const getRecommendations = () => {
    const recommendations: string[] = [];
    
    if (testResult.percentage < 50) {
      recommendations.push(
        "Focus on practicing basic signs more frequently. Spend extra time on the learning page."
      );
    } else if (testResult.percentage < 80) {
      recommendations.push(
        "You're making good progress! Continue practicing the signs you missed."
      );
    } else {
      recommendations.push(
        "Excellent work! You've mastered most signs. Try practicing more complex signs."
      );
    }

    if (incorrectSigns.length > 0) {
      recommendations.push(
        `Practice these signs: ${incorrectSigns.map((s) => s.signName).join(", ")}`
      );
    }

    if (incorrectSigns.length > 5) {
      recommendations.push(
        "Consider reviewing the fundamentals before attempting the test again."
      );
    }

    return recommendations;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Test Results
        </h1>

        {/* Overall Score Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Overall Performance
            </h2>
            <div className="flex items-center justify-center space-x-8">
              <div>
                <div className="text-5xl font-bold text-blue-600">
                  {testResult.score}/{testResult.total}
                </div>
                <div className="text-gray-600 mt-2">Score</div>
              </div>
              <div className="h-24 w-px bg-gray-300"></div>
              <div>
                <div className="text-5xl font-bold text-green-600">
                  {Math.round(testResult.percentage)}%
                </div>
                <div className="text-gray-600 mt-2">Percentage</div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Overall Progress
              </span>
              <span className="text-sm font-medium text-gray-700">
                {Math.round(testResult.percentage)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all ${
                  testResult.percentage >= 80
                    ? "bg-green-500"
                    : testResult.percentage >= 50
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${testResult.percentage}%` }}
              />
            </div>
          </div>

          {/* Statistics */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Correct Signs: {correctCount}
              </h3>
              <ul className="space-y-2">
                {correctSigns.map((result, index) => (
                  <li
                    key={index}
                    className="flex items-center text-green-700"
                  >
                    <span className="mr-2">✓</span>
                    {result.signName}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-red-800 mb-2">
                Incorrect Signs: {incorrectCount}
              </h3>
              <ul className="space-y-2">
                {incorrectSigns.map((result, index) => (
                  <li key={index} className="text-red-700">
                    ✗ {result.signName}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Detailed Results
          </h2>
          <div className="space-y-4">
            {testResult.results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  result.correct
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span
                        className={`text-2xl mr-3 ${
                          result.correct ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {result.correct ? "✓" : "✗"}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {result.signName}
                      </h3>
                    </div>
                    <p className="text-gray-600 ml-10">{result.feedback}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Recommendations for Improvement
          </h2>
          <ul className="space-y-3">
            {getRecommendations().map((recommendation, index) => (
              <li
                key={index}
                className="flex items-start text-gray-700"
              >
                <span className="text-blue-600 mr-3 mt-1">•</span>
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex justify-center space-x-4">
          <Link
            href="/learn"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Practice More
          </Link>
          <Link
            href="/test"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Retake Test
          </Link>
          <Link
            href="/history"
            className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            View History
          </Link>
        </div>

        {/* Test Date */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          Test completed on:{" "}
          {new Date(testResult.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
