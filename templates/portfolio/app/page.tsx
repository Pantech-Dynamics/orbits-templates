import type { CSSProperties } from "react";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { WORK } from "@/lib/work";
import { ContactForm } from "./_components/contact-form";
import { Cover } from "./_components/cover";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

export default function Home() {
  return (
    <main className="page">
      <section className="panel hero">
        <p className="eyebrow reveal">
          <span className="badge green">Available for new work</span>
          {SITE.role}
        </p>
        <h1 className="title reveal" style={delay(40)}>
          {SITE.intro}
        </h1>
        <div className="actions reveal" style={delay(80)}>
          <Link href="/#work" className="btn btn-primary btn-lg">
            See the work
          </Link>
          <a href={`mailto:${SITE.email}`} className="btn btn-lg">
            {SITE.email}
          </a>
        </div>
      </section>

      <section id="work" className="work">
        <div className="section-head">
          <h2>Selected work</h2>
          <span className="badge plain">{WORK.length} case studies</span>
        </div>
        <div className="grid">
          {WORK.map((p, i) => (
            <Link key={p.slug} href={`/work/${p.slug}`} className="panel card reveal" style={delay(120 + i * 40)}>
              <Cover project={p} />
              <div className="card-text">
                <h3>{p.title}</h3>
                <p>{p.summary}</p>
                <small className="mono">
                  {p.client} · {p.year}
                </small>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="contact" className="panel contact-section rise">
        <div className="contact-copy">
          <h2 className="heading">Let&apos;s work together</h2>
          <p>
            Tell me about your project, or write to <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
          </p>
        </div>
        <ContactForm />
      </section>
    </main>
  );
}
