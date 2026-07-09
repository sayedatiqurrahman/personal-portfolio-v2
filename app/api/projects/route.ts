import { NextRequest, NextResponse } from "next/server";
import { getProjects, createProject, updateProject, deleteProject } from "@/lib/db";

export async function GET() {
  const data = await getProjects();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const item = await createProject(body);
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest) {
  const { id, ...data } = await req.json();
  await updateProject(id, data);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await deleteProject(id);
  return NextResponse.json({ ok: true });
}
