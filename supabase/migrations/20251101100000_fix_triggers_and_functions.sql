/*
# [Fix] Corrects Database Function and Trigger Dependencies

This script resolves a SQL migration error by ensuring that database objects are dropped and recreated in the correct order, preventing dependency conflicts. It makes the database setup process idempotent and safe to re-run.

## Query Description:
This operation will first drop existing triggers and functions related to user profile creation and fee balance updates. It then recreates them in the correct dependency order. This is a safe, non-destructive operation for the schema logic and does not affect existing data in your tables.

## Metadata:
- Schema-Category: ["Structural"]
- Impact-Level: ["Low"]
- Requires-Backup: false
- Reversible: true (by dropping the created objects)
*/

-- Step 1: Drop existing triggers if they exist.
-- This is done first to remove dependencies on the functions.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_payment_inserted ON public.payments;

-- Step 2: Drop and recreate the function to create a user profile.
-- Using CREATE OR REPLACE is idempotent and safe.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', (NEW.raw_user_meta_data->>'role')::user_role);
  RETURN NEW;
END;
$$;

-- Step 3: Drop and recreate the function to update fee balances.
-- This version also contains a logic fix to correctly reference fees.
CREATE OR REPLACE FUNCTION public.update_fee_balance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.fees
  SET
    paid_amount = paid_amount + NEW.amount,
    balance = balance - NEW.amount
  WHERE id = NEW.fee_id;
  RETURN NEW;
END;
$$;

-- Step 4: Recreate the triggers.
-- These now point to the correctly defined functions.
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_payment_inserted
AFTER INSERT ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.update_fee_balance();
