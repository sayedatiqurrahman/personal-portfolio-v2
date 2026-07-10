"use client";

export default function Contact() {
  return (
    <section className="max-w-container-max mx-auto px-6 py-section-padding" id="contact">
      <h2 className="font-headline-md text-headline-md text-primary mb-8">
        ./contact --init
      </h2>
      <form className="space-y-6 bg-surface-container p-8 rounded-xl border border-outline-variant/20 max-w-xl">
        <div className="space-y-2">
          <label className="font-label-caps text-on-surface-variant" htmlFor="name">Identifier</label>
          <input className="w-full bg-background border border-outline-variant/30 rounded p-3 focus:border-primary focus:ring-0 outline-none transition-all font-code-sm" id="name" placeholder="Your Name" type="text" />
        </div>
        <div className="space-y-2">
          <label className="font-label-caps text-on-surface-variant" htmlFor="email">Destination</label>
          <input className="w-full bg-background border border-outline-variant/30 rounded p-3 focus:border-primary focus:ring-0 outline-none transition-all font-code-sm" id="email" placeholder="email@address.com" type="email" />
        </div>
        <div className="space-y-2">
          <label className="font-label-caps text-on-surface-variant" htmlFor="message">Payload</label>
          <textarea className="w-full bg-background border border-outline-variant/30 rounded p-3 focus:border-primary focus:ring-0 outline-none transition-all font-code-sm h-32" id="message" placeholder="Type your message here..." />
        </div>
        <button className="w-full py-4 bg-primary text-on-primary font-bold rounded hover:bg-primary-fixed transition-colors flex items-center justify-center gap-2" type="submit">
          <span className="material-symbols-outlined">send</span>
          TRANSMIT DATA
        </button>
      </form>
    </section>
  );
}
