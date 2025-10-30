-- This script fixes the foreign key relationship between the 'visitors' and 'students' tables.
-- The previous script incorrectly tried to reference a non-key column.

-- Step 1: Safely drop the incorrect foreign key constraint if it exists.
-- This prevents errors if the script is run multiple times.
ALTER TABLE public.visitors
DROP CONSTRAINT IF EXISTS visitors_student_id_fkey;

-- Step 2: Add the correct foreign key constraint.
-- This ensures that the 'student_id' column in the 'visitors' table correctly
-- references the primary key ('id') of a student in the 'students' table.
-- Using ON DELETE SET NULL ensures that if a student is deleted, their visitor logs are kept but unlinked.
ALTER TABLE public.visitors
ADD CONSTRAINT visitors_student_id_fkey
FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE SET NULL;
