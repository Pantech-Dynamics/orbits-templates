import { useMemo, useState, type CSSProperties, type ReactNode } from "react";

export type Column<T> = {
  key: keyof T & string;
  label: string;
  render?: (row: T) => ReactNode;
  align?: "right";
};

const PAGE = 10;

/** A table that sorts on any column, searches every column and pages through the rows. */
export function DataTable<T extends { id: string }>({ rows, columns, filters }: { rows: T[]; columns: Column<T>[]; filters?: ReactNode }) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<{ key: keyof T; dir: 1 | -1 } | null>(null);
  const [page, setPage] = useState(0);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const found = needle ? rows.filter((r) => columns.some((c) => String(r[c.key]).toLowerCase().includes(needle))) : rows;
    if (!sort) return found;
    return [...found].sort((a, b) => {
      const [x, y] = [a[sort.key], b[sort.key]];
      return (typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y))) * sort.dir;
    });
  }, [rows, columns, q, sort]);

  const pages = Math.max(1, Math.ceil(shown.length / PAGE));
  const current = Math.min(page, pages - 1);
  const slice = shown.slice(current * PAGE, current * PAGE + PAGE);

  const toggle = (key: keyof T) => {
    setSort((s) => (s?.key !== key ? { key, dir: 1 } : s.dir === 1 ? { key, dir: -1 } : null));
    setPage(0);
  };

  return (
    <section className="panel table-card reveal" style={{ "--delay": "40ms" } as CSSProperties}>
      <div className="table-tools">
        <input
          className="input"
          type="search"
          placeholder="Search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(0);
          }}
          aria-label="Search"
        />
        {filters}
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key} className={c.align} aria-sort={sort?.key === c.key ? (sort.dir === 1 ? "ascending" : "descending") : undefined}>
                  <button onClick={() => toggle(c.key)}>
                    {c.label}
                    <span className="sort">{sort?.key === c.key ? (sort.dir === 1 ? "↑" : "↓") : ""}</span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.map((row) => (
              <tr key={row.id} className="hoverable">
                {columns.map((c) => (
                  <td key={c.key} className={c.align}>
                    {c.render ? c.render(row) : String(row[c.key])}
                  </td>
                ))}
              </tr>
            ))}
            {!slice.length && (
              <tr>
                <td colSpan={columns.length} className="nothing hatch">
                  Nothing matches.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="pager">
        <span className="mono">
          {shown.length ? `${current * PAGE + 1}–${current * PAGE + slice.length} of ${shown.length}` : "0 results"}
        </span>
        <button className="btn btn-sm" disabled={current === 0} onClick={() => setPage(current - 1)}>
          Previous
        </button>
        <button className="btn btn-sm" disabled={current >= pages - 1} onClick={() => setPage(current + 1)}>
          Next
        </button>
      </div>
    </section>
  );
}
