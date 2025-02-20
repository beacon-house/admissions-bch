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

// Form-specific tracking functions
export const trackFormView = () => trackEvent('form_view');

export const trackFormStepComplete = (step: number) => {
  trackEvent('form_step_complete', { step });
};

export const trackFormAbandonment = (currentStep: number, startTime: number) => {
  trackEvent('form_abandonment', {
    last_step: currentStep,
    time_spent: Math.floor((Date.now() - startTime) / 1000)
  });
};

export const trackFormError = (step: number, error: string) => {
  trackEvent('form_error', { step, error });
};

// Type declarations for gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}