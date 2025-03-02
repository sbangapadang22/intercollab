import React, { useRef, useEffect, useState } from "react";

/**
 * @param {Object} props
 * @param {string} props.color
 * @param {number} props.lineWidth
 * @param {function(string): void} props.onColorChange
 * @param {function(number): void} props.onLineWidthChange
 */
const DrawingCanvas = ({ color, lineWidth, onColorChange, onLineWidthChange }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState([]);
  const [tool, setTool] = useState("draw");
  const [eraserWidth, setEraserWidth] = useState(10);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    const context = canvas.getContext("2d");
    if (!context) return;

    context.scale(2, 2);
    context.lineCap = "round";
    contextRef.current = context;
  }, []); // Run only once on mount

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = color;
      contextRef.current.lineWidth = lineWidth;
    }
  }, [color, lineWidth]); // Update brush settings when color or lineWidth changes

  const startDrawing = (event) => {
    event.preventDefault();
    if (!contextRef.current) return;

    const { offsetX, offsetY, pressure } = event.nativeEvent;
    const effectivePressure = pressure || 1;

    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    contextRef.current.lineWidth = tool === "erase" ? eraserWidth : lineWidth * effectivePressure;
    contextRef.current.strokeStyle = tool === "erase" ? "white" : color;
    setIsDrawing(true);

    setStrokes((prevStrokes) => [
      ...prevStrokes,
      { x: offsetX, y: offsetY, timestamp: Date.now(), pressure: effectivePressure, tool },
    ]);
  };

  const draw = (event) => {
    if (!isDrawing || !contextRef.current) return;
    event.preventDefault();

    const { offsetX, offsetY, pressure } = event.nativeEvent;
    const effectivePressure = pressure || 1;

    contextRef.current.lineWidth = tool === "erase" ? eraserWidth : lineWidth * effectivePressure;
    contextRef.current.strokeStyle = tool === "erase" ? "white" : color;
    if (tool === "erase") {
      contextRef.current.clearRect(offsetX - eraserWidth / 2, offsetY - eraserWidth / 2, eraserWidth, eraserWidth);
    } else {
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    }

    setStrokes((prevStrokes) => [
      ...prevStrokes,
      { x: offsetX, y: offsetY, timestamp: Date.now(), pressure: effectivePressure, tool },
    ]);
  };

  const stopDrawing = () => {
    if (!contextRef.current) return;
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const toggleTool = () => {
    setTool((prevTool) => (prevTool === "draw" ? "erase" : "draw"));
  };

  const handleEraserWidthChange = (event) => {
    setEraserWidth(Number(event.target.value));
  };

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <button onClick={toggleTool} className="p-2 bg-blue-500 text-white rounded">
          {tool === "draw" ? "Switch to Erase" : "Switch to Draw"}
        </button>

        <input
          type="color"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          className="p-2 rounded"
        />

        <div className="flex items-center gap-2">
          <label>Brush Size:</label>
          <input
            type="range"
            min="1"
            max="50"
            value={lineWidth}
            onChange={(e) => onLineWidthChange(Number(e.target.value))}
            className="w-24"
          />
        </div>

        <div className="flex items-center gap-2">
          <label>Eraser Size:</label>
          <input
            type="range"
            min="1"
            max="50"
            value={eraserWidth}
            onChange={handleEraserWidthChange}
            className="w-24"
          />
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={800}
        height={1000}
        style={{ cursor: tool === "erase" ? "url(https://cdn.jsdelivr.net/gh/anthony-van-leeuwen/canvas-eraser-cursors@v1.1/eraser.cur), pointer" : "crosshair" }}
        className="w-full h-full bg-white border"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
    </div>
  );
};

export default DrawingCanvas;