# Custom Events Documentation

This document outlines the 13 custom events implemented in the Beacon House admissions system. These events are tracked through both Meta Pixel and Google Analytics.

## Environment-Specific Naming

All event names include an environment suffix derived from the `VITE_ENVIRONMENT` environment variable:
- Example: `admissions_cta_header_staging` for staging environment

## 1. CTA Button Events (2)

### `admissions_cta_header_[environment]`
**Trigger**: User clicks "Request an Evaluation" button in the header
**Properties**:
- `button`: "header_request_evaluation"
- `device_type`: "mobile", "desktop"
- `path`: Current page path
- `timestamp`: ISO date string

### `admissions_cta_hero_[environment]`
**Trigger**: User clicks "Request an Evaluation" button in the hero section
**Properties**:
- `button`: "request_evaluation"
- `location`: "hero_section"
- `device_type`: "mobile", "desktop"
- `scroll_position`: Numeric value of scroll position
- `timestamp`: ISO date string

## 2. Form Navigation Events (5)

### `admissions_page_view_[environment]`
**Trigger**: When any form step is loaded
**Properties**:
- `step`: Step number (1, 2, 3)
- `current_grade`: User's selected grade
- `form_filler_type`: "parent", "student" 

### `admissions_page1_continue_[environment]`
**Trigger**: User completes and submits Step 1 (Personal Details)
**Properties**:
- `grade`: Selected grade
- `form_filler_type`: "parent", "student"
- `time_spent`: Seconds spent on step
- `time_of_day`: Hour of day (0-23)

### `admissions_page2_next_regular_[environment]`
**Trigger**: User completes and submits Step 2 (Academic Details) for non-masters applications
**Properties**:
- `lead_category`: Determined lead category
- `time_spent`: Seconds spent on step
- Common properties (grade, form filler type, etc.)

### `admissions_page2_next_masters_[environment]`
**Trigger**: User completes and submits Step 2 (Academic Details) for masters applications
**Properties**:
- `lead_category`: Determined lead category
- `time_spent`: Seconds spent on step
- `current_grade`: "masters"
- Other common properties

### `admissions_form_complete_[environment]`
**Trigger**: When the form is completely submitted (any category)
**Properties**:
- `lead_category`: User's lead category
- `counselling_booked`: Boolean
- `is_masters`: Boolean
- `total_time_spent`: Total seconds spent on form

## 3. Extended Nurture Event (1)

### `admissions_page25_proceed_nurture_success_[environment]`
**Trigger**: When proceeding from Extended Nurture Form to counselling booking
**Properties**:
- `form_filler_type`: "parent", "student"
- `current_grade`: User's selected grade
- `nurture_subcategory`: "nurture-success"
- `time_spent`: Seconds spent on previous steps

## 4. Counselling Form Event (1)

### `admissions_page3_submit_[lead_category]_[environment]`
**Trigger**: When lead submits counselling form
**Properties**:
- `counselling_slot_picked`: Boolean
- `total_time_spent`: Total seconds spent on form
- `counsellor_name`: "Viswanathan" or "Karthik Lakshman"
- `lead_category`: User's lead category

## 5. Complete Flow Events (4)

### `admissions_flow_complete_bch_[environment]`
**Trigger**: When a BCH lead completes entire form flow
**Properties**:
- `total_time_spent`: Total seconds spent on form
- `counselling_booked`: Boolean
- `current_grade`: User's selected grade
- `form_filler_type`: "parent", "student"
- `curriculum_type`: Selected curriculum

### `admissions_flow_complete_luminaire_[environment]`
**Trigger**: When a Luminaire lead (L1 or L2) completes the form flow
**Properties**:
- `luminaire_level`: "l1", "l2"
- `total_time_spent`: Total seconds spent on form
- `counselling_booked`: Boolean
- `current_grade`: User's selected grade
- `form_filler_type`: "parent", "student"

### `admissions_flow_complete_masters_[environment]`
**Trigger**: When a Masters lead completes the form flow
**Properties**:
- `masters_level`: "l1", "l2"
- `total_time_spent`: Total seconds spent on form
- `counselling_booked`: Boolean
- `application_preparation`: Selected application preparation status

### `admissions_flow_complete_nurture_success_[environment]`
**Trigger**: When a nurture-success lead completes the form flow
**Properties**:
- `form_filler_type`: "parent", "student"
- `total_time_spent`: Total seconds spent on form
- `counselling_booked`: Boolean
- `current_grade`: User's selected grade
- `disqualification_factors`: "none"