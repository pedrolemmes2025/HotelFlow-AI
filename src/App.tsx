/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { OnboardingWizard } from './components/auth/OnboardingWizard';
import { Hotel } from './types';

function MainApp() {
  const { user, switchHotel } = useAuth();
  const [currentView, setCurrentView] = useState<'dashboard' | 'landing' | 'login'>('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleOnboardingComplete = (newHotel: Hotel) => {
    setShowOnboarding(false);
    switchHotel(newHotel.id);
    setCurrentView('dashboard');
  };

  // If user is not authenticated, toggle between Landing and Login
  if (!user) {
    if (currentView === 'landing') {
      return (
        <>
          <LandingPage
            onGoToLogin={() => setCurrentView('login')}
            onOpenOnboarding={() => setShowOnboarding(true)}
          />
          {showOnboarding && (
            <OnboardingWizard
              onComplete={handleOnboardingComplete}
              onCancel={() => setShowOnboarding(false)}
            />
          )}
        </>
      );
    }

    return (
      <>
        <LoginPage
          onGoToLanding={() => setCurrentView('landing')}
          onOpenOnboarding={() => setShowOnboarding(true)}
        />
        {showOnboarding && (
          <OnboardingWizard
            onComplete={handleOnboardingComplete}
            onCancel={() => setShowOnboarding(false)}
          />
        )}
      </>
    );
  }

  // If user is logged in but wants to preview landing page
  if (currentView === 'landing') {
    return (
      <div className="relative">
        {/* Floating return to dashboard banner */}
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-2 px-5 py-3 bg-[#0B132B] text-white text-xs font-bold rounded-2xl shadow-2xl border border-slate-700 hover:bg-slate-900 transition-all active:scale-95"
          >
            ← Voltar ao Painel do Hotel
          </button>
        </div>
        <LandingPage
          onGoToLogin={() => setCurrentView('dashboard')}
          onOpenOnboarding={() => setShowOnboarding(true)}
        />
        {showOnboarding && (
          <OnboardingWizard
            onComplete={handleOnboardingComplete}
            onCancel={() => setShowOnboarding(false)}
          />
        )}
      </div>
    );
  }

  // Standard Authenticated Dashboard
  return (
    <>
      <DashboardLayout
        onGoToLanding={() => setCurrentView('landing')}
        onOpenOnboarding={() => setShowOnboarding(true)}
      />
      {showOnboarding && (
        <OnboardingWizard
          onComplete={handleOnboardingComplete}
          onCancel={() => setShowOnboarding(false)}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
