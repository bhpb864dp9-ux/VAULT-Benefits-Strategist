import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/index.css';

// Register service worker for PWA
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/VAULT-Benefits-Strategist/sw.js')
      .then((registration) => {
        console.log('SW registered:', registration.scope);
      })
      .catch((error) => {
        console.error('SW registration failed:', error);
      });
  });
}

// Render app
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <BrowserRouter basename="/VAULT-Benefits-Strategist">
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}

// Performance monitoring (optional)
if (import.meta.env.DEV) {
  console.log('🔒 VAULT DEM Engine — Development Mode');
  console.log('📦 All data processed client-side only');
}