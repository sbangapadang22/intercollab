import React from "react";
import DrawingCanvas from "../components/DrawingCanvas";


const Whiteboard = () => {
  return (
    <div className="p-4 flex flex-col h-screen gap-4">
      {/* Top Section */}
      <div className="flex flex-1 gap-4">
        {/* Left - Whiteboard */}
        <div className="border p-4 flex-1 flex flex-col">
          <h2 className="text-xl font-bold mb-4">Whiteboard</h2>
          <div className="flex-1 border">
            <DrawingCanvas />
          </div>
        </div>
        
        {/* Right - Video */}
        <div className="border p-4 flex-1 flex flex-col">
          <h2 className="text-xl font-bold mb-4">Video</h2>
          <div className="flex-1 border flex items-center justify-center bg-gray-200">
            <p>Video Placeholder</p>
          </div>
        </div>
      </div>
      
      {/* Bottom Section - Translation */}
      <div className="border p-4 h-24 flex items-center justify-center bg-gray-100">
        <h2 className="text-lg font-bold">Translation Area</h2>
      </div>
    </div>
  );
};

export default Whiteboard;
