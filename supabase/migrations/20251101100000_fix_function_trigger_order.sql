/*
# [FIX] Correct Order for Trigger and Function Creation
This script fixes a migration error by ensuring that database functions are created before the triggers that use them. It also includes other functions and triggers required by the application.

## Query Description:
This operation will drop and recreate the triggers and functions responsible for automating profile creation and fee balance updates. This is a safe, structural change and does not pose a risk to existing data.

## Metadata:
- Schema-Category: ["Structural", "Safe"]
- Impact-Level: ["Low"]
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Drops and recreates function `public.create_user_profile()`
- Drops and recreates trigger `on_auth_user_created` on `auth.users`
- Drops and recreates function `public.update_fee_balance()`
- Drops and recreates trigger `on_payment_insert` on `public.payments`

## Security Implications:
- RLS Status: Unchanged
- Policy Changes: No
- Auth Requirements: Admin privileges to run migrations.

## Performance Impact:
- Indexes: None
- Triggers: Re-establishes two application triggers.
- Estimated Impact: Negligible.
*/

-- Drop existing objects if they exist to ensure a clean run
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.create_user_profile();
DROP TRIGGER IF EXISTS on_payment_insert ON public.payments;
DROP FUNCTION IF EXISTS public.update_fee_balance();


-- 1. Function to create a profile for a new user
CREATE FUNCTION public.create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'role',
    new.raw_user_meta_data->>'avatar_url'
  );
  
  -- Create a corresponding student record if the role is 'Student'
  IF new.raw_user_meta_data->>'role' = 'Student' THEN
    INSERT INTO public.students (user_id, name)
    VALUES (new.id, new.raw_user_meta_data->>'full_name');
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set search path for security
ALTER FUNCTION public.create_user_profile() SET search_path = public;

-- 2. Trigger to run the function when a new user is created in auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.create_user_profile();


-- 3. Function to update the fee balance when a new payment is inserted
CREATE FUNCTION public.update_fee_balance()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.fees
  SET 
    paid_amount = paid_amount + NEW.amount,
    balance = balance - NEW.amount
  WHERE id = NEW.fee_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set search path for security
ALTER FUNCTION public.update_fee_balance() SET search_path = public;

-- 4. Trigger to update fee balance on new payment
CREATE TRIGGER on_payment_insert
  AFTER INSERT ON public.payments
  FOR EACH ROW EXECUTE PROCEDURE public.update_fee_balance();
