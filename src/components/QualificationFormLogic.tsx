import { trackEvent } from '@/lib/analytics';

export const determineLeadCategory = (
  currentGrade: string,
  studyAbroadPriority: string,
  scholarshipRequirement: string,
  curriculumType: string
): string => {
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

  const webhookUrl = import.meta.env.VITE_REGISTRATION_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error('Webhook URL not configured');
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...data,
      source: 'website_MMYYYY',
      completion_status: 'partial',
      current_step: 1,
      total_time_spent: step1CompletionTime,
      step1_completion_time: step1CompletionTime,
      lead_category: data.currentGrade === 'masters' ? 'MASTERS' : 'NURTURE',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to submit form');
  }

  trackEvent('form_submission', { 
    status: 'success',
    type: data.currentGrade === 'masters' ? 'MASTERS' : 'EARLY_YEARS',
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

  const webhookUrl = import.meta.env.VITE_REGISTRATION_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error('Webhook URL not configured');
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...finalData,
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
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to submit form');
  }

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