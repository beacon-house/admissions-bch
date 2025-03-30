# Lead Categorization Logic v5.5

## Overview
The lead categorization system efficiently segments incoming student applications into seven distinct categories: bch (premium), Luminaire Level 1 (lum-l1), Luminaire Level 2 (lum-l2), Masters Level 1 (masters-l1), Masters Level 2 (masters-l2), nurture (development), and drop (direct submission). The categorization is based on multiple factors including grade level, form filler type, academic preferences, and application preparation status.

## Key Changes in v5.5
- **Extended Nurture Form Restriction**: The Extended Nurture Form (Step 2.5) now triggers **only** for Grade 11 and 12 students categorized as "nurture"
- **Other Nurture Leads**: Grade 8, 9, 10, and Masters applicants categorized as "nurture" now have their forms submitted directly after Step 2, bypassing the Extended Nurture Form
- **Masters Full Scholarship**: Masters applicants requesting full scholarships are no longer automatically categorized as "nurture" (since full scholarships are more attainable at Masters level)
- **Updated Re-categorization Logic**: For Grade 11 and 12 students who complete the Extended Nurture Form:
  - Student form fillers with `partialFundingApproach` = 'accept_cover_remaining' are now categorized as "lum-l1" **regardless of curriculum type**
  - Both 'defer_external_scholarships' and 'affordable_alternatives' now lead to "lum-l2" categorization

## Categorization Process
The lead categorization happens in two stages:

1. **Initial Categorization**: After Step 2 (Academic Details Form)
   - Assigns one of seven categories based on form data from Steps 1 and 2
   - If categorized as "nurture" AND in Grade 11 or 12, the user proceeds to Step 2.5 (Extended Nurture Form)
   - If categorized as "nurture" BUT NOT in Grade 11 or 12, the form is submitted directly

2. **Re-categorization**: After Step 2.5 (Extended Nurture Form) - only for "nurture" leads in Grades 11 and 12
   - Based on extended form responses, the lead may be re-categorized to a higher priority category
   - Leads remaining in "nurture" category have form submitted directly
   - Leads re-categorized to other categories proceed to Step 3 (Counselling Form)

## Form Flow by Lead Category

### Flow 1: Grade 7 or Below
- Step 1 (Personal Details) → Direct Submission
- Category: "drop"

### Flow 2: BCH, Luminaire (L1/L2), Masters (L1/L2)
- Step 1 (Personal Details) → Step 2 (Academic Details) → Step 3 (Counselling Form) → Submission
- Category determined after Step 2

### Flow 3: Nurture (Grades 8, 9, 10 or Masters)
- Step 1 (Personal Details) → Step 2 (Academic Details) → Direct Submission
- Category: "nurture"

### Flow 4: Nurture (Grades 11, 12) Remaining Nurture
- Step 1 (Personal Details) → Step 2 (Academic Details) → Step 2.5 (Extended Nurture) → Direct Submission
- Category: "nurture" (both before and after Step 2.5)

### Flow 5: Nurture (Grades 11, 12) Re-categorized
- Step 1 (Personal Details) → Step 2 (Academic Details) → Step 2.5 (Extended Nurture) → Step 3 (Counselling Form) → Submission
- Initial category: "nurture" (after Step 2)
- Re-categorized to: "bch", "lum-l1", or "lum-l2" (after Step 2.5)

## Categorization Factors
The system evaluates the following key factors:

1. **Current Grade**
   - Grade levels: 7 or below, 8, 9, 10, 11, 12, Masters
   - Special handling for Masters applicants
   - Early years (Grade 7 or below) categorized as "drop" and form is submitted directly after Step 1

2. **Form Filler Type**
   - `parent`: Parent filling the form
   - `student`: Student filling the form

3. **Scholarship Requirement**
   - `scholarship_optional`: Not essential
   - `partial_scholarship`: Partial support needed
   - `full_scholarship`: Full support required

4. **Curriculum Type**
   - International: IB, IGCSE
   - National: CBSE, ICSE, State Boards
   - Others: Other curricula

5. **Target University Rank**
   - `top_20`: Top 20 universities
   - `top_50`: Top 50 universities
   - `top_100`: Top 100 universities
   - `any_good`: Any good university

6. **Masters-specific Factors**
   - Application preparation status
   - Target university tier
   - Other factors considered but not currently primary decision points:
     - Academic performance (GPA or percentage)
     - Intake period
     - Support level required

7. **Extended Nurture Form Factors** (Grades 11 & 12 only)
   - For parents: Financial planning approach
   - For students: Parental support and partial funding approach
   - Grade-specific responses
   - These are used for re-categorization after Step 2.5

## Global Rule (Override)
- Any lead with `scholarship_requirement` = `full_scholarship` goes to "nurture" category BY DEFAULT, regardless of any other criteria
- **Exception**: Masters applicants with `full_scholarship` are NOT automatically categorized as "nurture" (new in v5.5)

## Initial Categories and Qualification Criteria

### 1. bch (Premium Category)
Qualifies if ANY of these conditions are met:
1. Grade 9 or 10 students where:
   - Form filled by parents (`formFillerType` = 'parent')
   - Scholarship requirement is NOT 'full_scholarship' (either 'scholarship_optional' or 'partial_scholarship')

