# Form Component Flow Documentation

## 1. Form Overview

The application form is a multi-step lead generation system that collects information from prospective students and parents. Based on their inputs, the system categorizes leads into different segments for appropriate follow-up.

The form has these main components:
- **Step 1**: Personal Details Form
- **Step 2A**: Academic Details Form (for grades 8-12)
- **Step 2B**: Masters Academic Details Form (for Masters applicants)
- **Step 2.5**: Extended Nurture Form (for NURTURE category leads)
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
| Academic Performance | Select | Required | Top 5% of class, Top 10% of class, Top 25% of class, Others |
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
| GPA Value (if GPA selected) | Text | Required | /10 |
| Percentage Value (if Percentage selected) | Text | Required | % |
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

This step appears only for leads categorized as NURTURE after Step 2.

#### Common Questions (Both Parent and Student)
| Field | Type | Validation | Options |
|-------|------|------------|---------|
| Which steps have you already taken? | Checkbox Group | Min 1 required | Researched universities, Taken/registered for standardized tests, Participated in extracurricular activities, Started application materials, Connected with students/alumni, None of these yet |
| Grade-specific question | Radio | Required | Options vary based on grade |
| Target Universities | Text | Required | Free text for specific universities |

#### Student-Specific Questions
| Field | Type | Validation | Options |
|-------|------|------------|---------|
| Parental Support | Radio | Required | Would join, Supportive but limited availability, Handle independently, Not discussed in detail |
| Partial Funding Approach | Radio | Required | Accept and cover remaining, Defer for external scholarships, Consider alternatives, Only full funding |

#### Parent-Specific Questions
| Field | Type | Validation | Options |
|-------|------|------------|---------|
| Financial Planning | Radio | Required | Savings, Education loans, External scholarships, Liquidate investments, No specific plans |
| Resource Investment | Checkbox Group | Min 1 required | Academic support, Extracurricular development, Test preparation, University visits, Dedicated time, Limited investment |

### Step 3: Counselling Form

| Field | Type | Validation | Options |
|-------|------|------------|---------|
| Calendar Date Selection | Calendar | Optional | Next 7 days available |
| Time Slot Selection | Button Group | Optional | Available slots between 10 AM and 8 PM |

## 3. Form Flow and Navigation

### Normal Flow
1. User starts at Personal Details Form (Step 1)
2. After completing Step 1, system checks:
   - If grade is "7_below": Form is submitted directly with category "DROP"
   - If grade is "masters": User proceeds to Masters Academic Details Form (Step 2B)
   - Otherwise: User proceeds to Academic Details Form (Step 2A)
3. After completing Step 2:
   - System determines lead category
   - If category is "NURTURE": User sees nurture evaluation animation and proceeds to Extended Nurture Form (Step 2.5)
   - Otherwise: User sees evaluation animation and proceeds to Counselling Form (Step 3)
4. After completing Step 2.5 (Extended Nurture) or Step 3 (Counselling), form is submitted with all data

### Progress Indicators
- Progress bar at the top shows 25% for Step 1, 50% for Step 2, 75% for Step 2.5, 100% for Step 3
- Current step is highlighted
- Mobile navigation adapts to smaller screens

## 4. Button Actions and Triggers

### Step 1: Personal Details Form
- **Continue Button**: 
  - Validates all fields
  - If valid: Updates form store with data
  - For grade "7_below": Submits form with DROP category
  - Otherwise: Advances to Step 2

### Step 2A/2B: Academic Details Form
- **Previous Button**:
  - Saves current form data
  - Returns to Step 1
- **Next Button**:
  - Validates all fields
  - If valid: Updates form store with data
  - Determines lead category
  - For NURTURE category: Shows nurture evaluation animation and advances to Step 2.5
  - Otherwise: Shows evaluation animation and advances to Step 3

### Step 2.5: Extended Nurture Form
- **Previous Button**:
  - Returns to Step 2
- **Proceed to Booking Button**:
  - Validates all fields
  - If valid: Updates form store with extended nurture data
  - Advances to Step 3

### Step 3: Counselling Form
- **Submit Application Button**:
  - Enabled only if date and time slot selected
  - Submits complete form data via webhook
  - Shows success message

### Evaluation Animations
- **Regular Evaluation Animation**: 
  - Triggered after Step 2 for non-NURTURE leads
  - Shows analysis animation for 10 seconds
  - Automatically advances to Step 3 after completion

- **Nurture Evaluation Animation**:
  - Triggered after Step 2 for NURTURE leads
  - Shows different analysis messages focused on scholarship opportunities
  - Automatically advances to Step 2.5 after completion

## 5. Special Cases and Conditional Logic

### Grade 7 or Below
- Form submits directly after Step 1
- Category set to "DROP"
- No Step 2, 2.5 or 3 presented

### Masters Applications
- Different form questions in Step 2
- Application preparation status determines initial filtering:
  - "undecided_need_help" → NURTURE (goes to Extended Nurture Form)
  - Otherwise → proceed based on target university evaluation
- Target universities determine category:
  - "top_20_50" → masters-l1
  - "top_50_100" or "partner_university" → masters-l2
  - "unsure" → NURTURE

### NURTURE Categorization
- Any application with "full_scholarship" selected goes to NURTURE category
- NURTURE leads now go through Extended Nurture Form (Step 2.5) instead of direct submission
- Extended form questions differ based on form filler type (parent or student)

### Full Scholarship Requirement
- Any application with "full_scholarship" selected goes to NURTURE category
- Form continues to Extended Nurture form after Step 2

### Counselor Assignment in Step 3
- Based on lead category:
  - BCH category: Shows Viswanathan as counselor
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
- Performed in `leadCategorization.ts` after Step 2
- Categories: BCH, lum-l1, lum-l2, masters-l1, masters-l2, NURTURE, DROP
- Based on complex criteria including grade, form filler type, curriculum, and scholarship requirements

### Form Submission
- Webhook-based submission to Make.com integration
- Environment variables determine API endpoints
- Tracks total time spent and step completion
- Sends analytics events to Google Analytics and Meta Pixel

### Pixel Events
- Key form events tracked:
  - `admissions_cta_header_[environment]` - Header CTA clicks
  - `admissions_cta_hero_[environment]` - Hero section CTA clicks
  - `admissions_page1_continue_[environment]` - Step 1 completion
  - `admissions_page2_next_regular_[environment]` - Step 2 completion (non-masters)
  - `admissions_page2_next_masters_[environment]` - Step 2 completion (masters)
  - `admissions_page2_previous_[environment]` - Going back from Step 2 to Step 1
  - `admissions_page_view_[environment]` - Form page views
  - `admissions_form_complete_[environment]` - Form completion