# Form Component Flow Documentation

## 1. Form Overview

The application form is a multi-step lead generation system that collects information from prospective students and parents. Based on their inputs, the system categorizes leads into different segments for appropriate follow-up.

The form has these main components:
- **Step 1**: Personal Details Form
- **Step 2A**: Academic Details Form (for grades 8-12)
- **Step 2B**: Masters Academic Details Form (for Masters applicants)
- **Step 2.5**: Extended Nurture Form (for nurture category leads in grades 11-12)
- **Step 3**: Counselling Form (schedules a session with appropriate counselor)

## 2. Form Questions by Component

### Step 1: Personal Details Form

| Field | Type | Validation | Options | Webhook Variable |
|-------|------|------------|---------|-----------------|
| Are you the parent or the student? | Select | Required | Parent, Student | `formFillerType` |
| Grade in Academic Year 25-26 | Select | Required | Grade 12, Grade 11, Grade 10, Grade 9, Grade 8, Grade 7 or below, Apply for Masters | `currentGrade` |
| Student's First Name | Text | Min 2 chars | | `studentFirstName` |
| Student's Last Name | Text | Min 1 char | | `studentLastName` |
| Parent's Name | Text | Min 2 chars | | `parentName` |
| Parent's Email | Email | Valid email | | `email` |
| Phone Number | Text | 10 digits | | `phoneNumber` |
| WhatsApp Consent | Checkbox | | True/False (default: True) | `whatsappConsent` |

### Step 2A: Academic Details Form (Non-Masters)

| Field | Type | Validation | Options | Webhook Variable |
|-------|------|------------|---------|-----------------|
| Curriculum Type | Select | Required | IB, IGCSE, CBSE, ICSE, State Boards, Others | `curriculumType` |
| School Name | Text | Min 2 chars | | `schoolName` |
| Grade Format | Button Group | Required | GPA Format, Percentage Format | `gradeFormat` |
| GPA Value (if GPA selected) | Numeric Input | Required, 1-10 range | Float with up to 1 decimal point | `gpaValue` |
| Percentage Value (if Percentage selected) | Numeric Input | Required, 1-100 range | Float with up to 1 decimal point | `percentageValue` |
| Target University Rank | Select | Required | Top 20 Universities, Top 50 Universities, Top 100 Universities, Any Good University | `targetUniversityRank` |
| Target Geographies | Checkbox Group | Min 1 selection | USA, UK, Canada, Australia, Europe, Asia, Middle East, Others, Need Guidance | `preferredCountries` |
| Level of scholarship needed | Radio | Required | Full scholarship needed, Partial scholarship needed, Scholarship optional | `scholarshipRequirement` |
| Contact Methods | Checkbox Group | Min 1 selection | Phone Call, WhatsApp, Email | `preferredContactMethods` |
| Contact Details | Text fields | Based on selection | Phone number, WhatsApp number, Email address | `callNumber`, `whatsappNumber`, `emailAddress` |

### Step 2B: Masters Academic Details Form

#### University & Program Information
| Field | Type | Validation | Options | Webhook Variable |
|-------|------|------------|---------|-----------------|
| Current/Previous University | Text | Min 2 chars | | `schoolName` |
| When do you expect to graduate? | Select | Required | 2025, 2026, 2027, Others, Graduated Already | `graduationStatus` |
| Which intake are you applying for? | Select | Required | Aug/Sept 2025, Jan or Aug 2026, Jan or Aug 2027, Others | `intake` |
| Other intake (when "Others" selected) | Text | | | `intakeOther` |
| How many years of work experience do you have? | Select | Required | 0 years, 1-2 years, 3-5 years, 6+ years | `workExperience` |
| What is your intended field of study? | Text | Required | | `fieldOfStudy` |

#### Academic Information
| Field | Type | Validation | Options | Webhook Variable |
|-------|------|------------|---------|-----------------|
| Grade Format | Button Group | Required | GPA Format, Percentage Format | `gradeFormat` |
| GPA Value (if GPA selected) | Numeric Input | Required, 1-10 range | Float with up to 1 decimal point | `gpaValue` |
| Percentage Value (if Percentage selected) | Numeric Input | Required, 1-100 range | Float with up to 1 decimal point | `percentageValue` |
| GRE/GMAT Status | Select | Required | Yes - GRE, Yes - GMAT, No - planning to take it, Not required for my programs | `entranceExam` |
| Exam Score (if GRE/GMAT selected) | Text | | | `examScore` |

#### Application Preparation
| Field | Type | Validation | Options | Webhook Variable |
|-------|------|------------|---------|-----------------|
| Have you started preparing for your Master's application? | Radio | Required | Yes I'm researching right now, Have taken GRE/GMAT & identified universities, Yet to decide if I want to apply | `applicationPreparation` |
| Target Universities | Radio | Required | Top 20-50 ranked global university, Open to 50-100 ranked universities, Partner University without GRE/GMAT, Unsure about preferences | `targetUniversities` |
| Support Level Needed | Radio | Required | Personalized guidance, Exploring options, Self-guided, Partner Universities | `supportLevel` |
| Scholarship Requirement | Radio | Required | Full scholarship needed, Partial scholarship needed, Scholarship optional | `scholarshipRequirement` |
| Contact Methods | Same as Step 2A | | | Same as Step 2A |

### Step 2.5: Extended Nurture Form

