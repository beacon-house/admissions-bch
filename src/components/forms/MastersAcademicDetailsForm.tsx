// This file is now refactored into smaller components in the masters/ directory
// This is maintained as the main entry point that uses those components

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ChevronLeft, ChevronRight, GraduationCap } from 'lucide-react';

// Import refactored components
import { MastersBasicDetails } from './masters/MastersBasicDetails';
import { MastersAcademicInfo } from './masters/MastersAcademicInfo';
import { MastersApplicationPrep } from './masters/MastersApplicationPrep';
import { MastersScholarship } from './masters/MastersScholarship';
import { MastersContactMethods } from './masters/MastersContactMethods';

// Masters Academic Details Schema
const mastersAcademicDetailsSchema = z.object({
  schoolName: z.string().min(2, 'University name is required'),
  intake: z.enum(['aug_sept_2025', 'jan_aug_2026', 'jan_aug_2027', 'other']),
  intakeOther: z.string().optional(),
  graduationStatus: z.enum(['2025', '2026', '2027', 'others', 'graduated']),
  graduationYear: z.string().min(1, 'Graduation year is required').optional().or(z.literal('')),
  workExperience: z.enum(['0_years', '1_2_years', '3_5_years', '6_plus_years']),
  gradeFormat: z.enum(['gpa', 'percentage']),
  gpaValue: z.string().optional(),
  percentageValue: z.string().optional(),
  entranceExam: z.enum(['gre', 'gmat', 'planning', 'not_required']),
  examScore: z.string().optional(),
  fieldOfStudy: z.string().min(1, 'Field of study is required'),
  applicationPreparation: z.enum(['researching_now', 'taken_exams_identified_universities', 'undecided_need_help']),
  targetUniversities: z.enum(['top_20_50', 'top_50_100', 'partner_university', 'unsure']),
  supportLevel: z.enum(['personalized_guidance', 'exploring_options', 'self_guided', 'partner_universities']),
  scholarshipRequirement: z.enum(['scholarship_optional', 'partial_scholarship', 'full_scholarship']),
  contactMethods: z.object({
    call: z.boolean().default(false),
    callNumber: z.string().optional(),
    whatsapp: z.boolean().default(true),
    whatsappNumber: z.string().optional(),
    email: z.boolean().default(true),
    emailAddress: z.string().email().optional(),
  }).refine(data => data.call || data.whatsapp || data.email, {
    message: "Please select at least one contact method",
    path: ['contact']
  }),
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

export type MastersAcademicDetailsData = z.infer<typeof mastersAcademicDetailsSchema>;

interface MastersAcademicDetailsFormProps {
  onSubmit: (data: MastersAcademicDetailsData) => void;
  onBack: () => void;
  defaultValues?: Partial<MastersAcademicDetailsData>;
}

export function MastersAcademicDetailsForm({ onSubmit, onBack, defaultValues }: MastersAcademicDetailsFormProps) {
  const [callChecked, setCallChecked] = useState(defaultValues?.contactMethods?.call || false);
  const [whatsappChecked, setWhatsappChecked] = useState(defaultValues?.contactMethods?.whatsapp !== false); // Default to true unless explicitly false
  const [emailChecked, setEmailChecked] = useState(defaultValues?.contactMethods?.email !== false); // Default to true if not explicitly false
  const [showOtherIntake, setShowOtherIntake] = useState(defaultValues?.intake === 'other');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
    clearErrors,
    control
  } = useForm<MastersAcademicDetailsData>({
    resolver: zodResolver(mastersAcademicDetailsSchema),
    defaultValues: {
      ...defaultValues,
      gradeFormat: defaultValues?.gradeFormat || 'gpa',
      contactMethods: {
        call: defaultValues?.contactMethods?.call || false,
        callNumber: defaultValues?.contactMethods?.callNumber || defaultValues?.phoneNumber || '',
        whatsapp: defaultValues?.contactMethods?.whatsapp !== false, // Default to true unless explicitly false
        whatsappNumber: defaultValues?.contactMethods?.whatsappNumber || defaultValues?.phoneNumber || '',
        email: defaultValues?.contactMethods?.email !== false, // Default to true if not explicitly false
        emailAddress: defaultValues?.contactMethods?.emailAddress || defaultValues?.email || '',
      }
    }
  });

  // Watch for changes to key fields
  const intake = watch('intake');
  const entranceExam = watch('entranceExam');
  const gradeFormat = watch('gradeFormat');

  // Update states when values change
  useEffect(() => {
    setShowOtherIntake(intake === 'other');
  }, [intake]);

  // Pre-fill contact methods with user data from step 1
  useEffect(() => {
    if (defaultValues) {
      // Pre-fill phone number if available
      if (defaultValues.phoneNumber && !defaultValues.contactMethods?.callNumber) {
        setValue('contactMethods.callNumber', defaultValues.phoneNumber);
      }
      
      // Pre-fill WhatsApp with phone number if available
      if (defaultValues.phoneNumber && !defaultValues.contactMethods?.whatsappNumber) {
        setValue('contactMethods.whatsappNumber', defaultValues.phoneNumber);
      }
      
      // Pre-fill email if available
      if (defaultValues.email && !defaultValues.contactMethods?.emailAddress) {
        setValue('contactMethods.emailAddress', defaultValues.email);
      }
    }
  }, [defaultValues, setValue]);

  const handleContactMethodChange = (method: 'call' | 'whatsapp' | 'email', checked: boolean) => {
    setValue(`contactMethods.${method}`, checked);
    
    if (method === 'call') {
      setCallChecked(checked);
      // If enabling call and field is empty, pre-fill with phone number
      if (checked && !getValues('contactMethods.callNumber') && defaultValues?.phoneNumber) {
        setValue('contactMethods.callNumber', defaultValues.phoneNumber);
      }
    }
    
    if (method === 'whatsapp') {
      setWhatsappChecked(checked);
      // If enabling whatsapp and field is empty, pre-fill with phone number
      if (checked && !getValues('contactMethods.whatsappNumber') && defaultValues?.phoneNumber) {
        setValue('contactMethods.whatsappNumber', defaultValues.phoneNumber);
      }
    }
    
    if (method === 'email') {
      setEmailChecked(checked);
      // If enabling email and field is empty, pre-fill with email
      if (checked && !getValues('contactMethods.emailAddress') && defaultValues?.email) {
        setValue('contactMethods.emailAddress', defaultValues.email);
      }
    }
  };

  const handleBack = () => {
    window.scrollTo(0, 0);
    onBack();
  };

  const handleFormSubmit = (data: MastersAcademicDetailsData) => {
    window.scrollTo(0, 0);
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <GraduationCap className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-semibold text-primary">Masters Program Details</h3>
      </div>

      <div className="space-y-6">
        {/* Basic Details section using refactored component */}
        <MastersBasicDetails 
          register={register}
          errors={errors}
          setValue={setValue}
          showOtherIntake={showOtherIntake}
          control={control}
        />

        {/* Academic Info section using refactored component */}
        <MastersAcademicInfo
          register={register}
          errors={errors}
          setValue={setValue}
          clearErrors={clearErrors}
          gradeFormat={gradeFormat}
          selectedEntranceExam={entranceExam}
          control={control}
        />

        {/* Application Preparation using refactored component */}
        <MastersApplicationPrep
          register={register}
          errors={errors}
        />

        {/* Scholarship Requirements using refactored component */}
        <MastersScholarship
          register={register}
          errors={errors}
        />

        {/* Communication Preferences using refactored component */}
        <MastersContactMethods
          register={register}
          errors={errors}
          callChecked={callChecked}
          whatsappChecked={whatsappChecked}
          emailChecked={emailChecked}
          handleContactMethodChange={handleContactMethodChange}
        />
      </div>

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={handleBack}
          className="bg-gray-100 text-gray-700 h-14 px-8 rounded-lg text-lg font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center space-x-2"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Previous</span>
        </button>
        <button
          type="submit"
          className="bg-accent text-primary h-14 px-8 rounded-lg text-lg font-semibold hover:bg-accent-light transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2"
        >
          <span>Next</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}