
-- Fix 1: Replace overly broad creator profiles policy with a view approach
-- Drop the policy that exposes all creator fields
DROP POLICY IF EXISTS "Anyone can view creator profiles" ON public.profiles;

-- Create a security definer function to get public creator info (bypasses RLS safely)
CREATE OR REPLACE FUNCTION public.get_public_profile(p_profile_id uuid)
RETURNS TABLE(id uuid, display_name text, avatar_url text, is_creator boolean)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.display_name, p.avatar_url, p.is_creator
  FROM profiles p
  WHERE p.id = p_profile_id;
$$;

-- Create a view for public profile data (bypasses RLS as it runs as view owner)
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT id, user_id, display_name, avatar_url, bio, is_creator, created_at, updated_at
FROM public.profiles;

-- Grant access to the view
GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- Fix 2: Restrict video_likes to only show own likes
DROP POLICY IF EXISTS "Anyone can view likes" ON public.video_likes;

CREATE POLICY "Users can view own likes"
  ON public.video_likes FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = video_likes.profile_id
    AND profiles.user_id = auth.uid()
  ));
