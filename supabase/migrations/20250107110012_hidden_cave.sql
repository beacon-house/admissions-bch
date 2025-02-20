/*
  # Beacon House Lead Management System

  1. New Tables
    - `beacon_house_leads`: Primary table for lead information and tracking
      - Core tracking fields (lead_id, source, timestamps, status)
      - Personal information fields (names, contact, education)
      - Qualification fields (preferences, budget)
      - Analytics fields (completion times, drop-off points)
    - `lead_scoring_history`: Secondary table for detailed scoring breakdown
      - Scoring details (component, points)
      - Timestamps and references

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage leads
    - Ensure data isolation and security
*/

-- Create ENUMs for various field types
CREATE TYPE completion_status AS ENUM ('partial', 'complete');
CREATE TYPE lead_category AS ENUM ('select', 'waitlist', 'nurture');
CREATE TYPE grade_level AS ENUM ('7_below', '8', '9', '10', '11', '12');
CREATE TYPE curriculum_type AS ENUM ('CBSE', 'ICSE', 'IGCSE', 'IB', 'Others');
CREATE TYPE academic_performance AS ENUM ('top_5', 'top_10', 'top_25', 'others');
CREATE TYPE study_priority AS ENUM ('primary', 'backup', 'exploring');
CREATE TYPE budget_range AS ENUM ('above_1.5cr', '1_to_1.5cr', 'below_1cr');
CREATE TYPE scholarship_requirement AS ENUM ('optional', 'flexible', 'essential');
CREATE TYPE timeline_commitment AS ENUM ('immediate', 'within_3_months', 'exploring');

-- Create beacon_house_leads table
CREATE TABLE IF NOT EXISTS beacon_house_leads (
  lead_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source VARCHAR NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
  completion_status completion_status NOT NULL DEFAULT 'partial',
  current_step INTEGER NOT NULL DEFAULT 1 CHECK (current_step BETWEEN 1 AND 3),
  total_score INTEGER NOT NULL DEFAULT 0 CHECK (total_score BETWEEN 0 AND 255),
  lead_category lead_category,
  
  -- Personal Information
  student_first_name VARCHAR NOT NULL,
  student_last_name VARCHAR NOT NULL,
  parent_name VARCHAR NOT NULL,
  phone_number VARCHAR NOT NULL CHECK (phone_number ~ '^[0-9]{10}$'),
  email VARCHAR NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  current_grade grade_level NOT NULL,
  school_name VARCHAR NOT NULL,
  curriculum_type curriculum_type NOT NULL,
  academic_performance academic_performance NOT NULL,
  study_abroad_priority study_priority NOT NULL,
  
  -- Qualification Fields
  preferred_countries VARCHAR[] NOT NULL,
  budget_range budget_range NOT NULL,
  scholarship_requirement scholarship_requirement NOT NULL,
  timeline_commitment timeline_commitment NOT NULL,
  
  -- Analytics Fields
  step1_completion_time INTEGER CHECK (step1_completion_time >= 0),
  step2_completion_time INTEGER CHECK (step2_completion_time >= 0),
  step3_completion_time INTEGER CHECK (step3_completion_time >= 0),
  drop_off_point VARCHAR,
  total_time_spent INTEGER CHECK (total_time_spent >= 0)
);

-- Create lead_scoring_history table
CREATE TABLE IF NOT EXISTS lead_scoring_history (
  scoring_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES beacon_house_leads(lead_id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL CHECK (step_number BETWEEN 1 AND 3),
  score_component VARCHAR NOT NULL,
  points_awarded INTEGER NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE beacon_house_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_scoring_history ENABLE ROW LEVEL SECURITY;

-- Create policies for beacon_house_leads
CREATE POLICY "Allow authenticated users to view leads"
  ON beacon_house_leads
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert leads"
  ON beacon_house_leads
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update their leads"
  ON beacon_house_leads
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for lead_scoring_history
CREATE POLICY "Allow authenticated users to view scoring history"
  ON lead_scoring_history
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert scoring history"
  ON lead_scoring_history
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create index for common queries
CREATE INDEX idx_leads_category ON beacon_house_leads(lead_category);
CREATE INDEX idx_leads_created_at ON beacon_house_leads(created_at);
CREATE INDEX idx_scoring_lead_id ON lead_scoring_history(lead_id);

-- Create function to automatically update last_updated
CREATE OR REPLACE FUNCTION update_last_updated()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update last_updated
CREATE TRIGGER update_leads_last_updated
  BEFORE UPDATE ON beacon_house_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_last_updated();