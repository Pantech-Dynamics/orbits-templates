import { useState, type CSSProperties } from "react";
import { AreaChart, BarList, Spark } from "../components/charts";
import { Badge } from "../components/badge";
import { PageHeader, Segmented } from "../components/header";
import { customers, dailyRevenue, naira, orders, shortDate, statusCounts } from "../data";
import { Link } from "../link";

const RANGES = [
  { value: 7, label: "7 days" },
  { value: 30, label: "30 days" },
  { value: 90, label: "90 days" },
];

/** Splits a list of days into `n` runs and adds each one up, for the stat cards' small bars. */
function buckets(values: number[], n = 7) {
  const runs = Math.min(n, values.length);
  const at = (i: number) => Math.floor((i * values.length) / runs);
  return Array.from({ length: runs }, (_, i) => values.slice(at(i), at(i + 1)).reduce((s, v) => s + v, 0));
}

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

export function Overview() {
  const [days, setDays] = useState(30);
  const revenue = dailyRevenue(days);
  const total = revenue.reduce((sum, d) => sum + d.total, 0);
  const previous = dailyRevenue(days * 2).slice(0, days).reduce((sum, d) => sum + d.total, 0);
  const change = previous ? Math.round(((total - previous) / previous) * 100) : 0;
  const counts = statusCounts();
  const paid = orders.filter((o) => o.status === "paid");
  const top = [...customers].sort((a, b) => b.spent - a.spent).slice(0, 5);
  const perDay = new Map<string, number>();
  for (const o of orders) perDay.set(o.date.slice(0, 10), (perDay.get(o.date.slice(0, 10)) ?? 0) + 1);

  return (
    <>
      <PageHeader
        title="Overview"
        facts={
          <>
            <span className="badge plain">{orders.length} orders</span>
            <span className="badge plain">{customers.length} customers</span>
            <span className="badge plain">NGN</span>
          </>
        }
      >
        <Segmented label="Range" value={days} onChange={setDays} options={RANGES} />
      </PageHeader>

      <section className="kpis">
        <article className="panel kpi reveal" style={delay(40)}>
          <p className="label">Revenue, {days} days</p>
          <strong>{naira.format(total)}</strong>
          <span className={change >= 0 ? "up" : "down"}>
            {change >= 0 ? "▲" : "▼"} {Math.abs(change)}% on the {days} days before
          </span>
          <Spark values={buckets(revenue.map((d) => d.total))} />
        </article>
        <article className="panel kpi reveal" style={delay(80)}>
          <p className="label">Orders</p>
          <strong>{orders.length}</strong>
          <span className="warn">{counts.pending} waiting for payment</span>
          <Spark values={buckets(revenue.map((d) => perDay.get(d.day) ?? 0))} />
        </article>
        <article className="panel kpi reveal" style={delay(120)}>
          <p className="label">Average order</p>
          <strong>{naira.format(paid.reduce((s, o) => s + o.amount, 0) / Math.max(paid.length, 1))}</strong>
          <span>across {paid.length} paid orders</span>
        </article>
        <article className="panel kpi reveal" style={delay(160)}>
          <p className="label">Customers</p>
          <strong>{customers.length}</strong>
          <span>{customers.filter((c) => c.orders > 0).length} have paid</span>
        </article>
      </section>

      <section className="panels">
        <article className="panel wide reveal" style={delay(200)}>
          <div className="panel-head">
            <h2>Revenue per day</h2>
          </div>
          <div className="pad">
            <AreaChart data={revenue.map((d) => ({ label: shortDate.format(new Date(d.day)), value: d.total }))} format={naira.format} />
          </div>
        </article>
        <article className="panel reveal" style={delay(240)}>
          <div className="panel-head">
            <h2>Orders by status</h2>
            <Link href="/orders">View all</Link>
          </div>
          <div className="pad">
            <BarList
              items={[
                { label: "Paid", value: counts.paid, tone: "good" },
                { label: "Pending", value: counts.pending, tone: "warn" },
                { label: "Refunded", value: counts.refunded, tone: "quiet" },
                { label: "Failed", value: counts.failed, tone: "bad" },
              ]}
            />
          </div>
        </article>
        <article className="panel reveal" style={delay(280)}>
          <div className="panel-head">
            <h2>Top customers</h2>
            <Link href="/customers">View all</Link>
          </div>
          <div className="pad">
            <BarList items={top.map((c) => ({ label: c.name, value: c.spent }))} format={naira.format} />
          </div>
        </article>
        <article className="panel wide reveal" style={delay(320)}>
          <div className="panel-head">
            <h2>Latest orders</h2>
            <Link href="/orders">View all</Link>
          </div>
          <ul className="latest">
            {orders.slice(0, 5).map((o) => (
              <li key={o.id} className="hoverable">
                <span className="tile">{o.customer.split(" ").map((p) => p[0]).join("")}</span>
                <span className="who-line">
                  <strong>{o.customer}</strong>
                  <small className="mono">
                    {o.id} · {shortDate.format(new Date(o.date))}
                  </small>
                </span>
                <Badge status={o.status} />
                <span className="amount num">{naira.format(o.amount)}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </>
  );
}
