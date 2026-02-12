import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CLOUDINARY_CLOUD_NAME = Deno.env.get("CLOUDINARY_CLOUD_NAME") ?? "";
const CLOUDINARY_API_KEY = Deno.env.get("CLOUDINARY_API_KEY") ?? "";

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

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get user profile and check if they're a creator
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("id, is_creator")
      .eq("user_id", user.id)
      .single();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: "Profile not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!profile.is_creator) {
      return new Response(
        JSON.stringify({ error: "You must be a creator to upload videos" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const formData = await req.formData();
    const videoFile = formData.get("video") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;

    if (!videoFile || !title || !category) {
      return new Response(
        JSON.stringify({ error: "Video, title, and category are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check file size (max 50MB)
    if (videoFile.size > 50 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ error: "Video file too large (max 50MB)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Upload to Cloudinary with auto-compression
    const cloudinarySecret = Deno.env.get("CLOUDINARY_API_SECRET");
    if (!cloudinarySecret) {
      return new Response(
        JSON.stringify({ error: "Cloudinary not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = `folder=aitube&resource_type=video&timestamp=${timestamp}&transformation=q_auto,f_auto`;
    
    // Create signature using SHA-1 (required by Cloudinary)
    const encoder = new TextEncoder();
    const data = encoder.encode(paramsToSign + cloudinarySecret);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    const uploadFormData = new FormData();
    uploadFormData.append("file", videoFile);
    uploadFormData.append("api_key", CLOUDINARY_API_KEY);
    uploadFormData.append("timestamp", timestamp.toString());
    uploadFormData.append("signature", signature);
    uploadFormData.append("folder", "aitube");
    uploadFormData.append("resource_type", "video");
    uploadFormData.append("transformation", "q_auto,f_auto");

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
      {
        method: "POST",
        body: uploadFormData,
      }
    );

    const cloudinaryResult = await cloudinaryResponse.json();

    if (!cloudinaryResponse.ok) {
      console.error("Cloudinary error:", cloudinaryResult);
      return new Response(
        JSON.stringify({ error: "Failed to upload video to cloud" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check video duration (max 60 seconds for shorts, 600 for longform)
    const duration = Math.round(cloudinaryResult.duration || 0);
    const videoType = formData.get("videoType") as string || "shorts";
    const maxDuration = videoType === "longform" ? 600 : 60;
    if (duration > maxDuration) {
      return new Response(
        JSON.stringify({ error: `Video must be ${maxDuration} seconds or less` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate thumbnail URL
    const thumbnailUrl = cloudinaryResult.secure_url.replace(
      "/video/upload/",
      "/video/upload/so_0,w_400,h_720,c_fill,f_jpg/"
    );

    // Save video to database
    const { data: video, error: videoError } = await supabaseClient
      .from("videos")
      .insert({
        creator_id: profile.id,
        title,
        description: description || null,
        cloudinary_public_id: cloudinaryResult.public_id,
        cloudinary_url: cloudinaryResult.secure_url,
        thumbnail_url: thumbnailUrl,
        duration_seconds: duration,
        category,
      })
      .select()
      .single();

    if (videoError) {
      console.error("Database error:", videoError);
      return new Response(
        JSON.stringify({ error: "Failed to save video" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, video }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
