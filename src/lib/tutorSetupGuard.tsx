import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

interface TutorSetupGuardProps {
  requireSetup: boolean;
  children?: React.ReactNode;
}

export function TutorSetupGuard({ requireSetup, children }: TutorSetupGuardProps) {
  const user = useAuthStore((s) => s.user);
  const localComplete = useAuthStore((s) => s.setupComplete);
  const setupComplete = user?.isSetupComplete ?? localComplete;

  if (requireSetup && !setupComplete) {
    return <Navigate to="/tutor/setup" replace />;
  }
  if (!requireSetup && setupComplete) {
    return <Navigate to="/tutor" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
