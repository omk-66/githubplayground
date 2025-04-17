// src/store/playground.store.ts
import { create } from 'zustand';
import axios from 'axios';

type Playground = {
    id: number;
    name: string;
    description: string;
    visibility: 'public' | 'private';
    tags: string[];
    isFeatured: boolean;
    createdAt: string;
    updatedAt: string;
    creatorId: string;
};

type PlaygroundStore = {
    playgrounds: Playground[];
    loading: boolean;
    error: string | null;
    fetchPlaygrounds: (userId: string) => Promise<void>;
    deletePlayground: (playgroundId: number) => Promise<Playground | undefined>;
};

export const usePlaygroundStore = create<PlaygroundStore>((set, get) => ({
    playgrounds: [],
    loading: false,
    error: null,

    // src/store/playground.store.ts
    fetchPlaygrounds: async (userId) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`/api/playground/${userId}`, {
                withCredentials: true,
                baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
                headers: {
                    'Accept': 'application/json',
                },
                timeout: 10000,
            });

            if (response.data.status === 'success') {
                set({
                    playgrounds: response.data.data || [],
                    loading: false
                });
            } else {
                throw new Error(response.data.message || 'Invalid response format');
            }
        } catch (error) {
            let errorMessage = 'Failed to load playgrounds';

            if (axios.isAxiosError(error)) {
                if (error.response) {
                    errorMessage = error.response.data?.message ||
                        `Server error: ${error.response.status}`;
                } else {
                    errorMessage = error.message;
                }
            }

            console.error('Fetch error:', errorMessage);
            set({ error: errorMessage, loading: false });
        }
    },
    deletePlayground: async (playgroundId) => {
        try {
            set({ loading: true, error: null });

            const response = await axios.delete(`http://localhost:3000/api/playground/${playgroundId}`, {
                withCredentials: true,
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (response.data.status === 'success') {
                // Return the deleted playground data
                const deletedPlayground = get().playgrounds.find(p => p.id === playgroundId);
                set(state => ({
                    playgrounds: state.playgrounds.filter(p => p.id !== playgroundId),
                    loading: false
                }));
                return deletedPlayground;
            }
            throw new Error(response.data.message || 'Failed to delete playground');
        } catch (error) {
            let errorMessage = 'Failed to delete playground';

            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message ||
                    error.response?.data?.error ||
                    error.message;

                // Check for HTML response
                if (error.response?.headers['content-type']?.includes('text/html')) {
                    errorMessage = `Server returned HTML (likely error page). Status: ${error.response.status}`;
                }
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            console.error('Delete playground error:', error);
            set({ error: errorMessage, loading: false });
            throw error; // Re-throw for component-level handling
        }
    }
}));