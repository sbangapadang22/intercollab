import React, { useEffect, useRef, useState, useCallback } from "react";

// Use JSDoc comments for TypeScript types in a .jsx file
/**
 * @param {Object} props
 * @param {boolean} props.active
 * @param {function(string): void} [props.onImageCapture]
 */
const VideoFeed = ({ active, onImageCapture }) => {
  // Ref for camera stream
  const cameraStreamRef = useRef(null);
  
  // Ref for video element
  const videoRef = useRef(null);
  
  // State to store the latest captured image
  const [capturedImage, setCapturedImage] = useState(null);
  
  // State to manage video visibility
  const [isVideoVisible, setIsVideoVisible] = useState(true);

  // Function to capture image from video
  const captureImage = useCallback(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    
    // Create canvas element
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to image data URL
    const imageDataUrl = canvas.toDataURL("image/jpeg");

    // Update state with new image
    setCapturedImage(imageDataUrl);
    
    // Call the callback function with the image data if provided
    if (typeof onImageCapture === "function") {
      onImageCapture(imageDataUrl);
    }
    
    console.log("Image captured at", new Date().toLocaleTimeString());
  }, [onImageCapture]);

  // Setup and cleanup camera stream
  useEffect(() => {
    if (active && !cameraStreamRef.current) {
      // Start camera
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          cameraStreamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((error) => {
          console.error("Error accessing camera: ", error);
        });
    } else if (!active && cameraStreamRef.current) {
      // Stop camera
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }

    // Cleanup on unmount
    return () => {
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((track) => track.stop());
        cameraStreamRef.current = null;
      }
    };
  }, [active]);

  // Handle video visibility changes
  useEffect(() => {
    if (isVideoVisible && cameraStreamRef.current && videoRef.current) {
      videoRef.current.srcObject = cameraStreamRef.current;
    }
  }, [isVideoVisible]);

  return (
    <div className="relative w-full h-full">
      {isVideoVisible && (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      )}
      
      {/* Button to manually trigger capture */}
      <button 
        onClick={captureImage}
        className="absolute bottom-4 right-4 bg-blue-500 text-white px-3 py-1 rounded"
      >
        Capture Now
      </button>

      {/* Button to toggle video visibility */}
      <button 
        onClick={() => setIsVideoVisible((prev) => !prev)}
        className="absolute bottom-4 left-4 bg-green-500 text-white px-3 py-1 rounded"
      >
        {isVideoVisible ? "Hide Video" : "Show Video"}
      </button>
    </div>
  );
};

export default VideoFeed;