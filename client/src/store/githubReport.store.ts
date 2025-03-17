import { create } from "zustand";
import axios from "axios";

interface Commit {
    sha: string;
    commit: {
        author: {
            date: string;
            name: string;
            email: string;
        };
        message: string;
    };
    html_url: string;
}

interface GithubReportStore {
    commitData: Commit[]; // Array of commits
    loading: boolean; // Loading state
    error: string | null; // Error state
    fetchCommitHistory: (repoName: string) => Promise<void>; // Function to fetch commit history
}

export const useGithubReportStore = create<GithubReportStore>((set) => ({
    commitData: [], // Initial state
    loading: false, // Initial loading state
    error: null, // Initial error state

    // Function to fetch commit history
    fetchCommitHistory: async (repoName: string) => {
        set({ loading: true, error: null }); // Set loading state

        try {
            const response = await axios.get<Commit[]>(
                `https://api.github.com/repos/omk-66/${repoName}/commits`
            );
            set({ commitData: response.data, loading: false }); // Update state with fetched data
        } catch (error) {
            console.error("Error fetching commit history:", error);
            set({ error: "Failed to fetch commit history", loading: false }); // Set error state
        }
    },
}));