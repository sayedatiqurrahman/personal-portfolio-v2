import { NextRequest, NextResponse } from "next/server";
import { getCertificates, createCertificate, updateCertificate, deleteCertificate } from "@/lib/db";

export async function GET() {
  const data = await getCertificates();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const item = await createCertificate(body);
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest) {
  const { id, ...data } = await req.json();
  await updateCertificate(id, data);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await deleteCertificate(id);
  return NextResponse.json({ ok: true });
}
