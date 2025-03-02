import React, { useState, useEffect } from "react";
import DrawingCanvas from "../components/DrawingCanvas";
import VideoFeed from "../components/VideoFeed";
import { useLatestImage } from "../hooks/Image";
import axios from "axios";

const Whiteboard = () => {
  // States for color and lineWidth
  const [color, setColor] = useState("black");
  const [lineWidth, setLineWidth] = useState(5);
  
  // State for language selection
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [translatedText, setTranslatedText] = useState("");
  
  // Use the hook to handle image capture and processing
  const { latestImage, recognizedText, isLoading, error, handleImageCapture } = useLatestImage();

  // Translate text when recognizedText changes
  useEffect(() => {
    const translateText = async () => {
      if (recognizedText && selectedLanguage !== "en") {
        try {
          // In a real app, replace this with your actual translation API call
          const response = await axios.post("http://localhost:8000/api/translate", {
            text: recognizedText,
            target_language: selectedLanguage
          });
          setTranslatedText(response.data.translated_text);
        } catch (err) {
          console.error("Translation error:", err);
          setTranslatedText("Translation failed");
        }
      } else {
        setTranslatedText("");
      }
    };
    
    translateText();
  }, [recognizedText, selectedLanguage]);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
  };

  const handleLineWidthChange = (newLineWidth: number) => {
    setLineWidth(newLineWidth);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Translation</h2>
              <div className="flex items-center">
                <label htmlFor="language" className="mr-2">Translate to:</label>
                <select
                  id="language"
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                  className="border rounded p-1"
                >
                  <option value="en">English (Original)</option>
                  <option value="es">Spanish</option>
                  <option value="hi">Hindi</option>
                  <option value="zh">Mandarin</option>
                </select>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-100 p-4 overflow-auto">
              {isLoading ? (
                <p>Processing image...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <div className="w-full">
                  <div className="mb-2">
                    <p className="font-semibold">Original:</p>
                    <p>{recognizedText || "No text recognized yet. Capture an image to start."}</p>
                  </div>
                  
                  {selectedLanguage !== "en" && recognizedText && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="font-semibold">
                        {selectedLanguage === "es" ? "Spanish" : 
                         selectedLanguage === "hi" ? "Hindi" : 
                         selectedLanguage === "zh" ? "Mandarin" : "Translated"}:
                      </p>
                      <p>{translatedText || "Translating..."}</p>
                    </div>
                  )}
                </div>
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