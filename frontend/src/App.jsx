import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Trust from './components/Trust';
import CTA from './components/CTA';
import Footer from './components/Footer';

// Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import Dashboard from './pages/Dashboard';

const LandingPage = () => (
  <>
    <main className="relative z-10 pt-24">
      <Hero />
      <Features />
      <HowItWorks />
      <Trust />
      <CTA />
    </main>
    <Footer />
  </>
);

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-dark-900 overflow-hidden relative">
        {/* Background ambient lighting */}
        <div className="absolute top-0 left-0 w-full h-[600px] bg-accent-blue/5 blur-[150px] -z-10 rounded-full mix-blend-screen pointer-events-none transform -translate-y-1/2"></div>
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] -z-10 rounded-full mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-accent-purple/10 blur-[120px] -z-10 rounded-full mix-blend-screen pointer-events-none"></div>
        
        <Navbar />
        
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
