"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";
import { FormError, SubmitButton } from "./FormBits";

export default function LoginForm() {
  const [state, action] = useActionState(loginAction, undefined);
  return (
    <form action={action} className="adm-login-form">
      <FormError state={state} />
      <label className="adm-field">
        <span className="adm-label">Email</span>
        <input type="email" name="email" autoComplete="username" required maxLength={200} autoFocus />
      </label>
      <label className="adm-field">
        <span className="adm-label">Password</span>
        <input type="password" name="password" autoComplete="current-password" required maxLength={500} />
      </label>
      <SubmitButton pendingText="Signing in…">Sign in</SubmitButton>
    </form>
  );
}
