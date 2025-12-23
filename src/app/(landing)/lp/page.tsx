'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// Critical path - load immediately
import HeroSection from './components/Hero/HeroSection';

// Auth Modals - Import immediately
import LoginModal from './components/Auth/LoginModal';
import RegisterModal from './components/Auth/RegisterModal';
import ForgotPasswordModal from './components/Auth/ForgotPasswordModal';

// Lazy load with optimized loading states
const BenefitsSection = dynamic(() => import('./components/Benefits/BenefitsSection'), {
  loading: () => (
    <div className="w-full bg-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-8 bg-gray-200 rounded-lg w-64 mx-auto mb-12 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-gray-100 rounded-xl h-64 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  ),
});

const FeaturesSection = dynamic(() => import('./components/Features/FeaturesSection'), {
  loading: () => (
    <div className="w-full bg-gray-50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-8 bg-gray-200 rounded-lg w-64 mx-auto mb-12 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white rounded-xl h-80 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  ),
});

const TestimonialsSection = dynamic(() => import('./components/Testimonials/TestimonialsSection'), {
  loading: () => (
    <div className="w-full bg-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-8 bg-gray-200 rounded-lg w-64 mx-auto mb-12 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="bg-gray-100 rounded-xl h-72 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  ),
});

const PricingSection = dynamic(() => import('./components/Pricing/PricingSection'), {
  loading: () => (
    <div className="w-full bg-gray-50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-8 bg-gray-200 rounded-lg w-64 mx-auto mb-12 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-xl h-96 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  ),
});

const FAQSection = dynamic(() => import('./components/FAQ/FAQSection'), {
  loading: () => (
    <div className="w-full bg-white py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-8 bg-gray-200 rounded-lg w-64 mx-auto mb-12 animate-pulse" />
        <div className="space-y-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-gray-100 rounded-xl h-20 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  ),
});

const Footer = dynamic(() => import('./components/Footer/Footer'), {
  loading: () => <div className="w-full h-64 bg-gray-900 animate-pulse" />,
});

export default function LandingPage() {
  // Modal state management - Single source of truth
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  // Modal handlers
  const openLogin = () => {
    setIsRegisterOpen(false);
    setIsForgotPasswordOpen(false);
    setIsLoginOpen(true);
  };

  const openRegister = () => {
    setIsLoginOpen(false);
    setIsForgotPasswordOpen(false);
    setIsRegisterOpen(true);
  };

  const openForgotPassword = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
    setIsForgotPasswordOpen(true);
  };

  const closeAllModals = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
    setIsForgotPasswordOpen(false);
  };

  return (
    <main className="w-full min-h-screen bg-white antialiased">
      
      {/* Hero - Critical path, loads immediately with auth callbacks */}
      <HeroSection 
        onLoginClick={openLogin}
        onRegisterClick={openRegister}
      />

      {/* Below-fold sections - Lazy loaded with proper loading states */}
      <BenefitsSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <Footer />

      {/* Auth Modals - Rendered at bottom, hidden by default */}
      <LoginModal 
        isOpen={isLoginOpen}
        onClose={closeAllModals}
        onRegisterClick={openRegister}
        onForgotPasswordClick={openForgotPassword}
      />

      <RegisterModal 
        isOpen={isRegisterOpen}
        onClose={closeAllModals}
        onLoginClick={openLogin}
      />

      <ForgotPasswordModal 
        isOpen={isForgotPasswordOpen}
        onClose={closeAllModals}
        onBackToLoginClick={openLogin}
      />

    </main>
  );
}