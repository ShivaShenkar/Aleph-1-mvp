import { create } from "zustand";
import { getUser } from "@/lib/cognitoActions";

export interface UserProfile {
  username: string;
  userId: string;
  givenName: string;
  familyName: string;
  email: string;
  roles: string[];
  profilePicUrl?: string;
  bio?: string;
  subjects?: string[];
}

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  fetchUser: () => Promise<void>;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  initialized: false,

  fetchUser: async () => {
    set({ loading: true,initialized: false });
    try {
      const userData = await getUser();
      if (!userData) {
        set({ user: null, loading: false, initialized: true });
        return;
      }

      const user: UserProfile = {
        username: userData.username,
        userId: userData.userId,
        givenName: userData.givenName || "",
        familyName: userData.familyName || "",
        email: userData.username || "",
        roles: userData.roles,
      };

      set({ user, loading: false, initialized: true });
    } catch {
      set({ user: null, loading: false, initialized: true });
    }
  },

  clearUser: () => set({ user: null, initialized: false }),
}));
