import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { sendChat } = require("../../../server/chatHandler");

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const result = await sendChat(body);
  return Response.json(result.json, { status: result.status });
}
