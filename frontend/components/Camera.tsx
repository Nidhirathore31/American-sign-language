"use client";
import { useEffect, useRef, useState } from "react";
import Script from "next/script";

// MediaPipe Hand Connections
const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [0, 9], [9, 10], [10, 11], [11, 12],
  [0, 13], [13, 14], [14, 15], [15, 16],
  [0, 17], [17, 18], [18, 19], [19, 20],
  [5, 9], [9, 13], [13, 17]
];

interface CameraProps {
  onResults?: (results: any) => void;
  targetSign?: string;
  showFeedback?: boolean;
}

export default function CameraComponent({
  onResults,
  targetSign,
  showFeedback = false,
}: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scriptsLoaded, setScriptsLoaded] = useState({ hands: false, camera: false });

  // Check if scripts are already loaded (e.g. from previous navigation)
  useEffect(() => {
    if ((window as any).Hands) {
      setScriptsLoaded(prev => ({ ...prev, hands: true }));
    }
    if ((window as any).Camera) {
      setScriptsLoaded(prev => ({ ...prev, camera: true }));
    }
  }, []);

  useEffect(() => {
    let hands: any = null;
    let camera: any = null;

    if (!scriptsLoaded.hands || !scriptsLoaded.camera) return;

    const initializeCamera = async () => {
      try {
        setError(null);
        setIsLoading(true);

        if (!videoRef.current) return;

        // Access globals loaded by scripts
        const Hands = (window as any).Hands;
        const Camera = (window as any).Camera;

        if (!Hands || !Camera) {
          throw new Error("MediaPipe libraries not loaded");
        }

        hands = new Hands({
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        hands.setOptions({
          maxNumHands: 2,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
          modelComplexity: 1,
        });

        hands.onResults((results: any) => {
          if (onResults) {
            onResults(results);
          }

          // Draw hand landmarks on canvas
          if (canvasRef.current && videoRef.current) {
            const canvasCtx = canvasRef.current.getContext("2d");
            if (canvasCtx && videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
              // Set canvas dimensions to match video
              const videoWidth = videoRef.current.videoWidth;
              const videoHeight = videoRef.current.videoHeight;
              
              if (canvasRef.current.width !== videoWidth || canvasRef.current.height !== videoHeight) {
                canvasRef.current.width = videoWidth;
                canvasRef.current.height = videoHeight;
              }

              canvasCtx.save();
              canvasCtx.clearRect(0, 0, videoWidth, videoHeight);
              
              // Draw video frame
              if (results.image) {
                canvasCtx.drawImage(results.image, 0, 0, videoWidth, videoHeight);
              }

              // Draw hand landmarks and connections
              if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                for (const landmarks of results.multiHandLandmarks) {
                  // Draw connections
                  canvasCtx.strokeStyle = "#00FF00";
                  canvasCtx.lineWidth = 2;
                  for (const connection of HAND_CONNECTIONS) {
                    const start = landmarks[connection[0]];
                    const end = landmarks[connection[1]];
                    if (start && end) {
                      canvasCtx.beginPath();
                      canvasCtx.moveTo(
                        start.x * videoWidth,
                        start.y * videoHeight
                      );
                      canvasCtx.lineTo(
                        end.x * videoWidth,
                        end.y * videoHeight
                      );
                      canvasCtx.stroke();
                    }
                  }

                  // Draw landmarks
                  canvasCtx.fillStyle = "#FF0000";
                  for (const landmark of landmarks) {
                    canvasCtx.beginPath();
                    canvasCtx.arc(
                      landmark.x * videoWidth,
                      landmark.y * videoHeight,
                      3,
                      0,
                      2 * Math.PI
                    );
                    canvasCtx.fill();
                  }
                }
              }
              canvasCtx.restore();
            }
          }
        });

        // Wait for video to be ready
        const waitForVideo = () => {
          return new Promise<void>((resolve) => {
            if (videoRef.current && videoRef.current.readyState >= 2) {
              resolve();
            } else {
              const checkReady = () => {
                if (videoRef.current && videoRef.current.readyState >= 2) {
                  videoRef.current.removeEventListener("loadeddata", checkReady);
                  resolve();
                }
              };
              if (videoRef.current) {
                videoRef.current.addEventListener("loadeddata", checkReady);
              }
            }
          });
        };

        camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current && hands && videoRef.current.readyState >= 2) {
              try {
                await hands.send({ image: videoRef.current });
              } catch (error) {
                console.error("Error sending frame to hands detector:", error);
              }
            }
          },
          width: 640,
          height: 480,
        });

        await camera.start();
        await waitForVideo();
        setIsLoading(false);
      } catch (err: any) {
        console.error("Camera initialization error:", err);
        setError(
          err.message ||
          "Failed to access camera. Please ensure camera permissions are granted."
        );
        setIsLoading(false);
      }
    };

    initializeCamera();

    return () => {
      if (camera) {
        camera.stop();
      }
      if (hands) {
        hands.close();
      }
    };
  }, [onResults, scriptsLoaded]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 font-semibold mb-2">Camera Error</p>
        <p className="text-red-500 text-sm text-center">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Reload Page
        </button>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js"
        strategy="afterInteractive"
        onLoad={() => setScriptsLoaded(prev => ({ ...prev, hands: true }))}
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"
        strategy="afterInteractive"
        onLoad={() => setScriptsLoaded(prev => ({ ...prev, camera: true }))}
      />
      <div className="relative w-full max-w-2xl mx-auto">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Initializing camera...</p>
            </div>
          </div>
        )}
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full rounded-lg"
            autoPlay
            playsInline
            muted
            style={{ transform: "scaleX(-1)" }}
            onLoadedMetadata={() => {
              // Ensure video dimensions are set
              if (videoRef.current) {
                videoRef.current.width = videoRef.current.videoWidth;
                videoRef.current.height = videoRef.current.videoHeight;
              }
            }}
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
            style={{ transform: "scaleX(-1)" }}
          />
        </div>
        {targetSign && showFeedback && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 font-semibold">
              Attempting: {targetSign}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
  