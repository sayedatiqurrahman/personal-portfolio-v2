import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getProjects, createProject, updateProject, deleteProject } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getProjects();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const item = await createProject(body);
  revalidatePath("/");
  revalidatePath("/projects");
  return NextResponse.json(item);
}

export async function PUT(req: NextRequest) {
  const { id, ...data } = await req.json();
  await updateProject(id, data);
  revalidatePath("/");
  revalidatePath("/projects");
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await deleteProject(id);
  revalidatePath("/");
  revalidatePath("/projects");
  return NextResponse.json({ ok: true });
}
