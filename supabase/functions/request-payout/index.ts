import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Minimum payout: ₹50 = 5000 paise = 5000 coins (100 coins = ₹1)
const MIN_PAYOUT_COINS = 5000;
const COINS_TO_PAISE = 1; // 100 coins = ₹1 = 100 paise, so 1 coin = 1 paise

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { coins_amount, upi_id } = await req.json();

    if (!coins_amount || !upi_id) {
      return new Response(
        JSON.stringify({ error: "coins_amount and upi_id are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (coins_amount < MIN_PAYOUT_COINS) {
      return new Response(
        JSON.stringify({ error: `Minimum payout is ${MIN_PAYOUT_COINS} coins (₹50)` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate UPI ID format
    const upiRegex = /^[\w.-]+@[\w.-]+$/;
    if (!upiRegex.test(upi_id)) {
      return new Response(
        JSON.stringify({ error: "Invalid UPI ID format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("id, coins_balance, upi_id")
      .eq("user_id", user.id)
      .single();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: "Profile not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (profile.coins_balance < coins_amount) {
      return new Response(
        JSON.stringify({ error: "Insufficient coins balance" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check for pending payout requests
    const { data: pendingPayouts } = await supabaseAdmin
      .from("payout_requests")
      .select("id")
      .eq("profile_id", profile.id)
      .eq("status", "pending")
      .limit(1);

    if (pendingPayouts && pendingPayouts.length > 0) {
      return new Response(
        JSON.stringify({ error: "You already have a pending payout request" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const paiseAmount = coins_amount * COINS_TO_PAISE;

    // Create payout request
    const { data: payoutRequest, error: payoutError } = await supabaseAdmin
      .from("payout_requests")
      .insert({
        profile_id: profile.id,
        coins_amount,
        paise_amount: paiseAmount,
        upi_id,
      })
      .select()
      .single();

    if (payoutError) {
      console.error("Payout error:", payoutError);
      return new Response(
        JSON.stringify({ error: "Failed to create payout request" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Deduct coins from balance (CHECK constraint prevents negative balance)
    const { error: deductError } = await supabaseAdmin
      .from("profiles")
      .update({ 
        coins_balance: profile.coins_balance - coins_amount,
        upi_id 
      })
      .eq("id", profile.id);

    if (deductError) {
      // Rollback: delete the payout request if coin deduction fails
      await supabaseAdmin
        .from("payout_requests")
        .delete()
        .eq("id", payoutRequest.id);
      
      console.error("Deduct error:", deductError);
      return new Response(
        JSON.stringify({ error: "Insufficient coins balance" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Log transaction
    await supabaseAdmin
      .from("coin_transactions")
      .insert({
        profile_id: profile.id,
        amount: -coins_amount,
        transaction_type: "payout",
        description: `Payout request: ₹${paiseAmount / 100} to ${upi_id}`,
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        payout_request: payoutRequest,
        amount_inr: paiseAmount / 100
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Payout error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
