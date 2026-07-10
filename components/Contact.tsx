"use client";

import { useState } from "react";

const CONTACT_INFO = [
  { icon: "chat", label: "WhatsApp", value: "+880 1625-625032", href: "https://wa.me/8801625625032" },
  { icon: "mail", label: "Email", value: "s.atiqurrahman2003@gmail.com", href: "mailto:s.atiqurrahman2003@gmail.com" },
  { icon: "location_on", label: "Location", value: "Dhaka, Bangladesh", href: null },
  { icon: "schedule", label: "Availability", value: "Open for opportunities", href: null },
];

export default function Contact({ email: profileEmail }: { email?: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const contactInfo = CONTACT_INFO.map((item) =>
    item.label === "Email" && profileEmail
      ? { ...item, value: profileEmail, href: `mailto:${profileEmail}` }
      : item
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `*New Contact Message*\n\n*Name:* ${name}\n*Email:* ${email}\n\n*Message:*\n${message}`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/8801625625032?text=${encoded}`, "_blank");
  };

  return (
    <section className="max-w-container-max mx-auto px-6 py-section-padding" id="contact">
      <h2 className="font-headline-md text-headline-md text-primary mb-8">
        ./contact --init
      </h2>
      <div className="grid md:grid-cols-2 gap-12 items-stretch">
        {/* Contact Info */}
        <div className="flex flex-col gap-6">
          <p className="text-on-surface-variant leading-relaxed">
            Feel free to reach out. I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
          </p>
          <div className="space-y-4 flex-1">
            {contactInfo.map((item) => (
              <div key={item.label} className="flex items-center gap-4 bg-surface-container p-4 rounded-lg border border-outline-variant/20">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-xl">{item.icon}</span>
                </div>
                <div>
                  <p className="text-label-caps text-on-surface-variant text-xs">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-on-surface font-code-sm hover:text-primary transition-colors">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-on-surface font-code-sm">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-surface-container p-8 rounded-xl border border-outline-variant/20 flex flex-col">
          <div className="space-y-2">
            <label className="font-label-caps text-on-surface-variant" htmlFor="name">Identifier</label>
            <input
              className="w-full bg-background border border-outline-variant/30 rounded p-3 focus:border-primary focus:ring-0 outline-none transition-all font-code-sm"
              id="name"
              placeholder="Your Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="font-label-caps text-on-surface-variant" htmlFor="email">Destination</label>
            <input
              className="w-full bg-background border border-outline-variant/30 rounded p-3 focus:border-primary focus:ring-0 outline-none transition-all font-code-sm"
              id="email"
              placeholder="email@address.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2 flex-1 flex flex-col">
            <label className="font-label-caps text-on-surface-variant" htmlFor="message">Payload</label>
            <textarea
              className="w-full bg-background border border-outline-variant/30 rounded p-3 focus:border-primary focus:ring-0 outline-none transition-all font-code-sm flex-1 min-h-32"
              id="message"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          <button className="w-full py-4 bg-primary text-on-primary font-bold rounded hover:bg-primary-fixed transition-colors flex items-center justify-center gap-2" type="submit">
            <span className="material-symbols-outlined">send</span>
            TRANSMIT DATA
          </button>
        </form>
      </div>
    </section>
  );
}
