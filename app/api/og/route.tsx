import { ImageResponse } from "next/og";
import { getProfile, getRoles } from "@/lib/db";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const [profile, roles] = await Promise.all([getProfile(), getRoles()]);

  const inter = fetch(
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap"
  ).then((r) => r.arrayBuffer());

  const jetbrains = fetch(
    "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap"
  ).then((r) => r.arrayBuffer());

  const roleText = roles?.length ? roles.map((r) => r.title).join(" // ") : "Full Stack Developer";
  const name = profile?.name || "Sayed Atiqur Rahman";
  const tagline = profile?.tagline || "";
  const bio = profile?.bio || "";
  const imgSrc = profile?.profileImage || "https://images.pexels.com/photos/38513711/pexels-photo-38513711.jpeg?w=400&h=400&fit=crop";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0b1326",
          fontFamily: '"Inter"',
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(74,225,118,0.08) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Scanlines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.15) 50%)",
            backgroundSize: "100% 4px",
          }}
        />

        {/* Terminal border */}
        <div
          style={{
            position: "absolute",
            inset: "32px",
            border: "1px solid rgba(75,226,119,0.25)",
            borderRadius: "8px",
            background: "rgba(23,31,51,0.85)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Terminal header */}
          <div
            style={{
              height: "36px",
              background: "rgba(45,52,73,0.8)",
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              gap: "8px",
              borderBottom: "1px solid rgba(75,226,119,0.15)",
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f56" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#27c93f" }} />
            <span
              style={{
                color: "rgba(218,226,253,0.5)",
                fontSize: 13,
                fontFamily: '"JetBrains Mono"',
                marginLeft: 12,
              }}
            >
              {profile?.terminalUser || "sayed@atiqur"}: ~/portfolio
            </span>
          </div>

          {/* Content */}
          <div
            style={{
              flex: 1,
              display: "flex",
              padding: "40px 48px",
              gap: 48,
              alignItems: "center",
            }}
          >
            {/* Profile image */}
            {imgSrc && (
                <div
                  style={{
                    width: 220,
                    height: 220,
                    borderRadius: "50%",
                    border: "3px solid rgba(75,226,119,0.35)",
                    display: "flex",
                    overflow: "hidden",
                    flexShrink: 0,
                    filter: "grayscale(0.4) contrast(1.15)",
                  }}
                >
                  <img
                    src={imgSrc}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
            )}

            {/* Info */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                flex: 1,
              }}
            >
              <span
                style={{
                  color: "#4ae176",
                  fontSize: 14,
                  fontFamily: '"JetBrains Mono"',
                  fontWeight: 700,
                }}
              >
                {profile?.terminalUser || "sayed@atiqur"}
              </span>
              <div
                style={{
                  width: "100%",
                  height: 1,
                  background: "rgba(75,226,119,0.2)",
                  marginBottom: 4,
                }}
              />
              <span
                style={{
                  color: "#dae2fd",
                  fontSize: 42,
                  fontWeight: 900,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                {name}
              </span>
              <span
                style={{
                  color: "#4be277",
                  fontSize: 20,
                  fontFamily: '"JetBrains Mono"',
                  fontWeight: 700,
                }}
              >
                {roleText}
              </span>
              {tagline && (
                <span
                  style={{
                    color: "rgba(218,226,253,0.7)",
                    fontSize: 16,
                    lineHeight: 1.5,
                    marginTop: 4,
                  }}
                >
                  {tagline}
                </span>
              )}
              {bio && (
                <span
                  style={{
                    color: "rgba(218,226,253,0.5)",
                    fontSize: 13,
                    lineHeight: 1.4,
                    marginTop: 4,
                    maxWidth: 520,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap" as const,
                  }}
                >
                  {bio}
                </span>
              )}
              <span
                style={{
                  color: "rgba(75,226,119,0.4)",
                  fontSize: 13,
                  fontFamily: '"JetBrains Mono"',
                  marginTop: 8,
                }}
              >
                {`${profile?.terminalUser || "sayed@atiqur"}@portfolio:~$`} {"cat "}{name?.toLowerCase().replace(/\s+/g, "-")}.md
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Inter", data: await inter, style: "normal" },
        { name: '"JetBrains Mono"', data: await jetbrains, style: "normal" },
      ],
    }
  );
}
