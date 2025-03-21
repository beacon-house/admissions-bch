# Form Fields to Webhook Mapping

## Step 1: Personal Details

| Question/Field | Webhook Variable Name | Possible Values |
|---------------|----------------------|-----------------|
| Grade in Academic Year 25-26 | `currentGrade` | `7_below`, `8`, `9`, `10`, `11`, `12`, `masters` |
| Are you the parent or the student? | `formFillerType` | `parent`, `student` |
| Student's First Name | `studentFirstName` | Free text |
| Student's Last Name | `studentLastName` | Free text |
| Parent's Name | `parentName` | Free text |
| Parent's Email | `email` | Free text (email format) |
| Phone Number | `phoneNumber` | Free text (10 digits) |
| WhatsApp Consent | `whatsappConsent` | `true`, `false` |

## Step 2: Academic Details (Non-Masters)

| Question/Field | Webhook Variable Name | Possible Values |
|---------------|----------------------|-----------------|
| Curriculum Type | `curriculumType` | `IB`, `IGCSE`, `CBSE`, `ICSE`, `State_Boards`, `Others` |
| School Name | `schoolName` | Free text |
| Academic Performance | `academicPerformance` | `top_5`, `top_10`, `top_25`, `others` |
| Target University Rank | `targetUniversityRank` | `top_20`, `top_50`, `top_100`, `any_good` |
| Target Geographies | `preferredCountries` | Array of selected countries |
| Level of scholarship needed | `scholarshipRequirement` | `scholarship_optional`, `partial_scholarship`, `full_scholarship` |
| Contact Methods - Call | `call` | `true`, `false` |
| Phone number for calls | `callNumber` | Free text |
| Contact Methods - WhatsApp | `whatsapp` | `true`, `false` |
| WhatsApp number | `whatsappNumber` | Free text |
| Contact Methods - Email | `email` | `true`, `false` |
| Email address | `emailAddress` | Free text (email format) |

## Step 2: Academic Details (Masters)

| Question/Field | Webhook Variable Name | Possible Values |
|---------------|----------------------|-----------------|
| Current/Previous University | `schoolName` | Free text |
| Expected graduation | `graduationStatus` | `2025`, `2026`, `2027`, `others`, `graduated` |
| Which intake are you applying for? | `intake` | `aug_sept_2025`, `jan_2026`, `aug_sept_2026`, `other` |
| Other intake (if specified) | `intakeOther` | Free text |
| Work experience | `workExperience` | `0_years`, `1_2_years`, `3_5_years`, `6_plus_years` |
| Grade format | `gradeFormat` | `gpa`, `percentage` |
| GPA value | `gpaValue` | Free text |
| Percentage value | `percentageValue` | Free text |
| Intended field of study | `fieldOfStudy` | Free text |
| GRE/GMAT score status | `entranceExam` | `gre`, `gmat`, `planning`, `not_required` |
| Exam score | `examScore` | Free text |
| Have you started preparing for your Master's application? | `applicationPreparation` | `started_research`, `taking_exams`, `just_exploring`, `future_applicant` |
| Which best describes your target universities and programs? | `targetUniversities` | `top_20_50`, `top_50_100`, `unsure` |
| What level of support do you need for your Master's applications? | `supportLevel` | `personalized_guidance`, `exploring_options`, `self_guided`, `partner_universities` |
| Level of scholarship needed | `scholarshipRequirement` | `scholarship_optional`, `partial_scholarship`, `full_scholarship` |

## Step 3: Counselling Form

| Question/Field | Webhook Variable Name | Possible Values |
|---------------|----------------------|-----------------|
| Selected date | `counsellingDate` | Free text (date format) |
| Selected time slot | `counsellingTime` | Free text (time format) |
| Counselling slot picked | `counsellingSlotPicked` | `true`, `false` |

## Lead Categorization and Metadata

| Question/Field | Webhook Variable Name | Possible Values |
|---------------|----------------------|-----------------|
| Lead Category | `lead_category` | `BCH`, `lum-l1`, `lum-l2`, `NURTURE`, `masters-l1`, `masters-l2` |
| Total Time Spent | `total_time_spent` | Number (seconds) |
| Created At | `created_at` | ISO date string |
| Step Completed | `step_completed` | `1`, `2`, `3` |