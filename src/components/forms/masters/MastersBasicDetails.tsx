import React from 'react';
import { Controller } from 'react-hook-form';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { MastersAcademicDetailsData } from '../MastersAcademicDetailsForm';

interface MastersBasicDetailsProps {
  register: any;
  errors: any;
  setValue: any;
  showOtherIntake: boolean;
  control: any;
}

export function MastersBasicDetails({ 
  register, 
  errors, 
  setValue, 
  showOtherIntake,
  control
}: MastersBasicDetailsProps) {
  return (
    <div className="space-y-6 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <h4 className="text-lg font-medium text-primary mb-4">University & Program Information</h4>
      
      {/* University Name */}
      <div className="space-y-2">
        <Label htmlFor="schoolName" className="text-gray-700">Current/Previous University</Label>
        <Input
          placeholder="Enter your university name"
          id="schoolName"
          {...register('schoolName')}
          className="h-12 bg-white"
        />
        {errors.schoolName && (
          <p className="text-sm text-red-500 italic">{errors.schoolName.message}</p>
        )}
      </div>

      {/* Graduation Year */}
      <div className="space-y-2">
        <Label className="text-gray-700">When do you expect to graduate?</Label>
        <Controller
          name="graduationStatus"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <SelectTrigger className="h-12 bg-white">
                <SelectValue placeholder="Select your expected graduation year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2027">2027</SelectItem>
                <SelectItem value="others">Others</SelectItem>
                <SelectItem value="graduated">Graduated Already</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.graduationStatus && (
          <p className="text-sm text-red-500 italic">{errors.graduationStatus.message}</p>
        )}
      </div>

      {/* Intake */}
      <div className="space-y-2">
        <Label className="text-gray-700">Which intake are you applying for?</Label>
        <Controller
          name="intake"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <SelectTrigger className="h-12 bg-white">
                <SelectValue placeholder="Select intake" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aug_sept_2025">Aug/Sept 2025</SelectItem>
                <SelectItem value="jan_aug_2026">Jan or Aug 2026</SelectItem>
                <SelectItem value="jan_aug_2027">Jan or Aug 2027</SelectItem>
                <SelectItem value="other">Others</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.intake && (
          <p className="text-sm text-red-500 italic">{errors.intake.message}</p>
        )}

        {/* Other intake text field */}
        {showOtherIntake && (
          <div className="mt-2">
            <Input
              placeholder="Please specify your intake"
              {...register('intakeOther')}
              className="h-12 bg-white"
            />
          </div>
        )}
      </div>

      {/* Work Experience */}
      <div className="space-y-2">
        <Label className="text-gray-700">How many years of work experience do you have?</Label>
        <Controller
          name="workExperience"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <SelectTrigger className="h-12 bg-white">
                <SelectValue placeholder="Select work experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0_years">0 years</SelectItem>
                <SelectItem value="1_2_years">1-2 years</SelectItem>
                <SelectItem value="3_5_years">3-5 years</SelectItem>
                <SelectItem value="6_plus_years">6+ years</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.workExperience && (
          <p className="text-sm text-red-500 italic">{errors.workExperience.message}</p>
        )}
      </div>

      {/* Field of Study */}
      <div className="space-y-2">
        <Label htmlFor="fieldOfStudy" className="text-gray-700">What is your intended field of study?</Label>
        <Input
          placeholder="E.g., Computer Science, Business Analytics, etc."
          id="fieldOfStudy"
          {...register('fieldOfStudy')}
          className="h-12 bg-white"
        />
        {errors.fieldOfStudy && (
          <p className="text-sm text-red-500 italic">{errors.fieldOfStudy.message}</p>
        )}
      </div>
    </div>
  );
}