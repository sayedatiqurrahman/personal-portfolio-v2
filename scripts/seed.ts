import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear all tables
  await prisma.terminalInfo.deleteMany();
  await prisma.review.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.education.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.project.deleteMany();
  await prisma.role.deleteMany();
  await prisma.profile.deleteMany();

  // ─── Profile ──────────────────────────────────────────
  await prisma.profile.create({
    data: {
      id: 1,
      name: "Sayed Atiqur Rahman",
      shortName: "S.A.Rahman",
      headerName: "S.A.RAHMAN",
      terminalPrompt: "S.A.RAHMAN@ROOT:~$",
      terminalUser: "sayed@atiqur",
      tagline:
        "Building scalable digital experiences with precision and human-centric design.",
      bio: "Specializing in the MERN stack and modern architectural patterns. Building high-performance applications with precision and human-centric design.",
      about: JSON.stringify([
        "I am a software engineer driven by the intersection of robust backend logic and intuitive user experiences. My journey in development is defined by a commitment to clean code and architectural excellence.",
        "Whether I am optimizing database queries or crafting pixel-perfect interfaces, my goal is always to build systems that scale and empower users.",
      ]),
      corePrinciples: JSON.stringify([
        "Scalability by design",
        "Type-safe architectures",
        "Human-centric interfaces",
      ]),
      statusLabel: "Available for hire",
      profileImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDleRKAL4WWFH_T76F8Lq8sncQbWRauyX8rui9WyLt10cNXEPbtjcpyKuyA9rPKCCXCFuNfvCmrw5JTjrslXAC-PIdDmrkgU-jBTVQvTzPSUda7v6gjLFA2_HI8f0Jd4GtcwpOz1agprxcxRNTBGTbe7wPnZuYN7cML29nfWvbrMtix_JpMHJY2fPVYn-Oam-FhBR4qJbAM877nMUjQAvzmhxNC1EAuPlhXlifAmN-sDrny1rXXQ5A53_1cCWF1iPY-qA",
      aboutImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAfKBvrpxH4jqn5mxqcbjTTxLL1Jd6u8qmR5PFFMazDl8sqGRSow4p7TD7fs745OJDqzqqWiCEfi2rDN_halmy6vIgNRohdiOyGedr0owm3BRXgkguXBR4mwLWOvXHbUjki_ijIh5rG94E1c641eQwAFvEyyvSjFEJa0RbvHaN5bBK_s_xu4dN7TcWpu1Y2BTT_T1kuqhEih9JCu6frs4pStJgdWbLH3VRD2tenXFnQY61MsyPRDAbXJJIS-AneJIiB7A",
      github: "https://github.com/sayedatiqurrahman/",
      linkedin: "https://bd.linkedin.com/in/satiqurrahman",
      twitter: "https://x.com/satiqurrahman35",
      email: "s.atiqurrahman2003@gmail.com",
      footerText: "© 2024 Sayed Atiqur Rahman. Built with MERN Stack.",
    },
  });

  // ─── Roles ────────────────────────────────────────────
  await prisma.role.createMany({
    data: [
      { title: "Full Stack Developer", sortOrder: 0 },
      { title: "UI/UX Designer", sortOrder: 1 },
      { title: "DevOps Engineer", sortOrder: 2 },
      { title: "Cloud Architect", sortOrder: 3 },
    ],
  });

  // ─── Projects ─────────────────────────────────────────
  await prisma.project.createMany({
    data: [
      {
        title: "Baraka Cloud", category: "Cloud Infrastructure",
        description: "A distributed cloud management platform focusing on seamless orchestration and automated scaling for enterprise workflows.",
        longDescription: "Scalable multi-tenant infrastructure platform with real-time monitoring and automated deployment pipelines.",
        stack: JSON.stringify(["Next.js", "Prisma", "PostgreSQL"]),
        terminalType: "Cloud storage solution", terminalDesc: "Scalable distributed file system with encrypted buffers.",
        terminalScript: "./baraka-cloud.sh", tags: JSON.stringify(["AWS", "MERN"]),
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJpXzrHSYpzYzRgASGIFOfsSewTs9zw7JoTN4EE4lR5IeGpychTnsQBNqUonZlKPd641tAyCzb31fkN5llqF2IbZ_E1E3eBwQ4IyfXZEMSBbxZtsTrDY-jor2NBG6z4a2hy4z3dEJtV0ESrCHqF_AQb6gqqgFO1sSkSnrcLuGE2RUO6jsV6TIXE9Tx8uSG6-VJxaSUInHhUiHFEHWBMGa4CrYkUIbdoD8TxJu0-GyCdqf0An2x6f3V",
        liveUrl: "#", sourceUrl: "#", gridSpan: "8", featured: 1, sortOrder: 0,
      },
      {
        title: "GlobalSpeak", category: "AI Integration",
        description: "Bridging communication gaps with AI-powered translation services for global enterprise teams.",
        longDescription: "Real-time multilingual translation API with low-latency WebSocket integration.",
        stack: JSON.stringify(["React", "Python", "WebSocket"]),
        terminalType: "Translation/Comm App", terminalDesc: "Real-time neural machine translation for enterprise chat.",
        terminalScript: "./global-speak.bin", tags: JSON.stringify(["OpenAI", "WebSocket"]),
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxTCDXemZQXBfDuqC15NdoronI6ztAs2w0Ceh-uCnogOjQEmTIaK6CY_KaeFy2lik6VOYIoGkDD3bYWhUvg4VObVKlXTlGk2ITrt3AyYOTVEe7QVBLsYYY8P6rYOQDR8QiywTcdVPronpLDoP2yEz5vnJl3jQyckwVuwe--xJxeJE1ggvSk2q_DhInIbsJRdQZPGVGcKkwUuRyNJJSdfsHGQwuWMM4BWq3N_Zw8Cu3OWEQ5N7025P3",
        liveUrl: "#", sourceUrl: "#", gridSpan: "4", featured: 0, sortOrder: 1,
      },
      {
        title: "JS_Mosque Dashboard", category: "Community Tool",
        description: "An open-source management system for community organizations, handling scheduling, donation tracking, and event coordination.",
        longDescription: "A community management system featuring scheduling, membership tracking, and automated donation processing with Stripe integration.",
        stack: JSON.stringify(["React", "MongoDB", "Express"]),
        terminalType: "Utility Library", terminalDesc: "Lightweight NPM package for prayer time calculations.",
        terminalScript: "lib/js_mosque/", tags: JSON.stringify(["Role Based Auth", "Stripe SDK"]),
        image: "", liveUrl: "#", sourceUrl: "#", gridSpan: "12", featured: 1, sortOrder: 2,
      },
      {
        title: "Programming Light Agency", category: "Agency / Studio",
        description: "All-in-One Digital Solutions Studio for modern business growth and product launches.",
        longDescription: "A digital agency platform focused on web products, branding, and growth systems for startups and small businesses.",
        stack: JSON.stringify(["Next.js", "Prisma", "PostgreSQL"]),
        terminalType: "Agency Platform", terminalDesc: "Studio website with launch-ready digital experiences.",
        terminalScript: "./programming-light.sh", tags: JSON.stringify(["Agency", "Next.js"]),
        image: "", liveUrl: "https://programming-light.vercel.app/", sourceUrl: "#", gridSpan: "8", featured: 1, sortOrder: 3,
      },
    ],
  });

  // ─── Skills ───────────────────────────────────────────
  await prisma.skill.createMany({
    data: [
      { name: "TypeScript", icon: "javascript", percent: 88, level: "expertise", category: "Frontend", sortOrder: 0 },
      { name: "React", icon: "data_object", percent: 95, level: "expertise", category: "Frontend", sortOrder: 1 },
      { name: "Next.js", icon: "dns", percent: 95, level: "expertise", category: "Frontend", sortOrder: 2 },
      { name: "Tailwind", icon: "palette", percent: 90, level: "expertise", category: "Frontend", sortOrder: 3 },
      { name: "Node.js", icon: "terminal", percent: 90, level: "expertise", category: "Backend", sortOrder: 4 },
      { name: "Express", icon: "code", percent: 85, level: "expertise", category: "Backend", sortOrder: 5 },
      { name: "Prisma", icon: "database", percent: 85, level: "expertise", category: "Backend", sortOrder: 6 },
      { name: "PostgreSQL", icon: "storage", percent: 80, level: "comfortable", category: "Backend", sortOrder: 7 },
      { name: "MongoDB", icon: "cloud", percent: 85, level: "comfortable", category: "Backend", sortOrder: 8 },
      { name: "AWS", icon: "cloud_queue", percent: 75, level: "comfortable", category: "Cloud", sortOrder: 9 },
      { name: "Docker", icon: "deployed_code", percent: 70, level: "familiar", category: "Cloud", sortOrder: 10 },
      { name: "Kubernetes", icon: "deployed_code_update", percent: 60, level: "familiar", category: "Cloud", sortOrder: 11 },
      { name: "GitHub Actions", icon: "play_circle", percent: 75, level: "comfortable", category: "Cloud", sortOrder: 12 },
    ],
  });

  // ─── Terminal Info ────────────────────────────────────
  await prisma.terminalInfo.createMany({
    data: [
      { key: "user", label: "User", value: "sayed@atiqur", sortOrder: 0 },
      { key: "os", label: "OS", value: "Portfolio OS v2.0", sortOrder: 1 },
      { key: "uptime", label: "Uptime", value: "5+ Years Experience", sortOrder: 2 },
      { key: "shell", label: "Shell", value: "TypeScript / Node.js", sortOrder: 3 },
      { key: "editor", label: "Editor", value: "VS Code / Neovim", sortOrder: 4 },
      { key: "stack", label: "Stack", value: "React, Next.js, Node, Prisma", sortOrder: 5 },
      { key: "projects", label: "Projects", value: "73+ Repositories", sortOrder: 6 },
      { key: "status", label: "Status", value: "Available for hire", sortOrder: 7 },
    ],
  });

  // ─── Education ────────────────────────────────────────
  await prisma.education.createMany({
    data: [
      {
        institution: "International Islamic University Chittagong",
        degree: "Bachelor of Arts in Qur'anic Science & Islamic Studies",
        field: "Islamic Studies",
        startDate: "2022",
        endDate: "2027",
        description: "Focused on Qur'anic studies, Islamic knowledge, and academic research.",
        sortOrder: 0,
      },
    ],
  });

  // ─── Certificates ─────────────────────────────────────
  await prisma.certificate.createMany({
    data: [
      { name: "Complete Web Development", issuer: "Programming Hero", date: "2022", sortOrder: 0 },
      { name: "Meta Front-End Developer", issuer: "Meta / Coursera", date: "2023", sortOrder: 1 },
    ],
  });

  // ─── Reviews ──────────────────────────────────────────
  await prisma.review.createMany({
    data: [
      { clientName: "John Smith", company: "TechCorp Inc.", rating: 5, text: "Excellent work on our web application. Highly professional and delivered on time.", date: "2024-01", sortOrder: 0 },
      { clientName: "Sarah Lee", company: "StartupXYZ", rating: 5, text: "Amazing developer with great attention to detail. Would definitely work with again.", date: "2024-03", sortOrder: 1 },
    ],
  });

  console.log("Database seeded successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
