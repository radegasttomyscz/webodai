const DEFAULT_ALLOWED_ORIGINS = [
  "https://webodai.cz",
  "https://www.webodai.cz",
  "http://localhost:5173",
];

function getAllowedOrigins(env) {
  return (env.ALLOWED_ORIGINS || DEFAULT_ALLOWED_ORIGINS.join(","))
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean);
}

function getCorsHeaders(request, env) {
  const allowedOrigins = getAllowedOrigins(env);
  const origin = request.headers.get("Origin");
  const allowedOrigin = origin && allowedOrigins.includes(origin)
    ? origin
    : allowedOrigins[0];

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, anthropic-version",
    "Vary": "Origin",
  };
}

function jsonResponse(request, env, body, init = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      ...getCorsHeaders(request, env),
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
}

export default {
  async fetch(request, env) {
    const corsHeaders = getCorsHeaders(request, env);
    const origin = request.headers.get("Origin");
    const allowedOrigins = getAllowedOrigins(env);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (origin && !allowedOrigins.includes(origin)) {
      return jsonResponse(request, env, { error: "Origin is not allowed." }, { status: 403 });
    }

    if (request.method !== "POST") {
      return jsonResponse(request, env, { error: "Method not allowed." }, {
        status: 405,
        headers: { Allow: "POST, OPTIONS" },
      });
    }

    if (!env.ANTHROPIC_API_KEY) {
      return jsonResponse(request, env, { error: "Missing ANTHROPIC_API_KEY secret." }, { status: 500 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse(request, env, { error: "Request body must be valid JSON." }, { status: 400 });
    }

    try {
      const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": request.headers.get("anthropic-version") || "2023-06-01",
        },
        body: JSON.stringify(body),
      });

      const responseText = await anthropicResponse.text();
      return new Response(responseText, {
        status: anthropicResponse.status,
        headers: {
          ...corsHeaders,
          "Content-Type": anthropicResponse.headers.get("Content-Type") || "application/json",
        },
      });
    } catch (error) {
      return jsonResponse(request, env, { error: error.message }, { status: 502 });
    }
  },
};
