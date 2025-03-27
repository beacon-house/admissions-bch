# Form Component Flow Documentation

## 1. Form Overview

The application form is a multi-step lead generation system that collects information from prospective students and parents. Based on their inputs, the system categorizes leads into different segments for appropriate follow-up.

The form has these main components:
- **Step 1**: Personal Details Form
- **Step 2A**: Academic Details Form (for grades 8-12)
- **Step 2B**: Masters Academic Details Form (for Masters applicants)
- **Step 2.5**: Extended Nurture Form (for nurture category leads)
- **Step 3**: Counselling Form (schedules a session with appropriate counselor)

## 2. Form Questions by Component

### Step 1: Personal Details Form

| Field | Type | Validation | Options |
|-------|------|------------|---------|
| Are you the parent or the student? | Select | Required | Parent, Student |
| Grade in Academic Year 25-26 | Select | Required | Grade 12, Grade 11, Grade 10, Grade 9, Grade 8, Grade 7 or below, Apply for Masters |
| Student's First Name | Text | Min 2 chars | |
| Student's Last Name | Text | Min 1 char | |
| Parent's Name | Text | Min 2 chars | |
| Parent's Email | Email | Valid email | |
| Phone Number | Text | 10 digits | |
| WhatsApp Consent | Checkbox | | True/False (default: True) |

### Step 2A: Academic Details Form (Non-Masters)

| Field | Type | Validation | Options |
|-------|------|------------|---------|
| Curriculum Type | Select | Required | IB, IGCSE, CBSE, ICSE, State Boards, Others |
| School Name | Text | Min 2 chars | |
| Grade Format | Button Group | Required | GPA Format, Percentage Format |
| GPA Value (if GPA selected) | Numeric Input | Required, 1-10 range | Float with up to 1 decimal point |
| Percentage Value (if Percentage selected) | Numeric Input | Required, 1-100 range | Float with up to 1 decimal point |
| Target University Rank | Select | Required | Top 20 Universities, Top 50 Universities, Top 100 Universities, Any Good University |
| Target Geographies | Checkbox Group | Min 1 selection | USA, UK, Canada, Australia, Europe, Asia, Middle East, Others, Need Guidance |
| Level of scholarship needed | Radio | Required | Full scholarship needed, Partial scholarship needed, Scholarship optional |
| Contact Methods | Checkbox Group | Min 1 selection | Phone Call, WhatsApp, Email |
| Contact Details | Text fields | Based on selection | Phone number, WhatsApp number, Email address |

### Step 2B: Masters Academic Details Form

#### University & Program Information
| Field | Type | Validation | Options |
|-------|------|------------|---------|
| Current/Previous University | Text | Min 2 chars | |
| When do you expect to graduate? | Select | Required | 2025, 2026, 2027, Others, Graduated Already |
| Which intake are you applying for? | Select | Required | Aug/Sept 2025, Jan or Aug 2026, Jan or Aug 2027, Others |
| Other intake (when "Others" selected) | Text | | |
| How many years of work experience do you have? | Select | Required | 0 years, 1-2 years, 3-5 years, 6+ years |
| What is your intended field of study? | Text | Required | |

#### Academic Information
| Field | Type | Validation | Options |
|-------|------|------------|---------|
| Grade Format | Button Group | Required | GPA Format, Percentage Format |
| GPA Value (if GPA selected) | Numeric Input | Required, 1-10 range | Float with up to 1 decimal point |
| Percentage Value (if Percentage selected) | Numeric Input | Required, 1-100 range | Float with up to 1 decimal point |
| GRE/GMAT Status | Select | Required | Yes - GRE, Yes - GMAT, No - planning to take it, Not required for my programs |
| Exam Score (if GRE/GMAT selected) | Text | | |

#### Application Preparation
| Field | Type | Validation | Options |
|-------|------|------------|---------|
| Have you started preparing for your Master's application? | Radio | Required | Yes I'm researching right now, Have taken GRE/GMAT & identified universities, Yet to decide if I want to apply |
| Target Universities | Radio | Required | Top 20-50 ranked global university, Open to 50-100 ranked universities, Partner University without GRE/GMAT, Unsure about preferences |
| Support Level Needed | Radio | Required | Personalized guidance, Exploring options, Self-guided, Partner Universities |
| Scholarship Requirement | Radio | Required | Full scholarship needed, Partial scholarship needed, Scholarship optional |
| Contact Methods | Same as Step 2A | | |

### Step 2.5: Extended Nurture Form

#### Common Fields (Both Parent and Student)
| Field | Type | Validation | Options |
|---------------|----------------------|-----------------|
| Grade-specific question response | Radio | Required | Values vary based on grade: For Grade 9/10: 'Interested in doing relevant work to build strong profile', 'Focus is on Academics, but will do the minimum needed to get an admit'. For Grade 11: 'Interested in doing relevant work to build strong profile', 'Focus is on Academics, will only do the minimum needed to get an admit'. For Grade 12: 'Graduating in 2024-25 applying for Fall '25', 'Graduating in 2024-25 applying for Fall '26', 'Starting Grade 12 in 2025-26' |
| Extra-curricular interests | Text | Required | Free text |

#### Student-Specific Fields
| Field | Type | Validation | Options |
|---------------|----------------------|-----------------|
| Parental support for counseling | Radio | Required | 'Yes, they would join', 'They're supportive but will not be able to join', 'I prefer to handle this independently', 'I haven't discussed this with them in detail' |
| Partial funding approach | Radio | Required | 'Can fund fully through our savings', 'Defer to following year and apply for additional external scholarships', 'Mainly through an education loan', 'I require full scholarship support to proceed', 'I need to ask my parents' |

