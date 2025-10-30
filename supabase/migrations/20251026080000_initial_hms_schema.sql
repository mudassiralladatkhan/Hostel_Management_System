/*
# [Initial Hostel Management System Schema]
This script sets up the complete database structure for the Hostel Management System.
It includes tables for managing users, students, rooms, fees, visitors, and more.
It also establishes security rules (RLS) and automates profile creation.

## Query Description: This script is foundational and should be run on a new or empty project. It creates all necessary tables and security policies. It is safe to run as it does not modify existing user data tables but creates new ones.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "High"
- Requires-Backup: true
- Reversible: false

## Structure Details:
- Tables Created: profiles, students, rooms, allocations, fees, payments, visitors, complaints, announcements
- Functions Created: handle_new_user, update_fee_balance
- Triggers Created: on_auth_user_created, on_payment_inserted

## Security Implications:
- RLS Status: Enabled on all new tables.
- Policy Changes: Yes, new policies are created for all tables to enforce data access rules.
- Auth Requirements: Policies are based on 'authenticated' and custom roles.

## Performance Impact:
- Indexes: Primary and Foreign key indexes are created.
- Triggers: Two triggers are added for automation, with minimal performance impact on inserts.
- Estimated Impact: Low.
*/

-- 1. PROFILES TABLE
-- Stores public-facing user data and role, linked to auth.users.
CREATE TABLE public.profiles (
    id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'student',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (id)
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. STUDENTS TABLE
-- Stores student-specific information.
CREATE TABLE public.students (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_id_str TEXT UNIQUE,
    course TEXT,
    year TEXT,
    contact TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (id)
);
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage all student data." ON public.students FOR ALL USING ('admin' = (SELECT role FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Students can view their own data." ON public.students FOR SELECT USING (profile_id = auth.uid());

-- 3. ROOMS TABLE
-- Stores details about each room in the hostel.
CREATE TABLE public.rooms (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    room_no TEXT NOT NULL UNIQUE,
    block TEXT,
    type TEXT,
    capacity INT NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'Available', -- Available, Occupied, Maintenance
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (id)
);
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage rooms." ON public.rooms FOR ALL USING ('admin' = (SELECT role FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Authenticated users can view rooms." ON public.rooms FOR SELECT USING (auth.role() = 'authenticated');

-- 4. ALLOCATIONS TABLE
-- Links students to rooms.
CREATE TABLE public.allocations (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    student_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE RESTRICT,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (id)
);
ALTER TABLE public.allocations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage allocations." ON public.allocations FOR ALL USING ('admin' = (SELECT role FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Students can view their own allocation." ON public.allocations FOR SELECT USING (student_profile_id = auth.uid());

-- 5. FEES TABLE
-- Tracks fee obligations for students.
CREATE TABLE public.fees (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    student_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    total_amount NUMERIC(10, 2) NOT NULL,
    paid_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    balance NUMERIC(10, 2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
    due_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (id)
);
ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage fees." ON public.fees FOR ALL USING ('admin' = (SELECT role FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Students can view their own fees." ON public.fees FOR SELECT USING (student_profile_id = auth.uid());

-- 6. PAYMENTS TABLE
-- Records individual payments made by students.
CREATE TABLE public.payments (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    fee_id UUID NOT NULL REFERENCES public.fees(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    mode TEXT, -- Cash, UPI, Card
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (id)
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage payments." ON public.payments FOR ALL USING ('admin' = (SELECT role FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Students can view their own payments." ON public.payments FOR SELECT USING (
    (SELECT student_profile_id FROM public.fees WHERE id = fee_id) = auth.uid()
);

-- 7. VISITORS TABLE
-- Logs visitor entries and exits.
CREATE TABLE public.visitors (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    visitor_name TEXT NOT NULL,
    visitor_contact TEXT,
    student_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    purpose TEXT,
    in_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    out_time TIMESTAMPTZ,
    PRIMARY KEY (id)
);
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage visitors." ON public.visitors FOR ALL USING ('admin' = (SELECT role FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Students can view their own visitors." ON public.visitors FOR SELECT USING (student_profile_id = auth.uid());

-- 8. COMPLAINTS TABLE
-- Tracks student complaints and maintenance requests.
CREATE TABLE public.complaints (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    student_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'Pending', -- Pending, Resolved, Rejected
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (id)
);
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage complaints." ON public.complaints FOR ALL USING ('admin' = (SELECT role FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Students can create and view their own complaints." ON public.complaints FOR ALL USING (student_profile_id = auth.uid());

-- 9. ANNOUNCEMENTS TABLE
-- For admins to post announcements.
CREATE TABLE public.announcements (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    admin_profile_id UUID NOT NULL REFERENCES public.profiles(id),
    title TEXT NOT NULL,
    content TEXT,
    audience TEXT NOT NULL DEFAULT 'All', -- All, Students, Staff
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (id)
);
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage announcements." ON public.announcements FOR ALL USING ('admin' = (SELECT role FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Authenticated users can view announcements." ON public.announcements FOR SELECT USING (auth.role() = 'authenticated');


-- AUTOMATION: TRIGGERS AND FUNCTIONS

-- Function to create a profile for a new user.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    COALESCE(new.raw_user_meta_data->>'role', 'student')::text
  );
  RETURN new;
END;
$$;

-- Trigger to call the function when a new user signs up.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- Function to update fee balance on new payment.
CREATE OR REPLACE FUNCTION public.update_fee_balance()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.fees
  SET paid_amount = paid_amount + NEW.amount
  WHERE id = NEW.fee_id;
  RETURN NEW;
END;
$$;

-- Trigger to call the function when a new payment is inserted.
CREATE TRIGGER on_payment_inserted
  AFTER INSERT ON public.payments
  FOR EACH ROW EXECUTE PROCEDURE public.update_fee_balance();
