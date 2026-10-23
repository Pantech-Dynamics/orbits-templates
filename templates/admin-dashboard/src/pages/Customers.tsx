import { DataTable } from "../components/table";
import { customers, naira, shortDate, type Customer } from "../data";

export function Customers() {
  return (
    <>
      <h1>Customers</h1>
      <DataTable<Customer>
        rows={customers}
        columns={[
          { key: "name", label: "Name", render: (c) => (
            <span className="who">
              <strong>{c.name}</strong>
              <small>{c.email}</small>
            </span>
          ) },
          { key: "city", label: "City" },
          { key: "joined", label: "Joined", render: (c) => shortDate.format(new Date(c.joined)) },
          { key: "orders", label: "Paid orders", align: "right" },
          { key: "spent", label: "Spent", align: "right", render: (c) => naira.format(c.spent) },
        ]}
      />
    </>
  );
}
