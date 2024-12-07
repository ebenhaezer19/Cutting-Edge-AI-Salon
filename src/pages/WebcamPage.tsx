'use client'

import React from 'react';
import WebcamComponent from '../components/pages/WebcamPage';
import ErrorBoundary from '../components/ErrorBoundary';

const WebcamPage: React.FC = () => {
  return (
    <ErrorBoundary
      fallback={
        <div className="error-container">
          <h2>Terjadi kesalahan pada halaman kamera</h2>
          <p>Mohon muat ulang halaman dan coba lagi</p>
          <button 
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Coba Lagi
          </button>
        </div>
      }
    >
      <WebcamComponent />
    </ErrorBoundary>
  );
};

export default WebcamPage;