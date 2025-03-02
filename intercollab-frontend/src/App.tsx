import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate} from "react-router-dom";
import Whiteboard from "./pages/Whiteboard";

const App = () => {
  return (
    <Router>
      <nav className="p-4 bg-gray-200 flex justify-center space-x-4">
        <Link to="/whiteboard" className="text-blue-500">Whiteboard</Link>
      </nav>
      <Routes>
        <Route path="/whiteboard" element={<Whiteboard />} />
        <Route path="/" element={<Navigate to ="/whiteboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;