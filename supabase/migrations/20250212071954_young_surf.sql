/*
  # Drop staging table
  
  1. Changes
    - Drop staging_beacon_house_leads table as it's not being used
    
  2. Notes
    - This is a non-reversible operation
    - Ensure no data needs to be preserved from the staging table
*/

DROP TABLE IF EXISTS staging_beacon_house_leads;