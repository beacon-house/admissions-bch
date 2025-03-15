import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LoadingInterstitialProps {
  onComplete: () => void;
  messages: string[];
  duration?: number; // Total duration in milliseconds
  className?: string;
}

export function LoadingInterstitial({
  onComplete,
  messages,
  duration = 3000,
  className
}: LoadingInterstitialProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  
  // Calculate time per message
  const timePerMessage = duration / messages.length;
  
  useEffect(() => {
    // Start the progress animation
    const animationInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / (duration / 100));
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 100);
    
    // Handle message cycling
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => {
        const nextIndex = prev + 1;
        return nextIndex < messages.length ? nextIndex : prev;
      });
    }, timePerMessage);
    
    // Complete after duration
    const timeoutId = setTimeout(() => {
      onComplete();
    }, duration);
    
    // Clean up
    return () => {
      clearInterval(animationInterval);
      clearInterval(messageInterval);
      clearTimeout(timeoutId);
    };
  }, [duration, messages.length, onComplete, timePerMessage]);
  
  return (
    <div className={cn(
      "fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm transition-opacity", 
      className
    )}>
      <div className="w-full max-w-md px-4 text-center space-y-6">
        {/* Spinner */}
        <div className="w-16 h-16 mx-auto border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        
        {/* Current message */}
        <div className="h-20 flex items-center justify-center">
          <p 
            key={currentMessageIndex} 
            className="text-xl font-medium text-primary animate-fadeIn"
          >
            {messages[currentMessageIndex]}
          </p>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
          <div 
            className="bg-primary h-2.5 rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}