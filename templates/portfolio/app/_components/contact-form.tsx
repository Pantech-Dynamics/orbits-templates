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
        <label>
          Name
          <input name="name" autoComplete="name" required defaultValue={state?.fields?.name} />
        </label>
        <label>
          Email
          <input name="email" type="email" autoComplete="email" required defaultValue={state?.fields?.email} />
        </label>
      </div>
      <label>
        What are you working on?
        <textarea name="message" rows={5} required defaultValue={state?.fields?.message} />
      </label>
      <input className="trap" name="company" tabIndex={-1} autoComplete="off" aria-hidden />
      {state && !state.ok && (
        <p className="error" role="alert">
          {state.message}
        </p>
      )}
      <button disabled={pending}>{pending ? "Sending…" : "Send message"}</button>
    </form>
  );
}
