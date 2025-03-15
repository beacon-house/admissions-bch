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
  GRADE_FORMAT_OPTIONS
} from '@/types/form';

// Personal Details Schema
export const personalDetailsSchema = z.object({
  currentGrade: z.enum(GRADE_LEVELS),
  formFillerType: z.enum(FORM_FILLER_TYPES),
  studentFirstName: z.string().min(2, 'First name is required'),
  studentLastName: z.string().min(1, 'Last name is required'),
  parentName: z.string().min(2, 'Parent name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().regex(/^[0-9]{10}$/, 'Invalid phone number'),
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

// Academic Details Schema with communication preferences
export const academicDetailsSchema = z.object({
  curriculumType: z.enum(CURRICULUM_TYPES),
  schoolName: z.string().min(2, 'School name is required'),
  academicPerformance: z.enum(ACADEMIC_PERFORMANCES),
  targetUniversityRank: z.enum(TARGET_UNIVERSITY_RANKS),
  preferredCountries: z.array(z.string()).min(1, 'Please select at least one preferred destination'),
  scholarshipRequirement: z.enum(SCHOLARSHIP_REQUIREMENTS),
  contactMethods: contactMethodsSchema,
});

// Masters Academic Details Schema
export const mastersAcademicDetailsSchema = z.object({
  schoolName: z.string().min(2, 'University name is required'),
  intake: z.enum(INTAKE_OPTIONS),
  intakeOther: z.string().optional(),
  graduationStatus: z.enum(GRADUATION_STATUS_OPTIONS),
  graduationYear: z.string().min(1, 'Graduation year is required').optional().or(z.literal('')),
  workExperience: z.enum(WORK_EXPERIENCE_OPTIONS),
  gradeFormat: z.enum(GRADE_FORMAT_OPTIONS),
  gpaValue: z.string().optional(),
  percentageValue: z.string().optional(),
  entranceExam: z.enum(ENTRANCE_EXAM_OPTIONS),
  examScore: z.string().optional(),
  fieldOfStudy: z.string().min(1, 'Field of study is required'),
  scholarshipRequirement: z.enum(SCHOLARSHIP_REQUIREMENTS),
  preferredCountries: z.array(z.string()).min(1, 'Please select at least one preferred destination'),
  contactMethods: contactMethodsSchema,
}).refine(data => {
  if (data.gradeFormat === 'gpa') {
    return !!data.gpaValue;
  } else if (data.gradeFormat === 'percentage') {
    return !!data.percentageValue;
  }
  return true;
}, {
  message: "Please provide your grade in the selected format",
  path: ['gpaValue'],
});

// Counselling Form Schema
export const counsellingSchema = z.object({
  selectedDate: z.string().optional(),
  selectedSlot: z.string().optional(),
});

// Complete Form Schema
export const completeFormSchema = personalDetailsSchema
  .merge(academicDetailsSchema);