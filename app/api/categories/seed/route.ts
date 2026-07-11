import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const skillCats = ["Frontend", "Backend", "Full Stack", "Full Business Setup", "Opensource"];
    const projectCats = ["Frontend", "Backend", "Full Stack", "Full Business Setup", "Opensource"];

    const existing = await prisma.category.count();
    if (existing > 0) {
      return NextResponse.json({ ok: true, message: "Categories already exist" });
    }

    for (let i = 0; i < skillCats.length; i++) {
      await prisma.category.create({ data: { name: skillCats[i], type: "skill", sortOrder: i } });
    }
    for (let i = 0; i < projectCats.length; i++) {
      await prisma.category.create({ data: { name: projectCats[i], type: "project", sortOrder: i } });
    }

    return NextResponse.json({ ok: true, message: "Default categories seeded" });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
