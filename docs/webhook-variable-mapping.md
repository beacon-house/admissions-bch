# Webhook Variable Mapping for Google Spreadsheet

This document lists all webhook variables sent in the payload for different lead categories, helping you structure your Google Spreadsheet columns appropriately.

## Lead Categories Overview

1. **bch** - Premium category for high-priority leads
2. **lum-l1** - Luminaire Level 1 (medium-high priority)
3. **lum-l2** - Luminaire Level 2 (medium priority)
4. **masters-l1** - Masters Level 1 (high priority)
5. **masters-l2** - Masters Level 2 (medium priority)
6. **nurture** - Development category (requires further nurturing)
7. **drop** - Direct submission for Grade 7 or below

## Common Variables (All Lead Categories)

| Variable Name | Description | Example Values |
|---------------|-------------|----------------|
| studentFirstName | Student's first name | "John" |
| studentLastName | Student's last name | "Smith" |
| parentName | Parent's full name | "Jane Smith" |
| email | Parent's email address | "jane@example.com" |
| phoneNumber | Contact phone number | "9876543210" |
| whatsappConsent | Whether WhatsApp consent was given | `true`, `false` |
| currentGrade | Student's grade in Academic Year 25-26 | "7_below", "8", "9", "10", "11", "12", "masters" |
| formFillerType | Who filled the form | "parent", "student" |
| lead_category | Determined lead category | "bch", "lum-l1", "lum-l2", "nurture", "masters-l1", "masters-l2", "drop" |
| total_time_spent | Total time in seconds spent on form | `120` |
| created_at | Timestamp when form was submitted | "2025-04-12T15:30:45.123Z" |
| step_completed | Last form step completed | `1`, `2`, `2.5`, `3` |

## Non-Masters Categories (bch, lum-l1, lum-l2, nurture)

| Variable Name | Lead Categories | Description | Example Values |
|---------------|----------------|-------------|----------------|
| curriculumType | bch, lum-l1, lum-l2, nurture | Type of curriculum | "IB", "IGCSE", "CBSE", "ICSE", "State_Boards", "Others" |
| schoolName | bch, lum-l1, lum-l2, nurture | Student's school name | "Delhi Public School" |
| gradeFormat | bch, lum-l1, lum-l2, nurture | Format of grade provided | "gpa", "percentage" |
| gpaValue | bch, lum-l1, lum-l2, nurture | GPA value (if gradeFormat is 'gpa') | "8.5" |
| percentageValue | bch, lum-l1, lum-l2, nurture | Percentage value (if gradeFormat is 'percentage') | "85" |
| targetUniversityRank | bch, lum-l1, lum-l2, nurture | Target university rank | "top_20", "top_50", "top_100", "any_good" |
| preferredCountries | bch, lum-l1, lum-l2, nurture | Array of selected preferred countries | ["USA (Rs. 1.6-2 Cr)", "UK (Rs. 1.2-1.6 Cr)"] |
| scholarshipRequirement | bch, lum-l1, lum-l2, nurture | Level of scholarship needed | "scholarship_optional", "partial_scholarship", "full_scholarship" |
| mappedScholarshipRequirement | bch, lum-l1, lum-l2, nurture | Mapped legacy value for internal use | "good_to_have", "must_have" |

## Masters Categories (masters-l1, masters-l2)

| Variable Name | Lead Categories | Description | Example Values |
|---------------|----------------|-------------|----------------|
| schoolName | masters-l1, masters-l2 | Current/previous university name | "University of Delhi" |
| gradeFormat | masters-l1, masters-l2 | Format of grade provided | "gpa", "percentage" |
| gpaValue | masters-l1, masters-l2 | GPA value (if gradeFormat is 'gpa') | "8.5" |
| percentageValue | masters-l1, masters-l2 | Percentage value (if gradeFormat is 'percentage') | "85" |
| intake | masters-l1, masters-l2 | Which intake applying for | "aug_sept_2025", "jan_aug_2026", "jan_aug_2027", "other" |
| intakeOther | masters-l1, masters-l2 | Custom intake (if intake is 'other') | "Dec 2025" |
| graduationStatus | masters-l1, masters-l2 | Expected graduation | "2025", "2026", "2027", "others", "graduated" |
| graduationYear | masters-l1, masters-l2 | Graduation year (if applicable) | "2024" |
| workExperience | masters-l1, masters-l2 | Work experience in years | "0_years", "1_2_years", "3_5_years", "6_plus_years" |
| fieldOfStudy | masters-l1, masters-l2 | Intended field of study | "Computer Science" |
| entranceExam | masters-l1, masters-l2 | GRE/GMAT status | "gre", "gmat", "planning", "not_required" |
| examScore | masters-l1, masters-l2 | GRE/GMAT score | "320" |
| applicationPreparation | masters-l1, masters-l2 | Application preparation status | "researching_now", "taken_exams_identified_universities", "undecided_need_help" |
| targetUniversities | masters-l1, masters-l2 | Target university tier | "top_20_50", "top_50_100", "partner_university", "unsure" |
| supportLevel | masters-l1, masters-l2 | Level of support needed | "personalized_guidance", "exploring_options", "self_guided", "partner_universities" |
| scholarshipRequirement | masters-l1, masters-l2 | Level of scholarship needed | "scholarship_optional", "partial_scholarship", "full_scholarship" |

