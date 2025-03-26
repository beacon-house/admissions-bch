import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { ChevronLeft, ChevronRight, BookOpen, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

// Extended Nurture Form Schema
const extendedNurtureSchema = z.object({
  // Shared fields between parent and student
  stepsTaken: z.array(z.string()).min(1, 'Please select at least one option'),
  gradeSpecificQuestion: z.string(),
  targetUniversities: z.string().min(1, 'Please provide at least one university'),
  
  // Student-specific fields (optional when form filler is parent)
  parentalSupport: z.enum(['would_join', 'supportive_limited', 'handle_independently', 'not_discussed']).optional(),
  partialFundingApproach: z.enum(['accept_cover_remaining', 'defer_external_scholarships', 'affordable_alternatives', 'only_full_funding']).optional(),
  
  // Parent-specific fields (optional when form filler is student)
  financialPlanning: z.enum(['savings', 'education_loans', 'external_scholarships', 'liquidate_investments', 'no_specific_plans']).optional(),
  resourceInvestment: z.array(z.string()).optional(),
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
          (data) => !!data.financialPlanning,
          { message: "Please select a financial planning option", path: ["financialPlanning"] }
        ).refine(
          (data) => !!data.resourceInvestment && data.resourceInvestment.length > 0,
          { message: "Please select at least one resource investment option", path: ["resourceInvestment"] }
        );
      } else {
        // For students, require student-specific fields
        schema = schema.refine(
          (data) => !!data.parentalSupport,
          { message: "Please select a parental support option", path: ["parentalSupport"] }
        ).refine(
          (data) => !!data.partialFundingApproach,
          { message: "Please select a funding approach option", path: ["partialFundingApproach"] }
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
      ...defaultValues,
      stepsTaken: defaultValues?.stepsTaken || [],
      resourceInvestment: defaultValues?.resourceInvestment || []
    }
  });

  // Get the grade-specific question based on current grade (same for both parent and student)
  const getGradeSpecificQuestion = () => {
    // The title prefix changes based on whether the form filler is a parent or student
    const titlePrefix = isParent ? "Your child is " : "You're ";
    
    if (currentGrade === '9' || currentGrade === '10') {
      return {
        title: `${titlePrefix}starting this journey early – that's fantastic! This is a great time to begin building a strong profile. ${isParent ? "Would your child" : "Would you"} be interested in support for any of the following?`,
        options: [
          { value: 'research_paper', label: 'Research Paper' },
          { value: 'capstone_project', label: 'Capstone Project' },
          { value: 'extracurricular', label: 'Extracurricular Development' },
          { value: 'internship', label: 'Internship' },
          { value: 'all', label: 'All of the above' },
          { value: 'need_help', label: 'Interested, But need help figuring out what I need' },
          { value: 'academics_focus', label: 'Aiming for minimal profile-building activities, prioritizing academics instead' }
        ]
      };
    } else if (currentGrade === '11') {
      return {
        title: `${titlePrefix}in a critical phase of building ${isParent ? "their" : "your"} university profile. Would ${isParent ? "they" : "you"} like help with any of the following?`,
        options: [
          { value: 'research_paper', label: 'Research Paper' },
          { value: 'capstone_project', label: 'Capstone Project' },
          { value: 'extracurricular', label: 'Extracurricular Development' },
          { value: 'internship', label: 'Internship' },
          { value: 'all', label: 'All of the above' },
          { value: 'need_help', label: 'Interested, But need help figuring out what I need' },
          { value: 'academics_focus', label: 'Aiming for minimal profile-building activities, prioritizing academics instead' }
        ]
      };
    } else if (currentGrade === '12') {
      return {
        title: `For ${isParent ? "your child's" : "your"} Grade 12 timeline:`,
        options: [
          { value: 'graduating_2024_25_fall_25', label: `${isParent ? "They're" : "I'm"} graduating in 2024-25 applying for Fall '25` },
          { value: 'graduating_2024_25_fall_26', label: `${isParent ? "They're" : "I'm"} graduating in 2024-25 applying for Fall '26` },
          { value: 'starting_grade_12_2025_26', label: `${isParent ? "They're" : "I'm"} starting Grade 12 in 2025-26` }
        ]
      };
    }
    
    // Default option if grade doesn't match specific conditions
    return {
      title: `What is ${isParent ? "your child's" : "your"} current academic timeline?`,
      options: [
        { value: 'preparing_applications', label: 'Currently preparing applications' },
        { value: 'researching_options', label: 'Researching university options' },
        { value: 'planning_ahead', label: 'Planning ahead for future applications' }
      ]
    };
  };

  const gradeQuestion = getGradeSpecificQuestion();

  const handleBack = () => {
    window.scrollTo(0, 0);
    onBack();
  };

  const handleFormSubmit = (data: ExtendedNurtureData) => {
    window.scrollTo(0, 0);
    onSubmit(data);
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
                    <span className="text-sm">They're supportive but have limited availability</span>
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
                <p className="text-sm text-red-500 italic">{errors.parentalSupport?.message?.toString() || "Please select an option"}</p>
              )}
            </div>

            {/* Partial Funding Approach - Student Only */}
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
                    <span className="text-sm">Defer and apply for additional external scholarships</span>
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
                <p className="text-sm text-red-500 italic">{errors.partialFundingApproach?.message?.toString() || "Please select an option"}</p>
              )}
            </div>
          </>
        )}

        {/* PARENT-SPECIFIC QUESTIONS */}
        {isParent && (
          <>
            {/* Financial Planning Question - Parent Only */}
            <div className="space-y-3 bg-white rounded-lg p-5 shadow-sm border border-gray-100">
              <Label className="text-sm font-medium text-primary">Beyond scholarships, how are you planning for your child's international education finances?</Label>
              
              <div className="space-y-2 mt-3">
                <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    {...register('financialPlanning')}
                    value="savings"
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-sm">We've set aside some savings</span>
                  </div>
                </label>
                
                <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    {...register('financialPlanning')}
                    value="education_loans"
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-sm">We're exploring education loans</span>
                  </div>
                </label>
                
                <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    {...register('financialPlanning')}
                    value="external_scholarships"
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-sm">We're researching external scholarship opportunities</span>
                  </div>
                </label>
                
                <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    {...register('financialPlanning')}
                    value="liquidate_investments"
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-sm">We're planning to liquidate investments if needed</span>
                  </div>
                </label>
                
                <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    {...register('financialPlanning')}
                    value="no_specific_plans"
                    className="mt-0.5"
                  />
                  <div>
                    <span className="text-sm">We have not made specific financial plans yet</span>
                  </div>
                </label>
              </div>
              
              {errors.financialPlanning && (
                <p className="text-sm text-red-500 italic">{errors.financialPlanning?.message?.toString() || "Please select an option"}</p>
              )}
            </div>
          </>
        )}

        {/* Steps Taken - Checkbox Group - Adjusted for Parent/Student */}
        <div className="space-y-3 bg-white rounded-lg p-5 shadow-sm border border-gray-100">
          <Label className="text-sm font-medium text-primary">
            {isParent ? "Which steps has your child already taken?" : "Which steps have you already taken?"} (Select all that apply)
          </Label>
          
          {errors.stepsTaken && (
            <p className="text-sm text-red-500 italic mb-2">{errors.stepsTaken?.message?.toString() || "Please select at least one option"}</p>
          )}
          
          <div className="space-y-2 mt-3">
            <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                value="researched_universities"
                {...register('stepsTaken')}
                className="mt-0.5 rounded"
              />
              <div>
                <span className="text-sm">Researched {isParent ? "" : "specific "}universities and{isParent ? "" : " their"} requirements</span>
              </div>
            </label>
            
            <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                value="taken_standardized_tests"
                {...register('stepsTaken')}
                className="mt-0.5 rounded"
              />
              <div>
                <span className="text-sm">Taken/registered for standardized tests (SAT/ACT/TOEFL)</span>
              </div>
            </label>
            
            <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                value="extracurricular_activities"
                {...register('stepsTaken')}
                className="mt-0.5 rounded"
              />
              <div>
                <span className="text-sm">Participated in relevant extracurricular activities</span>
              </div>
            </label>
            
            <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                value="started_essays"
                {...register('stepsTaken')}
                className="mt-0.5 rounded"
              />
              <div>
                <span className="text-sm">Started {isParent ? "application materials" : "essay/personal statement drafts"}</span>
              </div>
            </label>
            
            <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                value="connected_with_students"
                {...register('stepsTaken')}
                className="mt-0.5 rounded"
              />
              <div>
                <span className="text-sm">Connected with current students or alumni</span>
              </div>
            </label>
            
            <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                value="none_yet"
                {...register('stepsTaken')}
                className="mt-0.5 rounded"
              />
              <div>
                <span className="text-sm">None of these yet</span>
              </div>
            </label>
          </div>
        </div>

        {/* Grade-Specific Question */}
        <div className="space-y-3 bg-white rounded-lg p-5 shadow-sm border border-gray-100">
          <Label className="text-sm font-medium text-primary">{gradeQuestion.title}</Label>
          
          <div className="space-y-2 mt-3">
            {gradeQuestion.options.map((option) => (
              <label key={option.value} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  {...register('gradeSpecificQuestion')}
                  value={option.value}
                  className="mt-0.5"
                />
                <div>
                  <span className="text-sm">{option.label}</span>
                </div>
              </label>
            ))}
          </div>
          
          {errors.gradeSpecificQuestion && (
            <p className="text-sm text-red-500 italic">{errors.gradeSpecificQuestion?.message?.toString() || "Please select an option"}</p>
          )}
        </div>

        {/* Target Universities */}
        <div className="space-y-3 bg-white rounded-lg p-5 shadow-sm border border-gray-100">
          <Label htmlFor="targetUniversities" className="text-sm font-medium text-primary">
            {isParent 
              ? "Please name 1-2 specific universities you're considering for your child:" 
              : "Please name 1-2 specific universities you're most interested in:"}
          </Label>
          
          <Input
            id="targetUniversities"
            {...register('targetUniversities')}
            className="h-10 bg-white mt-3"
            placeholder="E.g., Harvard University, Stanford University"
          />
          
          {errors.targetUniversities && (
            <p className="text-sm text-red-500 italic">{errors.targetUniversities?.message?.toString() || "Please provide at least one university"}</p>
          )}
        </div>

        {/* Resource Investment - Parent Only */}
        {isParent && (
          <div className="space-y-3 bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <Label className="text-sm font-medium text-primary">
              What resources are you willing to invest in your child's university preparations? (Select all that apply)
            </Label>
            
            {errors.resourceInvestment && (
              <p className="text-sm text-red-500 italic mb-2">{errors.resourceInvestment?.message?.toString() || "Please select at least one option"}</p>
            )}
            
            <div className="space-y-2 mt-3">
              <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  value="academic_support"
                  {...register('resourceInvestment')}
                  className="mt-0.5 rounded"
                />
                <div>
                  <span className="text-sm">Additional academic support or tutoring</span>
                </div>
              </label>
              
              <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  value="extracurricular_development"
                  {...register('resourceInvestment')}
                  className="mt-0.5 rounded"
                />
                <div>
                  <span className="text-sm">Extracurricular and profile development activities</span>
                </div>
              </label>
              
              <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  value="test_preparation"
                  {...register('resourceInvestment')}
                  className="mt-0.5 rounded"
                />
                <div>
                  <span className="text-sm">Standardized test preparation courses</span>
                </div>
              </label>
              
              <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  value="university_visits"
                  {...register('resourceInvestment')}
                  className="mt-0.5 rounded"
                />
                <div>
                  <span className="text-sm">University visits when possible</span>
                </div>
              </label>
              
              <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  value="dedicated_time"
                  {...register('resourceInvestment')}
                  className="mt-0.5 rounded"
                />
                <div>
                  <span className="text-sm">Dedicated time for application guidance</span>
                </div>
              </label>
              
              <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  value="limited_investment"
                  {...register('resourceInvestment')}
                  className="mt-0.5 rounded"
                />
                <div>
                  <span className="text-sm">Limited additional investment beyond consultancy</span>
                </div>
              </label>
            </div>
          </div>
        )}
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