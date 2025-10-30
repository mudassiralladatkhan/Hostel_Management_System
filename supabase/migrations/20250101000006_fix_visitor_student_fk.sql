/*
          # [Operation Name]
          Fix Foreign Key Constraint: visitors_student_id_fkey

          ## Query Description: [This operation safely drops and recreates the foreign key constraint between the 'visitors' and 'students' tables. This is intended to resolve an API schema caching issue where the relationship was not being detected, causing queries to fail. This action does not affect any existing data.]
          
          ## Metadata:
          - Schema-Category: ["Structural"]
          - Impact-Level: ["Low"]
          - Requires-Backup: [false]
          - Reversible: [true]
          
          ## Structure Details:
          - tables: [public.visitors]
          - constraints: [visitors_student_id_fkey]
          
          ## Security Implications:
          - RLS Status: [Enabled]
          - Policy Changes: [No]
          - Auth Requirements: [Admin privileges to alter tables.]
          
          ## Performance Impact:
          - Indexes: [No change]
          - Triggers: [No change]
          - Estimated Impact: [Negligible. A brief lock on the 'visitors' table during constraint recreation.]
          */

-- Drop the constraint if it exists, to ensure a clean slate.
ALTER TABLE public.visitors DROP CONSTRAINT IF EXISTS visitors_student_id_fkey;

-- Re-create the foreign key constraint.
-- This forces Supabase to refresh its schema cache for this relationship.
ALTER TABLE public.visitors
ADD CONSTRAINT visitors_student_id_fkey
FOREIGN KEY (student_id)
REFERENCES public.students(id)
ON DELETE SET NULL;
