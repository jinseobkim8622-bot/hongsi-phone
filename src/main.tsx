import React from 'react';
import ReactDOM from 'react-dom/client';
import { HongsiPhoneProvider } from './context/HongsiPhoneContext';
import { AppContent } from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HongsiPhoneProvider>
      <AppContent />
    </HongsiPhoneProvider>
  </React.StrictMode>
);

