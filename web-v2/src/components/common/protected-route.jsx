import { Navigate } from "react-router-dom";
import { getStoredUser } from "../../lib/api-client";

export function ProtectedRoute({ children }) {
  const user = getStoredUser();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
