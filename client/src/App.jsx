import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="bg-red-500 border">Hello from Tailwind</div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
