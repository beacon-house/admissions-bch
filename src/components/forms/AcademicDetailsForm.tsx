import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ChevronLeft, ChevronRight, Trophy, Building } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

// Step 2: Academic Qualification Schema
const academicDetailsSchema = z.object({
  schoolName: z.string().min(2, 'School name is required'),
  academicPerformance: z.enum(['top_5', 'top_10', 'top_25', 'others']),
  targetUniversityRank: z.enum(['top_20', 'top_50', 'top_100', 'any_good']),
  preferredCountries: z.array(z.string()).min(1, 'Please select at least one preferred destination'),
  scholarshipRequirement: z.enum(['good_to_have', 'must_have']),
});

export type AcademicDetailsData = z.infer<typeof academicDetailsSchema>;

interface AcademicDetailsFormProps {
  onSubmit: (data: AcademicDetailsData) => void;
  onBack: () => void;
  defaultValues?: Partial<AcademicDetailsData>;
}

export function AcademicDetailsForm({ onSubmit, onBack, defaultValues }: AcademicDetailsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AcademicDetailsData>({
    resolver: zodResolver(academicDetailsSchema),
    defaultValues
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Trophy className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-semibold text-primary">Academic & Investment Details</h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="schoolName">School Name</Label>
          <Input
            placeholder="Enter your school name"
            id="schoolName"
            {...register('schoolName')}
            className="h-12"
          />
          {errors.schoolName && (
            <p className="text-sm text-red-500">{errors.schoolName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Academic Performance</Label>
          <Select onValueChange={(value) => setValue('academicPerformance', value as AcademicDetailsData['academicPerformance'])}>
            <SelectTrigger className="h-12 bg-white">
              <SelectValue placeholder="Select your academic standing" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top_5">Top 5% of class</SelectItem>
              <SelectItem value="top_10">Top 10% of class</SelectItem>
              <SelectItem value="top_25">Top 25% of class</SelectItem>
              <SelectItem value="others">Others</SelectItem>
            </SelectContent>
          </Select>
          {errors.academicPerformance && (
            <p className="text-sm text-red-500">{errors.academicPerformance.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Target University Rank</Label>
          <Select onValueChange={(value) => setValue('targetUniversityRank', value as AcademicDetailsData['targetUniversityRank'])}>
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
            <p className="text-sm text-red-500">{errors.targetUniversityRank.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Target Geographies</Label>
          <p className="text-sm text-gray-600 mb-2">Select your preferred destinations (includes typical budget ranges)</p>
          {errors.preferredCountries && (
            <p className="text-sm text-red-500 mb-2">{errors.preferredCountries.message}</p>
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
                  className="rounded border-gray-300 text-primary focus:ring-primary mt-1"
                />
                <span className="text-sm leading-tight">{country}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Scholarship Requirement</Label>
          <Select onValueChange={(value) => setValue('scholarshipRequirement', value as AcademicDetailsData['scholarshipRequirement'])}>
            <SelectTrigger className="h-12 bg-white border-gray-200">
              <SelectValue placeholder="Select scholarship requirement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="good_to_have">Good to have</SelectItem>
              <SelectItem value="must_have">Must-have</SelectItem>
            </SelectContent>
          </Select>
          {errors.scholarshipRequirement && (
            <p className="text-sm text-red-500">{errors.scholarshipRequirement.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={onBack}
          className="bg-gray-100 text-gray-700 h-14 px-8 rounded-lg text-lg font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center space-x-2"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Previous</span>
        </button>
        <button
          type="submit"
          className="bg-accent text-primary h-14 px-8 rounded-lg text-lg font-semibold hover:bg-accent-light transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2"
        >
          <span>Submit Application</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}