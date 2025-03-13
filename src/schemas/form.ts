import { z } from 'zod';
import {
  GRADE_LEVELS,
  CURRICULUM_TYPES,
  ACADEMIC_PERFORMANCES,
  SCHOLARSHIP_REQUIREMENTS,
  FORM_FILLER_TYPES,
  TARGET_UNIVERSITY_RANKS
} from '@/types/form';

// Personal Details Schema
export const personalDetailsSchema = z.object({
  currentGrade: z.enum(GRADE_LEVELS),
  formFillerType: z.enum(FORM_FILLER_TYPES),
  curriculumType: z.enum(CURRICULUM_TYPES), // Moved from academic details
  studentFirstName: z.string().min(2, 'First name is required'),
  studentLastName: z.string().min(1, 'Last name is required'),
  parentName: z.string().min(2, 'Parent name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().regex(/^[0-9]{10}$/, 'Invalid phone number'),
  whatsappConsent: z.boolean().default(true)
});

// Academic Details Schema
export const academicDetailsSchema = z.object({
  schoolName: z.string().min(2, 'School name is required'),
  academicPerformance: z.enum(ACADEMIC_PERFORMANCES),
  targetUniversityRank: z.enum(TARGET_UNIVERSITY_RANKS),
  preferredCountries: z.array(z.string()).min(1, 'Please select at least one preferred destination'),
  scholarshipRequirement: z.enum(SCHOLARSHIP_REQUIREMENTS),
});

// Complete Form Schema
export const completeFormSchema = personalDetailsSchema
  .merge(academicDetailsSchema);