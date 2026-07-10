import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getTerminalInfo, createTerminalInfo, updateTerminalInfo, deleteTerminalInfo } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getTerminalInfo();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const item = await createTerminalInfo(body);
  revalidatePath("/");
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest) {
  const { id, ...data } = await req.json();
  await updateTerminalInfo(id, data);
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await deleteTerminalInfo(id);
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
