import { NavLink } from "react-router-dom";

const items = [
  ["Dashboard", "/app"],
  ["Tokens", "/app/tokens"],
  ["Logs", "/app/logs"],
  ["Playground", "/app/playground"],
];

export function AppSidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-brand">New API v2</div>
      <nav className="sidebar-nav">
        {items.map(([label, to]) => (
          <NavLink key={to} to={to} className="sidebar-link">
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
