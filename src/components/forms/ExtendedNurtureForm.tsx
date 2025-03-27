import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Label } from '../ui/label';
import { ChevronLeft, ChevronRight, BookOpen, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

// Extended Nurture Form Schema
const extendedNurtureSchema = z.object({
  // Shared fields between parent and student
  strongProfileIntent: z.string(),
  
  // Student-specific fields (optional when form filler is parent)
  parentalSupport: z.enum(['would_join', 'supportive_limited', 'handle_independently', 'not_discussed']).optional(),
  partialFundingApproach: z.enum(['accept_cover_remaining', 'defer_external_scholarships', 'affordable_alternatives', 'only_full_funding', 'need_to_ask']).optional(),
  
  // Parent-specific fields (optional when form filler is student)
  partialFundingApproach: z.enum(['accept_loans', 'defer_scholarships', 'affordable_alternatives', 'only_full_funding']).optional()
});

export type ExtendedNurtureData = z.infer<typeof extendedNurtureSchema>;

interface ExtendedNurtureFormProps {
  onSubmit: (data: ExtendedNurtureData) => void;
  onBack: () => void;
  defaultValues?: Partial<ExtendedNurtureData>;
  currentGrade: string;
  formFillerType: 'parent' | 'student';
}

export function ExtendedNurtureForm({ onSubmit, onBack, defaultValues, currentGrade, formFillerType }: ExtendedNurtureFormProps) {
  const isParent = formFillerType === 'parent';
  
  // Create a custom resolver to handle conditional validation based on form filler type
  const customResolver = (data: any) => {
    try {
      // Start with the basic schema
      let schema = extendedNurtureSchema;
      
      // Add conditional validation based on form filler type
      if (isParent) {
        // For parents, require parent-specific fields
        schema = schema.refine(
          (data) => !!data.partialFundingApproach,
          { message: "Please answer this question", path: ["partialFundingApproach"] }
        );
      } else {
        // For students, require student-specific fields
        schema = schema.refine(
          (data) => !!data.parentalSupport,
          { message: "Please answer this question", path: ["parentalSupport"] }
        ).refine(
          (data) => !!data.partialFundingApproach,
          { message: "Please answer this question", path: ["partialFundingApproach"] }
        );
      }
      
      // Validate using the enhanced schema
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, error: error.format() };
      }
      return { success: false, error };
    }
  };
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<ExtendedNurtureData>({
    resolver: zodResolver(extendedNurtureSchema),
    defaultValues: {
      ...defaultValues
    }
  });

  // Get the profile interest question - now the same for both Grade 11 and 12
  const getProfileInterestQuestion = () => {
    // The title prefix changes based on whether the form filler is a parent or student
    return {
      title: isParent
        ? "Your child is in a critical phase of building their university profile. Would you like help in building a strong profile?"
        : "You're in a critical phase of building your university profile. Would you like help in building a strong profile?",
      options: [
        { value: 'interested_in_profile', label: 'Interested in doing relevant work to build strong profile' },
        { value: 'academics_focus', label: 'Focus is on Academics, will only do the minimum needed to get an admit' }
      ]
    };
  };

  const profileQuestion = getProfileInterestQuestion();

  const handleBack = () => {
    window.scrollTo(0, 0);
    onBack();
  };

  const handleFormSubmit = (data: ExtendedNurtureData) => {
    // Map gradeSpecificQuestion to strongProfileIntent before submitting
    const mapped = {
      ...data,
      strongProfileIntent: data.strongProfileIntent
    };
    
    window.scrollTo(0, 0);
    onSubmit(mapped);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Explanation Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex items-start">
        <Info className="text-blue-500 w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-blue-700 mb-1 text-sm">We need a bit more information</h4>
          <p className="text-blue-600 text-sm">
            Based on your profile, we'd like to understand your circumstances better to tailor the optimal path for {isParent ? "your child's" : "your"} university admissions journey. These additional questions will help us provide more personalized guidance.
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-6">
        <BookOpen className="w-5 h-5 text-primary" />
        <h3 className="text-base font-semibold text-primary">
          Additional Information
        </h3>
      </div>

      <div className="space-y-6">
        {/* STUDENT-SPECIFIC QUESTIONS */}
        {!isParent && (
          <>
            {/* Parental Support Question - Student Only */}
            <div className="space-y-3 bg-white rounded-lg p-5 shadow-sm border border-gray-100">
              <Label className="text-sm font-medium text-primary">We find that parental support greatly increases success with admissions. Would your parents be able to join a counseling session?</Label>
              
              <div className="space-y-2 mt-3">
                <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    {...register('parentalSupport')}
                    value="would_join"
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-sm">Yes, they would join</span>
                  </div>
                </label>
                
                <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    {...register('parentalSupport')}
                    value="supportive_limited"
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-sm">They're supportive but will not be able to join</span>
                  </div>
                </label>
                
                <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    {...register('parentalSupport')}
                    value="handle_independently"
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-sm">I prefer to handle this independently</span>
                  </div>
                </label>
                
                <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    {...register('parentalSupport')}
                    value="not_discussed"
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-sm">I haven't discussed this with them in detail</span>
                  </div>
                </label>
              </div>
              
              {errors.parentalSupport && (
                <p className="text-sm text-red-500 italic">Please answer this question</p>
              )}
            </div>

            {/* Financial Planning - Student Only */}
            <div className="space-y-3 bg-white rounded-lg p-5 shadow-sm border border-gray-100">
              <Label className="text-sm font-medium text-primary">While 100% scholarship is ideal, it is quite hard for Undergrad unless you have a stellar profile. If your preferred university offers admission with partial funding, what would be your approach?</Label>
              
              <div className="space-y-2 mt-3">
                <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    {...register('partialFundingApproach')}
                    value="accept_cover_remaining"
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-sm">Accept and find ways to cover remaining costs using loans</span>
                  </div>
                </label>
                
                <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    {...register('partialFundingApproach')}
                    value="defer_external_scholarships"
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-sm">Defer to following year and apply for additional external scholarships</span>
                  </div>
                </label>
                
                <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    {...register('partialFundingApproach')}
                    value="affordable_alternatives"
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-sm">Consider more affordable university alternatives</span>
                  </div>
                </label>
                
                <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    {...register('partialFundingApproach')}
                    value="only_full_funding"
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-sm">Would only proceed with full funding</span>
                  </div>
                </label>
                
                <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    {...register('partialFundingApproach')}
                    value="need_to_ask"
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-sm">I need to ask my parents</span>
                  </div>
                </label>
              </div>
              
              {errors.partialFundingApproach && (
                <p className="text-sm text-red-500 italic">Please answer this question</p>
              )}
            </div>
          </>
        )}

        {/* PARENT-SPECIFIC QUESTIONS */}
        {isParent && (
          <>
            {/* Financial Planning Question - Parent Only */}
            <div className="space-y-3 bg-white rounded-lg p-5 shadow-sm border border-gray-100">
              <Label className="text-sm font-medium text-primary">While 100% scholarship is ideal, it is quite hard for undergrad applications unless your child has a stellar profile. If your preferred university offers admission with partial funding, what would be your approach?</Label>
              
              <div className="space-y-2 mt-3">
                <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    {...register('partialFundingApproach')}
                    value="accept_loans"
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-sm">Accept and find ways to cover remaining costs using loans</span>
                  </div>
                </label>
                
                <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    {...register('partialFundingApproach')}
                    value="defer_scholarships"
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-sm">Defer to following year and apply for additional external scholarships</span>
                  </div>
                </label>
                
                <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    {...register('partialFundingApproach')}
                    value="affordable_alternatives"
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-sm">Consider more affordable university alternatives</span>
                  </div>
                </label>
                
                <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    {...register('partialFundingApproach')}
                    value="only_full_funding"
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-sm">Would only proceed with full funding</span>
                  </div>
                </label>
              </div>
              
              {errors.partialFundingApproach && (
                <p className="text-sm text-red-500 italic">Please answer this question</p>
              )}
            </div>
          </>
        )}

        {/* Profile Interest Question - for both parent and student */}
        <div className="space-y-3 bg-white rounded-lg p-5 shadow-sm border border-gray-100">
          <Label className="text-sm font-medium text-primary">{profileQuestion.title}</Label>
          
          <div className="space-y-2 mt-3">
            {profileQuestion.options.map((option) => (
              <label key={option.value} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  {...register('strongProfileIntent')}
                  value={option.value}
                  className="mt-0.5"
                />
                <div>
                  <span className="text-sm">{option.label}</span>
                </div>
              </label>
            ))}
          </div>
          
          {errors.strongProfileIntent && (
            <p className="text-sm text-red-500 italic">Please answer this question</p>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={handleBack}
          className="bg-gray-100 text-gray-700 h-14 px-8 rounded-lg text-base font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center space-x-2"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Previous</span>
        </button>
        <button
          type="submit"
          className="bg-accent text-primary h-14 px-8 rounded-lg text-base font-semibold hover:bg-accent-light transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2"
        >
          <span>Proceed</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}