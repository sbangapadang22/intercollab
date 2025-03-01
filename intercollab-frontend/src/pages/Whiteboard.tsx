// import React, { useState } from "react";
// import DrawingCanvas from "../components/DrawingCanvas";
// import VideoFeed from "../components/VideoFeed";

// const Whiteboard = () => {
//   // State to toggle between video and whiteboard
//   const [activeTab, setActiveTab] = useState<string>("whiteboard");

//   return (
//     <div className="p-4 flex flex-col h-screen gap-4">
//       {/* Tabs Section */}
//       <div className="flex gap-4 mb-4">
//         {/* Whiteboard Tab */}
//         <button
//           onClick={() => setActiveTab("whiteboard")}
//           className={`${
//             activeTab === "whiteboard" ? "bg-gray-300" : "bg-white"
//           } p-2 rounded`}
//         >
//           Whiteboard
//         </button>
        
//         {/* Video Tab */}
//         <button
//           onClick={() => setActiveTab("video")}
//           className={`${
//             activeTab === "video" ? "bg-gray-300" : "bg-white"
//           } p-2 rounded`}
//         >
//           Live Video
//         </button>
//       </div>
      
//       {/* Content Section */}
//       <div className="flex flex-1 gap-4">
//         {/* Left - Whiteboard or Video */}
//         <div className={`border p-4 flex-1 flex flex-col ${activeTab === "whiteboard" ? '' : 'hidden'}`}>
//           <h2 className="text-xl font-bold mb-4">Whiteboard</h2>
//           <div className="flex-1 border">
//             <DrawingCanvas />
//           </div>
//         </div>

//         <div className={`border p-4 flex-1 flex flex-col ${activeTab === "video" ? '' : 'hidden'}`}>
//           <h2 className="text-xl font-bold mb-4">Video</h2>
//           <div className="flex-1 border flex items-center justify-center bg-gray-200">
//             <VideoFeed active={activeTab === "video"} />
//           </div>
//         </div>
        
//         {/* Right - Translation */}
//         <div className="border p-4 flex flex-col w-1/3">
//           <h2 className="text-xl font-bold mb-4">Translation</h2>
//           <div className="flex-1 flex items-center justify-center bg-gray-100">
//             <p>Placeholder</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Whiteboard;
import React, { useState } from "react";
import DrawingCanvas from "../components/DrawingCanvas";
import VideoFeed from "../components/VideoFeed";

const Whiteboard = () => {
  // State to toggle between video and whiteboard
  const [activeTab, setActiveTab] = useState<string>("whiteboard");

  // States for color and lineWidth
  const [color, setColor] = useState("black");
  const [lineWidth, setLineWidth] = useState(5);

  const handleColorChange = (newColor) => {
    setColor(newColor);
  };

  const handleLineWidthChange = (newLineWidth) => {
    setLineWidth(newLineWidth);
  };

  return (
    <div className="p-4 flex flex-col h-screen gap-4">
      {/* Tabs Section */}
      <div className="flex gap-4 mb-4">
        {/* Whiteboard Tab */}
        <button
          onClick={() => setActiveTab("whiteboard")}
          className={`${
            activeTab === "whiteboard" ? "bg-gray-300" : "bg-white"
          } p-2 rounded`}
        >
          Whiteboard
        </button>

        {/* Video Tab */}
        <button
          onClick={() => setActiveTab("video")}
          className={`${
            activeTab === "video" ? "bg-gray-300" : "bg-white"
          } p-2 rounded`}
        >
          Live Video
        </button>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 gap-4">
        {/* Left - Whiteboard or Video */}
        <div
          className={`border p-4 flex-1 flex flex-col ${
            activeTab === "whiteboard" ? "" : "hidden"
          }`}
        >
          <h2 className="text-xl font-bold mb-4">Whiteboard</h2>


          <div className="flex-1 border">
            <DrawingCanvas color={color} lineWidth={lineWidth} />
          </div>
        </div>

        <div
          className={`border p-4 flex-1 flex flex-col ${
            activeTab === "video" ? "" : "hidden"
          }`}
        >
          <h2 className="text-xl font-bold mb-4">Video</h2>
          <div className="flex-1 border flex items-center justify-center bg-gray-200">
            <VideoFeed active={activeTab === "video"} />
          </div>
        </div>

        {/* Right - Translation */}
        <div className="border p-4 flex flex-col w-1/3">
          <h2 className="text-xl font-bold mb-4">Translation</h2>
          <div className="flex-1 flex items-center justify-center bg-gray-100">
            <p>Placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;
