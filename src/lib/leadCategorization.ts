import { LeadCategory } from '@/types/form';

/**
 * Maps the new scholarship requirement values to the old ones for categorization logic
 */
const mapScholarshipRequirement = (scholarshipRequirement: string): 'must_have' | 'good_to_have' => {
  if (scholarshipRequirement === 'full_scholarship') {
    return 'must_have';
  } else {
    // Both 'partial_scholarship' and 'scholarship_optional' map to 'good_to_have'
    return 'good_to_have';
  }
};

/**
 * Determines the lead category based on updated categorization logic
 * 
 * Categories:
 * 1. BCH - High priority leads
 * 2. lum-l1 - Medium-high priority luminaire leads
 * 3. lum-l2 - Medium priority luminaire leads
 * 4. MASTERS - Master's program applicants
 * 5. NURTURE - Default category for all others
 */
export const determineLeadCategory = (
  currentGrade: string,
  formFillerType: string,
  scholarshipRequirement: string,
  curriculumType: string,
  targetUniversityRank?: string
): LeadCategory => {
  // Map the new scholarship requirement format to the old one for compatibility
  const mappedScholarshipRequirement = mapScholarshipRequirement(scholarshipRequirement);
  
  // MASTERS category - Always takes precedence
  if (currentGrade === 'masters') {
    return 'MASTERS';
  }

  // BCH category
  // Case 1: Grade 9 or 10, parent-filled form, good-to-have scholarship
  if (
    ['9', '10'].includes(currentGrade) &&
    formFillerType === 'parent' &&
    mappedScholarshipRequirement === 'good_to_have'
  ) {
    return 'BCH';
  }

  // Case 2: Grade 11, good-to-have scholarship, top-20 target
  if (
    currentGrade === '11' &&
    mappedScholarshipRequirement === 'good_to_have' &&
    targetUniversityRank === 'top_20' &&
    (
      formFillerType === 'parent' || 
      (formFillerType === 'student' && ['IB', 'IGCSE'].includes(curriculumType))
    )
  ) {
    return 'BCH';
  }

  // Luminaire Level 1 (lum-l1)
  // Case 1: Grade 11, good-to-have scholarship, not top-20 target
  if (
    currentGrade === '11' &&
    mappedScholarshipRequirement === 'good_to_have' &&
    targetUniversityRank !== 'top_20' &&
    (
      formFillerType === 'parent' || 
      (formFillerType === 'student' && ['IB', 'IGCSE'].includes(curriculumType))
    )
  ) {
    return 'lum-l1';
  }

  // Case 2: Grade 12, good-to-have scholarship
  if (
    currentGrade === '12' &&
    mappedScholarshipRequirement === 'good_to_have' &&
    (
      formFillerType === 'parent' || 
      (formFillerType === 'student' && ['IB', 'IGCSE'].includes(curriculumType))
    )
  ) {
    return 'lum-l1';
  }

  // Luminaire Level 2 (lum-l2)
  // Case 1: Grade 11 or 12, parent-filled form, must-have scholarship
  if (
    ['11', '12'].includes(currentGrade) &&
    formFillerType === 'parent' &&
    mappedScholarshipRequirement === 'must_have'
  ) {
    return 'lum-l2';
  }

  // Case 2: Grade 11 or 12, student-filled form with IB/IGCSE, any scholarship requirement
  if (
    ['11', '12'].includes(currentGrade) &&
    formFillerType === 'student' &&
    ['IB', 'IGCSE'].includes(curriculumType)
  ) {
    return 'lum-l2';
  }

  // Default: NURTURE for all other cases
  return 'NURTURE';
};