import React, { useRef, useEffect, useState } from "react";

const DrawingCanvas = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState([]);

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
    context.strokeStyle = "black";
    context.lineWidth = 2;
    contextRef.current = context;
  }, []);

  const startDrawing = (event) => {
    event.preventDefault();
    if (!contextRef.current) return;

    const { offsetX, offsetY, pressure } = event.nativeEvent;
    const effectivePressure = pressure || 1;

    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    contextRef.current.lineWidth = 2 * effectivePressure;
    setIsDrawing(true);

    setStrokes((prevStrokes) => [
      ...prevStrokes,
      { x: offsetX, y: offsetY, timestamp: Date.now(), pressure: effectivePressure },
    ]);
  };

  const draw = (event) => {
    if (!isDrawing || !contextRef.current) return;
    event.preventDefault();

    const { offsetX, offsetY, pressure } = event.nativeEvent;
    const effectivePressure = pressure || 1;

    contextRef.current.lineWidth = 2 * effectivePressure;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();

    setStrokes((prevStrokes) => [
      ...prevStrokes,
      { x: offsetX, y: offsetY, timestamp: Date.now(), pressure: effectivePressure },
    ]);
  };

  const stopDrawing = () => {
    if (!contextRef.current) return;
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      style={{ cursor: "crosshair" }}
      className="w-full h-full bg-white border"
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
    />
  );
};

export default DrawingCanvas;
