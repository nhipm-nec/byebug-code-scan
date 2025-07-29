import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, GitBranch, Star, Lock } from "lucide-react";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  stargazers_count: number;
  description?: string;
}

interface RepoSelectorProps {
  selectedRepo: string | null;
  onRepoSelect: (repo: string) => void;
}

export const RepoSelector = ({ selectedRepo, onRepoSelect }: RepoSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRepositories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/codex/github');
      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }
      const data = await response.json();
      setRepositories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRepo = () => {
    setIsOpen(true);
    if (repositories.length === 0) {
      fetchRepositories();
    }
  };

  const handleSelectRepo = (repoName: string) => {
    onRepoSelect(repoName);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="lg" 
          onClick={handleOpenRepo}
          className="w-full justify-start hover-lift"
        >
          <GitBranch className="w-4 h-4 mr-2" />
          {selectedRepo || "Select Repository"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            Select Repository
          </DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading repositories...
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-destructive mb-2">Error loading repositories</div>
            <div className="text-sm text-muted-foreground mb-4">{error}</div>
            <Button onClick={fetchRepositories} variant="outline">
              Try Again
            </Button>
          </div>
        ) : (
          <ScrollArea className="max-h-96">
            <div className="space-y-2">
              {repositories.map((repo) => (
                <div
                  key={repo.id}
                  onClick={() => handleSelectRepo(repo.full_name)}
                  className="p-4 rounded-lg border hover:bg-accent hover:text-accent-foreground cursor-pointer hover-lift"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{repo.name}</span>
                        {repo.private && <Lock className="w-3 h-3 text-muted-foreground" />}
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {repo.full_name}
                      </div>
                      {repo.description && (
                        <div className="text-sm text-muted-foreground">
                          {repo.description}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="w-3 h-3" />
                      {repo.stargazers_count}
                    </div>
                  </div>
                </div>
              ))}
              
              {repositories.length === 0 && !loading && (
                <div className="text-center py-8 text-muted-foreground">
                  No repositories found
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};