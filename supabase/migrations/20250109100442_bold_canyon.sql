/*
  # Update ENUMs for Study Abroad Intent

  1. Changes
    - Update study_priority values to 'main_focus', 'backup_plan', 'still_exploring'
    - Update scholarship_requirement values to 'good_to_have', 'must_have'
    - Update timeline_commitment values to 'immediate_start', 'within_3_months', 'still_exploring'

  2. Migration Steps
    - Create temporary columns
    - Convert and move data
    - Drop old columns and types
    - Create new types and columns
*/

-- Step 1: Create temporary columns to store data
ALTER TABLE beacon_house_leads
  ADD COLUMN study_abroad_priority_temp VARCHAR,
  ADD COLUMN scholarship_requirement_temp VARCHAR,
  ADD COLUMN timeline_commitment_temp VARCHAR;

-- Step 2: Copy existing data to temporary columns
UPDATE beacon_house_leads SET
  study_abroad_priority_temp = CASE study_abroad_priority::text
    WHEN 'primary' THEN 'main_focus'
    WHEN 'backup' THEN 'backup_plan'
    WHEN 'exploring' THEN 'still_exploring'
  END,
  scholarship_requirement_temp = CASE scholarship_requirement::text
    WHEN 'optional' THEN 'good_to_have'
    WHEN 'flexible' THEN 'good_to_have'
    WHEN 'essential' THEN 'must_have'
  END,
  timeline_commitment_temp = CASE timeline_commitment::text
    WHEN 'immediate' THEN 'immediate_start'
    WHEN 'within_3_months' THEN 'within_3_months'
    WHEN 'exploring' THEN 'still_exploring'
  END;

-- Step 3: Drop existing columns and types
ALTER TABLE beacon_house_leads
  DROP COLUMN study_abroad_priority,
  DROP COLUMN scholarship_requirement,
  DROP COLUMN timeline_commitment;

DROP TYPE IF EXISTS study_priority;
DROP TYPE IF EXISTS scholarship_requirement;
DROP TYPE IF EXISTS timeline_commitment;

-- Step 4: Create new types
CREATE TYPE study_priority AS ENUM ('main_focus', 'backup_plan', 'still_exploring');
CREATE TYPE scholarship_requirement AS ENUM ('good_to_have', 'must_have');
CREATE TYPE timeline_commitment AS ENUM ('immediate_start', 'within_3_months', 'still_exploring');

-- Step 5: Add new columns with new types
ALTER TABLE beacon_house_leads
  ADD COLUMN study_abroad_priority study_priority,
  ADD COLUMN scholarship_requirement scholarship_requirement,
  ADD COLUMN timeline_commitment timeline_commitment;

-- Step 6: Convert temporary data to new columns
UPDATE beacon_house_leads SET
  study_abroad_priority = study_abroad_priority_temp::study_priority,
  scholarship_requirement = scholarship_requirement_temp::scholarship_requirement,
  timeline_commitment = timeline_commitment_temp::timeline_commitment;

-- Step 7: Drop temporary columns
ALTER TABLE beacon_house_leads
  DROP COLUMN study_abroad_priority_temp,
  DROP COLUMN scholarship_requirement_temp,
  DROP COLUMN timeline_commitment_temp;