import { useState, useCallback } from "react";

export const useLatestImage = () => {
  const [latestImage, setLatestImage] = useState(null);

  const handleImageCapture = useCallback((imageData) => {
    setLatestImage(imageData);
    processImage(imageData);
  }, []);

  const processImage = (imageData) => {
    console.log("Processing image...");
  };

  return { latestImage, handleImageCapture };
};