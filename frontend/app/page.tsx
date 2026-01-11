"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/utils/api";

export default function Home() {
  const router = useRouter();
  const token = getAuthToken();

  useEffect(() => {
    if (token) {
      router.push("/learn");
    }
  }, [token, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to ASL Teacher
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Learn American Sign Language through interactive lessons, real-time
            gesture recognition, and comprehensive testing.
          </p>

          <div className="grid md:grid-cols-2 gap-8 my-12">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Interactive Learning
              </h2>
              <p className="text-gray-600 mb-4">
                Practice ASL signs with step-by-step instructions and
                real-time feedback using your camera.
              </p>
              <ul className="text-left text-gray-600 space-y-2">
                <li>✓ Visual demonstrations</li>
                <li>✓ Audio instructions</li>
                <li>✓ Real-time gesture recognition</li>
                <li>✓ 10+ ASL signs to learn</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Test & Improve
              </h2>
              <p className="text-gray-600 mb-4">
                Take assessments to evaluate your progress and receive
                personalized recommendations.
              </p>
              <ul className="text-left text-gray-600 space-y-2">
                <li>✓ 10-sign assessments</li>
                <li>✓ Detailed performance reports</li>
                <li>✓ Progress tracking</li>
                <li>✓ Improvement suggestions</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 space-x-4">
            <Link
              href="/login"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/learn"
              className="inline-block bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Browse Signs
            </Link>
          </div>

          <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">1</div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Sign Up / Login
                </h3>
                <p className="text-gray-600">
                  Create an account to track your progress and save your test
                  results.
                </p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">2</div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Learn Signs
                </h3>
                <p className="text-gray-600">
                  Browse through ASL signs, view instructions, and practice with
                  camera-based feedback.
                </p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">3</div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Take Tests
                </h3>
                <p className="text-gray-600">
                  Test your knowledge with assessments and review detailed
                  performance analytics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
