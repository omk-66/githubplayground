import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSession } from "../../../../lib/auth-client";
import { useEffect } from "react";
import { useGithubRepoStore } from "@/store/githubRepo.store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/user/_layout/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useSession();
  const { fetchGithubRepos, githubRepos, error, loading } = useGithubRepoStore();
  const navigate = useNavigate(); // Hook for navigation

  // Fetch GitHub repository data
  useEffect(() => {
    const name = data?.user.name;
    if (name) {
      fetchGithubRepos(name);
    }
  }, [data, fetchGithubRepos]);

  // Handle "View Concise Report" button click
  const handleViewReport = (repoName: string) => {
    navigate({ to: "/user/repo/$id", params: { id: repoName } });
  };

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
          <div className="space-y-4">
            {/* Display Repository Data */}
            {loading && <p>Loading repositories...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            {githubRepos && (
              <div>
                <h3 className="text-xl font-bold mt-6 mb-4">Repositories</h3>
                <ul className="space-y-4">
                  {githubRepos.map((repo) => (
                    <li key={repo.id} className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        {/* Repository Name and Description */}
                        <div>
                          <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-xl font-semibold"
                          >
                            {repo.name}
                          </a>
                          <p className="text-gray-600 mt-1">{repo.description || "No description provided."}</p>
                        </div>

                        {/* Buttons */}
                        <div className="flex space-x-2">
                          <Button>
                            <a
                              href={repo.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View on GitHub
                            </a>
                          </Button>
                          <Button onClick={() => handleViewReport(repo.name)}>
                            View Concise Report
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}