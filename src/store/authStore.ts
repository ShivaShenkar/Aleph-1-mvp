import { create } from "zustand";
import { fetchAuthSession } from "aws-amplify/auth";

export interface UserProfile {
  userId: string,           // Cognito sub
  email: string,
  firstName: string,
  lastName: string,
  roles: string[],
  birthdate: string,
  isSetupComplete: boolean | null, 
  profilePic: string | null,
  location: string | null,
  subjects: string[],
  bio: string | null,
  createdAt: string,
}

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  setupComplete: boolean;
  fetchUser: () => Promise<[number,string]>;
  clearUser: () => void;
  markSetupComplete: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  initialized: false,
  setupComplete: false,

  fetchUser: async () => {
    set({ loading: true,initialized: false });
    try {
      const session = await fetchAuthSession();
    
      const token = session.tokens?.idToken;
      if (!session||!token) {
        set({ user: null, loading: false, initialized: true });
        return [500,"Server Error,Can't fetch user session"];
      }
      const response = await fetch(`${import.meta.env.VITE_API_GATEWAY_URL}/get-user`, {
      method: "GET",
      headers: {
        // This is the header your API Gateway "AuthCheck" authorizer is looking for
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
      });
      if (!response.ok) {
        console.error("Failed to fetch user profile:", response.statusText);
        set({ user: null, loading: false, initialized: true });
        return [response.status,await response.text()]
      }
      const user = await response.json() as UserProfile;
      set({ user, loading: false, initialized: true });
      console.log("Fetched user profile:", user);
      return [response.status, JSON.stringify(user)];
      
    } catch(error:unknown) {
      set({ user: null, loading: false, initialized: true });
      return [500,`Error during load of user: ${error}`]
    }
  },

  clearUser: () => set({ user: null, initialized: false }),
  markSetupComplete: () => set({ setupComplete: true }),
}));
