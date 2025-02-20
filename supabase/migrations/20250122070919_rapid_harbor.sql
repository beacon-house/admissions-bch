/*
  # Add bachelors grade level and update constraints

  1. Changes
    - Add 'bachelors_india' to grade_level enum
    - Make academic fields optional for bachelors students
    - Update field constraints to handle partial submissions

  2. Security
    - Maintains existing RLS policies
    - No changes to access control
*/

-- Step 1: Create a new type with the additional value
CREATE TYPE grade_level_new AS ENUM ('7_below', '8', '9', '10', '11', '12', 'bachelors_india');

-- Step 2: Update the column to use the new type
ALTER TABLE beacon_house_leads 
  ALTER COLUMN current_grade TYPE grade_level_new 
  USING current_grade::text::grade_level_new;

-- Step 3: Drop the old type
DROP TYPE grade_level;

-- Step 4: Rename the new type to the original name
ALTER TYPE grade_level_new RENAME TO grade_level;

-- Step 5: Make academic fields optional for bachelors students
ALTER TABLE beacon_house_leads
  ALTER COLUMN school_name DROP NOT NULL,
  ALTER COLUMN curriculum_type DROP NOT NULL,
  ALTER COLUMN academic_performance DROP NOT NULL,
  ALTER COLUMN study_abroad_priority DROP NOT NULL,
  ALTER COLUMN preferred_countries DROP NOT NULL,
  ALTER COLUMN budget_range DROP NOT NULL,
  ALTER COLUMN scholarship_requirement DROP NOT NULL,
  ALTER COLUMN timeline_commitment DROP NOT NULL;

-- Step 6: Add constraints to ensure fields are filled for non-bachelors students
ALTER TABLE beacon_house_leads
  ADD CONSTRAINT school_required_for_non_bachelors 
    CHECK (current_grade = 'bachelors_india' OR school_name IS NOT NULL),
  ADD CONSTRAINT curriculum_required_for_non_bachelors 
    CHECK (current_grade = 'bachelors_india' OR curriculum_type IS NOT NULL),
  ADD CONSTRAINT performance_required_for_non_bachelors 
    CHECK (current_grade = 'bachelors_india' OR academic_performance IS NOT NULL),
  ADD CONSTRAINT priority_required_for_non_bachelors 
    CHECK (current_grade = 'bachelors_india' OR study_abroad_priority IS NOT NULL),
  ADD CONSTRAINT countries_required_for_non_bachelors 
    CHECK (current_grade = 'bachelors_india' OR preferred_countries IS NOT NULL),
  ADD CONSTRAINT budget_required_for_non_bachelors 
    CHECK (current_grade = 'bachelors_india' OR budget_range IS NOT NULL),
  ADD CONSTRAINT scholarship_required_for_non_bachelors 
    CHECK (current_grade = 'bachelors_india' OR scholarship_requirement IS NOT NULL),
  ADD CONSTRAINT timeline_required_for_non_bachelors 
    CHECK (current_grade = 'bachelors_india' OR timeline_commitment IS NOT NULL);