import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/public/home-page";
import { LoginPage } from "../pages/public/login-page";
import { DashboardPage } from "../pages/app/dashboard-page";
import { TokensPage } from "../pages/app/tokens-page";
import { LogsPage } from "../pages/app/logs-page";
import { PlaygroundPage } from "../pages/app/playground-page";
import { AppShell } from "./layout/app-shell";
import { ProtectedRoute } from "../components/common/protected-route";

function ProtectedApp({ children }) {
  return <ProtectedRoute><AppShell>{children}</AppShell></ProtectedRoute>;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/app" element={<ProtectedApp><DashboardPage /></ProtectedApp>} />
      <Route path="/app/tokens" element={<ProtectedApp><TokensPage /></ProtectedApp>} />
      <Route path="/app/logs" element={<ProtectedApp><LogsPage /></ProtectedApp>} />
      <Route path="/app/playground" element={<ProtectedApp><PlaygroundPage /></ProtectedApp>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
