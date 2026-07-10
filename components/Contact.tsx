"use client";

import { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

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
      <form onSubmit={handleSubmit} className="space-y-6 bg-surface-container p-8 rounded-xl border border-outline-variant/20 max-w-xl">
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
        <div className="space-y-2">
          <label className="font-label-caps text-on-surface-variant" htmlFor="message">Payload</label>
          <textarea
            className="w-full bg-background border border-outline-variant/30 rounded p-3 focus:border-primary focus:ring-0 outline-none transition-all font-code-sm h-32"
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
    </section>
  );
}
