1\. Database Structure
----------------------

### Primary Table: beacon_house_leads

Purpose: Central repository for all lead information, scoring, and tracking data Outcome: Unified view of lead journey and qualification status

Fields Structure
----------------

Core Tracking Fields:

- lead_id (UUID, primary key)

  Purpose: Unique identifier for each lead

- source (VARCHAR)

  Purpose: Track marketing campaign source

  Format: campaign_name_MMYYYY

- created_at (TIMESTAMP)

  Purpose: Initial lead creation time

- last_updated (TIMESTAMP)

  Purpose: Track lead progression

- completion_status (ENUM)

  Values: 'partial', 'complete'

  Purpose: Track form completion

- current_step (INT)

  Purpose: Track form progress

  Range: 1-3

- total_score (INT)

  Purpose: Cumulative qualification score

  Range: 0-255

- lead_category (ENUM)

  Values: 'select', 'waitlist', 'nurture'

  Purpose: Final categorization based on scoring

Personal Information Fields:

- student_first_name (VARCHAR)

- student_last_name (VARCHAR)

- parent_name (VARCHAR)

- phone_number (VARCHAR)

  Validation: Indian phone number format

- email (VARCHAR)

  Validation: Email format

- current_grade (ENUM)

  Values: '7_below', '8', '9', '10', '11', '12'

- school_name (VARCHAR)

- curriculum_type (ENUM)

  Values: 'CBSE', 'ICSE', 'IGCSE', 'IB', 'Others'

- academic_performance (ENUM)

  Values: 'top_5', 'top_10', 'top_25', 'others'

- study_abroad_priority (ENUM)

  Values: 'primary', 'backup', 'exploring'

Qualification Fields:

- preferred_countries (ARRAY)

  Values: ['USA', 'UK', 'Canada', 'Australia', 'Others']

- budget_range (ENUM)

  Values: 'above_1.5cr', '1_to_1.5cr', 'below_1cr'

- scholarship_requirement (ENUM)

  Values: 'optional', 'flexible', 'essential'

- timeline_commitment (ENUM)

  Values: 'immediate', 'within_3_months', 'exploring'

Analytics Fields:

- step1_completion_time (INT)

  Unit: seconds

- step2_completion_time (INT)

  Unit: seconds

- step3_completion_time (INT)

  Unit: seconds

- drop_off_point (VARCHAR)

  Purpose: Last completed section before abandonment

- total_time_spent (INT)

  Unit: seconds

### Secondary Table: lead_scoring_history

Purpose: Maintain detailed scoring breakdown and history Outcome: Enables score auditing and refinement of scoring algorithm

Fields Structure
----------------

- scoring_id (UUID, primary key)

- lead_id (UUID, foreign key)

  Reference: beacon_house_leads.lead_id

- step_number (INT)

  Range: 1-3

- score_component (VARCHAR)

  Purpose: Identify scoring factor

- points_awarded (INT)

  Purpose: Points for specific component

- timestamp (TIMESTAMP)