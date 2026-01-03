/**
 * VAULT DEM Engine — Main Application Component
 * Routes and layout management
 *
 * @vault-feature VAULT-ACC-001 Skip Link (Keyboard Navigation)
 * @vault-feature VAULT-LG-001 Liquid Glass Design System
 * @vault-feature AUTH-001 OAuth 2.0 Authentication with PKCE
 */

import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Liquid Glass Provider and Layout (wraps entire app)
import { LiquidGlassProvider, LiquidGlassLayout } from './components/LiquidGlass';

// Authentication Provider
import { AuthProvider } from './context/AuthContext';

// Layout Components
import Header from './components/UI/Header';
import Footer from './components/UI/Footer';
import ToastContainer from './components/UI/Toast';
import LoadingScreen from './components/UI/LoadingScreen';
import FeedbackWidget from './components/UI/FeedbackWidget';

// Lazy-loaded Pages
const Landing = lazy(() => import('./pages/Landing'));
const Workflow = lazy(() => import('./pages/Workflow'));
const Results = lazy(() => import('./pages/Results'));
const Calculator = lazy(() => import('./pages/Calculator'));
const About = lazy(() => import('./pages/About'));
const Tools = lazy(() => import('./pages/Tools'));
const VBIO = lazy(() => import('./pages/VBIO'));

// Auth Pages
const LoginPanel = lazy(() => import('./components/Auth/LoginPanel'));
const AuthCallback = lazy(() => import('./components/Auth/AuthCallback'));

function App() {
  return (
    <AuthProvider>
      <LiquidGlassProvider>
        <LiquidGlassLayout>
          <div className="min-h-screen flex flex-col">
            {/* Skip link for accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brass focus:text-slate-950"
            >
              Skip to main content
            </a>

            {/* Header */}
            <Header />

            {/* Main Content */}
            <main id="main-content" className="flex-1">
              <Suspense fallback={<LoadingScreen />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<LoginPanel />} />
                  <Route path="/auth/callback/:provider" element={<AuthCallback />} />
                  <Route path="/about" element={<About />} />

                  {/* Claim Workflow (currently public, can be protected later) */}
                  <Route path="/claim/*" element={<Workflow />} />
                  <Route path="/results" element={<Results />} />
                  <Route path="/calculator" element={<Calculator />} />
                  <Route path="/tools" element={<Tools />} />
                  <Route path="/vbio" element={<VBIO />} />

                  {/* 404 fallback */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>

            {/* Footer */}
            <Footer />

            {/* Toast Notifications */}
            <ToastContainer />

            {/* Feedback Widget */}
            <FeedbackWidget />
          </div>
        </LiquidGlassLayout>
      </LiquidGlassProvider>
    </AuthProvider>
  );
}

// 404 Component
function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-serif text-brass mb-4">404</h1>
        <p className="text-slate-400 mb-8">Page not found</p>
        <a href="/" className="btn btn-primary">
          Return Home
        </a>
      </div>
    </div>
  );
}

export default App;