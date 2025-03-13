import { z } from 'zod';

// Shared enums for form validation
export const GRADE_LEVELS = ['7_below', '8', '9', '10', '11', '12', 'masters'] as const;
export const CURRICULUM_TYPES = ['IB', 'IGCSE', 'CBSE', 'ICSE', 'State_Boards', 'Others'] as const;
export const ACADEMIC_PERFORMANCES = ['top_5', 'top_10', 'top_25', 'others'] as const;
export const SCHOLARSHIP_REQUIREMENTS = ['good_to_have', 'must_have'] as const;
export const FORM_FILLER_TYPES = ['parent', 'student'] as const;
export const TARGET_UNIVERSITY_RANKS = ['top_20', 'top_50', 'top_100', 'any_good'] as const;

// Lead Categories
export const LEAD_CATEGORIES = ['BCH', 'lum-l1', 'lum-l2', 'NURTURE', 'MASTERS'] as const;
export type LeadCategory = typeof LEAD_CATEGORIES[number];

// Base form interfaces
export interface FormStep {
  currentStep: number;
  startTime: number;
}

export interface BaseFormData {
  studentFirstName: string;
  studentLastName: string;
  parentName: string;
  email: string;
  phoneNumber: string;
  whatsappConsent: boolean;
  currentGrade: typeof GRADE_LEVELS[number];
  formFillerType: typeof FORM_FILLER_TYPES[number];
  curriculumType: typeof CURRICULUM_TYPES[number]; // Moved from AcademicFormData
}

export interface AcademicFormData {
  schoolName: string;
  academicPerformance: typeof ACADEMIC_PERFORMANCES[number];
  targetUniversityRank: typeof TARGET_UNIVERSITY_RANKS[number];
  preferredCountries: string[];
  scholarshipRequirement: typeof SCHOLARSHIP_REQUIREMENTS[number];
<<<<<<< Updated upstream
  timelineCommitment: typeof TIMELINE_COMMITMENTS[number];
=======
>>>>>>> Stashed changes
}

// Combined form data type
export type CompleteFormData = BaseFormData & AcademicFormData;

// Form submission response
export interface FormSubmissionResponse {
  success: boolean;
  error?: string;
  category?: LeadCategory;
}