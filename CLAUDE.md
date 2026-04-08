# Admissions Landing Page

Google Ads lead capture for Beacon House. Multi-step form with 7-category lead qualification.

## Stack
React 18 | TypeScript | Vite | Tailwind | Zustand | React Hook Form + Zod | Radix UI

## Commands
```bash
npm run dev      # Dev server (port 3000)
npm run build    # Production build
npm run lint     # ESLint
npm run preview  # Preview build
```

## MANDATORY Rule
**Always use AskUserQuestion tool** when you need clarification, have multiple approaches, or are unsure about anything. Krishna prefers iterative clarification over assumptions. Don't guess. Don't assume. Ask first, then deliver.

## Context Docs
Load `.context/` files when needed:

| File | Load When |
|------|-----------|
| prd.md | Understanding form requirements, adding features |
| progress.md | Checking what's done, planning next steps |
| todo.md | Picking up tasks, prioritizing work |
| architecture.md | Understanding data flow, form logic, state management |
| integrations.md | Analytics setup, webhook config, tracking events |

## Detailed Docs (docs/)
| File | Purpose |
|------|---------|
| custom-events-v3.md | Full event properties and flow examples |
| webhook-variable-mapping.md | Complete payload structure for Make.com |
| form-component-flow.md | Field lists, validation rules, navigation logic |
| landing-page-copy.md | Marketing copy and messaging |

## Key Files
- `src/lib/leadCategorization.ts` - Lead qualification rules (v6.2)
- `src/lib/pixel.ts` - Meta Pixel (18 events)
- `src/lib/analytics.ts` - Google Analytics (G-ZRF7H5ZFXK)
- `src/lib/form.ts` - Webhook submission
- `src/store/formStore.ts` - Zustand form state
- `src/components/forms/FormContainer.tsx` - Form orchestrator

## Lead Categories (7)
| Category | Description |
|----------|-------------|
| `bch` | Premium (parent-filled, grades 8-11, optional/partial scholarship) |
| `lum-l1` | Luminaire L1 (grades 11-12, optional scholarship) |
| `lum-l2` | Luminaire L2 (grades 11-12, partial scholarship) |
| `masters-l1` | Masters L1 (researching/taken exams, top 20-50) |
| `masters-l2` | Masters L2 (researching/taken exams, top 50-100) |
| `nurture` | Default (students, full scholarship, undecided) |
| `drop` | Grade 7 or below (submit after Step 1) |

## Critical Rules
1. **Student-filled = nurture** - All student forms → nurture, submit immediately after Step 2
2. **Spam detection** - GPA=10 or %=100 → nurture (checked before categorization)
3. **Extended Nurture** - Parent-filled Grades 11-12 nurture → Step 2.5 for re-qualification
4. **Dual scholarship values** - Webhook sends both original + mapped (`full_scholarship` → `must_have`)
5. **No Supabase** - All data via webhook to Make.com → Google Sheets

## Environment Variables
```
VITE_ENVIRONMENT              # dev/staging/prod (event suffix)
VITE_META_PIXEL_ID           # Meta Pixel ID
VITE_REGISTRATION_WEBHOOK_URL # Form submission endpoint
```

## Deployment
- **Production:** admissions.beaconhouse.in (Netlify)
- **GA4:** Only tracks on production domain

## Parent Context
- **Workspace:** `/Users/kg/Desktop/Work/Beacon House/CLAUDE.md`
- **Project details:** `/Users/kg/Desktop/Work/Beacon House/context-management/CONTEXT-admissions-landing-page.md`

---
**IMPORTANT:** After ANY code change, update relevant `.context/` docs. Use AskUserQuestion when uncertain.
