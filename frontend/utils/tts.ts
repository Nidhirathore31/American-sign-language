export const speak = (text: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.onend = () => resolve();
    utterance.onerror = (error) => reject(error);
    speechSynthesis.speak(utterance);
  });
};
