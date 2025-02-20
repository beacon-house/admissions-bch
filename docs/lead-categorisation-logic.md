# Lead Categorization Logic

## Overview
The lead categorization system is designed to efficiently segment incoming student applications based on their grade level, study abroad commitment, curriculum type, and scholarship requirements. This document outlines the current implementation of the lead categorization logic.

## Categorization Factors
The system uses four primary factors to determine lead categories:

1. **Current Grade**
   - Grade levels: 7 or below, 8, 9, 10, 11, 12, masters
   - Special handling for masters applicants and early years (grade 7 or below)

2. **Study Abroad Priority**
   - `main_focus`: Student is primarily focused on studying abroad
   - `backup_plan`: Student considers studying abroad as a backup option
   - `still_exploring`: Student is in the early stages of considering studying abroad

3. **Scholarship Requirement**
   - `good_to_have`: Student views scholarships as beneficial but not essential
   - `must_have`: Student requires scholarships to proceed

4. **Curriculum Type**
   - International curricula: 'IB', 'IGCSE'
   - National curricula: 'CBSE', 'ICSE'
   - Others

## Categories
Leads are classified into three categories based on the combination of these factors:

### 1. Select (High Priority)
Combinations that qualify for "Select" category:
- Student in grades 8-11 AND EITHER:
  - Has scholarship requirement as 'good_to_have'
  - OR has study abroad as 'main_focus'

Rationale: These combinations indicate high commitment and reasonable financial readiness.

### 2. Waitlist (Medium Priority)
Two paths to "Waitlist" category:
1. Grade 12 students with international curricula (IB or IGCSE)
2. Students in grades 8-11 who:
   - Don't qualify for Select category
   - Don't qualify for Nurture category

Rationale: These combinations show moderate potential but may need additional support or have specific constraints.

### 3. Nurture (Lower Priority)
Three paths to "Nurture" category:
1. Special cases:
   - Masters applicants
   - Grade 7 or below students
2. Grade 12 students with non-international curricula
3. Students in grades 8-11 who:
   - Have study abroad priority as either 'backup_plan' or 'still_exploring'
   - AND require scholarships ('must_have')

Rationale: These leads need the most nurturing due to being in early stages, having significant constraints, or requiring specialized attention.

## Implementation Details
The categorization is implemented in the `determineLeadCategory` function:

```typescript
const determineLeadCategory = (
  currentGrade: string,
  studyAbroadPriority: string,
  scholarshipRequirement: string,
  curriculumType: string
): 'select' | 'waitlist' | 'nurture' => {
  // 1. Special cases
  if (currentGrade === 'masters' || currentGrade === '7_below') {
    return 'nurture';
  }

  if (currentGrade === '12') {
    return ['IB', 'IGCSE'].includes(curriculumType) ? 'waitlist' : 'nurture';
  }

  // 2. For grades 8-11
  if (['8', '9', '10', '11'].includes(currentGrade)) {
    // SELECT case
    if (
      scholarshipRequirement === 'good_to_have' ||
      studyAbroadPriority === 'main_focus'
    ) {
      return 'select';
    }

    // NURTURE case
    if (
      ['backup_plan', 'still_exploring'].includes(studyAbroadPriority) &&
      scholarshipRequirement === 'must_have'
    ) {
      return 'nurture';
    }

    // WAITLIST case (all other cases for grades 8-11)
    return 'waitlist';
  }

  // 3. Default fallback
  return 'nurture';
};
```

## Database Storage
The categorization result is stored in the `beacon_house_leads` table in the `lead_category` column, which is an enum type with values: 'select', 'waitlist', 'nurture'.

## Special Processing
- **Masters Applications**: Form is submitted immediately after the first step, and leads are automatically categorized as 'nurture'
- **Early Years (Grade 7 or below)**: Similar to masters applications, processed after first step and categorized as 'nurture'
- **Grade 12 Students**: Categorization depends heavily on curriculum type, with international curriculum students receiving higher priority