import React from 'react';
import { Label } from '../../ui/label';

interface MastersApplicationPrepProps {
  register: any;
  errors: any;
}

export function MastersApplicationPrep({ register, errors }: MastersApplicationPrepProps) {
  return (
    <div className="space-y-6">
      {/* Application Preparation - NEW */}
      <div className="space-y-4 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <Label className="text-lg font-medium text-primary">Have you started preparing for your Master's application?</Label>
        
        <div className="space-y-3">
          <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white">
            <input
              type="radio"
              {...register('applicationPreparation')}
              value="researching_now"
              className="mt-0.5"
            />
            <div>
              <span className="text-sm text-gray-700">Yes, I'm researching right now</span>
            </div>
          </label>
          
          <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white">
            <input
              type="radio"
              {...register('applicationPreparation')}
              value="taken_exams_identified_universities"
              className="mt-0.5"
            />
            <div>
              <span className="text-sm text-gray-700">Have taken GRE/GMAT & identified universities. I need help with the process</span>
            </div>
          </label>
          
          <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white">
            <input
              type="radio"
              {...register('applicationPreparation')}
              value="undecided_need_help"
              className="mt-0.5"
            />
            <div>
              <span className="text-sm text-gray-700">Yet to decide if I want to apply & need help with deciding</span>
            </div>
          </label>
        </div>
        
        {errors.applicationPreparation && (
          <p className="text-sm text-red-500 italic">{errors.applicationPreparation.message}</p>
        )}
      </div>

      {/* Target Universities - NEW */}
      <div className="space-y-4 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <Label className="text-lg font-medium text-primary">Which best describes your target universities and programs?</Label>
        
        <div className="space-y-3">
          <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white">
            <input
              type="radio"
              {...register('targetUniversities')}
              value="top_20_50"
              className="mt-0.5"
            />
            <div>
              <span className="text-sm text-gray-700">I am aiming for a Top 20-50 ranked global university (QS, THE, US News)</span>
            </div>
          </label>
          
          <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white">
            <input
              type="radio"
              {...register('targetUniversities')}
              value="top_50_100"
              className="mt-0.5"
            />
            <div>
              <span className="text-sm text-gray-700">I am open to 50-100 ranked universities</span>
            </div>
          </label>
          
          <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white">
            <input
              type="radio"
              {...register('targetUniversities')}
              value="partner_university"
              className="mt-0.5"
            />
            <div>
              <span className="text-sm text-gray-700">I want to get into a Partner University without GRE/GMAT</span>
            </div>
          </label>
          
          <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white">
            <input
              type="radio"
              {...register('targetUniversities')}
              value="unsure"
              className="mt-0.5"
            />
            <div>
              <span className="text-sm text-gray-700">I am unsure about my university preferences yet</span>
            </div>
          </label>
        </div>
        
        {errors.targetUniversities && (
          <p className="text-sm text-red-500 italic">{errors.targetUniversities.message}</p>
        )}
      </div>

      {/* Support Level - NEW */}
      <div className="space-y-4 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <Label className="text-lg font-medium text-primary">What level of support do you need for your Master's applications?</Label>
        
        <div className="space-y-3">
          <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white">
            <input
              type="radio"
              {...register('supportLevel')}
              value="personalized_guidance"
              className="mt-0.5"
            />
            <div>
              <span className="text-sm text-gray-700">I want personalized guidance (SOP, LORs, university selection, interview prep) and I'm open to investing ₹2-3L for the best possible outcome</span>
            </div>
          </label>
          
          <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white">
            <input
              type="radio"
              {...register('supportLevel')}
              value="exploring_options"
              className="mt-0.5"
            />
            <div>
              <span className="text-sm text-gray-700">I am exploring my options and want to understand how professional guidance can improve my chances</span>
            </div>
          </label>
          
          <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white">
            <input
              type="radio"
              {...register('supportLevel')}
              value="self_guided"
              className="mt-0.5"
            />
            <div>
              <span className="text-sm text-gray-700">I want guidance while I am looking to do the application process myself</span>
            </div>
          </label>
          
          <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white">
            <input
              type="radio"
              {...register('supportLevel')}
              value="partner_universities"
              className="mt-0.5"
            />
            <div>
              <span className="text-sm text-gray-700">I need help with a simple process that gets me admission into Partner Universities</span>
            </div>
          </label>
        </div>
        
        {errors.supportLevel && (
          <p className="text-sm text-red-500 italic">{errors.supportLevel.message}</p>
        )}
      </div>
    </div>
  );
}