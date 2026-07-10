import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// ─── Profile ────────────────────────────────────────────
export async function getProfile() {
  return prisma.profile.findUnique({ where: { id: 1 } });
}

export async function updateProfile(data: Record<string, unknown>) {
  const { id, ...rest } = data;
  return prisma.profile.update({ where: { id: 1 }, data: rest as Record<string, string> });
}

// ─── Roles ──────────────────────────────────────────────
export async function getRoles() {
  return prisma.role.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function createRole(data: { title: string; sortOrder?: number }) {
  return prisma.role.create({ data: { title: data.title, sortOrder: data.sortOrder ?? 0 } });
}

export async function updateRole(id: number, data: { title?: string; sortOrder?: number }) {
  return prisma.role.update({ where: { id }, data });
}

export async function deleteRole(id: number) {
  return prisma.role.delete({ where: { id } });
}

// ─── Projects ───────────────────────────────────────────
export async function getProjects() {
  return prisma.project.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function createProject(data: any) {
  return prisma.project.create({ data });
}

export async function updateProject(id: number, data: any) {
  return prisma.project.update({ where: { id }, data });
}

export async function deleteProject(id: number) {
  return prisma.project.delete({ where: { id } });
}

// ─── Skills ─────────────────────────────────────────────
export async function getSkills() {
  return prisma.skill.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function createSkill(data: any) {
  return prisma.skill.create({ data });
}

export async function updateSkill(id: number, data: any) {
  return prisma.skill.update({ where: { id }, data });
}

export async function deleteSkill(id: number) {
  return prisma.skill.delete({ where: { id } });
}

// ─── Education ──────────────────────────────────────────
export async function getEducation() {
  return prisma.education.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function createEducation(data: any) {
  return prisma.education.create({ data });
}

export async function updateEducation(id: number, data: any) {
  const existing = await prisma.education.findUnique({ where: { id } });
  if (!existing) {
    return prisma.education.create({ data: { id, ...data } });
  }
  return prisma.education.update({ where: { id }, data });
}

export async function deleteEducation(id: number) {
  return prisma.education.delete({ where: { id } });
}

// ─── Certificates ───────────────────────────────────────
export async function getCertificates() {
  return prisma.certificate.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function createCertificate(data: any) {
  return prisma.certificate.create({ data });
}

export async function updateCertificate(id: number, data: any) {
  return prisma.certificate.update({ where: { id }, data });
}

export async function deleteCertificate(id: number) {
  return prisma.certificate.delete({ where: { id } });
}

// ─── Reviews ────────────────────────────────────────────
export async function getReviews() {
  return prisma.review.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function createReview(data: any) {
  return prisma.review.create({ data });
}

export async function updateReview(id: number, data: any) {
  return prisma.review.update({ where: { id }, data });
}

export async function deleteReview(id: number) {
  return prisma.review.delete({ where: { id } });
}

// ─── Terminal Info ──────────────────────────────────────
export async function getTerminalInfo() {
  return prisma.terminalInfo.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function createTerminalInfo(data: any) {
  return prisma.terminalInfo.create({ data });
}

export async function updateTerminalInfo(id: number, data: any) {
  return prisma.terminalInfo.update({ where: { id }, data });
}

export async function deleteTerminalInfo(id: number) {
  return prisma.terminalInfo.delete({ where: { id } });
}
