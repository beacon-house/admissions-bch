/**
 * Meta Pixel Event Tracking Library
 * 
 * Purpose: Handles Meta Pixel initialization and custom event tracking with environment-specific naming.
 * All event names include an environment suffix for proper tracking across different environments.
 * 
 * Changes made:
 * - Added QUALIFIED_LEAD_RECEIVED event to track qualified leads (bch, lum-l1, lum-l2)
 */

import { trackEvent } from './analytics';
import { useFormStore } from '@/store/formStore';

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
  PARENT_FORM_PAGE1: 'parent_admissions_page1_continue',
  FORM_PAGE2_NEXT_REGULAR: 'admissions_page2_next_regular',
  FORM_PAGE2_NEXT_MASTERS: 'admissions_page2_next_masters',
  FORM_COMPLETE: 'admissions_form_complete',
  
  // Lead Qualification Event (1)
  QUALIFIED_LEAD_RECEIVED: 'admissions_qualified_lead_received',
  
  // Counselling Form Event (1)
  PAGE3_VIEW: 'admissions_page3_view',
  PAGE3_SUBMIT: 'admissions_page3_submit',
  
  // Complete Flow Events (3)
  FLOW_COMPLETE_BCH: 'admissions_flow_complete_bch',
  FLOW_COMPLETE_LUMINAIRE: 'admissions_flow_complete_luminaire',
  FLOW_COMPLETE_MASTERS: 'admissions_flow_complete_masters',
  
  // New Custom Events (4)
  STUDENT_LEAD: 'admissions_student_lead',
  SPAMMY_PARENT: 'admissions_spammy_parent',
  MASTERS_LEAD: 'admissions_masters_lead',
  STATEBOARD_PARENT: 'admissions_stateboard_parent'
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
    
    // Add the triggered event to the form store
    try {
      const { addTriggeredEvent } = useFormStore.getState();
      addTriggeredEvent(event.name);
    } catch (error) {
      // Silently handle if store is not available (e.g., on landing page)
      console.debug('Form store not available for event tracking:', event.name);
    }
    
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
  PARENT_FORM_PAGE1: getEventName(EVENT_PREFIXES.PARENT_FORM_PAGE1),
  FORM_PAGE2_NEXT_REGULAR: getEventName(EVENT_PREFIXES.FORM_PAGE2_NEXT_REGULAR),
  FORM_PAGE2_NEXT_MASTERS: getEventName(EVENT_PREFIXES.FORM_PAGE2_NEXT_MASTERS),
  FORM_COMPLETE: getEventName(EVENT_PREFIXES.FORM_COMPLETE),
  
  // Lead Qualification Event (1)
  QUALIFIED_LEAD_RECEIVED: getEventName(EVENT_PREFIXES.QUALIFIED_LEAD_RECEIVED),
  
  // Counselling Form Event (1)
  getPage3ViewEvent: (leadCategory: string) => getEventName(EVENT_PREFIXES.PAGE3_VIEW, leadCategory),
  getPage3SubmitEvent: (leadCategory: string) => getEventName(EVENT_PREFIXES.PAGE3_SUBMIT, leadCategory),
  
  // Complete Flow Events (3)
  FLOW_COMPLETE_BCH: getEventName(EVENT_PREFIXES.FLOW_COMPLETE_BCH),
  FLOW_COMPLETE_LUMINAIRE: getEventName(EVENT_PREFIXES.FLOW_COMPLETE_LUMINAIRE),
  FLOW_COMPLETE_MASTERS: getEventName(EVENT_PREFIXES.FLOW_COMPLETE_MASTERS),
  
  // New Custom Events (4)
  STUDENT_LEAD: getEventName(EVENT_PREFIXES.STUDENT_LEAD),
  SPAMMY_PARENT: getEventName(EVENT_PREFIXES.SPAMMY_PARENT),
  MASTERS_LEAD: getEventName(EVENT_PREFIXES.MASTERS_LEAD),
  STATEBOARD_PARENT: getEventName(EVENT_PREFIXES.STATEBOARD_PARENT)
} as const;