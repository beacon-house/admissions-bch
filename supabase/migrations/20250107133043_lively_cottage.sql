/*
  # Fix RLS policies for anonymous access

  1. Changes
    - Drop existing RLS policies
    - Create new policies allowing anonymous inserts
    - Keep authenticated user access for other operations
  
  2. Security
    - Enable anonymous form submissions
    - Maintain security for authenticated operations
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON beacon_house_leads;
DROP POLICY IF EXISTS "Enable insert access for all users" ON beacon_house_leads;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON beacon_house_leads;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON lead_scoring_history;
DROP POLICY IF EXISTS "Enable insert access for all users" ON lead_scoring_history;

-- Create new policies for beacon_house_leads
CREATE POLICY "Enable read access for authenticated users"
  ON beacon_house_leads
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for anyone"
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

CREATE POLICY "Enable insert for anyone"
  ON lead_scoring_history
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);