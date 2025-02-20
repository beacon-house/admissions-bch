import React from 'react';
import { Progress } from './ui/progress';
import { PersonalDetailsForm, type PersonalDetailsData } from './forms/PersonalDetailsForm';
import { AcademicDetailsForm, type AcademicDetailsData } from './forms/AcademicDetailsForm';
import { CommitmentForm, type CommitmentData } from './forms/CommitmentForm';
import {
  determineLeadCategory, submitPartialForm, submitCompleteForm,
  trackFormView, trackFormStepComplete, trackFormAbandonment, trackFormError
} from './QualificationFormLogic';
import { trackPixelEvent, PIXEL_EVENTS } from '@/lib/pixel';

type FormData = PersonalDetailsData & AcademicDetailsData & CommitmentData;

export default function QualificationForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(1);
  const [formData, setFormData] = React.useState<Partial<FormData>>({});
  const startTime = React.useRef(Date.now());

  const onSubmitStep1 = async (data: PersonalDetailsData) => {
    console.log('Step 1 data:', data);
    setFormData({ ...formData, ...data });
    
    trackPixelEvent({
      name: PIXEL_EVENTS.FORM_PAGE1,
      options: { grade: data.currentGrade }
    });
    trackFormStepComplete(1);
    
    // If user is applying for masters or grade 7 below, submit form immediately
    if (data.currentGrade === 'masters' || data.currentGrade === '7_below') {
      setIsSubmitting(true);
      try {
        await submitPartialForm(data, startTime.current);
        setIsSubmitting(false);
        setIsSubmitted(true);
        return;
      } catch (error) {
        console.error('Error submitting form:', error);
        setIsSubmitting(false);
        trackFormError(1, 'database_error');
        return;
      }
    }
    
    setCurrentStep(2);
  };

  const onSubmitStep2 = async (data: AcademicDetailsData) => {
    console.log('Step 2 data:', data);
    setFormData({ ...formData, ...data });
    
    trackPixelEvent({
      name: PIXEL_EVENTS.FORM_PAGE2,
      options: { curriculum: data.curriculumType }
    });
    trackFormStepComplete(2);
    setCurrentStep(3);
  };

  const onSubmitStep3 = async (data: CommitmentData) => {
    console.log('Step 3 data:', data);
    setIsSubmitting(true);
    
    trackPixelEvent({
      name: PIXEL_EVENTS.FORM_PAGE3,
      options: { timeline: data.timelineCommitment }
    });
    
    const finalData = { ...formData, ...data };
    try {
      await submitCompleteForm(finalData, startTime.current);
      setIsSubmitting(false);      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      console.log('Form data that failed:', finalData);
      setIsSubmitting(false);
      trackFormError(3, 'database_error');
    }
  };

  const getStepProgress = () => {
    switch (currentStep) {
      case 1:
        return 33;
      case 2:
        return 66;
      case 3:
        return 100;
      default:
        return 0;
    }
  };
  
  React.useEffect(() => {
    // Track form view when component mounts
    trackFormView();
    
    // Track form abandonment
    return () => {
      if (!isSubmitted) {
        trackFormAbandonment(currentStep, startTime.current);
      }
    };
  }, [currentStep, isSubmitted]);

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
          <p>{(formData.currentGrade === 'masters' || formData.currentGrade === '7_below')
            ? "We appreciate you taking the time to share your profile with us. Our admissions team shall get in touch."
            : "We appreciate you taking the time to share your profile with us. Our admissions team will reach out to you within the next 24 hours."
          }</p>
        </div>
      </div>
    );
  }

  if (isSubmitting) {
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
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Transform Your Journey to Elite Universities</h2>
        <Progress value={getStepProgress()} className="mb-4" />
      </div>

      <div className="space-y-8 bg-white rounded-xl shadow-xl p-8 border border-gray-100">
        {currentStep === 1 && (
          <PersonalDetailsForm
            onSubmit={onSubmitStep1}
            defaultValues={formData}
          />
        )}

        {currentStep === 2 && (
          <AcademicDetailsForm
            onSubmit={onSubmitStep2}
            onBack={() => setCurrentStep(1)}
            defaultValues={formData}
          />
        )}

        {currentStep === 3 && (
          <CommitmentForm
            onSubmit={onSubmitStep3}
            onBack={() => setCurrentStep(2)}
            defaultValues={formData}
          />
        )}
      </div>
    </div>
  );
}