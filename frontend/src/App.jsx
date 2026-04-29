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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
