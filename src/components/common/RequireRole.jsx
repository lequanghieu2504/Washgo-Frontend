import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "@/hooks/useUserStore";
import LoadingSpinner from "./LoadingSpinner";

export function RequireRole({ roles }) {
  const { user, loading, error } = useUserStore();

  if (loading) {
    return <LoadingSpinner />;
  } else if (!user || !roles.includes(user.role))
    return <Navigate to="/unauthorized" replace />;

  return <>{<Outlet />}</>;
}
