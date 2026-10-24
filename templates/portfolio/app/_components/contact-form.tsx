"use client";

import { useActionState } from "react";
import { sendMessage, type ContactState } from "../actions";

export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendMessage, null);

  if (state?.ok) {
    return (
      <p className="sent" role="status">
        {state.message}
      </p>
    );
  }

  return (
    <form action={action} className="contact">
      <div className="row">
        <label className="field">
          Name
          <input className="input" name="name" autoComplete="name" required defaultValue={state?.fields?.name} />
        </label>
        <label className="field">
          Email
          <input className="input" name="email" type="email" autoComplete="email" required defaultValue={state?.fields?.email} />
        </label>
      </div>
      <label className="field">
        What are you working on?
        <textarea className="input" name="message" rows={5} required defaultValue={state?.fields?.message} />
      </label>
      <input className="trap" name="company" tabIndex={-1} autoComplete="off" aria-hidden />
      {state && !state.ok && (
        <p className="error" role="alert">
          {state.message}
        </p>
      )}
      <button className="btn btn-primary btn-lg" disabled={pending}>
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
