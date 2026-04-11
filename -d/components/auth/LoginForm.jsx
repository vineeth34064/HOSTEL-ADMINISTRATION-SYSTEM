import React, { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";

const LoginForm = ({ authError, onSubmit, onToggleMode }) => {
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = data.get("email");
    if (email) {
      setIsLoading(true);
      try {
        const { forgotPassword } = await import("../../services/api");
        const res = await forgotPassword(email);
        setResetMessage(res.message || `Password reset link sent to ${email}`);
      } catch (err) {
        setResetMessage(err.message || "Failed to send reset link");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="hms-auth-wrap">
      <div className="hms-auth-card">
        <div className="hms-auth-logo">
          <div className="hms-auth-logo-icon">
            <svg viewBox="0 0 20 20">
              <path d="M10 2L2 7v11h5v-5h6v5h5V7L10 2z" />
            </svg>
          </div>
          <div className="hms-auth-title">
            IIIT<span style={{ color: "var(--gold)" }}>HMS</span>
          </div>
          <div className="hms-auth-sub">
            {isForgotPassword
              ? "Reset your password"
              : "Welcome back — sign in to your account"}
          </div>
        </div>

        {isForgotPassword ? (
          <form className="hms-auth-form" onSubmit={handleResetSubmit}>
            <div className="hms-form-row">
              <label className="hms-label">Email address</label>
              <Input
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@college.ac.in"
              />
            </div>

            {resetMessage && (
              <div
                style={{
                  background: "rgba(52, 211, 153, 0.08)",
                  border: "1px solid rgba(52, 211, 153, 0.2)",
                  borderRadius: "6px",
                  padding: "8px 12px",
                  fontSize: "12px",
                  color: "var(--green)",
                  marginBottom: "1rem",
                }}
              >
                {resetMessage}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              style={{ justifyContent: "center" }}
            >
              Send Reset Link
            </Button>

            <div className="hms-auth-toggle" style={{ marginTop: "1.5rem" }}>
              Remember your password?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(false);
                  setResetMessage("");
                }}
              >
                Back to login
              </button>
            </div>
          </form>
        ) : (
          <>
            <form className="hms-auth-form" onSubmit={onSubmit}>
              <div className="hms-form-row">
                <label className="hms-label">Email address</label>
                <Input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@college.ac.in"
                />
              </div>
              <div className="hms-form-row">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.4rem",
                  }}
                >
                  <label className="hms-label" style={{ margin: 0 }}>
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "11px",
                      color: "var(--gold)",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
                <Input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                />
              </div>
              {authError && (
                <div
                  style={{
                    background: "rgba(201,64,64,0.08)",
                    border: "1px solid rgba(201,64,64,0.2)",
                    borderRadius: "6px",
                    padding: "8px 12px",
                    fontSize: "12px",
                    color: "var(--red)",
                  }}
                >
                  {authError}
                </div>
              )}
              <Button
                type="submit"
                className="w-full"
                style={{ justifyContent: "center" }}
              >
                Sign In
              </Button>
            </form>

            <div className="hms-auth-toggle">
              Don't have an account?{" "}
              <button onClick={onToggleMode}>Register here</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
