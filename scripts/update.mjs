#!/usr/bin/env node
/**
 * Portfolio Content CLI
 * Run: node scripts/update.mjs
 *
 * Edit profile, projects, and skills from the terminal.
 * Changes write to content/*.json, then the site rebuilds.
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import readline from "readline";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CONTENT = join(ROOT, "content");

function loadJSON(file) {
  return JSON.parse(readFileSync(join(CONTENT, file), "utf-8"));
}

function saveJSON(file, data) {
  writeFileSync(join(CONTENT, file), JSON.stringify(data, null, 2) + "\n");
}

function ask(rl, prompt) {
  return new Promise((resolve) => rl.question(prompt, resolve));
}

function menu() {
  console.log("\n\x1b[32m╔══════════════════════════════════════╗");
  console.log("║   PORTFOLIO CONTENT MANAGER          ║");
  console.log("╚══════════════════════════════════════╝\x1b[0m\n");
  console.log("  1) Edit Profile");
  console.log("  2) Manage Projects");
  console.log("  3) Manage Skills");
  console.log("  4) Rebuild Site");
  console.log("  5) Exit\n");
}

async function editProfile(rl) {
  const p = loadJSON("profile.json");
  console.log("\n\x1b[36m--- Profile Editor ---\x1b[0m");
  console.log("  Press Enter to keep current value.\n");

  const name = await ask(rl, `  Name [${p.name}]: `);
  if (name) p.name = name;

  const short = await ask(rl, `  Short Name [${p.shortName}]: `);
  if (short) p.shortName = short;

  const role = await ask(rl, `  Role [${p.role}]: `);
  if (role) p.role = role;

  const tagline = await ask(rl, `  Tagline [${p.tagline}]: `);
  if (tagline) p.tagline = tagline;

  const bio = await ask(rl, `  Bio [${p.bio.slice(0, 50)}...]: `);
  if (bio) p.bio = bio;

  const email = await ask(rl, `  Email [${p.socials.email}]: `);
  if (email) p.socials.email = email;

  const github = await ask(rl, `  GitHub URL [${p.socials.github}]: `);
  if (github) p.socials.github = github;

  const linkedin = await ask(rl, `  LinkedIn URL [${p.socials.linkedin}]: `);
  if (linkedin) p.socials.linkedin = linkedin;

  const twitter = await ask(rl, `  Twitter URL [${p.socials.twitter}]: `);
  if (twitter) p.socials.twitter = twitter;

  const footer = await ask(rl, `  Footer Text [${p.footerText}]: `);
  if (footer) p.footerText = footer;

  saveJSON("profile.json", p);
  console.log("\n\x1b[32m✓ Profile saved.\x1b[0m");
}

async function manageProjects(rl) {
  const projects = loadJSON("projects.json");
  console.log("\n\x1b[36m--- Project Manager ---\x1b[0m");
  console.log("  1) List projects");
  console.log("  2) Add project");
  console.log("  3) Edit project");
  console.log("  4) Delete project\n");

  const action = await ask(rl, "  Choose: ");

  if (action === "1") {
    console.log("");
    projects.forEach((p, i) => {
      console.log(`  ${i + 1}) ${p.title} [${p.category}]`);
    });
  } else if (action === "2") {
    const title = await ask(rl, "  Title: ");
    const category = await ask(rl, "  Category: ");
    const description = await ask(rl, "  Description: ");
    const stack = await ask(rl, "  Stack (comma-separated): ");
    const gridSpan = await ask(rl, "  Grid span (4, 6, 8, or 12) [8]: ");

    projects.push({
      id: title.toLowerCase().replace(/\s+/g, "-"),
      title,
      category,
      categoryBadge: category.toUpperCase(),
      description,
      longDescription: description,
      stack: stack.split(",").map((s) => s.trim()),
      terminalType: category,
      terminalDesc: description,
      terminalCommit: "new",
      terminalAuthor: "admin",
      terminalDate: new Date().toISOString().split("T")[0],
      terminalScript: `./${title.toLowerCase().replace(/\s+/g, "-")}.sh`,
      tags: [],
      image: "",
      bgImage: "",
      gridSpan: gridSpan || "8",
      liveUrl: "#",
      sourceUrl: "#",
    });
    saveJSON("projects.json", projects);
    console.log("\n\x1b[32m✓ Project added.\x1b[0m");
  } else if (action === "3") {
    projects.forEach((p, i) => {
      console.log(`  ${i + 1}) ${p.title}`);
    });
    const idx = parseInt(await ask(rl, "  Which project? ")) - 1;
    if (idx >= 0 && idx < projects.length) {
      const p = projects[idx];
      const title = await ask(rl, `  Title [${p.title}]: `);
      if (title) p.title = title;
      const desc = await ask(rl, `  Description [${p.description.slice(0, 40)}...]: `);
      if (desc) p.description = desc;
      const stack = await ask(rl, `  Stack [${p.stack.join(", ")}]: `);
      if (stack) p.stack = stack.split(",").map((s) => s.trim());
      saveJSON("projects.json", projects);
      console.log("\n\x1b[32m✓ Project updated.\x1b[0m");
    }
  } else if (action === "4") {
    projects.forEach((p, i) => {
      console.log(`  ${i + 1}) ${p.title}`);
    });
    const idx = parseInt(await ask(rl, "  Which project? ")) - 1;
    if (idx >= 0 && idx < projects.length) {
      projects.splice(idx, 1);
      saveJSON("projects.json", projects);
      console.log("\n\x1b[32m✓ Project deleted.\x1b[0m");
    }
  }
}

async function manageSkills(rl) {
  const skills = loadJSON("skills.json");
  console.log("\n\x1b[36m--- Skill Manager ---\x1b[0m");
  console.log("  1) List skills");
  console.log("  2) Add skill");
  console.log("  3) Edit skill");
  console.log("  4) Delete skill\n");

  const action = await ask(rl, "  Choose: ");

  if (action === "1") {
    console.log("");
    skills.forEach((s, i) => {
      console.log(`  ${i + 1}) ${s.name} (${s.percent}%)`);
    });
  } else if (action === "2") {
    const name = await ask(rl, "  Name: ");
    const icon = await ask(rl, "  Material icon name: ");
    const percent = parseInt(await ask(rl, "  Proficiency %: "));
    skills.push({ name, icon, percent: percent || 70 });
    saveJSON("skills.json", skills);
    console.log("\n\x1b[32m✓ Skill added.\x1b[0m");
  } else if (action === "3") {
    skills.forEach((s, i) => {
      console.log(`  ${i + 1}) ${s.name} (${s.percent}%)`);
    });
    const idx = parseInt(await ask(rl, "  Which skill? ")) - 1;
    if (idx >= 0 && idx < skills.length) {
      const s = skills[idx];
      const name = await ask(rl, `  Name [${s.name}]: `);
      if (name) s.name = name;
      const percent = await ask(rl, `  Percent [${s.percent}]: `);
      if (percent) s.percent = parseInt(percent);
      saveJSON("skills.json", skills);
      console.log("\n\x1b[32m✓ Skill updated.\x1b[0m");
    }
  } else if (action === "4") {
    skills.forEach((s, i) => {
      console.log(`  ${i + 1}) ${s.name}`);
    });
    const idx = parseInt(await ask(rl, "  Which skill? ")) - 1;
    if (idx >= 0 && idx < skills.length) {
      skills.splice(idx, 1);
      saveJSON("skills.json", skills);
      console.log("\n\x1b[32m✓ Skill deleted.\x1b[0m");
    }
  }
}

function rebuildSite() {
  console.log("\n\x1b[33mRebuilding site...\x1b[0m");
  try {
    execSync("npm run build", { cwd: ROOT, stdio: "inherit" });
    console.log("\n\x1b[32m✓ Site built. Output in ./out/\x1b[0m");
  } catch {
    console.error("\n\x1b[31m✗ Build failed.\x1b[0m");
  }
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let running = true;
  while (running) {
    menu();
    const choice = await ask(rl, "  Select: ");

    switch (choice) {
      case "1":
        await editProfile(rl);
        break;
      case "2":
        await manageProjects(rl);
        break;
      case "3":
        await manageSkills(rl);
        break;
      case "4":
        rebuildSite();
        break;
      case "5":
        running = false;
        break;
    }
  }

  rl.close();
  console.log("\n\x1b[32mDone. Run 'npm run build' to rebuild.\x1b[0m\n");
}

main();
