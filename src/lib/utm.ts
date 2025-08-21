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
 */

export interface UTMParameters {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  utm_id?: string;
}

/**
 * Extract UTM parameters from the current URL
 * @returns UTMParameters object with extracted UTM values
 */
export const getUtmParametersFromUrl = (): UTMParameters => {
  const utm: UTMParameters = {};
  
  try {
    const params = new URLSearchParams(window.location.search);
    
    // Extract standard UTM parameters
    if (params.has('utm_source')) utm.utm_source = params.get('utm_source') || undefined;
    if (params.has('utm_medium')) utm.utm_medium = params.get('utm_medium') || undefined;
    if (params.has('utm_campaign')) utm.utm_campaign = params.get('utm_campaign') || undefined;
    if (params.has('utm_term')) utm.utm_term = params.get('utm_term') || undefined;
    if (params.has('utm_content')) utm.utm_content = params.get('utm_content') || undefined;
    if (params.has('utm_id')) utm.utm_id = params.get('utm_id') || undefined;
    
    // Log extracted UTM parameters for debugging
    const hasUtm = Object.keys(utm).length > 0;
    if (hasUtm) {
      console.log('📊 UTM Parameters extracted:', utm);
    } else {
      console.log('📊 No UTM parameters found in URL');
    }
    
    return utm;
  } catch (error) {
    console.error('Error extracting UTM parameters:', error);
    return {};
  }
};

/**
 * Check if any UTM parameters exist in the current URL
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
 * Initialize UTM tracking - extract from URL
 * Should be called when the app loads
 */
export const initializeUTMTracking = (): UTMParameters => {
  return getUtmParametersFromUrl();
};

/**
 * Get current UTM parameters for form submission
 */
export const getCurrentUTMParameters = (): UTMParameters => {
  return getUtmParametersFromUrl();
};