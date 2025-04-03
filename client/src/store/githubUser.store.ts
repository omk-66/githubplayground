import { create } from "zustand";
import axios from "axios";

interface GitHubUser {
    login: string;
    avatar_url: string;
    public_repos: number;
    followers: number;
    following: number;
    created_at: string;
}

interface GithubUserStore {
    githubUser: GitHubUser | null;
    loading: boolean;
    error: string | null;
    fetchGithubUser: (username: string) => Promise<void>;
    reset: () => void;
}

export const useGithubUserStore = create<GithubUserStore>((set) => ({
    githubUser: null,
    loading: false,
    error: null,

    fetchGithubUser: async (username: string) => {
        set({ loading: true, error: null });

        try {
            const response = await axios.get<GitHubUser>(
                `https://api.github.com/users/${username}`,
                {
                    headers: {
                        Accept: 'application/vnd.github.v3+json'
                    },
                    timeout: 5000
                }
            );

            set({
                githubUser: response.data,
                loading: false,
                error: null
            });

        } catch (error) {
            let errorMessage = "Failed to fetch user data";

            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message ||
                    error.message ||
                    "Unknown API error";
            }

            console.error("GitHub API error:", error);
            set({
                githubUser: null,
                loading: false,
                error: errorMessage
            });
        }
    },

    reset: () => set({ githubUser: null, error: null })
}));