#### Student Form Filler Questions
| Field | Type | Validation | Options | Webhook Variable |
|-------|------|------------|---------|-----------------|
| Would your parents be able to join a counseling session? | Radio | Required | Yes, they would join; They're supportive but will not be able to join; I prefer to handle this independently; I haven't discussed this with them in detail | `parentalSupport` |
| If your preferred university offers admission with partial funding, what would be your approach? | Radio | Required | Accept and find ways to cover remaining costs using loans; Defer to following year and apply for additional external scholarships; Consider more affordable university alternatives; Would only proceed with full funding; I need to ask my parents | `partialFundingApproach` |
| Would you like help in building a strong profile? | Radio | Required | Interested in doing relevant work to build strong profile; Focus is on Academics, will only do the minimum needed to get an admit | `strongProfileIntent` |

#### Parent Form Filler Questions
| Field | Type | Validation | Options | Webhook Variable |
|-------|------|------------|---------|-----------------|
| If your preferred university offers admission with partial funding, what would be your approach? | Radio | Required | Accept and find ways to cover remaining costs using loans; Defer to following year and apply for additional external scholarships; Consider more affordable university alternatives; Would only proceed with full funding | `partialFundingApproach` |
| Would you like help in building your child's profile? | Radio | Required | Interested in doing relevant work to build strong profile; Focus is on Academics, will only do the minimum needed to get an admit | `strongProfileIntent` |

### Step 3: Counselling Form
| Field | Type | Validation | Options | Webhook Variable |
|-------|------|------------|---------|-----------------|
| Selected date | Calendar | Optional | Next 7 days available | `counsellingDate` |
| Selected time slot | Button Group | Optional | Available slots between 10 AM and 8 PM | `counsellingTime` |

## 3. Form Flow and Navigation

### Normal Flow
1. User starts at Personal Details Form (Step 1)
2. After completing Step 1, system checks:
   - If grade is "7_below": Form is submitted directly with category "drop"
   - If grade is "masters": User proceeds to Masters Academic Details Form (Step 2B)
   - Otherwise: User proceeds to Academic Details Form (Step 2A)
3. After completing Step 2:
   - System determines lead category
   - If lead category is "nurture" and grade is 11 or 12: User proceeds to Extended Nurture Form (Step 2.5)
   - If lead category is "nurture" and grade is not 11 or 12 (including masters): Form is submitted directly
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
  - Tracks `admissions_page1_continue_[environment]` pixel event

### Step 2A/2B: Academic Details Form
- **Previous Button**:
  - Saves current form data
  - Returns to Step 1
- **Next Button**:
  - Validates all fields
  - If valid: Updates form store with data
  - Determines lead category
  - For "nurture" category in grades 11-12: Shows evaluation animation and advances to Step 2.5
  - For "nurture" category in other grades: Submits form directly
  - Otherwise: Shows evaluation animation and advances to Step 3
  - Tracks appropriate event: `admissions_page2_next_regular_[environment]` or `admissions_page2_next_masters_[environment]`

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
  - Tracks `admissions_page3_submit_[lead_category]_[environment]` and `admissions_form_complete_[environment]` events

### Evaluation Animation
- Triggered after Step 2 for all non-nurture leads
- Triggered for nurture leads in grades 11-12 before Step 2.5
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

### Extended Nurture Form Conditions
- Only shown to grade 11 and 12 leads categorized as "nurture"
- If student form filler with parental support other than "would_join", categorized as "nurture"
- For student form filler:
  - `partialFundingApproach` = "accept_cover_remaining" → potential recategorization to bch or lum-l1
  - `partialFundingApproach` = "defer_external_scholarships" → lum-l2
  - Otherwise → nurture
- For parent form filler:
  - `partialFundingApproach` = "accept_loans" → lum-l1
  - `partialFundingApproach` = "affordable_alternatives" → lum-l2
  - Otherwise → nurture

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

## 8. Lead Categorization Logic

### Initial Categorization

After Step 2, leads are placed into one of these categories:

1. **bch** (premium category):
   - Grade 9 or 10 + parent form filler + not requiring full scholarship
   - Grade 11 + (parent form filler OR student with IB/IGCSE curriculum) + not requiring full scholarship + targeting top 20 universities

2. **lum-l1** (Luminaire Level 1):
   - Grade 11 or 12 + (parent form filler OR student with IB/IGCSE curriculum) + scholarship optional + not targeting top 20 universities (for Grade 11)

3. **lum-l2** (Luminaire Level 2):
   - Grade 11 or 12 + (parent form filler OR student with IB/IGCSE curriculum) + partial scholarship required

4. **masters-l1** (Masters Level 1):
   - Masters grade + not "undecided" about applying + targeting top 20-50 universities

5. **masters-l2** (Masters Level 2):
   - Masters grade + not "undecided" about applying + targeting top 50-100 or partner universities

6. **nurture** (development category):
   - Full scholarship required (automatic override)
   - Masters grade + undecided about applying or unsure about university preferences
   - Grade 11 or 12 + student form filler + non-IB/IGCSE curriculum
   - Any other lead not matching above categories

7. **drop** (direct submission):
   - Grade 7 or below

### Re-categorization after Extended Nurture Form

For **Parent** form fillers:
- `partialFundingApproach` = "accept_loans" → lum-l1
- `partialFundingApproach` = "affordable_alternatives" → lum-l2
- `partialFundingApproach` = "defer_scholarships" or "only_full_funding" → nurture

For **Student** form fillers:
- First check `parentalSupport`:
  - Any value other than "would_join" → nurture (regardless of other answers)
  - If "would_join", then check `partialFundingApproach`:
    - "accept_cover_remaining" + (Grades 9-10 OR Grade 11 with top_20 target and IB/IGCSE) → bch
    - "accept_cover_remaining" + (Grades 11-12 with IB/IGCSE) → lum-l1
    - "defer_external_scholarships" → lum-l2
    - "affordable_alternatives", "only_full_funding", or "need_to_ask" → nurture