"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Camera from "@/components/Camera";
import { SIGNS } from "@/data/signs";
import { speak } from "@/utils/tts";
import { isGestureCorrect } from "@/utils/gestureCompare";
import { getAuthToken } from "@/utils/api";

export default function Learn() {
  const router = useRouter();
  const [selectedSign, setSelectedSign] = useState<typeof SIGNS[0] | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [detectionCount, setDetectionCount] = useState(0);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleResults = (results: any) => {
    if (!selectedSign) return;

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];
      const correct = isGestureCorrect(landmarks, selectedSign.name);

      if (correct) {
        setIsCorrect(true);
        setDetectionCount((prev) => prev + 1);
      } else {
        setIsCorrect(false);
      }
    } else {
      setIsCorrect(null);
    }
  };

  const handleSignSelect = (sign: typeof SIGNS[0]) => {
    setSelectedSign(sign);
    setIsCorrect(null);
    setDetectionCount(0);
    speak(`This is the sign for ${sign.name}. ${sign.instructions}. Use this when ${getSignUsage(sign.name)}.`);
  };

  const getSignUsage = (signName: string): string => {
    const usageMap: Record<string, string> = {
      Hello: "greeting someone",
      "Thank You": "expressing gratitude",
      Yes: "agreeing or confirming",
      No: "disagreeing or denying",
      Please: "asking politely",
      Sorry: "apologizing",
      Love: "expressing affection",
      Help: "asking for assistance",
      More: "requesting additional items",
      Stop: "indicating to halt or cease",
    };
    return usageMap[signName] || "communicating";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Learn ASL Signs
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Sign List */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Available Signs
            </h2>
            <div className="space-y-3">
              {SIGNS.map((sign) => (
                <div
                  key={sign.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedSign?.id === sign.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                  }`}
                  onClick={() => handleSignSelect(sign)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {sign.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {sign.instructions}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speak(`This is the sign for ${sign.name}. ${sign.instructions}. Use this when ${getSignUsage(sign.name)}.`);
                      }}
                      className="ml-4 p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
                      title="Listen to instructions"
                    >
                      🔊
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Practice Area */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Practice Area
            </h2>

            {selectedSign ? (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">
                    {selectedSign.name}
                  </h3>
                  <p className="text-blue-800 mb-2">
                    {selectedSign.instructions}
                  </p>
                  <p className="text-sm text-blue-700">
                    Use when: {getSignUsage(selectedSign.name)}
                  </p>
                </div>

                <Camera
                  onResults={handleResults}
                  targetSign={selectedSign.name}
                  showFeedback={true}
                />

                {isCorrect !== null && (
                  <div
                    className={`p-4 rounded-lg ${
                      isCorrect
                        ? "bg-green-50 border border-green-200"
                        : "bg-yellow-50 border border-yellow-200"
                    }`}
                  >
                    <p
                      className={`font-semibold ${
                        isCorrect ? "text-green-800" : "text-yellow-800"
                      }`}
                    >
                      {isCorrect
                        ? "✓ Correct! Great job!"
                        : "Keep trying! Make sure your hand position matches the instructions."}
                    </p>
                    {isCorrect && detectionCount > 0 && (
                      <p className="text-sm text-green-700 mt-1">
                        Detected correctly {detectionCount} time(s)
                      </p>
                    )}
                  </div>
                )}

                <div className="text-center">
                  <Link
                    href="/test"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Take Test
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <p>Select a sign to start practicing</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
