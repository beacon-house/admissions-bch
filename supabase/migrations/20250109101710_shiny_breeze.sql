/*
  # Add WhatsApp consent field
  
  1. Changes
    - Add whatsapp_consent boolean column to beacon_house_leads table with default true
    
  2. Purpose
    - Track user consent for WhatsApp communication
    - Default to true for opt-out approach
*/

-- Add whatsapp_consent column with default true
ALTER TABLE beacon_house_leads
  ADD COLUMN whatsapp_consent BOOLEAN NOT NULL DEFAULT true;