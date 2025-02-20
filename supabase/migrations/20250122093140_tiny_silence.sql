/*
  # Update grade level options

  1. Changes
    - Replace 'bachelors_india' with 'masters' in grade_level enum
    - Update existing records to use new value
    - Maintain data integrity during migration

  2. Security
    - Maintains existing RLS policies
*/

-- Step 1: Create a temporary column to store the grade level as text
ALTER TABLE beacon_house_leads 
  ADD COLUMN current_grade_temp text;

-- Step 2: Copy data to temporary column with conversion
UPDATE beacon_house_leads 
  SET current_grade_temp = CASE current_grade::text
    WHEN 'bachelors_india' THEN 'masters'
    ELSE current_grade::text
  END;

-- Step 3: Drop the existing column and type
ALTER TABLE beacon_house_leads 
  DROP COLUMN current_grade;
DROP TYPE grade_level;

-- Step 4: Create new enum type with updated values
CREATE TYPE grade_level AS ENUM ('7_below', '8', '9', '10', '11', '12', 'masters');

-- Step 5: Add new column with updated enum type
ALTER TABLE beacon_house_leads 
  ADD COLUMN current_grade grade_level;

-- Step 6: Copy data from temporary column to new column
UPDATE beacon_house_leads 
  SET current_grade = current_grade_temp::grade_level;

-- Step 7: Make the column required and drop temporary column
ALTER TABLE beacon_house_leads 
  ALTER COLUMN current_grade SET NOT NULL;
ALTER TABLE beacon_house_leads 
  DROP COLUMN current_grade_temp;