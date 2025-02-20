/*
  # Update Lead Categories

  1. Changes
    - Rename lead categories from 'select', 'waitlist', 'nurture' to 'bch', 'luminaire', 'nurture'
    - Migrate existing data to new categories
    - Handle both main and staging tables
  
  2. Migration Steps
    - Create temporary columns for both tables
    - Update existing data
    - Safely transition to new enum type
    - Clean up
*/

DO $$ 
BEGIN
  -- Step 1: Add temporary text columns to both tables
  ALTER TABLE beacon_house_leads 
    ADD COLUMN lead_category_temp text;
  ALTER TABLE staging_beacon_house_leads 
    ADD COLUMN lead_category_temp text;

  -- Step 2: Copy and transform existing data to temporary columns
  UPDATE beacon_house_leads 
  SET lead_category_temp = CASE lead_category::text
    WHEN 'select' THEN 'bch'
    WHEN 'waitlist' THEN 'luminaire'
    WHEN 'nurture' THEN 'nurture'
  END;

  UPDATE staging_beacon_house_leads 
  SET lead_category_temp = CASE lead_category::text
    WHEN 'select' THEN 'bch'
    WHEN 'waitlist' THEN 'luminaire'
    WHEN 'nurture' THEN 'nurture'
  END;

  -- Step 3: Drop columns that use the enum (but keep the temp columns)
  ALTER TABLE beacon_house_leads 
    DROP COLUMN lead_category;
  ALTER TABLE staging_beacon_house_leads 
    DROP COLUMN lead_category;

  -- Step 4: Now we can safely drop and recreate the enum
  DROP TYPE lead_category;
  CREATE TYPE lead_category AS ENUM ('bch', 'luminaire', 'nurture');

  -- Step 5: Add new columns with updated enum type
  ALTER TABLE beacon_house_leads 
    ADD COLUMN lead_category lead_category;
  ALTER TABLE staging_beacon_house_leads 
    ADD COLUMN lead_category lead_category;

  -- Step 6: Copy data from temporary columns to new enum columns
  UPDATE beacon_house_leads 
    SET lead_category = lead_category_temp::lead_category;
  UPDATE staging_beacon_house_leads 
    SET lead_category = lead_category_temp::lead_category;

  -- Step 7: Clean up temporary columns
  ALTER TABLE beacon_house_leads 
    DROP COLUMN lead_category_temp;
  ALTER TABLE staging_beacon_house_leads 
    DROP COLUMN lead_category_temp;
END $$;