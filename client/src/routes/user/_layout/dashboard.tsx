import axios from "axios";
import { createFileRoute } from "@tanstack/react-router";
import { useSession } from "../../../../lib/auth-client";
import { useEffect, useState } from "react";
import Profile from "@/components/profile";

interface GitHubUser {
  login: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export const Route = createFileRoute("/user/_layout/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useSession();
  const [githubUser, setGitHubUser] = useState<GitHubUser | null>(null);

  // Fetch GitHub user data
  useEffect(() => {
    const fetchGitHubUser = async () => {
      try {
        const response = await axios.get<GitHubUser>("https://api.github.com/users/omk-66");
        setGitHubUser(response.data); // Set the fetched data to state
      } catch (error) {
        console.error("Error fetching GitHub user data:", error);
      }
    };

    fetchGitHubUser();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <Profile githubUser={githubUser} />

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
          <div className="space-y-4">
            <p>Email: {data?.user.email}</p>
            <p>Name: {data?.user.name}</p>
            <p>Token: {data?.session.token}</p>
          </div>
        </div>
      </div>
    </div>
  );
}