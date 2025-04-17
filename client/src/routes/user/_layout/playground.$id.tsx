// src/routes/user/_layout/playground/$id.tsx
import { createFileRoute } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Code, Clock, Eye, EyeOff, Star, GitCommit, GitPullRequest, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Complete mock database of playground data
const mockPlaygroundDatabase = {
  "1": {
    name: "React Dashboard",
    description: "Interactive analytics dashboard built with React",
    visibility: "public",
    tags: ["react", "typescript", "dashboard"],
    isFeatured: true,
    createdAt: "2023-10-15T10:00:00Z",
    updatedAt: "2023-11-20T14:30:00Z",
    contributors: [
      {
        memberName: "Alex Johnson",
        repoName: "react-dashboard",
        commits: 42,
        linesAdded: 1250,
        linesRemoved: 320,
        pullRequests: 8,
        lastCommit: "2 days ago"
      },
      {
        memberName: "Sarah Williams",
        repoName: "react-dashboard",
        commits: 28,
        linesAdded: 890,
        linesRemoved: 150,
        pullRequests: 5,
        lastCommit: "1 week ago"
      }
    ]
  },
  "2": {
    name: "Node API Service",
    description: "Backend API service with Express and MongoDB",
    visibility: "public",
    tags: ["nodejs", "express", "mongodb"],
    isFeatured: false,
    createdAt: "2023-09-10T09:15:00Z",
    updatedAt: "2023-11-18T11:45:00Z",
    contributors: [
      {
        memberName: "Michael Chen",
        repoName: "node-api",
        commits: 35,
        linesAdded: 1500,
        linesRemoved: 420,
        pullRequests: 12,
        lastCommit: "1 day ago"
      },
      {
        memberName: "Emily Rodriguez",
        repoName: "node-api",
        commits: 18,
        linesAdded: 750,
        linesRemoved: 210,
        pullRequests: 6,
        lastCommit: "3 days ago"
      }
    ]
  },
  "3": {
    name: "Mobile App",
    description: "Cross-platform mobile application with React Native",
    visibility: "private",
    tags: ["react-native", "mobile"],
    isFeatured: true,
    createdAt: "2023-11-01T08:30:00Z",
    updatedAt: "2023-11-21T09:15:00Z",
    contributors: [
      {
        memberName: "Lisa Wong",
        repoName: "mobile-app",
        commits: 55,
        linesAdded: 2300,
        linesRemoved: 600,
        pullRequests: 15,
        lastCommit: "5 hours ago"
      },
      {
        memberName: "James Wilson",
        repoName: "mobile-app",
        commits: 32,
        linesAdded: 1400,
        linesRemoved: 350,
        pullRequests: 9,
        lastCommit: "2 days ago"
      }
    ]
  }
};

// Function to simulate API fetch
const fetchPlaygroundData = async (id: string) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockPlaygroundDatabase[id as keyof typeof mockPlaygroundDatabase] || {
    name: `Playground ${id}`,
    description: "No description available",
    visibility: "private",
    tags: [],
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    contributors: [
      {
        memberName: "No contributors",
        repoName: "unknown-repo",
        commits: 0,
        linesAdded: 0,
        linesRemoved: 0,
        pullRequests: 0,
        lastCommit: "Never"
      }
    ]
  };
};

export const Route = createFileRoute('/user/_layout/playground/$id')({
  component: PlaygroundDetail,
});

function PlaygroundDetail() {
  const { id } = Route.useParams();
  const [playgroundData, setPlaygroundData] = useState<{
    name: string;
    description: string;
    visibility: string;
    tags: string[];
    isFeatured: boolean;
    createdAt: string;
    updatedAt: string;
    contributors: Array<{
      memberName: string;
      repoName: string;
      commits: number;
      linesAdded: number;
      linesRemoved: number;
      pullRequests: number;
      lastCommit: string;
    }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchPlaygroundData(id);
        setPlaygroundData(data);
      } catch (error) {
        setError("Failed to load playground data");
        console.log(error)
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!playgroundData) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Playground Not Found</h1>
        <p>The requested playground could not be loaded.</p>
      </div>
    );
  }

  // Calculate totals for the summary cards
  const totals = {
    contributors: playgroundData.contributors.length,
    commits: playgroundData.contributors.reduce((sum, contributor) => sum + contributor.commits, 0),
    linesChanged: playgroundData.contributors.reduce((sum, contributor) => sum + contributor.linesAdded + contributor.linesRemoved, 0),
    pullRequests: playgroundData.contributors.reduce((sum, contributor) => sum + contributor.pullRequests, 0)
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{playgroundData.name} Analytics</h1>

      {/* Playground Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="w-6 h-6" />
                  <span>{playgroundData.name}</span>
                </CardTitle>
                <CardDescription>{playgroundData.description}</CardDescription>
              </div>
              {playgroundData.isFeatured && (
                <Badge variant="secondary" className="flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="flex items-center">
                {playgroundData.visibility === "public" ? (
                  <>
                    <Eye className="w-4 h-4 mr-1" />
                    Public
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4 mr-1" />
                    Private
                  </>
                )}
              </Badge>

              {playgroundData.tags.map(tag => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}

              <Badge variant="outline" className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Created: {new Date(playgroundData.createdAt).toLocaleDateString()}
              </Badge>

              <Badge variant="outline" className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Updated: {new Date(playgroundData.updatedAt).toLocaleDateString()}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contributors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.contributors}</div>
            <p className="text-xs text-muted-foreground">Working on {playgroundData.contributors[0]?.repoName}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commits</CardTitle>
            <GitCommit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.commits}</div>
            <p className="text-xs text-muted-foreground">Across all branches</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lines Changed</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.linesChanged}</div>
            <p className="text-xs text-muted-foreground">
              (+{playgroundData.contributors.reduce((sum, c) => sum + c.linesAdded, 0)} / 
              -{playgroundData.contributors.reduce((sum, c) => sum + c.linesRemoved, 0)})
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pull Requests</CardTitle>
            <GitPullRequest className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.pullRequests}</div>
            <p className="text-xs text-muted-foreground">Merged to main</p>
          </CardContent>
        </Card>
      </div>

      {/* Contributor Table */}
      <Card>
        <CardHeader>
          <CardTitle>Contributor Statistics</CardTitle>
          <CardDescription>
            Detailed contribution metrics for {playgroundData.contributors[0]?.repoName || 'this playground'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Member</TableHead>
                <TableHead>Repository</TableHead>
                <TableHead className="text-right">Commits</TableHead>
                <TableHead className="text-right">Lines (+/-)</TableHead>
                <TableHead className="text-right">PRs</TableHead>
                <TableHead>Last Activity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {playgroundData.contributors.map((contributor) => (
                <TableRow key={contributor.memberName}>
                  <TableCell className="font-medium">{contributor.memberName}</TableCell>
                  <TableCell>{contributor.repoName}</TableCell>
                  <TableCell className="text-right">{contributor.commits}</TableCell>
                  <TableCell className="text-right">
                    <span className="text-green-600">+{contributor.linesAdded}</span>{' '}
                    <span className="text-red-600">-{contributor.linesRemoved}</span>
                  </TableCell>
                  <TableCell className="text-right">{contributor.pullRequests}</TableCell>
                  <TableCell>{contributor.lastCommit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}