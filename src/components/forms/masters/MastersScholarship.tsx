import React from 'react';
import { Label } from '../../ui/label';

interface MastersScholarshipProps {
  register: any;
  errors: any;
}

export function MastersScholarship({ register, errors }: MastersScholarshipProps) {
  return (
    <div className="space-y-4 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <Label className="text-lg font-medium text-primary">Level of scholarship needed</Label>
      <p className="text-sm text-gray-600 italic">
        Please select your scholarship requirements:
      </p>
      
      <div className="space-y-3">
        <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white">
          <input
            type="radio"
            {...register('scholarshipRequirement')}
            value="full_scholarship"
            className="mt-0.5"
          />
          <div className="space-y-1">
            <span className="font-medium text-gray-800">Full scholarship needed</span>
            <p className="text-sm text-gray-600">I require 100% financial assistance to pursue my studies</p>
          </div>
        </label>
        
        <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white">
          <input
            type="radio"
            {...register('scholarshipRequirement')}
            value="partial_scholarship"
            className="mt-0.5"
          />
          <div className="space-y-1">
            <span className="font-medium text-gray-800">Partial scholarship needed</span>
            <p className="text-sm text-gray-600">I can cover some costs but require partial financial support</p>
          </div>
        </label>
        
        <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white">
          <input
            type="radio"
            {...register('scholarshipRequirement')}
            value="scholarship_optional"
            className="mt-0.5"
          />
          <div className="space-y-1">
            <span className="font-medium text-gray-800">Scholarship optional</span>
            <p className="text-sm text-gray-600">I can pursue my studies without scholarship support</p>
          </div>
        </label>
      </div>
      
      {errors.scholarshipRequirement && (
        <p className="text-sm text-red-500 italic">Please answer this question</p>
      )}
    </div>
  );
}