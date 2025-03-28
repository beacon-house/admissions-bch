import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ChevronRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { cn } from '@/lib/utils';

// Step 1: Initial Contact Schema
const personalDetailsSchema = z.object({
  currentGrade: z.enum(['12', '11', '10', '9', '8', '7_below', 'masters']),
  formFillerType: z.enum(['parent', 'student']),
  studentFirstName: z.string().min(2, 'First name is required'),
  studentLastName: z.string().min(1, 'Last name is required'),
  parentName: z.string().min(2, 'Parent name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().regex(/^[0-9]{10}$/, 'Invalid phone number'),
  whatsappConsent: z.boolean().default(true)
});

export type PersonalDetailsData = z.infer<typeof personalDetailsSchema>;

interface PersonalDetailsFormProps {
  onSubmit: (data: PersonalDetailsData) => void;
  defaultValues?: Partial<PersonalDetailsData>;
}

export function PersonalDetailsForm({ onSubmit, defaultValues }: PersonalDetailsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PersonalDetailsData>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <h3 className="text-xl font-semibold text-primary">Personal Details</h3>
      </div>
      
      <div className="space-y-2">
        <Label>Are you the parent or the student?</Label>
        <Select onValueChange={(value) => setValue('formFillerType', value as PersonalDetailsData['formFillerType'])}>
          <SelectTrigger className="h-12 bg-white">
            <SelectValue placeholder="Select who is filling the form" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="parent">I am the Parent</SelectItem>
            <SelectItem value="student">I am the Student</SelectItem>
          </SelectContent>
        </Select>
        {errors.formFillerType && (
          <p className="text-sm text-red-500 italic">Please answer this question</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Grade in Academic Year 25-26</Label>
        <Select onValueChange={(value) => setValue('currentGrade', value as PersonalDetailsData['currentGrade'])}>
          <SelectTrigger className="h-12 bg-white">
            <SelectValue placeholder="Select Grade in Academic Year 25-26" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="12">Grade 12</SelectItem>
            <SelectItem value="11">Grade 11</SelectItem>
            <SelectItem value="10">Grade 10</SelectItem>
            <SelectItem value="9">Grade 9</SelectItem>
            <SelectItem value="8">Grade 8</SelectItem>
            <SelectItem value="7_below">Grade 7 or below</SelectItem>
            <SelectItem value="masters">Apply for Masters</SelectItem>
          </SelectContent>
        </Select>
        {errors.currentGrade && (
          <p className="text-sm text-red-500 italic">Please answer this question</p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="studentFirstName">Student's First Name</Label>
          <Input
            placeholder="Enter student's first name"
            id="studentFirstName"
            {...register('studentFirstName')}
            className={cn(
              "h-12 bg-white",
              errors.studentFirstName ? 'border-red-500 focus:border-red-500' : ''
            )}
          />
          {errors.studentFirstName && (
            <p className="text-sm text-red-500 italic">Please answer this question</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="studentLastName">Student's Last Name</Label>
          <Input
            placeholder="Enter student's last name"
            id="studentLastName"
            {...register('studentLastName')}
            className={cn(
              "h-12 bg-white",
              errors.studentLastName ? 'border-red-500 focus:border-red-500' : ''
            )}
          />
          {errors.studentLastName && (
            <p className="text-sm text-red-500 italic">Please answer this question</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="parentName">Parent's Name</Label>
        <Input
          placeholder="Enter parent's full name"
          id="parentName"
          {...register('parentName')}
          className={cn(
            "h-12 bg-white",
            errors.parentName ? 'border-red-500 focus:border-red-500' : ''
          )}
        />
        {errors.parentName && (
          <p className="text-sm text-red-500 italic">Please answer this question</p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="email">Parent's Email</Label>
          <Input
            placeholder="Enter parent's email address"
            id="email"
            type="email"
            {...register('email')}
            className={cn(
              "h-12 bg-white",
              errors.email ? 'border-red-500 focus:border-red-500' : ''
            )}
          />
          {errors.email && (
            <p className="text-sm text-red-500 italic">Please enter a valid email address</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            placeholder="10 digit mobile number"
            id="phoneNumber"
            {...register('phoneNumber')}
            className={cn(
              "h-12 bg-white",
              errors.phoneNumber ? 'border-red-500 focus:border-red-500' : ''
            )}
          />
          {errors.phoneNumber && (
            <p className="text-sm text-red-500 italic">Please enter a valid 10-digit phone number</p>
          )}
          <div className="mt-2">
            <label className="flex items-center space-x-2 text-sm text-gray-600">
              <input
                type="checkbox"
                {...register('whatsappConsent')}
                defaultChecked={true}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span>I agree to receive updates via WhatsApp</span>
            </label>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-8">
        <button
          type="submit"
          className="bg-accent text-primary h-14 px-8 rounded-lg text-lg font-semibold hover:bg-accent-light transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2"
        >
          <span>Continue</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}