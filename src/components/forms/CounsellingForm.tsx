import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Calendar, Award, ChevronRight, Clock, Linkedin } from 'lucide-react';
import { Label } from '../ui/label';
import { LeadCategory } from '@/types/form';
import { cn } from '@/lib/utils';
import { trackPixelEvent, PIXEL_EVENTS } from '@/lib/pixel';

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
  // Determine which counselor to show based on lead category
  const isBCH = leadCategory === 'bch';
  const counselorName = isBCH ? "Viswanathan" : "Karthik Lakshman";
  const counselorImage = isBCH ? "/vishy.png" : "/karthik.png";
  const linkedinUrl = isBCH 
    ? "https://www.linkedin.com/in/viswanathan-r-8504182/" 
    : "https://www.linkedin.com/in/karthiklakshman/";
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [calendarDates, setCalendarDates] = useState<Date[]>([]);
  const [allCalendarDates, setAllCalendarDates] = useState<Date[]>([]);
  
  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting }
  } = useForm<CounsellingData>({
    resolver: zodResolver(counsellingSchema),
    defaultValues: {}
  });

  // Generate the 7-day calendar starting from today, plus additional days (shown as locked)
  useEffect(() => {
    const today = new Date();
    
    // Next seven days (available)
    const nextSevenDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return date;
    });
    
    // Additional days (shown as locked)
    const additionalDays = Array.from({ length: 14 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i + 7);
      return date;
    });
    
    setCalendarDates(nextSevenDays);
    setAllCalendarDates([...nextSevenDays, ...additionalDays]);
    
    // Default to selecting today
    setSelectedDate(today);
    
    // Track counselling form view when component mounts
    if (leadCategory) {
      // Safe check - only call if function exists
      if (PIXEL_EVENTS.getPage3ViewEvent) {
        trackPixelEvent({
          name: PIXEL_EVENTS.getPage3ViewEvent(leadCategory),
          options: {
            lead_category: leadCategory,
            counsellor_name: counselorName,
            form_loaded_timestamp: new Date().toISOString()
          }
        });
      }
    }
  }, [leadCategory, counselorName]);

  // Generate available time slots (10 AM to 8 PM, except 2-3 PM)
  // Filter out slots that are less than 2 hours from current time
  const getTimeSlots = () => {
    const now = new Date();
    const today = new Date().setHours(0, 0, 0, 0);
    const selectedDay = selectedDate ? selectedDate.setHours(0, 0, 0, 0) : null;
    const isToday = today === selectedDay;
    
    // Get current hour and add 2 hours for minimum buffer
    const currentHour = now.getHours();
    const minHour = isToday ? currentHour + 2 : 10; // If today, slots must be at least 2 hours from now
    
    const slots = [];
    for (let hour = 10; hour <= 20; hour++) {
      // Skip the 2 PM slot (blackout period)
      if (hour !== 14) {
        // Skip if the hour is less than minHour for today
        if (!isToday || hour >= minHour) {
          // Special case for 12 PM (noon)
          const formattedHour = hour === 12 ? "12 PM" : (hour > 12 ? `${hour - 12} PM` : `${hour} AM`);
          slots.push(formattedHour);
        }
      }
    }
    return slots;
  };

  const timeSlots = getTimeSlots();

  const handleDateSelect = (date: Date) => {
    // Only allow selection of dates within the next 7 days
    const today = new Date();
    const maxSelectableDate = new Date(today);
    maxSelectableDate.setDate(today.getDate() + 6);
    
    if (date <= maxSelectableDate) {
      setSelectedDate(date);
      setSelectedTimeSlot(null); // Reset time slot when date changes
    }
  };

  const handleTimeSlotSelect = (slot: string) => {
    setSelectedTimeSlot(slot);
    // Format the date for submission
    if (selectedDate) {
      const formattedDate = selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      setValue('selectedDate', formattedDate);
      setValue('selectedSlot', slot);
    }
  };

  const handleFormSubmit = (data: CounsellingData) => {
    window.scrollTo(0, 0);
    onSubmit(data);
  };

  // Format date for display
  const formatDateDisplay = (date: Date) => {
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' })
    };
  };

  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  // Check if a date is within the selectable range (next 7 days)
  const isSelectable = (date: Date) => {
    const today = new Date();
    const maxSelectableDate = new Date(today);
    maxSelectableDate.setDate(today.getDate() + 6);
    
    return date <= maxSelectableDate;
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        {/* Enhanced Counselor Profile Card */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 mb-8 shadow-md border border-primary/10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <img 
                src={counselorImage} 
                alt={counselorName} 
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 bg-accent text-primary p-1 rounded-full shadow-sm">
                <Award className="w-5 h-5" />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xl font-bold text-primary">
                  Your Session With {counselorName}
                </h4>
                <a 
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
              </div>
              
              <div className="text-gray-700 mb-4">
                {isBCH ? (
                  <>
                    <p className="mb-2 leading-relaxed">
                      Vishy holds degrees from <span className="font-medium">IIT-BHU and IIM Kozhikode</span>. He founded Magic Crate, which was acquired by Byju's where he served as <span className="font-medium">Chief Product Officer</span> and managed their online tuitions business.
                    </p>
                    <p className="leading-relaxed">
                      With extensive experience in education technology and business development, Vishy has successfully mentored hundreds of students who gained admission to top universities worldwide.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="mb-2 leading-relaxed">
                      Karthik earned his Masters from <span className="font-medium">Georgia Tech</span> and worked with <span className="font-medium">Coke and McKinsey</span> in the US. He founded Magic Crate (acquired by Byju's) and later led Byju's Test Prep division.
                    </p>
                    <p className="leading-relaxed">
                      With his international education background and corporate leadership experience, Karthik provides invaluable guidance to students aiming for prestigious universities abroad.
                    </p>
                  </>
                )}
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                <div className="bg-white p-2 rounded-lg flex items-center gap-2 shadow-sm">
                  <div className="bg-accent/20 p-1 rounded">
                    <Award className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-medium">Elite Mentorship</span>
                </div>
                <div className="bg-white p-2 rounded-lg flex items-center gap-2 shadow-sm">
                  <div className="bg-accent/20 p-1 rounded">
                    <Award className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-medium">Personalized Strategy</span>
                </div>
                <div className="bg-white p-2 rounded-lg flex items-center gap-2 shadow-sm">
                  <div className="bg-accent/20 p-1 rounded">
                    <Award className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-medium">Application Review</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Date Selection - Calendar Style with Improved Border */}
        <div className="mb-6 border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-5 w-5 text-primary" />
            <Label className="text-lg font-medium">Select a Date</Label>
          </div>
          
          <div className="grid grid-cols-7 gap-2 mb-2">
            {/* Day labels */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {/* Calculate starting position based on first day of week */}
            {Array.from({ length: allCalendarDates[0]?.getDay() || 0 }, (_, i) => (
              <div key={`empty-${i}`} className="h-14"></div>
            ))}
            
            {/* Calendar days - including both selectable and non-selectable days */}
            {allCalendarDates.map((date, index) => {
              const { day, date: dateNum, month } = formatDateDisplay(date);
              const canSelect = isSelectable(date);
              
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => canSelect && handleDateSelect(date)}
                  disabled={!canSelect}
                  className={cn(
                    "h-14 rounded-lg flex flex-col items-center justify-center border-2 transition-all",
                    selectedDate && date.getDate() === selectedDate.getDate() && date.getMonth() === selectedDate.getMonth()
                      ? "border-primary bg-primary/10 text-primary"
                      : canSelect
                        ? "border-gray-200 hover:border-gray-300"
                        : "border-gray-100 opacity-50 cursor-not-allowed",
                    isToday(date) && "ring-2 ring-accent/30"
                  )}
                >
                  <span className="text-xs font-semibold">{day.charAt(0)}</span>
                  <span className="text-sm font-bold">{dateNum}</span>
                  <span className="text-xs">{month}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Slot Selection - Horizontal for Desktop, Vertical for Mobile */}
        {selectedDate && (
          <div className="mb-8 border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-5 w-5 text-primary" />
              <Label className="text-lg font-medium">
                Available Slots for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </Label>
            </div>
            
            {/* Mobile: Vertical Layout with compact boxes */}
            <div className="md:hidden space-y-2">
              {timeSlots.map((slot, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleTimeSlotSelect(slot)}
                  className={cn(
                    "w-full py-2 px-3 rounded-lg border-2 transition-colors flex justify-center items-center",
                    selectedTimeSlot === slot
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <span className="font-medium text-center">{slot}</span>
                  {selectedTimeSlot === slot && (
                    <div className="ml-2 bg-accent/20 text-primary px-2 py-1 rounded text-xs font-medium">
                      ✓
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Desktop: Horizontal Grid Layout */}
            <div className="hidden md:grid grid-cols-4 lg:grid-cols-6 gap-3">
              {timeSlots.map((slot, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleTimeSlotSelect(slot)}
                  className={cn(
                    "py-3 px-4 rounded-lg border-2 transition-colors flex items-center justify-center",
                    selectedTimeSlot === slot
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <span className="font-medium">{slot}</span>
                  {selectedTimeSlot === slot && (
                    <div className="ml-2 bg-accent/20 text-primary px-2 py-1 rounded text-xs font-medium">
                      ✓
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Booking Confirmation */}
        {selectedTimeSlot && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h5 className="font-medium text-green-800 mb-1">Session Details</h5>
            <p className="text-sm text-green-700">
              You've selected a session with <span className="font-semibold">{counselorName}</span> on {selectedDate?.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })} at {selectedTimeSlot}.
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end mt-8">
          <button
            type="submit"
            disabled={isSubmitting || !selectedTimeSlot}
            className={cn(
              "h-14 px-8 rounded-lg text-lg font-semibold transition-all duration-300 shadow-md flex items-center space-x-2",
              selectedTimeSlot 
                ? "bg-accent text-primary hover:bg-accent-light hover:shadow-lg" 
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            )}
          >
            <span>Submit Application</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}