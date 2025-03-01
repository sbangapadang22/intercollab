import React from "react";
import DrawingCanvas from "../components/DrawingCanvas";

const Whiteboard = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Whiteboard</h2>
      <DrawingCanvas />
    </div>
  );
};

export default Whiteboard;
