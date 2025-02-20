import { supabase } from '@/lib/supabase';
import { trackEvent } from '@/lib/analytics';

export const determineLeadCategory = (
  currentGrade: string,
  studyAbroadPriority: string,
  scholarshipRequirement: string,
  curriculumType: string
): 'bch' | 'luminaire' | 'nurture' | 'masters' => {
  // STEP 1: IMMEDIATE CATEGORIZATION RULES
  
  // State Board students always go to Luminaire
  if (curriculumType === 'State_Boards') {
    return 'luminaire';
  }

  // Masters applicants go to Masters category
  if (currentGrade === 'masters') {
    return 'masters';
  }

  // Grade 7 or below goes to Nurture
  if (currentGrade === '7_below') {
    return 'nurture';
  }

  // Grade 12 always goes to Nurture
  if (currentGrade === '12') {
    return 'nurture';
  }

  // Grade 11 always goes to Luminaire
  if (currentGrade === '11') {
    return 'luminaire';
  }

  // STEP 2: GRADES 8-10 EVALUATION
  if (['8', '9', '10'].includes(currentGrade)) {
    // BCH case: Either don't need scholarships OR study abroad is main focus
    if (
      scholarshipRequirement === 'good_to_have' ||
      studyAbroadPriority === 'main_focus'
    ) {
      return 'bch';
    }

    // Nurture case: Need scholarships AND not fully committed to study abroad
    if (
      scholarshipRequirement === 'must_have' &&
      ['backup_plan', 'still_exploring'].includes(studyAbroadPriority)
    ) {
      return 'nurture';
    }
    // Luminaire case: All remaining Grade 8-10 students
    return 'luminaire';
  }

  // 3. Default fallback
  return 'nurture';
};

export const submitPartialForm = async (
  data: {
    studentFirstName: string;
    studentLastName: string;
    parentName: string;
    email: string;
    phoneNumber: string;
    whatsappConsent: boolean;
    currentGrade: string;
  },
  startTime: number
) => {
  const step1CompletionTime = Math.floor((Date.now() - startTime) / 1000);
  
  const { error: leadError } = await supabase
    .from('beacon_house_leads')
    .insert({
      student_first_name: data.studentFirstName,
      student_last_name: data.studentLastName,
      parent_name: data.parentName,
      email: data.email,
      phone_number: data.phoneNumber,
      whatsapp_consent: data.whatsappConsent,
      current_grade: data.currentGrade,
      source: 'website_MMYYYY',
      completion_status: 'partial',
      current_step: 1,
      total_time_spent: step1CompletionTime,
      step1_completion_time: step1CompletionTime,
      lead_category: data.currentGrade === 'masters' ? 'masters' : 'nurture',
    })
    .single();

  if (leadError) throw leadError;

  trackEvent('form_submission', { 
    status: 'success',
    type: data.currentGrade === 'masters' ? 'masters' : 'early_years',
    completion_time: step1CompletionTime
  });
};

export const submitCompleteForm = async (
  finalData: {
    studentFirstName: string;
    studentLastName: string;
    formFillerType: string;
    parentName: string;
    email: string;
    phoneNumber: string;
    whatsappConsent: boolean;
    currentGrade: string;
    schoolName: string;
    curriculumType: string;
    academicPerformance: string;
    studyAbroadPriority: string;
    preferredCountries: string[];
    targetUniversityRank: string;
    scholarshipRequirement: string;
    timelineCommitment: string;
  },
  startTime: number
) => {
  const step3CompletionTime = Math.floor((Date.now() - startTime) / 1000);
  const step1CompletionTime = Math.floor((Date.now() - startTime) / 1000);

  const { data: lead, error: leadError } = await supabase
    .from('beacon_house_leads')
    .insert({
      student_first_name: finalData.studentFirstName,
      student_last_name: finalData.studentLastName,
      parent_name: finalData.parentName,
      form_filler_type: finalData.formFillerType,
      email: finalData.email,
      phone_number: finalData.phoneNumber,
      whatsapp_consent: finalData.whatsappConsent,
      current_grade: finalData.currentGrade,
      school_name: finalData.schoolName,
      curriculum_type: finalData.curriculumType,
      academic_performance: finalData.academicPerformance,
      study_abroad_priority: finalData.studyAbroadPriority,
      preferred_countries: finalData.preferredCountries,
      target_university_rank: finalData.targetUniversityRank,
      scholarship_requirement: finalData.scholarshipRequirement,
      timeline_commitment: finalData.timelineCommitment,
      source: 'website_MMYYYY',
      completion_status: 'complete',
      current_step: 3,
      total_time_spent: step3CompletionTime,
      step1_completion_time: step1CompletionTime,
      step2_completion_time: Math.floor(step3CompletionTime * 0.4), // Approximate
      step3_completion_time: Math.floor(step3CompletionTime * 0.6), // Approximate
      lead_category: determineLeadCategory(
        finalData.currentGrade,
        finalData.studyAbroadPriority,
        finalData.scholarshipRequirement,
        finalData.curriculumType
      ),
    })
    .select('lead_id')
    .single();

  if (leadError) throw leadError;

  trackEvent('form_submission', {
    status: 'success',
    completion_time: step3CompletionTime,
    lead_category: determineLeadCategory(
      finalData.currentGrade,
      finalData.studyAbroadPriority,
      finalData.scholarshipRequirement,
      finalData.curriculumType
    )
  });

  return lead;
};

export const trackFormView = () => {
  trackEvent('form_view');
};

export const trackFormStepComplete = (step: number) => {
  trackEvent('form_step_complete', { step });
};

export const trackFormAbandonment = (currentStep: number, startTime: number) => {
  trackEvent('form_abandonment', {
    last_step: currentStep,
    time_spent: Math.floor((Date.now() - startTime) / 1000)
  });
};

export const trackFormError = (step: number, error: string) => {
  trackEvent('form_error', {
    step,
    error
  });
};