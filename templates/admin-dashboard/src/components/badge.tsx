import type { Status } from "../data";

export function Badge({ status }: { status: Status }) {
  return <span className={`badge ${status}`}>{status[0].toUpperCase() + status.slice(1)}</span>;
}
