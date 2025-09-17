import type { ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth";

export type ProtectedRouteProps = {
  children: ReactElement;
  roles?: Array<"student" | "mentor" | "admin">;
};

export const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const location = useLocation();
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return <div className="text-slate-500">验证身份...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};
