import { createContext, useContext } from "react";

type Role = "student" | "tutor";

export const AuthRoleContext = createContext<Role>("student");
export const AuthRoleSetterContext = createContext<(r: Role) => void>(() => {});

export function useAuthRole() {
  return useContext(AuthRoleContext);
}

export function useAuthRoleSetter() {
  return useContext(AuthRoleSetterContext);
}
