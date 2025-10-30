/*
# [Fix] Add INSERT Policies for User Creation
This migration fixes a database error that occurs during user sign-up. The error was caused by missing Row Level Security (RLS) policies, which prevented the system from creating corresponding records in the `profiles` and `students` tables after a new user was created in `auth.users`.

## Query Description:
This script adds two new policies:
1.  **On `profiles` table:** Allows a new user to have a profile created for them.
2.  **On `students` table:** Allows a new student user to have a student record created for them.

These changes are safe and essential for the user registration functionality to work correctly. They ensure that the automated process of profile creation can proceed without being blocked by security rules.

## Metadata:
- Schema-Category: "Security"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true (the policies can be dropped)

## Security Implications:
- RLS Status: Policies are being added to enforce security, not relax it.
- Policy Changes: Yes. Adds `INSERT` policies.
- Auth Requirements: These policies rely on `auth.uid()` to ensure users can only trigger the creation of their own records.
*/

--
-- Name: profiles; Type: POLICY; Schema: public
--
CREATE POLICY "Enable insert for new users"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

--
-- Name: students; Type: POLICY; Schema: public
--
CREATE POLICY "Enable insert for new students"
ON public.students
FOR INSERT
WITH CHECK (auth.uid() = user_id);
