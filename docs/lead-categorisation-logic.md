# Lead Categorization Logic

## Overview
The lead categorization system efficiently segments incoming student applications into seven distinct categories: bch (premium), Luminaire Level 1 (lum-l1), Luminaire Level 2 (lum-l2), Masters Level 1 (masters-l1), Masters Level 2 (masters-l2), nurture (development), and drop (direct submission). The categorization is based on multiple factors including grade level, form filler type, academic preferences, and application preparation status.

## Categorization Process
The lead categorization happens in two stages:

1. **Initial Categorization**: After Step 2 (Academic Details Form)
   - Assigns one of seven categories based on form data from Steps 1 and 2
   - If categorized as "nurture", the user proceeds to Step 2.5 (Extended Nurture Form)

2. **Re-categorization**: After Step 2.5 (Extended Nurture Form) - only for "nurture" leads
   - Based on extended form responses, the lead may be re-categorized to a higher priority category
   - Leads remaining in "nurture" category have form submitted directly
   - Leads re-categorized to other categories proceed to Step 3 (Counselling Form)

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

7. **Extended Nurture Form Factors**
   - For parents: Financial planning approach
   - For students: Parental support and partial funding approach
   - Grade-specific responses
   - These are used for re-categorization after Step 2.5

## Global Rule (Override)
- Any lead with `scholarship_requirement` = `full_scholarship` goes to "nurture" category BY DEFAULT, regardless of any other criteria

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
- Scholarship requirement is 'full_scholarship' (overrides all other criteria)
- Masters applicants who are undecided about applying ('undecided_need_help')
- Masters applicants with target universities option: 'unsure'
- Grade 11 or 12 students with non-IB/IGCSE curriculum
- Any other lead that doesn't match the above categories and isn't grade 7 or below

### 7. drop Category
Automatically assigned to:
- Grade 7 or below students
- Form is submitted directly after Step 1

## Re-categorization Logic (After Extended Nurture Form)

### Parent Re-categorization
Based on financial planning approach:
1. If `financialPlanning` = 'savings':
   - Re-categorize based on original logic:
     - For Grade 9, 10, or Grade 11 with top_20 target: re-categorize as "bch"
     - For other Grade 11 or 12: re-categorize as "lum-l1"
   - Scholarship requirement is ignored in this re-categorization
2. If `financialPlanning` = 'education_loans':
   - Re-categorize as "lum-l2"
3. For all other options:
   - Remain as "nurture"

### Student Re-categorization
Based on partial funding approach:
1. If `partialFundingApproach` = 'accept_cover_remaining':
   - Re-categorize based on original logic:
     - For Grade 9, 10, or Grade 11 with top_20 target and IB/IGCSE curriculum: re-categorize as "bch"
     - For Grade 11 or 12 with IB/IGCSE curriculum: re-categorize as "lum-l1"
   - Scholarship requirement is ignored in this re-categorization
2. If `partialFundingApproach` = 'defer_external_scholarships':
   - Re-categorize as "lum-l2"
3. For all other options:
   - Remain as "nurture"

## Implementation Notes
1. **Form Flow**:
   - One-step process for Grade 7 or below (direct submission)
   - Two-step process for leads not categorized as "nurture"
   - Three-step process for leads categorized as "nurture" but re-categorized after Extended Nurture Form
   - Progressive data collection

2. **Data Handling**:
   - Real-time categorization
   - Webhook-based submission
   - Environment-specific tracking