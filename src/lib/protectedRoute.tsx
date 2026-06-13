import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: "student" | "tutor";
}

export function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.roles.includes(requiredRole)) {
    if (user.roles.includes("student")) return <Navigate to="/student" replace />;
    if (user.roles.includes("tutor")) return <Navigate to="/tutor" replace />;
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
