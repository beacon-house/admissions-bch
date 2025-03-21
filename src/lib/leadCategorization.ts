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
 * 4. masters-l1 - High priority masters leads
 * 5. masters-l2 - Medium priority masters leads
 * 6. NURTURE - Default category for all others
 * 7. DROP - Grade 7 or below, form directly submitted after step 1
 */
export const determineLeadCategory = (
  currentGrade: string,
  formFillerType: string,
  scholarshipRequirement: string,
  curriculumType: string,
  targetUniversityRank?: string,
  // Masters-specific fields
  gpaValue?: string,
  percentageValue?: string,
  intake?: string,
  applicationPreparation?: string,
  targetUniversities?: string,
  supportLevel?: string
): LeadCategory => {
  // Special case: Grade 7 or below is directly submitted after step 1 and categorized as DROP
  if (currentGrade === '7_below') {
    return 'DROP';
  }
  
  // Map the new scholarship requirement format to the old one for compatibility
  const mappedScholarshipRequirement = mapScholarshipRequirement(scholarshipRequirement);
  
  // MASTERS category evaluation
  if (currentGrade === 'masters') {
    // First check if application preparation is "undecided_need_help"
    // If so, route to NURTURE regardless of other criteria
    if (applicationPreparation === 'undecided_need_help') {
      return 'NURTURE';
    }
    
    // Only proceed with masters-l1/masters-l2 evaluation if the user is actually preparing
    if (applicationPreparation === 'researching_now' || applicationPreparation === 'taken_exams_identified_universities') {
      // New Logic based on target universities
      if (targetUniversities === 'top_20_50') {
        return 'masters-l1';
      } else if (targetUniversities === 'top_50_100' || targetUniversities === 'partner_university') {
        return 'masters-l2';
      } else if (targetUniversities === 'unsure') {
        return 'NURTURE';
      }
    }
    
    // If masters but doesn't fit l1 or l2 criteria, categorize as NURTURE
    return 'NURTURE';
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