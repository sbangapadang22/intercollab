import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Translation from "./pages/Translation";
import Whiteboard from "./pages/Whiteboard"; // <-- New import

const App = () => {
  return (
    <Router>
      <nav className="p-4 bg-gray-200 flex justify-center space-x-4">
        <Link to="/" className="text-blue-500">Home</Link>
        <Link to="/translation" className="text-blue-500">Translation</Link>
        <Link to="/whiteboard" className="text-blue-500">Whiteboard</Link> 
          {/* <-- New link */}
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/translation" element={<Translation />} />
        <Route path="/whiteboard" element={<Whiteboard />} /> {/* <-- New route */}
      </Routes>
    </Router>
  );
};

export default App;