#### Parent-Specific Fields
| Field | Type | Validation | Options |
|---------------|----------------------|-----------------|
| Financial planning approach | Radio | Required | 'Can fund fully through our savings', 'Primarily through our savings, with a supplemental education loan as needed', 'Mainly through an education loan', 'I require full scholarship support to proceed' |

### Step 3: Counselling Form
| Field | Type | Validation | Options |
|---------------|----------------------|-----------------|
| Selected date | Calendar | Optional | Next 7 days available |
| Selected time slot | Button Group | Optional | Available slots between 10 AM and 8 PM |

## 3. Form Flow and Navigation

### Normal Flow
1. User starts at Personal Details Form (Step 1)
2. After completing Step 1, system checks:
   - If grade is "7_below": Form is submitted directly with category "drop"
   - If grade is "masters": User proceeds to Masters Academic Details Form (Step 2B)
   - Otherwise: User proceeds to Academic Details Form (Step 2A)
3. After completing Step 2:
   - System determines lead category
   - If lead category is "nurture": User proceeds to Extended Nurture Form (Step 2.5)
   - Otherwise: User sees evaluation animation and proceeds to Counselling Form (Step 3)
4. After completing Step 2.5:
   - System re-categorizes lead based on Extended Nurture form answers
   - If re-categorized as "nurture": Form is submitted directly
   - Otherwise: User proceeds to Counselling Form (Step 3)
5. After completing Step 3, form is submitted with all data

### Progress Indicators
- Progress bar at the top shows 25% for Step 1, 50% for Step 2, 75% for Step 2.5, 100% for Step 3
- Current step is highlighted
- Mobile navigation adapts to smaller screens

## 4. Button Actions and Triggers

### Step 1: Personal Details Form
- **Continue Button**: 
  - Validates all fields
  - If valid: Updates form store with data
  - For grade "7_below": Submits form with drop category
  - Otherwise: Advances to Step 2

### Step 2A/2B: Academic Details Form
- **Previous Button**:
  - Saves current form data
  - Returns to Step 1
- **Next Button**:
  - Validates all fields
  - If valid: Updates form store with data
  - Determines lead category
  - For "nurture" category: Shows evaluation animation and advances to Step 2.5
  - Otherwise: Shows evaluation animation and advances to Step 3

### Step 2.5: Extended Nurture Form
- **Previous Button**:
  - Saves current form data
  - Returns to Step 2
- **Proceed Button**:
  - Validates all fields
  - If valid: Updates form store with data
  - Re-categorizes lead based on form responses
  - If re-categorized as "nurture": Submits form directly
  - Otherwise: Advances to Step 3

### Step 3: Counselling Form
- **Submit Application Button**:
  - Enabled only if date and time slot selected
  - Submits complete form data via webhook
  - Shows success message

### Evaluation Animation
- Triggered after Step 2 for all leads
- Shows analysis animation for 10 seconds
- Automatically advances to next step after completion

## 5. Special Cases and Conditional Logic

### Grade 7 or Below
- Form submits directly after Step 1
- Category set to "drop"
- No Step 2 or 3 presented

### Masters Applications
- Different form questions in Step 2
- Application preparation status determines initial filtering:
  - "undecided_need_help" → nurture 
  - Otherwise → proceed based on target university evaluation
- Target universities determine category:
  - "top_20_50" → masters-l1
  - "top_50_100" or "partner_university" → masters-l2
  - "unsure" → nurture

### Full Scholarship Requirement
- Any application with "full_scholarship" selected goes to nurture category by default

### Counselor Assignment in Step 3
- Based on lead category:
  - bch category: Shows Viswanathan as counselor
  - Other categories: Shows Karthik Lakshman as counselor

### Time Slots in Counselling Form
- For today's date: Only shows slots at least 2 hours from current time
- All other dates: Shows full range of available slots (10 AM to 8 PM, except 2 PM)
- Users can only select dates within the next 7 days

## 6. Form Data Handling

### Data Storage
- Form data is stored in Zustand store (`formStore.ts`)
- Each step updates the store with new form fields
- Final submission combines all stored data

### Lead Categorization
- Initial categorization performed in `leadCategorization.ts` after Step 2
- Re-categorization performed after Extended Nurture Form (Step 2.5)
- Categories: bch, lum-l1, lum-l2, masters-l1, masters-l2, nurture, drop
- Based on complex criteria including grade, form filler type, curriculum, and scholarship requirements

### Form Submission
- Webhook-based submission to Make.com integration
- Environment variables determine API endpoints
- Tracks total time spent and step completion
- Sends analytics events to Google Analytics and Meta Pixel

## 7. Meta Pixel Event Architecture

The following events are implemented in the application:

### CTA Buttons:
- `admissions_cta_header_[environment]`: Triggered on header CTA click
- `admissions_cta_hero_[environment]`: Triggered on hero section CTA click

### Form Navigation:
- `admissions_page1_continue_[environment]`: Triggered on Step 1 completion
- `admissions_page2_next_regular_[environment]`: Triggered on Step 2 completion (non-masters)
- `admissions_page2_next_masters_[environment]`: Triggered on Step 2 completion (masters)
- `admissions_page_view_[environment]`: Triggered on form page views
- `admissions_form_complete_[environment]`: Triggered on form completion

### Counselling Form Events:
- `admissions_page3_submit_[lead_category]_[environment]`: Triggered when lead submits counselling form

### Complete Flow Events:
- `admissions_flow_complete_bch_[environment]`: Triggered when a BCH lead completes entire form flow
- `admissions_flow_complete_luminaire_[environment]`: Triggered when a Luminaire lead (l1 or l2) completes flow
- `admissions_flow_complete_masters_[environment]`: Triggered when a Masters lead completes flow