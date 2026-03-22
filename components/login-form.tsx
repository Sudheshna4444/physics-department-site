"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type LoginFormProps = {
  adminEmail: string;
  adminUsername: string;
};

export function LoginForm({ adminEmail, adminUsername }: LoginFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState(adminUsername);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      if (username.trim() !== adminUsername.trim()) {
        throw new Error("Incorrect username.");
      }

      const client = createSupabaseBrowserClient();
      const { error: signInError } = await client.auth.signInWithPassword({
        email: adminEmail,
        password
      });

      if (signInError) {
        throw signInError;
      }

      router.push("/admin");
      router.refresh();
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Login failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-shell glass">
      <div className="section-header">
        <div>
          <h2>Login</h2>
        </div>
        <p>Access the dashboard to manage department updates and uploads.</p>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Username"
          required
        />
        <input
          className="input"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          required
        />
        <button className="button primary" disabled={busy} type="submit">
          <ShieldCheck size={16} />
          {busy ? "Checking..." : "Login to Dashboard"}
        </button>
      </form>

      {error ? <div className="status error" style={{ marginTop: 16 }}>{error}</div> : null}
    </div>
  );
}
