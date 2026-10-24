import { PageHeader } from "../components/header";
import { DataTable } from "../components/table";
import { customers, naira, shortDate, type Customer } from "../data";

export function Customers() {
  const paying = customers.filter((c) => c.orders > 0).length;
  return (
    <>
      <PageHeader
        title="Customers"
        facts={
          <>
            <span className="badge plain">{customers.length} customers</span>
            <span className="badge green">{paying} have paid</span>
          </>
        }
      />
      <DataTable<Customer>
        rows={customers}
        columns={[
          {
            key: "name",
            label: "Name",
            render: (c) => (
              <span className="who">
                <span className="tile">{c.name.split(" ").map((p) => p[0]).join("")}</span>
                <span>
                  <strong>{c.name}</strong>
                  <small>{c.email}</small>
                </span>
              </span>
            ),
          },
          { key: "city", label: "City" },
          { key: "joined", label: "Joined", render: (c) => shortDate.format(new Date(c.joined)) },
          { key: "orders", label: "Paid orders", align: "right" },
          { key: "spent", label: "Spent", align: "right", render: (c) => naira.format(c.spent) },
        ]}
      />
    </>
  );
}
