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
    fetchGithubUser: (username: string) => Promise<void>;
}

export const useGithubUserStore = create<GithubUserStore>((set,get) => ({
    githubUser: null,
    fetchGithubUser: async (username: string) => {
        if (get().githubUser !== null) {
            return;
        }
        try {
            const response = await axios.get<GitHubUser>(
                `https://api.github.com/users/${username}`
            );
            set({ githubUser: response.data }); // Update state with fetched data
        } catch (error) {
            console.error("Error fetching GitHub user data:", error);
            set({ githubUser: null }); // Reset state on error
        }
    },

}));