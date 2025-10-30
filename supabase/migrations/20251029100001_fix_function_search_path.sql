/*
          # [SECURITY] Set Function Search Path
          [This migration hardens the security of database functions by explicitly setting the search_path. This mitigates the risk of search path hijacking attacks, ensuring that functions resolve objects from the intended 'public' schema.]

          ## Query Description: [This operation modifies the configuration of existing database functions to enhance security. It does not alter any table structures or data. There is no risk of data loss.]
          
          ## Metadata:
          - Schema-Category: ["Structural"]
          - Impact-Level: ["Low"]
          - Requires-Backup: [false]
          - Reversible: [true]
          
          ## Structure Details:
          - Functions affected:
            - public.create_user_profile()
            - public.update_fee_balance()
          
          ## Security Implications:
          - RLS Status: [Not Applicable]
          - Policy Changes: [No]
          - Auth Requirements: [Admin privileges to alter functions]
          
          ## Performance Impact:
          - Indexes: [No change]
          - Triggers: [No change]
          - Estimated Impact: [None]
          */

ALTER FUNCTION public.create_user_profile() SET search_path = public;
ALTER FUNCTION public.update_fee_balance() SET search_path = public;
