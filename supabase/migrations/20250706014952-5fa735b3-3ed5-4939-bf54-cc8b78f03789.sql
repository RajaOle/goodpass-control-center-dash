-- 1. Create security definer function to get current user role (fixes infinite recursion)
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.user_profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- 2. Drop the problematic RLS policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins or self can view user_profiles" ON public.user_profiles;

-- 3. Create new RLS policy using the security definer function
CREATE POLICY "Admins or self can view user_profiles" ON public.user_profiles
  FOR SELECT USING (
    (public.get_current_user_role() = 'admin') OR 
    (id = auth.uid())
  );

-- 4. Create the missing user profile for the problematic user
INSERT INTO public.user_profiles (id, email, role, status, is_kyc_completed, phone)
VALUES (
  'b7f9324d-7680-4388-ad33-f4892cf13b5d'::uuid,
  'ulinnuha.ibnu@gmail.com',
  'user',
  'active',
  false,
  NULL
) ON CONFLICT (id) DO NOTHING;

-- 5. Update the handle_new_user function to insert into user_profiles instead of profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into user_profiles table
  INSERT INTO public.user_profiles (id, email, role, status, is_kyc_completed)
  VALUES (
    NEW.id,
    NEW.email,
    'user',
    'active',
    false
  );
  
  -- Also insert into profiles table for compatibility
  INSERT INTO public.profiles (id, email, full_name, phone, phone_verified)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.phone,
    FALSE
  ) ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;