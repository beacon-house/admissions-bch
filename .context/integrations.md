# Integrations - Admissions Landing Page

Last updated: 2026-02-04

## Webhook (Make.com)

**Endpoint:** `VITE_REGISTRATION_WEBHOOK_URL`
**Method:** POST | **Content-Type:** application/json

### Payload Structure
```
Common: studentFirstName, studentLastName, parentName, email, phoneNumber, areaOfResidence, whatsappConsent
Grades: currentGrade, formFillerType
Academic: curriculumType, schoolName, gradeFormat, gpaValue, percentageValue
Targets: targetUniversityRank, preferredCountries, scholarshipRequirement, mappedScholarshipRequirement
Masters: intake, graduationStatus, workExperience, fieldOfStudy, entranceExam, examScore, applicationPreparation, targetUniversities, supportLevel
Extended: parentalSupport, partialFundingApproach, strongProfileIntent, extendedFormCompleted
Counselling: counsellingSlotPicked, counsellingDate, counsellingTime
Contact: preferredContactMethods, callNumber, whatsappNumber, emailAddress
Meta: lead_category, total_time_spent, created_at, step_completed, triggeredEvents
```

**Scholarship Mapping:** Sends both original value AND mapped (`full_scholarship` → `must_have`, others → `good_to_have`)

---

## Meta Pixel

**ID:** `VITE_META_PIXEL_ID` | **File:** `src/lib/pixel.ts`

### 18 Events
| Event | Trigger |
|-------|---------|
| `admissions_cta_header_{env}` | Header CTA click |
| `admissions_cta_hero_{env}` | Hero CTA click |
| `admissions_page_view_{env}` | Form step loaded |
| `admissions_page1_continue_{env}` | Step 1 submitted |
| `parent_admissions_page1_continue_{env}` | Parent Step 1 |
| `admissions_page2_next_regular_{env}` | Step 2 non-masters |
| `admissions_page2_next_masters_{env}` | Step 2 masters |
| `admissions_qualified_lead_received_{env}` | Qualified (bch/lum-l1/lum-l2) |
| `admissions_form_complete_{env}` | Final submission |
| `admissions_page3_view_{category}_{env}` | Counselling view |
| `admissions_page3_submit_{category}_{env}` | Counselling submit |
| `admissions_flow_complete_bch_{env}` | BCH flow complete |
| `admissions_flow_complete_luminaire_{env}` | Luminaire flow complete |
| `admissions_flow_complete_masters_{env}` | Masters flow complete |
| `admissions_student_lead_{env}` | Student form filler |
| `admissions_spammy_parent_{env}` | Spam detected (GPA=10/%=100) |
| `admissions_masters_lead_{env}` | Masters grade selected |
| `admissions_stateboard_parent_{env}` | State board parent |

---

## Google Analytics (GA4)

**ID:** `G-ZRF7H5ZFXK` (hardcoded) | **File:** `src/lib/analytics.ts`
**Condition:** Only fires on `admissions.beaconhouse.in` domain

---

## Hotjar

**ID:** `5276781` (hardcoded in index.html)

---

## Environment Variables

```bash
VITE_ENVIRONMENT=dev|staging|prod      # Event suffix
VITE_META_PIXEL_ID=xxx                 # Meta Pixel
VITE_REGISTRATION_WEBHOOK_URL=xxx      # Webhook endpoint
```

---

## Planned Integrations

- **Google Calendar API** - Real slot availability (not started)
- **WhatsApp Business API** - Lead nurture automation (not started)
