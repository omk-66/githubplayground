import { create } from "zustand";
import axios from "axios";

type User = {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string;
    createdAt: string;
    updatedAt: string;
};

type SessionData = {
    user: User | null;
    loading: boolean;
    error: string | null;
    fetchSession: () => Promise<void>;
    clearSession: () => void;
};

export const useUserSession = create<SessionData>((set) => ({
    user: null,
    loading: false,
    error: null,

    fetchSession: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get('http://localhost:3000/session', {
                withCredentials: true // Important for session cookies
            });

            if (response.data.user) {
                set({ user: response.data.user, loading: false });
            } else {
                set({ user: null, loading: false });
            }
        } catch (error) {
            let errorMessage = 'Failed to fetch session';
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || error.message;
            }
            set({ error: errorMessage, loading: false, user: null });
        }
    },

    clearSession: () => {
        set({ user: null });
    }
}));