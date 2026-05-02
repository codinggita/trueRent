import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Trust from './components/Trust';
import CTA from './components/CTA';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import MyListings from './pages/MyListings';
import AddProperty from './pages/AddProperty';
import FraudReports from './pages/FraudReports';
import Profile from './pages/Profile';
import TenantDashboard from './pages/TenantDashboard';
import PropertyDetails from './pages/PropertyDetails';
import PrivateRoute from './components/PrivateRoute';
import { Toaster } from 'react-hot-toast';

function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-900 overflow-hidden relative">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-accent-blue/5 blur-[150px] -z-10 rounded-full mix-blend-screen pointer-events-none transform -translate-y-1/2"></div>
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] -z-10 rounded-full mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-accent-purple/10 blur-[120px] -z-10 rounded-full mix-blend-screen pointer-events-none"></div>
      
      <Navbar />
      
      <main className="relative z-10 pt-24">
        <Hero />
        <Features />
        <HowItWorks />
        <Trust />
        <CTA />
      </main>
      
      <Footer />
    </div>
  );
}

import { DashboardProvider } from './context/DashboardContext';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <DashboardProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/tenant-dashboard" 
            element={
              <PrivateRoute>
                <TenantDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/add-property" 
            element={
              <PrivateRoute>
                <AddProperty />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/my-listings" 
            element={
              <PrivateRoute>
                <MyListings />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/fraud-reports" 
            element={
              <PrivateRoute>
                <FraudReports />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/property/:id" 
            element={
              <PrivateRoute>
                <PropertyDetails />
              </PrivateRoute>
            } 
          />
        </Routes>
      </DashboardProvider>
    </BrowserRouter>
  );
}

export default App;
