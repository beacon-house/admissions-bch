import React from 'react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Phone, MessageSquare, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MastersContactMethodsProps {
  register: any;
  errors: any;
  callChecked: boolean;
  whatsappChecked: boolean;
  emailChecked: boolean;
  handleContactMethodChange: (method: 'call' | 'whatsapp' | 'email', checked: boolean) => void;
}

export function MastersContactMethods({
  register,
  errors,
  callChecked,
  whatsappChecked,
  emailChecked,
  handleContactMethodChange
}: MastersContactMethodsProps) {
  return (
    <div className="space-y-4 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <Label className="text-lg font-medium text-primary">How Would You Like Us to Contact You?</Label>
      <p className="text-sm text-gray-600 italic">
        Choose your preferred communication methods (select at least one)
      </p>

      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2 min-w-[140px]">
            <input
              type="checkbox"
              id="callMethod"
              className="rounded border-gray-300 text-primary focus:ring-primary"
              checked={callChecked}
              onChange={(e) => handleContactMethodChange('call', e.target.checked)}
            />
            <Label htmlFor="callMethod" className="mb-0 cursor-pointer flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span>Phone Call</span>
            </Label>
          </div>
          <div className="flex-1">
            <Input
              {...register('contactMethods.callNumber')}
              disabled={!callChecked}
              placeholder="Enter phone number for calls"
              className={cn(
                "h-10 bg-white",
                !callChecked && "bg-gray-100 text-gray-500"
              )}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2 min-w-[140px]">
            <input
              type="checkbox"
              id="whatsappMethod"
              className="rounded border-gray-300 text-primary focus:ring-primary"
              checked={whatsappChecked}
              onChange={(e) => handleContactMethodChange('whatsapp', e.target.checked)}
            />
            <Label htmlFor="whatsappMethod" className="mb-0 cursor-pointer flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gray-500" />
              <span>WhatsApp</span>
            </Label>
          </div>
          <div className="flex-1">
            <Input
              {...register('contactMethods.whatsappNumber')}
              disabled={!whatsappChecked}
              placeholder="Enter WhatsApp number" 
              className={cn(
                "h-10 bg-white",
                !whatsappChecked && "bg-gray-100 text-gray-500"
              )}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2 min-w-[140px]">
            <input
              type="checkbox"
              id="emailMethod"
              className="rounded border-gray-300 text-primary focus:ring-primary"
              checked={emailChecked}
              onChange={(e) => handleContactMethodChange('email', e.target.checked)}
            />
            <Label htmlFor="emailMethod" className="mb-0 cursor-pointer flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span>Email</span>
            </Label>
          </div>
          <div className="flex-1">
            <Input
              {...register('contactMethods.emailAddress')}
              disabled={!emailChecked}
              placeholder="Enter email address"
              className={cn(
                "h-10 bg-white",
                !emailChecked && "bg-gray-100 text-gray-500"
              )}
            />
          </div>
        </div>
        
        {errors.contactMethods && (
          <p className="text-sm text-red-500 italic">Please select at least one contact method</p>
        )}
      </div>
    </div>
  );
}