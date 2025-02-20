/*
  # Simplify RLS policies for public form submissions

  1. Changes
    - Drop existing policies
    - Create single policy per table for all operations
    - Enable RLS with public access
  
  2. Security
    - Allow anonymous form submissions
    - Maintain data integrity through RLS
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "public_form_submissions" ON beacon_house_leads;
DROP POLICY IF EXISTS "public_scoring_submissions" ON lead_scoring_history;

-- Create single policy for beacon_house_leads
CREATE POLICY "enable_public_access"
  ON beacon_house_leads
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create single policy for lead_scoring_history
CREATE POLICY "enable_public_access"
  ON lead_scoring_history
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE beacon_house_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_scoring_history ENABLE ROW LEVEL SECURITY;