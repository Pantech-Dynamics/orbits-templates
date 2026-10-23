import { signOut, useUser } from "./auth";
import { Link } from "./link";
import { usePath } from "./router";
import { Customers } from "./pages/Customers";
import { Login } from "./pages/Login";
import { Orders } from "./pages/Orders";
import { Overview } from "./pages/Overview";

const PAGES: Record<string, { title: string; page: () => React.JSX.Element }> = {
  "/": { title: "Overview", page: Overview },
  "/orders": { title: "Orders", page: Orders },
  "/customers": { title: "Customers", page: Customers },
};

export default function App() {
  const user = useUser();
  const path = usePath();
  if (!user) return <Login />;

  const Page = PAGES[path]?.page;
  return (
    <div className="layout">
      <aside className="side">
        <div className="brand">
          <span className="logo" aria-hidden /> Dashboard
        </div>
        <nav>
          {Object.entries(PAGES).map(([href, { title }]) => (
            <Link key={href} href={href}>
              {title}
            </Link>
          ))}
        </nav>
        <div className="me">
          <span>{user.email}</span>
          <button onClick={signOut}>Sign out</button>
        </div>
      </aside>
      <main className="content">
        {Page ? (
          <Page />
        ) : (
          <div className="none">
            <h1>Not found</h1>
            <Link href="/">Back to the overview</Link>
          </div>
        )}
      </main>
    </div>
  );
}
