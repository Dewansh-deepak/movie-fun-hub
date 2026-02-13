
-- Fix 1: Restrict profiles visibility - drop public policy, add permissive policies
-- Owner gets full access, others only see creator profiles (for feed joins)
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Permissive: owner can see their own full profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Permissive: anyone can see creator profiles (needed for feed/video joins)
-- Note: this still exposes creator phone/upi_id but hides regular users' data
CREATE POLICY "Anyone can view creator profiles"
  ON public.profiles FOR SELECT
  USING (is_creator = true);

-- Fix 2: Prevent negative coin balance (race condition protection)
ALTER TABLE public.profiles ADD CONSTRAINT coins_balance_non_negative CHECK (coins_balance >= 0);
