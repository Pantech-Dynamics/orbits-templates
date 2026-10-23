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

export default async function CaseStudy({ params }: PageProps<"/work/[slug]">) {
  const project = projectBySlug((await params).slug);
  if (!project) notFound();
  const index = WORK.indexOf(project);
  const next = WORK[(index + 1) % WORK.length];

  return (
    <main className="study">
      <Link href="/#work" className="back">
        ← All work
      </Link>
      <h1>{project.title}</h1>
      <p className="summary">{project.summary}</p>
      <dl className="facts">
        <div>
          <dt>Client</dt>
          <dd>{project.client}</dd>
        </div>
        <div>
          <dt>Year</dt>
          <dd>{project.year}</dd>
        </div>
        <div>
          <dt>Role</dt>
          <dd>{project.role}</dd>
        </div>
        <div>
          <dt>Outcome</dt>
          <dd>{project.outcome}</dd>
        </div>
      </dl>
      <Cover project={project} large />
      {project.sections.map((s) => (
        <section key={s.heading}>
          <h2>{s.heading}</h2>
          {s.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </section>
      ))}
      <Link href={`/work/${next.slug}`} className="next">
        <small>Next project</small>
        {next.title} →
      </Link>
    </main>
  );
}
