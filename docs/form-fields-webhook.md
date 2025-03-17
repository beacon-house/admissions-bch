# Form Fields to Webhook Mapping

This document maps the form questions to their corresponding field names sent via the webhook URL. It covers both Masters and Non-Masters application flows across all steps of the form.

## Step 1: Personal Details (Common for All Applicants)

| Question/Field | Webhook Variable Name | Description | Possible Values |
|----------------|----------------------|-------------|-----------------|
| Grade in Academic Year 25-26 | `currentGrade` | Current/upcoming grade of the student | `7_below`, `8`, `9`, `10`, `11`, `12`, `masters` |
| Are you the parent or the student? | `formFillerType` | Who is filling the form | `parent`, `student` |
| Student's First Name | `studentFirstName` | First name of the student | Text string |
| Student's Last Name | `studentLastName` | Last name of the student | Text string |
| Parent's Name | `parentName` | Full name of the parent | Text string |
| Parent's Email | `email` | Parent's email address | Email format |
| Phone Number | `phoneNumber` | 10-digit mobile number | 10-digit number |
| WhatsApp Consent | `whatsappConsent` | Consent to receive updates via WhatsApp | `true`, `false` |

## Step 2: Academic Details (Non-Masters Flow)

| Question/Field | Webhook Variable Name | Description | Possible Values |
|----------------|----------------------|-------------|-----------------|
| Curriculum Type | `curriculumType` | Type of curriculum student follows | `IB`, `IGCSE`, `CBSE`, `ICSE`, `State_Boards`, `Others` |
| School Name | `schoolName` | Name of student's school | Text string |
| Academic Performance | `academicPerformance` | Student's academic standing | `top_5`, `top_10`, `top_25`, `others` |
| Target University Rank | `targetUniversityRank` | Desired university ranking target | `top_20`, `top_50`, `top_100`, `any_good` |
| Target Geographies | `preferredCountries` | Preferred destination countries | Array of selected countries |
| Level of scholarship needed | `scholarshipRequirement` | Original scholarship requirement | `full_scholarship`, `partial_scholarship`, `scholarship_optional` |
| Mapped scholarship requirement | `mappedScholarshipRequirement` | Internal mapped value (not used by webhook) | `must_have`, `good_to_have` |
| Contact Methods - Call | `call` (within `preferredContactMethods`) | Whether phone call is preferred | `true`, `false` |
| Phone number for calls | `callNumber` | Phone number for calls if selected | Text string |
| Contact Methods - WhatsApp | `whatsapp` (within `preferredContactMethods`) | Whether WhatsApp is preferred | `true`, `false` |
| WhatsApp number | `whatsappNumber` | WhatsApp number if selected | Text string |
| Contact Methods - Email | `email` (within `preferredContactMethods`) | Whether email is preferred | `true`, `false` |
| Email address | `emailAddress` | Email address if selected | Email string |

## Step 2: Academic Details (Masters Flow)

| Question/Field | Webhook Variable Name | Description | Possible Values |
|----------------|----------------------|-------------|-----------------|
| Current/Previous University | `schoolName` | Name of university | Text string |
| Expected graduation | `graduationStatus` | Expected graduation year | `2025`, `2026`, `2027`, `others`, `graduated` |
| Which intake are you applying for? | `intake` | Desired intake period | `aug_sept_2025`, `jan_2026`, `aug_sept_2026`, `other` |
| Other intake (if specified) | `intakeOther` | Custom intake if "other" selected | Text string |
| Work experience | `workExperience` | Years of work experience | `0_years`, `1_2_years`, `3_5_years`, `6_plus_years` |
| Grade format | `gradeFormat` | Format of provided grade | `gpa`, `percentage` |
| GPA value | `gpaValue` | GPA value if selected | Text string |
| Percentage value | `percentageValue` | Percentage if selected | Text string |
| Intended field of study | `fieldOfStudy` | Field student wants to study | Text string |
| GRE/GMAT score status | `entranceExam` | Entrance exam status | `gre`, `gmat`, `planning`, `not_required` |
| Exam score | `examScore` | Score if GRE/GMAT taken | Text string |
| Target Geographies | `preferredCountries` | Preferred destination countries | Array of selected countries |
| Level of scholarship needed | `scholarshipRequirement` | Original scholarship requirement | `full_scholarship`, `partial_scholarship`, `scholarship_optional` |
| Mapped scholarship requirement | `mappedScholarshipRequirement` | Internal mapped value (not used by webhook) | `must_have`, `good_to_have` |
| Contact Methods (same as non-masters) | `preferredContactMethods`, etc. | Contact preference details | Same as non-masters flow |

## Step 3: Counselling Form (Common for BCH/Luminaire Categories)

| Question/Field | Webhook Variable Name | Description | Possible Values |
|----------------|----------------------|-------------|-----------------|
| Selected date | `counsellingDate` | Chosen counselling date | Date string in format "Day, Month Day, Year" |
| Selected time slot | `counsellingTime` | Chosen time slot | Time string (e.g., "10 AM", "3 PM") |
| Counselling slot picked | `counsellingSlotPicked` | Whether a counselling slot was selected | `true`, `false` |

## Lead Categorization and Metadata

| Field | Webhook Variable Name | Description | Possible Values |
|-------|----------------------|-------------|-----------------|
| Lead Category | `lead_category` | Categorization based on criteria | `BCH`, `lum-l1`, `lum-l2`, `NURTURE`, `MASTERS` |
| Total Time Spent | `total_time_spent` | Time spent on form in seconds | Number |
| Created At | `created_at` | Timestamp of submission | ISO date string |
| Step Completed | `step_completed` | Last completed form step | `1`, `2`, `3` |

## Contact Method Formatting

Contact methods are sent in two formats:

1. As an array of preferred methods:
   ```
   preferredContactMethods: ["call", "whatsapp", "email"]
   ```

2. As individual detail fields:
   ```
   callNumber: "1234567890"
   whatsappNumber: "1234567890"
   emailAddress: "example@email.com"
   ```

## Notes on Scholarship Requirement

The form directly sends the original scholarship requirement values to the webhook:

- `full_scholarship` - User requires 100% financial assistance
- `partial_scholarship` - User requires partial financial support
- `scholarship_optional` - User can pursue studies without scholarship support

The application internally maps these values for lead categorization purposes only:
- `full_scholarship` maps to `must_have` (internal use only)
- `partial_scholarship` and `scholarship_optional` map to `good_to_have` (internal use only)

The webhook receives the original unmapped values in the `scholarshipRequirement` field.