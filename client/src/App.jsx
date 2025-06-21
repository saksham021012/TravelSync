import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from './components/Common/NavBar';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import TripPage from './pages/TripPage'


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
        /><Route
          path="/forgot-password"
          element={
            <ForgotPassword />
          }
        /><Route
          path="/verify-email"
          element={
            <VerifyEmail />
          }
        /><Route
          path="/my-profile"
          element={
            <Dashboard />
          }
        /><Route
          path="/my-trips"
          element={
            <TripPage />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
