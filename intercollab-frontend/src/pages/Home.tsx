import React, { useState } from "react";
import axios from "axios";

const Home = () => {
  const [file, setFile] = useState<File | null>(null);
  const [recognizedText, setRecognizedText] = useState("");

  const handleFileUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8000/api/handwriting/recognize", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setRecognizedText(response.data.recognized_text);
    } catch (error) {
      console.error("Error recognizing handwriting:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold">InterCollab - Handwriting Recognition</h1>
      <input
        type="file"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setFile(e.target.files ? e.target.files[0] : null)
        }
        className="my-4"
      />
      <button onClick={handleFileUpload} className="bg-blue-500 text-white px-4 py-2 rounded">
        Recognize Handwriting
      </button>
      {recognizedText && <p className="mt-4 p-2 border">{recognizedText}</p>}
    </div>
  );
};

export default Home;