import { create } from "zustand";
import { fetchAuthSession } from "aws-amplify/auth";
import type { BankAccount } from "@/types/payment";

const STORAGE_KEY = "aleph1-payment-details";

function loadAccounts(): BankAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as BankAccount[];
  } catch {
    return [];
  }
}

function saveAccounts(accounts: BankAccount[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  } catch {
    // localStorage unavailable
  }
}

interface PaymentDetailsState {
  accounts: BankAccount[];
  loading: boolean;
  error: string | null;
  fetchAccounts: () => Promise<void>;
  addAccount: (account: Omit<BankAccount, "id">) => string | null;
  updateAccount: (id: string, data: Partial<BankAccount>) => void;
  removeAccount: (id: string) => void;
  syncToBackend: () => Promise<boolean>;
}

const initialAccounts = loadAccounts();

export const usePaymentDetailsStore = create<PaymentDetailsState>((set, get) => ({
  accounts: initialAccounts,
  loading: false,
  error: null,

  fetchAccounts: async () => {
    set({ loading: true, error: null });
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken;
      if (!session || !token) {
        set({ loading: false });
        return;
      }
      const response = await fetch(
        `${import.meta.env.VITE_API_GATEWAY_URL}/payment-accounts`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) {
        set({ loading: false, error: "שגיאה בטעינת פרטי התשלום" });
        return;
      }
      const raw: BankAccount[] = await response.json();
      saveAccounts(raw);
      set({ accounts: raw, loading: false });
    } catch {
      set({ loading: false, error: "שגיאה בטעינת פרטי התשלום" });
    }
  },

  addAccount: (account) => {
    const { accounts } = get();
    if (accounts.length >= 3) return null;
    const newAccount: BankAccount = {
      ...account,
      id: crypto.randomUUID(),
    };
    const updated = [...accounts, newAccount];
    saveAccounts(updated);
    set({ accounts: updated });
    return newAccount.id;
  },

  updateAccount: (id, data) => {
    const updated = get().accounts.map((a) =>
      a.id === id ? { ...a, ...data } : a,
    );
    saveAccounts(updated);
    set({ accounts: updated });
  },

  removeAccount: (id) => {
    const updated = get().accounts.filter((a) => a.id !== id);
    saveAccounts(updated);
    set({ accounts: updated });
  },

  syncToBackend: async () => {
    const { accounts } = get();
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken;
      if (!session || !token) return false;
      const response = await fetch(
        `${import.meta.env.VITE_API_GATEWAY_URL}/payment-accounts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(accounts),
        },
      );
      return response.ok;
    } catch {
      return false;
    }
  },
}));
