import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useGithubReportStore } from "@/store/githubReport.store";
import { useGithubRepoStore } from "@/store/githubRepo.store";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Star, GitFork, AlertCircle, Code, Clock, User } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export const Route = createFileRoute('/user/_layout/repo/$id')({
  component: RepoReport,
});

export function RepoReport() {
  const { id } = Route.useParams();
  const { commitData, loading, error, fetchCommitHistory } = useGithubReportStore();
  const { githubRepos } = useGithubRepoStore();

  useEffect(() => {
    fetchCommitHistory(id);
  }, [id, fetchCommitHistory]);

  const currentRepo = githubRepos?.find((repo) => repo.name === id);

  const chartData = commitData.map((commit) => ({
    date: new Date(commit.commit.author.date).toLocaleDateString(),
    commits: 1,
  }));

  if (loading) {
    return <div>Loading commit history...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Repository Report</h1>

      {/* Repository Details */}
      {currentRepo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="w-6 h-6" />
                <span>{currentRepo.name}</span>
              </CardTitle>
              <CardDescription>{currentRepo.description || "No description provided."}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span>Stars: {currentRepo.stargazers_count}</span>
                </Badge>
                <Badge variant="outline" className="flex items-center space-x-1">
                  <GitFork className="w-4 h-4" />
                  <span>Forks: {currentRepo.forks_count}</span>
                </Badge>
                <Badge variant="outline" className="flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>Issues: {currentRepo.open_issues_count}</span>
                </Badge>
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Code className="w-4 h-4" />
                  <span>Language: {currentRepo.language}</span>
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Commit Activity Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-6 h-6" />
              <span>Commit Activity</span>
            </CardTitle>
            <CardDescription>Number of commits over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="commits" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Commits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-6 h-6" />
              <span>Recent Commits</span>
            </CardTitle>
            <CardDescription>Latest commits to the repository</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {commitData.map((commit) => (
                <motion.li
                  key={commit.sha}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="border p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <a
                    href={commit.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {commit.commit.message}
                  </a>
                  <p className="text-sm text-gray-500">
                    {new Date(commit.commit.author.date).toLocaleString()} by{" "}
                    {commit.commit.author.name}
                  </p>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}