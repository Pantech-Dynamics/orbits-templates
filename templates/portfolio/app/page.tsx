import Link from "next/link";
import { SITE } from "@/lib/site";
import { WORK } from "@/lib/work";
import { ContactForm } from "./_components/contact-form";
import { Cover } from "./_components/cover";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <p className="role">{SITE.role}</p>
        <h1>{SITE.intro}</h1>
      </section>

      <section id="work" className="work">
        <h2>Selected work</h2>
        <div className="grid">
          {WORK.map((p) => (
            <Link key={p.slug} href={`/work/${p.slug}`} className="card">
              <Cover project={p} />
              <div className="card-text">
                <h3>{p.title}</h3>
                <p>{p.summary}</p>
                <small>
                  {p.client} · {p.year}
                </small>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="contact" className="contact-section">
        <h2>Let&apos;s work together</h2>
        <p>
          Tell me about your project, or write to <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
        <ContactForm />
      </section>
    </main>
  );
}
