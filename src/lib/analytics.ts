const MEASUREMENT_ID = 'G-ZRF7H5ZFXK';

interface GAEventParams {
  [key: string]: string | number | boolean;
}

export const initializeAnalytics = (): void => {
  try {
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', MEASUREMENT_ID);
  } catch (error) {
    console.error('Failed to initialize Google Analytics:', error);
  }
};

export const trackEvent = (
  eventName: string,
  params?: GAEventParams
): void => {
  try {
    if (window.gtag) {
      window.gtag('event', eventName, params);
    }
  } catch (error) {
    console.error('Failed to track event:', error);
  }
};

// Type declarations for gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}