-- [PURPOSE]
    -- This script corrects a persistent error in the database schema.
    -- The foreign key constraint on the `visitors` table was incorrectly referencing
    -- the `student_id` (text) column of the `students` table instead of its
    -- primary key `id` (uuid). This caused user creation and data fetching to fail.

    -- [ACTION]
    -- 1. Drop the incorrect foreign key constraint if it exists.
    -- 2. Re-create the foreign key constraint with the correct reference to `students(id)`.

    -- Drop the incorrect foreign key constraint if it exists to make this script re-runnable.
    ALTER TABLE public.visitors
    DROP CONSTRAINT IF EXISTS visitors_student_id_fkey;

    -- Add the CORRECT foreign key constraint.
    -- This links the `student_id` column in the `visitors` table to the `id`
    -- column (the primary key) in the `students` table.
    ALTER TABLE public.visitors
    ADD CONSTRAINT visitors_student_id_fkey
    FOREIGN KEY (student_id) REFERENCES public.students(id)
    ON DELETE SET NULL; -- If a student is deleted, their visitor logs are kept but the link is removed.
