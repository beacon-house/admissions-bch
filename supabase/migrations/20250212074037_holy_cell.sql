/*
  # Lead Categorization Audit

  This migration performs a read-only audit of the beacon_house_leads table to:
  1. Compare current lead_category with what it should be based on the new logic
  2. Identify any mismatches
  3. Group results by current vs expected categories
*/

WITH lead_categorization_check AS (
  SELECT
    lead_id,
    current_grade,
    curriculum_type,
    study_abroad_priority,
    scholarship_requirement,
    lead_category as current_category,
    (CASE
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
    END) as expected_category
  FROM beacon_house_leads
)
SELECT
  current_category::text,
  expected_category::text,
  COUNT(*) as lead_count,
  ARRAY_AGG(lead_id) as lead_ids
FROM lead_categorization_check
WHERE current_category != expected_category
GROUP BY current_category, expected_category
ORDER BY current_category, expected_category;