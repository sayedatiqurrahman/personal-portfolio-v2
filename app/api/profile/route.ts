import { NextRequest, NextResponse } from "next/server";
import { getProfile, updateProfile } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const profile = await getProfile();
  return NextResponse.json(profile);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const updated = await updateProfile(body);
  return NextResponse.json(updated);
}
