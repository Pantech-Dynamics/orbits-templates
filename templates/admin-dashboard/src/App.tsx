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
    <>
      <header className="top">
        <div className="top-row">
          <span className="brand">
            <span className="tile solid">D</span>
            Dashboard
          </span>
          <div className="me">
            <span className="tile">{user.name.slice(0, 2)}</span>
            <span className="email">{user.email}</span>
            <button className="btn btn-sm" onClick={signOut}>
              Sign out
            </button>
          </div>
        </div>
        <nav className="tabs">
          {Object.entries(PAGES).map(([href, { title }]) => (
            <Link key={href} href={href}>
              {title}
            </Link>
          ))}
        </nav>
      </header>
      <main className="content" key={path}>
        {Page ? (
          <Page />
        ) : (
          <div className="panel hatch none reveal">
            <span className="badge plain mono">404</span>
            <h1 className="heading">Not found</h1>
            <Link href="/" className="btn btn-primary">
              Back to the overview
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
