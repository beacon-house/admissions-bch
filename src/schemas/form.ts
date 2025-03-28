import { z } from 'zod';
import {
  GRADE_LEVELS,
  CURRICULUM_TYPES,
  ACADEMIC_PERFORMANCES,
  SCHOLARSHIP_REQUIREMENTS,
  FORM_FILLER_TYPES,
  TARGET_UNIVERSITY_RANKS,
  INTAKE_OPTIONS,
  GRADUATION_STATUS_OPTIONS,
  WORK_EXPERIENCE_OPTIONS,
  ENTRANCE_EXAM_OPTIONS,
  GRADE_FORMAT_OPTIONS,
  APPLICATION_PREPARATION_OPTIONS,
  TARGET_UNIVERSITIES_OPTIONS,
  SUPPORT_LEVEL_OPTIONS,
  PARENTAL_SUPPORT_OPTIONS,
  PARTIAL_FUNDING_APPROACH_OPTIONS,
  FINANCIAL_PLANNING_OPTIONS
} from '@/types/form';

// Personal Details Schema
export const personalDetailsSchema = z.object({
  currentGrade: z.enum(GRADE_LEVELS, { errorMap: () => ({ message: "Please answer this question" }) }),
  formFillerType: z.enum(FORM_FILLER_TYPES, { errorMap: () => ({ message: "Please answer this question" }) }),
  studentFirstName: z.string().min(2, "Please answer this question"),
  studentLastName: z.string().min(1, "Please answer this question"),
  parentName: z.string().min(2, "Please answer this question"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().regex(/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"),
  whatsappConsent: z.boolean().default(true)
});

// Common contact methods schema
const contactMethodsSchema = z.object({
  call: z.boolean().default(false),
  callNumber: z.string().optional(),
  whatsapp: z.boolean().default(true), // Changed to default true
  whatsappNumber: z.string().optional(),
  email: z.boolean().default(true),
  emailAddress: z.string().email().optional(),
}).refine(data => data.call || data.whatsapp || data.email, {
  message: "Please select at least one contact method",
  path: ['contact']
});

// Grade format schema - used by both forms
const gradeFormatSchema = z.object({
  gradeFormat: z.enum(GRADE_FORMAT_OPTIONS, { errorMap: () => ({ message: "Please answer this question" }) }),
  gpaValue: z.string().optional(),
  percentageValue: z.string().optional(),
});

// We need to apply custom validation separately to avoid shape.merge issues
export const validateGradeFormat = (data: any, ctx?: z.RefinementCtx) => {
  if (data.gradeFormat === 'gpa') {
    if (!data.gpaValue || data.gpaValue.trim() === '') {
      return { 
        success: false, 
        error: { gpaValue: ["Please answer this question"] }
      };
    } else {
      const gpaValue = parseFloat(data.gpaValue);
      if (isNaN(gpaValue) || gpaValue < 1 || gpaValue > 10) {
        return { 
          success: false, 
          error: { gpaValue: ["Please enter a value between 1 and 10"] }
        };
      }
    }
  } else if (data.gradeFormat === 'percentage') {
    if (!data.percentageValue || data.percentageValue.trim() === '') {
      return { 
        success: false, 
        error: { percentageValue: ["Please answer this question"] }
      };
    } else {
      const percentageValue = parseFloat(data.percentageValue);
      if (isNaN(percentageValue) || percentageValue < 1 || percentageValue > 100) {
        return { 
          success: false, 
          error: { percentageValue: ["Please enter a value between 1 and 100"] }
        };
      }
    }
  }
  return { success: true };
};

// Academic Details Schema with communication preferences
export const academicDetailsSchema = z.object({
  curriculumType: z.enum(CURRICULUM_TYPES, { errorMap: () => ({ message: "Please answer this question" }) }),
  schoolName: z.string().min(2, "Please answer this question"),
  targetUniversityRank: z.enum(TARGET_UNIVERSITY_RANKS, { errorMap: () => ({ message: "Please answer this question" }) }),
  preferredCountries: z.array(z.string()).min(1, "Please answer this question"),
  scholarshipRequirement: z.enum(SCHOLARSHIP_REQUIREMENTS, { errorMap: () => ({ message: "Please answer this question" }) }),
  contactMethods: contactMethodsSchema,
  gradeFormat: z.enum(GRADE_FORMAT_OPTIONS, { errorMap: () => ({ message: "Please answer this question" }) }),
  gpaValue: z.string().optional(),
  percentageValue: z.string().optional(),
}).refine((data) => {
  const result = validateGradeFormat(data);
  return result.success;
}, {
  message: "Please answer this question",
  path: ['gradeFormat']
});

// Masters Academic Details Schema
export const mastersAcademicDetailsSchema = z.object({
  schoolName: z.string().min(2, "Please answer this question"),
  intake: z.enum(INTAKE_OPTIONS, { errorMap: () => ({ message: "Please answer this question" }) }),
  intakeOther: z.string().optional(),
  graduationStatus: z.enum(GRADUATION_STATUS_OPTIONS, { errorMap: () => ({ message: "Please answer this question" }) }),
  graduationYear: z.string().min(1, "Please answer this question").optional().or(z.literal('')),
  workExperience: z.enum(WORK_EXPERIENCE_OPTIONS, { errorMap: () => ({ message: "Please answer this question" }) }),
  entranceExam: z.enum(ENTRANCE_EXAM_OPTIONS, { errorMap: () => ({ message: "Please answer this question" }) }),
  examScore: z.string().optional(),
  fieldOfStudy: z.string().min(1, "Please answer this question"),
  applicationPreparation: z.enum(APPLICATION_PREPARATION_OPTIONS, { errorMap: () => ({ message: "Please answer this question" }) }),
  targetUniversities: z.enum(TARGET_UNIVERSITIES_OPTIONS, { errorMap: () => ({ message: "Please answer this question" }) }),
  supportLevel: z.enum(SUPPORT_LEVEL_OPTIONS, { errorMap: () => ({ message: "Please answer this question" }) }),
  scholarshipRequirement: z.enum(SCHOLARSHIP_REQUIREMENTS, { errorMap: () => ({ message: "Please answer this question" }) }),
  contactMethods: contactMethodsSchema,
  gradeFormat: z.enum(GRADE_FORMAT_OPTIONS, { errorMap: () => ({ message: "Please answer this question" }) }),
  gpaValue: z.string().optional(),
  percentageValue: z.string().optional(),
}).refine((data) => {
  const result = validateGradeFormat(data);
  return result.success;
}, {
  message: "Please answer this question",
  path: ['gradeFormat']
});

// Extended Nurture Form Schema - Student
export const extendedNurtureStudentSchema = z.object({
  parentalSupport: z.enum(PARENTAL_SUPPORT_OPTIONS, { errorMap: () => ({ message: "Please answer this question" }) }),
  partialFundingApproach: z.enum(PARTIAL_FUNDING_APPROACH_OPTIONS, { errorMap: () => ({ message: "Please answer this question" }) }),
  strongProfileIntent: z.string({ errorMap: () => ({ message: "Please answer this question" }) })
});

// Extended Nurture Form Schema - Parent
export const extendedNurtureParentSchema = z.object({
  partialFundingApproach: z.enum(FINANCIAL_PLANNING_OPTIONS, { errorMap: () => ({ message: "Please answer this question" }) }),
  strongProfileIntent: z.string({ errorMap: () => ({ message: "Please answer this question" }) })
});

// Combined Extended Nurture Form Schema
export const extendedNurtureSchema = z.union([
  extendedNurtureStudentSchema,
  extendedNurtureParentSchema
]);

// Counselling Form Schema
export const counsellingSchema = z.object({
  selectedDate: z.string().optional(),
  selectedSlot: z.string().optional(),
});

// Complete Form Schema
export const completeFormSchema = personalDetailsSchema.extend({
  // Additional fields from academicDetailsSchema would be added if needed
});