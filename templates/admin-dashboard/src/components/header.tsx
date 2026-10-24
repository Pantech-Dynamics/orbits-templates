import type { ReactNode } from "react";

/** The panel at the top of a page: its title, a line of facts and, on the right, the page's controls. */
export function PageHeader({ title, facts, children }: { title: string; facts?: ReactNode; children?: ReactNode }) {
  return (
    <section className="panel page-head reveal">
      <div>
        <h1 className="heading">{title}</h1>
        {facts && <p className="facts">{facts}</p>}
      </div>
      {children}
    </section>
  );
}

export function Segmented<T extends string | number>({ value, options, onChange, label }: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div className="segmented" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={o.value === value} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
