import React, { useState } from "react";
import axios from "axios";

const Translation = () => {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("es"); // Default to Spanish
  const [translatedText, setTranslatedText] = useState("");

  const handleTranslate = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/translation", {
        text,
        target_language: language,
      });
      setTranslatedText(response.data.translated_text);
    } catch (error) {
      console.error("Error translating text:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold">Text Translation</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border p-2 w-full max-w-md my-2"
        placeholder="Enter text to translate..."
      />
      <select value={language} onChange={(e) => setLanguage(e.target.value)} className="p-2 border">
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="de">German</option>
      </select>
      <button onClick={handleTranslate} className="bg-green-500 text-white px-4 py-2 rounded my-2">
        Translate
      </button>
      {translatedText && <p className="mt-4 p-2 border">{translatedText}</p>}
    </div>
  );
};

export default Translation;
