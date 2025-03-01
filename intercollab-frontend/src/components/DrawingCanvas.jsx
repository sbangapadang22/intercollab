import React, { useEffect, useRef } from "react";
import { Canvas } from "fabric";  // <-- Use the named export Canvas

const DrawingCanvas = () => {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

  useEffect(() => {
    if (!fabricRef.current) {
      // Create a Fabric Canvas instance from the Canvas class
      fabricRef.current = new Canvas(canvasRef.current, {
        isDrawingMode: true,  // allows freehand drawing
        selection: false,     // disable selection rectangles
      });
    }

    return () => {
      // Cleanup: dispose of the canvas on unmount
      if (fabricRef.current) {
        fabricRef.current.dispose();
        fabricRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ border: "1px solid #ccc", margin: "1rem 0" }}>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ cursor: "crosshair" }}
      />
    </div>
  );
};

export default DrawingCanvas;
