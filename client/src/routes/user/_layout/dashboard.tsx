import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSession } from "../../../../lib/auth-client";
import { useEffect, useState } from "react";
import { useGithubRepoStore } from "@/store/githubRepo.store";
import { Button } from "@/components/ui/button";
import { Star, GitFork, Code, Clock, XCircle, CalendarDays } from "lucide-react";
import PlaygroundForm from "@/components/create-playground-form";
import { useUserSession } from "@/store/userSession.store";
import { usePlaygroundStore } from "@/store/playground.store";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Toaster, toast } from 'sonner'


export const Route = createFileRoute("/user/_layout/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useSession();
  const { fetchGithubRepos, githubRepos, error, loading } = useGithubRepoStore();
  const { fetchSession, user } = useUserSession();
  const { 
    playgrounds, 
    loading: playgroundsLoading, 
    error: playgroundsError, 
    fetchPlaygrounds 
  } = usePlaygroundStore();
  const navigate = useNavigate();

  const [playgroundToDelete, setPlaygroundToDelete] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch GitHub repository data and user session
  useEffect(() => {
    if (data?.user?.name) {
      fetchGithubRepos(data.user.name);
      fetchSession();
    }
  }, [data, fetchGithubRepos, fetchSession]);

  // Fetch playgrounds when user is available
  useEffect(() => {
    const loadPlaygrounds = async () => {
      if (!user?.id) return;
      
      try {
        await fetchPlaygrounds(user.id);
      } catch (error) {
        console.error("Failed to fetch playgrounds:", error);
      }
    };

    loadPlaygrounds();
  }, [user?.id, fetchPlaygrounds]);

  const handleViewReport = (repoName: string) => {
    navigate({ to: "/user/repo/$id", params: { id: repoName } });
  };

  const handlePlaygroundClick = (playgroundId: number) => {
    navigate({ to: "/user/playground/$id", params: { id: playgroundId.toString() } });
  };

  const handleDeletePlayground = async () => {
    if (!playgroundToDelete) return;

    try {
      await usePlaygroundStore.getState().deletePlayground(playgroundToDelete);
      
      // toast({
      //   // title: "Success",
      //   description: "Playground deleted successfully",
      //   variant: "default",
      // });

      toast.success("Playground deleted successfully")
      
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete playground:", error);
      // toast({
      //   // title: "Error",
      //   description: error instanceof Error ? error.message : "Failed to delete playground",
      //   variant: "destructive",
      // });

      toast.error("Failed to delete playground");
    } finally {
      setPlaygroundToDelete(null);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
          <Toaster richColors/>
            <h2 className="text-3xl font-semibold">Dashboard</h2>
            <PlaygroundForm />
          </div>

          <div className="space-y-8">
            {/* Playgrounds Section */}
            <div>
              <h3 className="text-2xl font-semibold mb-4">Your Playgrounds</h3>
              
              {/* Error Display */}
              {playgroundsError && (
                <div className="p-4 mb-4 bg-red-50 border-l-4 border-red-500">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <XCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">
                        {playgroundsError}
                      </p>
                      <button
                        onClick={() => user?.id && fetchPlaygrounds(user.id)}
                        className="mt-2 text-sm font-medium text-red-700 hover:text-red-600"
                      >
                        Retry loading playgrounds →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {playgroundsLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-40 rounded-lg" />
                  ))}
                </div>
              )}

              {!playgroundsLoading && playgrounds.length > 0 ? (
                // <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                //   {playgrounds.map((playground) => (
                //     <div
                //       key={playground.id}
                //       className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-primary-foreground cursor-pointer relative group"
                //       onClick={(e) => {
                //         if (!(e.target as HTMLElement).closest('.exit-button')) {
                //           handlePlaygroundClick(playground.id);
                //         }
                //       }}
                //     >
                //       {/* Exit button */}
                //       <button
                //         className="exit-button absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                //         onClick={(e) => {
                //           e.stopPropagation();
                //           setPlaygroundToDelete(playground.id);
                //           setIsDeleteDialogOpen(true);
                //         }}
                //       >
                //         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                //           <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                //         </svg>
                //       </button>

                //       <div className="flex justify-between items-start">
                //         <h4 className="text-xl font-semibold">{playground.name}</h4>
                //         <span className={`text-xs mt-5 px-2 py-1 rounded-full ${
                //           playground.visibility === 'public'
                //             ? 'bg-green-100 text-green-800'
                //             : 'bg-purple-100 text-purple-800'
                //         }`}>
                //           {playground.visibility}
                //         </span>
                //       </div>
                //       <p className="text-gray-600 mt-2 text-sm">
                //         {playground.description || 'No description available'}
                //       </p>
                //       {playground.tags?.length > 0 && (
                //         <div className="mt-3 flex flex-wrap gap-2">
                //           {playground.tags.map((tag) => (
                //             <span
                //               key={tag}
                //               className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs"
                //             >
                //               {tag}
                //             </span>
                //           ))}
                //         </div>
                //       )}
                //       <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                //         <span>
                //           Created: {new Date(playground.createdAt).toLocaleDateString()}
                //         </span>
                //         {playground.isFeatured && (
                //           <span className="text-yellow-500">⭐ Featured</span>
                //         )}
                //       </div>
                //     </div>
                //   ))}
                // </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {playgrounds.map((playground) => (
    <div
      key={playground.id}
      className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 bg-card cursor-pointer relative group"
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest('.exit-button')) {
          handlePlaygroundClick(playground.id);
        }
      }}
    >
      {/* Card Header with Exit Button */}
      <div className="p-5 pb-3 relative">
        {/* Exit button */}
        <button
          className="exit-button absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          onClick={(e) => {
            e.stopPropagation();
            setPlaygroundToDelete(playground.id);
            setIsDeleteDialogOpen(true);
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 hover:text-red-500 transition-colors" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        <div className="flex justify-between items-start gap-2">
          <h4 className="text-lg font-semibold text-foreground line-clamp-2">
            {playground.name}
          </h4>
          <span className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap ${
            playground.visibility === 'public'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
          }`}>
            {playground.visibility}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="px-5 pb-5">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {playground.description || 'No description available'}
        </p>

        {/* Tags */}
        {playground.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {playground.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-secondary text-secondary-foreground rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>
              {new Date(playground.createdAt).toLocaleDateString()}
            </span>
          </div>
          {playground.isFeatured && (
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span>Featured</span>
            </div>
          )}
        </div>
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
                <div className="p-4 mb-4 bg-red-50 border-l-4 border-red-500">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <XCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">
                        Error: {typeof error === "string" ? error : "An unexpected error occurred."}
                      </p>
                    </div>
                  </div>
                </div>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this playground? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setPlaygroundToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeletePlayground}
              disabled={usePlaygroundStore.getState().loading}
            >
              {usePlaygroundStore.getState().loading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}