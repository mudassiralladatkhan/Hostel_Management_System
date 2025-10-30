/*
          # [Fix] Correct Foreign Key on Visitors Table
          This script corrects the foreign key relationship between the 'visitors' and 'students' tables.

          ## Query Description: [This operation fixes a broken database relationship. It drops the incorrect foreign key constraint on the 'visitors' table and recreates it to correctly reference the primary key of the 'students' table. This is a safe, non-destructive operation that is critical for data integrity.]
          
          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Modifies constraint 'visitors_student_id_fkey' on table 'public.visitors'.
          
          ## Security Implications:
          - RLS Status: Unchanged
          - Policy Changes: No
          - Auth Requirements: None
          
          ## Performance Impact:
          - Indexes: Re-establishes a foreign key index.
          - Triggers: None
          - Estimated Impact: Negligible.
          */

-- Step 1: Drop the incorrect foreign key constraint if it exists.
ALTER TABLE public.visitors
DROP CONSTRAINT IF EXISTS visitors_student_id_fkey;

-- Step 2: Add the correct foreign key constraint.
-- This links `visitors.student_id` to the correct primary key `students.id`.
ALTER TABLE public.visitors
ADD CONSTRAINT visitors_student_id_fkey
FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE SET NULL;
