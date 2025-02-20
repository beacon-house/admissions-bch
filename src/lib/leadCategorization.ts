import { LeadCategory } from '@/types/form';

export const determineLeadCategory = (
  currentGrade: string,
  studyAbroadPriority: string,
  scholarshipRequirement: string,
  curriculumType: string
): LeadCategory => {
  // STEP 1: IMMEDIATE CATEGORIZATION RULES
  
  // State Board students always go to Luminaire
  if (curriculumType === 'State_Boards') {
    return 'LUMINAIRE';
  }

  // Masters applicants go to Masters category
  if (currentGrade === 'masters') {
    return 'MASTERS';
  }

  // Grade 7 or below goes to Nurture
  if (currentGrade === '7_below') {
    return 'NURTURE';
  }

  // Grade 12 always goes to Nurture
  if (currentGrade === '12') {
    return 'NURTURE';
  }

  // Grade 11 always goes to Luminaire
  if (currentGrade === '11') {
    return 'LUMINAIRE';
  }

  // STEP 2: GRADES 8-10 EVALUATION
  if (['8', '9', '10'].includes(currentGrade)) {
    // BCH case: Either don't need scholarships OR study abroad is main focus
    if (
      scholarshipRequirement === 'good_to_have' ||
      studyAbroadPriority === 'main_focus'
    ) {
      return 'BCH';
    }

    // Nurture case: Need scholarships AND not fully committed to study abroad
    if (
      scholarshipRequirement === 'must_have' &&
      ['backup_plan', 'still_exploring'].includes(studyAbroadPriority)
    ) {
      return 'NURTURE';
    }
    // Luminaire case: All remaining Grade 8-10 students
    return 'LUMINAIRE';
  }

  // 3. Default fallback
  return 'NURTURE';
};