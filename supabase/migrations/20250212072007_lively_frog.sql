/*
  # Add masters category and update existing leads
  
  1. Changes
    - Add 'masters' as a new lead category
    - Update existing masters leads from 'nurture' to 'masters'
    
  2. Notes
    - Only updates leads where current_grade is 'masters'
    - Preserves all other lead categories
*/

DO $$ 
BEGIN
  -- Step 1: Create a temporary column
  ALTER TABLE beacon_house_leads 
    ADD COLUMN lead_category_temp text;

  -- Step 2: Copy existing data to temporary column
  UPDATE beacon_house_leads 
    SET lead_category_temp = lead_category::text;

  -- Step 3: Drop the enum column
  ALTER TABLE beacon_house_leads 
    DROP COLUMN lead_category;

  -- Step 4: Drop and recreate the enum type with new value
  DROP TYPE lead_category;
  CREATE TYPE lead_category AS ENUM ('bch', 'luminaire', 'nurture', 'masters');

  -- Step 5: Add new column with updated enum type
  ALTER TABLE beacon_house_leads 
    ADD COLUMN lead_category lead_category;

  -- Step 6: Copy data back and update masters leads
  UPDATE beacon_house_leads 
    SET lead_category = CASE
      WHEN current_grade = 'masters' AND lead_category_temp = 'nurture' THEN 'masters'
      ELSE lead_category_temp::lead_category
    END;

  -- Step 7: Clean up temporary column
  ALTER TABLE beacon_house_leads 
    DROP COLUMN lead_category_temp;

END $$;