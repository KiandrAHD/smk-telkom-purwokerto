import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

/**
 * Cloudflare Turnstile Verification Edge Function
 *
 * NOTE: Turnstile is temporarily disabled on frontend for deadline release;
 * server verification remains available for future reactivation.
 */

const CF_TURNSTILE_SECRET = Deno.env.get('CF_TURNSTILE_SECRET');
if (!CF_TURNSTILE_SECRET) {
  throw new Error("Missing Cloudflare Turnstile secret key.");
}

const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'https://smk-telkom-purwokerto.vercel.app',
  'https://flexbox.smktelkom-pwt.sch.id',
];
const ALLOWED_ORIGINS_RAW = Deno.env.get('TURNSTILE_ALLOWED_ORIGINS') || '';
const ALLOWED_ORIGINS = ALLOWED_ORIGINS_RAW
  ? ALLOWED_ORIGINS_RAW.split(',').map((origin) => origin.trim()).filter(Boolean)
  : DEFAULT_ALLOWED_ORIGINS;

function isOriginAllowed(origin) {
  return ALLOWED_ORIGINS.includes(origin);
}

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, apikey",
  };
}

function jsonResponse(body, status, origin) {
  const headers = { "Content-Type": "application/json" };
  if (isOriginAllowed(origin)) Object.assign(headers, corsHeaders(origin));
  return new Response(JSON.stringify(body), { status, headers });
}

serve(async (req) => {
  const origin = req.headers.get("origin") || "";

  if (!origin || !isOriginAllowed(origin)) {
    return new Response(JSON.stringify({ error: "Origin not allowed." }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (req.method === "OPTIONS") {
    return new Response("", { headers: corsHeaders(origin) });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Only POST method is allowed." }, 405, origin);
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
