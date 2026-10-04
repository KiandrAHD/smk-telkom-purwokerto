import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CF_TURNSTILE_SECRET = Deno.env.get('CF_TURNSTILE_SECRET');
if (!CF_TURNSTILE_SECRET) {
  throw new Error("Missing Cloudflare Turnstile secret key.");
}

const ALLOWED_ORIGINS_RAW = Deno.env.get('TURNSTILE_ALLOWED_ORIGINS') || '';
const ALLOWED_ORIGINS = ALLOWED_ORIGINS_RAW
  ? ALLOWED_ORIGINS_RAW.split(',').map((o) => o.trim()).filter(Boolean)
  : [];

function isOriginAllowed(origin) {
  if (!ALLOWED_ORIGINS.length) return true;
  return ALLOWED_ORIGINS.some((allowed) => origin === allowed);
}

function corsHeaders(origin) {
  const effectiveOrigin = origin && isOriginAllowed(origin) ? origin : (ALLOWED_ORIGINS[0] || '*');
  return {
    "Access-Control-Allow-Origin": effectiveOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

function jsonResponse(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

serve(async (req) => {
  const origin = req.headers.get("origin") || "";

  if (req.method === "OPTIONS") {
    return new Response("", { headers: corsHeaders(origin) });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Only POST method is allowed." }, 405, origin);
  }

  if (origin && !isOriginAllowed(origin)) {
    return jsonResponse({ error: "Origin not allowed." }, 403, origin);
  }

  try {
    const body = await req.json();
    const token = body.token;

    if (!token || typeof token !== 'string' || token.length > 4096) {
      return jsonResponse({ error: "Invalid token." }, 400, origin);
    }

    const remoteIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
                     req.headers.get("cf-connecting-ip") || "";

    const verificationResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: CF_TURNSTILE_SECRET,
        response: token,
        ...(remoteIp ? { remoteip: remoteIp } : {}),
      }),
    });

    const result = await verificationResponse.json();

    if (!result.success) {
      return jsonResponse({ error: "Verification failed." }, 400, origin);
    }

    return jsonResponse({ success: true }, 200, origin);
  } catch (_err) {
    return jsonResponse({ error: "Internal server error." }, 500, origin);
  }
});
