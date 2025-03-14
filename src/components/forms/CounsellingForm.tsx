import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ChevronLeft, Calendar } from 'lucide-react';
import { Label } from '../ui/label';
import { LeadCategory } from '@/types/form';

// Step 3: Counselling Booking Schema
const counsellingSchema = z.object({
  selectedDate: z.string().optional(),
  selectedSlot: z.string().optional(),
});

export type CounsellingData = z.infer<typeof counsellingSchema>;

interface CounsellingFormProps {
  onSubmit: (data: CounsellingData) => void;
  onBack: () => void;
  defaultValues?: {
    phoneNumber?: string;
    email?: string;
  };
  leadCategory?: LeadCategory;
}

export function CounsellingForm({ onSubmit, onBack, leadCategory }: CounsellingFormProps) {
  // Determine which calendar to show based on lead category
  const isBCH = leadCategory === 'BCH';
  
  const {
    handleSubmit,
  } = useForm<CounsellingData>({
    resolver: zodResolver(counsellingSchema),
    defaultValues: {}
  });

  // Ensure we scroll to the top when this form loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Auto-submit form when calendar event is completed
  // The form completion is tracked through the iframe messaging and handled automatically

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-semibold text-primary">Meet Your Counsellor & Schedule a Session</h3>
        </div>
        
        <p className="text-gray-700 mb-4">
          Based on your profile, we believe you have strong potential for admission to elite universities. 
          To maximize your chances, we invite you to a complimentary 1-on-1 counselling session with one of our founders.
        </p>
      </div>

      {/* Founder Profile Section */}
      <div className="bg-gray-50 rounded-xl p-6 mb-6">
        <h4 className="text-lg font-semibold text-primary mb-4">Your Dedicated Counsellor</h4>
        
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden shrink-0 mx-auto md:mx-0">
            <img 
              src={isBCH ? "/vishy.png" : "/karthik.png"} 
              alt={isBCH ? "Viswanathan" : "Karthik"} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div>
            <h5 className="text-lg font-semibold mb-2 text-center md:text-left">
              {isBCH ? "Viswanathan" : "Karthik Lakshman"}
            </h5>
            <p className="text-sm text-gray-700 leading-relaxed">
              {isBCH ? (
                "Viswanathan, or Vishy as he is known, has an engineering degree from IIT-BHU and management degree from IIM Kozhikode. Vishy is passionate about making high quality education accessible to all and has been on this mission since 2008. Between 2008-2012, he was part of the leadership team at Tutorvista Global, which built out a chain of 36 K-12 schools in India, acquired by Pearson Education in 2012. Subsequently, he founded Magic Crate, a start-up focussed on early learning in children, that was acquired by Byju's in 2021. At Byju's, Vishy ran the online tuitions business and served as Chief Product Officer."
              ) : (
                "Karthik did his undergraduate education in India and subsequently earned a Masters in Industrial Engineering from Georgia Tech, the No 1 ranked school for the discipline. He subsequently worked with Coke and McKinsey, world's leading strategic advisory firm, in the US. He later returned to India and founded Magic Crate, an early learning start-up. After The acquisition of Magic Crate by Byju's, he served as the P&L head for Byju's Test Prep division. Having gone to a top US university and seen the doors it has opened for him first-hand, he is determined to bring the best of the resources to Indian students so that they can pursue their dreams unhindered."
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Google Calendar Scheduling Integration */}
      <div className="mt-6">
        <Label className="text-lg font-medium">Book Your Counselling Session</Label>
        <p className="text-sm text-gray-600 mb-2">
          Select a convenient date and time for your session with {isBCH ? "Viswanathan" : "Karthik"}
        </p>
        
        <div className="relative rounded-lg overflow-hidden border shadow-sm mt-4">
          {/* Google Calendar Appointment Scheduling iframe */}
          <iframe 
            src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ1w2IGqwbng3SLqzc2vTpz3Eo89nueT8_nSX5FTi4fxEAIikDRO70a3an30FbGIknzG2O5_FH9x?gv=true" 
            style={{ border: 0 }} 
            width="100%" 
            height="600" 
            frameBorder="0"
            title="Select a Counselling Slot"
            className="w-full"
          ></iframe>
        </div>
        
        <p className="text-sm text-gray-600 mt-2 italic">
          After making your booking, your application is automatically submitted.
        </p>
      </div>

      <div className="flex justify-start mt-8 sticky bottom-0 bg-white pt-4 pb-2 -mx-8 px-8 shadow-[0_-8px_16px_rgba(0,0,0,0.05)]">
        <button
          type="button"
          onClick={onBack}
          className="bg-gray-100 text-gray-700 h-12 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center space-x-2"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Previous</span>
        </button>
      </div>
    </div>
  );
}