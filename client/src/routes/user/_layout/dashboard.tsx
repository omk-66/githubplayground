import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSession } from "../../../../lib/auth-client";
import { useEffect } from "react";
import { useGithubRepoStore } from "@/store/githubRepo.store";
import { Button } from "@/components/ui/button";
import { Star, GitFork, Code, Clock } from "lucide-react";
import PlaygroundForm from "@/components/create-playground-form";
import { useUserSession } from "@/store/userSession.store";
import { usePlaygroundStore } from "@/store/playground.store";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/user/_layout/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useSession();
  const { fetchGithubRepos, githubRepos, error, loading } = useGithubRepoStore();
  const { fetchSession, user } = useUserSession();
  const { playgrounds, loading: playgroundsLoading, error: playgroundsError, fetchPlaygrounds } = usePlaygroundStore();
  const navigate = useNavigate();

  // Fetch GitHub repository data and user session
  useEffect(() => {
    if (data?.user?.name) {
      fetchGithubRepos(data.user.name);
      fetchSession();
    }
  }, [data, fetchGithubRepos, fetchSession]);

  // Fetch playgrounds when user is available
  useEffect(() => {
    if (user?.id) {
      fetchPlaygrounds(user.id);
    }
  }, [user?.id, fetchPlaygrounds]);

  const handleViewReport = (repoName: string) => {
    navigate({ to: "/user/repo/$id", params: { id: repoName } });
  };

  const handlePlaygroundClick = (playgroundId: number) => {
    navigate({ to: "/user/playground/$id", params: { id: (playgroundId - 1).toString() } });
  };

  return (
    <div className="min-h-screen">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold">Dashboard</h2>
            <PlaygroundForm />
          </div>

          <div className="space-y-8">
            {/* Playgrounds Section */}
            <div>
              <h3 className="text-2xl font-semibold mb-4">Your Playgrounds</h3>
              {playgroundsLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-40 rounded-lg" />
                  ))}
                </div>
              )}
              {playgroundsError && (
                <p className="text-red-500">{playgroundsError}</p>
              )}
              {!playgroundsLoading && playgrounds.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {playgrounds.map((playground) => (
                    <div
                      key={playground.id}
                      className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-primary-foreground cursor-pointer"
                      onClick={() => handlePlaygroundClick(playground.id)}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="text-xl font-semibold">{playground.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          playground.visibility === 'public'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {playground.visibility}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-2 text-sm">
                        {playground.description || 'No description available'}
                      </p>
                      {playground.tags?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {playground.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                        <span>
                          Created: {new Date(playground.createdAt).toLocaleDateString()}
                        </span>
                        {playground.isFeatured && (
                          <span className="text-yellow-500">⭐ Featured</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                !playgroundsLoading && <p className="text-gray-600">No playgrounds found</p>
              )}
            </div>

            {/* GitHub Repositories Section */}
            <div>
              <h3 className="text-2xl font-semibold mb-4">Repositories</h3>
              {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-48 rounded-lg" />
                  ))}
                </div>
              )}
              {error && (
                <p className="text-red-500">
                  Error: {typeof error === "string" ? error : "An unexpected error occurred."}
                </p>
              )}
              {!loading && githubRepos && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {githubRepos.map((repo) => (
                    <div
                      key={`${repo.id}-${repo.name}`}
                      className="border p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-primary-foreground"
                    >
                      <div className="flex flex-col justify-between items-start mb-4">
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

                        <div className="mt-4 w-full flex flex-col gap-3">
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

                          <Button
                            variant="default"
                            onClick={() => handleViewReport(repo.name)}
                            className="py-2 px-4 bg-primary hover:bg-primary-dark rounded-lg text-sm"
                          >
                            View Concise Report
                          </Button>
                        </div>

                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Star className="h-5 w-5 text-yellow-500" />
                            <span>{repo.stargazers_count}</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <GitFork className="h-5 w-5 text-blue-500" />
                            <span>{repo.forks_count}</span>
                          </div>

                          {repo.language && (
                            <div className="flex items-center space-x-2">
                              <Code className="h-5 w-5 text-green-500" />
                              <span>{repo.language}</span>
                            </div>
                          )}

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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}