
-- Update process_view_coins for 70-20-10 revenue split
-- Per view (ad completion):
--   Creator: 70% → ₹2.80 (280 paise) tracked in total_earnings_paise, +28 coins
--   User: 20% → 8 coins reward
--   Platform: 10% → ₹0.40 (retained)

CREATE OR REPLACE FUNCTION public.process_view_coins()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    v_creator_id UUID;
BEGIN
    -- Get creator id
    SELECT creator_id INTO v_creator_id FROM videos WHERE id = NEW.video_id;
    
    -- Award 8 coins to viewer (20% of ad revenue)
    IF NEW.viewer_id IS NOT NULL AND NEW.viewer_id != v_creator_id THEN
        UPDATE profiles SET coins_balance = coins_balance + 8 WHERE id = NEW.viewer_id;
        
        INSERT INTO coin_transactions (profile_id, amount, transaction_type, description, video_id)
        VALUES (NEW.viewer_id, 8, 'earned', 'Watch reward +8 coins', NEW.video_id);
    END IF;
    
    -- Award creator (70% of ad revenue = ₹2.80 = 280 paise)
    UPDATE profiles 
    SET coins_balance = coins_balance + 28,
        total_earnings_paise = total_earnings_paise + 280
    WHERE id = v_creator_id;
    
    INSERT INTO coin_transactions (profile_id, amount, transaction_type, description, video_id)
    VALUES (v_creator_id, 28, 'earned', 'Creator revenue 70% split', NEW.video_id);
    
    -- Update video view count
    UPDATE videos SET views_count = views_count + 1 WHERE id = NEW.video_id;
    
    RETURN NEW;
END;
$function$;
