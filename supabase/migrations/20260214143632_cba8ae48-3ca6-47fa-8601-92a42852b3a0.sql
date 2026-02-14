
-- Fix the security definer view warning by using SECURITY INVOKER
-- and adding a permissive policy that only exposes creator profiles
DROP VIEW IF EXISTS public.public_profiles;

-- Recreate as security invoker view (default)
CREATE VIEW public.public_profiles 
WITH (security_invoker = true)
AS
SELECT id, user_id, display_name, avatar_url, bio, is_creator, created_at, updated_at
FROM public.profiles;

GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- We need a permissive SELECT policy on profiles for the view to work for non-owners
-- This policy only allows viewing creator profiles (safe subset of users)
CREATE POLICY "Public can view creator profiles"
  ON public.profiles FOR SELECT
  USING (is_creator = true);
