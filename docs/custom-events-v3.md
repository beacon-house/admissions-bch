# Custom Events Documentation v3

This document outlines all custom events implemented in the Beacon House admissions system. These events are tracked through both Meta Pixel and Google Analytics.

## Environment-Specific Naming

All event names include an environment suffix derived from the `VITE_ENVIRONMENT` environment variable:
- Example: `admissions_cta_header_staging` for staging environment

## Complete Event List (18 Events Total)

### 1. CTA Button Events (2 Events)

#### `admissions_cta_header_[environment]`
**Trigger**: User clicks "Request an Evaluation" button in the header
**Location**: Header.tsx - handleCTAClick function
**Properties**:
- `button`: "header_request_evaluation"
- `device_type`: "mobile" | "desktop"
- `path`: Current page path
- `timestamp`: ISO date string

#### `admissions_cta_hero_[environment]`
**Trigger**: User clicks "Request an Evaluation" button in the hero section
**Location**: LandingPage.tsx - handleScrollToForm function
**Properties**:
- `button`: "request_evaluation"
- `location`: "hero_section"
- `device_type`: "mobile" | "desktop"
- `scroll_position`: Numeric value of scroll position
- `timestamp`: ISO date string

### 2. Form Navigation Events (7 Events)

#### `admissions_page_view_[environment]`
**Trigger**: When any form step is loaded
**Location**: FormContainer.tsx - useEffect hook
**Properties**:
- `step`: Step number (1, 2, 2.5, 3)
- `current_grade`: User's selected grade
- `form_filler_type`: "parent" | "student"

#### `admissions_page1_continue_[environment]`
**Trigger**: User completes and submits Step 1 (Personal Details)
**Location**: FormContainer.tsx - onSubmitStep1 function
**Properties**:
- `grade`: Selected grade
- `form_filler_type`: "parent" | "student"
- `time_spent`: Seconds spent on step
- `time_of_day`: Hour of day (0-23)

#### `parent_admissions_page1_continue_[environment]`
**Trigger**: Parent-specific event when completing Step 1
**Location**: FormContainer.tsx - onSubmitStep1 function (conditional trigger)
**Properties**:
- `grade`: Selected grade
- `form_filler_type`: "parent"
- `time_spent`: Seconds spent on step
- `time_of_day`: Hour of day (0-23)

#### `admissions_page2_next_regular_[environment]`
**Trigger**: User completes and submits Step 2 (Academic Details) for non-masters applications
**Location**: FormContainer.tsx - onSubmitStep2 function
**Properties**:
- `lead_category`: Determined lead category
- `time_spent`: Seconds spent on step
- Common properties (grade, form filler type, etc.)

#### `admissions_page2_next_masters_[environment]`
**Trigger**: User completes and submits Step 2 (Academic Details) for masters applications
**Location**: FormContainer.tsx - onSubmitStep2 function
**Properties**:
- `lead_category`: Determined lead category
- `time_spent`: Seconds spent on step
- `current_grade`: "masters"
- Other common properties

#### `admissions_qualified_lead_received_[environment]`
**Trigger**: When a lead is categorized as a qualified lead (bch, lum-l1, or lum-l2) after Step 2 completion or Extended Nurture Form completion
**Location**: FormContainer.tsx - onSubmitStep2 and onSubmitExtendedNurture functions
**Properties**:
- `lead_category`: The qualified lead category ("bch", "lum-l1", or "lum-l2")
- `total_time_spent`: Total seconds spent on form up to qualification
- `current_grade`: User's selected grade
- `form_filler_type`: "parent" | "student"
- `curriculum_type`: Selected curriculum (for non-masters)
- `scholarship_requirement`: Level of scholarship needed
- `has_full_scholarship_requirement`: Boolean
- `is_international_curriculum`: Boolean (true for IB/IGCSE)

#### `admissions_form_complete_[environment]`
**Trigger**: When the form is completely submitted (any category)
**Location**: FormContainer.tsx - onSubmitStep3 function
**Properties**:
- `lead_category`: User's lead category
- `counselling_booked`: Boolean
- `is_masters`: Boolean
- `extended_form_completed`: Boolean
- `total_time_spent`: Total seconds spent on form

