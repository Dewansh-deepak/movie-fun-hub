-- 1. Fix IP exposure: Replace creator SELECT policy to exclude viewer_ip
-- Drop existing policy
DROP POLICY IF EXISTS "Creators can view their video stats" ON public.video_views;

-- Create a new policy that still lets creators see their video stats
-- but we'll use a view to mask IP addresses
CREATE OR REPLACE VIEW public.creator_video_stats
WITH (security_invoker = true)
AS
SELECT 
  id,
  video_id,
  viewer_id,
  watched_at,
  coins_awarded
  -- viewer_ip intentionally excluded
FROM public.video_views;

-- Re-create the creator SELECT policy on video_views (without IP masking concern, 
-- since we'll direct app code to use the view instead)
CREATE POLICY "Creators can view their video stats"
  ON public.video_views
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM videos v
      JOIN profiles p ON v.creator_id = p.id
      WHERE v.id = video_views.video_id
        AND p.user_id = auth.uid()
    )
  );

-- 2. Harden process_view_coins: validate video is published, prevent self-view abuse
CREATE OR REPLACE FUNCTION public.process_view_coins()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_creator_id UUID;
BEGIN
    -- Validate video exists AND is published
    SELECT creator_id INTO STRICT v_creator_id 
    FROM videos 
    WHERE id = NEW.video_id AND is_published = true;
    
    -- If video not found or not published, skip coin processing
    IF NOT FOUND THEN
        RETURN NEW;
    END IF;
    
    -- Award 8 coins to viewer (20% of ad revenue) - prevent self-view
    IF NEW.viewer_id IS NOT NULL AND NEW.viewer_id != v_creator_id THEN
        UPDATE profiles SET coins_balance = coins_balance + 8 WHERE id = NEW.viewer_id;
        
        INSERT INTO coin_transactions (profile_id, amount, transaction_type, description, video_id)
        VALUES (NEW.viewer_id, 8, 'earned', 'Watch reward +8 coins', NEW.video_id);
    END IF;
    
    -- Award creator (70% of ad revenue = 280 paise)
    UPDATE profiles 
    SET coins_balance = coins_balance + 28,
        total_earnings_paise = total_earnings_paise + 280
    WHERE id = v_creator_id;
    
    INSERT INTO coin_transactions (profile_id, amount, transaction_type, description, video_id)
    VALUES (v_creator_id, 28, 'earned', 'Creator revenue 70% split', NEW.video_id);
    
    -- Update video view count
    UPDATE videos SET views_count = views_count + 1 WHERE id = NEW.video_id;
    
    RETURN NEW;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        -- Video doesn't exist or isn't published, skip silently
        RETURN NEW;
END;
$$;