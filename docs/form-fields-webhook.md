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
| Grade Format | `gradeFormat` | `gpa`, `percentage` |
| GPA Value (if GPA selected) | `gpaValue` | Free text (1-10 range, up to 1 decimal) |
| Percentage Value (if Percentage selected) | `percentageValue` | Free text (1-100 range, up to 1 decimal) |
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
| Which intake are you applying for? | `intake` | `aug_sept_2025`, `jan_aug_2026`, `jan_aug_2027`, `other` |
| Other intake (if specified) | `intakeOther` | Free text |
| Work experience | `workExperience` | `0_years`, `1_2_years`, `3_5_years`, `6_plus_years` |
| Grade format | `gradeFormat` | `gpa`, `percentage` |
| GPA value | `gpaValue` | Free text (1-10 range, up to 1 decimal) |
| Percentage value | `percentageValue` | Free text (1-100 range, up to 1 decimal) |
| Intended field of study | `fieldOfStudy` | Free text |
| GRE/GMAT score status | `entranceExam` | `gre`, `gmat`, `planning`, `not_required` |
| Exam score | `examScore` | Free text |
| Have you started preparing for your Master's application? | `applicationPreparation` | `researching_now`, `taken_exams_identified_universities`, `undecided_need_help` |
| Which best describes your target universities and programs? | `targetUniversities` | `top_20_50`, `top_50_100`, `partner_university`, `unsure` |
| What level of support do you need for your Master's applications? | `supportLevel` | `personalized_guidance`, `exploring_options`, `self_guided`, `partner_universities` |
| Level of scholarship needed | `scholarshipRequirement` | `scholarship_optional`, `partial_scholarship`, `full_scholarship` |

## Step 2.5: Extended Nurture Form

### Common Fields (Both Parent and Student)

| Question/Field | Webhook Variable Name | Possible Values |
|---------------|----------------------|-----------------|
| Grade-specific question response | `gradeSpecificAnswer` | Values vary based on grade: `interested_in_profile`, `academics_focus`, `graduating_2024_25_fall_25`, `graduating_2024_25_fall_26`, `starting_grade_12_2025_26`, `preparing_applications`, `researching_options`, `planning_ahead` |
| Extra-curricular interests | `targetUniversitiesList` | Free text |
| Extended form completion status | `extendedFormCompleted` | `true` |
| Nurture subcategory | `nurtureSubcategory` | `nurture-success`, `nurture-no-booking` |

### Student-Specific Fields

| Question/Field | Webhook Variable Name | Possible Values |
|---------------|----------------------|-----------------|
| Parental support for counseling | `parentalSupport` | `would_join`, `supportive_limited`, `handle_independently`, `not_discussed` |
| Partial funding approach | `partialFundingApproach` | `accept_cover_remaining`, `defer_external_scholarships`, `affordable_alternatives`, `only_full_funding`, `need_to_ask` |

### Parent-Specific Fields

| Question/Field | Webhook Variable Name | Possible Values |
|---------------|----------------------|-----------------|
| Financial planning approach | `financialPlanning` | `savings`, `education_loans`, `external_scholarships`, `liquidate_investments`, `no_specific_plans` |

## Step 3: Counselling Form

| Question/Field | Webhook Variable Name | Possible Values |
|---------------|----------------------|-----------------|
| Selected date | `counsellingDate` | Free text (date format) |
| Selected time slot | `counsellingTime` | Free text (time format) |
| Counselling slot picked | `counsellingSlotPicked` | `true`, `false` |

## Lead Categorization and Metadata

| Question/Field | Webhook Variable Name | Possible Values |
|---------------|----------------------|-----------------|
| Lead Category | `lead_category` | `bch`, `lum-l1`, `lum-l2`, `nurture`, `masters-l1`, `masters-l2`, `drop`, `nurture-success`, `nurture-no-booking` |
| Total Time Spent | `total_time_spent` | Number (seconds) |
| Created At | `created_at` | ISO date string |
| Step Completed | `step_completed` | `1`, `2`, `2.5`, `3` |