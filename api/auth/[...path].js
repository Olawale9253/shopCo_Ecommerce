import { Buffer } from "node:buffer";
import process from "node:process";

export default async function handler(request, response) {
  const apiUrl = process.env.SHOPCO_API_URL;

  if (!apiUrl) {
    return response.status(503).json({ error: "Authentication service is not configured." });
  }

  const path = request.query.path;
  const segments = Array.isArray(path) ? path : [path].filter(Boolean);
  const upstreamUrl = new URL(
    `/api/auth/${segments.map((segment) => encodeURIComponent(segment)).join("/")}`,
    apiUrl,
  );
  const headers = {};

  if (request.headers.cookie) headers.cookie = request.headers.cookie;
  if (request.headers["content-type"]) headers["content-type"] = request.headers["content-type"];

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      method: request.method,
      headers,
      body: ["GET", "HEAD"].includes(request.method) ? undefined : JSON.stringify(request.body ?? {}),
    });

    response.status(upstreamResponse.status);
    response.setHeader("Cache-Control", "no-store");
    const contentType = upstreamResponse.headers.get("content-type");
    if (contentType) response.setHeader("Content-Type", contentType);

    const cookies = upstreamResponse.headers.getSetCookie();
    if (cookies.length) response.setHeader("Set-Cookie", cookies);

    if (upstreamResponse.status === 204) return response.end();
    return response.send(Buffer.from(await upstreamResponse.arrayBuffer()));
  } catch (error) {
    console.error("Authentication service request failed:", error);
    return response.status(502).json({ error: "Authentication service is unavailable." });
  }
}
