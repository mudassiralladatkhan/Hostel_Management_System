/*
# [FIX] Correct User Profile & Student Creation Logic

This migration script corrects a critical error in the user creation process.
The previous script referenced a non-existent `user_id` column in the `students` table,
causing all new user sign-ups to fail with a database error.

## Query Description:
This script performs the following corrective actions:
1.  Drops the existing trigger and function responsible for profile creation to remove dependencies.
2.  Recreates the `create_user_profile` function with the correct column name (`profile_id` instead of `user_id`).
3.  Recreates the trigger to use the corrected function.
4.  Drops and recreates the Row Level Security (RLS) policy on the `students` table to correctly reference `profile_id`.

This change is safe to apply and will resolve the sign-up error. No data will be lost.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Medium"
- Requires-Backup: false
- Reversible: true
*/

-- Step 1: Drop the dependent trigger and the faulty function to avoid dependency errors
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.create_user_profile();

-- Step 2: Recreate the function with the correct column name (`profile_id`)
CREATE OR REPLACE FUNCTION public.create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a new profile for the new user
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'role'
  );

  -- If the user's role is 'Student', create a corresponding record in the students table
  IF NEW.raw_user_meta_data->>'role' = 'Student' THEN
    INSERT INTO public.students (profile_id)
    VALUES (NEW.id);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Recreate the trigger on the auth.users table to call the corrected function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_user_profile();

-- Step 4: Drop and recreate the RLS policy on the students table with the correct column reference
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.students;

CREATE POLICY "Enable insert for authenticated users"
ON public.students
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = profile_id);
