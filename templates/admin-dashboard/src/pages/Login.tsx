import { useState, type FormEvent } from "react";
import { DEMO, signIn } from "../auth";

export function Login() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setPending(true);
    setError(await signIn(String(form.get("email")), String(form.get("password"))));
    setPending(false);
  };

  return (
    <main className="login">
      <form onSubmit={submit} className="panel login-card reveal">
        <span className="tile solid big">D</span>
        <div>
          <h1 className="heading">Sign in</h1>
          <p className="muted">to the dashboard</p>
        </div>
        <label className="field">
          Email
          <input className="input" name="email" type="email" autoComplete="username" defaultValue={DEMO.email} required />
        </label>
        <label className="field">
          Password
          <input className="input" name="password" type="password" autoComplete="current-password" required />
        </label>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button className="btn btn-primary btn-lg" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </button>
        <p className="hint">
          Demo account: <code>{DEMO.email}</code> / <code>{DEMO.password}</code>
        </p>
      </form>
    </main>
  );
}
