// intercollab-frontend/src/pages/Whiteboard.tsx
import React, { useState } from "react";
import DrawingCanvas from "../components/DrawingCanvas";
import VideoFeed from "../components/VideoFeed";
import { useLatestImage } from "../hooks/Image";

const Whiteboard = () => {
  // States for color and lineWidth
  const [color, setColor] = useState("black");
  const [lineWidth, setLineWidth] = useState(5);
  
  // Use the hook to handle image capture and processing
  const { latestImage, recognizedText, isLoading, error, handleImageCapture } = useLatestImage();

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
  };

  const handleLineWidthChange = (newLineWidth: number) => {
    setLineWidth(newLineWidth);
  };

  return (
    <div className="p-4 flex flex-col h-screen gap-4">
      <div className="flex flex-1 gap-4">
        {/* Left - Video and Translation */}
        <div className="flex flex-col w-1/3 gap-4">
          <div className="border p-4 flex-1 flex flex-col">
            <h2 className="text-xl font-bold mb-4">Video</h2>
            <div className="flex-1 border flex items-center justify-center bg-gray-200">
              <VideoFeed active={true} onImageCapture={handleImageCapture} />
            </div>
          </div>
          <div className="border p-4 flex-1 flex flex-col">
            <h2 className="text-xl font-bold mb-4">Translation</h2>
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-100">
              {isLoading ? (
                <p>Processing image...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <p>{recognizedText || "No text recognized yet. Capture an image to start."}</p>
              )}
            </div>
          </div>
        </div>

        {/* Right - Whiteboard */}
        <div className="border p-4 flex-1 flex flex-col">
          <h2 className="text-xl font-bold mb-4">Whiteboard</h2>
          <div className="flex-1 border">
            <DrawingCanvas 
              color={color} 
              lineWidth={lineWidth} 
              onColorChange={handleColorChange} 
              onLineWidthChange={handleLineWidthChange} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;