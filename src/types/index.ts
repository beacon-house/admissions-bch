export interface LeadFormData {
  // Page 1 - Initial Contact
  name: string;
  email: string;
  phone: string;
  
  // Page 2 - Academic Qualification
  currentGrade: string;
  schoolName: string;
  curriculum: string;
  academicPerformance: string;
  studyAbroadPriority: string;
  
  // Page 3 - Commitment & Investment
  preferredCountries: string[];
  budget: string;
  scholarshipRequirement: string;
  timeline: string;
}

export interface LeadScore {
  academicScore: number;
  commitmentScore: number;
  totalScore: number;
  group: 'select' | 'waitlist' | 'nurture';
}