### 3. Counselling Form Events (2 Events)

#### `admissions_page3_view_[lead_category]_[environment]`
**Trigger**: When counselling form is viewed
**Location**: CounsellingForm.tsx - useEffect hook
**Properties**:
- `lead_category`: User's lead category
- `counsellor_name`: "Viswanathan" | "Karthik Lakshman"
- `form_loaded_timestamp`: ISO date string

#### `admissions_page3_submit_[lead_category]_[environment]`
**Trigger**: When lead submits counselling form
**Location**: FormContainer.tsx - onSubmitStep3 function
**Properties**:
- `counselling_slot_picked`: Boolean
- `total_time_spent`: Total seconds spent on form
- `counsellor_name`: "Viswanathan" | "Karthik Lakshman"
- `lead_category`: User's lead category

### 4. Complete Flow Events (3 Events)

#### `admissions_flow_complete_bch_[environment]`
**Trigger**: When a BCH lead completes entire form flow
**Location**: FormContainer.tsx - onSubmitStep3 function
**Properties**:
- `total_time_spent`: Total seconds spent on form
- `counselling_booked`: Boolean
- `current_grade`: User's selected grade
- `form_filler_type`: "parent" | "student"
- `curriculum_type`: Selected curriculum

#### `admissions_flow_complete_luminaire_[environment]`
**Trigger**: When a Luminaire lead (L1 or L2) completes the form flow
**Location**: FormContainer.tsx - onSubmitStep3 function
**Properties**:
- `luminaire_level`: "l1" | "l2"
- `total_time_spent`: Total seconds spent on form
- `counselling_booked`: Boolean
- `current_grade`: User's selected grade
- `form_filler_type`: "parent" | "student"

#### `admissions_flow_complete_masters_[environment]`
**Trigger**: When a Masters lead completes the form flow
**Location**: FormContainer.tsx - onSubmitStep3 function
**Properties**:
- `masters_level`: "l1" | "l2"
- `total_time_spent`: Total seconds spent on form
- `counselling_booked`: Boolean
- `application_preparation`: Selected application preparation status

### 5. New Specific Lead Events (4 Events)

#### `admissions_student_lead_[environment]`
**Trigger**: User selects "Student" as form filler type in Step 1
**Location**: FormContainer.tsx - onSubmitStep1 function
**Properties**:
- `current_grade`: User's selected grade
- `form_filler_type`: "student"
- `curriculum_type`: Selected curriculum (if available)
- `scholarship_requirement`: Level of scholarship needed (if available)
- `lead_category`: Determined lead category (if available)
- `has_full_scholarship_requirement`: Boolean
- `is_international_curriculum`: Boolean

#### `admissions_masters_lead_[environment]`
**Trigger**: User selects "Apply for Masters" as current grade in Step 1
**Location**: FormContainer.tsx - onSubmitStep1 function
**Properties**:
- `current_grade`: "masters"
- `form_filler_type`: "parent" | "student"
- `curriculum_type`: Selected curriculum (if available)
- `scholarship_requirement`: Level of scholarship needed (if available)
- `lead_category`: Determined lead category (if available)
- `has_full_scholarship_requirement`: Boolean
- `is_international_curriculum`: Boolean

#### `admissions_spammy_parent_[environment]`
**Trigger**: Form filler is "Parent" and either GPA is 10 or Percentage is 100 in Step 2
**Location**: FormContainer.tsx - onSubmitStep2 function
**Properties**:
- `current_grade`: User's selected grade
- `form_filler_type`: "parent"
- `curriculum_type`: Selected curriculum
- `scholarship_requirement`: Level of scholarship needed
- `lead_category`: Determined lead category
- `has_full_scholarship_requirement`: Boolean
- `is_international_curriculum`: Boolean
- `gpa_value`: GPA value (if applicable)
- `percentage_value`: Percentage value (if applicable)

#### `admissions_stateboard_parent_[environment]`
**Trigger**: Form filler is "Parent" and curriculum type is "State_Boards" in Step 2
**Location**: FormContainer.tsx - onSubmitStep2 function
**Properties**:
- `current_grade`: User's selected grade
- `form_filler_type`: "parent"
- `curriculum_type`: "State_Boards"
- `scholarship_requirement`: Level of scholarship needed
- `lead_category`: Determined lead category
- `has_full_scholarship_requirement`: Boolean
- `is_international_curriculum`: Boolean

