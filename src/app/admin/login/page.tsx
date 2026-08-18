"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const [error, setError] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setResetMessage("");
    setLoading(true);

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        setError(loginError.message);
        return;
      }

      if (!data.user) {
        setError("Login failed. User account not found.");
        return;
      }

      const { data: adminUser, error: adminError } = await supabase
        .from("admin_users")
        .select("user_id, email")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (adminError) {
        await supabase.auth.signOut();
        setError("Admin verification failed.");
        return;
      }

      if (!adminUser) {
        await supabase.auth.signOut();
        setError("This account is not authorized as an admin.");
        return;
      }

      router.replace("/admin/products");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    setError("");
    setResetMessage("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your admin email first.");
      return;
    }

    setResetLoading(true);

    try {
      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(trimmedEmail, {
          redirectTo: `${window.location.origin}/admin/reset-password`,
        });

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setResetMessage(
        "Password reset email sent. Please check your inbox and open the latest reset email."
      );
    } catch {
      setError(
        "Unable to send password reset email. Please try again later."
      );
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#ffffff",
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "32px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            margin: "0 0 8px",
            fontSize: "28px",
            fontWeight: 700,
          }}
        >
          ClassyCrafth Admin
        </h1>

        <p
          style={{
            margin: "0 0 28px",
            color: "#666",
          }}
        >
          Sign in to manage products.
        </p>

        <form onSubmit={handleLogin}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: 600,
            }}
          >
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@example.com"
            required
            autoComplete="email"
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              marginBottom: "18px",
              fontSize: "15px",
              boxSizing: "border-box",
            }}
          />

          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: 600,
            }}
          >
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
            required
            autoComplete="current-password"
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              marginBottom: "8px",
              fontSize: "15px",
              boxSizing: "border-box",
            }}
          />

          <div
            style={{
              textAlign: "right",
              marginBottom: "18px",
            }}
          >
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={resetLoading}
              style={{
                border: "none",
                background: "transparent",
                color: "#1d4ed8",
                padding: 0,
                fontSize: "14px",
                cursor: resetLoading ? "not-allowed" : "pointer",
                textDecoration: "underline",
              }}
            >
              {resetLoading
                ? "Sending reset email..."
                : "Forgot Password?"}
            </button>
          </div>

          {error && (
            <div
              style={{
                background: "#fff1f1",
                color: "#c62828",
                border: "1px solid #ffcaca",
                borderRadius: "8px",
                padding: "12px",
                marginBottom: "18px",
                fontSize: "14px",
                lineHeight: 1.5,
              }}
            >
              {error}
            </div>
          )}

          {resetMessage && (
            <div
              style={{
                background: "#f0fff4",
                color: "#176b35",
                border: "1px solid #b7ebc6",
                borderRadius: "8px",
                padding: "12px",
                marginBottom: "18px",
                fontSize: "14px",
                lineHeight: 1.5,
              }}
            >
              {resetMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              background: "#000",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}