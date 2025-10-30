/*
# [Fix] Correct Student Creation Logic

This migration updates the `create_user_profile` function to correctly handle data for new student records.

## Query Description:
This operation modifies a core database function responsible for populating user and student tables upon sign-up. It ensures that student-specific details (like course, year, and contact number) sent from the application are correctly saved into the `students` table. This fixes a bug where these details were previously ignored, causing incomplete student records. The change is safe and essential for the "Add Student" feature to work correctly.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Medium"
- Requires-Backup: false
- Reversible: true (by reverting to the previous function definition)

## Structure Details:
- Modifies: `public.create_user_profile()` function
- Drops and recreates: `on_auth_user_created` trigger on `auth.users`

## Security Implications:
- RLS Status: Unchanged
- Policy Changes: No
- Auth Requirements: This function is executed with definer rights.

## Performance Impact:
- Indexes: None
- Triggers: The trigger is replaced, but performance impact is negligible.
- Estimated Impact: Low.
*/

-- Drop the existing trigger and function to redefine them
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.create_user_profile();

-- Create the corrected function that properly inserts student details
CREATE OR REPLACE FUNCTION public.create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Create a profile for the new user
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'role'
  );

  -- If the role is 'Student', create a corresponding student record with all details
  IF NEW.raw_user_meta_data->>'role' = 'Student' THEN
    INSERT INTO public.students (profile_id, course, year, contact_number)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'course',
      NEW.raw_user_meta_data->>'year',
      NEW.raw_user_meta_data->>'contact_number'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set the search path to prevent the security warning
ALTER FUNCTION public.create_user_profile() SET search_path = public;

-- Recreate the trigger on the auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_user_profile();
