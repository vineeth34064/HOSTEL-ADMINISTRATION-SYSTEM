import React, { useState, useEffect } from "react";
import * as api from "./services/api";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import AdminPortal from "./components/admin/AdminPortal";
import StudentPortal from "./components/student/StudentPortal";
import AIChatbot from "./components/common/AIChatbot";

const App = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authMode, setAuthMode] = useState("login");
  const [authError, setAuthError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return (
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  useEffect(() => {
    api.getSession().then((sessionUser) => {
      if (sessionUser) setUser(sessionUser);
      setIsLoading(false);
    });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    const form = e.currentTarget;
    const email = form.elements.namedItem("email").value;
    const password = form.elements.namedItem("password").value;
    try {
      const loggedInUser = await api.login(email, password);
      setUser(loggedInUser);
    } catch (err) {
      setAuthError(
        err.message || "Login failed. Please check your credentials.",
      );
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError("");
    const form = e.currentTarget;
    const name = form.elements.namedItem("name").value;
    const email = form.elements.namedItem("email").value;
    const password = form.elements.namedItem("password").value;
    const rollNumber = form.elements.namedItem("rollNumber").value;
    const contactNumber = form.elements.namedItem("contactNumber").value;
    try {
      const newUser = await api.register(
        name,
        email,
        password,
        rollNumber || undefined,
        contactNumber || undefined,
      );
      setUser(newUser);
    } catch (err) {
      setAuthError(err.message || "Registration failed. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch {
      // ignore — cookie may already be cleared
    }
    setUser(null);
    setAuthError("");
  };

  const toggleAuthMode = () => {
    setAuthMode((prev) => (prev === "login" ? "register" : "login"));
    setAuthError("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white text-xl animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) {
    const path = window.location.pathname;
    if (path.startsWith("/reset-password/")) {
      const token = path.split("/reset-password/")[1];
      const searchParams = new URLSearchParams(window.location.search);
      const email = searchParams.get("email") || "";
      const ResetPassword = require("./components/auth/ResetPassword").default;
      return (
        <ResetPassword
          email={email}
          token={token}
          onSuccess={() => {
            window.history.pushState({}, "", "/");
            setAuthMode("login");
          }}
        />
      );
    }

    return authMode === "login" ? (
      <LoginForm
        authError={authError}
        onSubmit={handleLogin}
        onToggleMode={toggleAuthMode}
      />
    ) : (
      <RegisterForm
        authError={authError}
        onSubmit={handleRegister}
        onToggleMode={toggleAuthMode}
      />
    );
  }

  return (
    <div className="w-full font-sans transition-colors duration-300">
      {user.role === "admin" ? (
        <AdminPortal
          user={user}
          onLogout={handleLogout}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />
      ) : (
        <StudentPortal
          user={user}
          onLogout={handleLogout}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />
      )}
      <AIChatbot />
    </div>
  );
};

export default App;
