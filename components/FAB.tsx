"use client";

import { usePathname } from "next/navigation";

export default function FAB() {
  const pathname = usePathname();

  if (pathname === "/terminal") return null;

  return (
    <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-50">
      <a
        className="w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
        href="/terminal"
        aria-label="Open interactive terminal"
      >
        <span className="material-symbols-outlined">terminal</span>
      </a>
      <a
        className="w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
        href={pathname === "/" ? "#contact" : "/#contact"}
        aria-label="Contact section"
      >
        <span className="material-symbols-outlined">mail</span>
      </a>
    </div>
  );
}
