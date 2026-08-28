import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { healthPayload } = require("../../../server/util");

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(healthPayload());
}
