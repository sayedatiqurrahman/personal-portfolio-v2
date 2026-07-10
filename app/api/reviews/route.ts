import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getReviews, createReview, updateReview, deleteReview } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getReviews();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const item = await createReview(body);
  revalidatePath("/");
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest) {
  const { id, ...data } = await req.json();
  await updateReview(id, data);
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await deleteReview(id);
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
