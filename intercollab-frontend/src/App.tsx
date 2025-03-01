import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Translation from "./pages/Translation";

const App = () => {
  return (
    <Router>
      <nav className="p-4 bg-gray-200 flex justify-center space-x-4">
        <Link to="/" className="text-blue-500">Home</Link>
        <Link to="/translation" className="text-blue-500">Translation</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/translation" element={<Translation />} />
      </Routes>
    </Router>
  );
};

export default App;
