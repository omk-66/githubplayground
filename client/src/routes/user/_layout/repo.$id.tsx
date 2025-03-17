import { createFileRoute } from "@tanstack/react-router";

import { useEffect } from "react";
import { useGithubReportStore } from "@/store/githubReport.store";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

export const Route = createFileRoute('/user/_layout/repo/$id')({
  component: RepoReport,
})


export function RepoReport() {
  const { id } = Route.useParams(); // Get the repository ID from the URL
  const { commitData, loading, error, fetchCommitHistory } = useGithubReportStore();

  // Fetch commit history when the component mounts or the ID changes
  useEffect(() => {
    fetchCommitHistory(id);
  }, [id, fetchCommitHistory]);

  // Format commit data for the chart
  const chartData = commitData.map((commit) => ({
    date: new Date(commit.commit.author.date).toLocaleDateString(),
    commits: 1, // Each commit counts as 1
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
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Commit History</h2>
        <LineChart width={600} height={300} data={chartData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="commits" stroke="#8884d8" />
        </LineChart>

        {/* Display Commit Details */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Recent Commits</h3>
          <ul className="space-y-2">
            {commitData.map((commit) => (
              <li key={commit.sha} className="border p-3 rounded-lg shadow-sm">
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
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}