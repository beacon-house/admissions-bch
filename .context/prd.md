# Product Requirements - Admissions Landing Page

Last updated: 2026-02-04

## Purpose
Capture and qualify leads from Google Ads for Beacon House Ivy League admissions consulting.

## Target Users
- Parents of students in Grades 8-12 seeking US university admissions guidance
- Students applying to Masters programs (auto-routed to nurture if student-filled)
- High-intent prospects willing to invest in premium consulting

## Core Features

### Multi-Step Form (4 Steps + Conditional)
1. **Step 1: Personal Details**
   - Form filler type (parent/student)
   - Grade selection (7_below, 8, 9, 10, 11, 12, masters)
   - Student name (first + last), parent name
   - Email, phone (10-digit), area of residence
   - WhatsApp consent

2. **Step 2A: Academic Details (Grades 8-12)**
   - Curriculum type (IB, IGCSE, CBSE, ICSE, State_Boards, Others)
   - School name
   - Grade format (GPA 1-10 or Percentage 1-100)
   - Target university rank (top_20, top_50, top_100, any_good)
   - Preferred countries (multi-select)
   - Scholarship requirement (optional, partial, full)
   - Contact preferences (call/whatsapp/email with numbers)

3. **Step 2B: Masters Academic Details**
   - Intake period, graduation status, work experience
   - Field of study, entrance exams (GRE/GMAT)
   - Application preparation status (researching, taken_exams, undecided)
   - Target universities tier (top_20_50, top_50_100, partner, unsure)
   - Support level needed

4. **Step 2.5: Extended Nurture (Conditional)**
   - Shown only to: **parent-filled**, Grades 11-12, initially categorized as nurture
   - Questions: partial funding approach, strong profile intent
   - Enables re-qualification to lum-l2

5. **Step 3: Counselling Booking**
   - Date picker (next 7 days)
   - Time slot selector (10 AM - 8 PM)
   - Counselors: Viswanathan or Karthik Lakshman

### Lead Qualification System (v6.2)
- 7 categories: bch, lum-l1, lum-l2, masters-l1, masters-l2, nurture, drop
- Automatic categorization based on grade, form filler, scholarship, curriculum
- Student-filled forms → always nurture (bypass counselling)
- Spam detection (GPA=10 or %=100) → nurture
- IB/IGCSE students can qualify for bch/lum (exception to student rule)
- Re-qualification pathway via Extended Nurture for parent nurture leads

### Analytics & Tracking
- 18 Meta Pixel custom events (environment-suffixed)
- Google Analytics GA4 (production only)
- Hotjar session recording
- Event properties: lead_category, time_spent, grade, curriculum, scholarship

## User Stories

### Parents
- Quickly provide child's academic details to get matched with a counselor
- Understand service tier via scholarship requirement question
- Book counselling slot directly after qualification

### Students
- Explore admissions consulting options (→ nurture, no hard sell)
- IB/IGCSE students with strong profiles can still qualify

### Masters Applicants
- Indicate preparation status and target university tier
- Get matched with appropriate support level

## Success Metrics
- Form completion rate by category
- Qualified lead conversion (bch, lum-l1, lum-l2, masters-l1, masters-l2)
- Counselling slot booking rate
- Time to form completion

## Constraints
- No direct database access (webhook-only to Make.com)
- Production analytics only on admissions.beaconhouse.in
- Must support mobile/tablet/desktop responsive
