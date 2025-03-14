import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SequentialLoadingAnimationProps {
  onComplete: () => void;
  steps: Array<{
    message: string;
    duration: number;
  }>;
  className?: string;
}

export function SequentialLoadingAnimation({
  onComplete,
  steps,
  className
}: SequentialLoadingAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  useEffect(() => {
    let timeoutIds: number[] = [];
    
    // Sequential timing for each step
    const startAnimation = () => {
      let cumulativeTime = 0;
      
      steps.forEach((step, index) => {
        // Set timeout for starting this step
        const startStepTimeout = window.setTimeout(() => {
          setCurrentStep(index);
        }, cumulativeTime);
        
        timeoutIds.push(startStepTimeout);
        
        // Accumulate the duration for the next step
        cumulativeTime += step.duration;
      });
      
      // Final timeout to complete the animation
      const completionTimeout = window.setTimeout(() => {
        onComplete();
      }, cumulativeTime + 300); // Add a small buffer
      
      timeoutIds.push(completionTimeout);
    };
    
    startAnimation();
    
    // Cleanup all timeouts on unmount
    return () => {
      timeoutIds.forEach(id => window.clearTimeout(id));
    };
  }, [steps, onComplete]);
  
  return (
    <div className={cn(
      "relative z-20 bg-white/95 backdrop-blur-md rounded-xl shadow-lg p-8",
      className
    )}>
      <div className="space-y-10 w-full max-w-md mx-auto">
        <div className="mb-6 text-center">
          <h3 className="text-lg font-medium text-primary mb-2">Analyzing Your Profile</h3>
          <p className="text-sm text-gray-500">Please wait while we evaluate your information</p>
        </div>
        
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={cn(
              "transition-all duration-500",
              index < currentStep ? "opacity-60" : 
              index === currentStep ? "opacity-100" : 
              "opacity-30"
            )}
          >
            {/* Visual Step Indicator */}
            <div className="flex items-center gap-3 mb-4">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center border-2",
                index < currentStep ? "border-green-500 bg-green-50 text-green-600" :
                index === currentStep ? "border-primary bg-primary/10 text-primary" :
                "border-gray-300 bg-gray-50 text-gray-400"
              )}>
                {index < currentStep ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              
              <span className={cn(
                "text-sm font-medium flex-1",
                index < currentStep ? "text-green-600" :
                index === currentStep ? "text-primary" :
                "text-gray-400"
              )}>
                {step.message}
              </span>
            </div>
            
            {/* Progress bar - only visible for current step */}
            {index === currentStep && (
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden ml-11">
                <div 
                  className="h-full bg-primary rounded-full origin-left"
                  style={{
                    animation: `progressGrow ${step.duration}ms linear forwards`
                  }}
                />
              </div>
            )}
            
            {/* Pulsing dots - only shown for current step */}
            {index === currentStep && (
              <div className="flex items-center gap-1 mt-2 ml-11">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-dot1"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-dot2"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-dot3"></div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <style>{`
        @keyframes progressGrow {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}