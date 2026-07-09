"use client";

export default function FAB() {
  return (
    <a
      className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50"
      href="#about"
    >
      <span className="material-symbols-outlined">mail</span>
    </a>
  );
}
