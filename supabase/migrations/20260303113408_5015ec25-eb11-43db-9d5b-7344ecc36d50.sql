-- Block direct video_views inserts (force through edge function only)
DROP POLICY IF EXISTS "Rate limited view inserts" ON public.video_views;

CREATE POLICY "No direct view inserts"
  ON public.video_views
  FOR INSERT
  WITH CHECK (false);

-- Block DELETE and UPDATE on coin_transactions
CREATE POLICY "No direct transaction deletes"
  ON public.coin_transactions
  FOR DELETE
  USING (false);

CREATE POLICY "No direct transaction updates"
  ON public.coin_transactions
  FOR UPDATE
  USING (false);