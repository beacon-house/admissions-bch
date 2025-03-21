# Lead Categorization Logic

## Overview
The lead categorization system efficiently segments incoming student applications into six distinct categories: BCH (premium), Luminaire Level 1 (lum-l1), Luminaire Level 2 (lum-l2), Masters Level 1 (masters-l1), Masters Level 2 (masters-l2), NURTURE (development), and DROP (direct submission). The categorization is based on multiple factors including grade level, form filler type, academic preferences, and application preparation status.

## Categorization Factors
The system evaluates the following key factors:

1. **Current Grade**
   - Grade levels: 7 or below, 8, 9, 10, 11, 12, Masters
   - Special handling for Masters applicants
   - Early years (Grade 7 or below) categorized as DROP and form is submitted directly after Step 1

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

## Categories and Qualification Criteria

### 1. BCH (Premium Category)
Qualifies if ANY of these conditions are met:
1. Grade 9 or 10 students where:
   - Form filled by parents (`formFillerType` = 'parent')
   - Scholarship requirement is 'good_to_have'

2. Grade 11 students where:
   - Either:
     - Form filled by parent (any curriculum) OR
     - Form filled by student with IB/IGCSE curriculum only
   - Scholarship requirement is 'good_to_have'
   - Target university rank is 'top_20'

### 2. Luminaire Level 1 (lum-l1)
Qualifies if ANY of these conditions are met:
1. Grade 11 students where:
   - Either:
     - Form filled by parent (any curriculum) OR
     - Form filled by student with IB/IGCSE curriculum only
   - Scholarship requirement is 'good_to_have'
   - Target university rank is NOT 'top_20'

2. Grade 12 students where:
   - Either:
     - Form filled by parent (any curriculum) OR
     - Form filled by student with IB/IGCSE curriculum only
   - Scholarship requirement is 'good_to_have'

### 3. Luminaire Level 2 (lum-l2)
Qualifies if ANY of these conditions are met:
1. Grade 11 or 12 students where:
   - Form filled by parent (any curriculum)
   - Scholarship requirement is 'must_have'

2. Grade 11 or 12 students where:
   - Form filled by student (IB or IGCSE curriculum only)
   - Scholarship requirement is either 'must_have' or 'good_to_have'

### 4. Masters Level 1 (masters-l1)
Qualifies if ALL these conditions are met:
- Grade is 'masters'
- Application preparation status is 'researching_now' OR 'taken_exams_identified_universities'
- Target universities option: 'top_20_50' (Top 20-50 ranked global university)

### 5. Masters Level 2 (masters-l2)
Qualifies if ALL these conditions are met:
- Grade is 'masters'
- Application preparation status is 'researching_now' OR 'taken_exams_identified_universities'
- Target universities option: 'top_50_100' (50-100 ranked universities) OR 'partner_university' (Partner University without GRE/GMAT)

### 6. NURTURE Category
Automatically assigned if ANY of these conditions are met:
- Masters applicants who are undecided about applying ('undecided_need_help')
- Masters applicants with target universities option: 'unsure' (unsure about university preferences)
- Any other lead that doesn't match the above categories and isn't grade 7 or below

### 7. DROP Category
Automatically assigned to:
- Grade 7 or below students

## Special Processing Rules
1. **Direct Form Submission**:
   - Grade 7 or below → Form is submitted directly after Step 1 with category "DROP"
   - No further steps are shown to these users

2. **Masters Applications**:
   - Application preparation status is the initial filter:
     - 'undecided_need_help' → NURTURE
     - Others → proceed to target university evaluation
   - Target university preference is the primary categorization factor:
     - 'top_20_50' → masters-l1
     - 'top_50_100' or 'partner_university' → masters-l2
     - 'unsure' → NURTURE

## Implementation Notes
1. **Form Flow**:
   - One-step process for Grade 7 or below (direct submission)
   - Two-step process for regular applications
   - Progressive data collection

2. **Data Handling**:
   - Real-time categorization
   - Webhook-based submission
   - Environment-specific tracking