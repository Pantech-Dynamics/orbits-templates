import type { Project } from "@/lib/work";

/** A cover made of the project's two colours. Swap in a <next/image> when you have screenshots. */
export function Cover({ project, large = false }: { project: Project; large?: boolean }) {
  const [deep, light] = project.colors;
  return (
    <div className={large ? "cover large" : "cover"} style={{ background: `linear-gradient(135deg, ${deep}, ${light})` }} aria-hidden>
      <span>{project.client}</span>
    </div>
  );
}
