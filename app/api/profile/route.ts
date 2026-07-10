import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getProfile, updateProfile } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const profile = await getProfile();
    return NextResponse.json(profile);
  } catch {
    return NextResponse.json(null);
  }
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const updated = await updateProfile(body);
  revalidatePath("/");
  return NextResponse.json(updated);
}
