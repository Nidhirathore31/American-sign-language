"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Camera from "@/components/Camera";
import { SIGNS } from "@/data/signs";
import { isGestureCorrect } from "@/utils/gestureCompare";
import { speak } from "@/utils/tts";
import { testAPI, getAuthToken } from "@/utils/api";

interface TestResult {
  signId: number;
  signName: string;
  correct: boolean;
  feedback: string;
}

export default function Test() {
  const router = useRouter();
  const [testSigns, setTestSigns] = useState<(typeof SIGNS[0])[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<TestResult[]>([]);
  const [score, setScore] = useState(0);
  const [isDetected, setIsDetected] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(10);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const detectedRef = useRef(false);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const moveToNextSign = async () => {
    if (currentIndex < testSigns.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextSign = testSigns[nextIndex];
      
      // Play audio first, then update state when audio finishes
      await speak(`Next sign: ${nextSign.name}. ${nextSign.instructions}`);
      
      // Update state after audio finishes
      setCurrentIndex(nextIndex);
      setIsDetected(false);
      detectedRef.current = false;
      setTimeRemaining(10);
    } else {
      // Test complete
      finishTest();
    }
  };

  useEffect(() => {
    if (isTestStarted && currentIndex < testSigns.length && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !isDetected && currentIndex < testSigns.length && isTestStarted) {
      // Time's up - mark as incorrect
      const currentSign = testSigns[currentIndex];
      const newResult: TestResult = {
        signId: currentSign.id,
        signName: currentSign.name,
        correct: false,
        feedback: `Time's up. The correct sign is: ${currentSign.name}. ${currentSign.instructions}`,
      };
      setResults((prev) => [...prev, newResult]);
      // Play audio and wait for it to finish before moving to next sign
      speak(`Time's up for ${currentSign.name}.`).then(() => {
        // Move to next sign after audio finishes
        setTimeout(() => {
          moveToNextSign();
        }, 500);
      });
    }
  }, [isTestStarted, currentIndex, testSigns.length, timeRemaining, isDetected, testSigns]);

  const startTest = async () => {
    // Select 10 random signs from SIGNS
    const shuffled = [...SIGNS].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);
    setTestSigns(selected);
    setResults([]);
    setScore(0);
    setIsTestComplete(false);
    setTimeRemaining(10);
    setIsDetected(false);
    detectedRef.current = false;

    if (selected.length > 0) {
      const firstSign = selected[0];
      // Play audio first, then update state when audio finishes
      await speak(`Test started. Please sign: ${firstSign.name}. ${firstSign.instructions}`);
      
      // Update state after audio finishes
      setCurrentIndex(0);
      setIsTestStarted(true);
    }
  };

  const handleResults = useCallback(
    (results: any) => {
      if (detectedRef.current || isDetected || currentIndex >= testSigns.length || !isTestStarted) return;

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        const currentSign = testSigns[currentIndex];
        const correct = isGestureCorrect(landmarks, currentSign.name);

        if (correct) {
          // Use ref to prevent race condition - set immediately
          detectedRef.current = true;
          setIsDetected(true);
          const newResult: TestResult = {
            signId: currentSign.id,
            signName: currentSign.name,
            correct: true,
            feedback: "Well done! Correct sign detected.",
          };

          setResults((prev) => [...prev, newResult]);
          setScore((prev) => prev + 1);
          
          // Play audio and wait for it to finish before moving to next sign
          speak(`Correct! ${currentSign.name} detected.`).then(() => {
            // Move to next sign after audio finishes
            setTimeout(() => {
              moveToNextSign();
            }, 500);
          });
        }
      }
    },
    [currentIndex, testSigns, isDetected, isTestStarted]
  );


  const finishTest = async () => {
    setIsTestComplete(true);
    setIsTestStarted(false);

    try {
      await testAPI.saveTest(score, 10, results);
      speak(`Test complete! Your score is ${score} out of 10.`);
      
      // Redirect to results page after a short delay
      setTimeout(() => {
        router.push("/result");
      }, 3000);
    } catch (error) {
      console.error("Error saving test:", error);
      // Still redirect to results page even if save fails
      setTimeout(() => {
        router.push("/result");
      }, 3000);
    }
  };

  if (!isTestStarted && !isTestComplete) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              ASL Test
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Test your knowledge of ASL signs. You'll be presented with 10
              signs to perform. Each sign has a 10-second time limit.
            </p>
            <ul className="text-left space-y-2 mb-8 bg-gray-50 p-6 rounded-lg">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>10 signs will be randomly selected</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>10 seconds per sign</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>Real-time gesture recognition</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>Get immediate feedback</span>
              </li>
            </ul>
            <button
              onClick={startTest}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
            >
              Start Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isTestComplete) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Test Complete!
            </h1>
            <p className="text-2xl text-blue-600 mb-8">
              Score: {score} / 10 ({Math.round((score / 10) * 100)}%)
            </p>
            <p className="text-gray-600 mb-8">
              Redirecting to results page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentSign = testSigns[currentIndex];
  const progress = ((currentIndex + 1) / testSigns.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-semibold text-gray-800">
                Sign {currentIndex + 1} of {testSigns.length}
              </h2>
              <div className="text-lg font-semibold text-blue-600">
                Time: {timeRemaining}s
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="text-3xl font-bold text-blue-900 mb-2">
                {currentSign.name}
              </h3>
              <p className="text-lg text-blue-800">
                {currentSign.instructions}
              </p>
            </div>

            <Camera
              onResults={handleResults}
              targetSign={currentSign.name}
              showFeedback={true}
            />

            {isDetected && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-semibold text-center">
                  ✓ Correct! Moving to next sign...
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <div className="text-xl font-semibold text-gray-700">
              Current Score: {score} / {testSigns.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
