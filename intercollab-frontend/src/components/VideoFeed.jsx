import React, { useEffect, useRef, useState, useCallback } from "react";

/**
 * @param {Object} props
 * @param {boolean} props.active
 * @param {function(string): void} [props.onImageCapture]
 */
const VideoFeed = ({ active, onImageCapture }) => {
  const [showVideo, setShowVideo] = useState(true); // Manage video visibility
  const cameraStreamRef = useRef(null); // Ref for camera stream
  const videoRef = useRef(null); // Ref for video element
  const captureIntervalRef = useRef(null); // Ref for capture interval
  const [capturedImage, setCapturedImage] = useState(null); // State to store captured image

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

          // Setup interval to capture image every 10 seconds
          captureIntervalRef.current = window.setInterval(captureImage, 10000);
        })
        .catch((error) => {
          console.error("Error accessing camera: ", error);
        });
    } else if (!active && cameraStreamRef.current) {
      // Stop camera and clear interval
      if (captureIntervalRef.current !== null) {
        clearInterval(captureIntervalRef.current);
        captureIntervalRef.current = null;
      }

      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }

    // Cleanup on unmount
    return () => {
      if (captureIntervalRef.current !== null) {
        clearInterval(captureIntervalRef.current);
        captureIntervalRef.current = null;
      }

      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((track) => track.stop());
        cameraStreamRef.current = null;
      }
    };
  }, [active, captureImage]);

  // Toggle video visibility
  const toggleVideo = () => {
    setShowVideo((prevState) => !prevState);
  };

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
        style={{ display: showVideo ? 'block' : 'none' }} // Toggle video visibility
      />
      
      {/* Button to toggle video visibility */}
      <button
        onClick={toggleVideo}
        className="absolute bottom-4 left-4 bg-blue-500 text-white px-3 py-1 rounded"
      >
        {showVideo ? 'Hide Video' : 'Show Video'}
      </button>

      {/* Optional: Add a button to manually trigger capture */}
      <button 
        onClick={captureImage}
        className="absolute bottom-4 right-4 bg-blue-500 text-white px-3 py-1 rounded"
      >
        Capture Now
      </button>
    </div>
  );
};

export default VideoFeed;