## Common Event Properties

The following properties are included in most form-related events via `getCommonEventProperties()` function:

- `current_grade`: User's selected grade
- `form_filler_type`: "parent" | "student"
- `curriculum_type`: Selected curriculum (for non-masters)
- `scholarship_requirement`: Level of scholarship needed
- `lead_category`: Determined lead category
- `has_full_scholarship_requirement`: Boolean
- `is_international_curriculum`: Boolean (true for IB/IGCSE)

## Lead Categories

Events may include one of the following lead categories:
- `bch`: Premium category
- `lum-l1`: Luminaire Level 1
- `lum-l2`: Luminaire Level 2
- `masters-l1`: Masters Level 1
- `masters-l2`: Masters Level 2
- `nurture`: Development category
- `drop`: Grade 7 or below

## Implementation Notes

1. **Environment Suffix**: All events automatically append the environment suffix based on `VITE_ENVIRONMENT`
2. **Dual Tracking**: Events are sent to both Meta Pixel and Google Analytics
3. **Form Store Integration**: Events are tracked in the form store to prevent duplicate submissions
4. **Student Form Handling**: Student-filled forms are automatically categorized as "nurture" and bypass counselling
5. **Extended Nurture Flow**: Grade 11/12 parent-filled nurture leads go through an extended form (Step 2.5)

## Event Flow Examples

### Standard BCH Flow
1. `admissions_page_view_[env]` (Step 1)
2. `admissions_page1_continue_[env]`
3. `parent_admissions_page1_continue_[env]` (if parent)
4. `admissions_page_view_[env]` (Step 2)
5. `admissions_page2_next_regular_[env]`
6. `admissions_qualified_lead_received_[env]` (if qualified)
7. `admissions_page_view_[env]` (Step 3)
8. `admissions_page3_view_bch_[env]`
9. `admissions_page3_submit_bch_[env]`
10. `admissions_form_complete_[env]`
11. `admissions_flow_complete_bch_[env]`

### Student-Filled Flow (Auto-Nurture)
1. `admissions_page_view_[env]` (Step 1)
2. `admissions_page1_continue_[env]`
3. `admissions_page_view_[env]` (Step 2)
4. `admissions_page2_next_regular_[env]` or `admissions_page2_next_masters_[env]`
5. `admissions_form_complete_[env]` (Direct submission)

### Extended Nurture Flow (Grade 11/12 Parent)
1. `admissions_page_view_[env]` (Step 1)
2. `admissions_page1_continue_[env]`
3. `parent_admissions_page1_continue_[env]`
4. `admissions_page_view_[env]` (Step 2)
5. `admissions_page2_next_regular_[env]`
6. `admissions_page_view_[env]` (Step 2.5)
7. `admissions_qualified_lead_received_[env]` (if re-qualified)
8. Either direct submission or proceed to Step 3 based on re-categorization

### Masters Flow
1. `admissions_page_view_[env]` (Step 1)
2. `admissions_page1_continue_[env]`
3. `admissions_page_view_[env]` (Step 2)
4. `admissions_page2_next_masters_[env]`
5. `admissions_qualified_lead_received_[env]` (if qualified)
6. `admissions_page_view_[env]` (Step 3)
7. `admissions_page3_view_[lead_category]_[env]`
8. `admissions_page3_submit_[lead_category]_[env]`
9. `admissions_form_complete_[env]`
10. `admissions_flow_complete_masters_[env]`

## Code Locations

- **Event Definitions**: `src/lib/pixel.ts`
- **Form Events**: `src/components/forms/FormContainer.tsx`
- **Counselling Events**: `src/components/forms/CounsellingForm.tsx`
- **CTA Events**: `src/components/Header.tsx`, `src/components/LandingPage.tsx`
- **Common Properties**: `src/lib/pixel.ts` - `getCommonEventProperties()` function

**18 unique events** are currently implemented:
- 2 CTA Button Events
- 7 Form Navigation Events (including qualified lead and page view)
- 2 Counselling Form Events  
- 3 Complete Flow Events
- 4 New Specific Lead Events