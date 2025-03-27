import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ChevronLeft, ChevronRight, Trophy, Building, Phone, MessageSquare, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { academicDetailsSchema } from '@/schemas/form';

export type AcademicDetailsData = z.infer<typeof academicDetailsSchema>;

interface AcademicDetailsFormProps {
  onSubmit: (data: AcademicDetailsData) => void;
  onBack: () => void;
  defaultValues?: Partial<AcademicDetailsData>;
}

export function AcademicDetailsForm({ onSubmit, onBack, defaultValues }: AcademicDetailsFormProps) {
  // Initialize state with values from previous form inputs where available
  const [callChecked, setCallChecked] = useState(defaultValues?.contactMethods?.call || false);
  const [whatsappChecked, setWhatsappChecked] = useState(defaultValues?.contactMethods?.whatsapp !== false); // Default to true unless explicitly false
  const [emailChecked, setEmailChecked] = useState(defaultValues?.contactMethods?.email !== false); // Default to true if not explicitly false
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
    clearErrors,
  } = useForm<AcademicDetailsData>({
    resolver: zodResolver(academicDetailsSchema),
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

  // Watch gradeFormat to update UI
  const gradeFormat = watch('gradeFormat');

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

  const handleFormSubmit = (data: AcademicDetailsData) => {
    window.scrollTo(0, 0);
    onSubmit(data);
  };

  // Helper function to handle numeric input with optional decimal point
  const handleNumericInput = (e: React.ChangeEvent<HTMLInputElement>, min: number, max: number) => {
    const value = e.target.value;
    
    // Allow empty input for user to type
    if (value === '') return;
    
    // Allow a single decimal point
    if (value === '.') {
      e.target.value = '.';
      return;
    }
    
    // Validate as a number with optional single decimal point
    const regex = /^\d*\.?\d*$/;
    if (!regex.test(value)) {
      e.target.value = value.slice(0, -1);
      return;
    }
    
    // Check if it's within range when it's a valid number
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      if (numValue < min) {
        e.target.value = min.toString();
      } else if (numValue > max) {
        e.target.value = max.toString();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Trophy className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-semibold text-primary">
          Academic & Investment Details
        </h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="curriculumType">Curriculum Type</Label>
          <Select 
            onValueChange={(value) => setValue('curriculumType', value as AcademicDetailsData['curriculumType'])}
            defaultValue={defaultValues?.curriculumType}
          >
            <SelectTrigger className="h-12 bg-white">
              <SelectValue placeholder="Select curriculum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="IB">IB</SelectItem>
              <SelectItem value="IGCSE">IGCSE</SelectItem>
              <SelectItem value="CBSE">CBSE</SelectItem>
              <SelectItem value="ICSE">ICSE</SelectItem>
              <SelectItem value="State_Boards">State Boards</SelectItem>
              <SelectItem value="Others">Others</SelectItem>
            </SelectContent>
          </Select>
          {errors.curriculumType && (
            <p className="text-sm text-red-500 italic">Please answer this question</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="schoolName">School Name</Label>
          <Input
            placeholder="Enter your school name"
            id="schoolName"
            {...register('schoolName')}
            className="h-12 bg-white"
          />
          {errors.schoolName && (
            <p className="text-sm text-red-500 italic">Please answer this question</p>
          )}
        </div>

        {/* Academic Grade Format Selection - New implementation */}
        <div className="space-y-2">
          <Label className="text-gray-700">What was the student's GPA/Percentage in the most recent exam?</Label>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <button
              type="button"
              onClick={() => {
                setValue('gradeFormat', 'gpa');
                setValue('percentageValue', ''); // Clear the other field
                clearErrors('gpaValue');
              }}
              className={cn(
                "h-12 flex items-center justify-center border rounded-lg font-medium transition-colors",
                gradeFormat === 'gpa'
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              )}
            >
              GPA Format
            </button>
            <button
              type="button"
              onClick={() => {
                setValue('gradeFormat', 'percentage');
                setValue('gpaValue', ''); // Clear the other field
                clearErrors('percentageValue');
              }}
              className={cn(
                "h-12 flex items-center justify-center border rounded-lg font-medium transition-colors",
                gradeFormat === 'percentage'
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              )}
            >
              Percentage Format
            </button>
          </div>

          {/* Show appropriate input field based on selected format */}
          {gradeFormat === 'gpa' ? (
            <div className="space-y-2">
              <Label htmlFor="gpaValue" className="text-gray-700">GPA (out of 10)</Label>
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="Enter GPA value (e.g. 8.5)"
                  id="gpaValue"
                  {...register('gpaValue')}
                  className="h-12 bg-white"
                  suffix="/10"
                  onChange={(e) => handleNumericInput(e, 1, 10)}
                />
              {errors.gpaValue && (
                <p className="text-sm text-red-500 italic">Please answer this question</p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="percentageValue" className="text-gray-700">Percentage</Label>
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="Enter percentage (e.g. 85)"
                  id="percentageValue"
                  {...register('percentageValue')}
                  className="h-12 bg-white"
                  suffix="%"
                  onChange={(e) => handleNumericInput(e, 1, 100)}
                />
              {errors.percentageValue && (
                <p className="text-sm text-red-500 italic">Please answer this question</p>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Target University Rank</Label>
          <Select 
            onValueChange={(value) => setValue('targetUniversityRank', value as AcademicDetailsData['targetUniversityRank'])}
            defaultValue={defaultValues?.targetUniversityRank}
          >
            <SelectTrigger className="h-12 bg-white border-gray-200">
              <SelectValue placeholder="Select target university rank" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top_20">Top 20 Universities</SelectItem>
              <SelectItem value="top_50">Top 50 Universities</SelectItem>
              <SelectItem value="top_100">Top 100 Universities</SelectItem>
              <SelectItem value="any_good">Any Good University</SelectItem>
            </SelectContent>
          </Select>
          {errors.targetUniversityRank && (
            <p className="text-sm text-red-500 italic">Please answer this question</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Target Geographies</Label>
          <p className="text-sm text-gray-600 mb-2 italic">
            Select your preferred destinations (includes typical budget ranges)
          </p>
          {errors.preferredCountries && (
            <p className="text-sm text-red-500 italic">Please answer this question</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'USA (Rs. 1.6-2 Cr)',
              'UK (Rs. 1.2-1.6 Cr)',
              'Canada (Rs. 1.2-1.6 Cr)',
              'Australia (Rs. 1.2-1.6 Cr)',
              'Europe (Rs. 1-1.5 Cr)',
              'Asia (Singapore, Hong Kong) (Rs. 60L-1.5 Cr)',
              'Middle East (Dubai) (Rs. 60L-1.5 Cr)',
              'Other Geographies',
              'Need Guidance'
            ].map((country) => (
              <label key={country} className="flex items-start space-x-2 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <input
                  type="checkbox"
                  {...register('preferredCountries')}
                  value={country}
                  defaultChecked={defaultValues?.preferredCountries?.includes(country)}
                  className="rounded border-gray-300 text-primary focus:ring-primary mt-1"
                />
                <span className="text-sm leading-tight">{country}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Level of scholarship needed<span className="text-red-500">*</span></Label>
          <p className="text-sm text-gray-600 mb-2 italic">
            Please select your scholarship requirements:
          </p>
          
          <div className="space-y-3">
            <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                {...register('scholarshipRequirement')}
                value="full_scholarship"
                className="mt-0.5"
              />
              <div className="space-y-1">
                <span className="font-medium">Full scholarship needed</span>
                <p className="text-sm text-gray-600">I require 100% financial assistance to pursue my studies</p>
              </div>
            </label>
            
            <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                {...register('scholarshipRequirement')}
                value="partial_scholarship"
                className="mt-0.5"
              />
              <div className="space-y-1">
                <span className="font-medium">Partial scholarship needed</span>
                <p className="text-sm text-gray-600">I can cover some costs but require partial financial support</p>
              </div>
            </label>
            
            <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                {...register('scholarshipRequirement')}
                value="scholarship_optional"
                className="mt-0.5"
              />
              <div className="space-y-1">
                <span className="font-medium">Scholarship optional</span>
                <p className="text-sm text-gray-600">I can pursue my studies without scholarship support</p>
              </div>
            </label>
          </div>
          
          {errors.scholarshipRequirement && (
            <p className="text-sm text-red-500 italic">Please answer this question</p>
          )}
        </div>

        {/* Communication Preferences Section */}
        <div className="space-y-3 pt-4 border-t border-gray-200">
          <Label className="text-lg font-medium">How Would You Like Us to Contact You?</Label>
          <p className="text-sm text-gray-600 mb-2 italic">
            Choose your preferred communication methods (select at least one)
          </p>

          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2 min-w-[140px]">
                <input
                  type="checkbox"
                  id="callMethod"
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                  checked={callChecked}
                  onChange={(e) => handleContactMethodChange('call', e.target.checked)}
                />
                <Label htmlFor="callMethod" className="mb-0 cursor-pointer flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>Phone Call</span>
                </Label>
              </div>
              <div className="flex-1">
                <Input
                  {...register('contactMethods.callNumber')}
                  disabled={!callChecked}
                  placeholder="Enter phone number for calls"
                  className={cn(
                    "h-10 bg-white",
                    !callChecked && "bg-gray-100 text-gray-500"
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2 min-w-[140px]">
                <input
                  type="checkbox"
                  id="whatsappMethod"
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                  checked={whatsappChecked}
                  onChange={(e) => handleContactMethodChange('whatsapp', e.target.checked)}
                />
                <Label htmlFor="whatsappMethod" className="mb-0 cursor-pointer flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-gray-500" />
                  <span>WhatsApp</span>
                </Label>
              </div>
              <div className="flex-1">
                <Input
                  {...register('contactMethods.whatsappNumber')}
                  disabled={!whatsappChecked}
                  placeholder="Enter WhatsApp number" 
                  className={cn(
                    "h-10 bg-white",
                    !whatsappChecked && "bg-gray-100 text-gray-500"
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2 min-w-[140px]">
                <input
                  type="checkbox"
                  id="emailMethod"
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                  checked={emailChecked}
                  onChange={(e) => handleContactMethodChange('email', e.target.checked)}
                />
                <Label htmlFor="emailMethod" className="mb-0 cursor-pointer flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>Email</span>
                </Label>
              </div>
              <div className="flex-1">
                <Input
                  {...register('contactMethods.emailAddress')}
                  disabled={!emailChecked}
                  placeholder="Enter email address"
                  className={cn(
                    "h-10 bg-white",
                    !emailChecked && "bg-gray-100 text-gray-500"
                  )}
                />
              </div>
            </div>
            
            {errors.contactMethods && (
              <p className="text-sm text-red-500 italic">Please select at least one contact method</p>
            )}
          </div>
        </div>
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