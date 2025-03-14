import { z } from 'zod';

// Shared enums for form validation
export const GRADE_LEVELS = ['7_below', '8', '9', '10', '11', '12', 'masters'] as const;
export const CURRICULUM_TYPES = ['IB', 'IGCSE', 'CBSE', 'ICSE', 'State_Boards', 'Others'] as const;
export const ACADEMIC_PERFORMANCES = ['top_5', 'top_10', 'top_25', 'others'] as const;
export const SCHOLARSHIP_REQUIREMENTS = ['good_to_have', 'must_have'] as const;
export const FORM_FILLER_TYPES = ['parent', 'student'] as const;
export const TARGET_UNIVERSITY_RANKS = ['top_20', 'top_50', 'top_100', 'any_good'] as const;

// Masters-specific enums
export const INTAKE_OPTIONS = ['sept_2026', 'jan_2026', 'sept_2025', 'other'] as const;
export const GRADUATION_STATUS_OPTIONS = ['final_year', 'graduated', 'not_eligible'] as const;
export const WORK_EXPERIENCE_OPTIONS = ['0_years', '1_2_years', '3_5_years', '6_plus_years'] as const;
export const ENTRANCE_EXAM_OPTIONS = ['gre', 'gmat', 'planning', 'not_required'] as const;
export const GRADE_FORMAT_OPTIONS = ['gpa', 'percentage'] as const;

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
}

export interface ContactMethods {
  call: boolean;
  callNumber?: string;
  whatsapp: boolean;
  whatsappNumber?: string;
  email: boolean;
  emailAddress?: string;
}

export interface AcademicFormData {
  curriculumType: typeof CURRICULUM_TYPES[number];
  schoolName: string;
  academicPerformance: typeof ACADEMIC_PERFORMANCES[number];
  targetUniversityRank: typeof TARGET_UNIVERSITY_RANKS[number];
  preferredCountries: string[];
  scholarshipRequirement: typeof SCHOLARSHIP_REQUIREMENTS[number];
  contactMethods: ContactMethods;
}

export interface MastersAcademicFormData {
  schoolName: string;
  intake: typeof INTAKE_OPTIONS[number];
  intakeOther?: string;
  graduationStatus: typeof GRADUATION_STATUS_OPTIONS[number];
  graduationYear?: string;
  workExperience: typeof WORK_EXPERIENCE_OPTIONS[number];
  gradeFormat: typeof GRADE_FORMAT_OPTIONS[number];
  gpaValue?: string;
  percentageValue?: string;
  entranceExam: typeof ENTRANCE_EXAM_OPTIONS[number];
  examScore?: string;
  fieldOfStudy: string;
  scholarshipRequirement: typeof SCHOLARSHIP_REQUIREMENTS[number];
  preferredCountries: string[];
  contactMethods: ContactMethods;
}

export interface CounsellingFormData {
  selectedDate?: string;
  selectedSlot?: string;
}

// Combined form data type
export type CompleteFormData = BaseFormData & 
  (AcademicFormData | MastersAcademicFormData) & {
    lead_category?: LeadCategory;
    counselling?: CounsellingFormData;
  };

// Form submission response
export interface FormSubmissionResponse {
  success: boolean;
  error?: string;
  category?: LeadCategory;
}