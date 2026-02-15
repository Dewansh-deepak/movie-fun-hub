-- Fix 2: Prevent users from self-setting is_creator via direct UPDATE
-- Drop old permissive UPDATE policy and replace with one that blocks is_creator changes
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND is_creator = (SELECT p.is_creator FROM public.profiles p WHERE p.id = profiles.id)
  );

-- Fix 3: Drop "Public can view creator profiles" policy
-- Public access should go through the public_profiles view instead
DROP POLICY IF EXISTS "Public can view creator profiles" ON public.profiles;

-- Fix 4: Add explicit INSERT deny on coin_transactions
CREATE POLICY "No direct transaction inserts"
  ON public.coin_transactions
  FOR INSERT
  WITH CHECK (false);