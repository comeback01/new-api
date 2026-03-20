import { AppSidebar } from "../../components/layout/app-sidebar";
import { AppTopbar } from "../../components/layout/app-topbar";

export function AppShell({ children }) {
  return (
    <div className="app-shell">
      <aside className="app-sidebar-wrap">
        <AppSidebar />
      </aside>
      <div className="app-main">
        <AppTopbar />
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}
