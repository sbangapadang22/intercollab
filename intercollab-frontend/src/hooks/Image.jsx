// intercollab-frontend/src/hooks/Image.jsx
import { useState, useCallback } from "react";
import { processImage } from "../utils/api";

export const useLatestImage = () => {
  const [latestImage, setLatestImage] = useState(null);
  const [recognizedText, setRecognizedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageCapture = useCallback((imageData) => {
    setLatestImage(imageData);
    sendImageForProcessing(imageData);
  }, []);

  const sendImageForProcessing = async (imageData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Sending image for processing...");
      const result = await processImage(imageData);
      setRecognizedText(result.text);
      console.log("Recognized text:", result.text);
    } catch (err) {
      setError("Failed to process image");
      console.error("Error processing image:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { latestImage, recognizedText, isLoading, error, handleImageCapture };
};