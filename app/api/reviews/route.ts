import { NextRequest, NextResponse } from "next/server";
import { getReviews, createReview, updateReview, deleteReview } from "@/lib/db";

export async function GET() {
  const data = await getReviews();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const item = await createReview(body);
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest) {
  const { id, ...data } = await req.json();
  await updateReview(id, data);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await deleteReview(id);
  return NextResponse.json({ ok: true });
}