## Extended Nurture Form Variables (nurture category)

| Variable Name | Lead Categories | Description | Example Values |
|---------------|----------------|-------------|----------------|
| gradeSpecificAnswer | nurture | Grade-specific question answer | "interested_in_profile", "academics_focus", "graduating_2024_25_fall_25", "graduating_2024_25_fall_26", "starting_grade_12_2025_26" |
| extendedFormCompleted | nurture | Whether extended form was completed | `true` |
| nurtureSubcategory | nurture | Nurture subcategory | "nurture-success", "nurture-no-booking" |
| parentalSupport | nurture (student) | Parental support for counseling | "would_join", "supportive_limited", "handle_independently", "not_discussed" |
| partialFundingApproach | nurture (student) | Partial funding approach | "accept_cover_remaining", "defer_external_scholarships", "affordable_alternatives", "only_full_funding", "need_to_ask" |
| financialPlanning | nurture (parent) | Financial planning approach | "accept_loans", "defer_scholarships", "affordable_alternatives", "only_full_funding" |

## Counselling Form Variables (all except 'drop' and sometimes 'nurture')

| Variable Name | Lead Categories | Description | Example Values |
|---------------|----------------|-------------|----------------|
| counsellingSlotPicked | bch, lum-l1, lum-l2, masters-l1, masters-l2, nurture* | Whether a counselling slot was selected | `true`, `false` |
| counsellingDate | bch, lum-l1, lum-l2, masters-l1, masters-l2, nurture* | Selected counselling date | "Monday, April 15, 2025" |
| counsellingTime | bch, lum-l1, lum-l2, masters-l1, masters-l2, nurture* | Selected counselling time slot | "4 PM" |

*Only for nurture leads that are re-categorized after extended form

## Contact Methods Variables (all except 'drop')

| Variable Name | Lead Categories | Description | Example Values |
|---------------|----------------|-------------|----------------|
| preferredContactMethods | bch, lum-l1, lum-l2, masters-l1, masters-l2, nurture | Array of selected contact methods | ["call", "whatsapp", "email"] |
| callNumber | bch, lum-l1, lum-l2, masters-l1, masters-l2, nurture | Phone number for calls | "9876543210" |
| whatsappNumber | bch, lum-l1, lum-l2, masters-l1, masters-l2, nurture | WhatsApp number | "9876543210" |
| emailAddress | bch, lum-l1, lum-l2, masters-l1, masters-l2, nurture | Email address | "student@example.com" |

## Special Cases

### Grade 7 or Below (drop category)
For Grade 7 or below, the form is submitted directly after Step 1 with minimal information:

- studentFirstName
- studentLastName
- parentName
- email
- phoneNumber
- whatsappConsent
- currentGrade (value will be "7_below")
- formFillerType
- lead_category (value will be "drop")
- total_time_spent
- created_at
- step_completed (value will be `1`)

### Masters Nurture Category
For Masters applications categorized as "nurture", some specific variables:

- applicationPreparation (value will be "undecided_need_help")
- targetUniversities (value will typically be "unsure")

### Spreadsheet Preparation Tips

1. **Use one sheet per lead category** for easier management
2. **Include common variables in every sheet**
3. **Create a master sheet** that pulls data from all category sheets
4. **Use data validation** for fields with predetermined values
5. **Set up conditional formatting** to highlight missing or invalid data
6. **Create views** filtered by date ranges to analyze recent leads

This mapping should help you structure your Google Spreadsheet efficiently to store all webhook payload data by lead category.