/*
  # Update Lead Categories

  This migration updates the lead_category for existing leads to match the new categorization logic.
  
  Updates required:
  1. 9 leads from 'bch' to 'luminaire'
  2. 5 leads from 'bch' to 'nurture'
  3. 1 lead from 'luminaire' to 'bch'
  4. 1 lead from 'luminaire' to 'nurture'
  5. 2 leads from 'nurture' to 'luminaire'
*/

UPDATE beacon_house_leads
SET lead_category = (
  CASE
    -- Step 1: Immediate categorization
    WHEN curriculum_type = 'State_Boards' THEN 'luminaire'::lead_category
    WHEN current_grade = 'masters' THEN 'masters'::lead_category
    WHEN current_grade = '7_below' THEN 'nurture'::lead_category
    WHEN current_grade = '12' THEN 'nurture'::lead_category
    WHEN current_grade = '11' THEN 'luminaire'::lead_category
    -- Step 2: Grades 8-10 evaluation
    WHEN current_grade IN ('8', '9', '10') THEN
      CASE
        -- BCH case
        WHEN scholarship_requirement = 'good_to_have' 
          OR study_abroad_priority = 'main_focus' THEN 'bch'::lead_category
        -- Nurture case
        WHEN scholarship_requirement = 'must_have' 
          AND study_abroad_priority IN ('backup_plan', 'still_exploring') THEN 'nurture'::lead_category
        -- Luminaire case (remaining)
        ELSE 'luminaire'::lead_category
      END
    ELSE 'nurture'::lead_category -- Default fallback
  END
)
WHERE lead_id IN (
  -- bch to luminaire
  'a91c388c-4e35-4d31-b1ab-4c6f53dad701',
  'f4c9627b-d1c9-4749-934f-c7b69443bab5',
  'e7ba3b71-309f-47c8-8fb1-3fa9d96368ea',
  'ca549e60-0aec-4b77-8145-a23083f48d46',
  '262df95a-587a-4ad3-8d83-07dabee5130c',
  '2615f395-26d6-4723-acbf-484aa6c6340a',
  '6ba1b4d6-9579-42a1-b2c7-21a3ea16ca2a',
  '78ae43eb-1447-4336-b9fd-0d4bdc654569',
  'e3948840-1c36-44ce-aa92-64eb365c4556',
  -- bch to nurture
  'fd86abd9-28d9-417c-862a-f1563f245c07',
  'f0e8a7ea-5df6-4bd9-900d-18fbb9820c57',
  '686d41cb-1eec-4083-8209-339ff534c332',
  '18a22361-3fc3-4006-9393-dc8b682c9b2e',
  'edb60ba1-5ce4-4640-a03b-81e3be87b3cc',
  -- luminaire to bch
  '784aa7ec-1a7d-49a4-ac0d-566fe37d440f',
  -- luminaire to nurture
  '86eaa87a-64bd-44fc-b2ac-99f0183355f1',
  -- nurture to luminaire
  '82adca3b-43bd-44b7-ba00-def636e7e52c',
  'ffef21aa-a41c-41dc-94d0-28a80a7364d5'
);