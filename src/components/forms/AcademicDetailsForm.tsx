import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
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
  curriculumType: z.enum(['IB', 'IGCSE', 'CBSE', 'ICSE', 'State_Boards', 'Others']),
  academicPerformance: z.enum(['top_5', 'top_10', 'top_25', 'others']),
  studyAbroadPriority: z.enum(['main_focus', 'backup_plan', 'still_exploring']),
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
        <h3 className="text-xl font-semibold text-primary">Study Abroad Intent</h3>
      </div>

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="curriculumType">Curriculum Type</Label>
            <Select onValueChange={(value) => setValue('curriculumType', value as AcademicDetailsData['curriculumType'])}>
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
              <p className="text-sm text-red-500">{errors.curriculumType.message}</p>
            )}
          </div>
        </div>

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
          <Label>Priority of Studying Abroad</Label>
          <Select onValueChange={(value) => setValue('studyAbroadPriority', value as AcademicDetailsData['studyAbroadPriority'])}>
            <SelectTrigger className="h-12 bg-white border-gray-200">
              <SelectValue placeholder="Select your priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="main_focus">Main Focus</SelectItem>
              <SelectItem value="backup_plan">Backup Plan</SelectItem>
              <SelectItem value="still_exploring">Still Exploring</SelectItem>
            </SelectContent>
          </Select>
          {errors.studyAbroadPriority && (
            <p className="text-sm text-red-500">{errors.studyAbroadPriority.message}</p>
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
          <span>Next</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}