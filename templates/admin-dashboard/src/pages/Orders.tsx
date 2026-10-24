import { useState } from "react";
import { Badge } from "../components/badge";
import { PageHeader, Segmented } from "../components/header";
import { DataTable } from "../components/table";
import { naira, orders, shortDate, statusCounts, type Order, type Status } from "../data";

const STATUSES: (Status | "all")[] = ["all", "paid", "pending", "refunded", "failed"];

export function Orders() {
  const [status, setStatus] = useState<Status | "all">("all");
  const rows = status === "all" ? orders : orders.filter((o) => o.status === status);
  const counts = statusCounts();

  return (
    <>
      <PageHeader
        title="Orders"
        facts={
          <>
            <span className="badge plain">{orders.length} orders</span>
            <span className="badge amber">{counts.pending} waiting for payment</span>
          </>
        }
      />
      <DataTable<Order>
        key={status}
        rows={rows}
        filters={
          <Segmented
            label="Status"
            value={status}
            onChange={setStatus}
            options={STATUSES.map((s) => ({ value: s, label: s === "all" ? "All" : s[0].toUpperCase() + s.slice(1) }))}
          />
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
