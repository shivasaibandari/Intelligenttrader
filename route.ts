import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({ status: "ok", mode: process.env.MARKET_DATA_PROVIDER ?? "mock", liveDataEnabled: process.env.ENABLE_LIVE_DATA === "true", note: "Health endpoint only; does not verify provider connectivity." });
}
