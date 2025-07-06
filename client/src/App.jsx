import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import NavBar from './components/Common/NavBar';

import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import TripPage from './pages/TripPage';
import ItinerariesPage from './pages/ItinerariesPage';
import AlertsPage from './pages/AlertsPage';
import Profile from './pages/Profile';
import EmergencyPage from './pages/EmergencyPage';

import PrivateRoute from './components/Common/PrivateRoute';
import PublicRoute from './components/Common/PublicRoute';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/signup" element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        } />
        <Route path="/forgot-password" element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        } />
        <Route path="/verify-email" element={
          <PublicRoute>
            <VerifyEmail />
          </PublicRoute>
        } />

        {/* Protected (authenticated-only) routes */}
        <Route path="/my-profile" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/my-trips" element={
          <PrivateRoute>
            <TripPage />
          </PrivateRoute>
        } />
        <Route path="/my-itineraries" element={
          <PrivateRoute>
            <ItinerariesPage />
          </PrivateRoute>
        } />
        <Route path="/my-alerts" element={
          <PrivateRoute>
            <AlertsPage />
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        <Route path="/emergency-services" element={
          <PrivateRoute>
            <EmergencyPage />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
