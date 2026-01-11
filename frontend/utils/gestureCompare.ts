import { SIGNS } from "@/data/signs";

// Hand landmark indices
const HAND_LANDMARKS = {
  WRIST: 0,
  THUMB_CMC: 1,
  THUMB_MCP: 2,
  THUMB_IP: 3,
  THUMB_TIP: 4,
  INDEX_MCP: 5,
  INDEX_PIP: 6,
  INDEX_DIP: 7,
  INDEX_TIP: 8,
  MIDDLE_MCP: 9,
  MIDDLE_PIP: 10,
  MIDDLE_DIP: 11,
  MIDDLE_TIP: 12,
  RING_MCP: 13,
  RING_PIP: 14,
  RING_DIP: 15,
  RING_TIP: 16,
  PINKY_MCP: 17,
  PINKY_PIP: 18,
  PINKY_DIP: 19,
  PINKY_TIP: 20,
};

interface Point {
  x: number;
  y: number;
  z?: number;
}

// Calculate Euclidean distance between two points
const distance = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dz = (p2.z || 0) - (p1.z || 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

// Check if fingers are extended
const isFingerExtended = (landmarks: Point[], fingerTips: number[], fingerPips: number[]): boolean => {
  for (let i = 0; i < fingerTips.length; i++) {
    const tip = landmarks[fingerTips[i]];
    const pip = landmarks[fingerPips[i]];
    if (tip.y > pip.y) {
      return false; // Finger is bent
    }
  }
  return true;
};

// Check if thumb is extended
const isThumbExtended = (landmarks: Point[]): boolean => {
  const thumbTip = landmarks[HAND_LANDMARKS.THUMB_TIP];
  const thumbIp = landmarks[HAND_LANDMARKS.THUMB_IP];
  const thumbMcp = landmarks[HAND_LANDMARKS.THUMB_MCP];
  
  // Thumb extension is different - check x position
  return thumbTip.x > thumbIp.x && thumbIp.x > thumbMcp.x;
};

// Gesture detection functions for each sign
const detectHello = (landmarks: Point[]): boolean => {
  // Hello: Hand raised, palm facing forward, fingers together
  const wrist = landmarks[HAND_LANDMARKS.WRIST];
  const middleTip = landmarks[HAND_LANDMARKS.MIDDLE_TIP];
  
  // Hand should be raised (middle tip above wrist)
  if (middleTip.y >= wrist.y) return false;
  
  // Fingers should be together (check distances between tips)
  const tips = [
    HAND_LANDMARKS.INDEX_TIP,
    HAND_LANDMARKS.MIDDLE_TIP,
    HAND_LANDMARKS.RING_TIP,
    HAND_LANDMARKS.PINKY_TIP,
  ];
  
  for (let i = 0; i < tips.length - 1; i++) {
    const dist = distance(landmarks[tips[i]], landmarks[tips[i + 1]]);
    if (dist > 0.15) return false; // Fingers too far apart
  }
  
  return true;
};

const detectThankYou = (landmarks: Point[]): boolean => {
  // Thank You: Touch chin and move forward (simplified: hand near chin area)
  const thumbTip = landmarks[HAND_LANDMARKS.THUMB_TIP];
  const indexTip = landmarks[HAND_LANDMARKS.INDEX_TIP];
  const middleTip = landmarks[HAND_LANDMARKS.MIDDLE_TIP];
  
  // Hand should be in front of face area (higher y position)
  const avgY = (thumbTip.y + indexTip.y + middleTip.y) / 3;
  if (avgY > 0.5) return false; // Too low
  
  // Fingers should be somewhat extended
  const wrist = landmarks[HAND_LANDMARKS.WRIST];
  if (indexTip.y >= wrist.y) return false;
  
  return true;
};

const detectYes = (landmarks: Point[]): boolean => {
  // Yes: Fist with thumb up (simplified: closed fist)
  const tips = [
    HAND_LANDMARKS.INDEX_TIP,
    HAND_LANDMARKS.MIDDLE_TIP,
    HAND_LANDMARKS.RING_TIP,
    HAND_LANDMARKS.PINKY_TIP,
  ];
  
  const pips = [
    HAND_LANDMARKS.INDEX_PIP,
    HAND_LANDMARKS.MIDDLE_PIP,
    HAND_LANDMARKS.RING_PIP,
    HAND_LANDMARKS.PINKY_PIP,
  ];
  
  // All fingers should be bent (tips below PIPs)
  for (let i = 0; i < tips.length; i++) {
    const tip = landmarks[tips[i]];
    const pip = landmarks[pips[i]];
    if (tip.y < pip.y) return false; // Finger is extended
  }
  
  return true;
};

const detectNo = (landmarks: Point[]): boolean => {
  // No: Index and middle finger extended, thumb extended, other fingers closed
  const indexTip = landmarks[HAND_LANDMARKS.INDEX_TIP];
  const middleTip = landmarks[HAND_LANDMARKS.MIDDLE_TIP];
  const ringTip = landmarks[HAND_LANDMARKS.RING_TIP];
  const pinkyTip = landmarks[HAND_LANDMARKS.PINKY_TIP];
  const thumbTip = landmarks[HAND_LANDMARKS.THUMB_TIP];
  
  const indexPip = landmarks[HAND_LANDMARKS.INDEX_PIP];
  const middlePip = landmarks[HAND_LANDMARKS.MIDDLE_PIP];
  const ringPip = landmarks[HAND_LANDMARKS.RING_PIP];
  const pinkyPip = landmarks[HAND_LANDMARKS.PINKY_PIP];
  
  // Index and middle should be extended
  if (indexTip.y >= indexPip.y || middleTip.y >= middlePip.y) return false;
  
  // Ring and pinky should be closed
  if (ringTip.y < ringPip.y || pinkyTip.y < pinkyPip.y) return false;
  
  // Thumb should be extended
  if (!isThumbExtended(landmarks)) return false;
  
  return true;
};

const detectPlease = (landmarks: Point[]): boolean => {
  // Please: Circular motion on chest (simplified: open hand, palm facing body)
  const tips = [
    HAND_LANDMARKS.INDEX_TIP,
    HAND_LANDMARKS.MIDDLE_TIP,
    HAND_LANDMARKS.RING_TIP,
    HAND_LANDMARKS.PINKY_TIP,
  ];
  
  const pips = [
    HAND_LANDMARKS.INDEX_PIP,
    HAND_LANDMARKS.MIDDLE_PIP,
    HAND_LANDMARKS.RING_PIP,
    HAND_LANDMARKS.PINKY_PIP,
  ];
  
  // Fingers should be extended
  return isFingerExtended(landmarks, tips, pips);
};

const detectSorry = (landmarks: Point[]): boolean => {
  // Sorry: Fist rubs chest (similar to Yes - closed fist)
  return detectYes(landmarks);
};

const detectLove = (landmarks: Point[]): boolean => {
  // Love: Cross arms (simplified: both hands, but we only detect one)
  // This is a simplified version - would need two hands for full detection
  const tips = [
    HAND_LANDMARKS.INDEX_TIP,
    HAND_LANDMARKS.MIDDLE_TIP,
    HAND_LANDMARKS.RING_TIP,
    HAND_LANDMARKS.PINKY_TIP,
  ];
  
  const pips = [
    HAND_LANDMARKS.INDEX_PIP,
    HAND_LANDMARKS.MIDDLE_PIP,
    HAND_LANDMARKS.RING_PIP,
    HAND_LANDMARKS.PINKY_PIP,
  ];
  
  // Fingers together and extended
  if (!isFingerExtended(landmarks, tips, pips)) return false;
  
  // Fingers should be close together
  const tipsArray = tips.map(idx => landmarks[idx]);
  for (let i = 0; i < tipsArray.length - 1; i++) {
    if (distance(tipsArray[i], tipsArray[i + 1]) > 0.2) return false;
  }
  
  return true;
};

const detectHelp = (landmarks: Point[]): boolean => {
  // Help: Thumb up on palm (simplified: thumb extended, other fingers closed)
  const thumbTip = landmarks[HAND_LANDMARKS.THUMB_TIP];
  const thumbIp = landmarks[HAND_LANDMARKS.THUMB_IP];
  
  // Thumb should be extended
  if (thumbTip.x <= thumbIp.x) return false;
  
  // Other fingers should be closed
  const tips = [
    HAND_LANDMARKS.INDEX_TIP,
    HAND_LANDMARKS.MIDDLE_TIP,
    HAND_LANDMARKS.RING_TIP,
    HAND_LANDMARKS.PINKY_TIP,
  ];
  
  const pips = [
    HAND_LANDMARKS.INDEX_PIP,
    HAND_LANDMARKS.MIDDLE_PIP,
    HAND_LANDMARKS.RING_PIP,
    HAND_LANDMARKS.PINKY_PIP,
  ];
  
  for (let i = 0; i < tips.length; i++) {
    const tip = landmarks[tips[i]];
    const pip = landmarks[pips[i]];
    if (tip.y < pip.y) return false; // Finger extended
  }
  
  return true;
};

const detectMore = (landmarks: Point[]): boolean => {
  // More: Fingertips together tap (simplified: fingertips close together)
  const tips = [
    HAND_LANDMARKS.THUMB_TIP,
    HAND_LANDMARKS.INDEX_TIP,
    HAND_LANDMARKS.MIDDLE_TIP,
    HAND_LANDMARKS.RING_TIP,
    HAND_LANDMARKS.PINKY_TIP,
  ];
  
  const tipsArray = tips.map(idx => landmarks[idx]);
  
  // All fingertips should be close to each other
  for (let i = 0; i < tipsArray.length - 1; i++) {
    for (let j = i + 1; j < tipsArray.length; j++) {
      if (distance(tipsArray[i], tipsArray[j]) > 0.25) return false;
    }
  }
  
  return true;
};

const detectStop = (landmarks: Point[]): boolean => {
  // Stop: One hand chops palm (simplified: fingers together, extended)
  const tips = [
    HAND_LANDMARKS.INDEX_TIP,
    HAND_LANDMARKS.MIDDLE_TIP,
    HAND_LANDMARKS.RING_TIP,
    HAND_LANDMARKS.PINKY_TIP,
  ];
  
  const pips = [
    HAND_LANDMARKS.INDEX_PIP,
    HAND_LANDMARKS.MIDDLE_PIP,
    HAND_LANDMARKS.RING_PIP,
    HAND_LANDMARKS.PINKY_PIP,
  ];
  
  // Fingers should be extended
  if (!isFingerExtended(landmarks, tips, pips)) return false;
  
  // Fingers should be close together
  const tipsArray = tips.map(idx => landmarks[idx]);
  for (let i = 0; i < tipsArray.length - 1; i++) {
    if (distance(tipsArray[i], tipsArray[i + 1]) > 0.2) return false;
  }
  
  return true;
};

// Map sign names to detection functions
const gestureDetectors: Record<string, (landmarks: Point[]) => boolean> = {
  Hello: detectHello,
  "Thank You": detectThankYou,
  Yes: detectYes,
  No: detectNo,
  Please: detectPlease,
  Sorry: detectSorry,
  Love: detectLove,
  Help: detectHelp,
  More: detectMore,
  Stop: detectStop,
};

export const isGestureCorrect = (
  landmarks: Point[] | undefined,
  signName: string
): boolean => {
  if (!landmarks || landmarks.length < 21) return false;

  const detector = gestureDetectors[signName];
  if (!detector) return false;

  try {
    return detector(landmarks);
  } catch (error) {
    console.error("Gesture detection error:", error);
    return false;
  }
};
