import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from './components/Common/NavBar';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';


function App() {
  return (
    <Router>
      <NavBar/>
      <Routes>
        <Route
          path="/"
          element={
            <Home />
          }
        />
        <Route
          path="/login"
          element={
            <Login />
          }
        /><Route
          path="/signup"
          element={
            <SignUp />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
