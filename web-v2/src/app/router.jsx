import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/public/home-page";
import { LoginPage } from "../pages/public/login-page";
import { DashboardPage } from "../pages/app/dashboard-page";
import { TokensPage } from "../pages/app/tokens-page";
import { LogsPage } from "../pages/app/logs-page";
import { PlaygroundPage } from "../pages/app/playground-page";
import { AppShell } from "./layout/app-shell";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/app" element={<AppShell><DashboardPage /></AppShell>} />
      <Route path="/app/tokens" element={<AppShell><TokensPage /></AppShell>} />
      <Route path="/app/logs" element={<AppShell><LogsPage /></AppShell>} />
      <Route path="/app/playground" element={<AppShell><PlaygroundPage /></AppShell>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
