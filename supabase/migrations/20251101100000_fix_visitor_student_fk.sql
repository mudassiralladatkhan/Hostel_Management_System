/*
          # [Operation Name]
          Fix Foreign Key Relationship: visitors to students

          ## Query Description:
          This script resolves an API error by safely dropping and recreating the foreign key constraint between the `visitors` and `students` tables. This action forces Supabase to refresh its internal schema cache, which corrects the relationship detection issue. This operation is safe and does not affect any existing data.

          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true

          ## Structure Details:
          - Table `public.visitors`: Modifies the `visitors_student_id_fkey` constraint.

          ## Security Implications:
          - RLS Status: Unchanged
          - Policy Changes: No
          - Auth Requirements: Admin privileges to alter tables.

          ## Performance Impact:
          - Indexes: No change.
          - Triggers: No change.
          - Estimated Impact: Negligible. This is a metadata update.
          */

-- Step 1: Drop the existing foreign key constraint if it exists.
-- This ensures we can recreate it cleanly without conflicts.
ALTER TABLE public.visitors
DROP CONSTRAINT IF EXISTS visitors_student_id_fkey;

-- Step 2: Re-add the foreign key constraint with the correct definition.
-- This explicitly defines the relationship for Supabase's API.
ALTER TABLE public.visitors
ADD CONSTRAINT visitors_student_id_fkey
FOREIGN KEY (student_id)
REFERENCES public.students(id)
ON DELETE SET NULL;
