import { useState } from "react";
import { Badge } from "../components/badge";
import { DataTable } from "../components/table";
import { naira, orders, shortDate, type Order, type Status } from "../data";

const STATUSES: (Status | "all")[] = ["all", "paid", "pending", "refunded", "failed"];

export function Orders() {
  const [status, setStatus] = useState<Status | "all">("all");
  const rows = status === "all" ? orders : orders.filter((o) => o.status === status);

  return (
    <>
      <h1>Orders</h1>
      <DataTable<Order>
        key={status}
        rows={rows}
        filters={
          <select value={status} onChange={(e) => setStatus(e.target.value as Status | "all")} aria-label="Status">
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All statuses" : s[0].toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        }
        columns={[
          { key: "id", label: "Order", render: (o) => <code>{o.id}</code> },
          { key: "customer", label: "Customer" },
          { key: "date", label: "Date", render: (o) => shortDate.format(new Date(o.date)) },
          { key: "status", label: "Status", render: (o) => <Badge status={o.status} /> },
          { key: "amount", label: "Amount", align: "right", render: (o) => naira.format(o.amount) },
        ]}
      />
    </>
  );
}
