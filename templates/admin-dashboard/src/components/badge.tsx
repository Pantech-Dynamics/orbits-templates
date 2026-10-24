import type { Status } from "../data";

const TONE: Record<Status, string> = { paid: "green", pending: "amber", refunded: "", failed: "red" };

export function Badge({ status }: { status: Status }) {
  return <span className={`badge ${TONE[status]}`}>{status[0].toUpperCase() + status.slice(1)}</span>;
}
