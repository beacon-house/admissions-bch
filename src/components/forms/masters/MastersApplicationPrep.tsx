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
              value="started_research"
              className="mt-0.5"
            />
            <div>
              <span className="text-sm text-gray-700">Yes, I have started researching universities and application requirements</span>
            </div>
          </label>
          
          <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white">
            <input
              type="radio"
              {...register('applicationPreparation')}
              value="taking_exams"
              className="mt-0.5"
            />
            <div>
              <span className="text-sm text-gray-700">I have taken or plan to take GRE/GMAT/TOEFL/IELTS soon</span>
            </div>
          </label>
          
          <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white">
            <input
              type="radio"
              {...register('applicationPreparation')}
              value="just_exploring"
              className="mt-0.5"
            />
            <div>
              <span className="text-sm text-gray-700">No, I am just exploring options</span>
            </div>
          </label>
          
          <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white">
            <input
              type="radio"
              {...register('applicationPreparation')}
              value="future_applicant"
              className="mt-0.5"
            />
            <div>
              <span className="text-sm text-gray-700">No, I am looking to apply in 2027 or beyond</span>
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
              <span className="text-sm text-gray-700">I am open to 50-100 ranked universities or direct admissions through a partner university</span>
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