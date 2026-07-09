import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink, readFile } from "fs/promises";
import { join } from "path";
import { getProfile, updateProfile } from "@/lib/db";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const url = formData.get("url") as string | null;
  const profile = await getProfile();

  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 500 });

  if (file) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `resume_${Date.now()}_${file.name}`;
    const filepath = join(process.cwd(), "public", "uploads", filename);
    await writeFile(filepath, buffer);

    if (profile.resumeFile) {
      try { await unlink(join(process.cwd(), "public", "uploads", profile.resumeFile)); } catch {}
    }
    await updateProfile({ resumeFile: filename, resumeUrl: "" });
    return NextResponse.json({ ok: true, filename });
  }

  if (url) {
    await updateProfile({ resumeUrl: url, resumeFile: "" });
    return NextResponse.json({ ok: true, url });
  }

  return NextResponse.json({ error: "No file or URL provided" }, { status: 400 });
}

export async function GET() {
  const profile = await getProfile();
  if (!profile) return NextResponse.json({ error: "No profile" }, { status: 404 });

  if (profile.resumeFile) {
    const filepath = join(process.cwd(), "public", "uploads", profile.resumeFile);
    try {
      const fileBuffer = await readFile(filepath);
      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="resume.pdf"`,
        },
      });
    } catch {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
  }
  if (profile.resumeUrl) {
    return NextResponse.redirect(profile.resumeUrl);
  }
  return NextResponse.json({ error: "No resume available" }, { status: 404 });
}
