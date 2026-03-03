-- Block direct payout_requests inserts (force through edge function)
DROP POLICY IF EXISTS "Users can request payouts" ON public.payout_requests;

CREATE POLICY "No direct payout inserts"
  ON public.payout_requests
  FOR INSERT
  WITH CHECK (false);