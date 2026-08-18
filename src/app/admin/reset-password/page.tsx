"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function checkRecoverySession() {
      try {
        const { data, error: sessionError } =
          await supabase.auth.getSession();

        if (!mounted) return;

        if (sessionError) {
          setError("Unable to verify password reset session.");
          setCheckingSession(false);
          return;
        }

        if (!data.session) {
          setError(
            "Password reset session is missing or has expired. Please request a new reset link."
          );
          setCheckingSession(false);
          return;
        }

        setCheckingSession(false);
      } catch {
        if (!mounted) return;

        setError(
          "Unable to verify password reset session. Please request a new reset link."
        );
        setCheckingSession(false);
      }
    }

    checkRecoverySession();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleResetPassword(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess(false);

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: updateError } =
        await supabase.auth.updateUser({
          password: newPassword,
        });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      if (!data.user) {
        setError("Password update failed. Please try again.");
        return;
      }

      setSuccess(true);

      await supabase.auth.signOut();

      setTimeout(() => {
        router.replace("/admin/login");
        router.refresh();
      }, 1500);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (checkingSession) {
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
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "32px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              margin: "0 0 10px",
              fontSize: "26px",
              fontWeight: 700,
            }}
          >
            ClassyCrafth Admin
          </h1>

          <p
            style={{
              margin: 0,
              color: "#666",
            }}
          >
            Verifying password reset link...
          </p>
        </div>
      </main>
    );
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
          Reset Password
        </h1>

        <p
          style={{
            margin: "0 0 28px",
            color: "#666",
          }}
        >
          Set a new password for your ClassyCrafth Admin account.
        </p>

        {success ? (
          <div
            style={{
              background: "#f0fff4",
              color: "#176b35",
              border: "1px solid #b7ebc6",
              borderRadius: "8px",
              padding: "14px",
              fontSize: "14px",
              lineHeight: 1.5,
            }}
          >
            Password updated successfully.
            <br />
            Redirecting to Admin Login...
          </div>
        ) : (
          <form onSubmit={handleResetPassword}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 600,
              }}
            >
              New Password
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(event) =>
                setNewPassword(event.target.value)
              }
              placeholder="Enter new password"
              required
              minLength={8}
              autoComplete="new-password"
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
              Confirm Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              placeholder="Confirm new password"
              required
              minLength={8}
              autoComplete="new-password"
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
              {loading
                ? "Updating Password..."
                : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}