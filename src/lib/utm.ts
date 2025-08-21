/**
 * UTM Parameter Tracking Utility
 * 
 * Purpose: Handles extraction, storage, and retrieval of UTM parameters from URL
 * for tracking marketing campaign effectiveness through form submissions.
 * 
 * Changes made:
 * - Created utility functions to extract UTM parameters from URL
 * - Added localStorage persistence for UTM parameters across sessions
 * - Included standard UTM parameters plus additional tracking parameters
 */

export interface UTMParameters {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  utm_id?: string;
  gclid?: string; // Google Ads click ID
  fbclid?: string; // Facebook click ID
  msclkid?: string; // Microsoft Ads click ID
  ttclid?: string; // TikTok click ID
  referrer?: string; // Document referrer
  landing_page?: string; // Initial landing page
}

const UTM_STORAGE_KEY = 'beacon_house_utm_params';
const UTM_EXPIRY_KEY = 'beacon_house_utm_expiry';
const UTM_EXPIRY_DAYS = 30; // UTM parameters expire after 30 days

/**
 * Extract UTM parameters from current URL
 */
export const extractUTMParameters = (): UTMParameters => {
  const urlParams = new URLSearchParams(window.location.search);
  const utmParams: UTMParameters = {};

  // Standard UTM parameters
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id'];
  utmKeys.forEach(key => {
    const value = urlParams.get(key);
    if (value) {
      utmParams[key as keyof UTMParameters] = value;
    }
  });

  // Additional tracking parameters
  const additionalKeys = ['gclid', 'fbclid', 'msclkid', 'ttclid'];
  additionalKeys.forEach(key => {
    const value = urlParams.get(key);
    if (value) {
      utmParams[key as keyof UTMParameters] = value;
    }
  });

  // Add referrer information
  if (document.referrer) {
    utmParams.referrer = document.referrer;
  }

  // Add landing page
  utmParams.landing_page = window.location.href;

  return utmParams;
};

/**
 * Store UTM parameters in localStorage with expiry
 */
export const storeUTMParameters = (utmParams: UTMParameters): void => {
  try {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + UTM_EXPIRY_DAYS);
    
    localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utmParams));
    localStorage.setItem(UTM_EXPIRY_KEY, expiryDate.toISOString());
  } catch (error) {
    console.warn('Failed to store UTM parameters:', error);
  }
};

/**
 * Retrieve UTM parameters from localStorage
 */
export const getStoredUTMParameters = (): UTMParameters | null => {
  try {
    const storedParams = localStorage.getItem(UTM_STORAGE_KEY);
    const expiryDate = localStorage.getItem(UTM_EXPIRY_KEY);
    
    if (!storedParams || !expiryDate) {
      return null;
    }
    
    // Check if parameters have expired
    if (new Date() > new Date(expiryDate)) {
      clearStoredUTMParameters();
      return null;
    }
    
    return JSON.parse(storedParams);
  } catch (error) {
    console.warn('Failed to retrieve UTM parameters:', error);
    return null;
  }
};

/**
 * Clear stored UTM parameters
 */
export const clearStoredUTMParameters = (): void => {
  try {
    localStorage.removeItem(UTM_STORAGE_KEY);
    localStorage.removeItem(UTM_EXPIRY_KEY);
  } catch (error) {
    console.warn('Failed to clear UTM parameters:', error);
  }
};

/**
 * Initialize UTM tracking - extract from URL and store
 * Should be called when the app loads
 */
export const initializeUTMTracking = (): UTMParameters => {
  // First, try to get existing stored parameters
  let utmParams = getStoredUTMParameters() || {};
  
  // Extract current URL parameters
  const currentUTMParams = extractUTMParameters();
  
  // If we have new UTM parameters in the URL, they take precedence
  const hasNewUTMParams = Object.keys(currentUTMParams).some(key => 
    key.startsWith('utm_') || ['gclid', 'fbclid', 'msclkid', 'ttclid'].includes(key)
  );
  
  if (hasNewUTMParams) {
    // Merge with existing parameters, giving priority to new ones
    utmParams = { ...utmParams, ...currentUTMParams };
    storeUTMParameters(utmParams);
  } else if (Object.keys(utmParams).length === 0) {
    // If no stored parameters and no URL parameters, still capture referrer and landing page
    utmParams = currentUTMParams;
    if (Object.keys(utmParams).length > 0) {
      storeUTMParameters(utmParams);
    }
  }
  
  return utmParams;
};

/**
 * Get current UTM parameters for form submission
 */
export const getCurrentUTMParameters = (): UTMParameters => {
  return getStoredUTMParameters() || {};
};