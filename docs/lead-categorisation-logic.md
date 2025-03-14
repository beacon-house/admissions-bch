# Lead Categorization Logic

## Overview
The lead categorization system efficiently segments incoming student applications into five distinct categories: BCH (premium), Luminaire Level 1 (lum-l1), Luminaire Level 2 (lum-l2), MASTERS (specialized), and NURTURE (development). The categorization is based on multiple factors including grade level, form filler type, and academic preferences.

## Categorization Factors
The system evaluates the following key factors:

1. **Current Grade**
   - Grade levels: 7 or below, 8, 9, 10, 11, 12, Masters
   - Special handling for Masters applicants
   - Early years (Grade 7 or below) automatically categorized

2. **Form Filler Type**
   - `parent`: Parent filling the form
   - `student`: Student filling the form

3. **Scholarship Requirement**
   - `good_to_have`: Not essential
   - `must_have`: Required for proceeding

4. **Curriculum Type**
   - International: IB, IGCSE
   - National: CBSE, ICSE, State Boards
   - Others: Other curricula

5. **Target University Rank**
   - `top_20`: Top 20 universities
   - `top_50`: Top 50 universities
   - `top_100`: Top 100 universities
   - `any_good`: Any good university

## Categories and Qualification Criteria

### 1. MASTERS Category
- Automatically assigned if `currentGrade` is 'masters'
- Special handling with immediate form submission

### 2. BCH (Premium Category)
Qualifies if ANY of these conditions are met:
1. Grade 9 or 10 students where:
   - Form filled by parents (`formFillerType` = 'parent')
   - Scholarship requirement is 'good_to_have'

2. Grade 11 students where:
   - Either:
     - Form filled by parent (any curriculum type) OR
     - Form filled by student with IB/IGCSE curriculum only
   - Scholarship requirement is 'good_to_have'
   - Target university rank is 'top_20'

### 3. Luminaire Level 1 (lum-l1)
Qualifies if ANY of these conditions are met:
1. Grade 11 students where:
   - Either:
     - Form filled by parent (any curriculum type) OR
     - Form filled by student with IB/IGCSE curriculum only
   - Scholarship requirement is 'good_to_have'
   - Target university rank is NOT 'top_20'

2. Grade 12 students where:
   - Either:
     - Form filled by parent (any curriculum type) OR
     - Form filled by student with IB/IGCSE curriculum only
   - Scholarship requirement is 'good_to_have'

### 4. Luminaire Level 2 (lum-l2)
Qualifies if ANY of these conditions are met:
1. Grade 11 or 12 students where:
   - Form filled by parent (any curriculum)
   - Scholarship requirement is 'must_have'

2. Grade 11 or 12 students where:
   - Form filled by student (IB or IGCSE curriculum only)
   - Scholarship requirement is either 'must_have' or 'good_to_have'

### 5. NURTURE Category
- Default category for any lead that doesn't match the above criteria
- Automatically assigned for Grade 7 or below

## Special Processing Rules
1. **Masters Applications**:
   - Form submits after first step
   - Automatically categorized as 'MASTERS'
   - Bypasses academic details collection

2. **Early Years (Grade 7 or below)**:
   - Automatically categorized as 'NURTURE'
   - Simplified form process

## Implementation Notes
1. **Form Flow**:
   - Two-step process for regular applications
   - Single-step for Masters applications
   - Progressive data collection

2. **Data Handling**:
   - Real-time categorization
   - Webhook-based submission
   - Environment-specific tracking