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
};

export const usePlaygroundStore = create<PlaygroundStore>((set) => ({
    playgrounds: [],
    loading: false,
    error: null,

    fetchPlaygrounds: async (userId) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`http://localhost:3000/api/playground/${userId}`, {
                withCredentials: true
            });

            if (response.data.status === 'success') {
                set({ playgrounds: response.data.data, loading: false });
            } else {
                throw new Error(response.data.message || 'Failed to fetch playgrounds');
            }
        } catch (error) {
            set({
                error: axios.isAxiosError(error)
                    ? error.response?.data?.message || error.message
                    : 'Failed to fetch playgrounds',
                loading: false
            });
        }
    }
}));