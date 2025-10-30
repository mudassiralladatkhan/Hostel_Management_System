/*
# [Fix] Correct Foreign Key for Visitors to Students

This migration script corrects a persistent error where the foreign key relationship between the 'visitors' and 'students' tables was misconfigured.

## Query Description:
The script first safely removes any existing foreign key constraint named 'visitors_student_id_fkey' from the 'visitors' table. It then correctly recreates the constraint, linking the 'visitors.student_id' column to the primary key ('id') of the 'students' table. This ensures data integrity and resolves the "column does not exist" error during data fetching operations.

## Metadata:
- Schema-Category: ["Structural"]
- Impact-Level: ["Low"]
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Table Affected: public.visitors
- Constraint Dropped: visitors_student_id_fkey (if it exists)
- Constraint Added: visitors_student_id_fkey

## Security Implications:
- RLS Status: Unchanged
- Policy Changes: No
- Auth Requirements: None

## Performance Impact:
- Indexes: Foreign key will implicitly use the primary key index on 'students.id'.
- Triggers: None
- Estimated Impact: Negligible. This is a metadata change.
*/

-- Drop the potentially incorrect foreign key constraint if it exists
ALTER TABLE public.visitors
DROP CONSTRAINT IF EXISTS visitors_student_id_fkey;

-- Add the correct foreign key constraint, linking visitors.student_id to students.id
ALTER TABLE public.visitors
ADD CONSTRAINT visitors_student_id_fkey
FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE SET NULL;
