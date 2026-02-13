import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-forwarded-for",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { video_id } = await req.json();

    if (!video_id) {
      return new Response(
        JSON.stringify({ error: "video_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get viewer IP from headers
    const viewerIp = req.headers.get("x-forwarded-for")?.split(",")[0] || 
                     req.headers.get("cf-connecting-ip") || 
                     "unknown";

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Global rate limit: max 5 views per IP per minute across all videos
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();
    const { data: recentViews } = await supabaseAdmin
      .from("video_views")
      .select("id")
      .eq("viewer_ip", viewerIp)
      .gte("watched_at", oneMinuteAgo)
      .limit(5);

    if (recentViews && recentViews.length >= 5) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded" }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if this IP has already viewed this video in the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: existingView } = await supabaseAdmin
      .from("video_views")
      .select("id")
      .eq("video_id", video_id)
      .eq("viewer_ip", viewerIp)
      .gte("watched_at", oneHourAgo)
      .limit(1);

    if (existingView && existingView.length > 0) {
      return new Response(
        JSON.stringify({ success: true, message: "View already recorded" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get viewer profile ID if logged in
    let viewerId = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        {
          global: {
            headers: { Authorization: authHeader },
          },
        }
      );
      
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (user) {
        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .eq("user_id", user.id)
          .single();
        if (profile) viewerId = profile.id;
      }
    }

    // Record the view
    const { error: insertError } = await supabaseAdmin
      .from("video_views")
      .insert({
        video_id,
        viewer_id: viewerId,
        viewer_ip: viewerIp,
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to record view" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("View recording error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
