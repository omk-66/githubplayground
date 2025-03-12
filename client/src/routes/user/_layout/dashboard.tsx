import { createFileRoute } from "@tanstack/react-router";
import { useSession } from "../../../../lib/auth-client";
import { useEffect } from "react";
import { useGithubUserStore } from "@/store/githubUser.store";


export const Route = createFileRoute("/user/_layout/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useSession();
  const { githubUser, fetchGithubUser } = useGithubUserStore();
  // Fetch GitHub user data
  useEffect(() => {
    const name = data?.user.name;
    if (name) {
      fetchGithubUser(name);
    }
  }, [fetchGithubUser, data]);

  return (
    <div className="min-h-screen">

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
          <div className="space-y-4">
            <p>Email: {data?.user.email}</p>
            <p>Name: {data?.user.name}</p>
            <p>Token: {data?.session.token}</p>
            <p className="scroll-auto">{JSON.stringify(githubUser)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}