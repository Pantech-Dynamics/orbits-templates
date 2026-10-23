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
      <form onSubmit={submit} className="login-card">
        <div className="logo" aria-hidden />
        <h1>Sign in</h1>
        <p className="muted">to the dashboard</p>
        <label>
          Email
          <input name="email" type="email" autoComplete="username" defaultValue={DEMO.email} required />
        </label>
        <label>
          Password
          <input name="password" type="password" autoComplete="current-password" required />
        </label>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button className="primary" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </button>
        <p className="hint">
          Demo account: <code>{DEMO.email}</code> / <code>{DEMO.password}</code>
        </p>
      </form>
    </main>
  );
}
