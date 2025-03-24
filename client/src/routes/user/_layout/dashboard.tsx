import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSession } from "../../../../lib/auth-client";
import { useEffect } from "react";
import { useGithubRepoStore } from "@/store/githubRepo.store";
import { Button } from "@/components/ui/button";
import { Star, GitFork, Code, Clock } from "lucide-react"; // Using Lucide icons for consistency
import PlaygroundForm from "@/components/create-playground-form";

export const Route = createFileRoute("/user/_layout/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useSession();
  const { fetchGithubRepos, githubRepos, error, loading } = useGithubRepoStore();
  const navigate = useNavigate(); // Hook for navigation

  // Fetch GitHub repository data
  useEffect(() => {
    if (data?.user?.name) {
      fetchGithubRepos(data.user.name);
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
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold">Dashboard</h2>
            <PlaygroundForm />
          </div>

          <div className="space-y-6">
            {/* Display Repository Data */}
            {loading && <p>Loading repositories...</p>}
            {error && (
              <p className="text-red-500">
                Error: {typeof error === "string" ? error : "An unexpected error occurred."}
              </p>
            )}
            {githubRepos && (
              <div>
                <h3 className="text-2xl font-semibold mb-4">Repositories</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {githubRepos.map((repo) => (
                    <div
                      key={`${repo.id}-${repo.name}`}
                      className="border p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-primary-foreground"
                    >
                      <div className="flex flex-col justify-between items-start mb-4">
                        {/* Repository Name and Description */}
                        <div>
                          <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pretty hover:underline text-xl font-semibold"
                          >
                            {repo.name}
                          </a>
                          <p className="text-gray-600 mt-2">
                            {repo.description || "No description provided."}
                          </p>
                        </div>

                        {/* Button Section */}
                        <div className="mt-4 w-full flex flex-col gap-3">
                          {/* View on GitHub Button */}
                          <Button
                            variant="link"
                            className="text-primary hover:underline font-semibold text-sm"
                          >
                            <a
                              href={repo.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View on GitHub
                            </a>
                          </Button>

                          {/* View Concise Report Button */}
                          <Button
                            variant="default"
                            onClick={() => handleViewReport(repo.name)}
                            className="py-2 px-4 bg-primary hover:bg-primary-dark rounded-lg text-sm"
                          >
                            View Concise Report
                          </Button>
                        </div>

                        {/* Repository Metadata */}
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-gray-600">
                          {/* Stars */}
                          <div className="flex items-center space-x-2">
                            <Star className="h-5 w-5 text-yellow-500" />
                            <span>{repo.stargazers_count}</span>
                          </div>

                          {/* Forks */}
                          <div className="flex items-center space-x-2">
                            <GitFork className="h-5 w-5 text-blue-500" />
                            <span>{repo.forks_count}</span>
                          </div>

                          {/* Language */}
                          {repo.language && (
                            <div className="flex items-center space-x-2">
                              <Code className="h-5 w-5 text-green-500" />
                              <span>{repo.language}</span>
                            </div>
                          )}

                          {/* Last Updated */}
                          <div className="flex items-center space-x-2">
                            <Clock className="h-5 w-5 text-purple-500" />
                            <span>
                              Last updated: {new Date(repo.updated_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
