import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projectBySlug, WORK } from "@/lib/work";
import { Cover } from "../../_components/cover";

export function generateStaticParams() {
  return WORK.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const project = projectBySlug((await params).slug);
  return project ? { title: project.title, description: project.summary } : {};
}

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

export default async function CaseStudy({ params }: PageProps<"/work/[slug]">) {
  const project = projectBySlug((await params).slug);
  if (!project) notFound();
  const index = WORK.indexOf(project);
  const next = WORK[(index + 1) % WORK.length];
  const facts = [
    ["Client", project.client],
    ["Year", project.year],
    ["Role", project.role],
    ["Outcome", project.outcome],
  ] as const;

  return (
    <main className="page study">
      <section className="panel study-head reveal">
        <Link href="/#work" className="back">
          ← All work
        </Link>
        <h1 className="title">{project.title}</h1>
        <p className="summary">{project.summary}</p>
      </section>
      <dl className="facts">
        {facts.map(([label, value], i) => (
          <div key={label} className="panel reveal" style={delay(40 + i * 40)}>
            <dt className="label">{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <div className="panel reveal" style={delay(200)}>
        <Cover project={project} large />
      </div>
      <article className="panel prose rise">
        {project.sections.map((s) => (
          <section key={s.heading}>
            <h2>{s.heading}</h2>
            {s.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>
        ))}
      </article>
      <Link href={`/work/${next.slug}`} className="panel next hoverable rise">
        <span className="label">Next project</span>
        <strong>{next.title} →</strong>
      </Link>
    </main>
  );
}
