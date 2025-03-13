import { trackEvent } from './analytics';

// Types
type PixelEvent = {
  name: string;
  options?: Record<string, any>;
};

// Constants
const EVENT_PREFIXES = {
  CTA_HEADER: 'admissions_cta_header',
  CTA_HERO: 'admissions_cta_hero',
  FORM_PAGE1: 'admissions_page1_continue',
  FORM_PAGE2: 'admissions_page2_submit',
} as const;

// Helper function to get environment-specific event name
export const getEventName = (prefix: string): string => {
  const environment = import.meta.env.VITE_ENVIRONMENT?.trim() || 'dev';
  return `${prefix}_${environment}`;
};

// Initialize Meta Pixel
export const initializePixel = (): void => {
  try {
    const pixelId = import.meta.env.VITE_META_PIXEL_ID?.trim();
    if (!pixelId) {
      console.error('Meta Pixel ID not found in environment variables');
      return;
    }

    // Initialize fbq if not already initialized
    if (!window.fbq) {
      console.warn('Meta Pixel not loaded');
      return;
    }

    window.fbq('init', pixelId);
    window.fbq('track', 'PageView');
  } catch (error) {
    console.error('Failed to initialize Meta Pixel:', error);
  }
};

// Track custom event
export const trackPixelEvent = (event: PixelEvent): void => {
  try {
    if (!window.fbq) {
      console.warn('Meta Pixel not loaded, event not tracked:', event.name);
      return;
    }

    window.fbq('track', event.name, event.options);
    
    // Also track in Google Analytics for consistency
    trackEvent(event.name, event.options);
  } catch (error) {
    console.error('Failed to track pixel event:', error);
  }
};

// Export event name constants
export const PIXEL_EVENTS = {
  CTA_HEADER: getEventName(EVENT_PREFIXES.CTA_HEADER),
  CTA_HERO: getEventName(EVENT_PREFIXES.CTA_HERO),
  FORM_PAGE1: getEventName(EVENT_PREFIXES.FORM_PAGE1),
  FORM_PAGE2: getEventName(EVENT_PREFIXES.FORM_PAGE2),
} as const;