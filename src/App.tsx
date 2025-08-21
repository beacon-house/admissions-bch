import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { initializeAnalytics } from './lib/analytics';
import { initializePixel, trackPixelEvent, PIXEL_EVENTS } from './lib/pixel';
import { getUtmParametersFromUrl } from './lib/utm';
import { useFormStore } from './store/formStore';
import LandingPage from './components/LandingPage';
import FormPage from './components/FormPage';
import NotFound from './components/NotFound';

declare global {
  interface Window {
    scrollToForm: () => void;
  }
}

function App() {
  const { setUTMParameters } = useFormStore();
  
  React.useEffect(() => {
    // Initialize Google Analytics
    initializeAnalytics();
    // Initialize Meta Pixel
    initializePixel();
    
    // Extract UTM parameters from current URL
    const utmParams = getUtmParametersFromUrl();
    setUTMParameters(utmParams);
    
    // Track page view
    trackPixelEvent({
      name: 'PageView',
      options: {
        page_title: document.title,
        page_location: window.location.href
      }
    });
  }, [setUTMParameters]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/application-form" element={<FormPage />} />
      <Route path="/questionnaire" element={<Navigate to="/application-form" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;