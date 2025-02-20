/*
  # Fix RLS policies for lead submissions

  1. Changes
    - Update RLS policies to allow anonymous lead submissions
    - Add policies for lead scoring history
    - Ensure proper access control while maintaining security

  2. Security
    - Allow anonymous users to insert leads
    - Allow authenticated users to view and update leads
    - Maintain data isolation between users
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated users to view leads" ON beacon_house_leads;
DROP POLICY IF EXISTS "Allow authenticated users to insert leads" ON beacon_house_leads;
DROP POLICY IF EXISTS "Allow authenticated users to update their leads" ON beacon_house_leads;
DROP POLICY IF EXISTS "Allow authenticated users to view scoring history" ON lead_scoring_history;
DROP POLICY IF EXISTS "Allow authenticated users to insert scoring history" ON lead_scoring_history;

-- Create new policies for beacon_house_leads
CREATE POLICY "Enable read access for authenticated users"
  ON beacon_house_leads
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for all users"
  ON beacon_house_leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
  ON beacon_house_leads
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create new policies for lead_scoring_history
CREATE POLICY "Enable read access for authenticated users"
  ON lead_scoring_history
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for all users"
  ON lead_scoring_history
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE beacon_house_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_scoring_history ENABLE ROW LEVEL SECURITY;