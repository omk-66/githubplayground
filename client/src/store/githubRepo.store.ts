import { create } from "zustand";
import axios from "axios";

interface GitHubRepo {
    id: number;
    name: string;
    full_name: string;
    private: boolean;
    html_url: string;
    description: string | null;
    fork: boolean;
    url: string;
    created_at: string;
    updated_at: string;
    pushed_at: string;
    language: string;
    stargazers_count: number;
    watchers_count: number;
    forks_count: number;
    open_issues_count: number;
    default_branch: string;
}

interface GithubRepoStore {
    githubRepos: GitHubRepo[] | null; // Array of repositories
    loading: boolean; // Loading state
    error: string | null; // Error state
    fetchGithubRepos: (username: string) => Promise<void>; // Function to fetch repositories
}

export const useGithubRepoStore = create<GithubRepoStore>((set, get) => ({
    githubRepos: null, // Initial state
    loading: false, // Initial loading state
    error: null, // Initial error state

    // Function to fetch repositories
    fetchGithubRepos: async (username: string) => {
        // Avoid refetching if data already exists
        if (get().githubRepos !== null) {
            return;
        }

        set({ loading: true, error: null }); // Set loading state

        try {
            const response = await axios.get<GitHubRepo[]>(
                `https://api.github.com/users/${username}/repos`
            );
            set({ githubRepos: response.data, loading: false }); // Update state with fetched data
        } catch (error) {
            console.error("Error fetching GitHub repositories:", error);
            set({ error: "Failed to fetch repositories", loading: false }); // Set error state
        }
    },
}));