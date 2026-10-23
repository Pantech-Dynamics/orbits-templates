import { AreaChart, BarList } from "../components/charts";
import { Badge } from "../components/badge";
import { customers, dailyRevenue, naira, orders, shortDate, statusCounts } from "../data";
import { Link } from "../link";

export function Overview() {
  const revenue = dailyRevenue(30);
  const total = revenue.reduce((sum, d) => sum + d.total, 0);
  const previous = dailyRevenue(60).slice(0, 30).reduce((sum, d) => sum + d.total, 0);
  const change = previous ? Math.round(((total - previous) / previous) * 100) : 0;
  const counts = statusCounts();
  const paid = orders.filter((o) => o.status === "paid");
  const top = [...customers].sort((a, b) => b.spent - a.spent).slice(0, 5);

  return (
    <>
      <h1>Overview</h1>
      <section className="kpis">
        <article>
          <p>Revenue, 30 days</p>
          <strong>{naira.format(total)}</strong>
          <span className={change >= 0 ? "up" : "down"}>
            {change >= 0 ? "▲" : "▼"} {Math.abs(change)}% on the 30 days before
          </span>
        </article>
        <article>
          <p>Orders</p>
          <strong>{orders.length}</strong>
          <span>{counts.pending} waiting for payment</span>
        </article>
        <article>
          <p>Average order</p>
          <strong>{naira.format(paid.reduce((s, o) => s + o.amount, 0) / Math.max(paid.length, 1))}</strong>
          <span>across {paid.length} paid orders</span>
        </article>
        <article>
          <p>Customers</p>
          <strong>{customers.length}</strong>
          <span>{customers.filter((c) => c.orders > 0).length} have paid</span>
        </article>
      </section>

      <section className="panels">
        <article className="panel wide">
          <h2>Revenue per day</h2>
          <AreaChart data={revenue.map((d) => ({ label: shortDate.format(new Date(d.day)), value: d.total }))} format={naira.format} />
        </article>
        <article className="panel">
          <h2>Orders by status</h2>
          <BarList
            items={[
              { label: "Paid", value: counts.paid, tone: "good" },
              { label: "Pending", value: counts.pending, tone: "warn" },
              { label: "Refunded", value: counts.refunded },
              { label: "Failed", value: counts.failed, tone: "bad" },
            ]}
          />
        </article>
        <article className="panel">
          <h2>Top customers</h2>
          <BarList items={top.map((c) => ({ label: c.name, value: c.spent }))} format={naira.format} />
        </article>
        <article className="panel wide">
          <div className="panel-head">
            <h2>Latest orders</h2>
            <Link href="/orders">View all</Link>
          </div>
          <ul className="latest">
            {orders.slice(0, 5).map((o) => (
              <li key={o.id}>
                <span>
                  <strong>{o.customer}</strong>
                  <small>
                    {o.id} · {shortDate.format(new Date(o.date))}
                  </small>
                </span>
                <Badge status={o.status} />
                <span className="amount">{naira.format(o.amount)}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </>
  );
}
