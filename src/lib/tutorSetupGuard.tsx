import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

interface TutorSetupGuardProps {
  requireSetup: boolean;
  children?: React.ReactNode;
}

export function TutorSetupGuard({ requireSetup, children }: TutorSetupGuardProps) {
  const user = useAuthStore((s) => s.user);

  if (!user) return <>{children}</>;

  const setupComplete = user.isSetupComplete ?? false;

  if (requireSetup && !setupComplete) {
    return <Navigate to="/tutor/setup" replace />;
  }
  if (!requireSetup && setupComplete) {
    return <Navigate to="/tutor" replace />;
  }

  return children ? <>{children}</> : null;
}
