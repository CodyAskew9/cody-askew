import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { sendContact } = require("../../../server/contactHandler");

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const result = await sendContact(body);
  return Response.json(result.json, { status: result.status });
}
