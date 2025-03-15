import React, { useEffect, useState, useRef } from 'react';
import { Progress } from '../ui/progress';
import { PersonalDetailsForm } from './PersonalDetailsForm';
import { AcademicDetailsForm } from './AcademicDetailsForm';
import { MastersAcademicDetailsForm } from './MastersAcademicDetailsForm';
import { CounsellingForm } from './CounsellingForm';
import { SequentialLoadingAnimation } from '../ui/SequentialLoadingAnimation';
import { useFormStore } from '@/store/formStore';
import { trackFormView, trackFormStepComplete, trackFormAbandonment, trackFormError } from '@/lib/analytics';
import { trackPixelEvent, PIXEL_EVENTS } from '@/lib/pixel';
import { submitFormData, validateForm, FormValidationError } from '@/lib/form';
import { determineLeadCategory } from '@/lib/leadCategorization';
import { toast } from '@/components/ui/toast';

export default function FormContainer() {
  const {
    currentStep,
    formData,
    isSubmitting,
    isSubmitted,
    startTime,
    setStep,
    updateFormData,
    setSubmitting,
    setSubmitted
  } = useFormStore();

  const containerRef = useRef<HTMLDivElement>(null);

  // State for the evaluation interstitial
  const [showEvaluationAnimation, setShowEvaluationAnimation] = useState(false);
  const [evaluatedLeadCategory, setEvaluatedLeadCategory] = useState<string | null>(null);
  const [compactForm, setCompactForm] = useState(false);

  const onSubmitStep1 = async (data: any) => {
    try {
      await validateForm(1, data);
      updateFormData(data);
      
      trackPixelEvent({
        name: PIXEL_EVENTS.FORM_PAGE1,
        options: { grade: data.currentGrade }
      });
      trackFormStepComplete(1);
      
      // If grade 7 or below, submit form immediately
      if (data.currentGrade === '7_below') {
        setSubmitting(true);
        await submitFormData(data, 1, startTime);
        setSubmitting(false);
        setSubmitted(true);
        return;
      }
      
      window.scrollTo(0, 0);
      setStep(2);
    } catch (error) {
      if (error instanceof FormValidationError) {
        Object.values(error.errors).forEach(messages => {
          messages.forEach(message => toast.error(message));
        });
      } else {
        console.error('Error submitting form:', error);
        toast.error(error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.');
        trackFormError(1, 'submission_error');
      }
      setSubmitting(false);
    }
  };

  const onSubmitStep2 = async (data: any) => {
    try {
      // For masters applications, we have different form validation
      if (formData.currentGrade === 'masters') {
        // We don't need to validate here as the form components handle validation
      } else {
        await validateForm(2, data);
      }
      
      // Combine form data
      const finalData = { ...formData, ...data };
      
      // Determine lead category
      const leadCategory = formData.currentGrade === 'masters' 
        ? 'MASTERS' 
        : determineLeadCategory(
            finalData.currentGrade,
            finalData.formFillerType,
            finalData.scholarshipRequirement,
            finalData.curriculumType,
            finalData.targetUniversityRank
          );
      
      // Save lead category to state
      setEvaluatedLeadCategory(leadCategory);
      
      // Update form store with lead category and new data
      updateFormData({ 
        ...data,
        lead_category: leadCategory 
      });
      
      trackPixelEvent({
        name: PIXEL_EVENTS.FORM_PAGE2,
        options: { 
          lead_category: leadCategory,
          is_masters: formData.currentGrade === 'masters'
        }
      });
      
      // Different flows based on lead category
      if (leadCategory === 'NURTURE') {
        // For NURTURE leads, submit directly
        setSubmitting(true);
        await submitFormData({ ...finalData, lead_category: leadCategory }, 2, startTime, true);
        setSubmitting(false);
        setSubmitted(true);
      } else {
        // For non-NURTURE leads, show evaluation animation
        window.scrollTo(0, 0);
        setSubmitting(true);
        setShowEvaluationAnimation(true);
        setTimeout(() => {
          handleEvaluationComplete();
        }, 10000); // 10 seconds for evaluation animation
      }
    } catch (error) {
      if (error instanceof FormValidationError) {
        Object.values(error.errors).forEach(messages => {
          messages.forEach(message => toast.error(message));
        });
      } else {
        console.error('Error submitting form:', error);
        toast.error(error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.');
        trackFormError(2, 'submission_error');
      }
      setSubmitting(false);
    }
  };

  const onSubmitStep3 = async (data: any) => {
    try {
      setSubmitting(true);
      
      // Prepare final data for submission
      const finalData = {
        ...formData,
        counselling: {
          selectedDate: data.selectedDate,
          selectedSlot: data.selectedSlot
        }
      };
      
      trackPixelEvent({
        name: PIXEL_EVENTS.FORM_COMPLETE,
        options: { 
          lead_category: formData.lead_category,
          counselling_booked: Boolean(data.selectedDate && data.selectedSlot),
          is_masters: formData.currentGrade === 'masters'
        }
      });
      
      // Submit all form data including counselling details
      await submitFormData(finalData, 3, startTime, true);
      
      setSubmitting(false);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.');
      trackFormError(3, 'submission_error');
      setSubmitting(false);
    }
  };

  // Handle completion of evaluation animation
  const handleEvaluationComplete = () => {
    setShowEvaluationAnimation(false);
    setCompactForm(false);
    setSubmitting(false);
    setStep(3);
    trackFormStepComplete(2);
  };

  const getStepProgress = () => {
    switch (currentStep) {
      case 1: return 33;
      case 2: return 66;
      case 3: return 100;
      default: return 0;
    }
  };
  
  useEffect(() => {
    trackFormView();
    return () => {
      if (!isSubmitted) {
        trackFormAbandonment(currentStep, startTime);
      }
    };
  }, [currentStep, isSubmitted, startTime]);

  // Evaluation steps for the animation - longer durations for a more relaxed pace
  const evaluationSteps = [
    {
      message: `Analyzing your ${formData.currentGrade === 'masters' ? 'profile and program fit' : 'academic profile and curriculum fit'}`,
      duration: 3500
    },
    {
      message: `Processing ${formData.currentGrade === 'masters' ? 'graduate admission criteria' : 'admission criteria and program compatibility'}`,
      duration: 3500
    },
    {
      message: `Connecting you with our Beacon House admission experts`,
      duration: 3500
    }
  ];

  // Determine if we're handling a masters application
  const isMastersApplication = formData.currentGrade === 'masters';

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-primary mb-4">
          Thank You for Your Interest
        </h3>
        <div className="max-w-lg text-gray-600">
          <p>{(formData.currentGrade === '7_below')
            ? "We appreciate you taking the time to share your profile with us. Our admissions team shall get in touch."
            : (formData.counselling?.selectedDate && formData.counselling?.selectedSlot)
              ? `We've scheduled your counselling session for ${formData.counselling.selectedDate} at ${formData.counselling.selectedSlot}. Our team will contact you soon to confirm.`
              : "We appreciate you taking the time to share your profile with us. Our admissions team will reach out to you within the next 24 hours."
          }</p>
        </div>
      </div>
    );
  }

  if (isSubmitting && !showEvaluationAnimation) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-pulse text-2xl font-semibold mb-4 text-primary">
          Processing Your Application
        </div>
        <p className="text-center text-gray-600 max-w-md">
          Please wait while we securely submit your application...
        </p>
      </div>
    );
  }

  return (
    <div id="qualification-form" className="animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8">
          {isMastersApplication ? "Transform Your Masters Journey" : "Transform Your Journey to Elite Universities"}
        </h2>
        <Progress value={getStepProgress()} className="mb-4" />
      </div>

      {/* Loading animation */}
      {showEvaluationAnimation && (
        <SequentialLoadingAnimation
          steps={evaluationSteps}
          onComplete={handleEvaluationComplete}
        />
      )}
      
      {!showEvaluationAnimation && (
        <div 
          ref={containerRef}
          className={`relative space-y-8 transition-all duration-300 ease-in-out mx-auto px-4 sm:px-8 md:px-12 ${currentStep === 3 ? 'max-w-full' : 'max-w-full md:max-w-4xl'}`}
        >
          {currentStep === 1 && (
            <PersonalDetailsForm
              onSubmit={onSubmitStep1}
              defaultValues={formData}
            />
          )}

          {currentStep === 2 && isMastersApplication && (
            <MastersAcademicDetailsForm
              onSubmit={onSubmitStep2}
              onBack={() => setStep(1)}
              defaultValues={formData}
            />
          )}

          {currentStep === 2 && !isMastersApplication && (
            <AcademicDetailsForm
              onSubmit={onSubmitStep2}
              onBack={() => setStep(1)}
              defaultValues={formData}
            />
          )}

          {currentStep === 3 && (
            <CounsellingForm
              onSubmit={onSubmitStep3}
              leadCategory={formData.lead_category}
            />
          )}
        </div>
      )}
    </div>
  );
}