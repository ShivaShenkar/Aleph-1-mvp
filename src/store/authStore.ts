import { create } from "zustand";
import { fetchAuthSession } from "aws-amplify/auth";
import {type LessonType } from "@/models/models";

const STORAGE_KEY = "aleph1-auth";

function loadUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);

    // Handle old persist middleware format: { state: { user: ... }, version: ... }
    // Also handles the corrupted state where setup fields were spread
    // at the wrapper's top level by a previous updateUserSetupData call.
    if (parsed?.state?.user) {
      const rawUser = parsed.state.user as Record<string, unknown>;
      const user = mapDynamoUser({
        ...rawUser,
        ...(parsed.isSetupComplete !== undefined ? { isSetupComplete: parsed.isSetupComplete } : {}),
        ...(parsed.profilePic ? { profilePic: parsed.profilePic } : {}),
        ...(parsed.location ? { location: parsed.location } : {}),
        ...(parsed.gender ? { gender: parsed.gender } : {}),
        ...(Array.isArray(parsed.subjects) ? { subjects: parsed.subjects } : {}),
        ...(parsed.bio ? { bio: parsed.bio } : {}),
      });
      saveUser(user);
      return user;
    }
    if (parsed?.UserId) {
      const user = mapDynamoUser(parsed);
      saveUser(user);
      return user;
    }
    return parsed as UserProfile;
  } catch {
    return null;
  }
}

function saveUser(user: UserProfile | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // localStorage unavailable
  }
}

function mapDynamoUser(raw: Record<string, unknown>): UserProfile {
  const { UserId, ...rest } = raw;
  return { userId: UserId as string, ...rest } as UserProfile;
}

export interface UserProfile {
  userId: string,           // Cognito sub
  email: string,
  firstName: string,
  lastName: string,
  roles: string[],
  birthdate: string,
  isSetupComplete: boolean | null, 
  gender:string|null,
  profilePic: string | null,
  location: string | null,
  subjects: string[],
  bio: string | null,
  lessonTypes:LessonType[]
}

export interface SetupData {
  isSetupComplete: true;
  profilePic: string;
  location: string;
  gender: "male" | "female";
  subjects: string[];
  bio: string;
}

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  fetchUser: () => Promise<[number,string]>;
  clearUser: () => void;
  updateUserSetupData: (data: SetupData) => void;
}

const initialUser = loadUser();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  loading: false,
  initialized: initialUser !== null,

  fetchUser: async () => {
    set({ loading: true,initialized: false });
    try {
      const session = await fetchAuthSession();
    
      const token = session.tokens?.idToken;
      if (!session||!token) {
        set({ user: null, loading: false, initialized: true });
        saveUser(null);
        return [500,"Server Error,Can't fetch user session"];
      }
      const response = await fetch(`${import.meta.env.VITE_API_GATEWAY_URL}/get-user`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
      });
      if (!response.ok) {
        console.error("Failed to fetch user profile:", response.statusText);
        set({ user: null, loading: false, initialized: true });
        saveUser(null);
        return [response.status,await response.text()]
      }
      const raw = await response.json();
      const user = mapDynamoUser(raw);

      set({ user, loading: false, initialized: true });
      saveUser(user);
      console.log("Fetched user profile:", user);
      return [response.status, JSON.stringify(user)];
      
    } 
    catch(error:unknown) {
      set({ user: null, loading: false, initialized: true });
      saveUser(null);
      return [500,`Error during load of user: ${error}`]
    }
  },

  updateUserSetupData: (data) =>
    set((state) => {
      if (!state.user) return state;
      const updated = { ...state.user, ...data };
      saveUser(updated);
      return { user: updated };
    }),

  clearUser: () => {
    saveUser(null);
    try { localStorage.removeItem("aleph1-bookings"); } catch { /* ignore */ }
    set({ user: null, initialized: true });
  },
}));
