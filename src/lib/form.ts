import { LeadCategory, CompleteFormData } from '@/types/form';
import { personalDetailsSchema, academicDetailsSchema } from '@/schemas/form';
import { ZodError } from 'zod';

export class FormValidationError extends Error {
  constructor(public errors: { [key: string]: string[] }) {
    super('Form validation failed');
    this.name = 'FormValidationError';
  }
}

// Form submission helper
export const submitFormData = async (
  data: Partial<CompleteFormData>,
  step: number,
  startTime: number,
  isComplete: boolean = false
): Promise<Response> => {
  const webhookUrl = import.meta.env.VITE_REGISTRATION_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    throw new Error('Form submission URL not configured. Please check environment variables.');
  }

  const currentTime = Math.floor((Date.now() - startTime) / 1000);

  // Parse counselling data for webhook
  const counsellingSlotPicked = Boolean(
    data.counselling?.selectedDate && data.counselling?.selectedSlot
  );
  
  // Get preferred communication methods
  const preferredContactMethods = [];
  const contactDetails = {};
  
  if (data.contactMethods) {
    if (data.contactMethods.call) {
      preferredContactMethods.push('call');
      contactDetails.callNumber = data.contactMethods.callNumber || data.phoneNumber;
    }
    
    if (data.contactMethods.whatsapp) {
      preferredContactMethods.push('whatsapp');
      contactDetails.whatsappNumber = data.contactMethods.whatsappNumber || data.phoneNumber;
    }
    
    if (data.contactMethods.email) {
      preferredContactMethods.push('email');
      contactDetails.emailAddress = data.contactMethods.emailAddress || data.email;
    }
  }

  // Create a clean payload with just the data we need
  const formattedPayload = {
    // User-submitted data
    studentFirstName: data.studentFirstName,
    studentLastName: data.studentLastName,
    parentName: data.parentName,
    email: data.email,
    phoneNumber: data.phoneNumber,
    whatsappConsent: data.whatsappConsent,
    currentGrade: data.currentGrade,
    formFillerType: data.formFillerType,
    curriculumType: data.curriculumType,
    
    // Additional form fields if available
    schoolName: data.schoolName,
    academicPerformance: data.academicPerformance,
    targetUniversityRank: data.targetUniversityRank,
    preferredCountries: data.preferredCountries,
    scholarshipRequirement: data.scholarshipRequirement,
    
    // Lead categorization
    lead_category: data.lead_category,
    
    // Counselling data
    counsellingSlotPicked: counsellingSlotPicked,
    counsellingDate: data.counselling?.selectedDate || null,
    counsellingTime: data.counselling?.selectedSlot || null,
    preferredContactMethods: preferredContactMethods.length > 0 ? preferredContactMethods : null,
    ...contactDetails,
    
    // Metadata
    total_time_spent: currentTime,
    created_at: new Date().toISOString(),
    form_completion_step: step
  };

  console.log('Sending webhook data:', formattedPayload);

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formattedPayload),
  });

  // Enhanced error handling with response details
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'No error details available');
    console.error('Form submission failed:', {
      status: response.status,
      statusText: response.statusText,
      errorText
    });
    throw new Error(`Form submission failed: ${response.status} ${response.statusText}`);
  }

  return response;
};

// Enhanced form validation helper
export const validateForm = async (
  step: number,
  data: Partial<CompleteFormData>
): Promise<void> => {
  try {
    switch (step) {
      case 1:
        await personalDetailsSchema.parseAsync(data);
        break;
      case 2:
        await academicDetailsSchema.parseAsync(data);
        break;
      default:
        throw new Error('Invalid form step');
    }
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors: { [key: string]: string[] } = {};
      error.errors.forEach((err) => {
        const field = err.path[0] as string;
        if (!formattedErrors[field]) {
          formattedErrors[field] = [];
        }
        formattedErrors[field].push(err.message);
      });
      throw new FormValidationError(formattedErrors);
    }
    throw error;
  }
};

// Form validation helper
export const validateFormStep = (
  step: number,
  data: Partial<CompleteFormData>
): boolean => {
  try {
    switch (step) {
      case 1:
        return personalDetailsSchema.safeParse(data).success;
      case 2:
        return academicDetailsSchema.safeParse(data).success;
      default:
        return false;
    }
  } catch {
    return false;
  }
};