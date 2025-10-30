/*
# [Fix] Correct Visitor-Student Foreign Key Constraint
This script corrects the foreign key relationship between the 'visitors' and 'students' tables.

## Query Description:
The previous script attempted to link 'visitors.student_id' to a non-existent 'students.student_id' column. This script drops the faulty constraint and correctly links 'visitors.student_id' to the primary key 'students.id'. This is a safe, non-destructive operation.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Modifies constraint on 'public.visitors' table.

## Security Implications:
- RLS Status: Unchanged
- Policy Changes: No
- Auth Requirements: Admin privileges

## Performance Impact:
- Indexes: Re-establishes foreign key index.
- Triggers: None
- Estimated Impact: Negligible.
*/

-- Drop the incorrect foreign key constraint if it exists
ALTER TABLE public.visitors DROP CONSTRAINT IF EXISTS visitors_student_id_fkey;

-- Add the correct foreign key constraint
ALTER TABLE public.visitors
ADD CONSTRAINT visitors_student_id_fkey
FOREIGN KEY (student_id) REFERENCES public.students(id)
ON DELETE SET NULL;
