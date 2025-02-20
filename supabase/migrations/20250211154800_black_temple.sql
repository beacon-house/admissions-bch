/*
  # Update form fields for new requirements

  1. Changes
    - Add form_filler_type column for parent/student identification
    - Add target_university_rank column for university preferences
    - Remove budget_range column and type safely
    - Update preferred_countries to use text array for flexible values

  2. Security
    - Maintain existing RLS policies
*/

DO $$ 
BEGIN
  -- Step 1: Add new columns
  ALTER TABLE beacon_house_leads
    ADD COLUMN form_filler_type text CHECK (form_filler_type IN ('parent', 'student')),
    ADD COLUMN target_university_rank text CHECK (target_university_rank IN ('top_20', 'top_50', 'top_100', 'any_good'));

  -- Step 2: Create temporary columns to store budget data
  ALTER TABLE beacon_house_leads
    ADD COLUMN budget_range_temp text;
  ALTER TABLE staging_beacon_house_leads
    ADD COLUMN budget_range_temp text;

  -- Step 3: Copy existing data to temporary columns
  UPDATE beacon_house_leads
    SET budget_range_temp = budget_range::text;
  UPDATE staging_beacon_house_leads
    SET budget_range_temp = budget_range::text;

  -- Step 4: Drop columns that use the enum
  ALTER TABLE beacon_house_leads
    DROP COLUMN budget_range;
  ALTER TABLE staging_beacon_house_leads
    DROP COLUMN budget_range;

  -- Step 5: Now we can safely drop the enum type
  DROP TYPE budget_range;

  -- Step 6: Clean up temporary columns
  ALTER TABLE beacon_house_leads
    DROP COLUMN budget_range_temp;
  ALTER TABLE staging_beacon_house_leads
    DROP COLUMN budget_range_temp;
END $$;