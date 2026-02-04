# Architecture - Admissions Landing Page

Last updated: 2026-02-04

## Data Flow
```
User → React Hook Form → Zod → Zustand → Lead Categorization (v6.2)
                                                 ↓
                           ┌─────────────────────┴──────────────────┐
                           ↓                                        ↓
                     Webhook POST                            Analytics Events
                     (dual scholarship values)               (Meta Pixel + GA4)
                           ↓
                     Make.com → Google Sheets
```

## Form Flow
```
Step 1 → grade=7_below? → DROP → Submit
         ↓ no
      Step 2 → student-filled? → NURTURE → Submit
               ↓ no
            spam? → NURTURE → Submit
               ↓ no
            qualified? → Step 3 → Submit
               ↓ no (nurture)
            parent + grade 11/12? → Step 2.5 → re-check → Step 3 or Submit
```

## Lead Categorization (v6.2) - Check Order
1. Student form filler → `nurture`
2. Spam (GPA=10 or %=100) → `nurture`
3. Grade 7 or below → `drop`
4. Full scholarship (non-masters) → `nurture`
5. Masters undecided → `nurture`
6. Masters + top_20_50 → `masters-l1`
7. Masters + top_50_100/partner → `masters-l2`
8. Grades 8-10 + parent + optional/partial → `bch`
9. Grade 11 + parent/IB-IGCSE + top_20 + optional/partial → `bch`
10. Grades 11-12 + parent/IB-IGCSE + optional → `lum-l1`
11. Grades 11-12 + parent/IB-IGCSE + partial → `lum-l2`
12. Default → `nurture`

**Extended Nurture Re-cat:** `accept_loans`/`affordable_alternatives` → `lum-l2`

## State (Zustand)
```
formStore: currentStep, formData, isSubmitting, isSubmitted, startTime, triggeredEvents
```

## Components
```
App.tsx (Router)
├── LandingPage.tsx
├── FormPage.tsx → FormContainer.tsx (orchestrator)
│   ├── PersonalDetailsForm.tsx (Step 1)
│   ├── AcademicDetailsForm.tsx (Step 2A)
│   ├── MastersAcademicDetailsForm.tsx (Step 2B)
│   ├── ExtendedNurtureForm.tsx (Step 2.5)
│   └── CounsellingForm.tsx (Step 3)
└── NotFound.tsx
```

## Key Modules
| File | Purpose |
|------|---------|
| `src/lib/leadCategorization.ts` | `categorizeForStep2()`, `recategorizeFromExtendedNurture()` |
| `src/lib/pixel.ts` | `trackEvent()`, 18 event functions |
| `src/lib/form.ts` | `submitFormData()`, scholarship mapping |
| `src/schemas/form.ts` | Zod validation schemas |
| `src/store/formStore.ts` | Zustand store |

## Validation
- Email: RFC | Phone: 10 digits | GPA: 1-10 | Percentage: 1-100
- Contact methods: At least one required
