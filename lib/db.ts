import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// ─── Profile ────────────────────────────────────────────
const DEFAULT_PROFILE = {
  id: 0,
  name: "",
  shortName: "",
  headerName: "",
  terminalPrompt: "~",
  terminalUser: "user",
  tagline: "",
  bio: "",
  about: "[]",
  corePrinciples: "[]",
  statusLabel: "",
  profileImage: "",
  aboutImage: "",
  github: "",
  linkedin: "",
  twitter: "",
  email: "",
  footerText: "",
  resumeUrl: "",
  resumeFile: "",
};

export async function getProfile() {
  try {
    const profile = await prisma.profile.findUnique({ where: { id: 1 } });
    return profile || DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export async function updateProfile(data: Record<string, unknown>) {
  try {
    const { id, ...rest } = data;
    return await prisma.profile.update({ where: { id: 1 }, data: rest as Record<string, string> });
  } catch {
    return null;
  }
}

// ─── Roles ──────────────────────────────────────────────
export async function getRoles() {
  try {
    return await prisma.role.findMany({ orderBy: { sortOrder: "asc" } });
  } catch {
    return [];
  }
}

export async function createRole(data: { title: string; sortOrder?: number }) {
  try {
    return await prisma.role.create({ data: { title: data.title, sortOrder: data.sortOrder ?? 0 } });
  } catch {
    return null;
  }
}

export async function updateRole(id: number, data: { title?: string; sortOrder?: number }) {
  try {
    return await prisma.role.update({ where: { id }, data });
  } catch {
    return null;
  }
}

export async function deleteRole(id: number) {
  try {
    return await prisma.role.delete({ where: { id } });
  } catch {
    return null;
  }
}

// ─── Projects ───────────────────────────────────────────
export async function getProjects() {
  try {
    return await prisma.project.findMany({ orderBy: { sortOrder: "asc" } });
  } catch {
    return [];
  }
}

export async function createProject(data: any) {
  try {
    return await prisma.project.create({ data });
  } catch {
    return null;
  }
}

export async function updateProject(id: number, data: any) {
  try {
    return await prisma.project.update({ where: { id }, data });
  } catch {
    return null;
  }
}

export async function deleteProject(id: number) {
  try {
    return await prisma.project.delete({ where: { id } });
  } catch {
    return null;
  }
}

// ─── Skills ─────────────────────────────────────────────
export async function getSkills() {
  try {
    return await prisma.skill.findMany({ orderBy: { sortOrder: "asc" } });
  } catch {
    return [];
  }
}

export async function createSkill(data: any) {
  try {
    return await prisma.skill.create({ data });
  } catch {
    return null;
  }
}

export async function updateSkill(id: number, data: any) {
  try {
    return await prisma.skill.update({ where: { id }, data });
  } catch {
    return null;
  }
}

export async function deleteSkill(id: number) {
  try {
    return await prisma.skill.delete({ where: { id } });
  } catch {
    return null;
  }
}

// ─── Education ──────────────────────────────────────────
export async function getEducation() {
  try {
    return await prisma.education.findMany({ orderBy: { sortOrder: "asc" } });
  } catch {
    return [];
  }
}

export async function createEducation(data: any) {
  try {
    return await prisma.education.create({ data });
  } catch {
    return null;
  }
}

export async function updateEducation(id: number, data: any) {
  try {
    const existing = await prisma.education.findUnique({ where: { id } });
    if (!existing) {
      return await prisma.education.create({ data: { id, ...data } });
    }
    return await prisma.education.update({ where: { id }, data });
  } catch {
    return null;
  }
}

export async function deleteEducation(id: number) {
  try {
    return await prisma.education.delete({ where: { id } });
  } catch {
    return null;
  }
}

// ─── Certificates ───────────────────────────────────────
export async function getCertificates() {
  try {
    return await prisma.certificate.findMany({ orderBy: { sortOrder: "asc" } });
  } catch {
    return [];
  }
}

export async function createCertificate(data: any) {
  try {
    return await prisma.certificate.create({ data });
  } catch {
    return null;
  }
}

export async function updateCertificate(id: number, data: any) {
  try {
    return await prisma.certificate.update({ where: { id }, data });
  } catch {
    return null;
  }
}

export async function deleteCertificate(id: number) {
  try {
    return await prisma.certificate.delete({ where: { id } });
  } catch {
    return null;
  }
}

// ─── Reviews ────────────────────────────────────────────
export async function getReviews() {
  try {
    return await prisma.review.findMany({ orderBy: { sortOrder: "asc" } });
  } catch {
    return [];
  }
}

export async function createReview(data: any) {
  try {
    return await prisma.review.create({ data });
  } catch {
    return null;
  }
}

export async function updateReview(id: number, data: any) {
  try {
    return await prisma.review.update({ where: { id }, data });
  } catch {
    return null;
  }
}

export async function deleteReview(id: number) {
  try {
    return await prisma.review.delete({ where: { id } });
  } catch {
    return null;
  }
}

// ─── Categories ──────────────────────────────────────
export async function getCategories(type?: string) {
  try {
    const where = type ? { type } : {};
    return await prisma.category.findMany({ where, orderBy: { sortOrder: "asc" } });
  } catch {
    return [];
  }
}

export async function createCategory(data: { name: string; type?: string; sortOrder?: number }) {
  try {
    return await prisma.category.create({ data: { name: data.name, type: data.type ?? "skill", sortOrder: data.sortOrder ?? 0 } });
  } catch {
    return null;
  }
}

export async function updateCategory(id: number, data: { name?: string; type?: string; sortOrder?: number }) {
  try {
    return await prisma.category.update({ where: { id }, data });
  } catch {
    return null;
  }
}

export async function deleteCategory(id: number) {
  try {
    return await prisma.category.delete({ where: { id } });
  } catch {
    return null;
  }
}

// ─── Terminal Info ──────────────────────────────────────
export async function getTerminalInfo() {
  try {
    return await prisma.terminalInfo.findMany({ orderBy: { sortOrder: "asc" } });
  } catch {
    return [];
  }
}

export async function createTerminalInfo(data: any) {
  try {
    return await prisma.terminalInfo.create({ data });
  } catch {
    return null;
  }
}

export async function updateTerminalInfo(id: number, data: any) {
  try {
    return await prisma.terminalInfo.update({ where: { id }, data });
  } catch {
    return null;
  }
}

export async function deleteTerminalInfo(id: number) {
  try {
    return await prisma.terminalInfo.delete({ where: { id } });
  } catch {
    return null;
  }
}

// ─── Achievements ────────────────────────────────────────
export async function getAchievements() {
  try {
    return await prisma.achievement.findMany({ orderBy: { sortOrder: "asc" } });
  } catch {
    return [];
  }
}

export async function createAchievement(data: any) {
  try {
    return await prisma.achievement.create({ data });
  } catch {
    return null;
  }
}

export async function updateAchievement(id: number, data: any) {
  try {
    return await prisma.achievement.update({ where: { id }, data });
  } catch {
    return null;
  }
}

export async function deleteAchievement(id: number) {
  try {
    return await prisma.achievement.delete({ where: { id } });
  } catch {
    return null;
  }
}
