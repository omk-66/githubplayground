// src/routes/user/_layout/playground/$id.tsx
import { createFileRoute } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Code, Clock, Eye, EyeOff, Star } from "lucide-react";
import { usePlaygroundStore } from "@/store/playground.store";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute('/user/_layout/playground/$id')({
  component: PlaygroundDetail,
});

function PlaygroundDetail() {
  const { id } = Route.useParams();
  const { playgrounds, loading, error, fetchPlaygrounds } = usePlaygroundStore();
  const playground = playgrounds[Number(id)];

  useEffect(() => {
    if (!playground) {
      fetchPlaygrounds(String(id));
    }
  }, [id, playground, fetchPlaygrounds]);

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

  if (!playground) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Playground Not Found</h1>
        <p>The requested playground could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Playground Details</h1>

      {/* Playground Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="w-6 h-6" />
                  <span>{playground.name}</span>
                </CardTitle>
                <CardDescription>{playground.description}</CardDescription>
              </div>
              {playground.isFeatured && (
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
                {playground.visibility === "public" ? (
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

              {playground.tags.map(tag => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}

              <Badge variant="outline" className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Created: {new Date(playground.createdAt).toLocaleDateString()}
              </Badge>

              <Badge variant="outline" className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Updated: {new Date(playground.updatedAt).toLocaleDateString()}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ... rest of your detail page ... */}
    </div>
  );
}