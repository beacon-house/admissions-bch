import React from 'react';
import { Routes } from 'react-router-dom';
import { Header } from './components/Header';
import LandingPage from './components/LandingPage';
import { initializeAnalytics } from './lib/analytics';
import { initializePixel, trackPixelEvent, PIXEL_EVENTS } from './lib/pixel';

declare global {
  interface Window {
    scrollToForm: () => void;
  }
}

function App() {
  const handleEvaluation = () => {
    trackPixelEvent({
      name: PIXEL_EVENTS.CTA_HEADER,
      options: { button: 'header_request_evaluation' }
    });
    window.scrollToForm?.();
  };

  React.useEffect(() => {
    // Initialize Google Analytics
    initializeAnalytics();
    // Initialize Meta Pixel
    initializePixel();
    
    // Track page view
    trackPixelEvent({
      name: 'PageView',
      options: {
      page_title: document.title,
      page_location: window.location.href
      }
    });
  }, []);

  return (
    <>
      <Header onEvaluation={handleEvaluation} />
      <LandingPage />
    </>
  );
}

export default App;