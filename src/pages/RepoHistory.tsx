import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { ArrowLeft, Clock, GitBranch } from "lucide-react";

// Mock data - in a real app, this would come from an API
const mockRepoHistory = [
  {
    id: "repo-1",
    name: "my-react-app",
    url: "https://github.com/user/my-react-app",
    lastScanned: "2024-01-15T10:30:00Z",
    scanCount: 5,
  },
  {
    id: "repo-2", 
    name: "backend-api",
    url: "https://github.com/user/backend-api",
    lastScanned: "2024-01-10T14:20:00Z",
    scanCount: 3,
  },
  {
    id: "repo-3",
    name: "mobile-app",
    url: "https://github.com/user/mobile-app", 
    lastScanned: "2024-01-08T09:15:00Z",
    scanCount: 8,
  },
];

export default function RepoHistory() {
  const navigate = useNavigate();

  const handleRepoClick = (repoId: string) => {
    navigate(`/scan-versions?repo=${repoId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-4xl mx-auto">
        <Header 
          title="Repository History" 
          subtitle="Previously scanned repositories"
        />

        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Scan Setup
          </Button>
        </div>

        <div className="space-y-4">
          {mockRepoHistory.map((repo) => (
            <Card 
              key={repo.id}
              className="card-modern hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => handleRepoClick(repo.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <GitBranch className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{repo.name}</h3>
                      <p className="text-sm text-muted-foreground">{repo.url}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Clock className="w-4 h-4" />
                      Last scanned: {formatDate(repo.lastScanned)}
                    </div>
                    <div className="text-sm font-medium">
                      {repo.scanCount} scan{repo.scanCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {mockRepoHistory.length === 0 && (
          <Card className="card-modern">
            <CardContent className="p-12 text-center">
              <GitBranch className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No scan history</h3>
              <p className="text-muted-foreground mb-6">
                You haven't scanned any repositories yet.
              </p>
              <Button onClick={() => navigate('/')}>
                Start Your First Scan
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}