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
  // Map the new scholarship requirement format to the old one for compatibility
  const mappedScholarshipRequirement = mapScholarshipRequirement(scholarshipRequirement);
  
  // MASTERS category evaluation
  if (currentGrade === 'masters') {
    // Convert GPA and percentage values to numbers for comparison
    const gpaNumber = gpaValue ? parseFloat(gpaValue) : 0;
    const percentageNumber = percentageValue ? parseFloat(percentageValue) : 0;
    
    // Masters Level 1 conditions
    const isMastersL1 = 
      // Academic criteria: GPA > 8.5 OR Percentage > 85%
      ((gpaValue && gpaNumber > 8.5) || (percentageValue && percentageNumber > 85)) &&
      // Scholarship: optional OR partial
      (scholarshipRequirement === 'scholarship_optional' || scholarshipRequirement === 'partial_scholarship') &&
      // Intake: 2026 OR 2027
      (intake === 'aug_sept_2026' || intake === 'jan_2026') &&
      // Application preparation: started research OR taking exams
      (applicationPreparation === 'started_research' || applicationPreparation === 'taking_exams') &&
      // Target universities: top 20-50 OR top 50-100
      (targetUniversities === 'top_20_50' || targetUniversities === 'top_50_100') &&
      // Support level: personalized guidance OR exploring options
      (supportLevel === 'personalized_guidance' || supportLevel === 'exploring_options');
    
    // Masters Level 2 conditions
    const isMastersL2 = 
      // Academic criteria: GPA ≤ 8.5 OR Percentage ≤ 85%
      ((gpaValue && gpaNumber <= 8.5) || (percentageValue && percentageNumber <= 85)) &&
      // Scholarship: optional OR partial
      (scholarshipRequirement === 'scholarship_optional' || scholarshipRequirement === 'partial_scholarship') &&
      // Intake: 2026 only
      (intake === 'aug_sept_2026' || intake === 'jan_2026') &&
      // Application preparation: started research OR taking exams
      (applicationPreparation === 'started_research' || applicationPreparation === 'taking_exams') &&
      // Target universities: top 20-50 OR top 50-100
      (targetUniversities === 'top_20_50' || targetUniversities === 'top_50_100') &&
      // Support level: personalized guidance OR exploring options
      (supportLevel === 'personalized_guidance' || supportLevel === 'exploring_options');
    
    if (isMastersL1) {
      return 'masters-l1';
    } else if (isMastersL2) {
      return 'masters-l2';
    } else {
      // If masters but doesn't fit l1 or l2 criteria, categorize as NURTURE
      return 'NURTURE';
    }
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

  // Default: NURTURE for all other cases, including Grade 7 or below
  return 'NURTURE';
};