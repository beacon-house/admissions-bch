import { trackEvent } from './analytics';

// Types
type PixelEvent = {
  name: string;
  options?: Record<string, any>;
};

// Constants
const EVENT_PREFIXES = {
  // CTA Button Events (2)
  CTA_HEADER: 'admissions_cta_header',
  CTA_HERO: 'admissions_cta_hero',
  
  // Form Navigation Events (5)
  FORM_PAGE_VIEW: 'admissions_page_view',
  FORM_PAGE1: 'admissions_page1_continue',
  FORM_PAGE2_NEXT_REGULAR: 'admissions_page2_next_regular',
  FORM_PAGE2_NEXT_MASTERS: 'admissions_page2_next_masters',
  FORM_COMPLETE: 'admissions_form_complete',
  
  // Counselling Form Event (1)
  PAGE3_VIEW: 'admissions_page3_view',
  PAGE3_SUBMIT: 'admissions_page3_submit',
  
  // Complete Flow Events (3)
  FLOW_COMPLETE_BCH: 'admissions_flow_complete_bch',
  FLOW_COMPLETE_LUMINAIRE: 'admissions_flow_complete_luminaire',
  FLOW_COMPLETE_MASTERS: 'admissions_flow_complete_masters'
} as const;

// Helper function to get environment-specific event name
export const getEventName = (prefix: string, leadCategory?: string): string => {
  const environment = import.meta.env.VITE_ENVIRONMENT?.trim() || 'dev';
  
  // For events that need lead category insertion
  if (leadCategory && (prefix === EVENT_PREFIXES.PAGE3_SUBMIT || prefix === EVENT_PREFIXES.PAGE3_VIEW)) {
    return `${prefix}_${leadCategory.toLowerCase()}_${environment}`;
  }
  
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

// Generate common event properties based on form data
export const getCommonEventProperties = (formData: any): Record<string, any> => {
  return {
    current_grade: formData?.currentGrade || null,
    form_filler_type: formData?.formFillerType || null,
    curriculum_type: formData?.curriculumType || null,
    scholarship_requirement: formData?.scholarshipRequirement || null,
    lead_category: formData?.lead_category || null,
    has_full_scholarship_requirement: formData?.scholarshipRequirement === 'full_scholarship',
    is_international_curriculum: ['IB', 'IGCSE'].includes(formData?.curriculumType)
  };
};

// Export event name constants
export const PIXEL_EVENTS = {
  // CTA Button Events (2)
  CTA_HEADER: getEventName(EVENT_PREFIXES.CTA_HEADER),
  CTA_HERO: getEventName(EVENT_PREFIXES.CTA_HERO),
  
  // Form Navigation Events (5)
  FORM_PAGE_VIEW: getEventName(EVENT_PREFIXES.FORM_PAGE_VIEW),
  FORM_PAGE1: getEventName(EVENT_PREFIXES.FORM_PAGE1),
  FORM_PAGE2_NEXT_REGULAR: getEventName(EVENT_PREFIXES.FORM_PAGE2_NEXT_REGULAR),
  FORM_PAGE2_NEXT_MASTERS: getEventName(EVENT_PREFIXES.FORM_PAGE2_NEXT_MASTERS),
  FORM_COMPLETE: getEventName(EVENT_PREFIXES.FORM_COMPLETE),
  
  // Counselling Form Event (1)
  getPage3ViewEvent: (leadCategory: string) => getEventName(EVENT_PREFIXES.PAGE3_VIEW, leadCategory),
  getPage3SubmitEvent: (leadCategory: string) => getEventName(EVENT_PREFIXES.PAGE3_SUBMIT, leadCategory),
  
  // Complete Flow Events (3)
  FLOW_COMPLETE_BCH: getEventName(EVENT_PREFIXES.FLOW_COMPLETE_BCH),
  FLOW_COMPLETE_LUMINAIRE: getEventName(EVENT_PREFIXES.FLOW_COMPLETE_LUMINAIRE),
  FLOW_COMPLETE_MASTERS: getEventName(EVENT_PREFIXES.FLOW_COMPLETE_MASTERS)
} as const;