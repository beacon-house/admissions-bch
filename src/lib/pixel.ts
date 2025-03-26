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
  FORM_PAGE2_NEXT_REGULAR: 'admissions_page2_next_regular',
  FORM_PAGE2_NEXT_MASTERS: 'admissions_page2_next_masters',
  FORM_PAGE2_PREVIOUS: 'admissions_page2_previous',
  FORM_PAGE_VIEW: 'admissions_page_view',
  FORM_COMPLETE: 'admissions_form_complete',
  
  // New event prefixes
  PAGE25_VIEW: 'admissions_page25_view_nurture',
  PAGE25_PREVIOUS: 'admissions_page25_previous_nurture',
  PAGE25_PROCEED_SUCCESS: 'admissions_page25_proceed_nurture_success',
  PAGE25_PROCEED_NO_BOOKING: 'admissions_page25_proceed_nurture_no_booking',
  
  PAGE3_VIEW: 'admissions_page3_view',
  PAGE3_DATE_SELECT: 'admissions_page3_date_select',
  PAGE3_TIME_SELECT: 'admissions_page3_time_select',
  PAGE3_SUBMIT: 'admissions_page3_submit',
  
  FLOW_COMPLETE_BCH: 'admissions_flow_complete_bch',
  FLOW_COMPLETE_LUMINAIRE: 'admissions_flow_complete_luminaire',
  FLOW_COMPLETE_MASTERS: 'admissions_flow_complete_masters',
  FLOW_COMPLETE_NURTURE_SUCCESS: 'admissions_flow_complete_nurture_success',
  FLOW_COMPLETE_NURTURE_NO_BOOKING: 'admissions_flow_complete_nurture_no_booking',
  FLOW_COMPLETE_DROP: 'admissions_flow_complete_drop',
  
  FORM_ABANDONMENT: 'admissions_form_abandonment'
} as const;

// Helper function to get environment-specific event name
export const getEventName = (prefix: string, leadCategory?: string): string => {
  const environment = import.meta.env.VITE_ENVIRONMENT?.trim() || 'dev';
  
  // For events that need lead category insertion
  if (leadCategory && prefix.includes('admissions_page3_')) {
    // Replace the generic '_lead_category_' placeholder with actual category
    const basePrefix = prefix.replace('_lead_category_', `_${leadCategory.toLowerCase()}`);
    return `${basePrefix}_${environment}`;
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
  // Keep existing events
  CTA_HEADER: getEventName(EVENT_PREFIXES.CTA_HEADER),
  CTA_HERO: getEventName(EVENT_PREFIXES.CTA_HERO),
  FORM_PAGE1: getEventName(EVENT_PREFIXES.FORM_PAGE1),
  FORM_PAGE2_NEXT_REGULAR: getEventName(EVENT_PREFIXES.FORM_PAGE2_NEXT_REGULAR),
  FORM_PAGE2_NEXT_MASTERS: getEventName(EVENT_PREFIXES.FORM_PAGE2_NEXT_MASTERS),
  FORM_PAGE2_PREVIOUS: getEventName(EVENT_PREFIXES.FORM_PAGE2_PREVIOUS),
  FORM_PAGE_VIEW: getEventName(EVENT_PREFIXES.FORM_PAGE_VIEW),
  FORM_COMPLETE: getEventName(EVENT_PREFIXES.FORM_COMPLETE),
  
  // New Extended Nurture events
  PAGE25_VIEW: getEventName(EVENT_PREFIXES.PAGE25_VIEW),
  PAGE25_PREVIOUS: getEventName(EVENT_PREFIXES.PAGE25_PREVIOUS),
  PAGE25_PROCEED_SUCCESS: getEventName(EVENT_PREFIXES.PAGE25_PROCEED_SUCCESS),
  PAGE25_PROCEED_NO_BOOKING: getEventName(EVENT_PREFIXES.PAGE25_PROCEED_NO_BOOKING),
  
  // New Counselling Form events 
  getPage3ViewEvent: (leadCategory: string) => getEventName(EVENT_PREFIXES.PAGE3_VIEW, leadCategory),
  getPage3DateSelectEvent: (leadCategory: string) => getEventName(EVENT_PREFIXES.PAGE3_DATE_SELECT, leadCategory),
  getPage3TimeSelectEvent: (leadCategory: string) => getEventName(EVENT_PREFIXES.PAGE3_TIME_SELECT, leadCategory),
  getPage3SubmitEvent: (leadCategory: string) => getEventName(EVENT_PREFIXES.PAGE3_SUBMIT, leadCategory),
  
  // New Complete Flow events
  FLOW_COMPLETE_BCH: getEventName(EVENT_PREFIXES.FLOW_COMPLETE_BCH),
  FLOW_COMPLETE_LUMINAIRE: getEventName(EVENT_PREFIXES.FLOW_COMPLETE_LUMINAIRE),
  FLOW_COMPLETE_MASTERS: getEventName(EVENT_PREFIXES.FLOW_COMPLETE_MASTERS),
  FLOW_COMPLETE_NURTURE_SUCCESS: getEventName(EVENT_PREFIXES.FLOW_COMPLETE_NURTURE_SUCCESS),
  FLOW_COMPLETE_NURTURE_NO_BOOKING: getEventName(EVENT_PREFIXES.FLOW_COMPLETE_NURTURE_NO_BOOKING),
  FLOW_COMPLETE_DROP: getEventName(EVENT_PREFIXES.FLOW_COMPLETE_DROP),
  
  // Abandonment events
  FORM_ABANDONMENT_STEP1: getEventName(EVENT_PREFIXES.FORM_ABANDONMENT + '_step1'),
  FORM_ABANDONMENT_STEP2: getEventName(EVENT_PREFIXES.FORM_ABANDONMENT + '_step2'),
  FORM_ABANDONMENT_STEP25: getEventName(EVENT_PREFIXES.FORM_ABANDONMENT + '_step25'),
  FORM_ABANDONMENT_STEP3: getEventName(EVENT_PREFIXES.FORM_ABANDONMENT + '_step3'),
  FORM_ABANDONMENT_EVALUATION: getEventName(EVENT_PREFIXES.FORM_ABANDONMENT + '_evaluation')
} as const;