2. Grade 11 students where:
   - Either:
     - Form filled by parent (any curriculum) OR
     - Form filled by student with IB/IGCSE curriculum only
   - Scholarship requirement is NOT 'full_scholarship' (either 'scholarship_optional' or 'partial_scholarship')
   - Target university rank is 'top_20'

### 2. Luminaire Level 1 (lum-l1)
Qualifies if ALL of these conditions are met:
1. Scholarship requirement is 'scholarship_optional'
2. And meets one of these criteria:
   - Grade 11 students where:
     - Either:
       - Form filled by parent (any curriculum) OR
       - Form filled by student with IB/IGCSE curriculum only
     - Target university rank is NOT 'top_20' (this is critical as top_20 Grade 11 students go to bch)
   - Grade 12 students where:
     - Either:
       - Form filled by parent (any curriculum) OR
       - Form filled by student with IB/IGCSE curriculum only

### 3. Luminaire Level 2 (lum-l2)
Qualifies if ALL of these conditions are met:
1. Scholarship requirement is 'partial_scholarship'
2. Grade 11 or 12 students
3. Either:
   - Form filled by parent (any curriculum) OR
   - Form filled by student with IB/IGCSE curriculum only

### 4. Masters Level 1 (masters-l1)
Qualifies if ALL these conditions are met:
- Grade is 'masters'
- Application preparation status is either:
  - 'researching_now' OR
  - 'taken_exams_identified_universities'
- Target universities option: 'top_20_50' (Top 20-50 ranked global university)

### 5. Masters Level 2 (masters-l2)
Qualifies if ALL these conditions are met:
- Grade is 'masters'
- Application preparation status is either:
  - 'researching_now' OR
  - 'taken_exams_identified_universities'
- Target universities option is either:
  - 'top_50_100' (50-100 ranked universities) OR
  - 'partner_university' (Partner University without GRE/GMAT)

### 6. nurture Category
Automatically assigned if ANY of these conditions are met:
- Scholarship requirement is 'full_scholarship' AND grade is NOT 'masters' (updated in v5.5)
- Masters applicants who are undecided about applying ('undecided_need_help')
- Masters applicants with target universities option: 'unsure'
- Grade 11 or 12 students with non-IB/IGCSE curriculum and student form filler
- Any other lead that doesn't match the above categories and isn't grade 7 or below

### 7. drop Category
Automatically assigned to:
- Grade 7 or below students
- Form is submitted directly after Step 1

## Extended Nurture Form Handling (Only for Grades 11 & 12)

### When Extended Nurture Form Is Shown
The Extended Nurture Form (Step 2.5) is ONLY shown to leads that meet ALL of these criteria:
- Categorized as "nurture" after Step 2
- Current grade is either 11 or 12
- All other "nurture" leads (Grades 8, 9, 10, Masters) submit directly

### Re-categorization Logic (After Extended Nurture Form)

#### Parent Re-categorization
Based on partial funding approach:
1. If `partialFundingApproach` = 'accept_loans':
   - Re-categorize as "lum-l1"
2. If `partialFundingApproach` = 'affordable_alternatives':
   - Re-categorize as "lum-l2"
3. For all other options ('defer_scholarships', 'only_full_funding'):
   - Remain as "nurture"

#### Student Re-categorization
1. First check if `parentalSupport` is "would_join"
   - If it's anything else, keep as "nurture" regardless of other answers
2. If parental support is "would_join", then check `partialFundingApproach`:
   - If 'accept_cover_remaining':
     - Grade 9, 10, or Grade 11 with top_20 target and IB/IGCSE: re-categorize as "bch"
     - Grade 11 or 12: re-categorize as "lum-l1" (regardless of curriculum type - updated in v5.5)
   - If 'defer_external_scholarships' OR 'affordable_alternatives': re-categorize as "lum-l2" (updated in v5.5)
   - For other options ('only_full_funding', 'need_to_ask_parents'): remain as "nurture"

## Implementation Notes
1. **Form Flow**:
   - One-step process for Grade 7 or below (direct submission)
   - Two-step process for "nurture" leads not in Grades 11-12
   - Three-step process for leads not categorized as "nurture"
   - Four-step process for Grade 11-12 "nurture" leads re-categorized after Extended Nurture Form
   - Progressive data collection with user-friendly experience

2. **UX Optimizations**:
   - Evaluation animation prior to showing Extended Nurture Form
   - Pre-filled fields based on existing user data
   - Clear progress indication

3. **Extended Form UI Enhancements**:
   - Explanatory banner explaining why additional information is needed
   - Different sets of questions for parent vs. student form fillers
   - Grade-specific question variants

4. **Analytics**:
   - All form steps and categorization decisions are tracked for analysis
   - Conversion tracking at each step of the process
   - Detailed event data for optimization

## Technical Implementation
The lead categorization logic is implemented in `src/lib/leadCategorization.ts` with the `determineLeadCategory` function handling both initial categorization and re-categorization based on Extended Nurture Form data. The form flow control is managed in `src/components/forms/FormContainer.tsx`, with conditional logic to:

1. Show Extended Nurture Form only for Grade 11-12 nurture leads
2. Submit directly for other nurture leads
3. Handle re-categorization after Extended Nurture Form completion