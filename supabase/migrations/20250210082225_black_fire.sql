/*
  # Add State Boards curriculum type

  1. Changes
    - Add "State_Boards" as a valid value to the curriculum_type enum
    - Update both main and staging tables
    - Preserve existing data and constraints
  
  2. Impact
    - Allows selection of State Boards as a curriculum type in the form
    - Maintains existing data integrity
    - Handles staging table dependencies
*/

DO $$ 
BEGIN
  -- Create a temporary type for the transition
  CREATE TYPE curriculum_type_new AS ENUM ('IB', 'IGCSE', 'CBSE', 'ICSE', 'State_Boards', 'Others');

  -- Update the column in the main table to use text temporarily
  ALTER TABLE beacon_house_leads 
    ALTER COLUMN curriculum_type TYPE text;

  -- Update the column in the staging table to use text temporarily
  ALTER TABLE staging_beacon_house_leads 
    ALTER COLUMN curriculum_type TYPE text;

  -- Drop the old enum type now that no tables are using it
  DROP TYPE curriculum_type;

  -- Rename the new type to the original name
  ALTER TYPE curriculum_type_new RENAME TO curriculum_type;

  -- Convert the columns back to the enum type
  ALTER TABLE beacon_house_leads 
    ALTER COLUMN curriculum_type TYPE curriculum_type USING curriculum_type::curriculum_type;

  ALTER TABLE staging_beacon_house_leads 
    ALTER COLUMN curriculum_type TYPE curriculum_type USING curriculum_type::curriculum_type;
END $$;