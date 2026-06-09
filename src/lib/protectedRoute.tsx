import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {getUser} from "@/lib/cognitoActions";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: "student" | "tutor";
}

export function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const [status, setStatus] = useState<string>("loading");
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await getUser();
        console.log("user roles:", user?.roles);
        if(!user||!user.roles.length){
          setStatus("unauthenticated");
        }
        else{
          setRoles(user.roles);
          setStatus(user.roles.includes(requiredRole) ? "authenticated" : "unauthenticated");
        }
      } catch {
          setStatus("unauthenticated");
      }
      
    }

    checkAuth();
  }, [requiredRole]);

  if (status === "loading") {
    return <div>Loading...</div>; // Or a loading spinner
  }

  // Not authenticated or wrong role
  if (status === "unauthenticated") {
    if (roles.includes("student")) return <Navigate to="/student" replace />;
    if (roles.includes("tutor")) return <Navigate to="/tutor" replace />;
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}