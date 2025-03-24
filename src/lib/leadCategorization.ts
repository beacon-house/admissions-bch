import { LeadCategory } from '@/types/form';

/**
 * Determines the lead category based on categorization logic
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
  
  // Global override: Full scholarship leads go to NURTURE by default
  if (scholarshipRequirement === 'full_scholarship') {
    return 'NURTURE';
  }
  
  // MASTERS category evaluation
  if (currentGrade === 'masters') {
    // First check if application preparation is "undecided_need_help"
    // If so, route to NURTURE regardless of other criteria
    if (applicationPreparation === 'undecided_need_help') {
      return 'NURTURE';
    }
    
    // Only proceed with masters-l1/masters-l2 evaluation if the user is actually preparing
    if (applicationPreparation === 'researching_now' || applicationPreparation === 'taken_exams_identified_universities') {
      // Logic based on target universities
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
  // Case 1: Grade 9 or 10, parent-filled form, scholarship not required or partial
  if (
    ['9', '10'].includes(currentGrade) &&
    formFillerType === 'parent' &&
    (scholarshipRequirement === 'scholarship_optional' || scholarshipRequirement === 'partial_scholarship')
  ) {
    return 'BCH';
  }

  // Case 2: Grade 11, parent or IB/IGCSE student, scholarship not required or partial, top-20 target
  if (
    currentGrade === '11' &&
    (scholarshipRequirement === 'scholarship_optional' || scholarshipRequirement === 'partial_scholarship') &&
    targetUniversityRank === 'top_20' &&
    (
      formFillerType === 'parent' || 
      (formFillerType === 'student' && ['IB', 'IGCSE'].includes(curriculumType))
    )
  ) {
    return 'BCH';
  }

  // Check for lum-l1 or lum-l2 eligibility based on school year and curriculum
  const isEligibleForLuminaire = (
    ['11', '12'].includes(currentGrade) &&
    (
      formFillerType === 'parent' || 
      (formFillerType === 'student' && ['IB', 'IGCSE'].includes(curriculumType))
    )
  );

  if (isEligibleForLuminaire) {
    // Luminaire Level 1 (lum-l1) - scholarship_optional
    if (scholarshipRequirement === 'scholarship_optional') {
      // For Grade 11, must NOT have top_20 target (those go to BCH)
      if (currentGrade === '11' && targetUniversityRank === 'top_20') {
        // Skip since this would go to BCH (handled above)
      } else {
        return 'lum-l1';
      }
    }
    
    // Luminaire Level 2 (lum-l2) - partial_scholarship
    if (scholarshipRequirement === 'partial_scholarship') {
      return 'lum-l2';
    }
  }

  // Default: NURTURE for all other cases
  return 'NURTURE';
}