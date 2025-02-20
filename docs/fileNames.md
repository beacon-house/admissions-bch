# Project Files Documentation

## Project Overview
This is a React-based landing page and lead generation system for Beacon House, an elite university admissions consultancy. The project uses Vite as the build tool, React with TypeScript for the frontend, Tailwind CSS for styling, and Supabase for the backend database.

## Tech Stack
- Frontend Framework: React 18.3.1 with TypeScript
- Build Tool: Vite 5.4.2
- Styling: Tailwind CSS 3.4.1
- Database: Supabase
- UI Components: Radix UI
- Icons: Lucide React
- Form Handling: React Hook Form with Zod validation
- Analytics: Google Analytics, Hotjar
- Routing: React Router DOM 6.22.3

## Core Files

### Configuration Files
1. `package.json`
   - Purpose: Project configuration and dependencies
   - Dependencies: Lists all project dependencies including React, Tailwind, Supabase, etc.
   - Watch out for: Version compatibility between packages

2. `tailwind.config.js`
   - Purpose: Tailwind CSS configuration
   - Dependencies: @tailwindcss/typography plugin
   - Components: Defines theme, colors, animations, and typography
   - Watch out for: Custom color scheme and animation definitions

3. `index.html`
   - Purpose: Entry point of the application
   - Components: Meta tags, analytics scripts (GA4, Hotjar)
   - Dependencies: Fonts (Poppins, Open Sans), external images
   - Watch out for: Font preloading, meta tags for SEO

4. `netlify.toml`
   - Purpose: Netlify deployment configuration
   - Components: Build settings, redirect rules
   - Watch out for: Client-side routing configuration

### Source Files

#### Core Application Files
1. `src/main.tsx`
   - Purpose: Application entry point
   - Components: App, Router
   - Dependencies: React, React Router
   - Watch out for: Router configuration

2. `src/App.tsx`
   - Purpose: Root component
   - Components: Header, LandingPage
   - Dependencies: Analytics integration
   - Watch out for: Analytics initialization

#### Components

1. `src/components/LandingPage.tsx`
   - Purpose: Main landing page
   - Components: Hero section, statistics, features, form
   - Dependencies: QualificationForm, UI components
   - Watch out for: Form visibility state management

2. `src/components/QualificationForm.tsx`
   - Purpose: Multi-step lead capture form
   - Components: Form steps, input fields
   - Dependencies: React Hook Form, Zod, Supabase
   - Watch out for: Form validation, submission logic

3. `src/components/NotFound.tsx`
   - Purpose: 404 error page
   - Dependencies: React Router
   - Watch out for: Routing integration

#### UI Components
Located in `src/components/ui/`:
- `input.tsx`: Input field component
- `label.tsx`: Form label component
- `progress.tsx`: Progress bar component
- `select.tsx`: Select dropdown component

#### Library Files

1. `src/lib/analytics.ts`
   - Purpose: Analytics integration
   - Dependencies: Google Analytics
   - Watch out for: Event tracking implementation

2. `src/lib/supabase.ts`
   - Purpose: Supabase client configuration
   - Dependencies: Supabase
   - Watch out for: Environment variables

3. `src/lib/utils.ts`
   - Purpose: Utility functions
   - Dependencies: clsx, tailwind-merge
   - Watch out for: Class name merging logic

### Database Migrations
Located in `supabase/migrations/`:
- Multiple migration files managing database schema
- Watch out for: Schema changes, RLS policies

### Types
`src/types/index.ts`
- Purpose: TypeScript type definitions
- Components: Form data types, lead scoring types
- Watch out for: Type synchronization with database schema

## Unused Files
The following files appear to be unused and could be removed:
1. `src/components/ui/card.tsx` - Not referenced in the project
2. `src/components/ui/dialog.tsx` - Not referenced in the project
3. `docs/funnel-design.md` - Documentation that might be outdated
4. `docs/lead-scoring-logic.md` - Documentation that might be outdated
5. `docs/landing-page-copy.md` - Documentation that might be outdated

## Important Notes
1. The project uses a multi-step form with conditional rendering based on the selected grade
2. Analytics integration includes both Google Analytics and Hotjar
3. Form submissions are handled through Supabase with proper error handling
4. The project includes comprehensive RLS policies for data security
5. The UI is fully responsive with mobile-first design
6. Font loading is optimized with preloading and swap strategies