import React from 'react';
import { Controller } from 'react-hook-form';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';

interface MastersAcademicInfoProps {
  register: any;
  errors: any;
  setValue: any;
  clearErrors: any;
  gradeFormat: string;
  selectedEntranceExam: string;
  control: any; // Added control prop
}

export function MastersAcademicInfo({
  register, 
  errors, 
  setValue, 
  clearErrors,
  gradeFormat,
  selectedEntranceExam,
  control // Receive control from parent
}: MastersAcademicInfoProps) {
  return (
    <div className="space-y-6 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <h4 className="text-lg font-medium text-primary mb-4">Academic Information</h4>
      
      {/* Academic Grade Format Selection */}
      <div className="space-y-2">
        <Label className="text-gray-700">What format would you like to provide your undergraduate grade in?</Label>
        <div className="grid grid-cols-2 gap-4 mb-2">
          <button
            type="button"
            onClick={() => {
              setValue('gradeFormat', 'gpa');
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
                pattern="[0-9]*[.]?[0-9]*"
                placeholder="Enter GPA value (e.g. 8.5)"
                id="gpaValue"
                {...register('gpaValue')}
                className="h-12 bg-white"
                suffix="/10"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 10)) {
                    e.target.value = value;
                  }
                }}
                suffix="/10"
              />
            {errors.gpaValue && (
              <p className="text-sm text-red-500 italic">{errors.gpaValue.message || "Please provide your GPA"}</p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="percentageValue" className="text-gray-700">Percentage</Label>
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter percentage (e.g. 85)"
                id="percentageValue"
                {...register('percentageValue')}
                className="h-12 bg-white"
                suffix="%"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 100)) {
                    e.target.value = value;
                  }
                }}
                suffix="%"
              />
            {errors.percentageValue && (
              <p className="text-sm text-red-500 italic">{errors.percentageValue.message || "Please provide your percentage"}</p>
            )}
          </div>
        )}
      </div>

      {/* Entrance Exam */}
      <div className="space-y-2">
        <Label className="text-gray-700">Do you have a GRE/GMAT score (if required for your programs)?</Label>
        <Controller
          name="entranceExam"
          control={control} // Fixed: use control instead of register
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <SelectTrigger className="h-12 bg-white">
                <SelectValue placeholder="Select exam status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gre">Yes - GRE</SelectItem>
                <SelectItem value="gmat">Yes - GMAT</SelectItem>
                <SelectItem value="planning">No - but planning to take it</SelectItem>
                <SelectItem value="not_required">Not required for my programs</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.entranceExam && (
          <p className="text-sm text-red-500 italic">{errors.entranceExam.message}</p>
        )}

        {/* Show score input if GRE or GMAT selected */}
        {(selectedEntranceExam === 'gre' || selectedEntranceExam === 'gmat') && (
          <div className="mt-2">
            <Input
              placeholder={selectedEntranceExam === 'gre' ? "GRE Score" : "GMAT Score"}
              {...register('examScore')}
              className="h-12 bg-white"
            />
          </div>
        )}
      </div>
    </div>
  );
}