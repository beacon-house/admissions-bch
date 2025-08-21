/**
 * UTM Parameter Extraction Utility
 * 
 * Purpose: Extracts UTM parameters from the current URL for tracking campaign sources.
 * This helps track where users are coming from (Google Ads, Facebook, email campaigns, etc.)
 * 
 * Changes made:
 * - Created new utility to parse URL query parameters
 * - Extracts standard UTM parameters safely
 * - Returns clean UTMParameters object
 * - Added persistence to localStorage to maintain UTMs across page navigation
 */

export interface UTMParameters {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  utm_id?: string;
}

// localStorage keys for UTM persistence
const UTM_STORAGE_KEY = 'utm_parameters';
const UTM_EXPIRY_KEY = 'utm_expiry';
const UTM_EXPIRY_DAYS = 30;

/**
 * Store UTM parameters in localStorage with expiry
 */
const storeUTMParameters = (utm: UTMParameters): void => {
  try {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + UTM_EXPIRY_DAYS);
    
    localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
    localStorage.setItem(UTM_EXPIRY_KEY, expiryDate.toISOString());
    
    console.log('📊 UTM Parameters stored in localStorage:', utm);
  } catch (error) {
    console.error('Failed to store UTM parameters:', error);
  }
};

/**
 * Retrieve UTM parameters from localStorage if not expired
 */
const getStoredUTMParameters = (): UTMParameters => {
  try {
    const expiryStr = localStorage.getItem(UTM_EXPIRY_KEY);
    if (!expiryStr) {
      return {};
    }
    
    const expiryDate = new Date(expiryStr);
    if (new Date() > expiryDate) {
      // Expired, clear storage
      localStorage.removeItem(UTM_STORAGE_KEY);
      localStorage.removeItem(UTM_EXPIRY_KEY);
      console.log('📊 Stored UTM Parameters expired, cleared from localStorage');
      return {};
    }
    
    const storedUtm = localStorage.getItem(UTM_STORAGE_KEY);
    if (!storedUtm) {
      return {};
    }
    
    const utm = JSON.parse(storedUtm) as UTMParameters;
    console.log('📊 UTM Parameters retrieved from localStorage:', utm);
    return utm;
  } catch (error) {
    console.error('Failed to retrieve UTM parameters from localStorage:', error);
    return {};
  }
};

/**
 * Extract UTM parameters from the current URL
 * @returns UTMParameters object with extracted UTM values
 */
export const getUtmParametersFromUrl = (): UTMParameters => {
  try {
    const params = new URLSearchParams(window.location.search);
    const utm: UTMParameters = {};
    
    // Extract standard UTM parameters from current URL
    if (params.has('utm_source')) utm.utm_source = params.get('utm_source') || undefined;
    if (params.has('utm_medium')) utm.utm_medium = params.get('utm_medium') || undefined;
    if (params.has('utm_campaign')) utm.utm_campaign = params.get('utm_campaign') || undefined;
    if (params.has('utm_term')) utm.utm_term = params.get('utm_term') || undefined;
    if (params.has('utm_content')) utm.utm_content = params.get('utm_content') || undefined;
    if (params.has('utm_id')) utm.utm_id = params.get('utm_id') || undefined;
    
    // Check if we found any UTM parameters in the current URL
    const hasUtmInUrl = Object.keys(utm).length > 0;
    
    if (hasUtmInUrl) {
      // Found UTMs in URL - store them and return
      console.log('📊 UTM Parameters extracted from URL:', utm);
      storeUTMParameters(utm);
      return utm;
    } else {
      // No UTMs in current URL - try to get from localStorage
      const storedUtm = getStoredUTMParameters();
      if (Object.keys(storedUtm).length > 0) {
        console.log('📊 Using stored UTM Parameters:', storedUtm);
        return storedUtm;
      } else {
        console.log('📊 No UTM parameters found in URL or localStorage');
        return {};
      }
    }
  } catch (error) {
    console.error('Error extracting UTM parameters:', error);
    return {};
  }
};

/**
 * Check if any UTM parameters exist in the current URL or localStorage
 * @returns boolean indicating if UTM parameters are present
 */
export const hasUtmParameters = (): boolean => {
  const utm = getUtmParametersFromUrl();
  return Object.keys(utm).length > 0;
};

/**
 * Get a formatted string representation of UTM parameters for logging
 * @param utm UTMParameters object
 * @returns formatted string
 */
export const formatUtmForLogging = (utm: UTMParameters): string => {
  const parts: string[] = [];
  
  if (utm.utm_source) parts.push(`source: ${utm.utm_source}`);
  if (utm.utm_medium) parts.push(`medium: ${utm.utm_medium}`);
  if (utm.utm_campaign) parts.push(`campaign: ${utm.utm_campaign}`);
  if (utm.utm_term) parts.push(`term: ${utm.utm_term}`);
  if (utm.utm_content) parts.push(`content: ${utm.utm_content}`);
  if (utm.utm_id) parts.push(`id: ${utm.utm_id}`);
  
  return parts.length > 0 ? parts.join(', ') : 'No UTM parameters';
};

/**
 * Initialize UTM tracking - extract from URL and store if present
 * Should be called when the app loads
 */
export const initializeUTMTracking = (): UTMParameters => {
  return getUtmParametersFromUrl();
};

/**
 * Get current UTM parameters (from URL or localStorage)
 * Use this for form submissions to ensure UTMs are included
 */
export const getCurrentUTMParameters = (): UTMParameters => {
  return getUtmParametersFromUrl();
};