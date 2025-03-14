import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Calendar, Award, Clock, User } from 'lucide-react';
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
  leadCategory?: LeadCategory;
}

export function CounsellingForm({ onSubmit, leadCategory }: CounsellingFormProps) {
  // Determine which calendar to show based on lead category
  const isBCH = leadCategory === 'BCH';
  const calendarRef = useRef<HTMLIFrameElement>(null);
  
  const {
    handleSubmit,
    setValue,
  } = useForm<CounsellingData>({
    resolver: zodResolver(counsellingSchema),
    defaultValues: {}
  });

  // Ensure we scroll to the top when this form loads
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Set up a message listener to detect calendar booking completion
    const handleCalendarMessage = (event: MessageEvent) => {
      // This is a simplified implementation - in a real-world scenario, you'd want to
      // validate the origin and add more sophisticated parsing of the message
      if (event.data && typeof event.data === 'string' && event.data.includes('appointment-scheduled')) {
        // Extract appointment details from the message - this would need to be
        // customized based on the actual format of the message from Google Calendar
        try {
          // This is a placeholder for parsing the message
          // In reality, you would need to adapt this to the actual message format
          const appointmentData = JSON.parse(event.data.split('appointment-scheduled:')[1]);
          setValue('selectedDate', appointmentData.date || new Date().toLocaleDateString());
          setValue('selectedSlot', appointmentData.time || '12:00 PM');
          
          // Submit the form automatically
          setTimeout(() => {
            onSubmit({
              selectedDate: appointmentData.date || new Date().toLocaleDateString(),
              selectedSlot: appointmentData.time || '12:00 PM'
            });
          }, 1000);
        } catch (error) {
          console.error('Error parsing calendar message:', error);
          // Even if parsing fails, try to submit the form with placeholder data
          onSubmit({
            selectedDate: new Date().toLocaleDateString(),
            selectedSlot: '12:00 PM'
          });
        }
      }
    };
    
    window.addEventListener('message', handleCalendarMessage);
    
    return () => {
      window.removeEventListener('message', handleCalendarMessage);
    };
  }, [onSubmit, setValue]);

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-semibold text-primary">Meet Our Managing Director</h3>
        </div>
        
        <p className="text-gray-700 mb-4">
          Congratulations! Based on your profile, we believe you have excellent potential for admission to elite universities. 
          To maximize your chances, we invite you to a personal strategy session with one of our Managing Directors.
        </p>
      </div>

      {/* Two-column layout for desktop, vertical for mobile */}
      <div className="grid grid-cols-1 md:grid-cols-10 gap-6 mb-6">
        {/* Founder Profile Section - 40% width on desktop */}
        <div className="bg-gray-50 rounded-xl p-4 h-full flex flex-col md:col-span-4">
          <h4 className="text-lg font-semibold text-primary mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-accent" />
            Your Session With
          </h4>
          
          <div className="flex flex-col gap-4 items-center flex-grow">
            <div className="w-28 h-28 rounded-full overflow-hidden shrink-0 border-4 border-accent shadow-lg">
              <img 
                src={isBCH ? "/vishy.png" : "/karthik.png"} 
                alt={isBCH ? "Viswanathan" : "Karthik"}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="text-center">
              <h5 className="text-xl font-semibold mb-2">
                {isBCH ? "Viswanathan" : "Karthik Lakshman"}
              </h5>
              <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
                Managing Director, Beacon House
              </div>
              
              <div className="text-sm text-gray-700 leading-relaxed max-h-36 overflow-y-auto pr-2">
                {isBCH ? (
                  <p>
                    Vishy has degrees from IIT-BHU and IIM Kozhikode. He led Tutorvista Global's expansion to 36 K-12 schools and founded Magic Crate (acquired by Byju's). At Byju's, he served as Chief Product Officer and ran the online tuitions business.
                  </p>
                ) : (
                  <p>
                    Karthik earned his Masters from Georgia Tech and worked with Coke and McKinsey in the US. He founded Magic Crate (acquired by Byju's) and later led Byju's Test Prep division as P&L head. His elite university experience drives his passion to help Indian students achieve global success.
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-auto pt-4 space-y-3">
            <div className="bg-white rounded-lg p-3 shadow-sm flex items-start">
              <Award className="w-5 h-5 text-accent mt-1 mr-3 flex-shrink-0" />
              <div>
                <h6 className="font-medium">Elite University Expertise</h6>
                <p className="text-sm text-gray-600">Gain insider knowledge that maximizes admissions success</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm flex items-start">
              <Clock className="w-5 h-5 text-accent mt-1 mr-3 flex-shrink-0" />
              <div>
                <h6 className="font-medium">Personalized Strategy</h6>
                <p className="text-sm text-gray-600">Get your customized university admissions roadmap</p>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Booking Section - Mobile-optimized */}
        <div className="md:col-span-6">
          {/* For desktop, keep some styling */}
          <div className="hidden md:block p-4 bg-white rounded-xl border-2 border-accent/30 shadow-md mb-3">
            <h4 className="text-lg font-semibold text-primary mb-2 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-accent" />
              Book Your Strategy Session
            </h4>
            <p className="text-sm text-gray-600">
              Select a convenient date and time to meet with {isBCH ? "Viswanathan" : "Karthik"}
            </p>
          </div>
          
          {/* For mobile, minimal header with no borders */}
          <div className="md:hidden mb-2 px-2">
            <h4 className="text-lg font-semibold text-primary flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-accent" />
              Book Your Strategy Session
            </h4>
          </div>
          
          {/* Calendar container - edge-to-edge on mobile */}
          <div className="w-full -mx-4 md:mx-0 md:rounded-lg md:border md:shadow-sm overflow-hidden">
            {isBCH ? (
              <iframe 
                ref={calendarRef}
                src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ2zIu2-c5X26ahjTSkRsCM1ylgz396869XxCVr9CmbaGgQxag_-Laj7HGPcKcsZ4ySW16ocYTnh?gv=true" 
                style={{ border: 0, width: '100%', height: '600px' }}
                frameBorder="0"
                title="Select a Counselling Slot"
                className="w-full min-w-full"
              ></iframe>
            ) : (
              <iframe 
                ref={calendarRef}
                src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ36ypV_jEDk5i6nxMNGpNN5h2xEWm33stJsGB7YU5_SortE8oM9dwQ4Iy0kwbpoKopDkyqerG_H?gv=true" 
                style={{ border: 0, width: '100%', height: '600px' }}
                frameBorder="0"
                title="Select a Counselling Slot"
                className="w-full min-w-full"
              ></iframe>
            )}
          </div>
          
          <div className="mt-3 hidden md:block bg-primary/5 rounded-lg p-3 border border-primary/10">
            <p className="text-sm text-center font-medium">
              After booking your session, your application will be automatically submitted.
            </p>
          </div>
          
          {/* Mobile note - no borders, just text */}
          <div className="mt-3 md:hidden px-2">
            <p className="text-sm text-center font-medium text-gray-700">
              After booking your session, your application will be automatically submitted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}