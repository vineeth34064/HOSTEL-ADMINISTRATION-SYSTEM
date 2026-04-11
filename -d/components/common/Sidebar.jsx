import React, { useState } from "react";
import { LogOutIcon, SunIcon, MoonIcon } from "../Icons";

const MenuIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const CloseIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const HomeIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
    <path d="M10 2L2 7v11h5v-5h6v5h5V7L10 2z" />
  </svg>
);

const Sidebar = ({
  navItems,
  activeView,
  setActiveView,
  onLogout,
  user,
  isDarkMode,
  setIsDarkMode,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (id) => {
    setActiveView(id);
    setMobileOpen(false);
  };

  const SidebarContent = () => (
    <div className="hms-sidebar flex flex-col h-full">
      {/* Logo */}
      <div className="hms-sidebar-logo">
        <div className="hms-logo-icon">
          <HomeIcon />
        </div>
        <div className="hms-logo-name">
          IIIT<span>HMS</span>
        </div>
        {setIsDarkMode && (
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="hms-dark-toggle ml-auto"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <SunIcon className="h-4 w-4" />
            ) : (
              <MoonIcon className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* Nav */}
      <div className="hms-sidebar-nav flex-1">
        {navItems.map((item, i) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`hms-nav-item ${activeView === item.id ? "active" : ""}`}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="hms-sidebar-footer">
        <div className="hms-user-info">
          <div className="hms-user-name">{user.name}</div>
          <div className="hms-user-email">{user.email}</div>
        </div>
        <button onClick={onLogout} className="hms-logout-btn">
          <LogOutIcon className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white border border-gray-200 shadow-sm print:hidden"
        style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
        aria-label="Toggle menu"
      >
        {mobileOpen ? (
          <CloseIcon className="h-5 w-5" style={{ color: "var(--text)" }} />
        ) : (
          <MenuIcon className="h-5 w-5" style={{ color: "var(--text)" }} />
        )}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-30 print:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <aside
        className={`
                fixed lg:static inset-y-0 left-0 z-40 transition-transform duration-300 print:hidden
                ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}
        style={{ width: "210px" }}
      >
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;
